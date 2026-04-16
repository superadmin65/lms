(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/utils/apiService.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiService",
    ()=>apiService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
;
// 1. Declare the constant at the top so it's accessible to the whole file
const API_BASE = ("TURBOPACK compile-time value", "http://161.97.84.10:8080/ords/LMS");
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json'
    }
});
const apiService = {
    // --- AUTH ---
    login: (data)=>api.post('/v2/user/login', data),
    register: (data)=>api.post('/v2/user/register', data),
    // --- EXIT / LOGOUT ---
    logout: (data)=>api.post('/exit_api/logout', data),
    // --- MCQ ---
    getMcqProgress: (userId, actId)=>api.get(`/mcq/progress/${userId}/${actId}`, {
            params: {
                t: new Date().getTime()
            }
        }),
    saveMcqProgress: (payload)=>api.post('/mcq/progress', payload),
    completeMcq: (payload)=>api.post('/mcq/complete', payload),
    // --- SPELLING (CompleteWord) ---
    getSpellingProgress: (uid, aid)=>api.get(`/completedword/progress/${uid}/${aid}`),
    saveSpellingProgress: (data)=>api.post('/completedword/progress', data),
    completeSpelling: (data)=>api.post('/completedword/complete', data),
    // --- PLAYLIST / ACTIVITY DATA ---
    getActivityData: (id)=>api.get('/activity/data', {
            params: {
                id
            }
        }),
    // --- IMAGE HELPERS ---
    // This helper generates the dynamic URL for your Oracle images
    getIconUrl: (id)=>`${API_BASE}/v1/konzeptes/image/icon/${id}`,
    // Add this to your apiService.js if not already there
    getBgImageUrl: (id)=>`${API_BASE}/v1/konzeptes/image/bg/${id}`,
    // --- HOME / DASHBOARD CONFIG ---
    getHomeConfig: ()=>api.get('/v1/konzeptes/config'),
    // --- SEQUENCE ---
    getSequenceProgress: (uid, aid)=>api.get(`/sequence/progress/${uid}/${aid}`, {
            params: {
                t: new Date().getTime()
            }
        }),
    saveSequenceProgress: (payload)=>api.post('/sequence/progress', payload),
    completeSequence: (payload)=>api.post('/sequence/complete', payload),
    // --- MATCH BY ---
    getMatchByProgress: (uid, aid)=>api.get(`/matchby/progress/${uid}/${aid}`, {
            params: {
                t: new Date().getTime()
            }
        }),
    saveMatchByProgress: (payload)=>api.post('/matchby/progress', payload),
    completeMatchBy: (payload)=>api.post('/matchby/complete', payload)
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/comps/UserDropdown.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UserDropdown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/apiService.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sweetalert2/dist/sweetalert2.all.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
function UserDropdown() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [childName, setChildName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showToast, setShowToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const timerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const startTimer = ()=>{
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(()=>{
        // setIsVisible(false);
        }, 5000);
    };
    const stopTimer = ()=>{
        if (timerRef.current) clearTimeout(timerRef.current);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserDropdown.useEffect": ()=>{
            const storedName = localStorage.getItem('child_name');
            if (storedName) setChildName(storedName);
            startTimer();
            function handleClickOutside(event) {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            }
            document.addEventListener('mousedown', handleClickOutside);
            return ({
                "UserDropdown.useEffect": ()=>{
                    document.removeEventListener('mousedown', handleClickOutside);
                    stopTimer();
                }
            })["UserDropdown.useEffect"];
        }
    }["UserDropdown.useEffect"], []);
    // 1. Trigger the customized SweetAlert popup
    // const triggerLogout = () => {
    //   setIsOpen(false);
    //   Swal.fire({
    //     showConfirmButton: false,
    //     showCancelButton: false,
    //     html: `
    //       <div style="font-family: 'Quicksand', sans-serif;">
    //         <div style="display:flex; justify-content:center; margin-bottom: 15px;">
    //            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#2b7d10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    //               <circle cx="12" cy="12" r="10"></circle>
    //               <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    //               <line x1="12" y1="17" x2="12.01" y2="17"></line>
    //            </svg>
    //         </div>
    //         <h3 style="margin:0; font-size:22px; color:#2b7d10; font-weight:700;">Leaving so soon?</h3>
    //         <p style="font-size:15px; margin: 10px 0 25px 0; color:#555; line-height: 1.4;">Are you sure you want to end your learning adventure for today?</p>
    //         <div style="display:flex; gap: 15px; justify-content: center;">
    //            <button id="swal-keep-playing" style="
    //               background-color: white;
    //               color: #2b7d10;
    //               border: 2px solid #2b7d10;
    //               padding: 10px 24px;
    //               border-radius: 8px;
    //               font-family: 'Quicksand', sans-serif;
    //               font-weight: 700;
    //               font-size: 14px;
    //               cursor: pointer;
    //               transition: 0.2s;
    //               min-width: 140px;
    //            ">Keep Playing</button>
    //            <button id="swal-yes-logout" style="
    //               background-color: #2b7d10;
    //               color: white;
    //               border: 2px solid #2b7d10;
    //               padding: 10px 24px;
    //               border-radius: 8px;
    //               font-family: 'Quicksand', sans-serif;
    //               font-weight: 700;
    //               font-size: 14px;
    //               cursor: pointer;
    //               transition: 0.2s;
    //               min-width: 140px;
    //            ">Yes, Log Out</button>
    //         </div>
    //       </div>
    //     `,
    //     width: '420px',
    //     padding: '30px',
    //     background: '#ffffff',
    //     backdrop: 'rgba(0, 0, 0, 0.4)',
    //     customClass: {
    //       popup: 'custom-swal-shape',
    //     },
    //     didOpen: () => {
    //       const keepPlayingBtn = document.getElementById('swal-keep-playing');
    //       const logoutBtn = document.getElementById('swal-yes-logout');
    //       keepPlayingBtn.onmouseover = () =>
    //         (keepPlayingBtn.style.backgroundColor = '#f0f7ef');
    //       keepPlayingBtn.onmouseout = () =>
    //         (keepPlayingBtn.style.backgroundColor = 'white');
    //       logoutBtn.onmouseover = () =>
    //         (logoutBtn.style.backgroundColor = '#205c0c');
    //       logoutBtn.onmouseout = () =>
    //         (logoutBtn.style.backgroundColor = '#2b7d10');
    //       keepPlayingBtn.addEventListener('click', () => Swal.close());
    //       logoutBtn.addEventListener('click', () => {
    //         Swal.close();
    //         executeLogout();
    //       });
    //     },
    //   });
    // };
    // 1. Trigger the customized SweetAlert popup
    const triggerLogout = ()=>{
        setIsOpen(false);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
            showConfirmButton: false,
            showCancelButton: false,
            html: `
        <div style="font-family: 'Quicksand', sans-serif; text-align: center; padding: 10px 0;">


          <div style="width: 70px; height: 70px; border: 3px solid #2b7d10; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
             <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#2b7d10" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
             </svg>
          </div>

          <h3 style="margin: 0 0 8px; font-size: 20px; color: #2b7d10; font-weight: 700;">Leaving so soon?</h3>
          <p style="font-size: 15px; margin: 0 0 22px 0; color: #555;">Are you sure you want to log out?</p>

          <div style="display:flex; gap: 12px; justify-content: center;">
             <button id="swal-keep-playing" style="
                background-color: white;
                color: #2b7d10;
                border: 2px solid #2b7d10;
                padding: 10px 0;
                border-radius: 8px;
                font-family: 'Quicksand', sans-serif;
                font-weight: 700;
                font-size: 14px;
                cursor: pointer;
                transition: 0.2s;
                flex: 1;
                outline: none;
             ">Cancel</button>

             <button id="swal-yes-logout" style="
                background-color: #2b7d10;
                color: white;
                border: 2px solid #2b7d10;
                padding: 10px 0;
                border-radius: 8px;
                font-family: 'Quicksand', sans-serif;
                font-weight: 700;
                font-size: 14px;
                cursor: pointer;
                transition: 0.2s;
                flex: 1;
                outline: none;
             ">Log Out</button>
          </div>
        </div>
      `,
            width: '360px',
            padding: '20px',
            background: '#f4f9f4',
            backdrop: 'rgba(0, 0, 0, 0.7)',
            customClass: {
                popup: 'custom-swal-shape',
                backdrop: 'custom-blur-backdrop'
            },
            didOpen: ()=>{
                const keepPlayingBtn = document.getElementById('swal-keep-playing');
                const logoutBtn = document.getElementById('swal-yes-logout');
                keepPlayingBtn.onmouseover = ()=>keepPlayingBtn.style.backgroundColor = '#eaf3ea';
                keepPlayingBtn.onmouseout = ()=>keepPlayingBtn.style.backgroundColor = 'white';
                logoutBtn.onmouseover = ()=>logoutBtn.style.backgroundColor = '#1e5c0b';
                logoutBtn.onmouseout = ()=>logoutBtn.style.backgroundColor = '#2b7d10';
                keepPlayingBtn.addEventListener('click', ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].close());
                logoutBtn.addEventListener('click', ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].close();
                    executeLogout();
                });
            }
        });
    };
    const executeLogout = async ()=>{
        // 1. Show the toast immediately
        setShowToast(true);
        const email = localStorage.getItem('user_email');
        if (email) {
            try {
                // 2. Await the API call
                await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].logout({
                    email: email
                });
            } catch (err) {
                console.error('Logout error:', err);
            }
        }
        // 3. Clear local storage
        localStorage.clear();
        // 4. Redirect much faster! Changed from 2000 to 600
        setTimeout(()=>{
            // window.location.href forces a hard browser redirect/refresh
            window.location.href = '/lms-system';
        }, 600);
    };
    const handlePillClick = ()=>{
        setIsOpen(!isOpen);
    };
    if (!childName) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "3e64c0959a811f7e",
                children: ".custom-swal-shape{border:1px solid #eef2ee!important;border-radius:16px!important}.custom-blur-backdrop{-webkit-backdrop-filter:blur(10px)!important;background:#00000073!important}"
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "8d56bbe9a0d68cad",
                children: ".user-nav-wrapper.jsx-3f79fcbfb2c8024b{z-index:2000;flex-direction:column;align-items:flex-end;margin:-15px;padding:15px;font-family:Quicksand,sans-serif;display:flex;position:fixed;top:20px;right:25px}.trigger-pill.jsx-3f79fcbfb2c8024b{cursor:pointer;white-space:nowrap;background:#fff;border:2px solid #2b7d10;border-radius:50px;justify-content:flex-start;align-items:center;min-width:44px;max-width:44px;height:44px;padding:2px;transition:max-width .5s,padding .5s,box-shadow .5s;display:flex;overflow:hidden;box-shadow:0 4px 12px #00000014}.trigger-pill.jsx-3f79fcbfb2c8024b:hover{max-width:250px;padding-right:15px;box-shadow:0 6px 15px #2b7d1033}.avatar-circle.jsx-3f79fcbfb2c8024b{color:#fff;background:#2b7d10;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;width:36px;height:36px;font-size:16px;font-weight:700;display:flex}.name-and-icon.jsx-3f79fcbfb2c8024b{opacity:0;align-items:center;margin-left:10px;transition:opacity .4s;display:flex}.trigger-pill.jsx-3f79fcbfb2c8024b:hover .name-and-icon.jsx-3f79fcbfb2c8024b{opacity:1}.user-name.jsx-3f79fcbfb2c8024b{color:#2b7d10;margin-right:8px;font-size:16px;font-weight:700}.dropdown-arrow.jsx-3f79fcbfb2c8024b{color:#2b7d10;width:18px;height:18px;transition:transform .3s}.dropdown-arrow.open.jsx-3f79fcbfb2c8024b{transform:rotate(180deg)}.modern-menu.jsx-3f79fcbfb2c8024b{transform-origin:100% 0;background:#fff;border:1px solid #eef2ee;border-radius:16px;width:160px;margin-top:10px;padding:6px;animation:.3s forwards menuGrow;overflow:hidden;box-shadow:0 10px 25px #0000001a}@keyframes menuGrow{0%{opacity:0;transform:scale(.95)translateY(-5px)}to{opacity:1;transform:scale(1)translateY(0)}}.menu-item.jsx-3f79fcbfb2c8024b{cursor:pointer;color:#444;border-radius:10px;align-items:center;gap:10px;padding:10px 12px;font-size:14px;font-weight:600;transition:all .2s;display:flex}.menu-item.jsx-3f79fcbfb2c8024b:hover{color:#2b7d10;background:#f0f7ef}.menu-item.logout.jsx-3f79fcbfb2c8024b{color:#e74c3c}.menu-item.logout.jsx-3f79fcbfb2c8024b:hover{background:#fff5f5}.icon-sm.jsx-3f79fcbfb2c8024b{width:18px;height:18px}.toast-slide.jsx-3f79fcbfb2c8024b{animation:.3s ease-out forwards slideDown}@keyframes slideDown{0%{opacity:0;transform:translate(-50%,-20px)}to{opacity:1;transform:translate(-50%)}}"
            }, void 0, false, void 0, this),
            showToast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    backgroundColor: '#6ebc64',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    zIndex: 4000,
                    fontFamily: "'Quicksand', sans-serif",
                    fontWeight: '600',
                    fontSize: '14px'
                },
                className: "jsx-3f79fcbfb2c8024b" + " " + "toast-slide",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "18",
                        height: "18",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "3",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        className: "jsx-3f79fcbfb2c8024b",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                            points: "20 6 9 17 4 12",
                            className: "jsx-3f79fcbfb2c8024b"
                        }, void 0, false, {
                            fileName: "[project]/comps/UserDropdown.js",
                            lineNumber: 447,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/comps/UserDropdown.js",
                        lineNumber: 437,
                        columnNumber: 11
                    }, this),
                    "Logged out successfully !"
                ]
            }, void 0, true, {
                fileName: "[project]/comps/UserDropdown.js",
                lineNumber: 417,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: dropdownRef,
                onMouseEnter: ()=>{
                    setIsVisible(true);
                    stopTimer();
                },
                onMouseLeave: startTimer,
                style: {
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.6s ease-in-out'
                },
                className: "jsx-3f79fcbfb2c8024b" + " " + "user-nav-wrapper",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: handlePillClick,
                        className: "jsx-3f79fcbfb2c8024b" + " " + "trigger-pill",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-3f79fcbfb2c8024b" + " " + "avatar-circle",
                                children: childName.charAt(0).toUpperCase()
                            }, void 0, false, {
                                fileName: "[project]/comps/UserDropdown.js",
                                lineNumber: 468,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-3f79fcbfb2c8024b" + " " + "name-and-icon",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-3f79fcbfb2c8024b" + " " + "user-name",
                                        children: childName.trim().split(' ')[0]
                                    }, void 0, false, {
                                        fileName: "[project]/comps/UserDropdown.js",
                                        lineNumber: 473,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        viewBox: "0 0 20 20",
                                        fill: "currentColor",
                                        className: "jsx-3f79fcbfb2c8024b" + " " + `dropdown-arrow ${isOpen ? 'open' : ''}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fillRule: "evenodd",
                                            d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
                                            clipRule: "evenodd",
                                            className: "jsx-3f79fcbfb2c8024b"
                                        }, void 0, false, {
                                            fileName: "[project]/comps/UserDropdown.js",
                                            lineNumber: 479,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/comps/UserDropdown.js",
                                        lineNumber: 474,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/UserDropdown.js",
                                lineNumber: 471,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/UserDropdown.js",
                        lineNumber: 467,
                        columnNumber: 9
                    }, this),
                    isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-3f79fcbfb2c8024b" + " " + "modern-menu",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>router.push('/home'),
                                className: "jsx-3f79fcbfb2c8024b" + " " + "menu-item home-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2.5",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        className: "jsx-3f79fcbfb2c8024b" + " " + "icon-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
                                                className: "jsx-3f79fcbfb2c8024b"
                                            }, void 0, false, {
                                                fileName: "[project]/comps/UserDropdown.js",
                                                lineNumber: 503,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                points: "9 22 9 12 15 12 15 22",
                                                className: "jsx-3f79fcbfb2c8024b"
                                            }, void 0, false, {
                                                fileName: "[project]/comps/UserDropdown.js",
                                                lineNumber: 504,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/comps/UserDropdown.js",
                                        lineNumber: 494,
                                        columnNumber: 15
                                    }, this),
                                    "Home"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/UserDropdown.js",
                                lineNumber: 490,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: triggerLogout,
                                className: "jsx-3f79fcbfb2c8024b" + " " + "menu-item logout",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2.5",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        className: "jsx-3f79fcbfb2c8024b" + " " + "icon-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
                                                className: "jsx-3f79fcbfb2c8024b"
                                            }, void 0, false, {
                                                fileName: "[project]/comps/UserDropdown.js",
                                                lineNumber: 519,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                points: "16 17 21 12 16 7",
                                                className: "jsx-3f79fcbfb2c8024b"
                                            }, void 0, false, {
                                                fileName: "[project]/comps/UserDropdown.js",
                                                lineNumber: 520,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "21",
                                                y1: "12",
                                                x2: "9",
                                                y2: "12",
                                                className: "jsx-3f79fcbfb2c8024b"
                                            }, void 0, false, {
                                                fileName: "[project]/comps/UserDropdown.js",
                                                lineNumber: 521,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/comps/UserDropdown.js",
                                        lineNumber: 510,
                                        columnNumber: 15
                                    }, this),
                                    "Logout"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/UserDropdown.js",
                                lineNumber: 509,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/UserDropdown.js",
                        lineNumber: 489,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/comps/UserDropdown.js",
                lineNumber: 454,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(UserDropdown, "M/SOAu7gwJki7JvdLohd0WNrN+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = UserDropdown;
var _c;
__turbopack_context__.k.register(_c, "UserDropdown");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/konzeptes/Intro.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import styled from 'styled-components';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import UserDropdown from 'comps/UserDropdown'; // 👈 1. IMPORT DROPDOWN
// const Styled = styled.div`
//   background-color: var(--l);
//   min-height: 100vh;
//   .wrap {
//     padding: 20px;
//     width: 1100px;
//     margin: 0 auto;
//     background-color: white;
//     position: relative;
//   }
//   .mascot {
//     margin: 0 auto;
//   }
//   .imgIcon {
//     position: absolute;
//     color: #dbf7c3;
//   }
//   h1 {
//     font-family: var(--font1);
//     font-weight: bold;
//     font-size: 3.53rem;
//     text-align: center;
//     margin-top: 80px;
//     color: #2b7d10;
//     line-height: 1;
//   }
//   .tagline {
//     font-weight: bold;
//     text-align: center;
//     font-size: 1.1rem;
//     font-family: var(--font2);
//     color: var(--h2);
//   }
//   .actionBtn {
//     font-size: 2rem;
//     background-color: var(--h2);
//     margin: 10px 10px 10px auto;
//     padding: 5px 20px;
//     border-radius: 10px;
//     overflow: visible;
//     position: absolute;
//     right: 20px;
//     bottom: 20px;
//     color: white;
//     cursor: pointer;
//     border: 0px solid white;
//     box-shadow: var(--shadow3);
//     text-decoration: none;
//   }
// `;
// var bgList = [
//   {
//     id: 'icon1.png',
//     pos: [
//       { x: 450, y: 30 },
//       { x: 110, y: 220 },
//       { x: 920, y: 450 },
//     ],
//   },
//   {
//     id: 'icon2.png',
//     pos: [
//       { x: 50, y: 100 },
//       { x: 950, y: 100 },
//       { x: 270, y: 320 },
//     ],
//   },
//   {
//     id: 'icon3.png',
//     pos: [
//       { x: 700, y: 20 },
//       { x: 700, y: 350 },
//       { x: 40, y: 350 },
//     ],
//   },
//   {
//     id: 'icon4.png',
//     pos: [
//       { x: 830, y: 250 },
//       { x: 20, y: 550 },
//     ],
//   },
//   {
//     id: 'icon5.png',
//     pos: [
//       { x: 950, y: 310 },
//       { x: 170, y: 450 },
//     ],
//   },
//   {
//     id: 'icon6.png',
//     pos: [
//       { x: 250, y: 80 },
//       { x: 750, y: 500 },
//       { x: 350, y: 500 },
//     ],
//   },
// ];
// export default function Intro(props) {
//   const router = useRouter();
//   const basePath = router.basePath || '';
//   return (
//     <Styled>
//       <div className="wrap">
//         {/* 🟢 2. ADD USER DROPDOWN HERE */}
//         <UserDropdown />
//         <div style={{ position: 'relative' }}>
//           {bgList.map((item) => (
//             <>
//               {item.pos.map((p) => (
//                 <img
//                   key={`${item.id}-${p.x}-${p.y}`}
//                   className="imgIcon"
//                   src={`${basePath}/kon/${item.id}`}
//                   alt=""
//                   style={{ top: p.y, left: p.x }}
//                 />
//               ))}
//             </>
//           ))}
//         </div>
//         <div style={{ zIndex: 1, position: 'relative' }}>
//           <img src={`${basePath}/img/konzeptes/logo.png`} alt="logo" />
//           <header>
//             <h1 style={{ fontWeight: 'bold' }}>WELCOME TO KONZEPTES!</h1>
//             <p className="tagline">
//               Explore our learning modules and improve your language skills.
//             </p>
//           </header>
//           <img
//             className="mascot"
//             src={`${basePath}/img/konzeptes/kea.png`}
//             alt="mascot"
//           />
//           <Link className="actionBtn" href="/home">
//             Let&apos;s Go
//           </Link>
//         </div>
//       </div>
//     </Styled>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>Intro
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$UserDropdown$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/UserDropdown.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
// Gentle floating animation for the mascot to make it feel alive
const float = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["keyframes"]`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;
const Styled = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].div.withConfig({
    displayName: "Intro__Styled",
    componentId: "sc-9610e352-0"
})`
  background-color: #faf0f1;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 0;
  padding: 2rem;
  box-sizing: border-box;

  .wrap {
    width: 100%;
    max-width: 1100px;
    height: 85vh;
    min-height: 600px;
    background-color: white;
    border-radius: 20px; /* Highly modern rounded corners */
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08); /* Deep, soft shadow */
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 40px 50px;
    box-sizing: border-box;
    overflow: hidden;
  }

  /* --- 1. Top Bar --- */
  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    z-index: 20;
  }

  .logo-img {
    height: 70px;
    object-fit: contain;
  }

  /* --- 2. Main Center Content --- */
  .center-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
    gap: 1.5rem; /* Perfect spacing between text and mascot */
  }

  h1 {
    font-family: var(--font1, 'Arial', sans-serif);
    font-weight: 900;
    font-size: clamp(2.5rem, 4.5vw, 4rem);
    color: #2b7d10;
    line-height: 1.1;
    margin: 0;
    text-align: center;
    letter-spacing: -1px;
    text-shadow: 2px 2px 0px rgba(43, 125, 16, 0.05);
  }

  .tagline {
    font-weight: 700;
    font-size: clamp(1.1rem, 2vw, 1.4rem);
    font-family: var(--font2, 'Arial', sans-serif);
    color: #00b4d8;
    margin: 0;
    text-align: center;
  }

  .mascot {
    height: 40vh;
    max-height: 380px;
    object-fit: contain;
    filter: drop-shadow(0 15px 20px rgba(0, 0, 0, 0.15));
    animation: ${float} 4s ease-in-out infinite;
    z-index: 10;
  }

  /* --- 3. Bottom Button Area --- */
  .bottom-row {
    display: flex;
    justify-content: flex-end; /* Keeps button on the right */
    align-items: flex-end;
    width: 100%;
    z-index: 20;
    padding-top: 20px;
  }

  // .actionBtn {
  //   font-size: 1.5rem;
  //   font-family: var(--font1, sans-serif);
  //   font-weight: bold;
  //   background: linear-gradient(135deg, #00b4d8, #0077b6);
  //   color: white;
  //   padding: 15px 50px;
  //   border-radius: 16px; /* Modern slightly-rounded square */
  //   text-decoration: none;
  //   box-shadow: 0 10px 25px rgba(0, 119, 182, 0.3);
  //   transition: all 0.3s ease;
  //   border: none;
  //   cursor: pointer;
  // }

  // .actionBtn:hover {
  //   transform: translateY(-5px);
  //   box-shadow: 0 15px 30px rgba(0, 119, 182, 0.45);
  //   background: linear-gradient(135deg, #00c4e8, #0096c7);
  // }
  .actionBtn {
    font-size: 1.25rem; /* Reduced from 1.5rem for a cleaner look */
    font-family: var(--font1, sans-serif);
    font-weight: bold;
    background: linear-gradient(135deg, #00b4d8, #0077b6);
    color: white;
    padding: 6px 20px; /* Tighter padding so it's less bulky */
    border-radius: 12px; /* Slightly tighter rounded corners */
    text-decoration: none;
    box-shadow: 0 6px 18px rgba(0, 119, 182, 0.25); /* Softer, smaller shadow */
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }

  .actionBtn:hover {
    transform: translateY(-3px); /* Slightly subtler lift */
    box-shadow: 0 10px 22px rgba(0, 119, 182, 0.4);
    background: linear-gradient(135deg, #00c4e8, #0096c7);
  }

  /* --- 4. Background Icons --- */
  .bg-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  .imgIcon {
    position: absolute;
    opacity: 0.8; /* 👈 Brought the opacity back up so they are clearly visible! */
    transform: scale(
      0.9
    ); /* Scales them down slightly so they don't look cramped */
  }
`;
_c = Styled;
var bgList = [
    {
        id: 'icon1.png',
        pos: [
            {
                x: 450,
                y: 30
            },
            {
                x: 110,
                y: 220
            },
            {
                x: 920,
                y: 450
            }
        ]
    },
    {
        id: 'icon2.png',
        pos: [
            {
                x: 50,
                y: 100
            },
            {
                x: 950,
                y: 100
            },
            {
                x: 270,
                y: 320
            }
        ]
    },
    {
        id: 'icon3.png',
        pos: [
            {
                x: 700,
                y: 20
            },
            {
                x: 700,
                y: 350
            },
            {
                x: 40,
                y: 350
            }
        ]
    },
    {
        id: 'icon4.png',
        pos: [
            {
                x: 830,
                y: 250
            },
            {
                x: 20,
                y: 550
            }
        ]
    },
    {
        id: 'icon5.png',
        pos: [
            {
                x: 950,
                y: 310
            },
            {
                x: 170,
                y: 450
            }
        ]
    },
    {
        id: 'icon6.png',
        pos: [
            {
                x: 250,
                y: 80
            },
            {
                x: 750,
                y: 500
            },
            {
                x: 350,
                y: 500
            }
        ]
    }
];
function Intro(props) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const basePath = router.basePath || '';
    // Converts your original coordinates into responsive percentages
    const getResponsivePos = (x, y)=>{
        return {
            left: `${x / 1100 * 100}%`,
            top: `${y / 700 * 100}%`
        };
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Styled, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "wrap",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$UserDropdown$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/konzeptes/Intro.js",
                    lineNumber: 391,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-container",
                    children: bgList.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: item.pos.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    className: "imgIcon",
                                    src: `${basePath}/kon/${item.id}`,
                                    alt: "",
                                    style: getResponsivePos(p.x, p.y)
                                }, `${item.id}-${p.x}-${p.y}`, false, {
                                    fileName: "[project]/konzeptes/Intro.js",
                                    lineNumber: 398,
                                    columnNumber: 17
                                }, this))
                        }, item.id, false, {
                            fileName: "[project]/konzeptes/Intro.js",
                            lineNumber: 396,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/konzeptes/Intro.js",
                    lineNumber: 394,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "top-row",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        className: "logo-img",
                        src: `${basePath}/img/konzeptes/logo.png`,
                        alt: "logo"
                    }, void 0, false, {
                        fileName: "[project]/konzeptes/Intro.js",
                        lineNumber: 412,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/konzeptes/Intro.js",
                    lineNumber: 411,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "center-content",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    children: "WELCOME TO KONZEPTES!"
                                }, void 0, false, {
                                    fileName: "[project]/konzeptes/Intro.js",
                                    lineNumber: 422,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "tagline",
                                    children: "Explore our learning modules and improve your language skills."
                                }, void 0, false, {
                                    fileName: "[project]/konzeptes/Intro.js",
                                    lineNumber: 423,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/konzeptes/Intro.js",
                            lineNumber: 421,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            className: "mascot",
                            src: `${basePath}/img/konzeptes/kea.png`,
                            alt: "mascot"
                        }, void 0, false, {
                            fileName: "[project]/konzeptes/Intro.js",
                            lineNumber: 428,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/konzeptes/Intro.js",
                    lineNumber: 420,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bottom-row",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        className: "actionBtn",
                        href: "/home",
                        children: "Let's Go"
                    }, void 0, false, {
                        fileName: "[project]/konzeptes/Intro.js",
                        lineNumber: 437,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/konzeptes/Intro.js",
                    lineNumber: 436,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/konzeptes/Intro.js",
            lineNumber: 389,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/konzeptes/Intro.js",
        lineNumber: 388,
        columnNumber: 5
    }, this);
}
_s(Intro, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c1 = Intro;
var _c, _c1;
__turbopack_context__.k.register(_c, "Styled");
__turbopack_context__.k.register(_c1, "Intro");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/index.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomeView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sweetalert2/dist/sweetalert2.all.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/apiService.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$konzeptes$2f$Intro$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/konzeptes/Intro.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [client] (ecmascript) <export default as Mail>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
function HomeView() {
    _s();
    const [isSignup, setIsSignup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoggedIn, setIsLoggedIn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPass, setShowPass] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        email: '',
        password: '',
        salutation: '',
        p_first: '',
        p_last: '',
        c_first: '',
        c_last: '',
        level: '',
        mobile: '',
        package: ''
    });
    // 1. Initial check for logged in status
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomeView.useEffect": ()=>{
            const loggedIn = localStorage.getItem('isLoggedIn');
            if (loggedIn === 'true') setIsLoggedIn(true);
        }
    }["HomeView.useEffect"], []);
    // 2. NEW: Fire the popup AFTER the redirect happens
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomeView.useEffect": ()=>{
            if (isLoggedIn) {
                const showPopup = localStorage.getItem('show_login_popup');
                if (showPopup === 'true') {
                    // Remove the flag so it doesn't show again on manual page reloads
                    localStorage.removeItem('show_login_popup');
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                        html: `
            <div style="padding: 10px; font-family: 'Quicksand', sans-serif;">
              <div style="width: 70px; height: 70px; border: 3px solid #2b7d10; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#2b7d10" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 style="color: #2b7d10; font-size: 18px; font-weight: 600; margin: 0;">Login Success!</h3>
            </div>
          `,
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        buttonsStyling: false,
                        width: '380px',
                        background: '#f4f9f4',
                        backdrop: `rgba(0,0,0,0.7)`,
                        customClass: {
                            popup: 'custom-login-popup',
                            backdrop: 'custom-blur-backdrop',
                            confirmButton: 'custom-login-btn'
                        }
                    });
                }
            }
        }
    }["HomeView.useEffect"], [
        isLoggedIn
    ]);
    const validatePassword = (password)=>{
        return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]\\;':,.\/?]).{1,16}$/.test(password);
    };
    const handleChange = (e)=>setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    // const handleAuth = async (e) => {
    //   e.preventDefault();
    //   if (isSignup && !validatePassword(form.password)) return;
    //   try {
    //     const action = isSignup ? apiService.register : apiService.login;
    //     const payload = isSignup
    //       ? {
    //           salutation: form.salutation,
    //           p_first_name: form.p_first,
    //           p_last_name: form.p_last,
    //           c_first_name: form.c_first,
    //           c_last_name: form.c_last,
    //           level: form.level,
    //           mobile: form.mobile,
    //           email: form.email,
    //           password: form.password,
    //           package_type: form.package,
    //         }
    //       : { email: form.email, password: form.password };
    //     const { data } = await action(payload);
    //     if (data.status === 'success') {
    //       if (isSignup) {
    //         await Swal.fire({
    //           icon: 'success',
    //           title: 'Success!',
    //           text: 'Registration Successful!',
    //           confirmButtonColor: '#33691e',
    //         });
    //         setIsSignup(false);
    //       } else {
    //         // --- CHANGED LOGIC HERE ---
    //         // DO NOT show Swal here. Just set storage and trigger redirect!
    //         localStorage.setItem('user_id', data.user_id);
    //         localStorage.setItem('isLoggedIn', 'true');
    //         localStorage.setItem('child_name', data.child_name || 'Student');
    //         // Set flag for the popup
    //         localStorage.setItem('show_login_popup', 'true');
    //         // Trigger the component switch ("redirect")
    //         setIsLoggedIn(true);
    //       }
    //     } else {
    //       Swal.fire({
    //         icon: 'error',
    //         text: data.message || 'Action Failed',
    //         confirmButtonColor: '#33691e',
    //       });
    //     }
    //   } catch (err) {
    //     Swal.fire({
    //       icon: 'error',
    //       text: 'Server Connection Error',
    //       confirmButtonColor: '#33691e',
    //     });
    //   }
    // };
    const handleAuth = async (e)=>{
        e.preventDefault();
        // 🌟 FIX: Grab exact values directly from the DOM to bypass React's autofill blindspot
        const submitData = new FormData(e.target);
        const actualEmail = submitData.get('email');
        const actualPassword = submitData.get('password');
        // Use actualPassword instead of form.password for validation
        if (isSignup && !validatePassword(actualPassword)) return;
        try {
            const action = isSignup ? __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].register : __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].login;
            // Use actualEmail and actualPassword in the payload instead of state
            const payload = isSignup ? {
                salutation: form.salutation,
                p_first_name: form.p_first,
                p_last_name: form.p_last,
                c_first_name: form.c_first,
                c_last_name: form.c_last,
                level: form.level,
                mobile: form.mobile,
                email: actualEmail,
                password: actualPassword,
                package_type: form.package
            } : {
                email: actualEmail,
                password: actualPassword
            };
            const { data } = await action(payload);
            if (data.status === 'success') {
                if (isSignup) {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Registration Successful!',
                        confirmButtonColor: '#33691e'
                    });
                    setIsSignup(false);
                } else {
                    localStorage.setItem('user_id', data.user_id);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('child_name', data.child_name || 'Student');
                    localStorage.setItem('show_login_popup', 'true');
                    setIsLoggedIn(true);
                }
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                    icon: 'error',
                    text: data.message || 'Action Failed',
                    confirmButtonColor: '#33691e'
                });
            }
        } catch (err) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'error',
                text: 'Server Connection Error',
                confirmButtonColor: '#33691e'
            });
        }
    };
    if (isLoggedIn) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        className: "jsx-dba856f0369eefff",
                        children: "Konzeptes | Learning App 🎓"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 206,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/index.js",
                    lineNumber: 205,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    id: "dba856f0369eefff",
                    children: ".custom-blur-backdrop{-webkit-backdrop-filter:blur(10px)!important;background:#00000073!important}.custom-login-popup{border-radius:16px!important}.custom-login-btn{color:#fff!important;box-shadow:none!important;cursor:pointer!important;background-color:#2b7d10!important;border:none!important;border-radius:8px!important;outline:none!important;margin-top:10px!important;padding:10px 36px!important;font-family:Quicksand,sans-serif!important;font-size:15px!important;font-weight:700!important;transition:all .2s!important}.custom-login-btn:hover,.custom-login-btn:focus{background-color:#1e5c0b!important;outline:none!important;box-shadow:0 4px 12px #2b7d104d!important}"
                }, void 0, false, void 0, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$konzeptes$2f$Intro$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/pages/index.js",
                    lineNumber: 254,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true);
    }
    // ... (Keep the rest of your original return statement with the auth-card-container here) ...
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "auth-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                    children: isSignup ? 'Konzeptes | Register  page ' : 'Konzeptes | Login Page '
                }, void 0, false, {
                    fileName: "[project]/pages/index.js",
                    lineNumber: 263,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 262,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `auth-card-container ${isSignup ? 'register-mode' : 'login-mode'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/lms-system/img/konzeptes/logo.png",
                        className: "auth-logo",
                        alt: "Logo"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 272,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleAuth,
                        className: "auth-form",
                        children: [
                            !isSignup ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "login-section transition-fade",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "auth-title",
                                        children: " Login "
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 281,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "input-with-icon full-width-field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "email",
                                                type: "email",
                                                placeholder: "Email Address",
                                                required: true,
                                                value: form.email,
                                                onChange: handleChange,
                                                autoComplete: "username"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 285,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "input-icon",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                    size: 20
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 295,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 294,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 284,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "password-container full-width-field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "password",
                                                type: showPass ? 'text' : 'password',
                                                placeholder: "Password",
                                                required: true,
                                                value: form.password,
                                                onChange: handleChange,
                                                autoComplete: "current-password"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 301,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "eye-btn",
                                                onClick: ()=>setShowPass(!showPass),
                                                children: showPass ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                    size: 20
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 314,
                                                    columnNumber: 31
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                    size: 20
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 314,
                                                    columnNumber: 51
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 310,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 300,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 280,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "register-section transition-fade",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "auth-title",
                                        children: "Create Account"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 320,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "field-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "group-label",
                                                children: "Parent Details"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 322,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "registration-grid",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        name: "salutation",
                                                        required: true,
                                                        value: form.salutation,
                                                        onChange: handleChange,
                                                        className: "col-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "Title"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 331,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                children: "Mr."
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 332,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                children: "Mrs."
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 333,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                children: "Ms."
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 334,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 324,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        name: "p_first",
                                                        placeholder: "First Name",
                                                        required: true,
                                                        value: form.p_first,
                                                        onChange: handleChange,
                                                        className: "col-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 336,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        name: "p_last",
                                                        placeholder: "Last Name",
                                                        required: true,
                                                        value: form.p_last,
                                                        onChange: handleChange,
                                                        className: "col-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 344,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 323,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 321,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "field-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "group-label",
                                                children: "Student Details"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 355,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "registration-grid",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        name: "c_first",
                                                        placeholder: " First Name",
                                                        required: true,
                                                        value: form.c_first,
                                                        onChange: handleChange,
                                                        className: "col-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 357,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        name: "c_last",
                                                        placeholder: " Last Name",
                                                        required: true,
                                                        value: form.c_last,
                                                        onChange: handleChange,
                                                        className: "col-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 365,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        name: "level",
                                                        required: true,
                                                        value: form.level,
                                                        onChange: handleChange,
                                                        className: "col-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "Level"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 380,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "easy",
                                                                children: "Easy"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 381,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "intermediate",
                                                                children: "Intermediate"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 382,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "hard",
                                                                children: "Hard"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 383,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 373,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 356,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 354,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "field-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "group-label",
                                                children: "Account Information"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 388,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "registration-grid",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        name: "package",
                                                        required: true,
                                                        value: form.package,
                                                        onChange: handleChange,
                                                        className: "col-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "Package"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 397,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "free",
                                                                children: "Free"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 398,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "paid",
                                                                children: "Paid"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 399,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 390,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        name: "mobile",
                                                        placeholder: "Mobile",
                                                        required: true,
                                                        value: form.mobile,
                                                        onChange: handleChange,
                                                        className: "col-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 401,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        name: "email",
                                                        type: "email",
                                                        placeholder: "Email",
                                                        required: true,
                                                        value: form.email,
                                                        onChange: handleChange,
                                                        className: "col-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 409,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-12 password-label-container",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "input-label",
                                                            children: "Password"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/index.js",
                                                            lineNumber: 419,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 418,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "password-container col-12",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                name: "password",
                                                                type: showPass ? 'text' : 'password',
                                                                placeholder: "Password",
                                                                required: true,
                                                                value: form.password,
                                                                onChange: handleChange
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 463,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "eye-btn",
                                                                onClick: ()=>setShowPass(!showPass),
                                                                children: showPass ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                    size: 20
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.js",
                                                                    lineNumber: 475,
                                                                    columnNumber: 35
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                                    size: 20
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.js",
                                                                    lineNumber: 475,
                                                                    columnNumber: 55
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 471,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 462,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 389,
                                                columnNumber: 17
                                            }, this),
                                            form.password && !validatePassword(form.password) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "pass-warning",
                                                children: "⚠️ Password Must have Uppercase, Lowercase, Number & Special Char."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 480,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 387,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 319,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: isSignup ? 'main-submit-btn-register' : 'main-submit-btn',
                                children: isSignup ? 'Register Now' : 'Login !'
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 488,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "toggle-view",
                                onClick: ()=>setIsSignup(!isSignup),
                                children: isSignup ? 'Back to Login' : 'Create New Account'
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 496,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 268,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/index.js",
        lineNumber: 261,
        columnNumber: 5
    }, this);
}
_s(HomeView, "FORRJPBf7G7mOWkb2afS9lDz3Nc=");
_c = HomeView;
var _c;
__turbopack_context__.k.register(_c, "HomeView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/index.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/index.js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/index\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/index.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__96698f76._.js.map