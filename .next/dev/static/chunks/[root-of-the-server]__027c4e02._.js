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
const API_BASE = ("TURBOPACK compile-time value", "http://192.168.0.127:8080/ords/lms");
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
    getHomeConfig: ()=>api.get('/v1/konzeptes/config')
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/index.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import { useState, useEffect } from 'react';
// import { apiService } from '../utils/apiService'; // Centralized API service
// import Swal from 'sweetalert2';
// import Intro from 'konzeptes/Intro';
// import './login.css';
// export default function HomeView() {
//   const [isSignup, setIsSignup] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   // Login Form States
//   const [loginEmail, setLoginEmail] = useState('');
//   const [loginPassword, setLoginPassword] = useState('');
//   // Register Form States
//   const [regSalutation, setRegSalutation] = useState('');
//   const [regParentName, setRegParentName] = useState('');
//   const [regChildName, setRegChildName] = useState('');
//   const [regLevel, setRegLevel] = useState('');
//   const [regMobile, setRegMobile] = useState('');
//   const [regEmail, setRegEmail] = useState('');
//   const [regPassword, setRegPassword] = useState('');
//   // 🔐 Check login state ONCE on mount
//   useEffect(() => {
//     const loggedIn = localStorage.getItem('isLoggedIn');
//     if (loggedIn === 'true') {
//       setIsLoggedIn(true);
//     }
//   }, []);
//   // ================= VALIDATION LOGIC =================
//   const validatePassword = (password) => {
//     const regex =
//       /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]\\;':,.\/?]).{1,16}$/;
//     return regex.test(password);
//   };
//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   const validateMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);
//   // ================= LOGIN HANDLER =================
//   async function handleLogin(e) {
//     e.preventDefault();
//     // 1. Validation
//     if (!validatePassword(loginPassword)) {
//       Swal.fire({
//         icon: 'error',
//         text: 'Password must contain uppercase, lowercase, number & special character',
//       });
//       return;
//     }
//     try {
//       // 2. Call Centralized apiService
//       const response = await apiService.login({
//         email: loginEmail,
//         password: loginPassword,
//       });
//       const data = response.data; // Axios automatically parses JSON
//       console.log('Login API Response:', data);
//       // 3. Logic Check (ORDS sometimes sends success status even for failed logic)
//       const isActuallyFailure =
//         data.status === 'error' ||
//         (data.message && data.message.toLowerCase().includes('fail')) ||
//         (data.message && data.message.toLowerCase().includes('invalid'));
//       if (isActuallyFailure) {
//         Swal.fire({ icon: 'error', text: data.message || 'Login Failed' });
//         return;
//       }
//       // 4. Handle Success
//       const uid = data.user_id || data.USER_ID;
//       if (uid) {
//         localStorage.setItem('user_id', uid.toString());
//         localStorage.setItem('user_email', loginEmail);
//         localStorage.setItem('isLoggedIn', 'true');
//         localStorage.removeItem('mcq_guest_id');
//         localStorage.setItem(
//           'child_name',
//           data.child_name || data.user || 'Student'
//         );
//         // This await ensures the popup stays on the login page until "OK" is clicked
//         await Swal.fire({
//           icon: 'success',
//           text: 'Login Successfully!',
//           showConfirmButton: true,
//           confirmButtonText: 'OK',
//           confirmButtonColor: '#007bff', // Blue background
//         });
//         setIsLoggedIn(true);
//       } else {
//         Swal.fire({
//           icon: 'error',
//           text: 'Critical Error: User ID missing from server',
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       const errorMsg = error.response?.data?.message || 'Server not reachable';
//       Swal.fire({ icon: 'error', text: errorMsg });
//     }
//   }
//   // ================= REGISTER HANDLER =================
//   async function handleRegister(e) {
//     e.preventDefault();
//     if (!validateMobile(regMobile))
//       return Swal.fire({ icon: 'error', text: 'Invalid mobile number' });
//     if (!validateEmail(regEmail))
//       return Swal.fire({ icon: 'error', text: 'Invalid email address' });
//     if (!validatePassword(regPassword))
//       return Swal.fire({ icon: 'error', text: 'Weak Password' });
//     try {
//       // 1. Call Centralized apiService
//       const response = await apiService.register({
//         salutation: regSalutation,
//         parent_name: regParentName,
//         level: regLevel,
//         child_name: regChildName,
//         mobile: regMobile,
//         email: regEmail,
//         password: regPassword,
//       });
//       const data = response.data;
//       // 2. Error Check
//       if (
//         data.status === 'error' ||
//         (data.message && data.message.toLowerCase().includes('exists'))
//       ) {
//         Swal.fire({
//           icon: 'error',
//           text: data.message || 'Registration Failed',
//         });
//         return;
//       }
//       // 3. Success
//       await Swal.fire({
//         icon: 'success',
//         text: 'Account Created Successfully!',
//         showConfirmButton: true,
//         confirmButtonText: 'OK',
//         confirmButtonColor: '#007bff', // Blue background
//       });
//       setIsSignup(false); // Switch to Login view
//     } catch (error) {
//       const errorMsg =
//         error.response?.data?.message || 'Server error during registration';
//       Swal.fire({ icon: 'error', text: errorMsg });
//     }
//   }
//   // ================= RENDER LOGIC =================
//   if (isLoggedIn) return <Intro />;
//   return (
//     <div className="body">
//       <style>{`
//         .error-text { color: #ff4d4f; font-size: 11px; margin-top: 4px; display: block; font-weight: bold; line-height: 1.2; }
//       `}</style>
//       <div className="container">
//         <div className="mascotArea">
//           <img src="/mascot-owl.png" className="mascotImage" alt="Mascot" />
//         </div>
//         <div
//           className={isSignup ? 'formCard registerCard' : 'formCard loginCard'}
//         >
//           {/* LOGIN VIEW */}
//           {!isSignup && (
//             <div>
//               <div className="loginIcon">
//                 <img
//                   src="/lms-system/img/konzeptes/logo.png"
//                   className="loginIconImg"
//                   alt="Logo"
//                 />
//               </div>
//               <h2 className="title">𝚕𝚘𝚐𝚒𝚗</h2>
//               <form onSubmit={handleLogin}>
//                 <div className="inputGroup">
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     required
//                     value={loginEmail}
//                     onChange={(e) => setLoginEmail(e.target.value)}
//                   />
//                 </div>
//                 <div className="passwordWrapper">
//                   <input
//                     type="password"
//                     id="loginPassword"
//                     placeholder="Password"
//                     required
//                     maxLength={16}
//                     className="passwordInput"
//                     value={loginPassword}
//                     onChange={(e) => setLoginPassword(e.target.value)}
//                   />
//                   <span
//                     className="toggleEye"
//                     onClick={() => {
//                       const f = document.getElementById('loginPassword');
//                       f.type = f.type === 'password' ? 'text' : 'password';
//                     }}
//                   >
//                     👁️
//                   </span>
//                 </div>
//                 {loginPassword && !validatePassword(loginPassword) && (
//                   <span className="error-text">
//                     ⚠️ Password must contain uppercase, lowercase, number &
//                     special character
//                   </span>
//                 )}
//                 <button className="btn btnGreen" type="submit">
//                   Login
//                 </button>
//                 <button
//                   type="button"
//                   className="linkBtn"
//                   onClick={() => setIsSignup(true)}
//                 >
//                   Create New Account
//                 </button>
//               </form>
//             </div>
//           )}
//           {/* REGISTER VIEW */}
//           {isSignup && (
//             <div>
//               <h2 className="title">Register</h2>
//               <form onSubmit={handleRegister}>
//                 <div className="rowGroup">
//                   <div className="inputGroup">
//                     <label>Salutation *</label>
//                     <select
//                       required
//                       value={regSalutation}
//                       onChange={(e) => setRegSalutation(e.target.value)}
//                     >
//                       <option value="">Select</option>
//                       <option>Mr</option>
//                       <option>Mrs</option>
//                       <option>Ms</option>
//                     </select>
//                   </div>
//                   <div className="inputGroup">
//                     <label>Parent Name *</label>
//                     <input
//                       type="text"
//                       placeholder="Parent Name"
//                       required
//                       value={regParentName}
//                       onChange={(e) => setRegParentName(e.target.value)}
//                     />
//                   </div>
//                 </div>
//                 <div className="rowGroup_1">
//                   <div className="inputGroup">
//                     <label>Level *</label>
//                     <select
//                       required
//                       value={regLevel}
//                       onChange={(e) => setRegLevel(e.target.value)}
//                     >
//                       <option value="">Select </option>
//                       <option value="easy">Easy</option>
//                       <option value="intermediate">Intermediate</option>
//                       <option value="hard">Hard</option>
//                     </select>
//                   </div>
//                   <div className="inputGroup">
//                     <label>Child Name *</label>
//                     <input
//                       type="text"
//                       placeholder="Child Name"
//                       required
//                       value={regChildName}
//                       onChange={(e) => setRegChildName(e.target.value)}
//                     />
//                   </div>
//                 </div>
//                 <div className="inputGroup">
//                   <label>Mobile *</label>
//                   <input
//                     type="text"
//                     placeholder="Mobile no"
//                     required
//                     value={regMobile}
//                     onChange={(e) => setRegMobile(e.target.value)}
//                   />
//                 </div>
//                 <div className="inputGroup">
//                   <label>Email *</label>
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     required
//                     value={regEmail}
//                     onChange={(e) => setRegEmail(e.target.value)}
//                   />
//                 </div>
//                 <div className="inputGroup">
//                   <label>Password *</label>
//                   <input
//                     type="password"
//                     required
//                     maxLength={16}
//                     placeholder="Password"
//                     value={regPassword}
//                     onChange={(e) => setRegPassword(e.target.value)}
//                   />
//                 </div>
//                 <button className="btn btnGreen" type="submit">
//                   Sign Up
//                 </button>
//                 <button
//                   type="button"
//                   className="linkBtn"
//                   onClick={() => setIsSignup(false)}
//                 >
//                   Back to Login
//                 </button>
//               </form>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>HomeView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sweetalert2/dist/sweetalert2.all.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/apiService.js [client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../components/konzeptes/Intro'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
    // Unified Form State
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        email: '',
        password: '',
        salutation: '',
        p_first: '',
        p_last: '',
        c_first: '',
        c_last: '',
        level: '',
        mobile: ''
    });
    // Check login on load
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomeView.useEffect": ()=>{
            const loggedIn = localStorage.getItem('isLoggedIn');
            if (loggedIn === 'true') {
                setIsLoggedIn(true);
            }
        }
    }["HomeView.useEffect"], []);
    const handleChange = (e)=>{
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };
    const handleAuth = async (e)=>{
        e.preventDefault();
        try {
            const action = isSignup ? __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].register : __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].login;
            // Map frontend state to backend expected keys
            const payload = isSignup ? {
                salutation: form.salutation,
                p_first_name: form.p_first,
                p_last_name: form.p_last,
                c_first_name: form.c_first,
                c_last_name: form.c_last,
                level: form.level,
                mobile: form.mobile,
                email: form.email,
                password: form.password
            } : {
                email: form.email,
                password: form.password
            };
            const { data } = await action(payload);
            if (data.status === 'success') {
                if (isSignup) {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Account Created! Please Login.'
                    });
                    setIsSignup(false);
                } else {
                    localStorage.setItem('user_id', data.user_id);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('child_name', data.child_name || 'Student');
                    setIsLoggedIn(true);
                }
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.message || 'Error occurred'
                });
            }
        } catch (err) {
            console.error(err);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
                icon: 'error',
                title: 'Connection Error',
                text: 'Server is not responding'
            });
        }
    };
    // If logged in, show the Dashboard/Intro
    if (isLoggedIn) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Intro, {}, void 0, false, {
        fileName: "[project]/pages/index.js",
        lineNumber: 441,
        columnNumber: 26
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "auth-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                    children: [
                        isSignup ? 'Register' : 'Login',
                        " | Konzeptes"
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/index.js",
                    lineNumber: 446,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 445,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `auth-card ${isSignup ? 'register-mode' : ''}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "logo-section",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/lms-system/img/konzeptes/logo.png",
                            alt: "Konzeptes Logo",
                            className: "auth-logo"
                        }, void 0, false, {
                            fileName: "[project]/pages/index.js",
                            lineNumber: 451,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 450,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "auth-title",
                        children: isSignup ? 'Create Account' : 'Welcome Back'
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 458,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleAuth,
                        className: "auth-form",
                        children: [
                            isSignup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "registration-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        name: "salutation",
                                        required: true,
                                        value: form.salutation,
                                        onChange: handleChange,
                                        className: "span-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Title"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 473,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                children: "Mr."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 474,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                children: "Mrs."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 475,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                children: "Ms."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 476,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 466,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        name: "p_first",
                                        placeholder: "Parent First Name",
                                        required: true,
                                        value: form.p_first,
                                        onChange: handleChange,
                                        className: "span-4"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 478,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        name: "p_last",
                                        placeholder: "Parent Last Name",
                                        required: true,
                                        value: form.p_last,
                                        onChange: handleChange,
                                        className: "span-5"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 486,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        name: "c_first",
                                        placeholder: "Child First Name",
                                        required: true,
                                        value: form.c_first,
                                        onChange: handleChange,
                                        className: "span-6"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 496,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        name: "c_last",
                                        placeholder: "Child Last Name",
                                        required: true,
                                        value: form.c_last,
                                        onChange: handleChange,
                                        className: "span-6"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 504,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        name: "level",
                                        required: true,
                                        value: form.level,
                                        onChange: handleChange,
                                        className: "span-5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Select Level"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 521,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "easy",
                                                children: "Easy"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 522,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "intermediate",
                                                children: "Intermediate"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 523,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "hard",
                                                children: "Hard"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 524,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 514,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        name: "mobile",
                                        placeholder: "Mobile Number",
                                        required: true,
                                        value: form.mobile,
                                        onChange: handleChange,
                                        className: "span-7"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 526,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 464,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "email",
                                type: "email",
                                placeholder: "Email Address",
                                className: "full-input",
                                required: true,
                                value: form.email,
                                onChange: handleChange
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 538,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "password-wrapper",
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
                                        lineNumber: 549,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "password-toggle",
                                        onClick: ()=>setShowPass(!showPass),
                                        children: showPass ? '🔒' : '👁️'
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 557,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 548,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "auth-submit-btn",
                                children: isSignup ? 'Sign Up' : 'Login'
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 565,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "auth-switch",
                                onClick: ()=>setIsSignup(!isSignup),
                                children: isSignup ? 'Already have an account? Login' : "Don't have an account? Create one"
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 569,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 462,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 449,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/index.js",
        lineNumber: 444,
        columnNumber: 5
    }, this);
}
_s(HomeView, "Scmtf433GN27VGWPHSAFOkCMTmI=");
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

//# sourceMappingURL=%5Broot-of-the-server%5D__027c4e02._.js.map