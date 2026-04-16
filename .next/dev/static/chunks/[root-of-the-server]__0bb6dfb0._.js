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
"[project]/utils/index.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "allColors",
    ()=>allColors,
    "delay",
    ()=>delay,
    "generateDataFromPattern",
    ()=>generateDataFromPattern,
    "generateRandomCompare",
    ()=>generateRandomCompare,
    "getAsset",
    ()=>getAsset,
    "getBasePath",
    ()=>getBasePath,
    "getColorArr",
    ()=>getColorArr,
    "getDateStr",
    ()=>getDateStr,
    "getFile",
    ()=>getFile,
    "getFormatedRandom",
    ()=>getFormatedRandom,
    "getImage",
    ()=>getImage,
    "getLocalItem",
    ()=>getLocalItem,
    "getPos",
    ()=>getPos,
    "getRandIndex",
    ()=>getRandIndex,
    "getTimeStr",
    ()=>getTimeStr,
    "inIframe",
    ()=>inIframe,
    "inputStrToArr",
    ()=>inputStrToArr,
    "isSmallScreen",
    ()=>isSmallScreen,
    "isValidEmail",
    ()=>isValidEmail,
    "loadAsset",
    ()=>loadAsset,
    "publicPath",
    ()=>publicPath,
    "removeLocalItem",
    ()=>removeLocalItem,
    "setAttrs",
    ()=>setAttrs,
    "setLocalItem",
    ()=>setLocalItem,
    "setStyles",
    ()=>setStyles,
    "shuffleAll",
    ()=>shuffleAll,
    "toggleDisableBtn",
    ()=>toggleDisableBtn
]);
const allColors = [
    {
        name: 'blue',
        value: '#21b0df'
    },
    /* { name: 'xx', value: '#9843f0' },
  { name: 'xx', value: '#b84be5' },
  { name: 'xx', value: '#ff64db' },*/ {
        name: 'orange',
        value: '#ffa858'
    },
    {
        name: 'yellow',
        value: '#ddc800'
    },
    {
        name: 'violet',
        value: '#9494ff'
    },
    {
        name: 'green',
        value: '#43f0a5'
    },
    {
        name: 'red',
        value: '#ff7f7f'
    },
    {
        name: 'lavender',
        value: '#d165ff'
    },
    {
        name: 'magenta',
        value: '#ff6bdd'
    },
    {
        name: 'gray',
        value: '#a0a0a0'
    },
    {
        name: 'lemon',
        value: '#afea30'
    }
];
function getColorArr(count, colors = allColors) {
    let arr = colors.map((item)=>item.value || item);
    arr.sort(()=>Math.random() - 0.5);
    while(count > arr.length){
        arr = [
            ...arr,
            ...arr
        ];
    }
    return arr.slice(0, count);
}
function inputStrToArr({ text, breakLine }) {
    let arr;
    if (text.indexOf('\n') !== -1) {
        arr = text.split('\n').map((item)=>item.trim()).filter((item)=>item !== '');
    } else {
        arr = text.split(',').map((item)=>item.trim()).filter((item)=>item !== '');
    }
    if (breakLine) {
        if (arr[0].indexOf('|') !== -1) {
            arr = arr.map((line)=>line.split('|').map((item)=>item.trim()).filter((item)=>item !== ''));
        } else {
            arr = arr.map((line)=>line.split(',').map((item)=>item.trim()).filter((item)=>item !== ''));
        }
    }
    return arr;
}
function generateRandomCompare(data, count = 10, isNonNegative, isUnique) {
    let list = [];
    let counter = 0;
    while(list.length < count){
        let pattern = data.pattern;
        pattern = getRepeated(pattern);
        pattern = pattern.split(' ');
        let item = [
            ...pattern
        ];
        for(let k = 0; k < pattern.length; k += 2){
            item[k] = getFormatedRandom(item[k]);
        }
        item = item.join(' ');
        if (isNonNegative) {
            if (eval(item) < 0) {
                continue;
            }
        }
        if (isUnique && counter < 100 && list.indexOf(item) !== -1) {
            continue;
        }
        list.push(item);
        counter++;
    }
    return list;
}
function getRepeated(pattern) {
    let arr = [
        's',
        't',
        'u',
        'v'
    ];
    for(let i = 0; i < arr.length; i++){
        if (pattern.indexOf(arr[i]) !== -1) {
            let rand = Math.ceil(Math.random() * 9);
            pattern = pattern.replaceAll(arr[i], ()=>rand);
        } else {
            return pattern;
        }
    }
    return pattern;
}
function getFormatedRandom(str) {
    let arr = str.split(/(\{\d+_\d+\})/).filter((item)=>item.trim() !== '');
    arr = arr.map((item)=>item.charAt(0) === '{' ? item : item.split(''));
    arr = arr.flat();
    let range = Math.pow(10, arr.length);
    let offset = Math.pow(10, arr.length - 1);
    let no = Math.floor(Math.random() * (range - offset) + offset);
    let nostr = '' + no;
    for(let i = 0; i < arr.length; i++){
        if (arr[i].charAt(0) === '{') {
            let start = +arr[i].substring(1, arr[i].indexOf('_'));
            let end = +arr[i].substring(arr[i].indexOf('_') + 1, arr[i].length - 1);
            arr[i] = Math.round(Math.random() * (end - start)) + start;
        } else {
            switch(arr[i]){
                case 'x':
                    arr[i] = nostr[i];
                    break;
                case 'a':
                    arr[i] = Math.ceil(Math.random() * 4);
                    break;
                case 'b':
                    arr[i] = Math.ceil(Math.random() * 5) + 4;
                    break;
                case 'c':
                    arr[i] = Math.ceil(Math.random() * 5);
                    break;
                default:
                    break;
            }
        }
    }
    let ret = arr.map((no)=>'' + no).join('');
    if (ret.indexOf('.') !== -1 && ret.charAt(nostr.length - 1) === '0') {
        ret = ret.slice(0, ret.length - 1) + Math.ceil(Math.random() * 9);
    }
    return +ret;
}
function getLocalItem(label, defaultVal = []) {
    // 1. STOP if running on the server (Build time)
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // 2. Now it is safe to check for localStorage
    const ls = window.localStorage;
    if (!ls) {
        return defaultVal;
    }
    const data = ls.getItem(label);
    if (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            return defaultVal;
        }
    } else {
        return defaultVal;
    }
}
function setLocalItem(label, value) {
    const ls = localStorage || window.localStorage;
    if (ls) {
        ls.setItem(label, JSON.stringify(value));
    }
}
function removeLocalItem(label) {
    const ls = localStorage || window.localStorage;
    if (ls) {
        ls.removeItem(label);
    }
}
function getRandIndex(item, allowDirectMatch = true) {
    if (item.length) {
        let a = item.map((ques, i)=>{
            let arr = [
                ...Array(ques.options.length)
            ].map((dummy, i)=>i);
            if (!ques.noRandom) {
                if (allowDirectMatch) {
                    arr.sort(()=>Math.random() - 0.5);
                } else {
                    arr = shuffleAll(arr);
                }
            }
            return [
                ...arr
            ];
        });
        return a;
    } else {
        let arr = [
            ...Array(item)
        ].map((dummy, i)=>i);
        if (allowDirectMatch) {
            arr.sort(()=>Math.random() - 0.5);
        } else {
            arr = shuffleAll(arr);
        }
        return [
            ...arr
        ];
    }
}
function shuffleAll(arr) {
    let copy = [
        ...arr
    ];
    let anyLinearMatch;
    while(true){
        copy.sort((a, b)=>Math.random() - 0.5);
        anyLinearMatch = false;
        for(let i = 0; i < arr.length; i++){
            if (arr[i] === copy[i]) {
                anyLinearMatch = true;
                break;
            }
        }
        if (!anyLinearMatch) {
            return copy;
        }
    }
}
const getPos = (e)=>{
    if (e.clientX) {
        return {
            x: e.clientX,
            y: e.clientY
        };
    } else if (e.touches && e.touches[0] && e.touches[0].clientX) {
        if (e.touches.length > 1) return null;
        return {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    } else if (e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientX) {
        if (e.changedTouches.length > 1) return null;
        return {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };
    }
};
function setStyles(dom, obj) {
    for(let i in obj){
        dom.style[i] = obj[i];
    }
}
function getAsset(path) {
    let prefix = 'https://asset.pschool.in';
    if (path.indexOf('http') === 0) {
        return path;
    }
    // let prefix = '/assets';
    return `${prefix}/${path}`;
}
function getBasePath() {
    try {
        if ("TURBOPACK compile-time truthy", 1) {
            // First, try to get from __NEXT_DATA__
            if (window.__NEXT_DATA__ && window.__NEXT_DATA__.basePath) {
                return window.__NEXT_DATA__.basePath;
            }
            // If not available, infer from current pathname
            // If pathname starts with /lms-system, return /lms-system
            const pathname = window.location.pathname || '';
            if (pathname.startsWith('/lms-system')) {
                return '/lms-system';
            }
        }
    } catch (e) {}
    return '';
}
function publicPath(p) {
    if (!p) return p;
    // ensure leading slash
    let path = p.startsWith('/') ? p : '/' + p;
    const bp = getBasePath();
    return bp + path;
}
function getFile(fileName, type) {
    let prefix = 'https://asset.pschool.in';
    //let prefix = '/assets';
    if (!type || type === 'audio') {
        //fileName = fileName.replace(".mp3", ".aac");
        return `${prefix}/sound/${fileName}`;
    }
}
function loadAsset(fileName) {
    if (fileName.indexOf('http') === 0) {
        return fileName;
    }
    let prefix = 'https://asset.pschool.in';
    //let prefix = '/assets';
    let ret = `${prefix}/${fileName}`;
    return ret;
}
function getImage(id, collection) {
    console.log('getImage id', id);
    if (id.indexOf('>') !== -1) {
        id = id.replaceAll('>', '/');
    }
    // Prefer serving images from local public folder so Next.js basePath applies.
    // If an absolute URL is provided, return it unchanged.
    if (id.indexOf('.') === -1) {
        id = `${id}.jpg`;
    }
    if (id.indexOf('http') === 0) {
        return id;
    }
    const prefix = 'https://asset.pschool.in';
    // If collection indicates dragDrop or id contains folder path, map to /img/...
    if (collection === 'dragDrop') {
        if (id.indexOf('/') !== -1) {
            return `/img/${id}`;
        }
        return `/img/dragDrop/${id}`;
    } else if (id.indexOf('/') !== -1) {
        return `/img/${id}`;
    }
    if (collection) {
        return `${prefix}/${collection}/${id}`;
    } else {
        return `${prefix}/stockimg/${id}`;
    }
/*
  if (!collection || collection === 'custom') {
    for (let i = 0; i < allImages.length; i++) {
      const find = allImages[i].list.find((item) => item.id === id);
      if (find) {
        return prefix + find.img;
      }
    }
  } else {
    let group = allImages.find((item) => item.id === collection);
    let img = group.list.find((item) => item.id === id).img;
    return prefix + img;
  }
  */ }
function generateDataFromPattern(data, count = 4) {
    let list = [];
    for(let i = 0; i < 10; i++){
        let arr = [];
        let pattern = data.pattern;
        pattern = getRepeated(pattern);
        pattern = pattern.split(' ');
        let values = [];
        while(arr.length < count){
            let item = [
                ...pattern
            ];
            for(let k = 0; k < pattern.length; k += 2){
                item[k] = getFormatedRandom(item[k]);
            }
            item = item.join(' ');
            let val = eval(item);
            if (val < 0 || values.indexOf(val) !== -1) {
                continue;
            }
            values.push(val);
            arr.push(item);
        }
        arr.sort((a, b)=>data.probType === 'biggest' || data.probType === 'descending' ? eval(b) - eval(a) : eval(a) - eval(b));
        //Rethna: replaceAll not working on older browser
        arr = arr.map((item)=>item.replace('*', '×'));
        arr = arr.map((item)=>item.replace('-', '–'));
        //arr = arr.map((item) => item.replaceAll('/', '÷'));
        const randArr = [
            ...Array(arr.length)
        ].map((dummy, i)=>i);
        randArr.sort(()=>Math.random() - 0.5);
        if (data.probType === 'descending' || data.probType === 'ascending') {
            list.push({
                options: arr,
                randArr
            });
        } else {
            list.push({
                words: arr,
                randArr
            });
        }
    }
    return list;
}
function getTimeStr(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
    if (min <= 9) {
        min = '0' + min;
    }
    if (sec <= 9) {
        sec = '0' + sec;
    }
    return `${min}:${sec}`;
}
function delay(no) {
    return new Promise((resolve)=>setTimeout(()=>resolve('doneFromDelay'), no));
}
function setAttrs(dom, obj) {
    if (!dom) {
        return;
    }
    for(let i in obj){
        dom.setAttribute(i, obj[i]);
    }
}
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function toggleDisableBtn(button, bool) {
    if (bool) {
        button.classList.add('callInProg');
        button.setAttribute('disabled', 'true');
    } else {
        button.classList.remove('callInProg');
        button.removeAttribute('disabled');
    }
}
const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];
function getDateStr(date) {
    if (!date) {
        return null;
    } else if (!isNaN(date)) {
        date = +date;
    }
    const d = new Date(date);
    return `${months[d.getMonth()]} ${d.getDate()}`;
}
function isSmallScreen() {
    if (window.innerWidth < 900) {
        return true;
    } else {
        return false;
    }
}
function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/utils/apiService.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import axios from 'axios';
// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
// export const apiService = {
//   // --- AUTH ---
//   login: (data) => api.post('/v2/user/login', data),
//   register: (data) => api.post('/auth/register', data),
//   // --- MCQ ---
//   getMcqProgress: (userId, actId) =>
//     api.get(`/mcq/progress/${userId}/${actId}?t=${new Date().getTime()}`),
//   saveMcqProgress: (payload) => api.post('/mcq/progress', payload),
//   completeMcq: (payload) => api.post('/mcq/complete', payload),
//   // --- SPELLING (CompleteWord) ---
//   getSpellingProgress: (uid, aid) =>
//     api.get(`/completedword/progress/${uid}/${aid}`),
//   saveSpellingProgress: (data) => api.post('/completedword/progress', data),
//   completeSpelling: (data) => api.post('/completedword/complete', data),
//   // --- PLAYLIST / ACTIVITY DATA ---
//   // Fetches numeric activities from Oracle ORDS
//   getActivityData: (id) => api.get('/activity/data', { params: { id } }),
// };
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
    register: (data)=>api.post('/auth/register', data),
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
    getIconUrl: (id)=>`${API_BASE}/v1/konzeptes/image/icon/${id}`
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/comps/curriculumViews/IconViewMini.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// // // import React, { useState } from 'react';
// // // import styled from 'styled-components';
// // // import Link from 'next/link';
// // // import { getImage, setLocalItem, getLocalItem, publicPath } from 'utils';
// // // import {
// // //   Section,
// // //   Input,
// // //   TextArea,
// // //   Button,
// // //   ButtonBar,
// // //   Select,
// // //   Checkbox,
// // //   Overlay,
// // //   ProgButton,
// // // } from 'base/comps';
// // // const Styled = styled.div`
// // //   padding: 20px;
// // //   // background-color: white;
// // //   color: var(--darkColor);
// // //   position: relative;
// // //   user-select: none;
// // //   margin: 0 auto;
// // //   font-size: var(--font2);
// // //   main {
// // //     max-width: 800px;
// // //   }
// // //   h1 {
// // //     font-size: 1.5rem;
// // //     text-align: center;
// // //     text-decoration: underline;
// // //   }
// // //   .topics {
// // //     display: flex;
// // //     flex-wrap: wrap;
// // //     justify-content: space-around;
// // //   }
// // //   .card {
// // //     display: flex;
// // //     .img {
// // //       background-size: contain;
// // //       background-repeat: no-repeat;
// // //       margin: 0 auto;
// // //     }
// // //     .label,
// // //     .smLabel {
// // //       text-align: center;
// // //     }
// // //     .hoverdesc {
// // //       position: absolute;
// // //       left: -1000px;
// // //       width: 300px;
// // //       background-color: orange;
// // //       padding: 10px;
// // //       border-radius: 10px;
// // //       color: white;
// // //       top: 100px;
// // //       box-shadow: var(--shadow);
// // //       z-index: 1;
// // //     }
// // //     &:hover .hoverdesc {
// // //       /*left: 0;*/
// // //     }
// // //   }
// // //   .infobar {
// // //     margin: -10px;
// // //     padding: 5px 10px 15px 10px;
// // //     font-size: 0.8rem;
// // //     background-color: var(--darkColor2);
// // //     color: white;
// // //     a:hover {
// // //       color: white;
// // //     }
// // //   }
// // //   .descCard {
// // //     display: flex;
// // //     align-items: center;
// // //     .desc {
// // //       max-width: 250px;
// // //       margin-right: 15px;
// // //     }
// // //     .title {
// // //       margin-bottom: 10px;
// // //       font-size: 1.2rem;
// // //     }
// // //   }
// // //   .hilight {
// // //     background-color: var(--darkColor2);
// // //     box-shadow: var(--shadow);
// // //     font-size: 2rem;
// // //     text-align: center;
// // //     margin-bottom: 20px;
// // //     letter-spacing: 2px;
// // //     a {
// // //       color: white;
// // //     }
// // //   }
// // //   .lang-contact {
// // //     font-size: 0.9rem;
// // //   }
// // //   .flex-sb {
// // //     display: flex;
// // //     justify-content: space-around;
// // //   }
// // // `;
// // // const defaultCardStyle = {
// // //   width: 120,
// // //   margin: '25px 0',
// // //   borderRadius: 10,
// // // };
// // // const getIconStyle = (img, data) => {
// // //   let iconStyle = data.iconStyle || {
// // //     width: 80,
// // //     height: 80,
// // //   };
// // //   const imgPath = getImage(`${data.iconsLoc || 'icons'}/${img}.png`);
// // //   const resolveImg = (src) => {
// // //     if (!src) return src;
// // //     if (src.indexOf('http') === 0) return src;
// // //     return publicPath(src.startsWith('/') ? src : `/${src}`);
// // //   };
// // //   iconStyle.backgroundImage = `url(${resolveImg(imgPath)})`;
// // //   return iconStyle;
// // // };
// // // export default function IconView(props) {
// // //   //const {title, menu, onPick} = props;
// // //   let config = getLocalItem('config', {});
// // //   let defaultGrade;
// // //   const data = props.data;
// // //   console.log('props.data IconView', props.data);
// // //   if (data.grades) {
// // //     let defaultItem = data.grades.find((item) => item.default === true);
// // //     if (defaultItem) {
// // //       defaultGrade = defaultItem.id;
// // //     }
// // //   }
// // //   let [state, setState] = useState({
// // //     selectedGrade: config.selectedGrade || defaultGrade,
// // //   });
// // //   let menu = data.list;
// // //   if (data.grades) {
// // //     let matches = state.selectedGrade.match(/(\d+)/);
// // //     let gradeNo = (matches && +matches[0]) || 0;
// // //     menu = menu.filter((item) => {
// // //       if (!item.grade) {
// // //         return false;
// // //       }
// // //       let range = item.grade.split('-').map((no) => +no);
// // //       if (range.length === 1) {
// // //         return range[0] === gradeNo;
// // //       } else {
// // //         return range[0] <= gradeNo && range[1] >= gradeNo;
// // //       }
// // //       //item.grade.indexOf(state.selectedGrade) !== -1
// // //     });
// // //   }
// // //   console.log('data.grades', data.grades);
// // //   const tocConfig = data.config || {};
// // //   return (
// // //     <Styled>
// // //       <main style={data.style || { maxWidth: 1024, fontSize: '1rem' }}>
// // //         <div className="flex-sb">
// // //           {data.label && <h1 style={data.titleStyle || {}}>{data.label}</h1>}
// // //           {data.grades && (
// // //             <Select
// // //               width="150px"
// // //               options={data.grades}
// // //               value={state.selectedGrade}
// // //               bgColor="inherit"
// // //               onChange={(e) => {
// // //                 const cfg = getLocalItem('config', {});
// // //                 cfg.selectedGrade = e.value || e.id;
// // //                 cfg.selectedSubject = 'all';
// // //                 setLocalItem('config', cfg);
// // //                 setState({ ...state, selectedGrade: e.value || e.id });
// // //               }}
// // //             />
// // //           )}
// // //         </div>
// // //         <div className="topics">
// // //           {menu.map((item) => {
// // //             const localStyle = item.style || {};
// // //             let style = data.cardStyle || defaultCardStyle;
// // //             style = { ...style, ...localStyle };
// // //             return (
// // //               <div className="card" style={style} key={item.id}>
// // //                 <Link
// // //                   reload
// // //                   href={`/p/${item.id}` /*`/playlist?id=${item.id}`*/}
// // //                 >
// // //                   {!tocConfig.type && (
// // //                     <>
// // //                       <div
// // //                         className="img"
// // //                         style={{
// // //                           ...getIconStyle(item.img, data),
// // //                           backgroundImage: `url(${(function () {
// // //                             const imgPath = getImage(
// // //                               `${data.iconsLoc || 'icons'}/${item.img}.png`
// // //                             );
// // //                             if (!imgPath) return imgPath;
// // //                             if (imgPath.indexOf('http') === 0) return imgPath;
// // //                             return publicPath(
// // //                               imgPath.startsWith('/') ? imgPath : `/${imgPath}`
// // //                             );
// // //                           })()})`,
// // //                         }}
// // //                       ></div>
// // //                       <div className="label" style={data.labelStyle || {}}>
// // //                         {item.label}
// // //                       </div>
// // //                       {item.smLabel && (
// // //                         <div
// // //                           className="smLabel"
// // //                           style={data.smLabelStyle || {}}
// // //                         >
// // //                           {item.smLabel}
// // //                         </div>
// // //                       )}
// // //                     </>
// // //                   )}
// // //                   {tocConfig.type === 'descType' && (
// // //                     <div className="descCard">
// // //                       <div>
// // //                         <div
// // //                           className="label title"
// // //                           style={data.labelStyle || {}}
// // //                         >
// // //                           {item.label}
// // //                         </div>
// // //                         {item.smLabel && (
// // //                           <div
// // //                             className="smLabel"
// // //                             style={data.smLabelStyle || {}}
// // //                           >
// // //                             {item.smLabel}
// // //                           </div>
// // //                         )}
// // //                         <div className="desc" style={data.descStyle || {}}>
// // //                           {item.desc}
// // //                         </div>
// // //                       </div>
// // //                       <div
// // //                         className="img"
// // //                         style={{
// // //                           ...getIconStyle(item.img, data),
// // //                           backgroundImage: `url(${(function () {
// // //                             const imgPath = getImage(
// // //                               `${data.iconsLoc || 'icons'}/${item.img}.png`
// // //                             );
// // //                             if (!imgPath) return imgPath;
// // //                             if (imgPath.indexOf('http') === 0) return imgPath;
// // //                             return publicPath(
// // //                               imgPath.startsWith('/') ? imgPath : `/${imgPath}`
// // //                             );
// // //                           })()})`,
// // //                         }}
// // //                       ></div>
// // //                     </div>
// // //                   )}
// // //                 </Link>
// // //               </div>
// // //             );
// // //           })}
// // //         </div>
// // //       </main>
// // //       {data.moreActivities && (
// // //         <div className="hilight">
// // //           <div>
// // //             <Link href={`/p/${data.moreActivities}`}>
// // //               {/*<Link href={`/playlist?id=${data.moreActivities}`}> */}
// // //               More Activities
// // //             </Link>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </Styled>
// // //   );
// // // }
// // import React, { useState } from 'react';
// // import styled from 'styled-components';
// // import Link from 'next/link';
// // import { getImage, setLocalItem, getLocalItem, publicPath } from 'utils';
// // import {
// //   Section,
// //   Input,
// //   TextArea,
// //   Button,
// //   ButtonBar,
// //   Select,
// //   Checkbox,
// //   Overlay,
// //   ProgButton,
// // } from 'base/comps';
// // const Styled = styled.div`
// //   padding: 20px;
// //   // background-color: white;
// //   color: var(--darkColor);
// //   position: relative;
// //   user-select: none;
// //   margin: 0 auto;
// //   font-size: var(--font2);
// //   main {
// //     max-width: 800px;
// //   }
// //   h1 {
// //     font-size: 1.5rem;
// //     text-align: center;
// //     text-decoration: underline;
// //   }
// //   .topics {
// //     display: flex;
// //     flex-wrap: wrap;
// //     justify-content: space-around;
// //   }
// //   .card {
// //     display: flex;
// //     .img {
// //       background-size: contain;
// //       background-repeat: no-repeat;
// //       margin: 0 auto;
// //     }
// //     .label,
// //     .smLabel {
// //       text-align: center;
// //     }
// //     .hoverdesc {
// //       position: absolute;
// //       left: -1000px;
// //       width: 300px;
// //       background-color: orange;
// //       padding: 10px;
// //       border-radius: 10px;
// //       color: white;
// //       top: 100px;
// //       box-shadow: var(--shadow);
// //       z-index: 1;
// //     }
// //     &:hover .hoverdesc {
// //       /*left: 0;*/
// //     }
// //   }
// //   .infobar {
// //     margin: -10px;
// //     padding: 5px 10px 15px 10px;
// //     font-size: 0.8rem;
// //     background-color: var(--darkColor2);
// //     color: white;
// //     a:hover {
// //       color: white;
// //     }
// //   }
// //   .descCard {
// //     display: flex;
// //     align-items: center;
// //     .desc {
// //       max-width: 250px;
// //       margin-right: 15px;
// //     }
// //     .title {
// //       margin-bottom: 10px;
// //       font-size: 1.2rem;
// //     }
// //   }
// //   .hilight {
// //     background-color: var(--darkColor2);
// //     box-shadow: var(--shadow);
// //     font-size: 2rem;
// //     text-align: center;
// //     margin-bottom: 20px;
// //     letter-spacing: 2px;
// //     a {
// //       color: white;
// //     }
// //   }
// //   .lang-contact {
// //     font-size: 0.9rem;
// //   }
// //   .flex-sb {
// //     display: flex;
// //     justify-content: space-around;
// //   }
// // `;
// // const defaultCardStyle = {
// //   width: 120,
// //   margin: '25px 0',
// //   borderRadius: 10,
// // };
// // // --- MODIFIED TO ACCEPT ITEM OBJECT ---
// // const getIconStyle = (item, data) => {
// //   let iconStyle = data.iconStyle || {
// //     width: 80,
// //     height: 80,
// //   };
// //   // 1. API Image Handling
// //   if (item && item.id && !isNaN(item.id)) {
// //     const apiUrl = `http://192.168.0.127:8080/ords/lms/v1/konzeptes/image/icon/${item.id}`;
// //     iconStyle.backgroundImage = `url(${apiUrl})`;
// //     return iconStyle;
// //   }
// //   // 2. Static Image Handling (Original Logic)
// //   const img = item; // assuming item passed was img string in old code
// //   const imgPath = getImage(`${data.iconsLoc || 'icons'}/${img}.png`);
// //   const resolveImg = (src) => {
// //     if (!src) return src;
// //     if (src.indexOf('http') === 0) return src;
// //     return publicPath(src.startsWith('/') ? src : `/${src}`);
// //   };
// //   iconStyle.backgroundImage = `url(${resolveImg(imgPath)})`;
// //   return iconStyle;
// // };
// // export default function IconView(props) {
// //   //const {title, menu, onPick} = props;
// //   let config = getLocalItem('config', {});
// //   let defaultGrade;
// //   const data = props.data || {};
// //   if (data.grades) {
// //     let defaultItem = data.grades.find((item) => item.default === true);
// //     if (defaultItem) {
// //       defaultGrade = defaultItem.id;
// //     }
// //   }
// //   let [state, setState] = useState({
// //     selectedGrade: config.selectedGrade || defaultGrade,
// //   });
// //   let menu = data.list || [];
// //   if (data.grades) {
// //     let matches = state.selectedGrade.match(/(\d+)/);
// //     let gradeNo = (matches && +matches[0]) || 0;
// //     menu = menu.filter((item) => {
// //       if (!item.grade) {
// //         return false;
// //       }
// //       let range = item.grade.split('-').map((no) => +no);
// //       if (range.length === 1) {
// //         return range[0] === gradeNo;
// //       } else {
// //         return range[0] <= gradeNo && range[1] >= gradeNo;
// //       }
// //       //item.grade.indexOf(state.selectedGrade) !== -1
// //     });
// //   }
// //   const tocConfig = data.config || {};
// //   return (
// //     <Styled>
// //       <main style={data.style || { maxWidth: 1024, fontSize: '1rem' }}>
// //         <div className="flex-sb">
// //           {data.label && <h1 style={data.titleStyle || {}}>{data.label}</h1>}
// //           {data.grades && (
// //             <Select
// //               width="150px"
// //               options={data.grades}
// //               value={state.selectedGrade}
// //               bgColor="inherit"
// //               onChange={(e) => {
// //                 const cfg = getLocalItem('config', {});
// //                 cfg.selectedGrade = e.value || e.id;
// //                 cfg.selectedSubject = 'all';
// //                 setLocalItem('config', cfg);
// //                 setState({ ...state, selectedGrade: e.value || e.id });
// //               }}
// //             />
// //           )}
// //         </div>
// //         <div className="topics">
// //           {menu.map((item) => {
// //             const localStyle = item.style || {};
// //             let style = data.cardStyle || defaultCardStyle;
// //             style = { ...style, ...localStyle };
// //             return (
// //               <div className="card" style={style} key={item.id}>
// //                 {/* <Link reload href={`/p/${item.id}`}> */}
// //                 <Link href={`/p/${item.id}`}>
// //                   {!tocConfig.type && (
// //                     <>
// //                       <div
// //                         className="img"
// //                         style={{
// //                           // UPDATED: Pass 'item' object instead of 'item.img'
// //                           ...getIconStyle(item, data),
// //                           backgroundImage: `url(${(function () {
// //                             // UPDATED: Check for ID first
// //                             if (item.id && !isNaN(item.id)) {
// //                               return `http://192.168.0.127:8080/ords/lms/v1/konzeptes/image/icon/${item.id}`;
// //                             }
// //                             // Original Logic Fallback
// //                             const imgPath = getImage(
// //                               `${data.iconsLoc || 'icons'}/${item.img}.png`
// //                             );
// //                             if (!imgPath) return imgPath;
// //                             if (imgPath.indexOf('http') === 0) return imgPath;
// //                             return publicPath(
// //                               imgPath.startsWith('/') ? imgPath : `/${imgPath}`
// //                             );
// //                           })()})`,
// //                         }}
// //                       ></div>
// //                       <div className="label" style={data.labelStyle || {}}>
// //                         {item.label}
// //                       </div>
// //                       {item.smLabel && (
// //                         <div
// //                           className="smLabel"
// //                           style={data.smLabelStyle || {}}
// //                         >
// //                           {item.smLabel}
// //                         </div>
// //                       )}
// //                     </>
// //                   )}
// //                   {tocConfig.type === 'descType' && (
// //                     <div className="descCard">
// //                       <div>
// //                         <div
// //                           className="label title"
// //                           style={data.labelStyle || {}}
// //                         >
// //                           {item.label}
// //                         </div>
// //                         {item.smLabel && (
// //                           <div
// //                             className="smLabel"
// //                             style={data.smLabelStyle || {}}
// //                           >
// //                             {item.smLabel}
// //                           </div>
// //                         )}
// //                         <div className="desc" style={data.descStyle || {}}>
// //                           {item.desc}
// //                         </div>
// //                       </div>
// //                       <div
// //                         className="img"
// //                         style={{
// //                           // UPDATED: Pass 'item' object
// //                           ...getIconStyle(item, data),
// //                           backgroundImage: `url(${(function () {
// //                             // UPDATED: Check for ID first
// //                             if (item.id && !isNaN(item.id)) {
// //                               return `http://192.168.0.127:8080/ords/lms/v1/konzeptes/image/icon/${item.id}`;
// //                             }
// //                             // Original Logic
// //                             const imgPath = getImage(
// //                               `${data.iconsLoc || 'icons'}/${item.img}.png`
// //                             );
// //                             if (!imgPath) return imgPath;
// //                             if (imgPath.indexOf('http') === 0) return imgPath;
// //                             return publicPath(
// //                               imgPath.startsWith('/') ? imgPath : `/${imgPath}`
// //                             );
// //                           })()})`,
// //                         }}
// //                       ></div>
// //                     </div>
// //                   )}
// //                 </Link>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       </main>
// //       {data.moreActivities && (
// //         <div className="hilight">
// //           <div>
// //             <Link href={`/p/${data.moreActivities}`}>More Activities</Link>
// //           </div>
// //         </div>
// //       )}
// //     </Styled>
// //   );
// // }
// import React, { useState } from 'react';
// import styled from 'styled-components';
// import Link from 'next/link';
// import { getImage, setLocalItem, getLocalItem, publicPath } from 'utils';
// import { apiService } from '../../utils/apiService'; // 1. Import Service
// import {
//   Section,
//   Input,
//   TextArea,
//   Button,
//   ButtonBar,
//   Select,
//   Checkbox,
//   Overlay,
//   ProgButton,
// } from 'base/comps';
// const Styled = styled.div`
//   padding: 20px;
//   color: var(--darkColor);
//   position: relative;
//   user-select: none;
//   margin: 0 auto;
//   font-size: var(--font2);
//   main {
//     max-width: 800px;
//   }
//   h1 {
//     font-size: 1.5rem;
//     text-align: center;
//     text-decoration: underline;
//   }
//   .topics {
//     display: flex;
//     flex-wrap: wrap;
//     justify-content: space-around;
//   }
//   .card {
//     display: flex;
//     .img {
//       background-size: contain;
//       background-repeat: no-repeat;
//       margin: 0 auto;
//     }
//     .label,
//     .smLabel {
//       text-align: center;
//     }
//   }
//   .flex-sb {
//     display: flex;
//     justify-content: space-around;
//   }
//   .descCard {
//     display: flex;
//     align-items: center;
//     .desc {
//       max-width: 250px;
//       margin-right: 15px;
//     }
//     .title {
//       margin-bottom: 10px;
//       font-size: 1.2rem;
//     }
//   }
// `;
// const defaultCardStyle = {
//   width: 120,
//   margin: '25px 0',
//   borderRadius: 10,
// };
// // --- HELPER TO RESOLVE IMAGE URL ---
// const resolveIconUrl = (item, data) => {
//   // A. Check for API-based numeric ID (LMS logic)
//   if (item && item.id && !isNaN(item.id)) {
//     return apiService.getIconUrl(item.id);
//   }
//   // B. Fallback to Static Image Logic (Original logic)
//   const imgPath = getImage(
//     `${data.iconsLoc || 'icons'}/${item.img || item}.png`
//   );
//   if (!imgPath) return '';
//   if (imgPath.indexOf('http') === 0) return imgPath;
//   return publicPath(imgPath.startsWith('/') ? imgPath : `/${imgPath}`);
// };
// export default function IconView(props) {
//   let config = getLocalItem('config', {});
//   const data = props.data || {};
//   let defaultGrade;
//   if (data.grades) {
//     let defaultItem = data.grades.find((item) => item.default === true);
//     if (defaultItem) defaultGrade = defaultItem.id;
//   }
//   let [state, setState] = useState({
//     selectedGrade: config.selectedGrade || defaultGrade,
//   });
//   let menu = data.list || [];
//   if (data.grades) {
//     let matches = state.selectedGrade.match(/(\d+)/);
//     let gradeNo = (matches && +matches[0]) || 0;
//     menu = menu.filter((item) => {
//       if (!item.grade) return false;
//       let range = item.grade.split('-').map((no) => +no);
//       return range.length === 1
//         ? range[0] === gradeNo
//         : range[0] <= gradeNo && range[1] >= gradeNo;
//     });
//   }
//   const tocConfig = data.config || {};
//   return (
//     <Styled>
//       <main style={data.style || { maxWidth: 1024, fontSize: '1rem' }}>
//         <div className="flex-sb">
//           {data.label && <h1 style={data.titleStyle || {}}>{data.label}</h1>}
//           {data.grades && (
//             <Select
//               width="150px"
//               options={data.grades}
//               value={state.selectedGrade}
//               bgColor="inherit"
//               onChange={(e) => {
//                 const cfg = getLocalItem('config', {});
//                 cfg.selectedGrade = e.value || e.id;
//                 cfg.selectedSubject = 'all';
//                 setLocalItem('config', cfg);
//                 setState({ ...state, selectedGrade: e.value || e.id });
//               }}
//             />
//           )}
//         </div>
//         <div className="topics">
//           {menu.map((item) => {
//             const localStyle = item.style || {};
//             let style = {
//               ...(data.cardStyle || defaultCardStyle),
//               ...localStyle,
//             };
//             // Centralized Background Image Logic
//             const bgImage = `url(${resolveIconUrl(item, data)})`;
//             const iconSize = data.iconStyle || { width: 80, height: 80 };
//             return (
//               <div className="card" style={style} key={item.id}>
//                 <Link href={`/p/${item.id}`}>
//                   {tocConfig.type !== 'descType' ? (
//                     <>
//                       <div
//                         className="img"
//                         style={{ ...iconSize, backgroundImage: bgImage }}
//                       ></div>
//                       <div className="label" style={data.labelStyle || {}}>
//                         {item.label}
//                       </div>
//                       {item.smLabel && (
//                         <div
//                           className="smLabel"
//                           style={data.smLabelStyle || {}}
//                         >
//                           {item.smLabel}
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <div className="descCard">
//                       <div>
//                         <div
//                           className="label title"
//                           style={data.labelStyle || {}}
//                         >
//                           {item.label}
//                         </div>
//                         {item.smLabel && (
//                           <div
//                             className="smLabel"
//                             style={data.smLabelStyle || {}}
//                           >
//                             {item.smLabel}
//                           </div>
//                         )}
//                         <div className="desc" style={data.descStyle || {}}>
//                           {item.desc}
//                         </div>
//                       </div>
//                       <div
//                         className="img"
//                         style={{ ...iconSize, backgroundImage: bgImage }}
//                       ></div>
//                     </div>
//                   )}
//                 </Link>
//               </div>
//             );
//           })}
//         </div>
//       </main>
//       {data.moreActivities && (
//         <div className="hilight">
//           <div>
//             <Link href={`/p/${data.moreActivities}`}>More Activities</Link>
//           </div>
//         </div>
//       )}
//     </Styled>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>IconViewMini
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/apiService.js [client] (ecmascript)"); // Central Service
;
;
;
;
;
;
const Styled = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].div.withConfig({
    displayName: "IconViewMini__Styled",
    componentId: "sc-3f2e9eca-0"
})`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  padding: 10px;

  .mini-card {
    cursor: pointer;
    text-align: center;
    width: 70px;

    .img {
      width: 50px;
      height: 50px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      margin: 0 auto;
    }

    .label {
      font-size: 0.75rem;
      margin-top: 5px;
      color: var(--darkColor);
      font-weight: bold;
    }
  }
`;
_c = Styled;
// Helper to resolve the URL (Matches IconView logic)
const resolveIconUrl = (item, iconsLoc)=>{
    // 1. API Image Handling (LMS numeric IDs)
    if (item && item.id && !isNaN(item.id)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].getIconUrl(item.id);
    }
    // 2. Static Asset Handling
    const imgPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getImage"])(`${iconsLoc || 'icons'}/${item.img || item}.png`);
    if (!imgPath) return '';
    if (imgPath.indexOf('http') === 0) return imgPath;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["publicPath"])(imgPath.startsWith('/') ? imgPath : `/${imgPath}`);
};
function IconViewMini({ data }) {
    const list = data?.list || [];
    const iconsLoc = data?.iconsLoc || 'icons';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Styled, {
        children: list.map((item)=>{
            const bgImage = `url(${resolveIconUrl(item, iconsLoc)})`;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mini-card",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    href: `/p/${item.id}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "img",
                            style: {
                                backgroundImage: bgImage
                            }
                        }, void 0, false, {
                            fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                            lineNumber: 915,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "label",
                            children: item.label
                        }, void 0, false, {
                            fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                            lineNumber: 916,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                    lineNumber: 914,
                    columnNumber: 13
                }, this)
            }, item.id, false, {
                fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                lineNumber: 913,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/comps/curriculumViews/IconViewMini.js",
        lineNumber: 908,
        columnNumber: 5
    }, this);
}
_c1 = IconViewMini;
var _c, _c1;
__turbopack_context__.k.register(_c, "Styled");
__turbopack_context__.k.register(_c1, "IconViewMini");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
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
"[project]/pages/home.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router'; // 👈 1. Import useRouter
// import IconView from 'comps/curriculumViews/IconViewMini';
// import data from 'konzeptes/playlists/main';
// import UserDropdown from 'comps/UserDropdown';
// export default function HomeView() {
//   const router = useRouter(); // 👈 2. Initialize router
//   const [isLoading, setIsLoading] = useState(true);
//   useEffect(() => {
//     const loggedIn = localStorage.getItem('isLoggedIn');
//     if (loggedIn !== 'true') {
//       window.location.href = '/lms-system';
//     } else {
//       setIsLoading(false);
//     }
//   }, []);
//   // 👈 3. Add Handle Back Function
//   const handleBack = () => {
//     router.push('/'); // Navigates to index.js (Welcome Screen)
//   };
//   if (isLoading) return null;
//   return (
//     <div
//       style={{
//         backgroundColor: 'var(--l)',
//         minHeight: '100vh',
//         position: 'relative',
//       }}
//     >
//       {/* 🟢 USER DROPDOWN (Top Right) */}
//       <UserDropdown />
//       {/* 🔙 BACK BUTTON (Bottom Left - Same style as Playlist) */}
//       <button
//         onClick={handleBack}
//         style={{
//           position: 'fixed', // Fixed so it stays visible
//           top: '20px',
//           left: '20px',
//           padding: '8px 16px',
//           backgroundColor: 'white',
//           border: '2px solid #2b7d10',
//           borderRadius: '50px',
//           fontWeight: 'bold',
//           cursor: 'pointer',
//           zIndex: 1000,
//         }}
//       >
//         ← Back
//       </button>
//       <IconView data={data} />
//     </div>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>HomeView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$IconViewMini$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/curriculumViews/IconViewMini.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$UserDropdown$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/UserDropdown.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function HomeView() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [menuData, setMenuData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Define your exact static style configuration here
    const staticConfig = {
        iconsLoc: 'konzeptes/icons',
        label: '🦉🏫📚🎓📜 Konzeptes 🦉🏫📚🎓📜',
        type: 'curriculumIcon',
        style: {
            fontSize: '0.9rem',
            maxWidth: 1300,
            margin: '0 auto'
        },
        titleStyle: {
            textDecoration: 'none'
        },
        cardStyle: {
            margin: '25px 0',
            borderRadius: 10,
            padding: 10,
            backgroundColor: '#dbf7c3',
            border: '1px solid white',
            boxShadow: 'var(--shadow)'
        },
        iconStyle: {
            width: 200,
            height: 200
        },
        labelStyle: {
            fontSize: '1.5rem'
        },
        smLabelStyle: {
            fontSize: '1rem'
        },
        list: []
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomeView.useEffect": ()=>{
            // 1. Check Login
            const loggedIn = localStorage.getItem('isLoggedIn');
            if (loggedIn !== 'true') {
                window.location.href = '/lms-system';
                return;
            }
            // 2. Fetch API Data
            fetch('http://192.168.0.127:8080/ords/lms/v1/konzeptes/config').then({
                "HomeView.useEffect": (res)=>res.json()
            }["HomeView.useEffect"]).then({
                "HomeView.useEffect": (data)=>{
                    try {
                        // Parse the stringified list from the API
                        const rawString = data.items[0].list;
                        const parsedList = JSON.parse(rawString);
                        // Merge API list with your static styles
                        setMenuData({
                            ...staticConfig,
                            list: parsedList
                        });
                        setIsLoading(false);
                    } catch (e) {
                        console.error('Error parsing API data', e);
                    }
                }
            }["HomeView.useEffect"]).catch({
                "HomeView.useEffect": (err)=>console.error('Fetch error:', err)
            }["HomeView.useEffect"]);
        }
    }["HomeView.useEffect"], []);
    const handleBack = ()=>{
        router.push('/');
    };
    if (isLoading || !menuData) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            backgroundColor: 'var(--l)',
            minHeight: '100vh',
            position: 'relative'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$UserDropdown$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/home.js",
                lineNumber: 149,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleBack,
                style: {
                    position: 'fixed',
                    top: '20px',
                    left: '20px',
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    border: '2px solid #2b7d10',
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    zIndex: 1000
                },
                children: "← Back"
            }, void 0, false, {
                fileName: "[project]/pages/home.js",
                lineNumber: 152,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$IconViewMini$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                data: menuData
            }, void 0, false, {
                fileName: "[project]/pages/home.js",
                lineNumber: 170,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/home.js",
        lineNumber: 141,
        columnNumber: 5
    }, this);
}
_s(HomeView, "YbFnqo0RLDEjcncnfImuw6EYGyQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = HomeView;
var _c;
__turbopack_context__.k.register(_c, "HomeView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/home.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/home";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/home.js [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/home\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/home.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__0bb6dfb0._.js.map