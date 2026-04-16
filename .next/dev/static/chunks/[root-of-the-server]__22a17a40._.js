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
"[project]/comps/UserDropdown.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import React, { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/router';
// export default function UserDropdown() {
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);
//   const [childName, setChildName] = useState('');
//   const dropdownRef = useRef(null);
//   // 1. Get Name on Load
//   useEffect(() => {
//     const storedName = localStorage.getItem('child_name');
//     if (storedName) {
//       setChildName(storedName);
//     }
//     // Close dropdown if clicking outside
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);
//   // 2. Logout Logic
//   const handleLogout = async () => {
//     const email = localStorage.getItem('user_email');
//     if (email) {
//       try {
//         await fetch('http://192.168.0.127:8080/ords/lms/exit_api/logout', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email: email }),
//         });
//       } catch (err) {
//         console.error('Logout error:', err);
//       }
//     }
//     localStorage.clear(); // Clear all storage
//     window.location.href = '/lms-system';
//   };
//   const goHome = () => {
//     router.push('/home');
//     setIsOpen(false);
//   };
//   // If no name is loaded yet, render nothing to prevent flickering
//   if (!childName) return null;
//   return (
//     <div ref={dropdownRef} className="user-dropdown-container">
//       {/* --- CSS STYLES --- */}
//       <style jsx>{`
//         .user-dropdown-container {
//           position: fixed;
//           top: 20px;
//           right: 20px;
//           z-index: 2000;
//           font-family:
//             -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
//             Arial, sans-serif;
//         }
//         /* --- TRIGGER BUTTON --- */
//         .dropdown-trigger {
//           background-color: white;
//           border: 1px solid #2b7d10; /* Brand Green */
//           color: #2b7d10;
//           padding: 5px 16px 5px 5px; /* Spacing for avatar */
//           border-radius: 50px; /* Full Pill Shape */
//           cursor: pointer;
//           font-weight: 600;
//           font-size: 14px;
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
//           transition: all 0.2s ease;
//           user-select: none;
//         }
//         .dropdown-trigger:hover {
//           box-shadow: 0 4px 8px rgba(43, 125, 16, 0.15);
//           transform: translateY(-1px);
//         }
//         /* Avatar Circle */
//         .avatar {
//           width: 30px;
//           height: 30px;
//           background-color: #2b7d10; /* Solid Brand Green */
//           color: white;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 14px;
//           font-weight: 700;
//         }
//         .arrow {
//           font-size: 10px;
//           transition: transform 0.2s ease;
//         }
//         .arrow.open {
//           transform: rotate(180deg);
//         }
//         /* --- DROPDOWN MENU --- */
//         .dropdown-menu {
//           position: absolute;
//           top: 45px; /* Just below the trigger */
//           right: 0;
//           background: white;
//           border-radius: 12px;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
//           width: 160px;
//           overflow: hidden;
//           animation: slideDown 0.2s ease-out;
//           border: 1px solid #f0f0f0;
//         }
//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-8px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .menu-item {
//           padding: 12px 16px;
//           cursor: pointer;
//           color: #444;
//           font-size: 14px;
//           font-weight: 500;
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           transition: background 0.15s;
//         }
//         .menu-item:hover {
//           background-color: #f7f9f7; /* Very light green */
//           color: #2b7d10;
//         }
//         /* Separator line between items */
//         .menu-item + .menu-item {
//           border-top: 1px solid #f5f5f5;
//         }
//         .menu-item.logout {
//           color: #e74c3c;
//         }
//         .menu-item.logout:hover {
//           background-color: #fff5f5; /* Light red hover */
//         }
//         /* SVG Icon styling */
//         .icon {
//           width: 18px;
//           height: 18px;
//           stroke-width: 2;
//         }
//       `}</style>
//       {/* --- UI ELEMENTS --- */}
//       <div className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
//         <div className="avatar">{childName.charAt(0).toUpperCase()}</div>
//         <span>{childName}</span>
//         <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
//       </div>
//       {isOpen && (
//         <div className="dropdown-menu">
//           {/* HOME OPTION */}
//           <div className="menu-item" onClick={goHome}>
//             <svg
//               className="icon"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
//               <polyline points="9 22 9 12 15 12 15 22"></polyline>
//             </svg>
//             Home
//           </div>
//           {/* LOGOUT OPTION */}
//           <div className="menu-item logout" onClick={handleLogout}>
//             <svg
//               className="icon"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
//               <polyline points="16 17 21 12 16 7"></polyline>
//               <line x1="21" y1="12" x2="9" y2="12"></line>
//             </svg>
//             Logout
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>UserDropdown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function UserDropdown() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [childName, setChildName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const timerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // const startTimer = () => {
    //   if (timerRef.current) clearTimeout(timerRef.current);
    //   timerRef.current = setTimeout(() => {
    //     setIsVisible(false);
    //     setIsOpen(false);
    //   }, 5000);
    // };
    const startTimer = ()=>{
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(()=>{
        // setIsVisible(false); // <--- COMMENT THIS LINE to stop the icon from disappearing
        // setIsOpen(false);    // <--- COMMENT THIS LINE if you also want the menu to stay open
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
    const handleLogout = async ()=>{
        const email = localStorage.getItem('user_email');
        if (email) {
            try {
                await fetch('http://192.168.0.127:8080/ords/lms/exit_api/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email
                    })
                });
            } catch (err) {
                console.error('Logout error:', err);
            }
        }
        localStorage.clear();
        window.location.href = '/lms-system';
    };
    // const handlePillClick = () => {
    //   // Prevent opening the menu if the component is currently invisible
    //   if (!isVisible) return;
    //   setIsOpen(!isOpen);
    // };
    const handlePillClick = ()=>{
        // Prevent opening the menu if the component is currently invisible
        // if (!isVisible) return; // <--- COMMENT THIS LINE
        setIsOpen(!isOpen);
    };
    if (!childName) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
        className: "jsx-2a1b334bf3e9ef58" + " " + "user-nav-wrapper",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "2a1b334bf3e9ef58",
                children: ".user-nav-wrapper.jsx-2a1b334bf3e9ef58{z-index:2000;flex-direction:column;align-items:flex-end;margin:-15px;padding:15px;font-family:Quicksand,sans-serif;display:flex;position:fixed;top:20px;right:25px}.trigger-pill.jsx-2a1b334bf3e9ef58{cursor:pointer;white-space:nowrap;background:#fff;border:2px solid #2b7d10;border-radius:50px;justify-content:flex-start;align-items:center;min-width:44px;max-width:44px;height:44px;padding:2px;transition:max-width .5s,padding .5s,box-shadow .5s;display:flex;overflow:hidden;box-shadow:0 4px 12px #00000014}.trigger-pill.jsx-2a1b334bf3e9ef58:hover{max-width:250px;padding-right:15px;box-shadow:0 6px 15px #2b7d1033}.avatar-circle.jsx-2a1b334bf3e9ef58{color:#fff;background:#2b7d10;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;width:36px;height:36px;font-size:16px;font-weight:700;display:flex}.name-and-icon.jsx-2a1b334bf3e9ef58{opacity:0;align-items:center;margin-left:10px;transition:opacity .4s;display:flex}.trigger-pill.jsx-2a1b334bf3e9ef58:hover .name-and-icon.jsx-2a1b334bf3e9ef58{opacity:1}.user-name.jsx-2a1b334bf3e9ef58{color:#2b7d10;margin-right:8px;font-size:16px;font-weight:700}.dropdown-arrow.jsx-2a1b334bf3e9ef58{color:#2b7d10;width:18px;height:18px;transition:transform .3s}.dropdown-arrow.open.jsx-2a1b334bf3e9ef58{transform:rotate(180deg)}.modern-menu.jsx-2a1b334bf3e9ef58{transform-origin:100% 0;background:#fff;border:1px solid #eef2ee;border-radius:16px;width:160px;margin-top:10px;padding:6px;animation:.3s forwards menuGrow;overflow:hidden;box-shadow:0 10px 25px #0000001a}@keyframes menuGrow{0%{opacity:0;transform:scale(.95)translateY(-5px)}to{opacity:1;transform:scale(1)translateY(0)}}.menu-item.jsx-2a1b334bf3e9ef58{cursor:pointer;color:#444;border-radius:10px;align-items:center;gap:10px;padding:10px 12px;font-size:14px;font-weight:600;transition:all .2s;display:flex}.menu-item.jsx-2a1b334bf3e9ef58:hover{color:#2b7d10;background:#f0f7ef}.menu-item.logout.jsx-2a1b334bf3e9ef58{color:#e74c3c}.menu-item.logout.jsx-2a1b334bf3e9ef58:hover{background:#fff5f5}.icon-sm.jsx-2a1b334bf3e9ef58{width:18px;height:18px}"
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: handlePillClick,
                className: "jsx-2a1b334bf3e9ef58" + " " + "trigger-pill",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-2a1b334bf3e9ef58" + " " + "avatar-circle",
                        children: childName.charAt(0).toUpperCase()
                    }, void 0, false, {
                        fileName: "[project]/comps/UserDropdown.js",
                        lineNumber: 462,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-2a1b334bf3e9ef58" + " " + "name-and-icon",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-2a1b334bf3e9ef58" + " " + "user-name",
                                children: childName
                            }, void 0, false, {
                                fileName: "[project]/comps/UserDropdown.js",
                                lineNumber: 464,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 20 20",
                                fill: "currentColor",
                                className: "jsx-2a1b334bf3e9ef58" + " " + `dropdown-arrow ${isOpen ? 'open' : ''}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    fillRule: "evenodd",
                                    d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
                                    clipRule: "evenodd",
                                    className: "jsx-2a1b334bf3e9ef58"
                                }, void 0, false, {
                                    fileName: "[project]/comps/UserDropdown.js",
                                    lineNumber: 470,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/comps/UserDropdown.js",
                                lineNumber: 465,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/UserDropdown.js",
                        lineNumber: 463,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/comps/UserDropdown.js",
                lineNumber: 461,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-2a1b334bf3e9ef58" + " " + "modern-menu",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>router.push('/home'),
                        className: "jsx-2a1b334bf3e9ef58" + " " + "menu-item home-item",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2.5",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                className: "jsx-2a1b334bf3e9ef58" + " " + "icon-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
                                        className: "jsx-2a1b334bf3e9ef58"
                                    }, void 0, false, {
                                        fileName: "[project]/comps/UserDropdown.js",
                                        lineNumber: 534,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                        points: "9 22 9 12 15 12 15 22",
                                        className: "jsx-2a1b334bf3e9ef58"
                                    }, void 0, false, {
                                        fileName: "[project]/comps/UserDropdown.js",
                                        lineNumber: 535,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/UserDropdown.js",
                                lineNumber: 525,
                                columnNumber: 13
                            }, this),
                            "Home"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/UserDropdown.js",
                        lineNumber: 521,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: handleLogout,
                        className: "jsx-2a1b334bf3e9ef58" + " " + "menu-item logout",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2.5",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                className: "jsx-2a1b334bf3e9ef58" + " " + "icon-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
                                        className: "jsx-2a1b334bf3e9ef58"
                                    }, void 0, false, {
                                        fileName: "[project]/comps/UserDropdown.js",
                                        lineNumber: 551,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                        points: "16 17 21 12 16 7",
                                        className: "jsx-2a1b334bf3e9ef58"
                                    }, void 0, false, {
                                        fileName: "[project]/comps/UserDropdown.js",
                                        lineNumber: 552,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "21",
                                        y1: "12",
                                        x2: "9",
                                        y2: "12",
                                        className: "jsx-2a1b334bf3e9ef58"
                                    }, void 0, false, {
                                        fileName: "[project]/comps/UserDropdown.js",
                                        lineNumber: 553,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/UserDropdown.js",
                                lineNumber: 542,
                                columnNumber: 13
                            }, this),
                            "Logout"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/UserDropdown.js",
                        lineNumber: 541,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/comps/UserDropdown.js",
                lineNumber: 519,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/comps/UserDropdown.js",
        lineNumber: 302,
        columnNumber: 5
    }, this);
}
_s(UserDropdown, "ZGw4DNm+NG1LspTcLWQggh+e8JQ=", false, function() {
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

////
__turbopack_context__.s([
    "default",
    ()=>HomeView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sweetalert2/dist/sweetalert2.all.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$konzeptes$2f$Intro$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/konzeptes/Intro.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function HomeView() {
    _s();
    const [isSignup, setIsSignup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoggedIn, setIsLoggedIn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // --- State for Real-time Input Tracking ---
    const [loginEmail, setLoginEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loginPassword, setLoginPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Register Form States
    const [regSalutation, setRegSalutation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [regParentName, setRegParentName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [regChildName, setRegChildName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [regLevel, setRegLevel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [regMobile, setRegMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [regEmail, setRegEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [regPassword, setRegPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    // 🔐 Check login state ONCE
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomeView.useEffect": ()=>{
            const loggedIn = localStorage.getItem('isLoggedIn');
            if (loggedIn === 'true') {
                setIsLoggedIn(true);
            }
        }
    }["HomeView.useEffect"], []);
    // ================= VALIDATION LOGIC =================
    function validatePassword(password) {
        // Regex: At least 1 Upper, 1 Lower, 1 Number, 1 Special Char, Max 16 chars
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]\\;':,.\/?]).{1,16}$/;
        return regex.test(password);
    }
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function validateMobile(mobile) {
        return /^[6-9]\d{9}$/.test(mobile);
    }
    // ================= LOGIN HANDLER =================
    async function handleLogin(e) {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/ords/lms/v2/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword
                })
            });
            const data = await res.json();
            console.log('Login API Raw Data:', data); // Check this on the LOGIN PAGE console
            if (data.status === 'success') {
                // FIX: Handle potential case sensitivity from Oracle
                const uid = data.user_id || data.USER_ID;
                if (uid) {
                    localStorage.setItem('user_id', uid.toString());
                    localStorage.setItem('user_email', loginEmail);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('child_name', data.child_name || data.user || 'Student');
                    setIsLoggedIn(true);
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                        icon: 'error',
                        text: 'Critical Error: User ID not received from server'
                    });
                }
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                    icon: 'error',
                    text: data.message || 'Login Failed'
                });
            }
        } catch (error) {
            console.error(error);
        }
        const email = loginEmail;
        const password = loginPassword;
        // 1. Client-side Check
        if (!validatePassword(password)) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'error',
                text: 'Password must contain uppercase, lowercase, number & special character'
            });
            return;
        }
        try {
            const res = await fetch(// 'http://192.168.0.127:8080/ords/lms/auth/login',
            'http://192.168.0.127:8080/ords/lms/v2/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const data = await res.json();
            console.log('DEBUG: Data from Oracle:', data);
            // 🛑 BUG FIX: Check for "Fake 200 OK" or explicit error messages
            const isFailure = !res.ok || data.message && data.message.toLowerCase().includes('invalid') || data.message && data.message.toLowerCase().includes('fail') || data.message && data.message.toLowerCase().includes('incorrect');
            if (isFailure) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                    icon: 'error',
                    text: data.message || 'Invalid Email or Password'
                });
                return; // ⛔ STOP HERE
            }
            // ✅ SUCCESS
            await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'success',
                text: data.message || 'Login Successfully!'
            });
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('user_email', email);
            localStorage.removeItem('mcq_guest_id');
            localStorage.setItem('isLoggedIn', 'true');
            // 👇 KEY UPDATE: SAVE CHILD NAME FROM API 👇
            if (data.child_name) {
                localStorage.setItem('child_name', data.child_name);
            } else if (data.user) {
                // Fallback to parent name if child name is missing
                localStorage.setItem('child_name', data.user);
            } else {
                localStorage.setItem('child_name', 'Student');
            }
            setIsLoggedIn(true);
        } catch (error) {
            console.error(error);
            await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'error',
                text: 'Server not reachable'
            });
        }
    }
    // ================= REGISTER HANDLER =================
    async function handleRegister(e) {
        e.preventDefault();
        if (!validateMobile(regMobile)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'error',
                text: 'Invalid mobile number'
            });
            return;
        }
        if (!validateEmail(regEmail)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'error',
                text: 'Invalid email address'
            });
            return;
        }
        if (!validatePassword(regPassword)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'error',
                text: 'Password must contain uppercase, lowercase, number & special character'
            });
            return;
        }
        try {
            const res = await fetch('http://192.168.0.127:8080/ords/lms/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    salutation: regSalutation,
                    parent_name: regParentName,
                    level: regLevel,
                    child_name: regChildName,
                    mobile: regMobile,
                    email: regEmail,
                    password: regPassword
                })
            });
            const data = await res.json();
            // 🛑 FIX: Check for "error" status or specific messages inside the data
            const isFailure = !res.ok || data.status === 'error' || data.message && data.message.toLowerCase().includes('exists');
            if (isFailure) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                    icon: 'error',
                    text: data.message || 'Registration Failed'
                });
                return; // Stop here!
            }
            // ✅ SUCCESS
            await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'success',
                text: 'Account Created Successfully!'
            });
            setIsSignup(false);
        } catch  {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'error',
                text: 'Server not reachable'
            });
        }
    }
    // ================= LMS AFTER LOGIN =================
    // if (isLoggedIn) {
    //   // Added inline CSS here to scale the Intro page to 90%
    //   return (
    //     <div style={{ zoom: '0.9' }}>
    //       <Intro />
    //     </div>
    //   );
    // }
    // ================= LMS AFTER LOGIN =================
    if (isLoggedIn) {
        // Removed the zoom hack, the new Intro.js handles scaling naturally!
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$konzeptes$2f$Intro$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/pages/index.js",
            lineNumber: 238,
            columnNumber: 12
        }, this);
    }
    // ================= LOGIN / REGISTER UI =================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "body",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        .error-text {
          color: #ff4d4f; /* Red color */
          font-size: 11px;
          margin-top: 4px;
          display: block;
          font-weight: bold;
          line-height: 1.2;
        }
      `
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 245,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mascotArea",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/mascot-owl.png",
                            className: "mascotImage",
                            alt: "Mascot"
                        }, void 0, false, {
                            fileName: "[project]/pages/index.js",
                            lineNumber: 258,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 257,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: isSignup ? 'formCard registerCard' : 'formCard loginCard',
                        children: [
                            !isSignup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "loginIcon",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: "/lms-system/img/konzeptes/logo.png",
                                            className: "loginIconImg",
                                            alt: "Logo"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/index.js",
                                            lineNumber: 268,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 267,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "title",
                                        children: "𝚕𝚘𝚐𝚒𝚗"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 276,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleLogin,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "inputGroup",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "email",
                                                    placeholder: "Email",
                                                    required: true,
                                                    value: loginEmail,
                                                    onChange: (e)=>setLoginEmail(e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 280,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 279,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "passwordWrapper",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "password",
                                                        id: "loginPassword",
                                                        placeholder: "Password",
                                                        required: true,
                                                        maxLength: 16,
                                                        className: "passwordInput",
                                                        value: loginPassword,
                                                        onChange: (e)=>setLoginPassword(e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 290,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "toggleEye",
                                                        onClick: (event)=>{
                                                            const field = document.getElementById('loginPassword');
                                                            const icon = event.target;
                                                            if (field.type === 'password') {
                                                                field.type = 'text';
                                                                icon.textContent = '🙈';
                                                            } else {
                                                                field.type = 'password';
                                                                icon.textContent = '👁️';
                                                            }
                                                        },
                                                        children: "👁️"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 300,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 289,
                                                columnNumber: 17
                                            }, this),
                                            loginPassword && !validatePassword(loginPassword) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "error-text",
                                                children: "⚠️ Password must contain uppercase, lowercase, number & special character"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 320,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn btnGreen",
                                                type: "submit",
                                                children: "Login"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 326,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "linkBtn",
                                                onClick: ()=>setIsSignup(true),
                                                children: "Create New Account"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 330,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 278,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 266,
                                columnNumber: 13
                            }, this),
                            isSignup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "title",
                                        children: "Register"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 344,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleRegister,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rowGroup",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "inputGroup",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                children: "Salutation *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 349,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                required: true,
                                                                value: regSalutation,
                                                                onChange: (e)=>setRegSalutation(e.target.value),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: "Select"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 355,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        children: "Mr"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 356,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        children: "Mrs"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 357,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        children: "Ms"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 358,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 350,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 348,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "inputGroup",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                children: "Parent Name *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 363,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                placeholder: "Parent Name",
                                                                required: true,
                                                                value: regParentName,
                                                                onChange: (e)=>setRegParentName(e.target.value)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 364,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 362,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 347,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rowGroup_1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "inputGroup",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                children: "Level *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 375,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                required: true,
                                                                value: regLevel,
                                                                onChange: (e)=>setRegLevel(e.target.value),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: "Select "
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 381,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "easy",
                                                                        children: "Easy"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 382,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "intermediate",
                                                                        children: "Intermediate"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 383,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "hard",
                                                                        children: "Hard"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 384,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 376,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 374,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "inputGroup",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                children: "Child Name *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 388,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                placeholder: "Child Name",
                                                                required: true,
                                                                value: regChildName,
                                                                onChange: (e)=>setRegChildName(e.target.value)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 389,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 387,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 373,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "inputGroup",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Mobile *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 400,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "Mobile no ",
                                                        required: true,
                                                        value: regMobile,
                                                        onChange: (e)=>setRegMobile(e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 401,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 399,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "inputGroup",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Email *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 411,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "email",
                                                        placeholder: "Email",
                                                        required: true,
                                                        value: regEmail,
                                                        onChange: (e)=>setRegEmail(e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 412,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 410,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "inputGroup",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Password *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 422,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "password",
                                                        required: true,
                                                        maxLength: 16,
                                                        placeholder: "Password",
                                                        value: regPassword,
                                                        onChange: (e)=>setRegPassword(e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 423,
                                                        columnNumber: 19
                                                    }, this),
                                                    regPassword && !validatePassword(regPassword) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "error-text",
                                                        children: "⚠️ Password must contain uppercase, lowercase, number & special character"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 433,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 421,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn btnGreen",
                                                type: "submit",
                                                children: "Sign Up"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 440,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "linkBtn",
                                                onClick: ()=>setIsSignup(false),
                                                children: "login to existing account"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 444,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 346,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 343,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 261,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 256,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/index.js",
        lineNumber: 243,
        columnNumber: 5
    }, this);
}
_s(HomeView, "ZX4jvtxM3Ova6SSISw72NXeXxl0=");
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

//# sourceMappingURL=%5Broot-of-the-server%5D__22a17a40._.js.map