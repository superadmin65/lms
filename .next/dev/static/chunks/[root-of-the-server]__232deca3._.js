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
"[project]/comps/DelayLoader.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DelayLoader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
function DelayLoader(props) {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        isLoading: false
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DelayLoader.useEffect": ()=>{
            let intervalID;
            if (props.lazyLoad) {
                setState({
                    ...state,
                    isLoading: true
                });
                intervalID = setTimeout({
                    "DelayLoader.useEffect": ()=>setState({
                            ...state,
                            isLoading: false
                        })
                }["DelayLoader.useEffect"], 200);
            }
            return ({
                "DelayLoader.useEffect": ()=>intervalID && clearTimeout(intervalID)
            })["DelayLoader.useEffect"];
        }
    }["DelayLoader.useEffect"], [
        props.lazyLoad,
        props.data
    ]);
    if (state.isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/comps/DelayLoader.js",
            lineNumber: 19,
            columnNumber: 12
        }, this);
    }
    return props.children;
}
_s(DelayLoader, "9RZlhi0Isc3cQYFTUy6QOHAaJMs=");
_c = DelayLoader;
var _c;
__turbopack_context__.k.register(_c, "DelayLoader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/utils/playlistUtils.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "codeStrToObj",
    ()=>codeStrToObj,
    "getDataFromGroupAct",
    ()=>getDataFromGroupAct,
    "loadActivity",
    ()=>loadActivity,
    "objToCodeStr",
    ()=>objToCodeStr
]);
function getDataFromGroupAct(item, i) {
    let data = item.commonData || {};
    let subData = item.data[i];
    if (subData.refs) {
        let refId = subData.refs;
        let refData;
        if (refId.indexOf("~") !== -1) {
            const refIndex = +refId.substr(refId.indexOf("~") + 1);
            refId = refId.substr(0, refId.indexOf("~"));
            subData = props.toc.defs[refId][refIndex];
        } else {
            subData = props.toc.defs[refId];
        }
    }
    if (typeof subData === "string") {
        data = {
            ...data,
            text: subData
        };
    } else if (Array.isArray(subData)) {
        data = {
            ...data,
            arr: subData
        };
    } else {
        data = {
            ...data,
            ...subData
        };
    }
    return {
        ...item,
        data
    };
}
async function loadActivity(id) {
    const [playlistId, activityId] = id.split("/");
    /*
  return {
    title: "Match words with opposite meaning.",
    text: `yes, no
    you, I
    yesterday, tomorrow
    young, old
    early, late 
    cry, laugh `,
  };
  */ let data;
    if (isNaN(playlistId)) {
        // Respect Next.js basePath (if any) when fetching static playlist JSON
        const getBasePath = ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (window.__NEXT_DATA__ && window.__NEXT_DATA__.basePath) return window.__NEXT_DATA__.basePath;
            if (window.location && window.location.pathname) {
                const parts = window.location.pathname.split('/');
                if (parts.length > 1 && parts[1] === 'lms-system') return '/lms-system';
            }
            return '';
        };
        const basePath = getBasePath();
        data = await fetch(`${basePath}/json/${playlistId}.pschool`);
        data = await data.json();
    } else {
    // data = await getWithoutAuth(`playlist/${playlistId}`);
    }
    if (!data || !data.list) {
        throw new Error("invalid playlist");
    }
    if (!activityId) {
        return data;
    }
    let activity;
    if (activityId.indexOf("_") === -1) {
        activity = data.list.find((item)=>item.id === activityId);
    } else {
        let rootId = activityId.substr(0, activityId.indexOf("_"));
        let num = +activityId.substr(activityId.indexOf("_") + 1);
        let fullActivity = data.list.find((item)=>item.id === rootId);
        activity = {
            ...fullActivity,
            data: {
                ...fullActivity.commonData
            }
        };
        if (typeof fullActivity.data[num - 1] === "string") {
            activity.data.text = fullActivity.data[num - 1];
        } else if (Array.isArray(typeof fullActivity.data[num - 1])) {
            activity.data.arr = fullActivity.data[num - 1];
        } else {
            activity.data = {
                ...activity.data,
                ...fullActivity.data[num - 1]
            };
        }
    }
    if (activity) {
        activity = {
            ...activity
        };
        delete activity.commonData;
        if (activity.data.refs) {
            activity.data = extractRefs(activity.data, data);
        }
        return activity;
    } else {
        throw new Error("invalid activity");
    }
}
function extractRefs(data, playlist) {
    let refId = data.refs;
    let refData;
    if (refId.indexOf("~") !== -1) {
        const refIndex = +refId.substr(refId.indexOf("~") + 1);
        refId = refId.substr(0, refId.indexOf("~"));
        refData = playlist.defs[refId][refIndex];
    } else {
        refData = playlist.defs[refId];
    }
    if (typeof refData === "string") {
        refData = {
            text: refData
        };
    } else if (Array.isArray(refData)) {
        refData = {
            arr: refData
        };
    }
    return {
        ...data,
        ...refData
    };
}
function objToCodeStr(obj) {
    let codeStr = JSON.stringify(obj, null, 2);
    codeStr = codeStr.replaceAll(/"([^"]*?\\n.*)"/gm, (a)=>{
        return a.replaceAll('"', "`").replaceAll("\\n", "\n");
    //'`$1`'
    });
    return codeStr;
}
function codeStrToObj(codeStr) {
    let str = codeStr.replaceAll(/\`((.*?)\n)+?(.*?)\`/g, (str)=>{
        str = str.substring(1, str.length - 1);
        str = str.replaceAll("\n", "\\n");
        return `"${str}"`;
    });
    let actData = JSON.parse(str);
    return actData;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Svg.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Svg,
    "svgMap",
    ()=>svgMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
;
const svgMap = {
    facebook: 'M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z',
    youtube: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z',
    youtube2: 'M4.652 0h1.44l.988 3.702.916-3.702h1.454l-1.665 5.505v3.757h-1.431v-3.757l-1.702-5.505zm6.594 2.373c-1.119 0-1.861.74-1.861 1.835v3.349c0 1.204.629 1.831 1.861 1.831 1.022 0 1.826-.683 1.826-1.831v-3.349c0-1.069-.797-1.835-1.826-1.835zm.531 5.127c0 .372-.19.646-.532.646-.351 0-.554-.287-.554-.646v-3.179c0-.374.172-.651.529-.651.39 0 .557.269.557.651v3.179zm4.729-5.07v5.186c-.155.194-.5.512-.747.512-.271 0-.338-.186-.338-.46v-5.238h-1.27v5.71c0 .675.206 1.22.887 1.22.384 0 .918-.2 1.468-.853v.754h1.27v-6.831h-1.27zm2.203 13.858c-.448 0-.541.315-.541.763v.659h1.069v-.66c.001-.44-.092-.762-.528-.762zm-4.703.04c-.084.043-.167.109-.25.198v4.055c.099.106.194.182.287.229.197.1.485.107.619-.067.07-.092.105-.241.105-.449v-3.359c0-.22-.043-.386-.129-.5-.147-.193-.42-.214-.632-.107zm4.827-5.195c-2.604-.177-11.066-.177-13.666 0-2.814.192-3.146 1.892-3.167 6.367.021 4.467.35 6.175 3.167 6.367 2.6.177 11.062.177 13.666 0 2.814-.192 3.146-1.893 3.167-6.367-.021-4.467-.35-6.175-3.167-6.367zm-12.324 10.686h-1.363v-7.54h-1.41v-1.28h4.182v1.28h-1.41v7.54zm4.846 0h-1.21v-.718c-.223.265-.455.467-.696.605-.652.374-1.547.365-1.547-.955v-5.438h1.209v4.988c0 .262.063.438.322.438.236 0 .564-.303.711-.487v-4.939h1.21v6.506zm4.657-1.348c0 .805-.301 1.431-1.106 1.431-.443 0-.812-.162-1.149-.583v.5h-1.221v-8.82h1.221v2.84c.273-.333.644-.608 1.076-.608.886 0 1.18.749 1.18 1.631v3.609zm4.471-1.752h-2.314v1.228c0 .488.042.91.528.91.511 0 .541-.344.541-.91v-.452h1.245v.489c0 1.253-.538 2.013-1.813 2.013-1.155 0-1.746-.842-1.746-2.013v-2.921c0-1.129.746-1.914 1.837-1.914 1.161 0 1.721.738 1.721 1.914v1.656z',
    instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    twitter: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z',
    linkedin: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
    pinterest: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z',
    github: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
    whatsapp: 'M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z',
    email: 'M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z',
    pencil: 'M14.078 4.232l-12.64 12.639-1.438 7.129 7.127-1.438 12.641-12.64-5.69-5.69zm-10.369 14.893l-.85-.85 11.141-11.125.849.849-11.14 11.126zm2.008 2.008l-.85-.85 11.141-11.125.85.85-11.141 11.125zm18.283-15.444l-2.816 2.818-5.691-5.691 2.816-2.816 5.691 5.689z',
    paint: 'M21.143 9.667c-.733-1.392-1.914-3.05-3.617-4.753-2.977-2.978-5.478-3.914-6.785-3.914-.414 0-.708.094-.86.246l-1.361 1.36c-1.899-.236-3.42.106-4.294.983-.876.875-1.164 2.159-.792 3.523.492 1.806 2.305 4.049 5.905 5.375.038.323.157.638.405.885.588.588 1.535.586 2.121 0s.588-1.533.002-2.119c-.588-.587-1.537-.588-2.123-.001l-.17.256c-2.031-.765-3.395-1.828-4.232-2.9l3.879-3.875c.496 2.73 6.432 8.676 9.178 9.178l-7.115 7.107c-.234.153-2.798-.316-6.156-3.675-3.393-3.393-3.175-5.271-3.027-5.498l1.859-1.856c-.439-.359-.925-1.103-1.141-1.689l-2.134 2.131c-.445.446-.685 1.064-.685 1.82 0 1.634 1.121 3.915 3.713 6.506 2.764 2.764 5.58 4.243 7.432 4.243.648 0 1.18-.195 1.547-.562l8.086-8.078c.91.874-.778 3.538-.778 4.648 0 1.104.896 1.999 2 1.999 1.105 0 2-.896 2-2 0-3.184-1.425-6.81-2.857-9.34zm-16.209-5.371c.527-.53 1.471-.791 2.656-.761l-3.209 3.206c-.236-.978-.049-1.845.553-2.445zm9.292 4.079l-.03-.029c-1.292-1.292-3.803-4.356-3.096-5.063.715-.715 3.488 1.521 5.062 3.096.862.862 2.088 2.247 2.937 3.458-1.717-1.074-3.491-1.469-4.873-1.462z',
    eraser: 'M5.662 23l-5.369-5.365c-.195-.195-.293-.45-.293-.707 0-.256.098-.512.293-.707l14.929-14.928c.195-.194.451-.293.707-.293.255 0 .512.099.707.293l7.071 7.073c.196.195.293.451.293.708 0 .256-.097.511-.293.707l-11.216 11.219h5.514v2h-12.343zm3.657-2l-5.486-5.486-1.419 1.414 4.076 4.072h2.829zm6.605-17.581l-10.677 10.68 5.658 5.659 10.676-10.682-5.657-5.657z',
    refresh: 'M13.5 2c-5.288 0-9.649 3.914-10.377 9h-3.123l4 5.917 4-5.917h-2.847c.711-3.972 4.174-7 8.347-7 4.687 0 8.5 3.813 8.5 8.5s-3.813 8.5-8.5 8.5c-3.015 0-5.662-1.583-7.171-3.957l-1.2 1.775c1.916 2.536 4.948 4.182 8.371 4.182 5.797 0 10.5-4.702 10.5-10.5s-4.703-10.5-10.5-10.5z',
    sort: 'M12 3.202l3.839 4.798h-7.678l3.839-4.798zm0-3.202l-8 10h16l-8-10zm3.839 16l-3.839 4.798-3.839-4.798h7.678zm4.161-2h-16l8 10 8-10z',
    arrowLeft: 'M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm-4.828 11.5l4.608 3.763-.679.737-6.101-5 6.112-5 .666.753-4.604 3.747h11.826v1h-11.828z',
    save: 'M13 3h2.996v5h-2.996v-5zm11 1v20h-24v-24h20l4 4zm-17 5h10v-7h-10v7zm15-4.171l-2.828-2.829h-.172v9h-14v-9h-3v20h20v-17.171z',
    pdf: 'M11.363 2c4.155 0 2.637 6 2.637 6s6-1.65 6 2.457v11.543h-16v-20h7.363zm.826-2h-10.189v24h20v-14.386c0-2.391-6.648-9.614-9.811-9.614zm4.811 13h-2.628v3.686h.907v-1.472h1.49v-.732h-1.49v-.698h1.721v-.784zm-4.9 0h-1.599v3.686h1.599c.537 0 .961-.181 1.262-.535.555-.658.587-2.034-.062-2.692-.298-.3-.712-.459-1.2-.459zm-.692.783h.496c.473 0 .802.173.915.644.064.267.077.679-.021.948-.128.351-.381.528-.754.528h-.637v-2.12zm-2.74-.783h-1.668v3.686h.907v-1.277h.761c.619 0 1.064-.277 1.224-.763.095-.291.095-.597 0-.885-.16-.484-.606-.761-1.224-.761zm-.761.732h.546c.235 0 .467.028.576.228.067.123.067.366 0 .489-.109.199-.341.227-.576.227h-.546v-.944z',
    lock: 'M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-10 0v-4c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-8z',
    caretDown: 'M12 21l-12-18h24z',
    upload: 'M8 10h-5l9-10 9 10h-5v10h-8v-10zm11 9v3h-14v-3h-2v5h18v-5h-2z',
    audio: 'M6 7l8-5v20l-8-5v-10zm-6 10h4v-10h-4v10zm20.264-13.264l-1.497 1.497c1.847 1.783 2.983 4.157 2.983 6.767 0 2.61-1.135 4.984-2.983 6.766l1.498 1.498c2.305-2.153 3.735-5.055 3.735-8.264s-1.43-6.11-3.736-8.264zm-.489 8.264c0-2.084-.915-3.967-2.384-5.391l-1.503 1.503c1.011 1.049 1.637 2.401 1.637 3.888 0 1.488-.623 2.841-1.634 3.891l1.503 1.503c1.468-1.424 2.381-3.309 2.381-5.394z',
    target: 'M6 12c0 2.206 1.794 4 4 4 1.761 0 3.242-1.151 3.775-2.734l2.224-1.291.001.025c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6c1.084 0 2.098.292 2.975.794l-2.21 1.283c-.248-.048-.503-.077-.765-.077-2.206 0-4 1.794-4 4zm4-2c-1.105 0-2 .896-2 2s.895 2 2 2 2-.896 2-2l-.002-.015 3.36-1.95c.976-.565 2.704-.336 3.711.159l4.931-2.863-3.158-1.569.169-3.632-4.945 2.87c-.07 1.121-.734 2.736-1.705 3.301l-3.383 1.964c-.29-.163-.621-.265-.978-.265zm7.995 1.911l.005.089c0 4.411-3.589 8-8 8s-8-3.589-8-8 3.589-8 8-8c1.475 0 2.853.408 4.041 1.107.334-.586.428-1.544.146-2.18-1.275-.589-2.69-.927-4.187-.927-5.523 0-10 4.477-10 10s4.477 10 10 10c5.233 0 9.521-4.021 9.957-9.142-.301-.483-1.066-1.061-1.962-.947z',
    barchart: 'M5 19h-4v-8h4v8zm6 0h-4v-18h4v18zm6 0h-4v-12h4v12zm6 0h-4v-4h4v4zm1 2h-24v2h24v-2z',
    view: 'M12.015 7c4.751 0 8.063 3.012 9.504 4.636-1.401 1.837-4.713 5.364-9.504 5.364-4.42 0-7.93-3.536-9.478-5.407 1.493-1.647 4.817-4.593 9.478-4.593zm0-2c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 3c-2.209 0-4 1.792-4 4 0 2.209 1.791 4 4 4s4-1.791 4-4c0-2.208-1.791-4-4-4z',
    viewHide: 'M19.604 2.562l-3.346 3.137c-1.27-.428-2.686-.699-4.243-.699-7.569 0-12.015 6.551-12.015 6.551s1.928 2.951 5.146 5.138l-2.911 2.909 1.414 1.414 17.37-17.035-1.415-1.415zm-6.016 5.779c-3.288-1.453-6.681 1.908-5.265 5.206l-1.726 1.707c-1.814-1.16-3.225-2.65-4.06-3.66 1.493-1.648 4.817-4.594 9.478-4.594.927 0 1.796.119 2.61.315l-1.037 1.026zm-2.883 7.431l5.09-4.993c1.017 3.111-2.003 6.067-5.09 4.993zm13.295-4.221s-4.252 7.449-11.985 7.449c-1.379 0-2.662-.291-3.851-.737l1.614-1.583c.715.193 1.458.32 2.237.32 4.791 0 8.104-3.527 9.504-5.364-.729-.822-1.956-1.99-3.587-2.952l1.489-1.46c2.982 1.9 4.579 4.327 4.579 4.327z',
    star: 'M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z',
    play: 'M3 22v-20l18 10-18 10z',
    download: 'M12 21l-8-9h6v-12h4v12h6l-8 9zm9-1v2h-18v-2h-2v4h22v-4h-2z',
    pause: 'M11 22h-4v-20h4v20zm10-20h-4v20h4v-20z',
    // this is duplicated in authorSvg - need to remove it there.
    zoom: 'M15.853 16.56c-1.683 1.517-3.911 2.44-6.353 2.44-5.243 0-9.5-4.257-9.5-9.5s4.257-9.5 9.5-9.5 9.5 4.257 9.5 9.5c0 2.442-.923 4.67-2.44 6.353l7.44 7.44-.707.707-7.44-7.44zm-6.353-15.56c4.691 0 8.5 3.809 8.5 8.5s-3.809 8.5-8.5 8.5-8.5-3.809-8.5-8.5 3.809-8.5 8.5-8.5z',
    //newly added
    like: 'M15.43 8.814c.808-3.283 1.252-8.814-2.197-8.814-1.861 0-2.35 1.668-2.833 3.329-1.971 6.788-5.314 7.342-8.4 7.743v9.928c3.503 0 5.584.729 8.169 1.842 1.257.541 3.053 1.158 5.336 1.158 2.538 0 4.295-.997 5.009-3.686.5-1.877 1.486-7.25 1.486-8.25 0-1.649-1.168-2.446-2.594-2.507-1.21-.051-2.87-.277-3.976-.743zm3.718 4.321l-1.394.167s-.609 1.109.141 1.115c0 0 .201.01 1.069-.027 1.082-.046 1.051 1.469.004 1.563l-1.761.099c-.734.094-.656 1.203.141 1.172 0 0 .686-.017 1.143-.041 1.068-.056 1.016 1.429.04 1.551-.424.053-1.745.115-1.745.115-.811.072-.706 1.235.109 1.141l.771-.031c.822-.074 1.003.825-.292 1.661-1.567.881-4.685.131-6.416-.614-2.238-.965-4.437-1.934-6.958-2.006v-6c3.263-.749 6.329-2.254 8.321-9.113.898-3.092 1.679-1.931 1.679.574 0 2.071-.49 3.786-.921 5.533 1.061.543 3.371 1.402 6.12 1.556 1.055.059 1.025 1.455-.051 1.585z',
    comment: 'M12 1c-6.338 0-12 4.226-12 10.007 0 2.05.739 4.063 2.047 5.625l-1.993 6.368 6.946-3c1.705.439 3.334.641 4.864.641 7.174 0 12.136-4.439 12.136-9.634 0-5.812-5.701-10.007-12-10.007zm0 1c6.065 0 11 4.041 11 9.007 0 4.922-4.787 8.634-11.136 8.634-1.881 0-3.401-.299-4.946-.695l-5.258 2.271 1.505-4.808c-1.308-1.564-2.165-3.128-2.165-5.402 0-4.966 4.935-9.007 11-9.007zm-5 7.5c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm5 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm5 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z',
    share: 'M6 17c2.269-9.881 11-11.667 11-11.667v-3.333l7 6.637-7 6.696v-3.333s-6.17-.171-11 5zm12 .145v2.855h-16v-12h6.598c.768-.787 1.561-1.449 2.339-2h-10.937v16h20v-6.769l-2 1.914z',
    minimize: 'M24 22h-24v-20h24v20zm-23-9v8h10v-8h-10zm22 8v-18h-22v9h11v9h11zm-4-9h-5v-5h1v3.241l5.241-5.241.759.759-5.241 5.241h3.241v1z'
};
function Svg(props) {
    let style = props.style || {};
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: props.size || 24,
        height: props.size || 24,
        viewBox: props.viewBox || '0 0 24 24',
        style: {
            verticalAlign: 'bottom',
            display: 'inline-block',
            margin: '0 5px',
            cursor: 'pointer',
            ...style
        },
        className: props.className || '',
        fillRule: "evenodd",
        onClick: props.onClick,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: props.d || svgMap[props.id],
            fill: props.color || 'currentcolor'
        }, void 0, false, {
            fileName: "[project]/components/Svg.js",
            lineNumber: 85,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Svg.js",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
_c = Svg;
var _c;
__turbopack_context__.k.register(_c, "Svg");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/base/comps/InputWrap.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
;
;
const InputWrapper = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].div.withConfig({
    displayName: "InputWrap__InputWrapper",
    componentId: "sc-768cbaeb-0"
})`
  margin: 10px 0;

  ${(props)=>props.sameLine && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["css"]`
      display: flex;
      margin-right: 20px;
    `} & input {
    border: none;
    outline: none;
    border-bottom: 1px solid ${(props)=>props.error ? '#f00' : '#ccc'};
    padding: 2px 5px 2px 15px;
    background-color: inherit;
    display: block;
    width: 100%;
  }

  & label {
    display: block;
    margin-right: 20px;
    margin-bottom: 5px;
    align-self: flex-end;
    /* min-width: 120px;*/
  }

  & .errorLable {
    font-family: 'Avenir-Roman', sans-serif;
    font-size: 10px;
    color: #de1c1c;
  }
`;
_c = InputWrapper;
const InputWrap = ({ error, label, children, sameLine, ...otherProps })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InputWrapper, {
        error: error,
        style: otherProps.style,
        sameLine: sameLine,
        children: [
            !!label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                children: label
            }, void 0, false, {
                fileName: "[project]/base/comps/InputWrap.js",
                lineNumber: 39,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
            children,
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "errorLable",
                children: error
            }, void 0, false, {
                fileName: "[project]/base/comps/InputWrap.js",
                lineNumber: 41,
                columnNumber: 15
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/base/comps/InputWrap.js",
        lineNumber: 38,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c1 = InputWrap;
const __TURBOPACK__default__export__ = InputWrap;
var _c, _c1;
__turbopack_context__.k.register(_c, "InputWrapper");
__turbopack_context__.k.register(_c1, "InputWrap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/base/comps/Input.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileUpload",
    ()=>FileUpload,
    "TextArea",
    ()=>TextArea,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Svg.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const InputWrapper = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].div.withConfig({
    displayName: "Input__InputWrapper",
    componentId: "sc-acb101f1-0"
})`
  margin: 10px 0;

  ${(props)=>props.sameLine && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["css"]`
      display: flex;
      margin-right: 20px;
    `} & input, textarea {
    border: none;
    outline: none;
    border-bottom: 1px solid ${(props)=>props.error ? '#f00' : '#ccc'};
    padding: 2px 5px;
    background-color: white;
    display: block;
    width: 100%;
  }

  & textarea {
    max-height: 250px;
  }

  & label {
    display: block;
    margin-bottom: 5px;
    margin-right: 10px;
  }

  & .errorLable {
    font-size: 0.8rem;
    margin-top: 5px;
    color: #de1c1c;
  }
`;
_c = InputWrapper;
const Input = ({ error, label, sameLine, ...otherProps })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InputWrapper, {
        sameLine: sameLine,
        error: error,
        style: otherProps.style,
        children: [
            !!label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: label,
                children: label
            }, void 0, false, {
                fileName: "[project]/base/comps/Input.js",
                lineNumber: 41,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: otherProps.width || ''
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: label,
                        type: "text",
                        ...otherProps
                    }, void 0, false, {
                        fileName: "[project]/base/comps/Input.js",
                        lineNumber: 43,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "errorLable",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/base/comps/Input.js",
                        lineNumber: 44,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/base/comps/Input.js",
                lineNumber: 42,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/base/comps/Input.js",
        lineNumber: 40,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c1 = Input;
const TextArea = ({ error, label, sameLine, ...otherProps })=>{
    _s();
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    /*
  useEffect(() => {
    const dom = inputRef.current;
    dom.style.height = `${dom.scrollHeight}px`;
  });
  */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InputWrapper, {
        sameLine: sameLine,
        error: error,
        style: otherProps.style,
        children: [
            !!label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: label,
                children: label
            }, void 0, false, {
                fileName: "[project]/base/comps/Input.js",
                lineNumber: 59,
                columnNumber: 19
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                id: label,
                ref: inputRef,
                ...otherProps
            }, void 0, false, {
                fileName: "[project]/base/comps/Input.js",
                lineNumber: 60,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "errorLable",
                children: error
            }, void 0, false, {
                fileName: "[project]/base/comps/Input.js",
                lineNumber: 61,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/base/comps/Input.js",
        lineNumber: 58,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(TextArea, "iD9XNNsNOlNDckBemnvlLS+aHYk=");
_c2 = TextArea;
const FileUpload = ({ error, iconOnly, label, ...otherProps })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: "fileUpload",
                className: iconOnly ? '' : 'button is-primary',
                children: iconOnly ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    id: "upload"
                }, void 0, false, {
                    fileName: "[project]/base/comps/Input.js",
                    lineNumber: 73,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)) : label
            }, void 0, false, {
                fileName: "[project]/base/comps/Input.js",
                lineNumber: 69,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: "fileUpload",
                        style: {
                            display: 'none'
                        },
                        type: "file",
                        ...otherProps
                    }, void 0, false, {
                        fileName: "[project]/base/comps/Input.js",
                        lineNumber: 77,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "errorLable",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/base/comps/Input.js",
                        lineNumber: 83,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/base/comps/Input.js",
                lineNumber: 76,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/base/comps/Input.js",
        lineNumber: 67,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c3 = FileUpload;
const __TURBOPACK__default__export__ = Input;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "InputWrapper");
__turbopack_context__.k.register(_c1, "Input");
__turbopack_context__.k.register(_c2, "TextArea");
__turbopack_context__.k.register(_c3, "FileUpload");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/base/comps/InputNumber.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [client] (ecmascript)");
;
const InputNumber = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].input.attrs({
    type: 'number'
}).withConfig({
    displayName: "InputNumber",
    componentId: "sc-b8714d9f-0"
})`
  width: 50px;
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 3px;
  outline: none;
`;
const __TURBOPACK__default__export__ = InputNumber;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/base/comps/Checkbox.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
;
;
const CheckboxWrapper = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].div.withConfig({
    displayName: "Checkbox__CheckboxWrapper",
    componentId: "sc-1bf5732d-0"
})`
  outline: none;
  margin: 10px 0;
  & input[type='checkbox'] {
    width: 16px;
    height: 16px;
    display: inline-block;
    border-radius: 4px;
    vertical-align: middle;
    border: ${(props)=>props.checked ? '' : '2px solid #cccccc'};
    outline: none;
    transform: scale(1.5);
  }

  & .contentWrap {
    display: inline-block;
    margin-left: 10px;
    cursor: pointer;
  }
`;
_c = CheckboxWrapper;
const Checkbox = ({ onClick, children, checked })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckboxWrapper, {
        onClick: onClick,
        role: 'checkbox',
        "aria-checked": checked,
        tabIndex: 0,
        checked: checked,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "checkbox",
                checked: checked
            }, void 0, false, {
                fileName: "[project]/base/comps/Checkbox.js",
                lineNumber: 38,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "contentWrap",
                children: children
            }, void 0, false, {
                fileName: "[project]/base/comps/Checkbox.js",
                lineNumber: 39,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/base/comps/Checkbox.js",
        lineNumber: 26,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c1 = Checkbox;
const __TURBOPACK__default__export__ = Checkbox;
var _c, _c1;
__turbopack_context__.k.register(_c, "CheckboxWrapper");
__turbopack_context__.k.register(_c1, "Checkbox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/base/comps/Radio.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import styled from "styled-components";
// import React from "react";
// const CheckboxWrapper = styled.div`
//   outline: none;
//   margin: 10px 0;
//   & input[type="checkbox"] {
//     width: 16px;
//     height: 16px;
//     display: inline-block;
//     border-radius: 4px;
//     vertical-align: middle;
//     border: ${props => (props.checked ? "2px solid transparent" : "2px solid #cccccc")};
//     outline: none;
//     transform: scale(1.5);
//   }
//   & .contentWrap {
//     display: inline-block;
//     margin-left: 10px;
//     cursor: pointer;
//   }
// `;
// const Radio = ({ onClick, options, value, name }) => (
//   <div>
//     {options.map((item, i) => (
//       <div onClick={() => onClick(item.value)}>
//         <input
//           type="radio"
//           checked={item.value === value}
//           name={name}
//           value={item.value}
//         />
//         <label>{item.label}</label>
//       </div>
//     ))}
//   </div>
// );
// export default Radio;
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
;
;
const CheckboxWrapper = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].div.withConfig({
    displayName: "Radio__CheckboxWrapper",
    componentId: "sc-6f4effd8-0"
})`
  outline: none;
  margin: 10px 0;

  & input[type="radio"] {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    transform: scale(1.3);
  }

  & .contentWrap {
    display: inline-block;
    margin-left: 10px;
    cursor: pointer;
  }
`;
_c = CheckboxWrapper;
const Radio = ({ onClick, options, value, name })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: options.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckboxWrapper, {
                checked: item.value === value,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "radio",
                        checked: item.value === value,
                        name: name,
                        value: item.value,
                        onChange: ()=>onClick(item.value)
                    }, void 0, false, {
                        fileName: "[project]/base/comps/Radio.js",
                        lineNumber: 69,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: item.label
                    }, void 0, false, {
                        fileName: "[project]/base/comps/Radio.js",
                        lineNumber: 76,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, i, true, {
                fileName: "[project]/base/comps/Radio.js",
                lineNumber: 68,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)))
    }, void 0, false, {
        fileName: "[project]/base/comps/Radio.js",
        lineNumber: 66,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c1 = Radio;
const __TURBOPACK__default__export__ = Radio;
var _c, _c1;
__turbopack_context__.k.register(_c, "CheckboxWrapper");
__turbopack_context__.k.register(_c1, "Radio");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/base/comps/Button.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProgButton",
    ()=>ProgButton,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [client] (ecmascript)");
;
;
;
//import Loader from "../libs/SpinKit";
const Loader = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
    children: "..."
}, void 0, false, {
    fileName: "[project]/base/comps/Button.js",
    lineNumber: 5,
    columnNumber: 16
}, ("TURBOPACK compile-time value", void 0));
const ring = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["keyframes"]`
0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;
const StyledButton = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])('button').withConfig({
    displayName: "Button__StyledButton",
    componentId: "sc-35cf991c-0"
})`
  background-color: var(--lightHColor);
  border-width: 2px;
  color: #363636;
  cursor: pointer;
  justify-content: center;
  padding: calc(0.5em - 2px) 1em;
  text-align: center;
  margin-left: auto;
  white-space: nowrap;
  border-radius: 3px;
  border-color: transparent;
  box-shadow: var(--shadow);
  ${(props)=>props.primary && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["css"]`
      background-color: var(--darkColor);

      color: #fff;
    `}
  ${(props)=>props.secondary && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["css"]`
      background-color: var(--mediumColor);
      color: #fff;

      a {
        color: white;
      }
    `}
  .updating {
    display: none;
  }

  &.callInProg {
    .updating {
      display: inline-block;
      position: relative;
      width: 20px;
      height: 20px;
      margin-left: 15px;

      div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 20px;
        height: 20px;
        margin: 1px;
        border: 2px solid #fff;
        border-radius: 50%;
        animation: ${ring} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: #fff transparent transparent transparent;
      }

      div:nth-child(1) {
        animation-delay: -0.45s;
      }
      div:nth-child(2) {
        animation-delay: -0.3s;
      }
      div:nth-child(3) {
        animation-delay: -0.15s;
      }
    }
  }
`;
_c = StyledButton;
const ProgButton = ({ children, updating, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StyledButton, {
        ...props,
        ref: props.innerRef,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "updating",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                        fileName: "[project]/base/comps/Button.js",
                        lineNumber: 89,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                        fileName: "[project]/base/comps/Button.js",
                        lineNumber: 90,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                        fileName: "[project]/base/comps/Button.js",
                        lineNumber: 91,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                        fileName: "[project]/base/comps/Button.js",
                        lineNumber: 92,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/base/comps/Button.js",
                lineNumber: 88,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/base/comps/Button.js",
        lineNumber: 86,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c1 = ProgButton;
const Button = ({ children, updating, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StyledButton, {
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/base/comps/Button.js",
        lineNumber: 99,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_c2 = Button;
const __TURBOPACK__default__export__ = Button;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "StyledButton");
__turbopack_context__.k.register(_c1, "ProgButton");
__turbopack_context__.k.register(_c2, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/base/comps/ButtonBar.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [client] (ecmascript)");
;
const ButtonBar = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].div.withConfig({
    displayName: "ButtonBar",
    componentId: "sc-53964f1e-0"
})`
  display: flex;
  justify-content: ${(props)=>props.align === 'left' ? 'flext-start' : 'flex-end'};
  margin: 20px 0;
  align-items: flex-start;
  & > * {
    margin-left: 20px;
  }
  flex-wrap: wrap;
  align-items: center;
  @media print {
    display: none;
  }

  @media screen and (max-width: 500px) {
    /*display: none;*/
  }
`;
const __TURBOPACK__default__export__ = ButtonBar;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/base/comps/Overlay.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [client] (ecmascript)");
;
;
;
const OverlayWrapper = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].div.withConfig({
    displayName: "Overlay__OverlayWrapper",
    componentId: "sc-78964d82-0"
})`
  opacity: 0;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  background: rgba(
    0,
    0,
    0,
    ${(props)=>props.bgOpacity ? props.bgOpacity : 0}
  );
  z-index: 100;
  transform: scale(0);
  transition: all 0.2s;
  color: #2d3237;
  &.active {
    transform: scale(1);
    opacity: 1 !important;
  }

  & .overlayContent {
    pointer-events: auto;
    left: ${(props)=>`${props.left || 400}px`};
    top: ${(props)=>`${props.top || 300}px`};
    width: ${(props)=>`${props.width || 400}px`};
    height: ${(props)=>props.height ? `${props.height}px` : 'auto'};
    overflow-y: auto;
    position: absolute;
    background-color: ${(props)=>props.bgColor || 'white'};
    box-shadow: 0 2px 1px 1px rgba(140, 150, 160, 0.5);

    @media (max-width: 500px) {
      left: 0;
      top: 100px;
      width: 100%;
    }
  }

  .background {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    /* filter: blur(1rem);*/
    background-color: #bbbbbb;
    opacity: 0.3;
    pointer-events: auto;
  }

  .body {
    padding: ${(props)=>props.padding || '10px'};
    background-color: ${(props)=>props.bgColor || 'white'};
  }

  & .overlayClose {
    cursor: pointer;
  }

  & .title {
    font-size: 24px;
    font-family: 'Avenir-Medium', sans-serif;
    border-bottom: 1px solid #eee;
    background-color: var(--darkColor2);
    color: white;
    padding: 15px;
    display: flex;
    justify-content: space-between;
  }

  @media print {
    display: none;
  }
`;
_c = OverlayWrapper;
class Overlay extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].Component {
    constructor(){
        super();
        this.dragPanel = null;
        this.rootBox = {};
        this.dragOffset = null;
    }
    panelDragStart = (e)=>{
        e.preventDefault();
        this.dragPanel = e.currentTarget.parentNode;
        this.dragOffset = {
            x: e.clientX - this.dragPanel.getBoundingClientRect().left,
            y: e.clientY - this.dragPanel.getBoundingClientRect().top
        };
        this.rootBox = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };
        document.addEventListener('mousemove', this.panelDragMove);
        document.addEventListener('mouseup', this.panelDragStop);
    };
    panelDragMove = (e)=>{
        let x = e.clientX - this.dragOffset.x;
        if (x < this.rootBox.left) x = this.rootBox.left;
        if (x > this.rootBox.left + this.rootBox.width - this.dragPanel.getBoundingClientRect().width) {
            x = this.rootBox.left + this.rootBox.width - this.dragPanel.getBoundingClientRect().width;
        }
        let y = e.clientY - this.dragOffset.y + window.scrollY;
        if (y < this.rootBox.top) y = this.rootBox.top;
        if (y > this.rootBox.top + this.rootBox.height - this.dragPanel.getBoundingClientRect().height) {
            y = this.rootBox.top + this.rootBox.height - this.dragPanel.getBoundingClientRect().height;
        }
        this.dragPanel.style.left = `${x}px`;
        this.dragPanel.style.top = `${y - window.scrollY}px`;
    };
    panelDragStop = (e)=>{
        document.removeEventListener('mousemove', this.panelDragMove);
        document.removeEventListener('mouseup', this.panelDragStop);
    };
    render() {
        const { title, children, onClose, ...otherProps } = this.props;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OverlayWrapper, {
            ...otherProps,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "background",
                    onClick: (e)=>{
                        e.stopPropagation();
                        e.preventDefault();
                    }
                }, void 0, false, {
                    fileName: "[project]/base/comps/Overlay.js",
                    lineNumber: 147,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overlayContent",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "title",
                            onMouseDown: this.panelDragStart,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/base/comps/Overlay.js",
                                    lineNumber: 156,
                                    columnNumber: 13
                                }, this),
                                onClose && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "overlayClose icon-times",
                                    onClick: onClose,
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/base/comps/Overlay.js",
                                    lineNumber: 158,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/base/comps/Overlay.js",
                            lineNumber: 155,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "body",
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/base/comps/Overlay.js",
                            lineNumber: 163,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/base/comps/Overlay.js",
                    lineNumber: 154,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/base/comps/Overlay.js",
            lineNumber: 146,
            columnNumber: 7
        }, this);
    }
}
const __TURBOPACK__default__export__ = Overlay;
var _c;
__turbopack_context__.k.register(_c, "OverlayWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/base/comps/Select.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import InputWrap from './InputWrap';
// import Svg from 'components/Svg';
// const Styled = styled.div`
//   width: ${(props) => props.width || '130px'};
//   position: relative;
//   min-height: 35px;
//   .control {
//     display: flex;
//     cursor: pointer;
//     border-bottom: 1px solid #ccc;
//     padding: 3px;
//     .placeholder {
//       flex-grow: 1;
//       overflow: hidden;
//       width: calc(100% -15px);
//       white-space: nowrap;
//       text-overflow: ellipsis;
//     }
//   }
//   .menu {
//     background-color: white;
//     max-height: 400px;
//     overflow-y: auto;
//     position: absolute;
//     top: 0;
//     width: 100%;
//     z-index: 1000;
//     box-shadow: var(--shadow);
//     > div {
//       padding: 5px 7px;
//       cursor: pointer;
//       border-bottom: 1px solid #ccc;
//       &:hover {
//         background-color: var(--lightColor);
//       }
//       &.selected {
//         background-color: var(--lightHColor);
//       }
//     }
//   }
// `;
// export default function Select(props) {
//   const [state, setState] = useState({ open: false });
//   let options = props.options;
//   if (typeof options[0] === 'string') {
//     options = options.map((str) => ({ label: str, value: str }));
//   }
//   let selected = options.find(
//     (option) => option.value === props.value || option.id === props.value
//   );
//   useEffect(() => {
//     document.addEventListener('click', outsideClick);
//     return () => {
//       document.removeEventListener('click', outsideClick);
//     };
//   });
//   const outsideClick = () => setState((state) => ({ ...state, open: false }));
//   return (
//     <InputWrap label={props.label} sameLine={props.sameLine || false}>
//       <Styled
//         width={props.width}
//         tabIndex="0"
//         onBlur={() => {
//           //setState({ ...state, open: false });
//         }}
//       >
//         {!state.open && (
//           <div
//             className="control"
//             onClick={(e) => {
//               e.stopPropagation();
//               setState({ ...state, open: true });
//             }}
//           >
//             <div className="placeholder">
//               {selected ? selected.label : 'Select'}
//             </div>
//             <Svg
//               id="caretDown"
//               size="12"
//               style={{ position: 'absolute', right: 10, top: 10 }}
//             />
//           </div>
//         )}
//         {state.open && (
//           <div className="menu">
//             {options.map((item) => (
//               <div
//                 onClick={() => {
//                   props.onChange(item);
//                   setState({ ...state, open: false });
//                 }}
//               >
//                 {item.label}{' '}
//               </div>
//             ))}
//           </div>
//         )}
//         {/*
// <DropDownMini
//             width={props.width || 200}
//             options={props.options}
//             onChange={props.onChange}
//             value={props.value}
//             disabled={props.disabled}
//             />
//             */}
//       </Styled>
//     </InputWrap>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>Select
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$InputWrap$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/InputWrap.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Svg.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const Styled = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].div.withConfig({
    displayName: "Select__Styled",
    componentId: "sc-f454b202-0"
})`
  width: ${(props)=>props.width || '130px'};
  position: relative;
  min-height: 35px;

  .control {
    display: flex;
    cursor: pointer;
    border-bottom: 1px solid #ccc;
    padding: 3px;

    .placeholder {
      flex-grow: 1;
      overflow: hidden;
      width: calc(100% - 15px);
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .menu {
    background-color: white;
    max-height: 400px;
    overflow-y: auto;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 1000;
    box-shadow: var(--shadow);

    > div {
      padding: 5px 7px;
      cursor: pointer;
      border-bottom: 1px solid #ccc;

      &:hover {
        background-color: var(--lightColor);
      }

      &.selected {
        background-color: var(--lightHColor);
      }
    }
  }
`;
_c = Styled;
function Select(props) {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        open: false
    });
    // Convert string array → {label, value}
    let options = props.options;
    if (typeof options[0] === 'string') {
        options = options.map((str)=>({
                label: str,
                value: str
            }));
    }
    const selected = options.find((option)=>option.value === props.value || option.id === props.value);
    // --- FIXED: outsideClick must be declared BEFORE useEffect
    const outsideClick = ()=>{
        setState((prev)=>({
                ...prev,
                open: false
            }));
    };
    // --- FIXED: added dependency array & ensured function exists
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Select.useEffect": ()=>{
            document.addEventListener('click', outsideClick);
            return ({
                "Select.useEffect": ()=>document.removeEventListener('click', outsideClick)
            })["Select.useEffect"];
        }
    }["Select.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$InputWrap$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        label: props.label,
        sameLine: props.sameLine || false,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Styled, {
            width: props.width,
            tabIndex: "0",
            children: [
                !state.open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "control",
                    onClick: (e)=>{
                        e.stopPropagation();
                        setState({
                            ...state,
                            open: true
                        });
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "placeholder",
                            children: selected ? selected.label : 'Select'
                        }, void 0, false, {
                            fileName: "[project]/base/comps/Select.js",
                            lineNumber: 208,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            id: "caretDown",
                            size: "12",
                            style: {
                                position: 'absolute',
                                right: 10,
                                top: 10
                            }
                        }, void 0, false, {
                            fileName: "[project]/base/comps/Select.js",
                            lineNumber: 211,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/base/comps/Select.js",
                    lineNumber: 201,
                    columnNumber: 11
                }, this),
                state.open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "menu",
                    children: options.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            onClick: ()=>{
                                props.onChange(item);
                                setState({
                                    ...state,
                                    open: false
                                });
                            },
                            children: item.label
                        }, item.value || item.id || i, false, {
                            fileName: "[project]/base/comps/Select.js",
                            lineNumber: 222,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/base/comps/Select.js",
                    lineNumber: 220,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/base/comps/Select.js",
            lineNumber: 199,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/base/comps/Select.js",
        lineNumber: 198,
        columnNumber: 5
    }, this);
}
_s(Select, "NvY0Vcz1+QuIqfPoTEUSp6ClhI8=");
_c1 = Select;
var _c, _c1;
__turbopack_context__.k.register(_c, "Styled");
__turbopack_context__.k.register(_c1, "Select");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/base/comps/Section.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
;
;
const SectionWrapper = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].div.withConfig({
    displayName: "Section__SectionWrapper",
    componentId: "sc-864b9930-0"
})`
  margin: 10px;
  padding: 15px;
  & h2 {
    font-size: 24px;
    letter-spacing: 0;
    display: block;
    margin-bottom: 15px;
    font-weight: normal;
    font-family: var(--font1);
  }

  .sec-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  & > .sectionBody {
    background: white;
    height: auto;
    box-shadow: 0 2px 1px 1px rgba(140, 150, 160, 0.5);
    border-radius: 3px;
    padding: 20px 0;
    margin-bottom: 25px;
    margin-left: 2px;
    padding: 20px;
    min-width: 300px;

    @media print {
      box-shadow: none;
    }
  }

  label {
    font-weight: bold;
    font-size: 0.8rem;
  }
  /*
  @media screen and (max-width: 500px) {
    padding: 0;
    margin: 10px 0;
    & > .sectionBody {
      box-shadow: none;
      padding: 10px 5px;
      width: 100%;
    }
  }*/
`;
_c = SectionWrapper;
const Section = ({ title, style, children, btnBar })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionWrapper, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sec-head",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/base/comps/Section.js",
                        lineNumber: 57,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    btnBar
                ]
            }, void 0, true, {
                fileName: "[project]/base/comps/Section.js",
                lineNumber: 56,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sectionBody",
                style: style,
                children: children
            }, void 0, false, {
                fileName: "[project]/base/comps/Section.js",
                lineNumber: 61,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/base/comps/Section.js",
        lineNumber: 55,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c1 = Section;
const __TURBOPACK__default__export__ = Section;
var _c, _c1;
__turbopack_context__.k.register(_c, "SectionWrapper");
__turbopack_context__.k.register(_c1, "Section");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/base/comps/LinkButton.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
;
;
const LinkButtonStyled = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].div.withConfig({
    displayName: "LinkButton__LinkButtonStyled",
    componentId: "sc-620befe9-0"
})`
  padding: 10px;
  text-align: right;
  font-size: 0.8em;
  text-decoration: underline;
  cursor: pointer;
`;
_c = LinkButtonStyled;
const LinkButton = ({ children, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LinkButtonStyled, {
        ...props,
        role: 'button',
        children: children
    }, void 0, false, {
        fileName: "[project]/base/comps/LinkButton.js",
        lineNumber: 13,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c1 = LinkButton;
const __TURBOPACK__default__export__ = LinkButton;
var _c, _c1;
__turbopack_context__.k.register(_c, "LinkButtonStyled");
__turbopack_context__.k.register(_c1, "LinkButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/base/comps/index.js [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$InputWrap$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/InputWrap.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Input$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Input.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$InputNumber$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/InputNumber.js [client] (ecmascript)");
//export { default as TextArea } from "./TextArea";
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Checkbox$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Checkbox.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Radio$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Radio.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Button.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$ButtonBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/ButtonBar.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Overlay$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Overlay.js [client] (ecmascript)");
//export { default as DropDown } from './DropDown';
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Select$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Select.js [client] (ecmascript)");
/*
export { default as DropDown } from "../core/DropDown";
export { default as DropDownMini } from "../core/DropDownMini";
export { default as FuzzyDropDown } from "../core/FuzzyDropDown";
export { default as Menu } from "../core/Menu";


export { default as OverlayFullView } from "./OverlayFullView";

export { default as ErrorOverlay } from "./ErrorOverlay";
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Section$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Section.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$LinkButton$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/LinkButton.js [client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/base/comps/Button.js [client] (ecmascript) <export default as Button>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Button.js [client] (ecmascript)");
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
    getHomeConfig: ()=>api.get('/v1/konzeptes/config'),
    // --- SEQUENCE ---
    getSequenceProgress: (uid, aid)=>api.get(`/sequence/progress/${uid}/${aid}`, {
            params: {
                t: new Date().getTime()
            }
        }),
    saveSequenceProgress: (payload)=>api.post('/sequence/progress', payload),
    completeSequence: (payload)=>api.post('/sequence/complete', payload)
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/base/comps/Select.js [client] (ecmascript) <export default as Select>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Select$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Select$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Select.js [client] (ecmascript)");
}),
"[project]/comps/curriculumViews/IconViewMini.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>IconView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/apiService.js [client] (ecmascript)"); // Imported apiService
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/base/comps/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Select$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__ = __turbopack_context__.i("[project]/base/comps/Select.js [client] (ecmascript) <export default as Select>");
;
var _s = __turbopack_context__.k.signature();
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
  padding: 20px;
  // background-color: white;
  color: var(--darkColor);
  position: relative;
  user-select: none;
  margin: 0 auto;
  font-size: var(--font2);

  main {
    max-width: 800px;
  }

  h1 {
    font-size: 1.5rem;
    text-align: center;
    text-decoration: underline;
  }

  .topics {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .card {
    display: flex;
    .img {
      background-size: contain;
      background-repeat: no-repeat;
      margin: 0 auto;
    }

    .label,
    .smLabel {
      text-align: center;
    }

    .hoverdesc {
      position: absolute;
      left: -1000px;
      width: 300px;
      background-color: orange;
      padding: 10px;
      border-radius: 10px;
      color: white;
      top: 100px;
      box-shadow: var(--shadow);
      z-index: 1;
    }

    &:hover .hoverdesc {
      /*left: 0;*/
    }
  }

  .infobar {
    margin: -10px;
    padding: 5px 10px 15px 10px;
    font-size: 0.8rem;
    background-color: var(--darkColor2);
    color: white;

    a:hover {
      color: white;
    }
  }

  .descCard {
    display: flex;
    align-items: center;

    .desc {
      max-width: 250px;
      margin-right: 15px;
    }

    .title {
      margin-bottom: 10px;
      font-size: 1.2rem;
    }
  }

  .hilight {
    background-color: var(--darkColor2);
    box-shadow: var(--shadow);

    font-size: 2rem;
    text-align: center;
    margin-bottom: 20px;
    letter-spacing: 2px;
    a {
      color: white;
    }
  }

  .lang-contact {
    font-size: 0.9rem;
  }

  .flex-sb {
    display: flex;
    justify-content: space-around;
  }
`;
_c = Styled;
const defaultCardStyle = {
    width: 120,
    margin: '25px 0',
    borderRadius: 10
};
// --- MODIFIED TO ACCEPT ITEM OBJECT ---
const getIconStyle = (item, data)=>{
    let iconStyle = data.iconStyle || {
        width: 80,
        height: 80
    };
    // 1. API Image Handling - UPDATED TO DYNAMIC URL
    if (item && item.id && !isNaN(item.id)) {
        const apiUrl = __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].getIconUrl(item.id);
        iconStyle.backgroundImage = `url(${apiUrl})`;
        return iconStyle;
    }
    // 2. Static Image Handling (Original Logic)
    const img = item; // assuming item passed was img string in old code
    const imgPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getImage"])(`${data.iconsLoc || 'icons'}/${img}.png`);
    const resolveImg = (src)=>{
        if (!src) return src;
        if (src.indexOf('http') === 0) return src;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["publicPath"])(src.startsWith('/') ? src : `/${src}`);
    };
    iconStyle.backgroundImage = `url(${resolveImg(imgPath)})`;
    return iconStyle;
};
function IconView(props) {
    _s();
    //const {title, menu, onPick} = props;
    let config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getLocalItem"])('config', {});
    let defaultGrade;
    const data = props.data || {};
    if (data.grades) {
        let defaultItem = data.grades.find((item)=>item.default === true);
        if (defaultItem) {
            defaultGrade = defaultItem.id;
        }
    }
    let [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        selectedGrade: config.selectedGrade || defaultGrade
    });
    let menu = data.list || [];
    if (data.grades) {
        let matches = state.selectedGrade.match(/(\d+)/);
        let gradeNo = matches && +matches[0] || 0;
        menu = menu.filter((item)=>{
            if (!item.grade) {
                return false;
            }
            let range = item.grade.split('-').map((no)=>+no);
            if (range.length === 1) {
                return range[0] === gradeNo;
            } else {
                return range[0] <= gradeNo && range[1] >= gradeNo;
            }
        //item.grade.indexOf(state.selectedGrade) !== -1
        });
    }
    const tocConfig = data.config || {};
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Styled, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                style: data.style || {
                    maxWidth: 1024,
                    fontSize: '1rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-sb",
                        children: [
                            data.label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                style: data.titleStyle || {},
                                children: data.label
                            }, void 0, false, {
                                fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                lineNumber: 199,
                                columnNumber: 26
                            }, this),
                            data.grades && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Select$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                width: "150px",
                                options: data.grades,
                                value: state.selectedGrade,
                                bgColor: "inherit",
                                onChange: (e)=>{
                                    const cfg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getLocalItem"])('config', {});
                                    cfg.selectedGrade = e.value || e.id;
                                    cfg.selectedSubject = 'all';
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["setLocalItem"])('config', cfg);
                                    setState({
                                        ...state,
                                        selectedGrade: e.value || e.id
                                    });
                                }
                            }, void 0, false, {
                                fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                lineNumber: 201,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "topics",
                        children: menu.map((item)=>{
                            const localStyle = item.style || {};
                            let style = data.cardStyle || defaultCardStyle;
                            style = {
                                ...style,
                                ...localStyle
                            };
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "card",
                                style: style,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/p/${item.id}`,
                                    children: [
                                        !tocConfig.type && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "img",
                                                    style: {
                                                        // UPDATED: Pass 'item' object instead of 'item.img'
                                                        ...getIconStyle(item, data),
                                                        backgroundImage: `url(${function() {
                                                            // UPDATED: Check for ID first - DYNAMIC URL
                                                            if (item.id && !isNaN(item.id)) {
                                                                return __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].getIconUrl(item.id);
                                                            }
                                                            // Original Logic Fallback
                                                            const imgPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getImage"])(`${data.iconsLoc || 'icons'}/${item.img}.png`);
                                                            if (!imgPath) return imgPath;
                                                            if (imgPath.indexOf('http') === 0) return imgPath;
                                                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["publicPath"])(imgPath.startsWith('/') ? imgPath : `/${imgPath}`);
                                                        }()})`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                    lineNumber: 228,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "label",
                                                    style: data.labelStyle || {},
                                                    children: item.label
                                                }, void 0, false, {
                                                    fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                    lineNumber: 250,
                                                    columnNumber: 23
                                                }, this),
                                                item.smLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "smLabel",
                                                    style: data.smLabelStyle || {},
                                                    children: item.smLabel
                                                }, void 0, false, {
                                                    fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                    lineNumber: 254,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true),
                                        tocConfig.type === 'descType' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "descCard",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "label title",
                                                            style: data.labelStyle || {},
                                                            children: item.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                            lineNumber: 266,
                                                            columnNumber: 25
                                                        }, this),
                                                        item.smLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "smLabel",
                                                            style: data.smLabelStyle || {},
                                                            children: item.smLabel
                                                        }, void 0, false, {
                                                            fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                            lineNumber: 273,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "desc",
                                                            style: data.descStyle || {},
                                                            children: item.desc
                                                        }, void 0, false, {
                                                            fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                            lineNumber: 280,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                    lineNumber: 265,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "img",
                                                    style: {
                                                        // UPDATED: Pass 'item' object
                                                        ...getIconStyle(item, data),
                                                        backgroundImage: `url(${function() {
                                                            // UPDATED: Check for ID first - DYNAMIC URL
                                                            if (item.id && !isNaN(item.id)) {
                                                                return __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].getIconUrl(item.id);
                                                            }
                                                            // Original Logic
                                                            const imgPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getImage"])(`${data.iconsLoc || 'icons'}/${item.img}.png`);
                                                            if (!imgPath) return imgPath;
                                                            if (imgPath.indexOf('http') === 0) return imgPath;
                                                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["publicPath"])(imgPath.startsWith('/') ? imgPath : `/${imgPath}`);
                                                        }()})`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                    lineNumber: 284,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                            lineNumber: 264,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                    lineNumber: 225,
                                    columnNumber: 17
                                }, this)
                            }, item.id, false, {
                                fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                lineNumber: 223,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                        lineNumber: 217,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                lineNumber: 197,
                columnNumber: 7
            }, this),
            data.moreActivities && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hilight",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: `/p/${data.moreActivities}`,
                        children: "More Activities"
                    }, void 0, false, {
                        fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                        lineNumber: 317,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                    lineNumber: 316,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                lineNumber: 315,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/comps/curriculumViews/IconViewMini.js",
        lineNumber: 196,
        columnNumber: 5
    }, this);
}
_s(IconView, "f05vxLCDxlKhZnAO3JFJ9n0c2H4=");
_c1 = IconView;
var _c, _c1;
__turbopack_context__.k.register(_c, "Styled");
__turbopack_context__.k.register(_c1, "IconView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/base/comps/Input.js [client] (ecmascript) <export default as Input>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Input$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Input$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Input.js [client] (ecmascript)");
}),
"[project]/comps/curriculumViews/PIconView.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PIconView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [client] (ecmascript)");
//import { useNavigate } from 'react-router-dom';
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/base/comps/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Input$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__ = __turbopack_context__.i("[project]/base/comps/Input.js [client] (ecmascript) <export default as Input>");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Select$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__ = __turbopack_context__.i("[project]/base/comps/Select.js [client] (ecmascript) <export default as Select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Svg.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
const Styled = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].div.withConfig({
    displayName: "PIconView__Styled",
    componentId: "sc-2c806a8d-0"
})`
  background-color: var(--l2);
  color: var(--darkColor);
  position: relative;
  h1 {
    font-size: 1.5rem;
    text-align: center;
    text-decoration: underline;
    font-style: italic;
  }

  .topics {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
  }

  .gradeLabel {
    font-size: 1.5rem;
    line-height: 1rem;
    margin: 10px;
    text-decoration: underline;
  }

  .infobar {
    margin: -10px;
    padding: 5px 10px 15px 10px;
    font-size: 0.8rem;
    background-color: var(--darkColor2);
    color: white;

    a:hover {
      color: white;
    }
  }

  .view {
    position: relative;
  }

  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
  }

  .tocHeader {
    display: flex;
    padding: 2px 20px;
    background-color: var(--lightHColor);
    justify-content: space-between;
    align-items: center;

    &.disable {
      background-color: var(--lightColor);
      color: gray;
    }
    .caption {
      font-size: 0.8rem;
      font-weight: bold;
    }
  }

  .otherTopics {
    .subject {
      padding: 10px;
      font-weight: bold;
    }

    h3 {
      text-align: center;
      text-decoration: underline;
    }

    li .item {
      padding: 5px 10px;
      // background-color: white;
      margin: 10px 10px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      width: 400px;
      /*
      box-shadow: var(--shadow);
      border-radius: 15px;
      */
      border-bottom: 1px solid var(--mediumColor);

      .imgIcon {
        width: 60px;
        height: 60px;
        display: inline-block;
        margin-right: 10px;
      }

      .main {
        flex-grow: 1;
      }

      .sno {
        margin-right: 15px;
        padding: 5px;
        background-color: var(--darkColor2);
        min-width: 35px;
        text-align: center;
        border-radius: 50%;
        color: white;
      }

      a {
        display: inline-block;
      }

      .captionBar {
        display: flex;
        padding-right: 5px;
        .caption {
          flex-grow: 1;
          cursor: pointer;
        }
      }
    }
  }
  .infoBar {
    font-size: 0.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .score {
      font-weight: bold;
      font-style: italic;
      padding: 5px 10px;
    }
  }

  .progress {
    display: inline-block;
    width: 100px;
    border: 1px solid var(--lightHColor);
    height: 7px;
    margin-right: 10px;
    .bar {
      background-color: var(--darkColor2);
      height: 7px;
    }
  }

  .favorites {
    position: absolute;
    cursor: pointer;
    top: 10px;
    right: 10px;
    font-size: 0.8rem;
    text-decoration: underline;
  }

  .noStars {
    padding: 10px;
    font-style: italic;
    padding-top: 40px;
  }

  .group {
    display: flex;
    flex-wrap: wrap;
  }

  .filterWrap {
    display: flex;
    padding-right: 50px;
  }

  @media only screen and (max-width: 800px) {
    .otherTopics li .item {
      width: 350px;
    }

    .tocHeader {
      flex-direction: column;
    }
  }
`;
_c = Styled;
function PIconView(props) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    let { data } = props;
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        loading: true,
        showFavorites: false
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PIconView.useEffect": ()=>{
            let config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getLocalItem"])('config', {});
            let masterProgress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getLocalItem"])('masterProgress', {});
            setState({
                "PIconView.useEffect": (s)=>({
                        ...s,
                        config,
                        masterProgress,
                        selectedGrade: config.selectedGrade || 'all',
                        selectedSubject: config.selectedSubject || 'all',
                        isSearch: !!config.searchText,
                        searchText: config.searchText || '',
                        favorites: config.favorites || [],
                        loading: false
                    })
            }["PIconView.useEffect"]);
        }
    }["PIconView.useEffect"], []);
    if (state.loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/comps/curriculumViews/PIconView.js",
            lineNumber: 268,
            columnNumber: 12
        }, this);
    }
    let sGrade = state.selectedGrade;
    let sSub = state.selectedSubject;
    if (state.searchText.length >= 3) {
        sGrade = 'all';
        sSub = 'all';
    }
    let iAmMember = true;
    let subjectList = data.list.map(({ id, label })=>({
            id,
            label
        }));
    subjectList = [
        {
            id: 'all',
            label: 'All'
        },
        ...subjectList
    ];
    var isSubjectPicker = true;
    if (data.list.length === 1) {
        isSubjectPicker = false;
    }
    var isGradePicker = !!data.grades;
    let gradeList = [];
    if (isGradePicker) {
        gradeList = [
            {
                id: 'all',
                label: 'All'
            },
            ...data.grades
        ];
    }
    let filteredSubject = subjectList;
    let matches = sGrade.match(/(\d+)/);
    let gradeNo = matches && +matches[0] || 0;
    if (isSubjectPicker && sGrade !== 'all') {
        filteredSubject = subjectList.filter((subject)=>{
            if (subject.id === 'all') {
                return true;
            }
            let list = data.list.find((item)=>item.id === subject.id).list;
            list = list.filter((item)=>{
                if (!item.grade) {
                    return false;
                }
                let range = item.grade.split('-').map((no)=>+no);
                let bool;
                if (range.length === 1) {
                    bool = range[0] === gradeNo;
                } else {
                    bool = range[0] <= gradeNo && range[1] >= gradeNo;
                }
                return bool;
            });
            return list.length !== 0;
        });
    }
    let subjects;
    if (sSub === 'all' || state.showFavorites) {
        subjects = filteredSubject.slice(1, subjectList.length);
    } else {
        if (filteredSubject.length === 2) {
            subjects = filteredSubject.slice(1, subjectList.length);
        } else {
            subjects = filteredSubject.filter((item)=>item.id === sSub);
        }
    }
    const haveSearchBar = isGradePicker || isSubjectPicker;
    if (haveSearchBar && state.searchText.length >= 3) {
        for(let i = 0; i < subjects.length; i++){
            let list = data.list.find((item)=>item.id === subjects[i].id).list;
            list = list.filter((item)=>item.label.toLowerCase().indexOf(state.searchText) !== -1);
            subjects[i].list = list;
        }
    } else {
        for(let i = 0; i < subjects.length; i++){
            let list = data.list.find((item)=>item.id === subjects[i].id).list;
            if (isGradePicker && sGrade !== 'all' && !state.showFavorites) {
                list = list.filter((item)=>{
                    let range = item.grade.split('-').map((no)=>+no);
                    let bool;
                    if (range.length === 1) {
                        bool = range[0] === gradeNo;
                    } else {
                        bool = range[0] <= gradeNo && range[1] >= gradeNo;
                    }
                    return bool;
                });
            }
            if (state.showFavorites) {
                list = list.filter((item)=>{
                    let bool = state.favorites.indexOf(item.id) !== -1;
                    return bool;
                });
            }
            subjects[i].list = list;
        }
    }
    const handleFilterChange = (value, type)=>{
        let config = {
            ...state.config
        };
        let newState;
        if (type === 'selectedGrade') {
            newState = {
                ...state,
                [type]: value,
                selectedSubject: 'all',
                showFavorites: false
            };
            config[type] = value;
            config.selectedSubject = 'all';
        } else {
            newState = {
                ...state,
                [type]: value,
                showFavorites: false
            };
            config[type] = value;
        }
        setState({
            ...newState,
            config
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["setLocalItem"])('config', config);
    };
    const handleItemClick = (item)=>{
        if (state.searchText.length >= 3) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["setLocalItem"])('config', {
                ...state.config,
                searchText: state.searchText
            });
        }
        router.push(`/p/${item.id}`);
    // router.push(`/playlist?id=${item.id}`);
    };
    subjects = subjects.filter((item)=>item.list.length !== 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Styled, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `tocHeader ${state.showFavorites ? 'disable' : ''}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        style: {
                            marginBottom: 20,
                            textDecoration: 'underline'
                        },
                        children: "All Playlists"
                    }, void 0, false, {
                        fileName: "[project]/comps/curriculumViews/PIconView.js",
                        lineNumber: 413,
                        columnNumber: 9
                    }, this),
                    (isGradePicker || isSubjectPicker) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "filterWrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 200
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "caption",
                                        children: "Class / Grade"
                                    }, void 0, false, {
                                        fileName: "[project]/comps/curriculumViews/PIconView.js",
                                        lineNumber: 419,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Select$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                        width: "130px",
                                        options: gradeList,
                                        value: state.selectedGrade,
                                        bgColor: "inherit",
                                        onChange: (e)=>{
                                            handleFilterChange(e.id, 'selectedGrade');
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/comps/curriculumViews/PIconView.js",
                                        lineNumber: 420,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/curriculumViews/PIconView.js",
                                lineNumber: 418,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 200
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "caption",
                                            children: "Subject"
                                        }, void 0, false, {
                                            fileName: "[project]/comps/curriculumViews/PIconView.js",
                                            lineNumber: 432,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Select$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                            width: "180px",
                                            options: filteredSubject,
                                            value: state.selectedSubject,
                                            bgColor: "inherit",
                                            onChange: (e)=>handleFilterChange(e.id, 'selectedSubject')
                                        }, void 0, false, {
                                            fileName: "[project]/comps/curriculumViews/PIconView.js",
                                            lineNumber: 433,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/comps/curriculumViews/PIconView.js",
                                    lineNumber: 431,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/comps/curriculumViews/PIconView.js",
                                lineNumber: 430,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Input$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__["Input"], {
                                value: state.searchText,
                                label: "Search",
                                autofocus: true,
                                style: {
                                    backgroundColor: state.searchText.length >= 3 ? 'var(--h2)' : 'var(--h)',
                                    borderBottom: '1px solid var(--d)'
                                },
                                onChange: (e)=>setState({
                                        ...state,
                                        searchText: e.target.value.toLowerCase().trim()
                                    })
                            }, void 0, false, {
                                fileName: "[project]/comps/curriculumViews/PIconView.js",
                                lineNumber: 442,
                                columnNumber: 13
                            }, this),
                            state.searchText.length >= 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: 'var(--h2)',
                                    fontWeight: 'bold',
                                    fontSize: '2rem',
                                    marginLeft: 10,
                                    marginTop: 10,
                                    cursor: 'pointer'
                                },
                                onClick: ()=>{
                                    const config = {
                                        ...state.config,
                                        searchText: ''
                                    };
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["setLocalItem"])('config', config);
                                    setState({
                                        ...state,
                                        searchText: ''
                                    });
                                },
                                children: "❌"
                            }, void 0, false, {
                                fileName: "[project]/comps/curriculumViews/PIconView.js",
                                lineNumber: 459,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/curriculumViews/PIconView.js",
                        lineNumber: 417,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/comps/curriculumViews/PIconView.js",
                lineNumber: 412,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `view subjectWrap ${state.showGradePick ? '' : 'goLeft'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "favorites",
                        onClick: ()=>setState({
                                ...state,
                                showFavorites: !state.showFavorites
                            }),
                        children: state.showFavorites ? `Show All` : `Show Favorites`
                    }, void 0, false, {
                        fileName: "[project]/comps/curriculumViews/PIconView.js",
                        lineNumber: 483,
                        columnNumber: 9
                    }, this),
                    subjects.map((subject)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "otherTopics",
                            children: [
                                subjects.length > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "subject",
                                    children: subject.label
                                }, void 0, false, {
                                    fileName: "[project]/comps/curriculumViews/PIconView.js",
                                    lineNumber: 495,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "subject",
                                    children: " "
                                }, void 0, false, {
                                    fileName: "[project]/comps/curriculumViews/PIconView.js",
                                    lineNumber: 497,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    style: {
                                        marginBottom: 20
                                    },
                                    children: subject.list.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                onClick: ()=>handleItemClick(item),
                                                className: "item",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "sno",
                                                        children: i + 1
                                                    }, void 0, false, {
                                                        fileName: "[project]/comps/curriculumViews/PIconView.js",
                                                        lineNumber: 503,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "main",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "captionBar",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "caption",
                                                                        children: [
                                                                            item.label,
                                                                            " "
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/comps/curriculumViews/PIconView.js",
                                                                        lineNumber: 506,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*!item.locked ||*/ iAmMember && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        onClick: (e)=>{
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            let { favorites } = state;
                                                                            if (favorites.indexOf(item.id) === -1) {
                                                                                favorites = [
                                                                                    ...favorites,
                                                                                    item.id
                                                                                ];
                                                                            } else {
                                                                                favorites = favorites.filter((id)=>id !== item.id);
                                                                            }
                                                                            const config = {
                                                                                ...state.config,
                                                                                favorites
                                                                            };
                                                                            setState({
                                                                                ...state,
                                                                                favorites
                                                                            });
                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["setLocalItem"])('config', config);
                                                                        },
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                                            id: "star",
                                                                            color: state.favorites.indexOf(item.id) === -1 ? '#bbb' : 'orange'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/comps/curriculumViews/PIconView.js",
                                                                            lineNumber: 526,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/comps/curriculumViews/PIconView.js",
                                                                        lineNumber: 509,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/comps/curriculumViews/PIconView.js",
                                                                lineNumber: 505,
                                                                columnNumber: 23
                                                            }, this),
                                                            state.masterProgress[item.id] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "infoBar",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "progress",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "bar",
                                                                                    style: {
                                                                                        width: state.masterProgress[item.id].progress + '%'
                                                                                    }
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/comps/curriculumViews/PIconView.js",
                                                                                    lineNumber: 542,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/comps/curriculumViews/PIconView.js",
                                                                                lineNumber: 541,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            state.masterProgress[item.id].progress,
                                                                            "%"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/comps/curriculumViews/PIconView.js",
                                                                        lineNumber: 540,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "score",
                                                                        children: [
                                                                            "Score: ",
                                                                            state.masterProgress[item.id].score,
                                                                            "%"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/comps/curriculumViews/PIconView.js",
                                                                        lineNumber: 552,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/comps/curriculumViews/PIconView.js",
                                                                lineNumber: 539,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/comps/curriculumViews/PIconView.js",
                                                        lineNumber: 504,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/comps/curriculumViews/PIconView.js",
                                                lineNumber: 502,
                                                columnNumber: 19
                                            }, this)
                                        }, item.id || i, false, {
                                            fileName: "[project]/comps/curriculumViews/PIconView.js",
                                            lineNumber: 501,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/comps/curriculumViews/PIconView.js",
                                    lineNumber: 499,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, subject.id, true, {
                            fileName: "[project]/comps/curriculumViews/PIconView.js",
                            lineNumber: 493,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/comps/curriculumViews/PIconView.js",
                lineNumber: 480,
                columnNumber: 7
            }, this),
            subjects.length === 0 && (state.showFavorites ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "noStars",
                children: "Your playlist favorites is empty. Click on the star in playlists to make them your favorites."
            }, void 0, false, {
                fileName: "[project]/comps/curriculumViews/PIconView.js",
                lineNumber: 567,
                columnNumber: 11
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "noStars",
                children: "Presently, there is no playlist in the selected category."
            }, void 0, false, {
                fileName: "[project]/comps/curriculumViews/PIconView.js",
                lineNumber: 572,
                columnNumber: 11
            }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/comps/curriculumViews/PIconView.js",
        lineNumber: 411,
        columnNumber: 5
    }, this);
}
_s(PIconView, "Wu2XCs7Yl9rekm26+bWGYPDE7R4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c1 = PIconView;
function getIcon(item) {
    //if (!item.img) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        id: "target"
    }, void 0, false, {
        fileName: "[project]/comps/curriculumViews/PIconView.js",
        lineNumber: 582,
        columnNumber: 10
    }, this);
//}
/*
  if (item.img.indexOf('.') === -1) {
    return <Svg id="target" />;
  } else {
    return (
      <img
        className="imgIcon"
        alt="icon"
        src={publicPath(`/img/icons/${item.img}`)}
      />
    );
  }*/ }
var _c, _c1;
__turbopack_context__.k.register(_c, "Styled");
__turbopack_context__.k.register(_c1, "PIconView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/comps/curriculumViews/SubCards.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SubCards
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/base/comps/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/base/comps/Button.js [client] (ecmascript) <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/index.js [client] (ecmascript)");
;
;
;
;
const Styled = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].div.withConfig({
    displayName: "SubCards__Styled",
    componentId: "sc-5169676b-0"
})`
  .cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 1400px;
  }

  .card {
    border: 1px solid #999;
    box-shadow: var(--shadow);
    margin: 20px;
    max-width: 400px;
    padding: 20px 20px 40px 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .label {
    text-align: center;
    margin-bottom: 15px;
  }

  .desc {
    flex-grow: 1;
  }

  h1 {
    text-align: center;
  }

  button {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .cardIcon {
    margin-top: -20px;
    margin-bottom: 20px;
  }
`;
_c = Styled;
function SubCards(props) {
    console.log('SubCards', props.toc.list);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Styled, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                children: props.toc.label
            }, void 0, false, {
                fileName: "[project]/comps/curriculumViews/SubCards.js",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "cards",
                children: props.toc.list.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card",
                        style: item.style || {},
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "label",
                                children: [
                                    item.labelPrefix && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '0.8rem',
                                            fontWeight: 'normal'
                                        },
                                        children: item.labelPrefix
                                    }, void 0, false, {
                                        fileName: "[project]/comps/curriculumViews/SubCards.js",
                                        lineNumber: 61,
                                        columnNumber: 17
                                    }, this),
                                    item.label,
                                    item.altLabel ? ` ( ${item.altLabel} ) ` : ''
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/curriculumViews/SubCards.js",
                                lineNumber: 59,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "desc",
                                        children: item.desc
                                    }, void 0, false, {
                                        fileName: "[project]/comps/curriculumViews/SubCards.js",
                                        lineNumber: 69,
                                        columnNumber: 15
                                    }, this),
                                    item.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        className: "cardIcon",
                                        src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["publicPath"])('/' + item.icon),
                                        style: props.toc.iconStyle || {}
                                    }, void 0, false, {
                                        fileName: "[project]/comps/curriculumViews/SubCards.js",
                                        lineNumber: 71,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/curriculumViews/SubCards.js",
                                lineNumber: 68,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                                primary: true,
                                onClick: ()=>props.onSelect(i),
                                children: "Start"
                            }, void 0, false, {
                                fileName: "[project]/comps/curriculumViews/SubCards.js",
                                lineNumber: 78,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/curriculumViews/SubCards.js",
                        lineNumber: 58,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/comps/curriculumViews/SubCards.js",
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/comps/curriculumViews/SubCards.js",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_c1 = SubCards;
var _c, _c1;
__turbopack_context__.k.register(_c, "Styled");
__turbopack_context__.k.register(_c1, "SubCards");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/comps/acts/McqAct.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "btn": "McqAct-module__X9w61W__btn",
  "container": "McqAct-module__X9w61W__container",
  "controls": "McqAct-module__X9w61W__controls",
  "correct": "McqAct-module__X9w61W__correct",
  "main": "McqAct-module__X9w61W__main",
  "mark": "McqAct-module__X9w61W__mark",
  "option": "McqAct-module__X9w61W__option",
  "optionLabel": "McqAct-module__X9w61W__optionLabel",
  "options": "McqAct-module__X9w61W__options",
  "passageBox": "McqAct-module__X9w61W__passageBox",
  "primary": "McqAct-module__X9w61W__primary",
  "question": "McqAct-module__X9w61W__question",
  "qwrap": "McqAct-module__X9w61W__qwrap",
  "radio": "McqAct-module__X9w61W__radio",
  "right": "McqAct-module__X9w61W__right",
  "score": "McqAct-module__X9w61W__score",
  "selected": "McqAct-module__X9w61W__selected",
  "small": "McqAct-module__X9w61W__small",
  "summaryItem": "McqAct-module__X9w61W__summaryItem",
  "title": "McqAct-module__X9w61W__title",
  "wrapper": "McqAct-module__X9w61W__wrapper",
  "wrong": "McqAct-module__X9w61W__wrong",
});
}),
"[project]/comps/acts/McqAct.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// comps/acts/McqAct.js
__turbopack_context__.s([
    "default",
    ()=>McqAct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/comps/acts/McqAct.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/apiService.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function parseOptionsString(raw) {
    return (raw || '').split(/\n|,/).map((s)=>s.trim()).filter(Boolean);
}
function shuffleArray(arr) {
    const a = arr.slice();
    for(let i = a.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [
            a[j],
            a[i]
        ];
    }
    return a;
}
function normalizeQuestions(raw) {
    return raw.map((q)=>{
        const original = q.qText || q.text || '';
        const rawOpts = parseOptionsString(q.options || q.option || '');
        let originalCorrectIndex = -1;
        const cleanedOpts = rawOpts.map((opt, idx)=>{
            if (opt.includes('*')) {
                originalCorrectIndex = idx;
                return opt.replace(/\*/g, '').trim();
            }
            return opt;
        });
        if (originalCorrectIndex === -1) originalCorrectIndex = 0;
        const order = shuffleArray(cleanedOpts.map((_, i)=>i));
        const shuffled = [];
        let newCorrectIndex = -1;
        order.forEach((oldIndex, newIndex)=>{
            shuffled.push(cleanedOpts[oldIndex]);
            if (oldIndex === originalCorrectIndex) newCorrectIndex = newIndex;
        });
        return {
            qTextRaw: original,
            qText: original,
            options: shuffled,
            correctIndex: newCorrectIndex,
            answered: false,
            userChoice: null
        };
    });
}
function McqAct({ data }) {
    _s();
    const [questions, setQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [current, setCurrent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [score, setScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [attempted, setAttempted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('STARTED');
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const total = questions.length;
    const activityId = data?.id || 'mcq_default';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "McqAct.useEffect": ()=>{
            if (!data) return;
            let currentUserId = localStorage.getItem('user_email');
            if (!currentUserId) {
                currentUserId = localStorage.getItem('mcq_guest_id');
                if (!currentUserId) {
                    currentUserId = 'guest_' + Math.floor(Math.random() * 1000000);
                    localStorage.setItem('mcq_guest_id', currentUserId);
                }
            }
            setUserId(currentUserId);
            // const initQuiz = async () => {
            //   const raw = data.questions || [];
            //   let initialQuestions = normalizeQuestions(raw);
            //   try {
            //     const ts = new Date().getTime();
            //     const res = await fetch(
            //       `${API_BASE}/progress/${currentUserId}/${activityId}?t=${ts}`
            //     );
            //     if (res.ok) {
            //       const text = await res.text();
            //       if (text && text.trim() !== '') {
            //         let savedState = JSON.parse(text);
            //         if (savedState.status !== 'empty') {
            //           if (typeof savedState === 'string')
            //             savedState = JSON.parse(savedState);
            //           if (
            //             savedState.questions &&
            //             savedState.questions.length === initialQuestions.length
            //           ) {
            //             initialQuestions = savedState.questions;
            //           }
            //           const savedCurrent = savedState.current || 0;
            //           const savedScore = savedState.score || 0;
            //           const savedAttempted = savedState.attempted || 0;
            //           setCurrent(savedCurrent);
            //           setScore(savedScore);
            //           setAttempted(savedAttempted);
            //           if (
            //             savedCurrent >= initialQuestions.length ||
            //             (initialQuestions.length > 0 &&
            //               savedAttempted === initialQuestions.length)
            //           ) {
            //             setStatus('SUMMARY');
            //           }
            //         }
            //       }
            //     }
            //   } catch (err) {}
            //   setQuestions(initialQuestions);
            // };
            const initQuiz = {
                "McqAct.useEffect.initQuiz": async ()=>{
                    const raw = data.questions || [];
                    let initialQuestions = normalizeQuestions(raw);
                    try {
                        // 1. Single clean call to your central service
                        const savedState = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].getMcqProgress(currentUserId, activityId);
                        // 2. Logic remains the same, but data is already parsed
                        if (savedState && savedState.status !== 'empty') {
                            if (savedState.questions && savedState.questions.length === initialQuestions.length) {
                                initialQuestions = savedState.questions;
                            }
                            setCurrent(savedState.current || 0);
                            setScore(savedState.score || 0);
                            setAttempted(savedState.attempted || 0);
                            const isFinished = (savedState.current || 0) >= initialQuestions.length || savedState.attempted === initialQuestions.length;
                            if (isFinished && initialQuestions.length > 0) {
                                setStatus('SUMMARY');
                            }
                        }
                    } catch (err) {
                        console.error('Error fetching progress:', err);
                    }
                    setQuestions(initialQuestions);
                }
            }["McqAct.useEffect.initQuiz"];
            initQuiz();
        }
    }["McqAct.useEffect"], [
        data,
        activityId
    ]);
    const handleOptionClick = async (idx)=>{
        const q = questions[current];
        if (q.answered) return;
        const updatedQuestions = [
            ...questions
        ];
        const activeQ = updatedQuestions[current];
        activeQ.answered = true;
        activeQ.userChoice = idx;
        let newScore = score;
        if (idx === activeQ.correctIndex) {
            newScore += 1;
        }
        const newAttempted = attempted + 1;
        setQuestions(updatedQuestions);
        setScore(newScore);
        setAttempted(newAttempted);
        saveProgressAPI(updatedQuestions, current, newScore, newAttempted);
    };
    const saveProgressAPI = async (qs, currIdx, currentScore, currentAttempted, overrideStatus = 'IN_PROGRESS')=>{
        if (!userId) return;
        const stateToSave = {
            current: currIdx,
            score: currentScore,
            attempted: currentAttempted,
            questions: qs,
            total: qs.length
        };
        try {
            await fetch(`${API_BASE}/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    activity_id: activityId,
                    progress_json: JSON.stringify(stateToSave),
                    score: currentScore,
                    attempted: currentAttempted,
                    status: overrideStatus
                })
            });
        } catch (err) {}
    };
    const completeQuizAPI = async ()=>{
        if (!userId) return;
        try {
            await fetch(`${API_BASE}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    activity_id: activityId,
                    score: score,
                    attempted: attempted
                })
            });
        } catch (err) {}
    };
    const handleNext = async ()=>{
        setIsSaving(true);
        if (current + 1 < total) {
            const nextIdx = current + 1;
            await saveProgressAPI(questions, nextIdx, score, attempted);
            setCurrent(nextIdx);
        } else {
            await saveProgressAPI(questions, current, score, attempted, 'COMPLETED');
            await completeQuizAPI();
            setStatus('SUMMARY');
        }
        setIsSaving(false);
    };
    const handleFinalNext = ()=>{
        try {
            window.parent.postMessage(JSON.stringify({
                done: true,
                score: score,
                total: attempted
            }), '*');
        } catch (_) {}
    };
    if (questions.length === 0) return null;
    const currentQ = questions[current];
    const isSummary = status === 'SUMMARY';
    // return (
    //   <div className={styles.container}>
    //     {!isSummary ? (
    //       <div className={styles.main}>
    //         {/* TITLE */}
    //         <div className={styles.title} id="actTitle">
    //           {data.title || 'Multiple Choice Question'}
    //         </div>
    //         <div id="questionTitle" className={styles.small}>
    //           Question {current + 1} of {total}
    //         </div>
    //         <div id="qwrap" className={styles.qwrap}>
    //           {/* Passage Box */}
    //           {data.passage && (
    //             <div className={styles.passageBox}>{data.passage}</div>
    //           )}
    //           {/* Question Text */}
    //           <div
    //             className={styles.question}
    //             dangerouslySetInnerHTML={{ __html: currentQ.qText }}
    //           />
    //           {/* Options */}
    //           <div className={styles.options}>
    //             {currentQ.options.map((opt, i) => {
    //               let optionClass = styles.option;
    //               if (currentQ.answered) {
    //                 if (i === currentQ.correctIndex)
    //                   optionClass += ` ${styles.correct}`;
    //                 else if (i === currentQ.userChoice)
    //                   optionClass += ` ${styles.wrong}`;
    //                 if (i === currentQ.userChoice)
    //                   optionClass += ` ${styles.selected}`;
    //               }
    //               return (
    //                 <div
    //                   key={i}
    //                   className={optionClass}
    //                   data-index={i}
    //                   onClick={() => handleOptionClick(i)}
    //                 >
    //                   <span className={styles.radio}></span>
    //                   <div className={styles.optionLabel}>{opt}</div>
    //                 </div>
    //               );
    //             })}
    //           </div>
    //           {/* Marks rendered strictly inside qwrap like original HTML */}
    //           {currentQ.answered &&
    //             currentQ.userChoice === currentQ.correctIndex && (
    //               <div
    //                 id="rightMark"
    //                 className={`${styles.mark} ${styles.right}`}
    //               >
    //                 ✔
    //               </div>
    //             )}
    //           {currentQ.answered &&
    //             currentQ.userChoice !== currentQ.correctIndex && (
    //               <div
    //                 id="wrongMark"
    //                 className={`${styles.mark} ${styles.wrong}`}
    //               >
    //                 ✖
    //               </div>
    //             )}
    //         </div>
    //         {/* CONTROLS */}
    //         <div className={styles.controls}>
    //           <div className={styles.score} id="scoreBox">
    //             Score : {score} / {total}
    //           </div>
    //           <div style={{ marginLeft: 'auto' }}>
    //             <button
    //               className={`${styles.btn} ${styles.primary}`}
    //               id="nextBtn"
    //               style={{ display: currentQ.answered ? 'inline-block' : 'none' }}
    //               onClick={handleNext}
    //               disabled={isSaving}
    //             >
    //               {isSaving
    //                 ? 'Saving...'
    //                 : current + 1 === total
    //                   ? 'Finish'
    //                   : 'Next'}
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     ) : (
    //       /* FINAL SUMMARY VIEW */
    //       <div
    //         id="finalWrap"
    //         className={styles.main}
    //         style={{ marginTop: '18px' }}
    //       >
    //         <div className={styles.title}>You have completed this activity.</div>
    //         <div id="summaryList" className={styles.summary}>
    //           {questions.map((q, i) => {
    //             const isCorrect = q.userChoice === q.correctIndex;
    //             return (
    //               <div
    //                 key={i}
    //                 className={styles.summaryItem}
    //                 style={{ padding: '10px 0' }}
    //               >
    //                 <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
    //                   {i + 1}. {q.qTextRaw}
    //                 </div>
    //                 <div style={{ fontSize: '0.9em' }}>
    //                   Your Answer:{' '}
    //                   <span
    //                     style={{
    //                       color: isCorrect ? '#2ecc71' : '#e74c3c',
    //                       fontWeight: 'bold',
    //                     }}
    //                   >
    //                     {q.options[q.userChoice] || 'Skipped'}
    //                   </span>
    //                   {!isCorrect && (
    //                     <span style={{ color: '#777', marginLeft: '8px' }}>
    //                       (Correct: {q.options[q.correctIndex]})
    //                     </span>
    //                   )}
    //                 </div>
    //               </div>
    //             );
    //           })}
    //         </div>
    //         <div
    //           style={{
    //             display: 'flex',
    //             alignItems: 'center',
    //             justifyContent: 'space-between',
    //             marginTop: '12px',
    //           }}
    //         >
    //           <div className={styles.small} id="finalScore">
    //             Final Score: {score} / {attempted}
    //           </div>
    //           <button
    //             className={`${styles.btn} ${styles.primary}`}
    //             id="finalNextBtn"
    //             onClick={handleFinalNext}
    //           >
    //             Next
    //           </button>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // );
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wrapper,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
            children: !isSummary ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].main,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].title,
                        id: "actTitle",
                        children: data.title || 'Multiple Choice Question'
                    }, void 0, false, {
                        fileName: "[project]/comps/acts/McqAct.js",
                        lineNumber: 438,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "questionTitle",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].small,
                        children: [
                            "Question ",
                            current + 1,
                            " of ",
                            total
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/acts/McqAct.js",
                        lineNumber: 442,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "qwrap",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].qwrap,
                        children: [
                            data.passage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].passageBox,
                                children: data.passage
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/McqAct.js",
                                lineNumber: 449,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].question,
                                dangerouslySetInnerHTML: {
                                    __html: currentQ.qText
                                }
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/McqAct.js",
                                lineNumber: 453,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].options,
                                children: currentQ.options.map((opt, i)=>{
                                    let optionClass = __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].option;
                                    if (currentQ.answered) {
                                        if (i === currentQ.correctIndex) optionClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].correct}`;
                                        else if (i === currentQ.userChoice) optionClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wrong}`;
                                        if (i === currentQ.userChoice) optionClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].selected}`;
                                    }
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: optionClass,
                                        "data-index": i,
                                        onClick: ()=>handleOptionClick(i),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radio
                                            }, void 0, false, {
                                                fileName: "[project]/comps/acts/McqAct.js",
                                                lineNumber: 478,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].optionLabel,
                                                children: opt
                                            }, void 0, false, {
                                                fileName: "[project]/comps/acts/McqAct.js",
                                                lineNumber: 479,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/comps/acts/McqAct.js",
                                        lineNumber: 472,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/McqAct.js",
                                lineNumber: 459,
                                columnNumber: 15
                            }, this),
                            currentQ.answered && currentQ.userChoice === currentQ.correctIndex && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "rightMark",
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mark} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].right}`,
                                children: "✔"
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/McqAct.js",
                                lineNumber: 488,
                                columnNumber: 19
                            }, this),
                            currentQ.answered && currentQ.userChoice !== currentQ.correctIndex && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "wrongMark",
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mark} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wrong}`,
                                children: "✖"
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/McqAct.js",
                                lineNumber: 497,
                                columnNumber: 19
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/acts/McqAct.js",
                        lineNumber: 446,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].controls,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].score,
                                id: "scoreBox",
                                children: [
                                    "Score : ",
                                    score,
                                    " / ",
                                    total
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/acts/McqAct.js",
                                lineNumber: 508,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginLeft: 'auto'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].btn} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].primary}`,
                                    id: "nextBtn",
                                    style: {
                                        display: currentQ.answered ? 'inline-block' : 'none'
                                    },
                                    onClick: handleNext,
                                    disabled: isSaving,
                                    children: isSaving ? 'Saving...' : current + 1 === total ? 'Finish' : 'Next'
                                }, void 0, false, {
                                    fileName: "[project]/comps/acts/McqAct.js",
                                    lineNumber: 512,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/McqAct.js",
                                lineNumber: 511,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/acts/McqAct.js",
                        lineNumber: 507,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/comps/acts/McqAct.js",
                lineNumber: 436,
                columnNumber: 11
            }, this) : /* FINAL SUMMARY VIEW */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "finalWrap",
                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].main,
                style: {
                    marginTop: '18px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].title,
                        children: "You have completed this activity."
                    }, void 0, false, {
                        fileName: "[project]/comps/acts/McqAct.js",
                        lineNumber: 537,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "summaryList",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summary,
                        children: questions.map((q, i)=>{
                            const isCorrect = q.userChoice === q.correctIndex;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryItem,
                                style: {
                                    padding: '10px 0'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 'bold',
                                            marginBottom: '4px'
                                        },
                                        children: [
                                            i + 1,
                                            ". ",
                                            q.qTextRaw
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/comps/acts/McqAct.js",
                                        lineNumber: 550,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '0.9em'
                                        },
                                        children: [
                                            "Your Answer:",
                                            ' ',
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: isCorrect ? '#2ecc71' : '#e74c3c',
                                                    fontWeight: 'bold'
                                                },
                                                children: q.options[q.userChoice] || 'Skipped'
                                            }, void 0, false, {
                                                fileName: "[project]/comps/acts/McqAct.js",
                                                lineNumber: 555,
                                                columnNumber: 23
                                            }, this),
                                            !isCorrect && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: '#777',
                                                    marginLeft: '8px'
                                                },
                                                children: [
                                                    "(Correct: ",
                                                    q.options[q.correctIndex],
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/comps/acts/McqAct.js",
                                                lineNumber: 564,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/comps/acts/McqAct.js",
                                        lineNumber: 553,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/comps/acts/McqAct.js",
                                lineNumber: 545,
                                columnNumber: 19
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/comps/acts/McqAct.js",
                        lineNumber: 541,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: '12px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].small,
                                id: "finalScore",
                                children: [
                                    "Final Score: ",
                                    score,
                                    " / ",
                                    attempted
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/acts/McqAct.js",
                                lineNumber: 582,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].btn} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].primary}`,
                                id: "finalNextBtn",
                                onClick: handleFinalNext,
                                children: "Next"
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/McqAct.js",
                                lineNumber: 585,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/acts/McqAct.js",
                        lineNumber: 574,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/comps/acts/McqAct.js",
                lineNumber: 532,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/comps/acts/McqAct.js",
            lineNumber: 434,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/comps/acts/McqAct.js",
        lineNumber: 433,
        columnNumber: 5
    }, this);
}
_s(McqAct, "ebNf0/KgU6nGvWfKMQrc/Ot7gDk=");
_c = McqAct;
var _c;
__turbopack_context__.k.register(_c, "McqAct");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/comps/acts/CompleteWordAct.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "floatNext": "CompleteWordAct-module__QcFl0a__floatNext",
  "gameArea": "CompleteWordAct-module__QcFl0a__gameArea",
  "gameFooter": "CompleteWordAct-module__QcFl0a__gameFooter",
  "mainCard": "CompleteWordAct-module__QcFl0a__mainCard",
  "missingBox": "CompleteWordAct-module__QcFl0a__missingBox",
  "nextBtn": "CompleteWordAct-module__QcFl0a__nextBtn",
  "optionBtn": "CompleteWordAct-module__QcFl0a__optionBtn",
  "optionsContainer": "CompleteWordAct-module__QcFl0a__optionsContainer",
  "sBracket": "CompleteWordAct-module__QcFl0a__sBracket",
  "sCorrectNum": "CompleteWordAct-module__QcFl0a__sCorrectNum",
  "sCorrectText": "CompleteWordAct-module__QcFl0a__sCorrectText",
  "sNum": "CompleteWordAct-module__QcFl0a__sNum",
  "sWrongText": "CompleteWordAct-module__QcFl0a__sWrongText",
  "scoreBadge": "CompleteWordAct-module__QcFl0a__scoreBadge",
  "summaryArea": "CompleteWordAct-module__QcFl0a__summaryArea",
  "summaryFooter": "CompleteWordAct-module__QcFl0a__summaryFooter",
  "summaryItem": "CompleteWordAct-module__QcFl0a__summaryItem",
  "summaryList": "CompleteWordAct-module__QcFl0a__summaryList",
  "titleText": "CompleteWordAct-module__QcFl0a__titleText",
  "wordDisplayContainer": "CompleteWordAct-module__QcFl0a__wordDisplayContainer",
  "wordPuzzle": "CompleteWordAct-module__QcFl0a__wordPuzzle",
  "wrapper": "CompleteWordAct-module__QcFl0a__wrapper",
});
}),
"[project]/comps/acts/CompleteWordAct.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import React, { useState, useEffect } from 'react';
// import styles from './CompleteWordAct.module.css';
// // const API_BASE = 'http://192.168.0.127:8080/ords/lms/completedword';
// import { apiService } from '../../utils/apiService'; // 1. Import the service
// function shuffleArray(array) {
//   const arr = [...array];
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
//   return arr;
// }
// function parseData(textData) {
//   if (!textData) return [];
//   const lines = textData.split('\n');
//   return lines
//     .map((line) => {
//       const parts = line.split('|');
//       if (parts.length < 4) return null;
//       const rawOptions = parts[3].split(',').map((o) => o.trim());
//       return {
//         english: parts[0],
//         fullWord: parts[1],
//         puzzle: parts[2],
//         correctAnswer: rawOptions[0],
//         options: rawOptions,
//         displayOptions: shuffleArray(rawOptions), // Shuffle once during parse
//         answered: false,
//         selectedOption: null,
//       };
//     })
//     .filter((item) => item !== null);
// }
// export default function CompleteWordAct({ data }) {
//   const [questions, setQuestions] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [score, setScore] = useState(0);
//   const [attempted, setAttempted] = useState(0);
//   const [userAnswers, setUserAnswers] = useState([]);
//   const [status, setStatus] = useState('STARTED');
//   const [userId, setUserId] = useState(0);
//   const [isSaving, setIsSaving] = useState(false);
//   const activityId = data?.id || 'spelling_01';
//   // INITIALIZATION
//   useEffect(() => {
//     if (!data) return;
//     // 🟢 FIX 1: Fetch user_id precisely like the old script.js and force it to be a Number
//     const currentUserId = Number(
//       data.user_id || localStorage.getItem('user_id') || 0
//     );
//     setUserId(currentUserId);
//     const initGame = async () => {
//       let initialQuestions = [];
//       if (data.text) {
//         initialQuestions = parseData(data.text);
//       } else if (data.questions) {
//         initialQuestions = data.questions;
//       }
//       try {
//         const res = await fetch(
//           `${API_BASE}/progress/${currentUserId}/${activityId}`
//         );
//         if (res.ok) {
//           const result = await res.json();
//           if (
//             (result.status === 'IN_PROGRESS' ||
//               result.status === 'COMPLETED') &&
//             result.data
//           ) {
//             const savedState = result.data;
//             setCurrent(savedState.currentQIndex || 0);
//             setScore(savedState.score || 0);
//             setAttempted(savedState.questionsAttempted || 0);
//             setUserAnswers(savedState.userAnswers || []);
//             if (
//               savedState.questionsAttempted >= initialQuestions.length &&
//               initialQuestions.length > 0
//             ) {
//               setStatus('SUMMARY');
//             }
//           }
//         }
//       } catch (err) {}
//       setQuestions(initialQuestions);
//     };
//     initGame();
//   }, [data, activityId]);
//   // ACTION HANDLERS
//   const handleAnswer = async (selectedOpt) => {
//     const q = questions[current];
//     if (q.answered) return;
//     const isCorrect = selectedOpt === q.correctAnswer;
//     const updatedQuestions = [...questions];
//     updatedQuestions[current] = {
//       ...q,
//       answered: true,
//       selectedOption: selectedOpt,
//     };
//     // 🟢 FIX 2: Clean the question object to exactly match the old payload structure
//     const cleanQuestion = {
//       english: q.english,
//       fullWord: q.fullWord,
//       puzzle: q.puzzle,
//       correctAnswer: q.correctAnswer,
//       options: q.options,
//     };
//     const newScore = score + (isCorrect ? 1 : 0);
//     const newAttempted = attempted + 1;
//     const newUserAnswers = [
//       ...userAnswers,
//       {
//         question: cleanQuestion, // Only send the clean data
//         userSelected: selectedOpt,
//         isCorrect: isCorrect,
//         fullCorrectWord: q.fullWord,
//       },
//     ];
//     setQuestions(updatedQuestions);
//     setScore(newScore);
//     setAttempted(newAttempted);
//     setUserAnswers(newUserAnswers);
//     // Save Progress
//     // Save Progress
//     saveProgressAPI(current, newScore, newAttempted, newUserAnswers, userId);
//   };
//   const nextQuestion = async () => {
//     setIsSaving(true);
//     if (current + 1 < questions.length) {
//       const nextIdx = current + 1;
//       await saveProgressAPI(nextIdx, score, attempted, userAnswers, userId);
//       setCurrent(nextIdx);
//     } else {
//       await saveProgressAPI(current, score, attempted, userAnswers, userId);
//       await completeQuizAPI();
//       setStatus('SUMMARY');
//     }
//     setIsSaving(false);
//   };
//   // API CALLS
//   const saveProgressAPI = async (
//     currIdx,
//     currentScore,
//     currentAttempted,
//     currentAnswers,
//     uid = userId
//   ) => {
//     if (!uid) return;
//     const stateToSave = {
//       currentQIndex: currIdx,
//       score: currentScore,
//       questionsAttempted: currentAttempted,
//       userAnswers: currentAnswers,
//     };
//     try {
//       await fetch(`${API_BASE}/progress`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           user_id: uid, // Number format
//           activity_id: activityId,
//           progress_json: JSON.stringify(stateToSave),
//           score: currentScore,
//           attempted: currentAttempted,
//         }),
//       });
//     } catch (err) {}
//   };
//   const completeQuizAPI = async () => {
//     if (!userId) return;
//     try {
//       await fetch(`${API_BASE}/complete`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           user_id: userId, // Number format
//           activity_id: activityId,
//           score: score,
//           attempted: attempted,
//         }),
//       });
//     } catch (err) {}
//   };
//   const handleFinalNext = () => {
//     try {
//       window.parent.postMessage(
//         JSON.stringify({ done: true, score: score, total: questions.length }),
//         '*'
//       );
//     } catch (_) {}
//   };
//   // RENDER
//   if (questions.length === 0) return null;
//   const currentQ = questions[current];
//   const isSummary = status === 'SUMMARY';
//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.mainCard}>
//         {/* Header */}
//         <div className={styles.titleText}>{data.title || ''}</div>
//         {!isSummary ? (
//           <div className={styles.gameArea}>
//             {/* Word Puzzle Display */}
//             <div className={styles.wordDisplayContainer}>
//               <div className={styles.wordPuzzle}>
//                 {currentQ.puzzle.split('_').length > 1 ? (
//                   <>
//                     <span>{currentQ.puzzle.split('_')[0]}</span>
//                     <div
//                       className={styles.missingBox}
//                       style={{
//                         backgroundColor: currentQ.answered
//                           ? 'transparent'
//                           : 'var(--purple-box)',
//                         color: currentQ.answered
//                           ? currentQ.selectedOption === currentQ.correctAnswer
//                             ? 'var(--green-correct)'
//                             : 'var(--red-wrong)'
//                           : 'white',
//                         fontSize: currentQ.answered ? '3rem' : 'inherit',
//                       }}
//                     >
//                       {currentQ.answered ? currentQ.selectedOption : '_'}
//                     </div>
//                     <span>{currentQ.puzzle.split('_')[1]}</span>
//                   </>
//                 ) : (
//                   <span>{currentQ.puzzle}</span>
//                 )}
//               </div>
//             </div>
//             {/* Options */}
//             <div className={styles.optionsContainer}>
//               {currentQ.displayOptions.map((opt, i) => (
//                 <button
//                   key={i}
//                   className={styles.optionBtn}
//                   disabled={currentQ.answered}
//                   onClick={() => handleAnswer(opt)}
//                 >
//                   {opt}
//                 </button>
//               ))}
//             </div>
//             {/* Floating Next Button */}
//             {currentQ.answered && (
//               <button
//                 className={`${styles.nextBtn} ${styles.floatNext}`}
//                 onClick={nextQuestion}
//                 disabled={isSaving}
//               >
//                 {isSaving
//                   ? 'Saving...'
//                   : current + 1 === questions.length
//                     ? 'Finish'
//                     : 'Next'}
//               </button>
//             )}
//             {/* Footer */}
//             <div className={styles.gameFooter}>
//               <div className={styles.scoreBadge}>
//                 Score : {score} / {attempted}
//               </div>
//             </div>
//           </div>
//         ) : (
//           /* SUMMARY AREA */
//           <div className={styles.summaryArea}>
//             <h2 style={{ textAlign: 'center', color: '#333' }}>
//               You have completed this activity.
//             </h2>
//             <div className={styles.summaryList}>
//               {userAnswers.map((ans, i) => {
//                 const userFormedWord = ans.question.puzzle.replace(
//                   '_',
//                   ans.userSelected
//                 );
//                 return (
//                   <div key={i} className={styles.summaryItem}>
//                     {ans.isCorrect ? (
//                       <>
//                         <span className={styles.sCorrectNum}>{i + 1})</span>
//                         <span className={styles.sCorrectText}>
//                           {userFormedWord}
//                         </span>
//                       </>
//                     ) : (
//                       <>
//                         <span className={styles.sNum}>{i + 1})</span>
//                         <span className={styles.sWrongText}>
//                           {userFormedWord}
//                         </span>
//                         <span className={styles.sBracket}>
//                           ({ans.fullCorrectWord})
//                         </span>
//                       </>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//             <div className={styles.summaryFooter}>
//               <div className={styles.scoreBadge}>
//                 Final Score: {score} / {questions.length}
//               </div>
//               <button className={styles.nextBtn} onClick={handleFinalNext}>
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>CompleteWordAct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/comps/acts/CompleteWordAct.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/apiService.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function shuffleArray(array) {
    const arr = [
        ...array
    ];
    for(let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [
            arr[j],
            arr[i]
        ];
    }
    return arr;
}
function parseData(textData) {
    if (!textData) return [];
    const lines = textData.split('\n');
    return lines.map((line)=>{
        const parts = line.split('|');
        if (parts.length < 4) return null;
        const rawOptions = parts[3].split(',').map((o)=>o.trim());
        return {
            english: parts[0],
            fullWord: parts[1],
            puzzle: parts[2],
            correctAnswer: rawOptions[0],
            options: rawOptions,
            displayOptions: shuffleArray(rawOptions),
            answered: false,
            selectedOption: null
        };
    }).filter((item)=>item !== null);
}
function CompleteWordAct({ data }) {
    _s();
    const [questions, setQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [current, setCurrent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [score, setScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [attempted, setAttempted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [userAnswers, setUserAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('STARTED');
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const activityId = data?.id || 'spelling_01';
    // INITIALIZATION
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CompleteWordAct.useEffect": ()=>{
            if (!data) return;
            const currentUserId = Number(data.user_id || localStorage.getItem('user_id') || 0);
            setUserId(currentUserId);
            const initGame = {
                "CompleteWordAct.useEffect.initGame": async ()=>{
                    let initialQuestions = [];
                    if (data.text) {
                        initialQuestions = parseData(data.text);
                    } else if (data.questions) {
                        initialQuestions = data.questions;
                    }
                    try {
                        // --- Centralized Service Call ---
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].getSpellingProgress(currentUserId, activityId);
                        const result = res.data; // Axios automatically parses JSON
                        if ((result.status === 'IN_PROGRESS' || result.status === 'COMPLETED') && result.data) {
                            const savedState = result.data;
                            setCurrent(savedState.currentQIndex || 0);
                            setScore(savedState.score || 0);
                            setAttempted(savedState.questionsAttempted || 0);
                            setUserAnswers(savedState.userAnswers || []);
                            if (savedState.questionsAttempted >= initialQuestions.length && initialQuestions.length > 0) {
                                setStatus('SUMMARY');
                            }
                        }
                    } catch (err) {
                        console.log('No previous progress found or server unreachable.');
                    }
                    setQuestions(initialQuestions);
                }
            }["CompleteWordAct.useEffect.initGame"];
            initGame();
        }
    }["CompleteWordAct.useEffect"], [
        data,
        activityId
    ]);
    // ACTION HANDLERS
    const handleAnswer = async (selectedOpt)=>{
        const q = questions[current];
        if (q.answered) return;
        const isCorrect = selectedOpt === q.correctAnswer;
        const updatedQuestions = [
            ...questions
        ];
        updatedQuestions[current] = {
            ...q,
            answered: true,
            selectedOption: selectedOpt
        };
        const cleanQuestion = {
            english: q.english,
            fullWord: q.fullWord,
            puzzle: q.puzzle,
            correctAnswer: q.correctAnswer,
            options: q.options
        };
        const newScore = score + (isCorrect ? 1 : 0);
        const newAttempted = attempted + 1;
        const newUserAnswers = [
            ...userAnswers,
            {
                question: cleanQuestion,
                userSelected: selectedOpt,
                isCorrect: isCorrect,
                fullCorrectWord: q.fullWord
            }
        ];
        setQuestions(updatedQuestions);
        setScore(newScore);
        setAttempted(newAttempted);
        setUserAnswers(newUserAnswers);
        saveProgressAPI(current, newScore, newAttempted, newUserAnswers, userId);
    };
    const nextQuestion = async ()=>{
        setIsSaving(true);
        if (current + 1 < questions.length) {
            const nextIdx = current + 1;
            await saveProgressAPI(nextIdx, score, attempted, userAnswers, userId);
            setCurrent(nextIdx);
        } else {
            await saveProgressAPI(current, score, attempted, userAnswers, userId);
            await completeQuizAPI();
            setStatus('SUMMARY');
        }
        setIsSaving(false);
    };
    // API CALLS (Using apiService)
    const saveProgressAPI = async (currIdx, currentScore, currentAttempted, currentAnswers, uid = userId)=>{
        if (!uid) return;
        const stateToSave = {
            currentQIndex: currIdx,
            score: currentScore,
            questionsAttempted: currentAttempted,
            userAnswers: currentAnswers
        };
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].saveSpellingProgress({
                user_id: uid,
                activity_id: activityId,
                progress_json: JSON.stringify(stateToSave),
                score: currentScore,
                attempted: currentAttempted
            });
        } catch (err) {
            console.error('Failed to save progress', err);
        }
    };
    const completeQuizAPI = async ()=>{
        if (!userId) return;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].completeSpelling({
                user_id: userId,
                activity_id: activityId,
                score: score,
                attempted: attempted
            });
        } catch (err) {
            console.error('Failed to complete quiz', err);
        }
    };
    const handleFinalNext = ()=>{
        try {
            window.parent.postMessage(JSON.stringify({
                done: true,
                score: score,
                total: questions.length
            }), '*');
        } catch (_) {}
    };
    if (questions.length === 0) return null;
    const currentQ = questions[current];
    const isSummary = status === 'SUMMARY';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wrapper,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainCard,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].titleText,
                    children: data.title || ''
                }, void 0, false, {
                    fileName: "[project]/comps/acts/CompleteWordAct.js",
                    lineNumber: 571,
                    columnNumber: 9
                }, this),
                !isSummary ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].gameArea,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wordDisplayContainer,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wordPuzzle,
                                children: currentQ.puzzle.split('_').length > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: currentQ.puzzle.split('_')[0]
                                        }, void 0, false, {
                                            fileName: "[project]/comps/acts/CompleteWordAct.js",
                                            lineNumber: 579,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].missingBox,
                                            style: {
                                                backgroundColor: currentQ.answered ? 'transparent' : 'var(--purple-box)',
                                                color: currentQ.answered ? currentQ.selectedOption === currentQ.correctAnswer ? 'var(--green-correct)' : 'var(--red-wrong)' : 'white',
                                                fontSize: currentQ.answered ? '3rem' : 'inherit'
                                            },
                                            children: currentQ.answered ? currentQ.selectedOption : '_'
                                        }, void 0, false, {
                                            fileName: "[project]/comps/acts/CompleteWordAct.js",
                                            lineNumber: 580,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: currentQ.puzzle.split('_')[1]
                                        }, void 0, false, {
                                            fileName: "[project]/comps/acts/CompleteWordAct.js",
                                            lineNumber: 596,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: currentQ.puzzle
                                }, void 0, false, {
                                    fileName: "[project]/comps/acts/CompleteWordAct.js",
                                    lineNumber: 599,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/CompleteWordAct.js",
                                lineNumber: 576,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/comps/acts/CompleteWordAct.js",
                            lineNumber: 575,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].optionsContainer,
                            children: currentQ.displayOptions.map((opt, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].optionBtn,
                                    disabled: currentQ.answered,
                                    onClick: ()=>handleAnswer(opt),
                                    children: opt
                                }, i, false, {
                                    fileName: "[project]/comps/acts/CompleteWordAct.js",
                                    lineNumber: 606,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/comps/acts/CompleteWordAct.js",
                            lineNumber: 604,
                            columnNumber: 13
                        }, this),
                        currentQ.answered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].nextBtn} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].floatNext}`,
                            onClick: nextQuestion,
                            disabled: isSaving,
                            children: isSaving ? 'Saving...' : current + 1 === questions.length ? 'Finish' : 'Next'
                        }, void 0, false, {
                            fileName: "[project]/comps/acts/CompleteWordAct.js",
                            lineNumber: 618,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].gameFooter,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].scoreBadge,
                                children: [
                                    "Score : ",
                                    score,
                                    " / ",
                                    attempted
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/acts/CompleteWordAct.js",
                                lineNumber: 632,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/comps/acts/CompleteWordAct.js",
                            lineNumber: 631,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/comps/acts/CompleteWordAct.js",
                    lineNumber: 574,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryArea,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                textAlign: 'center',
                                color: '#333'
                            },
                            children: "You have completed this activity."
                        }, void 0, false, {
                            fileName: "[project]/comps/acts/CompleteWordAct.js",
                            lineNumber: 639,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryList,
                            children: userAnswers.map((ans, i)=>{
                                const userFormedWord = ans.question.puzzle.replace('_', ans.userSelected);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryItem,
                                    children: ans.isCorrect ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sCorrectNum,
                                                children: [
                                                    i + 1,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/comps/acts/CompleteWordAct.js",
                                                lineNumber: 654,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sCorrectText,
                                                children: userFormedWord
                                            }, void 0, false, {
                                                fileName: "[project]/comps/acts/CompleteWordAct.js",
                                                lineNumber: 655,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sNum,
                                                children: [
                                                    i + 1,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/comps/acts/CompleteWordAct.js",
                                                lineNumber: 661,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sWrongText,
                                                children: userFormedWord
                                            }, void 0, false, {
                                                fileName: "[project]/comps/acts/CompleteWordAct.js",
                                                lineNumber: 662,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sBracket,
                                                children: [
                                                    "(",
                                                    ans.fullCorrectWord,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/comps/acts/CompleteWordAct.js",
                                                lineNumber: 665,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true)
                                }, i, false, {
                                    fileName: "[project]/comps/acts/CompleteWordAct.js",
                                    lineNumber: 651,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/comps/acts/CompleteWordAct.js",
                            lineNumber: 643,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryFooter,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].scoreBadge,
                                    children: [
                                        "Final Score: ",
                                        score,
                                        " / ",
                                        questions.length
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/comps/acts/CompleteWordAct.js",
                                    lineNumber: 676,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].nextBtn,
                                    onClick: handleFinalNext,
                                    children: "Next"
                                }, void 0, false, {
                                    fileName: "[project]/comps/acts/CompleteWordAct.js",
                                    lineNumber: 679,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/comps/acts/CompleteWordAct.js",
                            lineNumber: 675,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/comps/acts/CompleteWordAct.js",
                    lineNumber: 638,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/comps/acts/CompleteWordAct.js",
            lineNumber: 570,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/comps/acts/CompleteWordAct.js",
        lineNumber: 569,
        columnNumber: 5
    }, this);
}
_s(CompleteWordAct, "aLPjVqk45Elp8DzwXWTu3MNdwww=");
_c = CompleteWordAct;
var _c;
__turbopack_context__.k.register(_c, "CompleteWordAct");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/comps/acts/WordSearchAct.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actionBtn": "WordSearchAct-module__FxfHSG__actionBtn",
  "cell": "WordSearchAct-module__FxfHSG__cell",
  "found": "WordSearchAct-module__FxfHSG__found",
  "gameArea": "WordSearchAct-module__FxfHSG__gameArea",
  "gameFooter": "WordSearchAct-module__FxfHSG__gameFooter",
  "gridWrapper": "WordSearchAct-module__FxfHSG__gridWrapper",
  "header": "WordSearchAct-module__FxfHSG__header",
  "hidden": "WordSearchAct-module__FxfHSG__hidden",
  "highlightLine": "WordSearchAct-module__FxfHSG__highlightLine",
  "hintActive": "WordSearchAct-module__FxfHSG__hintActive",
  "hintBtn": "WordSearchAct-module__FxfHSG__hintBtn",
  "mainCard": "WordSearchAct-module__FxfHSG__mainCard",
  "nextBtn": "WordSearchAct-module__FxfHSG__nextBtn",
  "scoreBadge": "WordSearchAct-module__FxfHSG__scoreBadge",
  "selected": "WordSearchAct-module__FxfHSG__selected",
  "slideUp": "WordSearchAct-module__FxfHSG__slideUp",
  "titleText": "WordSearchAct-module__FxfHSG__titleText",
  "victoryToast": "WordSearchAct-module__FxfHSG__victoryToast",
  "wordGrid": "WordSearchAct-module__FxfHSG__wordGrid",
  "wordItem": "WordSearchAct-module__FxfHSG__wordItem",
  "wordItemFound": "WordSearchAct-module__FxfHSG__wordItemFound",
  "wordList": "WordSearchAct-module__FxfHSG__wordList",
  "wordStrip": "WordSearchAct-module__FxfHSG__wordStrip",
  "wrapper": "WordSearchAct-module__FxfHSG__wrapper",
});
}),
"[project]/comps/acts/WordSearchAct.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// comps/acts/WordSearchAct.js
__turbopack_context__.s([
    "default",
    ()=>WordSearchAct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/comps/acts/WordSearchAct.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
const WORD_COLORS = [
    '#F48FB1',
    '#90CAF9',
    '#CE93D8',
    '#80CBC4',
    '#FFCC80',
    '#B39DDB'
];
function WordSearchAct({ data }) {
    _s();
    const [grid, setGrid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [wordsData, setWordsData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [foundWords, setFoundWords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [foundLines, setFoundLines] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Selection State
    const [isSelecting, setIsSelecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [startCell, setStartCell] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentSelection, setCurrentSelection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Hint State
    const [hintActiveCell, setHintActiveCell] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hintActiveWord, setHintActiveWord] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Initialize Game
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WordSearchAct.useEffect": ()=>{
            if (!data) return;
            // Parse Grid
            let parsedGrid = [];
            if (Array.isArray(data.table)) {
                parsedGrid = Array.isArray(data.table[0]) ? data.table : data.table.map({
                    "WordSearchAct.useEffect": (row)=>row.split('')
                }["WordSearchAct.useEffect"]);
            } else if (typeof data.table === 'string') {
                parsedGrid = data.table.replace(/\r/g, '').split('\n').map({
                    "WordSearchAct.useEffect": (r)=>r.split('')
                }["WordSearchAct.useEffect"]);
            }
            setGrid(parsedGrid);
            // Parse Words
            if (data.words) {
                const parsedWords = data.words.map({
                    "WordSearchAct.useEffect.parsedWords": (w)=>({
                            wordStr: w.word.join(''),
                            marker: w.marker
                        })
                }["WordSearchAct.useEffect.parsedWords"]);
                setWordsData(parsedWords);
            }
        }
    }["WordSearchAct.useEffect"], [
        data
    ]);
    // --- SELECTION LOGIC ---
    const handleStart = (r, c)=>{
        setIsSelecting(true);
        setStartCell({
            r,
            c
        });
        setCurrentSelection([
            {
                r,
                c
            }
        ]);
    };
    const handleMove = (r, c)=>{
        if (!isSelecting || !startCell) return;
        const r1 = startCell.r;
        const c1 = startCell.c;
        const r2 = r;
        const c2 = c;
        const dr = r2 - r1;
        const dc = c2 - c1;
        // Check diagonal or straight
        if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
            const steps = Math.max(Math.abs(dr), Math.abs(dc));
            const rStep = dr === 0 ? 0 : dr / steps;
            const cStep = dc === 0 ? 0 : dc / steps;
            const newSelection = [];
            for(let i = 0; i <= steps; i++){
                newSelection.push({
                    r: r1 + i * rStep,
                    c: c1 + i * cStep
                });
            }
            setCurrentSelection(newSelection);
        }
    };
    const checkWordAndEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WordSearchAct.useCallback[checkWordAndEnd]": ()=>{
            if (!isSelecting || currentSelection.length === 0) return;
            const selectedWord = currentSelection.map({
                "WordSearchAct.useCallback[checkWordAndEnd].selectedWord": (cell)=>grid[cell.r][cell.c]
            }["WordSearchAct.useCallback[checkWordAndEnd].selectedWord"]).join('');
            const reverseWord = selectedWord.split('').reverse().join('');
            const targetObj = wordsData.find({
                "WordSearchAct.useCallback[checkWordAndEnd].targetObj": (w)=>w.wordStr === selectedWord || w.wordStr === reverseWord
            }["WordSearchAct.useCallback[checkWordAndEnd].targetObj"]);
            if (targetObj && !foundWords.includes(targetObj.wordStr)) {
                const wordStr = targetObj.wordStr;
                // Calculate Line perfectly based on 40px cell sizes
                const startCellSel = currentSelection[0];
                const endCellSel = currentSelection[currentSelection.length - 1];
                const x1 = startCellSel.c * 40 + 20;
                const y1 = startCellSel.r * 40 + 20;
                const x2 = endCellSel.c * 40 + 20;
                const y2 = endCellSel.r * 40 + 20;
                const length = Math.hypot(x2 - x1, y2 - y1);
                const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;
                const color = WORD_COLORS[foundWords.length % WORD_COLORS.length];
                setFoundLines({
                    "WordSearchAct.useCallback[checkWordAndEnd]": (prev)=>[
                            ...prev,
                            {
                                width: length + 34,
                                angle,
                                midX,
                                midY,
                                color
                            }
                        ]
                }["WordSearchAct.useCallback[checkWordAndEnd]"]);
                setFoundWords({
                    "WordSearchAct.useCallback[checkWordAndEnd]": (prev)=>[
                            ...prev,
                            wordStr
                        ]
                }["WordSearchAct.useCallback[checkWordAndEnd]"]);
            }
            setIsSelecting(false);
            setStartCell(null);
            setCurrentSelection([]);
        }
    }["WordSearchAct.useCallback[checkWordAndEnd]"], [
        currentSelection,
        grid,
        wordsData,
        foundWords,
        isSelecting
    ]);
    // Global Mouse Up
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WordSearchAct.useEffect": ()=>{
            const handleGlobalUp = {
                "WordSearchAct.useEffect.handleGlobalUp": ()=>checkWordAndEnd()
            }["WordSearchAct.useEffect.handleGlobalUp"];
            document.addEventListener('mouseup', handleGlobalUp);
            document.addEventListener('touchend', handleGlobalUp);
            return ({
                "WordSearchAct.useEffect": ()=>{
                    document.removeEventListener('mouseup', handleGlobalUp);
                    document.removeEventListener('touchend', handleGlobalUp);
                }
            })["WordSearchAct.useEffect"];
        }
    }["WordSearchAct.useEffect"], [
        checkWordAndEnd
    ]);
    // Touch Handlers
    const handleTouchStart = (e)=>{
        // Prevent scrolling while playing
        if (e.cancelable) e.preventDefault();
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.dataset.row) {
            handleStart(parseInt(target.dataset.row), parseInt(target.dataset.col));
        }
    };
    const handleTouchMove = (e)=>{
        if (e.cancelable) e.preventDefault();
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.dataset.row) {
            handleMove(parseInt(target.dataset.row), parseInt(target.dataset.col));
        }
    };
    // --- HINT LOGIC ---
    const handleHint = ()=>{
        const targetWordObj = wordsData.find((w)=>!foundWords.includes(w.wordStr));
        if (!targetWordObj) return;
        const c = targetWordObj.marker[0];
        const r = targetWordObj.marker[1];
        setHintActiveCell({
            r,
            c
        });
        setHintActiveWord(targetWordObj.wordStr);
        setTimeout(()=>{
            setHintActiveCell(null);
            setHintActiveWord(null);
        }, 1500);
    };
    // --- NEXT LOGIC ---
    const handleNext = ()=>{
        try {
            window.parent.postMessage(JSON.stringify({
                done: true,
                score: foundWords.length,
                total: wordsData.length
            }), '*');
        } catch (_) {}
    };
    const rows = grid.length;
    const cols = grid[0]?.length || 0;
    const isVictory = foundWords.length === wordsData.length && wordsData.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wrapper,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainCard,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].header,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].titleText,
                        children: data.title || 'Find the given words'
                    }, void 0, false, {
                        fileName: "[project]/comps/acts/WordSearchAct.js",
                        lineNumber: 205,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/comps/acts/WordSearchAct.js",
                    lineNumber: 204,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].gameArea,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].gridWrapper,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wordGrid,
                            style: {
                                gridTemplateColumns: `repeat(${cols}, 1fr)`
                            },
                            onTouchStart: handleTouchStart,
                            onTouchMove: handleTouchMove,
                            children: [
                                foundLines.map((line, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].highlightLine,
                                        style: {
                                            width: `${line.width}px`,
                                            backgroundColor: line.color,
                                            left: `${line.midX}px`,
                                            top: `${line.midY}px`,
                                            transform: `translate(-50%, -50%) rotate(${line.angle}deg)`
                                        }
                                    }, `line-${i}`, false, {
                                        fileName: "[project]/comps/acts/WordSearchAct.js",
                                        lineNumber: 221,
                                        columnNumber: 17
                                    }, this)),
                                grid.map((row, r)=>row.map((letter, c)=>{
                                        const isSelected = currentSelection.some((sel)=>sel.r === r && sel.c === c);
                                        // A cell is visually 'found' if it lies on ANY of the found words' markers
                                        // But since we use absolute lines, we just need to know if it should be white.
                                        // We can check if it exists in any correctly selected word logic, or just rely on the line background
                                        // The original CSS `.cell.found` only changes text color to white.
                                        // For React, we'll determine if it's found by checking if it belongs to a found word.
                                        // Easiest way: if its coordinates fall into any found word's marker range.
                                        let isFound = false;
                                        wordsData.forEach((w)=>{
                                            if (foundWords.includes(w.wordStr)) {
                                                const c1 = w.marker[0], r1 = w.marker[1], c2 = w.marker[2], r2 = w.marker[3];
                                                const dr = r2 - r1, dc = c2 - c1;
                                                const steps = Math.max(Math.abs(dr), Math.abs(dc));
                                                const rStep = dr === 0 ? 0 : dr / steps;
                                                const cStep = dc === 0 ? 0 : dc / steps;
                                                for(let i = 0; i <= steps; i++){
                                                    if (r === r1 + i * rStep && c === c1 + i * cStep) isFound = true;
                                                }
                                            }
                                        });
                                        const isHintActive = hintActiveCell?.r === r && hintActiveCell?.c === c;
                                        let cellClass = __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cell;
                                        if (isSelected) cellClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].selected}`;
                                        if (isFound) cellClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].found}`;
                                        if (isHintActive) cellClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hintActive}`;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            "data-row": r,
                                            "data-col": c,
                                            className: cellClass,
                                            onMouseDown: ()=>handleStart(r, c),
                                            onMouseEnter: ()=>handleMove(r, c),
                                            children: letter
                                        }, `${r}-${c}`, false, {
                                            fileName: "[project]/comps/acts/WordSearchAct.js",
                                            lineNumber: 276,
                                            columnNumber: 21
                                        }, this);
                                    }))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/comps/acts/WordSearchAct.js",
                            lineNumber: 213,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/comps/acts/WordSearchAct.js",
                        lineNumber: 212,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/comps/acts/WordSearchAct.js",
                    lineNumber: 211,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wordStrip,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wordList,
                        children: wordsData.map((item)=>{
                            const isFound = foundWords.includes(item.wordStr);
                            const isHinting = hintActiveWord === item.wordStr;
                            let itemClass = __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wordItem;
                            if (isFound) itemClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wordItemFound}`;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: itemClass,
                                style: isHinting ? {
                                    backgroundColor: '#ffd700',
                                    transform: 'scale(1.1)',
                                    fontWeight: 'bold'
                                } : {},
                                children: item.wordStr
                            }, item.wordStr, false, {
                                fileName: "[project]/comps/acts/WordSearchAct.js",
                                lineNumber: 304,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/comps/acts/WordSearchAct.js",
                        lineNumber: 295,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/comps/acts/WordSearchAct.js",
                    lineNumber: 294,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].gameFooter,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].scoreBadge,
                            children: [
                                "Score: ",
                                foundWords.length,
                                " / ",
                                wordsData.length
                            ]
                        }, void 0, true, {
                            fileName: "[project]/comps/acts/WordSearchAct.js",
                            lineNumber: 326,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex'
                            },
                            children: [
                                !isVictory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionBtn} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hintBtn}`,
                                    onClick: handleHint,
                                    children: "Hint 💡"
                                }, void 0, false, {
                                    fileName: "[project]/comps/acts/WordSearchAct.js",
                                    lineNumber: 332,
                                    columnNumber: 15
                                }, this),
                                isVictory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionBtn} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].nextBtn}`,
                                    onClick: handleNext,
                                    children: "Next ➜"
                                }, void 0, false, {
                                    fileName: "[project]/comps/acts/WordSearchAct.js",
                                    lineNumber: 340,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/comps/acts/WordSearchAct.js",
                            lineNumber: 330,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/comps/acts/WordSearchAct.js",
                    lineNumber: 325,
                    columnNumber: 9
                }, this),
                isVictory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].victoryToast,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "🎉 Great Job! Click Next to continue."
                    }, void 0, false, {
                        fileName: "[project]/comps/acts/WordSearchAct.js",
                        lineNumber: 353,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/comps/acts/WordSearchAct.js",
                    lineNumber: 352,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/comps/acts/WordSearchAct.js",
            lineNumber: 202,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/comps/acts/WordSearchAct.js",
        lineNumber: 201,
        columnNumber: 5
    }, this);
}
_s(WordSearchAct, "hTj5GuZs7Yx17f0yfpm9XTpQ79s=");
_c = WordSearchAct;
var _c;
__turbopack_context__.k.register(_c, "WordSearchAct");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/comps/acts/SequenceAct.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "btn": "SequenceAct-module__uWyiqG__btn",
  "btnGroup": "SequenceAct-module__uWyiqG__btnGroup",
  "canvasArea": "SequenceAct-module__uWyiqG__canvasArea",
  "controls": "SequenceAct-module__uWyiqG__controls",
  "danger": "SequenceAct-module__uWyiqG__danger",
  "headerRow": "SequenceAct-module__uWyiqG__headerRow",
  "hintBorder": "SequenceAct-module__uWyiqG__hintBorder",
  "mainCard": "SequenceAct-module__uWyiqG__mainCard",
  "mainCardInner": "SequenceAct-module__uWyiqG__mainCardInner",
  "primary": "SequenceAct-module__uWyiqG__primary",
  "resultMessage": "SequenceAct-module__uWyiqG__resultMessage",
  "score": "SequenceAct-module__uWyiqG__score",
  "secondary": "SequenceAct-module__uWyiqG__secondary",
  "shake": "SequenceAct-module__uWyiqG__shake",
  "small": "SequenceAct-module__uWyiqG__small",
  "summaryItem": "SequenceAct-module__uWyiqG__summaryItem",
  "svgLayer": "SequenceAct-module__uWyiqG__svgLayer",
  "title": "SequenceAct-module__uWyiqG__title",
  "wordBlock": "SequenceAct-module__uWyiqG__wordBlock",
  "wordBlockActive": "SequenceAct-module__uWyiqG__wordBlockActive",
  "wordBlockCompleted": "SequenceAct-module__uWyiqG__wordBlockCompleted",
  "wrapper": "SequenceAct-module__uWyiqG__wrapper",
});
}),
"[project]/comps/acts/SequenceAct.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import styles from './SequenceAct.module.css';
// const API_BASE = 'http://192.168.0.127:8080/ords/lms/sequence';
// function generateUniqueId(title, text) {
//   const source = (title || '') + (text || '');
//   let hash = 0;
//   for (let i = 0; i < source.length; i++) {
//     hash = (hash << 5) - hash + source.charCodeAt(i);
//     hash |= 0;
//   }
//   return Math.abs(hash).toString();
// }
// export default function SequenceAct({ data }) {
//   const [appState, setAppState] = useState('LOADING'); // LOADING, PLAYING, ROUND_END, SUMMARY
//   const [queue, setQueue] = useState([]);
//   const [currentRound, setCurrentRound] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [isReadOnly, setIsReadOnly] = useState(false);
//   const [blocks, setBlocks] = useState([]);
//   const [connections, setConnections] = useState([]);
//   const [hasUsedHint, setHasUsedHint] = useState(false);
//   const [hasGivenUp, setHasGivenUp] = useState(false);
//   const [resultMessage, setResultMessage] = useState('');
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [startIdx, setStartIdx] = useState(-1);
//   const [tempLine, setTempLine] = useState(null);
//   const canvasRef = useRef(null);
//   const blockRefs = useRef(new Map());
//   const [userId, setUserId] = useState(null);
//   const [activityId, setActivityId] = useState('');
//   const [title, setTitle] = useState('Sequence Activity');
//   // --- 1. INITIALIZATION ---
//   useEffect(() => {
//     if (!data) return;
//     const uid = Number(data.user_id || localStorage.getItem('user_id') || 0);
//     setUserId(uid);
//     const rawTitle = data.title || 'Sequence Game';
//     let rawText = data.text || '';
//     const generatedId = data.id || generateUniqueId(rawTitle, rawText);
//     setActivityId(generatedId);
//     setTitle(rawTitle);
//     const lines = rawText.split('\n').filter((line) => line.trim().length > 0);
//     const parsedQueue = lines.map((line) => {
//       const cleanLine = line.trim();
//       let chunks = [];
//       if (cleanLine.includes(' ')) {
//         chunks = cleanLine.split(/\s+/).filter(Boolean);
//       } else if (cleanLine.includes(',')) {
//         chunks = cleanLine.split(',').map((s) => s.trim());
//       } else {
//         try {
//           const segmenter = new Intl.Segmenter('hi', {
//             granularity: 'grapheme',
//           });
//           chunks = Array.from(segmenter.segment(cleanLine)).map(
//             (s) => s.segment
//           );
//         } catch (e) {
//           chunks = cleanLine.split('');
//         }
//       }
//       return { fullText: cleanLine, chunks };
//     });
//     setQueue(parsedQueue);
//     const fetchProgress = async () => {
//       if (!uid) {
//         startNextRound(parsedQueue);
//         return;
//       }
//       try {
//         const res = await fetch(
//           `${API_BASE}/progress/${uid}/${generatedId}?t=${new Date().getTime()}`
//         );
//         if (res.ok) {
//           const text = await res.text();
//           if (text && !text.includes('empty') && !text.includes('error')) {
//             const savedData = JSON.parse(text);
//             if (savedData.status === 'COMPLETED') {
//               setIsReadOnly(true);
//               if (savedData.data && savedData.data.history) {
//                 setHistory(savedData.data.history);
//               }
//               setAppState('SUMMARY');
//               return;
//             }
//           }
//         }
//       } catch (e) {}
//       startNextRound(parsedQueue);
//     };
//     fetchProgress();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [data]);
//   // --- 2. ROUND MANAGEMENT ---
//   const startNextRound = (currentQueue) => {
//     if (currentQueue.length === 0) {
//       endGame(history);
//       return;
//     }
//     const nextRound = currentQueue[0];
//     setQueue(currentQueue.slice(1));
//     setCurrentRound(nextRound);
//     setConnections([]);
//     setHasUsedHint(false);
//     setHasGivenUp(false);
//     setResultMessage('');
//     setTempLine(null);
//     setIsDrawing(false);
//     setStartIdx(-1);
//     setTimeout(() => spawnBlocks(nextRound.chunks), 50);
//   };
//   const spawnBlocks = (chunks) => {
//     if (!canvasRef.current) return;
//     const rect = canvasRef.current.getBoundingClientRect();
//     const existingPositions = [];
//     const newBlocks = [];
//     const blockW = 80;
//     const blockH = 60;
//     const padding = 20;
//     const maxW = rect.width - blockW - padding;
//     const maxH = rect.height - blockH - padding;
//     chunks.forEach((text, index) => {
//       let attempts = 0;
//       let x, y, safe;
//       do {
//         safe = true;
//         x = Math.random() * (maxW - padding) + padding;
//         y = Math.random() * (maxH - padding) + padding;
//         for (let pos of existingPositions) {
//           const dist = Math.sqrt(
//             Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
//           );
//           if (dist < 90) {
//             safe = false;
//             break;
//           }
//         }
//         attempts++;
//       } while (!safe && attempts < 50);
//       existingPositions.push({ x, y });
//       newBlocks.push({ index, text, x, y, isShaking: false, isHint: false });
//     });
//     setBlocks(newBlocks);
//     setAppState('PLAYING');
//   };
//   // --- 3. DRAWING & CONNECTIONS ---
//   const getBlockCenter = (idx) => {
//     const b = blocks.find((b) => b.index === idx);
//     const el = blockRefs.current.get(idx);
//     if (!b || !el) return { x: 0, y: 0 };
//     return {
//       x: b.x + el.offsetWidth / 2,
//       y: b.y + el.offsetHeight / 2,
//     };
//   };
//   const handlePointerDown = (e, index) => {
//     if (appState !== 'PLAYING' || (e.button !== 0 && e.type !== 'touchstart'))
//       return;
//     if (e.cancelable) e.preventDefault();
//     const lastConnected =
//       connections.length > 0 ? connections[connections.length - 1] : -1;
//     let validStart = false;
//     if (connections.length === 0 && index === 0) validStart = true;
//     else if (lastConnected === index) validStart = true;
//     if (!validStart) {
//       triggerShake(index);
//       return;
//     }
//     setIsDrawing(true);
//     setStartIdx(index);
//     const center = getBlockCenter(index);
//     setTempLine({ x1: center.x, y1: center.y, x2: center.x, y2: center.y });
//   };
//   const handlePointerMove = useCallback(
//     (e) => {
//       if (!isDrawing || !canvasRef.current) return;
//       const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//       const clientY = e.touches ? e.touches[0].clientY : e.clientY;
//       const rect = canvasRef.current.getBoundingClientRect();
//       const x2 = clientX - rect.left;
//       const y2 = clientY - rect.top;
//       setTempLine((prev) => (prev ? { ...prev, x2, y2 } : null));
//     },
//     [isDrawing]
//   );
//   const handlePointerUp = useCallback(
//     (e) => {
//       if (!isDrawing) return;
//       setIsDrawing(false);
//       setTempLine(null);
//       const clientX = e.changedTouches
//         ? e.changedTouches[0].clientX
//         : e.clientX;
//       const clientY = e.changedTouches
//         ? e.changedTouches[0].clientY
//         : e.clientY;
//       let targetIdx = -1;
//       blockRefs.current.forEach((el, idx) => {
//         const rect = el.getBoundingClientRect();
//         if (
//           clientX >= rect.left &&
//           clientX <= rect.right &&
//           clientY >= rect.top &&
//           clientY <= rect.bottom
//         ) {
//           targetIdx = idx;
//         }
//       });
//       if (targetIdx !== -1 && targetIdx !== startIdx) {
//         validateConnection(startIdx, targetIdx);
//       }
//       setStartIdx(-1);
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     },
//     [isDrawing, startIdx, connections, blocks]
//   );
//   useEffect(() => {
//     document.addEventListener('mousemove', handlePointerMove);
//     document.addEventListener('mouseup', handlePointerUp);
//     document.addEventListener('touchmove', handlePointerMove, {
//       passive: false,
//     });
//     document.addEventListener('touchend', handlePointerUp);
//     return () => {
//       document.removeEventListener('mousemove', handlePointerMove);
//       document.removeEventListener('mouseup', handlePointerUp);
//       document.removeEventListener('touchmove', handlePointerMove);
//       document.removeEventListener('touchend', handlePointerUp);
//     };
//   }, [handlePointerMove, handlePointerUp]);
//   const validateConnection = (from, to) => {
//     if (to === from + 1) {
//       const newConns = [...connections, to];
//       setConnections(newConns);
//       if (newConns.length === blocks.length - 1) {
//         completeRound(newConns, false);
//       }
//     } else {
//       triggerShake(to);
//     }
//   };
//   const triggerShake = (idx) => {
//     setBlocks((prev) =>
//       prev.map((b) => (b.index === idx ? { ...b, isShaking: true } : b))
//     );
//     setTimeout(() => {
//       setBlocks((prev) =>
//         prev.map((b) => (b.index === idx ? { ...b, isShaking: false } : b))
//       );
//     }, 300);
//   };
//   // --- 4. GAME ACTIONS ---
//   const handleHint = () => {
//     if (isReadOnly) return;
//     setHasUsedHint(true);
//     const nextIdx =
//       connections.length === 0 ? 0 : connections[connections.length - 1] + 1;
//     setBlocks((prev) =>
//       prev.map((b) => (b.index === nextIdx ? { ...b, isHint: true } : b))
//     );
//     setTimeout(() => {
//       setBlocks((prev) =>
//         prev.map((b) => (b.index === nextIdx ? { ...b, isHint: false } : b))
//       );
//     }, 500);
//   };
//   const handleGiveUp = () => {
//     if (isReadOnly) return;
//     setHasGivenUp(true);
//     const fullConns = [];
//     for (let i = 1; i < blocks.length; i++) fullConns.push(i);
//     setConnections(fullConns);
//     completeRound(fullConns, true);
//   };
//   const completeRound = (finalConns, gaveUp) => {
//     setAppState('ROUND_END');
//     let score = 1;
//     let status = 'perfect';
//     if (gaveUp) {
//       score = 0;
//       status = 'fail';
//     } else if (hasUsedHint) {
//       score = 0.5;
//       status = 'hint';
//     }
//     const newHistory = [
//       ...history,
//       { text: currentRound.fullText, status, score },
//     ];
//     setHistory(newHistory);
//     let totalScore = newHistory.reduce((acc, h) => acc + h.score, 0);
//     saveProgressAPI(newHistory, totalScore, newHistory.length);
//     if (canvasRef.current) {
//       const rect = canvasRef.current.getBoundingClientRect();
//       const gap = 10;
//       let totalW = 0;
//       blocks.forEach((_, i) => {
//         const el = blockRefs.current.get(i);
//         totalW += (el ? el.offsetWidth : 80) + gap;
//       });
//       let currentX = (rect.width - totalW) / 2;
//       const centerY = rect.height / 2 - 22;
//       setBlocks((prev) =>
//         prev.map((b) => {
//           const el = blockRefs.current.get(b.index);
//           const w = el ? el.offsetWidth : 80;
//           const res = { ...b, x: currentX, y: centerY };
//           currentX += w + gap;
//           return res;
//         })
//       );
//     }
//     setResultMessage(gaveUp ? 'Solution Shown' : 'Good Job!');
//   };
//   const endGame = (finalHistory) => {
//     setAppState('SUMMARY');
//     let totalScore = finalHistory.reduce((acc, h) => acc + h.score, 0);
//     if (!isReadOnly) {
//       completeActivityAPI(totalScore, finalHistory.length);
//     }
//   };
//   // --- 5. API CALLS ---
//   const saveProgressAPI = async (hist, score, totalRounds) => {
//     if (!userId) return;
//     try {
//       await fetch(`${API_BASE}/progress`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           user_id: userId,
//           activity_id: activityId,
//           progress_json: JSON.stringify({ history: hist }),
//           score: score,
//           attempted: totalRounds,
//           status: 'IN_PROGRESS',
//         }),
//       });
//     } catch (e) {}
//   };
//   const completeActivityAPI = async (finalScore, totalRounds) => {
//     if (!userId) return;
//     try {
//       await fetch(`${API_BASE}/complete`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           user_id: userId,
//           activity_id: activityId,
//           score: finalScore,
//           attempted: totalRounds,
//         }),
//       });
//     } catch (e) {}
//   };
//   const handleFinish = () => {
//     try {
//       window.parent.postMessage(JSON.stringify({ done: true }), '*');
//     } catch (e) {}
//   };
//   const totalScoreCalc = history.reduce((acc, h) => acc + h.score, 0);
//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.mainCard}>
//         <div className={styles.mainCardInner}>
//           {appState !== 'SUMMARY' && (
//             <>
//               <div className={styles.headerRow}>
//                 <div className={styles.title}>{title}</div>
//                 <div
//                   className={styles.score}
//                   style={{ display: appState !== 'LOADING' ? 'block' : 'none' }}
//                 >
//                   Remaining: {queue.length + (appState === 'PLAYING' ? 1 : 0)}
//                 </div>
//               </div>
//               <div className={styles.canvasArea} ref={canvasRef}>
//                 <svg className={styles.svgLayer}>
//                   {/* 🟢 RED LINES ONLY SHOW WHEN PLAYING */}
//                   {appState === 'PLAYING' &&
//                     connections.map((toIdx) => {
//                       const fromIdx = toIdx - 1;
//                       const c1 = getBlockCenter(fromIdx);
//                       const c2 = getBlockCenter(toIdx);
//                       return (
//                         <line
//                           key={`conn-${toIdx}`}
//                           x1={c1.x}
//                           y1={c1.y}
//                           x2={c2.x}
//                           y2={c2.y}
//                           stroke="#ef4444"
//                           strokeWidth="4"
//                         />
//                       );
//                     })}
//                   {appState === 'PLAYING' && tempLine && startIdx !== -1 && (
//                     <line
//                       x1={getBlockCenter(startIdx).x}
//                       y1={getBlockCenter(startIdx).y}
//                       x2={tempLine.x2}
//                       y2={tempLine.y2}
//                       stroke="#60a5fa"
//                       strokeWidth="4"
//                       strokeDasharray="5,5"
//                     />
//                   )}
//                 </svg>
//                 {blocks.map((b) => {
//                   const isActive = startIdx === b.index;
//                   const isCompleted = appState === 'ROUND_END';
//                   let bClass = styles.wordBlock;
//                   if (isActive) bClass += ` ${styles.wordBlockActive}`;
//                   if (isCompleted) bClass += ` ${styles.wordBlockCompleted}`;
//                   if (b.isShaking) bClass += ` ${styles.shake}`;
//                   if (b.isHint) bClass += ` ${styles.hintBorder}`;
//                   return (
//                     <div
//                       key={`block-${b.index}`}
//                       ref={(el) => blockRefs.current.set(b.index, el)}
//                       className={bClass}
//                       style={{ left: `${b.x}px`, top: `${b.y}px` }}
//                       onMouseDown={(e) => handlePointerDown(e, b.index)}
//                       onTouchStart={(e) => handlePointerDown(e, b.index)}
//                     >
//                       {b.text}
//                     </div>
//                   );
//                 })}
//               </div>
//               <div className={styles.resultMessage}>{resultMessage}</div>
//               <div className={styles.controls}>
//                 {appState === 'PLAYING' && (
//                   <div className={styles.btnGroup}>
//                     <button
//                       className={`${styles.btn} ${styles.secondary}`}
//                       onClick={handleHint}
//                       disabled={isReadOnly}
//                     >
//                       Hint
//                     </button>
//                     <button
//                       className={`${styles.btn} ${styles.danger}`}
//                       onClick={handleGiveUp}
//                       disabled={isReadOnly}
//                     >
//                       Give Up
//                     </button>
//                   </div>
//                 )}
//                 {appState === 'ROUND_END' && (
//                   <button
//                     className={`${styles.btn} ${styles.primary}`}
//                     onClick={() => startNextRound(queue)}
//                   >
//                     Next
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//           {/* 🟢 NEW MCQ-STYLE SUMMARY */}
//           {appState === 'SUMMARY' && (
//             <div
//               style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 height: '100%',
//                 width: '100%',
//               }}
//             >
//               <div style={{ textAlign: 'center' }}>
//                 <div className={styles.title}>
//                   You have completed this activity.
//                 </div>
//               </div>
//               <div
//                 style={{
//                   flexGrow: 1,
//                   overflowY: 'auto',
//                   paddingRight: '10px',
//                   marginTop: '10px',
//                 }}
//               >
//                 {history.length > 0 ? (
//                   history.map((item, i) => {
//                     const isPerfect = item.score === 1;
//                     const isFail = item.score === 0;
//                     return (
//                       <div key={i} className={styles.summaryItem}>
//                         <div
//                           style={{ fontWeight: 'bold', marginBottom: '4px' }}
//                         >
//                           {i + 1}. {item.text}
//                         </div>
//                         <div style={{ fontSize: '0.9em' }}>
//                           Score:{' '}
//                           <span
//                             style={{
//                               color: isPerfect
//                                 ? '#2ecc71'
//                                 : isFail
//                                   ? '#e74c3c'
//                                   : '#d97706',
//                               fontWeight: 'bold',
//                             }}
//                           >
//                             {item.score}
//                           </span>
//                           {item.status === 'hint' && (
//                             <span style={{ color: '#777', marginLeft: '8px' }}>
//                               (Hint used)
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <div style={{ padding: '20px', textAlign: 'center' }}>
//                     No data available.
//                   </div>
//                 )}
//               </div>
//               <div
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   marginTop: '20px',
//                 }}
//               >
//                 <div className={styles.small} style={{ margin: 0 }}>
//                   Final Score: {totalScoreCalc} / {history.length}
//                 </div>
//                 <button
//                   className={`${styles.btn} ${styles.primary}`}
//                   onClick={handleFinish}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>SequenceAct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/comps/acts/SequenceAct.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/apiService.js [client] (ecmascript)"); // Imported Central Service
;
var _s = __turbopack_context__.k.signature();
;
;
;
function generateUniqueId(title, text) {
    const source = (title || '') + (text || '');
    let hash = 0;
    for(let i = 0; i < source.length; i++){
        hash = (hash << 5) - hash + source.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash).toString();
}
function SequenceAct({ data }) {
    _s();
    const [appState, setAppState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('LOADING');
    const [queue, setQueue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentRound, setCurrentRound] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isReadOnly, setIsReadOnly] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [blocks, setBlocks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [connections, setConnections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [hasUsedHint, setHasUsedHint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasGivenUp, setHasGivenUp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [resultMessage, setResultMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isDrawing, setIsDrawing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [startIdx, setStartIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(-1);
    const [tempLine, setTempLine] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const blockRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activityId, setActivityId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('Sequence Activity');
    // --- 1. INITIALIZATION ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SequenceAct.useEffect": ()=>{
            if (!data) return;
            const uid = Number(data.user_id || localStorage.getItem('user_id') || 0);
            setUserId(uid);
            const rawTitle = data.title || 'Sequence Game';
            let rawText = data.text || '';
            const generatedId = data.id || generateUniqueId(rawTitle, rawText);
            setActivityId(generatedId);
            setTitle(rawTitle);
            const lines = rawText.split('\n').filter({
                "SequenceAct.useEffect.lines": (line)=>line.trim().length > 0
            }["SequenceAct.useEffect.lines"]);
            const parsedQueue = lines.map({
                "SequenceAct.useEffect.parsedQueue": (line)=>{
                    const cleanLine = line.trim();
                    let chunks = [];
                    if (cleanLine.includes(' ')) {
                        chunks = cleanLine.split(/\s+/).filter(Boolean);
                    } else if (cleanLine.includes(',')) {
                        chunks = cleanLine.split(',').map({
                            "SequenceAct.useEffect.parsedQueue": (s)=>s.trim()
                        }["SequenceAct.useEffect.parsedQueue"]);
                    } else {
                        try {
                            const segmenter = new Intl.Segmenter('hi', {
                                granularity: 'grapheme'
                            });
                            chunks = Array.from(segmenter.segment(cleanLine)).map({
                                "SequenceAct.useEffect.parsedQueue": (s)=>s.segment
                            }["SequenceAct.useEffect.parsedQueue"]);
                        } catch (e) {
                            chunks = cleanLine.split('');
                        }
                    }
                    return {
                        fullText: cleanLine,
                        chunks
                    };
                }
            }["SequenceAct.useEffect.parsedQueue"]);
            setQueue(parsedQueue);
            const fetchProgress = {
                "SequenceAct.useEffect.fetchProgress": async ()=>{
                    if (!uid) {
                        startNextRound(parsedQueue);
                        return;
                    }
                    try {
                        // --- REFACTORED TO USE apiService ---
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].getSequenceProgress(uid, generatedId);
                        const savedData = res.data;
                        if (savedData && savedData.status === 'COMPLETED') {
                            setIsReadOnly(true);
                            if (savedData.data && savedData.data.history) {
                                setHistory(savedData.data.history);
                            }
                            setAppState('SUMMARY');
                            return;
                        }
                    } catch (e) {
                        console.log('New session or progress not found.');
                    }
                    startNextRound(parsedQueue);
                }
            }["SequenceAct.useEffect.fetchProgress"];
            fetchProgress();
        }
    }["SequenceAct.useEffect"], [
        data
    ]);
    // --- 2. ROUND MANAGEMENT ---
    const startNextRound = (currentQueue)=>{
        if (currentQueue.length === 0) {
            endGame(history);
            return;
        }
        const nextRound = currentQueue[0];
        setQueue(currentQueue.slice(1));
        setCurrentRound(nextRound);
        setConnections([]);
        setHasUsedHint(false);
        setHasGivenUp(false);
        setResultMessage('');
        setTempLine(null);
        setIsDrawing(false);
        setStartIdx(-1);
        setTimeout(()=>spawnBlocks(nextRound.chunks), 50);
    };
    const spawnBlocks = (chunks)=>{
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const existingPositions = [];
        const newBlocks = [];
        const blockW = 80;
        const blockH = 60;
        const padding = 20;
        const maxW = rect.width - blockW - padding;
        const maxH = rect.height - blockH - padding;
        chunks.forEach((text, index)=>{
            let attempts = 0;
            let x, y, safe;
            do {
                safe = true;
                x = Math.random() * (maxW - padding) + padding;
                y = Math.random() * (maxH - padding) + padding;
                for (let pos of existingPositions){
                    const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
                    if (dist < 90) {
                        safe = false;
                        break;
                    }
                }
                attempts++;
            }while (!safe && attempts < 50)
            existingPositions.push({
                x,
                y
            });
            newBlocks.push({
                index,
                text,
                x,
                y,
                isShaking: false,
                isHint: false
            });
        });
        setBlocks(newBlocks);
        setAppState('PLAYING');
    };
    // --- 3. DRAWING & CONNECTIONS ---
    const getBlockCenter = (idx)=>{
        const b = blocks.find((b)=>b.index === idx);
        const el = blockRefs.current.get(idx);
        if (!b || !el) return {
            x: 0,
            y: 0
        };
        return {
            x: b.x + el.offsetWidth / 2,
            y: b.y + el.offsetHeight / 2
        };
    };
    const handlePointerDown = (e, index)=>{
        if (appState !== 'PLAYING' || e.button !== 0 && e.type !== 'touchstart') return;
        if (e.cancelable) e.preventDefault();
        const lastConnected = connections.length > 0 ? connections[connections.length - 1] : -1;
        let validStart = false;
        if (connections.length === 0 && index === 0) validStart = true;
        else if (lastConnected === index) validStart = true;
        if (!validStart) {
            triggerShake(index);
            return;
        }
        setIsDrawing(true);
        setStartIdx(index);
        const center = getBlockCenter(index);
        setTempLine({
            x1: center.x,
            y1: center.y,
            x2: center.x,
            y2: center.y
        });
    };
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SequenceAct.useCallback[handlePointerMove]": (e)=>{
            if (!isDrawing || !canvasRef.current) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const rect = canvasRef.current.getBoundingClientRect();
            const x2 = clientX - rect.left;
            const y2 = clientY - rect.top;
            setTempLine({
                "SequenceAct.useCallback[handlePointerMove]": (prev)=>prev ? {
                        ...prev,
                        x2,
                        y2
                    } : null
            }["SequenceAct.useCallback[handlePointerMove]"]);
        }
    }["SequenceAct.useCallback[handlePointerMove]"], [
        isDrawing
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SequenceAct.useCallback[handlePointerUp]": (e)=>{
            if (!isDrawing) return;
            setIsDrawing(false);
            setTempLine(null);
            const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
            const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
            let targetIdx = -1;
            blockRefs.current.forEach({
                "SequenceAct.useCallback[handlePointerUp]": (el, idx)=>{
                    const rect = el.getBoundingClientRect();
                    if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
                        targetIdx = idx;
                    }
                }
            }["SequenceAct.useCallback[handlePointerUp]"]);
            if (targetIdx !== -1 && targetIdx !== startIdx) {
                validateConnection(startIdx, targetIdx);
            }
            setStartIdx(-1);
        }
    }["SequenceAct.useCallback[handlePointerUp]"], [
        isDrawing,
        startIdx,
        connections,
        blocks
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SequenceAct.useEffect": ()=>{
            document.addEventListener('mousemove', handlePointerMove);
            document.addEventListener('mouseup', handlePointerUp);
            document.addEventListener('touchmove', handlePointerMove, {
                passive: false
            });
            document.addEventListener('touchend', handlePointerUp);
            return ({
                "SequenceAct.useEffect": ()=>{
                    document.removeEventListener('mousemove', handlePointerMove);
                    document.removeEventListener('mouseup', handlePointerUp);
                    document.removeEventListener('touchmove', handlePointerMove);
                    document.removeEventListener('touchend', handlePointerUp);
                }
            })["SequenceAct.useEffect"];
        }
    }["SequenceAct.useEffect"], [
        handlePointerMove,
        handlePointerUp
    ]);
    const validateConnection = (from, to)=>{
        if (to === from + 1) {
            const newConns = [
                ...connections,
                to
            ];
            setConnections(newConns);
            if (newConns.length === blocks.length - 1) {
                completeRound(newConns, false);
            }
        } else {
            triggerShake(to);
        }
    };
    const triggerShake = (idx)=>{
        setBlocks((prev)=>prev.map((b)=>b.index === idx ? {
                    ...b,
                    isShaking: true
                } : b));
        setTimeout(()=>{
            setBlocks((prev)=>prev.map((b)=>b.index === idx ? {
                        ...b,
                        isShaking: false
                    } : b));
        }, 300);
    };
    // --- 4. GAME ACTIONS ---
    const handleHint = ()=>{
        if (isReadOnly) return;
        setHasUsedHint(true);
        const nextIdx = connections.length === 0 ? 0 : connections[connections.length - 1] + 1;
        setBlocks((prev)=>prev.map((b)=>b.index === nextIdx ? {
                    ...b,
                    isHint: true
                } : b));
        setTimeout(()=>{
            setBlocks((prev)=>prev.map((b)=>b.index === nextIdx ? {
                        ...b,
                        isHint: false
                    } : b));
        }, 500);
    };
    const handleGiveUp = ()=>{
        if (isReadOnly) return;
        setHasGivenUp(true);
        const fullConns = [];
        for(let i = 1; i < blocks.length; i++)fullConns.push(i);
        setConnections(fullConns);
        completeRound(fullConns, true);
    };
    const completeRound = (finalConns, gaveUp)=>{
        setAppState('ROUND_END');
        let score = 1;
        let status = 'perfect';
        if (gaveUp) {
            score = 0;
            status = 'fail';
        } else if (hasUsedHint) {
            score = 0.5;
            status = 'hint';
        }
        const newHistory = [
            ...history,
            {
                text: currentRound.fullText,
                status,
                score
            }
        ];
        setHistory(newHistory);
        let totalScore = newHistory.reduce((acc, h)=>acc + h.score, 0);
        saveProgressAPI(newHistory, totalScore, newHistory.length);
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const gap = 10;
            let totalW = 0;
            blocks.forEach((_, i)=>{
                const el = blockRefs.current.get(i);
                totalW += (el ? el.offsetWidth : 80) + gap;
            });
            let currentX = (rect.width - totalW) / 2;
            const centerY = rect.height / 2 - 22;
            setBlocks((prev)=>prev.map((b)=>{
                    const el = blockRefs.current.get(b.index);
                    const w = el ? el.offsetWidth : 80;
                    const res = {
                        ...b,
                        x: currentX,
                        y: centerY
                    };
                    currentX += w + gap;
                    return res;
                }));
        }
        setResultMessage(gaveUp ? 'Solution Shown' : 'Good Job!');
    };
    const endGame = (finalHistory)=>{
        setAppState('SUMMARY');
        let totalScore = finalHistory.reduce((acc, h)=>acc + h.score, 0);
        if (!isReadOnly) {
            completeActivityAPI(totalScore, finalHistory.length);
        }
    };
    // --- 5. REFACTORED API CALLS ---
    const saveProgressAPI = async (hist, score, totalRounds)=>{
        if (!userId) return;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].saveSequenceProgress({
                user_id: userId,
                activity_id: activityId,
                progress_json: JSON.stringify({
                    history: hist
                }),
                score: score,
                attempted: totalRounds,
                status: 'IN_PROGRESS'
            });
        } catch (e) {
            console.error('Progress save failed');
        }
    };
    const completeActivityAPI = async (finalScore, totalRounds)=>{
        if (!userId) return;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].completeSequence({
                user_id: userId,
                activity_id: activityId,
                score: finalScore,
                attempted: totalRounds
            });
        } catch (e) {
            console.error('Completion save failed');
        }
    };
    const handleFinish = ()=>{
        try {
            window.parent.postMessage(JSON.stringify({
                done: true
            }), '*');
        } catch (e) {}
    };
    const totalScoreCalc = history.reduce((acc, h)=>acc + h.score, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wrapper,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainCard,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainCardInner,
                children: [
                    appState !== 'SUMMARY' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headerRow,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].title,
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/comps/acts/SequenceAct.js",
                                        lineNumber: 1030,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].score,
                                        style: {
                                            display: appState !== 'LOADING' ? 'block' : 'none'
                                        },
                                        children: [
                                            "Remaining: ",
                                            queue.length + (appState === 'PLAYING' ? 1 : 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/comps/acts/SequenceAct.js",
                                        lineNumber: 1031,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/acts/SequenceAct.js",
                                lineNumber: 1029,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].canvasArea,
                                ref: canvasRef,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].svgLayer,
                                        children: [
                                            appState === 'PLAYING' && connections.map((toIdx)=>{
                                                const fromIdx = toIdx - 1;
                                                const c1 = getBlockCenter(fromIdx);
                                                const c2 = getBlockCenter(toIdx);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: c1.x,
                                                    y1: c1.y,
                                                    x2: c2.x,
                                                    y2: c2.y,
                                                    stroke: "#ef4444",
                                                    strokeWidth: "4"
                                                }, `conn-${toIdx}`, false, {
                                                    fileName: "[project]/comps/acts/SequenceAct.js",
                                                    lineNumber: 1047,
                                                    columnNumber: 25
                                                }, this);
                                            }),
                                            appState === 'PLAYING' && tempLine && startIdx !== -1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: getBlockCenter(startIdx).x,
                                                y1: getBlockCenter(startIdx).y,
                                                x2: tempLine.x2,
                                                y2: tempLine.y2,
                                                stroke: "#60a5fa",
                                                strokeWidth: "4",
                                                strokeDasharray: "5,5"
                                            }, void 0, false, {
                                                fileName: "[project]/comps/acts/SequenceAct.js",
                                                lineNumber: 1059,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/comps/acts/SequenceAct.js",
                                        lineNumber: 1040,
                                        columnNumber: 17
                                    }, this),
                                    blocks.map((b)=>{
                                        const isActive = startIdx === b.index;
                                        const isCompleted = appState === 'ROUND_END';
                                        let bClass = __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wordBlock;
                                        if (isActive) bClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wordBlockActive}`;
                                        if (isCompleted) bClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wordBlockCompleted}`;
                                        if (b.isShaking) bClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shake}`;
                                        if (b.isHint) bClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hintBorder}`;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            ref: (el)=>blockRefs.current.set(b.index, el),
                                            className: bClass,
                                            style: {
                                                left: `${b.x}px`,
                                                top: `${b.y}px`
                                            },
                                            onMouseDown: (e)=>handlePointerDown(e, b.index),
                                            onTouchStart: (e)=>handlePointerDown(e, b.index),
                                            children: b.text
                                        }, `block-${b.index}`, false, {
                                            fileName: "[project]/comps/acts/SequenceAct.js",
                                            lineNumber: 1082,
                                            columnNumber: 21
                                        }, this);
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/acts/SequenceAct.js",
                                lineNumber: 1039,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultMessage,
                                children: resultMessage
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/SequenceAct.js",
                                lineNumber: 1096,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].controls,
                                children: [
                                    appState === 'PLAYING' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].btnGroup,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].btn} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].secondary}`,
                                                onClick: handleHint,
                                                disabled: isReadOnly,
                                                children: "Hint"
                                            }, void 0, false, {
                                                fileName: "[project]/comps/acts/SequenceAct.js",
                                                lineNumber: 1101,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].btn} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].danger}`,
                                                onClick: handleGiveUp,
                                                disabled: isReadOnly,
                                                children: "Give Up"
                                            }, void 0, false, {
                                                fileName: "[project]/comps/acts/SequenceAct.js",
                                                lineNumber: 1108,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/comps/acts/SequenceAct.js",
                                        lineNumber: 1100,
                                        columnNumber: 19
                                    }, this),
                                    appState === 'ROUND_END' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].btn} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].primary}`,
                                        onClick: ()=>startNextRound(queue),
                                        children: "Next"
                                    }, void 0, false, {
                                        fileName: "[project]/comps/acts/SequenceAct.js",
                                        lineNumber: 1118,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/acts/SequenceAct.js",
                                lineNumber: 1098,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true),
                    appState === 'SUMMARY' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            width: '100%'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].title,
                                    children: "You have completed this activity."
                                }, void 0, false, {
                                    fileName: "[project]/comps/acts/SequenceAct.js",
                                    lineNumber: 1139,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/SequenceAct.js",
                                lineNumber: 1138,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flexGrow: 1,
                                    overflowY: 'auto',
                                    paddingRight: '10px',
                                    marginTop: '10px'
                                },
                                children: history.length > 0 ? history.map((item, i)=>{
                                    const isPerfect = item.score === 1;
                                    const isFail = item.score === 0;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryItem,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 'bold',
                                                    marginBottom: '4px'
                                                },
                                                children: [
                                                    i + 1,
                                                    ". ",
                                                    item.text
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/comps/acts/SequenceAct.js",
                                                lineNumber: 1158,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '0.9em'
                                                },
                                                children: [
                                                    "Score:",
                                                    ' ',
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: isPerfect ? '#2ecc71' : isFail ? '#e74c3c' : '#d97706',
                                                            fontWeight: 'bold'
                                                        },
                                                        children: item.score
                                                    }, void 0, false, {
                                                        fileName: "[project]/comps/acts/SequenceAct.js",
                                                        lineNumber: 1165,
                                                        columnNumber: 27
                                                    }, this),
                                                    item.status === 'hint' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: '#777',
                                                            marginLeft: '8px'
                                                        },
                                                        children: "(Hint used)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/comps/acts/SequenceAct.js",
                                                        lineNumber: 1178,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/comps/acts/SequenceAct.js",
                                                lineNumber: 1163,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/comps/acts/SequenceAct.js",
                                        lineNumber: 1157,
                                        columnNumber: 23
                                    }, this);
                                }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: '20px',
                                        textAlign: 'center'
                                    },
                                    children: "No data available."
                                }, void 0, false, {
                                    fileName: "[project]/comps/acts/SequenceAct.js",
                                    lineNumber: 1187,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/SequenceAct.js",
                                lineNumber: 1144,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginTop: '20px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].small,
                                        style: {
                                            margin: 0
                                        },
                                        children: [
                                            "Final Score: ",
                                            totalScoreCalc,
                                            " / ",
                                            history.length
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/comps/acts/SequenceAct.js",
                                        lineNumber: 1201,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].btn} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].primary}`,
                                        onClick: handleFinish,
                                        children: "Next"
                                    }, void 0, false, {
                                        fileName: "[project]/comps/acts/SequenceAct.js",
                                        lineNumber: 1204,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/acts/SequenceAct.js",
                                lineNumber: 1193,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/acts/SequenceAct.js",
                        lineNumber: 1130,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/comps/acts/SequenceAct.js",
                lineNumber: 1026,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/comps/acts/SequenceAct.js",
            lineNumber: 1025,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/comps/acts/SequenceAct.js",
        lineNumber: 1024,
        columnNumber: 5
    }, this);
}
_s(SequenceAct, "t1+Zg0Hj/l2GnWWHLr9EV+BIPYY=");
_c = SequenceAct;
var _c;
__turbopack_context__.k.register(_c, "SequenceAct");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/comps/acts/ClassifySentenceAct.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "card": "ClassifySentenceAct-module__eIrq9G__card",
  "container": "ClassifySentenceAct-module__eIrq9G__container",
  "controlsRow": "ClassifySentenceAct-module__eIrq9G__controlsRow",
  "cross": "ClassifySentenceAct-module__eIrq9G__cross",
  "hintBtn": "ClassifySentenceAct-module__eIrq9G__hintBtn",
  "markIcon": "ClassifySentenceAct-module__eIrq9G__markIcon",
  "nextBtn": "ClassifySentenceAct-module__eIrq9G__nextBtn",
  "optBtn": "ClassifySentenceAct-module__eIrq9G__optBtn",
  "optionsRow": "ClassifySentenceAct-module__eIrq9G__optionsRow",
  "qText": "ClassifySentenceAct-module__eIrq9G__qText",
  "score": "ClassifySentenceAct-module__eIrq9G__score",
  "selected": "ClassifySentenceAct-module__eIrq9G__selected",
  "small": "ClassifySentenceAct-module__eIrq9G__small",
  "summary": "ClassifySentenceAct-module__eIrq9G__summary",
  "summaryCorrect": "ClassifySentenceAct-module__eIrq9G__summaryCorrect",
  "summaryItem": "ClassifySentenceAct-module__eIrq9G__summaryItem",
  "summaryWrong": "ClassifySentenceAct-module__eIrq9G__summaryWrong",
  "tick": "ClassifySentenceAct-module__eIrq9G__tick",
  "title": "ClassifySentenceAct-module__eIrq9G__title",
  "wrap": "ClassifySentenceAct-module__eIrq9G__wrap",
  "wrapper": "ClassifySentenceAct-module__eIrq9G__wrapper",
  "wrong": "ClassifySentenceAct-module__eIrq9G__wrong",
});
}),
"[project]/comps/acts/ClassifySentenceAct.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// // comps/acts/ClassifySentenceAct.js
// import React, { useState, useEffect } from 'react';
// import styles from './ClassifySentenceAct.module.css';
// function shuffleArray(arr) {
//   const a = [...arr];
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// }
// function parseClassify(text) {
//   if (!text) return [];
//   const lines = text
//     .split(/\r?\n/)
//     .map((s) => s.trim())
//     .filter(Boolean);
//   return lines.map((line) => {
//     const parts = line.split('|').map((p) => p.trim());
//     let qText = '',
//       optsRaw = '';
//     if (parts.length === 3) {
//       qText = parts[1];
//       optsRaw = parts[2];
//     } else {
//       qText = parts[0];
//       optsRaw = parts[1] || '';
//     }
//     const rawOpts = optsRaw
//       .split(',')
//       .map((o) => o.trim())
//       .filter(Boolean);
//     let correctIdx = -1;
//     const cleanOpts = rawOpts.map((o, i) => {
//       if (o.startsWith('*')) {
//         correctIdx = i;
//         return o.replace(/^\*+/, '').trim();
//       }
//       return o;
//     });
//     if (correctIdx === -1) correctIdx = 0;
//     const order = shuffleArray(cleanOpts.map((_, i) => i));
//     const shuffled = [];
//     let newCorrect = -1;
//     order.forEach((oldIdx, newIdx) => {
//       shuffled.push(cleanOpts[oldIdx]);
//       if (oldIdx === correctIdx) newCorrect = newIdx;
//     });
//     return {
//       qText,
//       options: shuffled,
//       correctIndex: newCorrect,
//       userChoice: null,
//     };
//   });
// }
// export default function ClassifySentenceAct({ data }) {
//   const [questions, setQuestions] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [score, setScore] = useState(0);
//   const [attempted, setAttempted] = useState(0);
//   const [status, setStatus] = useState('PLAYING');
//   const title = data?.title || 'Pick the right option';
//   useEffect(() => {
//     if (!data) return;
//     const rawText = data.text || '';
//     let parsedQs = parseClassify(rawText);
//     parsedQs = shuffleArray(parsedQs);
//     setQuestions(parsedQs);
//   }, [data]);
//   const handleOptionClick = (idx) => {
//     const q = questions[current];
//     if (q.userChoice !== null) return; // Already answered
//     const isCorrect = idx === q.correctIndex;
//     const updatedQuestions = [...questions];
//     updatedQuestions[current] = { ...q, userChoice: idx };
//     setQuestions(updatedQuestions);
//     setAttempted(attempted + 1);
//     if (isCorrect) setScore(score + 1);
//   };
//   const handleNext = () => {
//     if (current + 1 < questions.length) {
//       setCurrent(current + 1);
//     } else {
//       setStatus('SUMMARY');
//     }
//   };
//   const handleDone = () => {
//     try {
//       window.parent.postMessage(
//         JSON.stringify({ done: true, score: score, total: attempted }),
//         '*'
//       );
//     } catch (_) {}
//   };
//   // Keyboard support (Enter to go next)
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       const q = questions[current];
//       if (
//         e.key === 'Enter' &&
//         q &&
//         q.userChoice !== null &&
//         status === 'PLAYING'
//       ) {
//         handleNext();
//       }
//     };
//     document.addEventListener('keydown', handleKeyDown);
//     return () => document.removeEventListener('keydown', handleKeyDown);
//   });
//   if (questions.length === 0) return null;
//   const q = questions[current];
//   const total = questions.length;
//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.wrap}>
//         <div className={styles.title}>{title}</div>
//         {status === 'PLAYING' ? (
//           <div className={styles.card}>
//             <div className={styles.small}>{current + 1})</div>
//             <div
//               className={styles.qText}
//               dangerouslySetInnerHTML={{ __html: q.qText }}
//             />
//             <div className={styles.optionsRow}>
//               {q.options.map((opt, i) => {
//                 const isSelected = q.userChoice === i;
//                 const isCorrectAns = q.correctIndex === i;
//                 const showTick =
//                   (isSelected && isCorrectAns) ||
//                   (q.userChoice !== null && isCorrectAns);
//                 const showCross = isSelected && !isCorrectAns;
//                 let btnClass = styles.optBtn;
//                 if (q.userChoice !== null) {
//                   if (isCorrectAns) btnClass += ` ${styles.selected}`;
//                   else if (isSelected) btnClass += ` ${styles.wrong}`;
//                 }
//                 return (
//                   <div
//                     key={i}
//                     className={btnClass}
//                     onClick={() => handleOptionClick(i)}
//                   >
//                     {opt}
//                     {showTick && (
//                       <span className={`${styles.markIcon} ${styles.tick}`}>
//                         ✓
//                       </span>
//                     )}
//                     {showCross && (
//                       <span className={`${styles.markIcon} ${styles.cross}`}>
//                         ✘
//                       </span>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//             <div style={{ height: '18px' }}></div>
//             <div className={styles.controlsRow}>
//               <div className={styles.score}>
//                 Score: {score} / {attempted}
//               </div>
//               <div>
//                 <button
//                   className={styles.nextBtn}
//                   disabled={q.userChoice === null}
//                   onClick={handleNext}
//                 >
//                   {current + 1 === total ? 'Finish' : 'Next'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           /* FINAL SUMMARY */
//           <div className={styles.card} style={{ marginTop: '18px' }}>
//             <div style={{ fontSize: '18px', fontWeight: 600 }}>
//               You have completed this activity.
//             </div>
//             <div className={styles.summary}>
//               {questions.map((sq, i) => {
//                 const user =
//                   sq.userChoice === null
//                     ? '(no answer)'
//                     : sq.options[sq.userChoice];
//                 const correct = sq.options[sq.correctIndex];
//                 const colorClass =
//                   sq.userChoice === sq.correctIndex
//                     ? styles.summaryCorrect
//                     : styles.summaryWrong;
//                 return (
//                   <div key={i} className={styles.summaryItem}>
//                     <strong>{i + 1})</strong>{' '}
//                     <span dangerouslySetInnerHTML={{ __html: sq.qText }} />
//                     <br />
//                     Answer: <span className={colorClass}>{user}</span>
//                     <span style={{ color: '#555', marginLeft: '8px' }}>
//                       — Correct: <strong>{correct}</strong>
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//             <div
//               style={{
//                 marginTop: '16px',
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//               }}
//             >
//               <div
//                 className={styles.small}
//                 style={{ fontSize: '16px', fontWeight: 'bold' }}
//               >
//                 Final Score: {score} / {attempted}
//               </div>
//               <button className={styles.nextBtn} onClick={handleDone}>
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// comps/acts/ClassifySentenceAct.js
__turbopack_context__.s([
    "default",
    ()=>ClassifySentenceAct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/comps/acts/ClassifySentenceAct.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
function shuffleArray(arr) {
    const a = [
        ...arr
    ];
    for(let i = a.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [
            a[j],
            a[i]
        ];
    }
    return a;
}
function parseClassify(text) {
    if (!text) return [];
    const lines = text.split(/\r?\n/).map((s)=>s.trim()).filter(Boolean);
    return lines.map((line)=>{
        const parts = line.split('|').map((p)=>p.trim());
        let qText = '', optsRaw = '';
        if (parts.length === 3) {
            qText = parts[1];
            optsRaw = parts[2];
        } else {
            qText = parts[0];
            optsRaw = parts[1] || '';
        }
        const rawOpts = optsRaw.split(',').map((o)=>o.trim()).filter(Boolean);
        let correctIdx = -1;
        const cleanOpts = rawOpts.map((o, i)=>{
            if (o.startsWith('*')) {
                correctIdx = i;
                return o.replace(/^\*+/, '').trim();
            }
            return o;
        });
        if (correctIdx === -1) correctIdx = 0;
        const order = shuffleArray(cleanOpts.map((_, i)=>i));
        const shuffled = [];
        let newCorrect = -1;
        order.forEach((oldIdx, newIdx)=>{
            shuffled.push(cleanOpts[oldIdx]);
            if (oldIdx === correctIdx) newCorrect = newIdx;
        });
        return {
            qText,
            options: shuffled,
            correctIndex: newCorrect,
            userChoice: null
        };
    });
}
function ClassifySentenceAct({ data }) {
    _s();
    const [questions, setQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [current, setCurrent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [score, setScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [attempted, setAttempted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('PLAYING');
    const title = data?.title || 'Pick the right option';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ClassifySentenceAct.useEffect": ()=>{
            if (!data) return;
            const rawText = data.text || '';
            let parsedQs = parseClassify(rawText);
            parsedQs = shuffleArray(parsedQs);
            setQuestions(parsedQs);
        }
    }["ClassifySentenceAct.useEffect"], [
        data
    ]);
    const handleOptionClick = (idx)=>{
        const q = questions[current];
        if (q.userChoice !== null) return;
        const isCorrect = idx === q.correctIndex;
        const updatedQuestions = [
            ...questions
        ];
        updatedQuestions[current] = {
            ...q,
            userChoice: idx
        };
        setQuestions(updatedQuestions);
        setAttempted(attempted + 1);
        if (isCorrect) setScore(score + 1);
    };
    const handleNext = ()=>{
        if (current + 1 < questions.length) {
            setCurrent(current + 1);
        } else {
            setStatus('SUMMARY');
        }
    };
    const handleDone = ()=>{
        try {
            window.parent.postMessage(JSON.stringify({
                done: true,
                score: score,
                total: attempted
            }), '*');
        } catch (_) {}
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ClassifySentenceAct.useEffect": ()=>{
            const handleKeyDown = {
                "ClassifySentenceAct.useEffect.handleKeyDown": (e)=>{
                    const q = questions[current];
                    if (e.key === 'Enter' && q && q.userChoice !== null && status === 'PLAYING') {
                        handleNext();
                    }
                }
            }["ClassifySentenceAct.useEffect.handleKeyDown"];
            document.addEventListener('keydown', handleKeyDown);
            return ({
                "ClassifySentenceAct.useEffect": ()=>document.removeEventListener('keydown', handleKeyDown)
            })["ClassifySentenceAct.useEffect"];
        }
    }["ClassifySentenceAct.useEffect"]);
    if (questions.length === 0) return null;
    const q = questions[current];
    const total = questions.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wrapper,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wrap,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].title,
                        id: "actTitle",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                        lineNumber: 403,
                        columnNumber: 11
                    }, this),
                    status === 'PLAYING' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].card,
                        id: "cardRoot",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].small,
                                children: [
                                    current + 1,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                lineNumber: 410,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].qText,
                                dangerouslySetInnerHTML: {
                                    __html: q.qText
                                }
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                lineNumber: 411,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].optionsRow,
                                children: q.options.map((opt, i)=>{
                                    const isSelected = q.userChoice === i;
                                    const isCorrectAns = q.correctIndex === i;
                                    const showTick = isSelected && isCorrectAns || q.userChoice !== null && isCorrectAns;
                                    const showCross = isSelected && !isCorrectAns;
                                    let btnClass = __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].optBtn;
                                    if (q.userChoice !== null) {
                                        if (isCorrectAns) btnClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].selected}`;
                                        else if (isSelected) btnClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wrong}`;
                                    }
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: btnClass,
                                        onClick: ()=>handleOptionClick(i),
                                        children: [
                                            opt,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].markIcon} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tick}`,
                                                style: {
                                                    display: showTick ? 'block' : 'none'
                                                },
                                                children: "✓"
                                            }, void 0, false, {
                                                fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                                lineNumber: 438,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].markIcon} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cross}`,
                                                style: {
                                                    display: showCross ? 'block' : 'none'
                                                },
                                                children: "✘"
                                            }, void 0, false, {
                                                fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                                lineNumber: 444,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                        lineNumber: 432,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                lineNumber: 416,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    height: '18px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                lineNumber: 455,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].controlsRow,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].score,
                                        id: "scoreBox",
                                        children: [
                                            "Score: ",
                                            score,
                                            " / ",
                                            attempted
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                        lineNumber: 458,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].nextBtn,
                                            id: "nextBtn",
                                            disabled: q.userChoice === null,
                                            onClick: handleNext,
                                            children: current + 1 === total ? 'Finish' : 'Next'
                                        }, void 0, false, {
                                            fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                            lineNumber: 462,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                        lineNumber: 461,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                lineNumber: 457,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                        lineNumber: 408,
                        columnNumber: 13
                    }, this) : /* EXACTLY matching the summary from index.html & app.js */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "finalWrap",
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].card} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryCard}`,
                        style: {
                            marginTop: '18px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '18px',
                                    fontWeight: 600
                                },
                                children: "You have completed this activity."
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                lineNumber: 480,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summary,
                                id: "summaryList",
                                children: questions.map((sq, i)=>{
                                    const user = sq.userChoice === null ? '(no answer)' : sq.options[sq.userChoice];
                                    const correct = sq.options[sq.correctIndex];
                                    const color = sq.userChoice === sq.correctIndex ? 'green' : 'red';
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryItem,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    i + 1,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                                lineNumber: 495,
                                                columnNumber: 23
                                            }, this),
                                            ' ',
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                dangerouslySetInnerHTML: {
                                                    __html: sq.qText
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                                lineNumber: 496,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                                lineNumber: 497,
                                                columnNumber: 23
                                            }, this),
                                            "Answer: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: color
                                                },
                                                children: user
                                            }, void 0, false, {
                                                fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                                lineNumber: 498,
                                                columnNumber: 31
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: '#777',
                                                    marginLeft: '8px'
                                                },
                                                children: [
                                                    "— Correct: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: correct
                                                    }, void 0, false, {
                                                        fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                                        lineNumber: 500,
                                                        columnNumber: 36
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                                lineNumber: 499,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                        lineNumber: 494,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                lineNumber: 483,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: '10px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].small,
                                        id: "finalScore",
                                        style: {
                                            fontSize: '14px'
                                        },
                                        children: [
                                            "Score: ",
                                            score,
                                            " / ",
                                            attempted
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                        lineNumber: 515,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].nextBtn,
                                        id: "doneBtn",
                                        onClick: handleDone,
                                        children: "Next"
                                    }, void 0, false, {
                                        fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                        lineNumber: 522,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                                lineNumber: 507,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                        lineNumber: 475,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/comps/acts/ClassifySentenceAct.js",
                lineNumber: 402,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/comps/acts/ClassifySentenceAct.js",
            lineNumber: 401,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/comps/acts/ClassifySentenceAct.js",
        lineNumber: 400,
        columnNumber: 5
    }, this);
}
_s(ClassifySentenceAct, "xE6vKOMfIcX5m4iRiHcj/0MjmiE=");
_c = ClassifySentenceAct;
var _c;
__turbopack_context__.k.register(_c, "ClassifySentenceAct");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/comps/acts/MatchByAct.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// // comps/acts/MatchByAct.js
// import React, { useState, useEffect } from 'react';
// import styles from './MatchByAct.module.css';
// const API_BASE = 'http://192.168.0.127:8080/ords/lms/matchby';
// function generateUniqueId(title, text) {
//   const source = (title || '') + (text || '');
//   let hash = 0;
//   for (let i = 0; i < source.length; i++) {
//     hash = (hash << 5) - hash + source.charCodeAt(i);
//     hash |= 0;
//   }
//   return Math.abs(hash).toString();
// }
// export default function MatchByAct({ data }) {
//   const [appState, setAppState] = useState('LOADING'); // LOADING, PLAYING, EVALUATED
//   const [sentences, setSentences] = useState([]);
//   const [answers, setAnswers] = useState([]);
//   const [options, setOptions] = useState([]);
//   const [filled, setFilled] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [isParagraphMode, setIsParagraphMode] = useState(false);
//   const [originalText, setOriginalText] = useState('');
//   const [isReadOnly, setIsReadOnly] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [activityId, setActivityId] = useState('');
//   const [title, setTitle] = useState('Loading...');
//   const [dragOverIdx, setDragOverIdx] = useState(null);
//   const [score, setScore] = useState(0);
//   // --- 1. INITIALIZATION & PARSING ---
//   useEffect(() => {
//     if (!data) return;
//     const uid = Number(data.user_id || localStorage.getItem('user_id') || 0);
//     setUserId(uid);
//     const rawTitle = data.title || 'Fill in the Blanks';
//     let rawText = data.text || '';
//     const generatedId = data.id || generateUniqueId(rawTitle, rawText);
//     setActivityId(generatedId);
//     setTitle(rawTitle);
//     // Parse Text exactly like matchby.js
//     const lines = rawText
//       .split('\n')
//       .map((l) => l.trim())
//       .filter(Boolean);
//     let parsedSents = [];
//     let parsedAnswers = [];
//     let parsedFilled = [];
//     let parsedOpts = [];
//     let isPara = false;
//     if (lines.length === 1) {
//       isPara = true;
//       const matches = [...rawText.matchAll(/\*(.*?)\*/g)];
//       matches.forEach((match) => {
//         const correct = match[1].trim();
//         parsedAnswers.push(correct);
//         parsedFilled.push(null);
//         parsedOpts.push(correct);
//       });
//     } else {
//       isPara = false;
//       lines.forEach((line) => {
//         const match = line.match(/\*(.*?)\*/);
//         if (!match) return;
//         const correct = match[1].trim();
//         const sentence = line.replace(/\*(.*?)\*/, '_____');
//         parsedSents.push(sentence);
//         parsedAnswers.push(correct);
//         parsedFilled.push(null);
//         parsedOpts.push(correct);
//       });
//     }
//     setSentences(parsedSents);
//     setAnswers(parsedAnswers);
//     setOriginalText(rawText);
//     setIsParagraphMode(isPara);
//     // Shuffle options once
//     const shuffled = [...parsedOpts].sort(() => Math.random() - 0.5);
//     setOptions(shuffled);
//     // Fetch API Data
//     const fetchProgress = async () => {
//       if (!uid) {
//         setFilled(parsedFilled);
//         setAppState('PLAYING');
//         return;
//       }
//       try {
//         const res = await fetch(
//           `${API_BASE}/progress/${uid}/${generatedId}?t=${new Date().getTime()}`
//         );
//         if (res.ok) {
//           const text = await res.text();
//           if (text && !text.includes('empty') && !text.includes('error')) {
//             const savedData = JSON.parse(text);
//             if (savedData.data && savedData.data.filled) {
//               parsedFilled = savedData.data.filled;
//             }
//             if (savedData.status === 'COMPLETED') {
//               setIsReadOnly(true);
//               setFilled(parsedFilled);
//               evaluateAnswers(parsedFilled, parsedAnswers, true);
//               return;
//             }
//           }
//         }
//       } catch (e) {}
//       setFilled(parsedFilled);
//       setAppState('PLAYING');
//     };
//     fetchProgress();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [data]);
//   // --- 2. DRAG AND DROP ---
//   const handleDragStart = (e, optText) => {
//     e.dataTransfer.setData('text/plain', optText);
//   };
//   const handleDrop = (e, index) => {
//     e.preventDefault();
//     setDragOverIdx(null);
//     if (isReadOnly) return;
//     const droppedText = e.dataTransfer.getData('text/plain');
//     if (!droppedText) return;
//     const currentValue = filled[index];
//     const newFilled = [...filled];
//     newFilled[index] = droppedText;
//     setHistory([
//       ...history,
//       { index, option: droppedText, replaced: currentValue || null },
//     ]);
//     setFilled(newFilled);
//     // Auto-validate if all filled
//     const currentFilledCount = newFilled.filter(Boolean).length;
//     saveProgressAPI(0, currentFilledCount, newFilled);
//     if (currentFilledCount === answers.length) {
//       evaluateAnswers(newFilled, answers, false);
//     }
//   };
//   const handleDragOver = (e, index) => {
//     e.preventDefault();
//     if (!isReadOnly) setDragOverIdx(index);
//   };
//   const handleDragLeave = () => {
//     setDragOverIdx(null);
//   };
//   // --- 3. GAME ACTIONS ---
//   const handleUndo = () => {
//     if (isReadOnly || history.length === 0) return;
//     const last = history[history.length - 1];
//     const newFilled = [...filled];
//     newFilled[last.index] = last.replaced;
//     setFilled(newFilled);
//     setHistory(history.slice(0, -1));
//     setAppState('PLAYING');
//   };
//   const handleReset = () => {
//     if (isReadOnly) return;
//     setFilled(Array(answers.length).fill(null));
//     setHistory([]);
//     setAppState('PLAYING');
//   };
//   const evaluateAnswers = (currentFilled, currentAnswers, skipSave) => {
//     let correctCount = 0;
//     currentFilled.forEach((given, i) => {
//       if (given === currentAnswers[i]) correctCount++;
//     });
//     setScore(correctCount);
//     setAppState('EVALUATED');
//     if (!skipSave) {
//       completeActivityAPI(correctCount, currentAnswers.length);
//     }
//   };
//   const handleNextClick = () => {
//     try {
//       window.parent.postMessage(JSON.stringify({ done: true }), '*');
//     } catch (e) {}
//   };
//   // --- 4. API ---
//   const saveProgressAPI = async (
//     currentScore,
//     attemptedCount,
//     currentFilled
//   ) => {
//     if (!userId) return;
//     try {
//       await fetch(`${API_BASE}/progress`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           user_id: userId,
//           activity_id: activityId,
//           progress_json: JSON.stringify({ filled: currentFilled }),
//           score: currentScore,
//           attempted: attemptedCount,
//           status: 'IN_PROGRESS',
//         }),
//       });
//     } catch (e) {}
//   };
//   const completeActivityAPI = async (finalScore, totalItems) => {
//     if (!userId) return;
//     try {
//       await fetch(`${API_BASE}/complete`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           user_id: userId,
//           activity_id: activityId,
//           score: finalScore,
//           attempted: totalItems,
//         }),
//       });
//     } catch (e) {}
//   };
//   // --- 5. RENDER HELPERS ---
//   // Calculate which options have been used to grey them out (exactly like vanilla)
//   const getUsedIndices = () => {
//     const used = new Set();
//     const filledCopy = [...filled];
//     options.forEach((opt, idx) => {
//       const fIdx = filledCopy.indexOf(opt);
//       if (fIdx !== -1) {
//         used.add(idx);
//         filledCopy[fIdx] = null; // consume
//       }
//     });
//     return used;
//   };
//   const usedIndices = getUsedIndices();
//   // Render Paragraph Mode
//   const renderParagraph = () => {
//     const parts = originalText.split(/(\*.*?\*)/g);
//     let dropIndex = 0;
//     return (
//       <div className={styles.paragraph}>
//         {parts.map((part, i) => {
//           if (part.startsWith('*') && part.endsWith('*')) {
//             const currentIdx = dropIndex++;
//             return renderDropBox(currentIdx, i);
//           }
//           return <span key={i}>{part}</span>;
//         })}
//       </div>
//     );
//   };
//   // Render Sentence Mode
//   const renderSentences = () => {
//     return sentences.map((sent, i) => {
//       const parts = sent.split('_____');
//       return (
//         <div key={i} className={styles.matchRow}>
//           <span className={styles.leftText}>{parts[0]}</span>
//           {renderDropBox(i, i)}
//           <span>{parts[1]}</span>
//         </div>
//       );
//     });
//   };
//   // Shared DropBox Renderer
//   const renderDropBox = (idx, key) => {
//     const given = filled[idx];
//     const correct = answers[idx];
//     const isEvaluated = appState === 'EVALUATED';
//     let boxClass = styles.dropBox;
//     if (dragOverIdx === idx) boxClass += ` ${styles.dragOver}`;
//     if (isEvaluated) {
//       boxClass += given === correct ? ` ${styles.correct}` : ` ${styles.wrong}`;
//     }
//     return (
//       <React.Fragment key={key}>
//         <span
//           className={boxClass}
//           onDragOver={(e) => handleDragOver(e, idx)}
//           onDragLeave={handleDragLeave}
//           onDrop={(e) => handleDrop(e, idx)}
//         >
//           {given}
//         </span>
//         {isEvaluated && <span className={styles.answerTag}> → {correct}</span>}
//       </React.Fragment>
//     );
//   };
//   if (appState === 'LOADING') return null;
//   const total = answers.length;
//   const isPerfect = score === total;
//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.mainCard}>
//         <div className={styles.mainCardInner}>
//           <h2 className={styles.title}>{title}</h2>
//           <div className={styles.matchArea}>
//             {isParagraphMode ? renderParagraph() : renderSentences()}
//           </div>
//           {/* Options only show properly if not fully read-only evaluated immediately */}
//           <div className={styles.optionsArea}>
//             {isReadOnly ? (
//               <div
//                 style={{
//                   color: '#666',
//                   fontStyle: 'italic',
//                   textAlign: 'center',
//                 }}
//               >
//                 Examination Completed
//               </div>
//             ) : (
//               options.map((opt, i) => (
//                 <div
//                   key={i}
//                   draggable
//                   onDragStart={(e) => handleDragStart(e, opt)}
//                   className={`${styles.option} ${usedIndices.has(i) ? styles.used : ''}`}
//                 >
//                   {opt}
//                 </div>
//               ))
//             )}
//           </div>
//           {appState === 'EVALUATED' && (
//             <div
//               className={`${styles.resultBox} ${isPerfect ? styles.goodJob : styles.goodTry}`}
//             >
//               {isPerfect ? 'Excellent!' : 'Good Try!'} <br />
//               Score:{' '}
//               <strong>
//                 {score} / {total}
//               </strong>
//             </div>
//           )}
//           <div className={styles.controls}>
//             <div className={styles.btnGroup}>
//               {appState === 'PLAYING' && !isReadOnly && (
//                 <>
//                   <button className={styles.secondaryBtn} onClick={handleUndo}>
//                     Undo
//                   </button>
//                   <button className={styles.secondaryBtn} onClick={handleReset}>
//                     Reset
//                   </button>
//                 </>
//               )}
//             </div>
//             {appState === 'EVALUATED' && (
//               <button className={styles.nextBtn} onClick={handleNextClick}>
//                 Next
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// comps/acts/ClassifySentenceAct.js
__turbopack_context__.s([
    "default",
    ()=>ClassifySentenceAct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/comps/acts/ClassifySentenceAct.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
function shuffleArray(arr) {
    const a = [
        ...arr
    ];
    for(let i = a.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [
            a[j],
            a[i]
        ];
    }
    return a;
}
function parseClassify(text) {
    if (!text) return [];
    const lines = text.split(/\r?\n/).map((s)=>s.trim()).filter(Boolean);
    return lines.map((line)=>{
        const parts = line.split('|').map((p)=>p.trim());
        let qText = '', optsRaw = '';
        if (parts.length === 3) {
            qText = parts[1];
            optsRaw = parts[2];
        } else {
            qText = parts[0];
            optsRaw = parts[1] || '';
        }
        const rawOpts = optsRaw.split(',').map((o)=>o.trim()).filter(Boolean);
        let correctIdx = -1;
        const cleanOpts = rawOpts.map((o, i)=>{
            if (o.startsWith('*')) {
                correctIdx = i;
                return o.replace(/^\*+/, '').trim();
            }
            return o;
        });
        if (correctIdx === -1) correctIdx = 0;
        const order = shuffleArray(cleanOpts.map((_, i)=>i));
        const shuffled = [];
        let newCorrect = -1;
        order.forEach((oldIdx, newIdx)=>{
            shuffled.push(cleanOpts[oldIdx]);
            if (oldIdx === correctIdx) newCorrect = newIdx;
        });
        return {
            qText,
            options: shuffled,
            correctIndex: newCorrect,
            userChoice: null
        };
    });
}
function ClassifySentenceAct({ data }) {
    _s();
    const [questions, setQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [current, setCurrent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [score, setScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [attempted, setAttempted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('PLAYING');
    const title = data?.title || 'Pick the right option';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ClassifySentenceAct.useEffect": ()=>{
            if (!data) return;
            const rawText = data.text || '';
            let parsedQs = parseClassify(rawText);
            parsedQs = shuffleArray(parsedQs);
            setQuestions(parsedQs);
        }
    }["ClassifySentenceAct.useEffect"], [
        data
    ]);
    const handleOptionClick = (idx)=>{
        const q = questions[current];
        if (q.userChoice !== null) return;
        const isCorrect = idx === q.correctIndex;
        const updatedQuestions = [
            ...questions
        ];
        updatedQuestions[current] = {
            ...q,
            userChoice: idx
        };
        setQuestions(updatedQuestions);
        setAttempted(attempted + 1);
        if (isCorrect) setScore(score + 1);
    };
    const handleNext = ()=>{
        if (current + 1 < questions.length) {
            setCurrent(current + 1);
        } else {
            setStatus('SUMMARY');
        }
    };
    const handleDone = ()=>{
        try {
            window.parent.postMessage(JSON.stringify({
                done: true,
                score: score,
                total: attempted
            }), '*');
        } catch (_) {}
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ClassifySentenceAct.useEffect": ()=>{
            const handleKeyDown = {
                "ClassifySentenceAct.useEffect.handleKeyDown": (e)=>{
                    const q = questions[current];
                    if (e.key === 'Enter' && q && q.userChoice !== null && status === 'PLAYING') {
                        handleNext();
                    }
                }
            }["ClassifySentenceAct.useEffect.handleKeyDown"];
            document.addEventListener('keydown', handleKeyDown);
            return ({
                "ClassifySentenceAct.useEffect": ()=>document.removeEventListener('keydown', handleKeyDown)
            })["ClassifySentenceAct.useEffect"];
        }
    }["ClassifySentenceAct.useEffect"]);
    if (questions.length === 0) return null;
    const q = questions[current];
    const total = questions.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wrapper,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainCard,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainCardInner,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].title,
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/comps/acts/MatchByAct.js",
                        lineNumber: 544,
                        columnNumber: 11
                    }, this),
                    status === 'PLAYING' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].small,
                                children: [
                                    "Question ",
                                    current + 1,
                                    " of ",
                                    total
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/acts/MatchByAct.js",
                                lineNumber: 549,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].qText,
                                dangerouslySetInnerHTML: {
                                    __html: q.qText
                                }
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/MatchByAct.js",
                                lineNumber: 552,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].optionsRow,
                                children: q.options.map((opt, i)=>{
                                    const isSelected = q.userChoice === i;
                                    const isCorrectAns = q.correctIndex === i;
                                    const showTick = isSelected && isCorrectAns || q.userChoice !== null && isCorrectAns;
                                    const showCross = isSelected && !isCorrectAns;
                                    let btnClass = __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].optBtn;
                                    if (q.userChoice !== null) {
                                        if (isCorrectAns) btnClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].selected}`;
                                        else if (isSelected) btnClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wrong}`;
                                    }
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: btnClass,
                                        onClick: ()=>handleOptionClick(i),
                                        children: [
                                            opt,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].markIcon} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tick}`,
                                                style: {
                                                    display: showTick ? 'block' : 'none'
                                                },
                                                children: "✓"
                                            }, void 0, false, {
                                                fileName: "[project]/comps/acts/MatchByAct.js",
                                                lineNumber: 579,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].markIcon} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cross}`,
                                                style: {
                                                    display: showCross ? 'block' : 'none'
                                                },
                                                children: "✘"
                                            }, void 0, false, {
                                                fileName: "[project]/comps/acts/MatchByAct.js",
                                                lineNumber: 585,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/comps/acts/MatchByAct.js",
                                        lineNumber: 573,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/MatchByAct.js",
                                lineNumber: 557,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].controlsRow,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].score,
                                        children: [
                                            "Score: ",
                                            score,
                                            " / ",
                                            attempted
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/comps/acts/MatchByAct.js",
                                        lineNumber: 598,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].nextBtn,
                                            disabled: q.userChoice === null,
                                            onClick: handleNext,
                                            children: current + 1 === total ? 'Finish' : 'Next'
                                        }, void 0, false, {
                                            fileName: "[project]/comps/acts/MatchByAct.js",
                                            lineNumber: 602,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/comps/acts/MatchByAct.js",
                                        lineNumber: 601,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/acts/MatchByAct.js",
                                lineNumber: 597,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true) : /* 🟢 UPGRADED SUMMARY UI */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    marginBottom: '10px'
                                },
                                children: "Activity Completed!"
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/MatchByAct.js",
                                lineNumber: 615,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summary,
                                children: questions.map((sq, i)=>{
                                    const user = sq.userChoice === null ? '(Skipped)' : sq.options[sq.userChoice];
                                    const correct = sq.options[sq.correctIndex];
                                    const isCorrect = sq.userChoice === sq.correctIndex;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryItem,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 'bold',
                                                    marginBottom: '6px'
                                                },
                                                children: [
                                                    i + 1,
                                                    ".",
                                                    ' ',
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        dangerouslySetInnerHTML: {
                                                            __html: sq.qText
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/comps/acts/MatchByAct.js",
                                                        lineNumber: 639,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/comps/acts/MatchByAct.js",
                                                lineNumber: 637,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '0.95em'
                                                },
                                                children: [
                                                    "Your Answer:",
                                                    ' ',
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: isCorrect ? __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryCorrect : __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryWrong,
                                                        children: user
                                                    }, void 0, false, {
                                                        fileName: "[project]/comps/acts/MatchByAct.js",
                                                        lineNumber: 643,
                                                        columnNumber: 25
                                                    }, this),
                                                    !isCorrect && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: '#555',
                                                            marginLeft: '8px'
                                                        },
                                                        children: [
                                                            "(Correct: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: correct
                                                            }, void 0, false, {
                                                                fileName: "[project]/comps/acts/MatchByAct.js",
                                                                lineNumber: 654,
                                                                columnNumber: 39
                                                            }, this),
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/comps/acts/MatchByAct.js",
                                                        lineNumber: 653,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/comps/acts/MatchByAct.js",
                                                lineNumber: 641,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/comps/acts/MatchByAct.js",
                                        lineNumber: 636,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/MatchByAct.js",
                                lineNumber: 626,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].controlsRow,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].score,
                                        children: [
                                            "Final Score: ",
                                            score,
                                            " / ",
                                            attempted
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/comps/acts/MatchByAct.js",
                                        lineNumber: 664,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].nextBtn,
                                        onClick: handleDone,
                                        children: "Next"
                                    }, void 0, false, {
                                        fileName: "[project]/comps/acts/MatchByAct.js",
                                        lineNumber: 667,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/acts/MatchByAct.js",
                                lineNumber: 663,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/comps/acts/MatchByAct.js",
                lineNumber: 543,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/comps/acts/MatchByAct.js",
            lineNumber: 542,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/comps/acts/MatchByAct.js",
        lineNumber: 541,
        columnNumber: 5
    }, this);
}
_s(ClassifySentenceAct, "xE6vKOMfIcX5m4iRiHcj/0MjmiE=");
_c = ClassifySentenceAct;
var _c;
__turbopack_context__.k.register(_c, "ClassifySentenceAct");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/comps/Playlist.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Playlist
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
/* eslint-disable react-hooks/exhaustive-deps */ /* eslint-disable @next/next/no-img-element */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$DelayLoader$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/DelayLoader.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$playlistUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/playlistUtils.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Svg.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/base/comps/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/base/comps/Button.js [client] (ecmascript) <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$IconViewMini$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/curriculumViews/IconViewMini.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$PIconView$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/curriculumViews/PIconView.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$SubCards$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/curriculumViews/SubCards.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lz$2d$string$2f$libs$2f$lz$2d$string$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lz-string/libs/lz-string.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/apiService.js [client] (ecmascript)"); // Imported Service
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/acts/McqAct.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/acts/CompleteWordAct.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/acts/WordSearchAct.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/acts/SequenceAct.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/acts/ClassifySentenceAct.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$MatchByAct$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/acts/MatchByAct.js [client] (ecmascript)");
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
;
;
;
;
;
;
;
;
;
;
;
;
const playlistIconSvgPath = 'm21 4c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm12.5 10.75c0-.414-.336-.75-.75-.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75zm0-3.248c0-.414-.336-.75-.75-.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75zm0-3.252c0-.414-.336-.75-.75-.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75z';
const Styled = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].div.withConfig({
    displayName: "Playlist__Styled",
    componentId: "sc-982f0e16-0"
})`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  user-select: none;
  background-color: var(--l2);
  color: #222;
  .chapWrap {
    background-color: var(--l2);

    &.selected {
      background-color: var(--h);
    }
  }

  .chap {
    padding: 5px 5px 5px 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .chapDisplay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 10px 40px;
    min-height: 600px;
    .chapName {
      font-size: 3rem;
      margin: 40px 0;
    }
  }

  ol {
    width: 400px;
    border: 1px solid var(--lightColor);
    li {
      padding: 5px 10px;
      border: 1px solid var(--l);
      cursor: pointer;
      display: flex;
      &.head {
        color: var(--darkColor2);
        text-align: center;
        padding: 10px;
        font-size: 1.5rem;
        font-weight: bold;
      }

      &.selected {
        background-color: var(--h2);
      }

      .numbering {
        display: block;
        min-width: 20px;
        text-align: right;
        margin-right: 10px;
        font-size: 0.8rem;
        padding-top: 3px;
      }
    }
  }

  .numWrap {
    display: flex;
    flex-wrap: wrap;
    margin-left: 50px;
    > div {
      padding: 5px;
      margin: 5px;
      background-color: var(--h);
      border-radius: 3px;
      min-width: 40px;
      text-align: center;

      &.selected {
        background-color: var(--h3);
        color: white;
      }
    }
  }

  img,
  .imgPlaceHolder {
    width: 24px;
    height: 24px;
    margin-right: 5px;
  }

  .mainPlaceHolder {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 95vh;
  }

  .placeHolder {
    font-size: 2rem;
    font-style: italic;
    padding: 200px 0 0 100px;
  }

  .videoHelp {
    display: flex;
    background-color: var(--l2);
    padding: 10px;
    font-style: italic;
    padding-left: 30px;
    text-decoration: underline;
    > img {
      margin-right: 10px;
    }
  }

  .actIFrame {
    border: none;
    min-width: 100vw;
    width: ${(p)=>p.$hideTOC ? 'calc(100vw - 80px)' : 'calc(100vw - 490px)'};
    height: 100vh;
  }

  .tags {
    display: flex;
  }

  .tag {
    margin: 2px 10px;
    padding: 5px;
    min-width: 60px;
    background-color: var(--h2);
    cursor: pointer;
    text-align: center;
    border-radius: 5px;
  }

  @media only screen and (max-width: 800px) {
    ol {
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  @media (min-width: 500px) {
    .actIFrame {
      min-width: 500px;
    }
  }
`;
_c = Styled;
const splTypes = [
    'pdf',
    'link',
    'pLink',
    'mvid',
    'youtube'
];
function Playlist(props) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const playlistId = router.query.slug ? router.query.slug[0] : null;
    let toggleChaps = Array(props.toc.list.length).fill(true);
    if (props.toc.collapseRest) {
        toggleChaps = toggleChaps.map((item, i)=>i === 0);
    }
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        active: props.toc.loadFirstAct ? Array.isArray(props.toc.list[0].data) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$playlistUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getDataFromGroupAct"])(props.toc.list[0].list[0], 0) : props.toc.list[0].list[0] : null,
        activeNum: 1,
        activeChap: props.toc.loadFirstAct ? 0 : -1,
        hideTOC: props.toc.cardView ? true : false,
        toggleChaps
    });
    const stateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(state);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Playlist.useEffect": ()=>{
            stateRef.current = state;
        }
    }["Playlist.useEffect"], [
        state
    ]);
    // ---> SMART BACK LOGIC <---
    const handleSmartBack = ()=>{
        const s = stateRef.current || state;
        const chapList = props.toc?.list[s.activeChap]?.list;
        // Safety fallback
        if (!s.active || !chapList || s.activeChap === -1) {
            router.push('/home');
            return;
        }
        const index = chapList.findIndex((it)=>it.id === s.active.id);
        const currentOriginalItem = chapList[index];
        // SCENARIO 1: Step back sub-questions inside the same activity (e.g. 8 -> 7)
        if (currentOriginalItem && Array.isArray(currentOriginalItem.data) && s.activeNum > 1) {
            numberSelect(currentOriginalItem, s.activeChap, s.activeNum - 2);
            return;
        }
        // SCENARIO 2: Go to the PREVIOUS activity in the SAME chapter
        if (index > 0) {
            const prevItem = chapList[index - 1];
            if (Array.isArray(prevItem.data)) {
                numberSelect(prevItem, s.activeChap, prevItem.data.length - 1);
            } else {
                onSelect(prevItem, s.activeChap);
            }
            return;
        }
        // SCENARIO 3: Go to the PREVIOUS CHAPTER
        if (s.activeChap > 0) {
            const prevChapIndex = s.activeChap - 1;
            const prevChapList = props.toc.list[prevChapIndex].list;
            const prevItem = prevChapList[prevChapList.length - 1];
            let newToggleChaps = [
                ...s.toggleChaps
            ];
            if (props.toc.collapseRest) {
                newToggleChaps = newToggleChaps.map(()=>false);
            }
            newToggleChaps[prevChapIndex] = true;
            setState((prev)=>({
                    ...prev,
                    toggleChaps: newToggleChaps
                }));
            if (Array.isArray(prevItem.data)) {
                numberSelect(prevItem, prevChapIndex, prevItem.data.length - 1);
            } else {
                onSelect(prevItem, prevChapIndex);
            }
            return;
        }
        // SCENARIO 4: Nowhere else to go
        router.push('/home');
    };
    // Assign the smart back function to the parent's ref so it can trigger it
    if (props.playlistRef) {
        props.playlistRef.current = {
            handleSmartBack
        };
    }
    function onSelect(item, activeChap, i) {
        if (splTypes.indexOf(item.type) !== -1) {}
        if (item.type === 'link' || item.type === 'youtube') {
            window.open((0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["loadAsset"])(item.src), 'child');
        }
        if (item.type === 'pLink') {
            window.open(`https://pschool.app/p/${item.src}`, 'child');
        }
        if (item.onlyBigScreen) {
            item.data.onlyBigScreen = true;
        }
        const s = stateRef.current || state;
        const hideTOC = s.screenWidth < 800 ? true : s.hideTOC;
        setState((prev)=>({
                ...prev,
                active: item,
                activeChap,
                activeNum: i,
                hideTOC
            }));
    }
    function numberSelect(item, activeChap, i, e) {
        if (e) {
            e.stopPropagation();
        }
        let data = item.commonData || {};
        let subData = item.data[i];
        if (subData.refs) {
            let refId = subData.refs;
            if (refId.indexOf('~') !== -1) {
                const refIndex = +refId.substr(refId.indexOf('~') + 1);
                refId = refId.substr(0, refId.indexOf('~'));
                subData = props.toc.defs[refId][refIndex];
            } else {
                subData = props.toc.defs[refId];
            }
        }
        if (typeof subData === 'string') {
            data = {
                ...data,
                text: subData
            };
        } else if (Array.isArray(subData)) {
            data = {
                ...data,
                arr: subData
            };
        } else {
            data = {
                ...data,
                ...subData
            };
        }
        onSelect({
            ...item,
            data
        }, activeChap, i + 1);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Playlist.useEffect": ()=>{
            const handler = {
                "Playlist.useEffect.handler": (msg)=>{
                    if (typeof msg.data !== 'string') return;
                    let msgData;
                    try {
                        msgData = JSON.parse(msg.data);
                    } catch (e) {
                        return;
                    }
                    if (!msgData || !msgData.done) return;
                    const s = stateRef.current;
                    if (!s || !s.active) return;
                    const chapList = props.toc.list[s.activeChap] && props.toc.list[s.activeChap].list;
                    if (!chapList) return;
                    const index = chapList.findIndex({
                        "Playlist.useEffect.handler.index": (it)=>it.id === s.active.id
                    }["Playlist.useEffect.handler.index"]);
                    if (index === -1) return;
                    const currentItem = chapList[index];
                    if (Array.isArray(currentItem.data)) {
                        if (s.activeNum < currentItem.data.length) {
                            numberSelect(currentItem, s.activeChap, s.activeNum);
                            return;
                        } else {
                            if (props.toc.list.length > s.activeChap + 1) {
                                setState({
                                    "Playlist.useEffect.handler": (prev)=>({
                                            ...prev,
                                            active: {
                                                type: 'chapter'
                                            },
                                            activeChap: prev.activeChap + 1
                                        })
                                }["Playlist.useEffect.handler"]);
                            } else {
                                setState({
                                    "Playlist.useEffect.handler": (prev)=>({
                                            ...prev,
                                            active: null
                                        })
                                }["Playlist.useEffect.handler"]);
                            }
                        }
                    }
                    if (index + 1 < chapList.length) {
                        const nextItem = chapList[index + 1];
                        if (Array.isArray(nextItem.data)) {
                            numberSelect(nextItem, s.activeChap, 0);
                        } else {
                            onSelect(nextItem, s.activeChap);
                        }
                    } else {
                        if (props.toc.list.length > s.activeChap + 1) {
                            setState({
                                "Playlist.useEffect.handler": (prev)=>({
                                        ...prev,
                                        active: {
                                            type: 'chapter'
                                        },
                                        activeChap: prev.activeChap + 1
                                    })
                            }["Playlist.useEffect.handler"]);
                        } else {
                            setState({
                                "Playlist.useEffect.handler": (prev)=>({
                                        ...prev,
                                        active: null
                                    })
                            }["Playlist.useEffect.handler"]);
                        }
                    }
                }
            }["Playlist.useEffect.handler"];
            window.addEventListener('message', handler);
            return ({
                "Playlist.useEffect": ()=>window.removeEventListener('message', handler)
            })["Playlist.useEffect"];
        }
    }["Playlist.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Playlist.useEffect": ()=>{
            setState({
                "Playlist.useEffect": (prev)=>({
                        ...prev,
                        screenWidth: window.innerWidth
                    })
            }["Playlist.useEffect"]);
        }
    }["Playlist.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Styled, {
        $hideTOC: state.hideTOC,
        children: [
            props.toc.type === 'curriculumIcon' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$IconViewMini$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                data: props.toc
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 395,
                columnNumber: 47
            }, this),
            (!props.toc.type || props.toc.type === 'nested') && !state.hideTOC && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    maxHeight: '100vh',
                    overflow: 'auto'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "head",
                            style: {
                                display: 'flex',
                                alignItems: 'center'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    id: "minimize",
                                    onClick: ()=>setState({
                                            ...state,
                                            hideTOC: true
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/comps/Playlist.js",
                                    lineNumber: 403,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: props.toc.label
                                }, void 0, false, {
                                    fileName: "[project]/comps/Playlist.js",
                                    lineNumber: 407,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/comps/Playlist.js",
                            lineNumber: 399,
                            columnNumber: 13
                        }, this),
                        props.toc.list.map((chap, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `chapWrap ${!props.toc.collapseRest && props.toc.list.length > 1 && state.activeChap === i ? 'selected' : ''}`,
                                children: [
                                    props.toc.list.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "chap",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                id: "caretDown",
                                                size: "18",
                                                color: "var(--darkColor2)",
                                                style: state.toggleChaps[i] ? {} : {
                                                    transform: 'rotate(-90deg)'
                                                },
                                                onClick: ()=>{
                                                    let toggleChaps = [
                                                        ...state.toggleChaps
                                                    ];
                                                    if (props.toc.collapseRest) {
                                                        toggleChaps = toggleChaps.map((item, j)=>i === j ? !toggleChaps[i] : false);
                                                    } else {
                                                        toggleChaps[i] = !toggleChaps[i];
                                                    }
                                                    setState({
                                                        ...state,
                                                        toggleChaps
                                                    });
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/comps/Playlist.js",
                                                lineNumber: 422,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                onClick: ()=>{
                                                    let toggleChaps = [
                                                        ...state.toggleChaps
                                                    ];
                                                    if (props.toc.collapseRest) {
                                                        toggleChaps = toggleChaps.map(()=>false);
                                                    }
                                                    toggleChaps[i] = true;
                                                    setState({
                                                        ...state,
                                                        active: Array.isArray(props.toc.list[i].list[0].data) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$playlistUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getDataFromGroupAct"])(props.toc.list[i].list[0], 0) : props.toc.list[i].list[0],
                                                        activeChap: i,
                                                        toggleChaps
                                                    });
                                                },
                                                children: [
                                                    i + 1,
                                                    ". ",
                                                    chap.label,
                                                    ' ',
                                                    chap.altLabel ? `(${chap.altLabel})` : ''
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/comps/Playlist.js",
                                                lineNumber: 443,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/comps/Playlist.js",
                                        lineNumber: 421,
                                        columnNumber: 19
                                    }, this),
                                    state.toggleChaps[i] && chap.list.map((item, j)=>{
                                        if (!Array.isArray(item.data)) {
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: state.active && state.active.id === item.id && state.activeChap === i ? 'selected' : '',
                                                onClick: ()=>onSelect(item, i),
                                                style: {
                                                    backgroundColor: item.type === 'chapter' ? 'pink' : ''
                                                },
                                                children: [
                                                    getIcon(item.type),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "numbering",
                                                        children: [
                                                            " ",
                                                            j + 1,
                                                            ". "
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/comps/Playlist.js",
                                                        lineNumber: 486,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "item",
                                                        children: item.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/comps/Playlist.js",
                                                        lineNumber: 487,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, item.id, true, {
                                                fileName: "[project]/comps/Playlist.js",
                                                lineNumber: 470,
                                                columnNumber: 25
                                            }, this);
                                        } else {
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                onClick: (e)=>numberSelect(item, i, 0, e),
                                                className: state.active && state.active.id === item.id && state.activeChap === i ? 'selected' : '',
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'flex'
                                                            },
                                                            children: [
                                                                getIcon(item.type),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "numbering",
                                                                    children: [
                                                                        " ",
                                                                        j + 1,
                                                                        ". "
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/comps/Playlist.js",
                                                                    lineNumber: 506,
                                                                    columnNumber: 31
                                                                }, this),
                                                                item.label
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/comps/Playlist.js",
                                                            lineNumber: 504,
                                                            columnNumber: 29
                                                        }, this),
                                                        Array.isArray(item.data) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "numWrap",
                                                            children: item.data.map((data, k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: state.active && state.active.id === item.id && state.activeNum === k + 1 ? 'selected' : '',
                                                                    onClick: (e)=>numberSelect(item, i, k, e),
                                                                    children: k + 1
                                                                }, k, false, {
                                                                    fileName: "[project]/comps/Playlist.js",
                                                                    lineNumber: 512,
                                                                    columnNumber: 35
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/comps/Playlist.js",
                                                            lineNumber: 510,
                                                            columnNumber: 31
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/comps/Playlist.js",
                                                    lineNumber: 503,
                                                    columnNumber: 27
                                                }, this)
                                            }, item.id, false, {
                                                fileName: "[project]/comps/Playlist.js",
                                                lineNumber: 492,
                                                columnNumber: 25
                                            }, this);
                                        }
                                    })
                                ]
                            }, chap.id || i, true, {
                                fileName: "[project]/comps/Playlist.js",
                                lineNumber: 410,
                                columnNumber: 15
                            }, this)),
                        props.toc.videoHelp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "videoHelp",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["publicPath"])('/img/icons/youtubeIcon.png'),
                                    alt: "YouTube"
                                }, void 0, false, {
                                    fileName: "[project]/comps/Playlist.js",
                                    lineNumber: 538,
                                    columnNumber: 17
                                }, this),
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: "Video Help"
                                }, void 0, false, {
                                    fileName: "[project]/comps/Playlist.js",
                                    lineNumber: 542,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/comps/Playlist.js",
                            lineNumber: 537,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 398,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 397,
                columnNumber: 9
            }, this),
            props.toc.type === 'curriculumList' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$PIconView$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                data: props.toc,
                appType: "small"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 549,
                columnNumber: 9
            }, this),
            state.hideTOC && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 50
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    size: "32",
                    d: playlistIconSvgPath,
                    color: "var(--d)",
                    onClick: ()=>setState({
                            ...state,
                            hideTOC: false
                        })
                }, void 0, false, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 553,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 552,
                columnNumber: 9
            }, this),
            (!props.toc.type || props.toc.type === 'nested') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mainPlaceHolder",
                children: [
                    state.active && state.active.type === 'chapter' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "chapDisplay",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textDecoration: 'underline'
                                },
                                children: [
                                    "Chapter ",
                                    state.activeChap + 1,
                                    ' '
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/Playlist.js",
                                lineNumber: 565,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "chapName",
                                children: props.toc.list[state.activeChap].label
                            }, void 0, false, {
                                fileName: "[project]/comps/Playlist.js",
                                lineNumber: 568,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 40
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                                    primary: true,
                                    onClick: ()=>{
                                        const firstItem = props.toc.list[state.activeChap].list[0];
                                        if (Array.isArray(firstItem.data)) {
                                            numberSelect(firstItem, state.activeChap, 0);
                                        } else {
                                            onSelect(firstItem, state.activeChap);
                                        }
                                    },
                                    children: "Continue"
                                }, void 0, false, {
                                    fileName: "[project]/comps/Playlist.js",
                                    lineNumber: 572,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/comps/Playlist.js",
                                lineNumber: 571,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/Playlist.js",
                        lineNumber: 564,
                        columnNumber: 13
                    }, this),
                    !props.toc.cardView && !state.active && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "placeHolder",
                        children: "Click on the resource on the left to load the content here."
                    }, void 0, false, {
                        fileName: "[project]/comps/Playlist.js",
                        lineNumber: 589,
                        columnNumber: 13
                    }, this),
                    props.toc.cardView && !state.active && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$SubCards$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        toc: props.toc,
                        onSelect: (index)=>{
                            let toggleChaps = state.toggleChaps;
                            if (props.toc.collapseRest) {
                                toggleChaps = toggleChaps.map((d, i)=>i === index);
                            }
                            setState({
                                ...state,
                                active: Array.isArray(props.toc.list[index].list[0].data) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$playlistUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getDataFromGroupAct"])(props.toc.list[index].list[0], 0) : props.toc.list[index].list[0],
                                activeChap: index,
                                hideTOC: false,
                                toggleChaps
                            });
                        }
                    }, void 0, false, {
                        fileName: "[project]/comps/Playlist.js",
                        lineNumber: 594,
                        columnNumber: 13
                    }, this),
                    state.active && state.active.type !== 'chapter' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$DelayLoader$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        lazyLoad: true,
                        data: state.active,
                        children: displayResource(state.active, ()=>setState({
                                ...state,
                                active: null
                            }), null, getCategoryBackground(props.toc.label, playlistId))
                    }, void 0, false, {
                        fileName: "[project]/comps/Playlist.js",
                        lineNumber: 615,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 562,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/comps/Playlist.js",
        lineNumber: 394,
        columnNumber: 5
    }, this);
}
_s(Playlist, "fAxv+xC2fT0J+p0clkEyUBPXTJs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c1 = Playlist;
function getIcon(type) {
    switch(type){
        case 'pdf':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["publicPath"])('/img/icons/pdfIcon.png'),
                alt: "PDF"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 633,
                columnNumber: 14
            }, this);
        case 'link':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["publicPath"])('/img/icons/linkIcon.png'),
                alt: "Link"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 635,
                columnNumber: 14
            }, this);
        case 'pLink':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["publicPath"])('/img/icons/icon32.png'),
                alt: "Link"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 637,
                columnNumber: 14
            }, this);
        case 'mvid':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["publicPath"])('/img/icons/videoIcon.png'),
                alt: "Video"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 639,
                columnNumber: 14
            }, this);
        case 'youtube':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["publicPath"])('/img/icons/youtubeIcon.png'),
                alt: "YouTube"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 642,
                columnNumber: 9
            }, this);
        default:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "imgPlaceHolder"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 645,
                columnNumber: 14
            }, this);
    }
}
function displayResource(item, onClose, onChapterNext, bgImage) {
    const isApiBg = bgImage && bgImage.startsWith('http');
    const bgUrl = isApiBg ? bgImage : (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["publicPath"])('/bg-images/' + bgImage);
    switch(item.type){
        case 'pdf':
            {
                let src = item.src;
                if (src.indexOf('.') === -1) src += '.pdf';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                    className: "actIFrame",
                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["loadAsset"])(src)
                }, void 0, false, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 657,
                    columnNumber: 14
                }, this);
            }
        case 'mvid':
            {
                let video = item.src;
                let payload = typeof video === 'string' ? {
                    src: video,
                    width: 360,
                    height: 600
                } : {
                    src: video.file,
                    width: video.width,
                    height: video.height
                };
                if (payload.src.indexOf('.') === -1) payload.src += '.mp4';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                    className: "actIFrame",
                    src: "/lmsLearning/acts/video",
                    "data-payload": JSON.stringify(payload)
                }, void 0, false, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 667,
                    columnNumber: 9
                }, this);
            }
        case 'link':
        case 'youtube':
        case 'pLink':
            return null;
    }
    const payload = {
        id: item.id,
        bgImage: bgUrl,
        ...item.data
    };
    const containerStyle = {
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100%',
        height: '100vh',
        backgroundColor: 'transparent',
        position: 'relative',
        overflow: 'hidden'
    };
    switch(item.type){
        case 'mcq':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: containerStyle,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    data: payload
                }, void 0, false, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 698,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 697,
                columnNumber: 9
            }, this);
        case 'completeWord':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: containerStyle,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    data: payload
                }, void 0, false, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 704,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 703,
                columnNumber: 9
            }, this);
        case 'wordsearch':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: containerStyle,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    data: payload
                }, void 0, false, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 710,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 709,
                columnNumber: 9
            }, this);
        case 'sequence':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: containerStyle,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$SequenceAct$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    data: payload
                }, void 0, false, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 716,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 715,
                columnNumber: 9
            }, this);
        case 'classifySentence':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: containerStyle,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$ClassifySentenceAct$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    data: payload
                }, void 0, false, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 722,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 721,
                columnNumber: 9
            }, this);
        case 'matchByDragDrop':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: containerStyle,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$MatchByAct$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    data: payload
                }, void 0, false, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 728,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 727,
                columnNumber: 9
            }, this);
        default:
            {
                const localTypes = [
                    'classifySentence',
                    'matchByDragDrop',
                    'informationProcessing',
                    'sequence',
                    'dragAndDrop',
                    'wordsearch',
                    'completeWord'
                ];
                const isLocal = localTypes.includes(item.type);
                let iframeSrc;
                let str = JSON.stringify(item.data);
                if (item.type === 'classifySentence') {
                    const payloadData = {
                        id: item.id,
                        ...item.data
                    };
                    const compressed = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lz$2d$string$2f$libs$2f$lz$2d$string$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].compressToEncodedURIComponent(JSON.stringify(payloadData));
                    iframeSrc = `/lms-system/acts/classifySentence/index.html?c=${compressed}`;
                } else if (isLocal) {
                    iframeSrc = `/lms-system/acts/${item.type}/index.html?payload=${encodeURIComponent(str)}`;
                } else {
                    iframeSrc = `https://pschool.app/acts/${item.type}?payload=${str}`;
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: containerStyle,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                        className: "actIFrame",
                        style: {
                            border: 'none',
                            width: '100%',
                            height: '100%',
                            mixBlendMode: !isLocal ? 'multiply' : 'normal'
                        },
                        sandbox: "allow-scripts allow-same-origin allow-forms",
                        referrerPolicy: "no-referrer",
                        src: iframeSrc,
                        onLoad: (e)=>{
                            if (isLocal) {
                                try {
                                    const doc = e.target.contentDocument || e.target.contentWindow.document;
                                    if (doc) doc.body.style.backgroundColor = 'transparent';
                                } catch  {}
                            }
                        }
                    }, void 0, false, {
                        fileName: "[project]/comps/Playlist.js",
                        lineNumber: 760,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 759,
                    columnNumber: 9
                }, this);
            }
    }
}
function getCategoryBackground(label, id) {
    if (id && !isNaN(id)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].getBgImageUrl(id); // Dynamic URL Implementation
    }
    if (!label) return 'bg30.jpg';
    const l = label.toLowerCase();
    if (l.includes('composition')) return 'bg25.jpg';
    if (l.includes('spelling')) return 'bg30.jpg';
    if (l.includes('grammar')) return 'bg32.jpg';
    if (l.includes('vocabulary')) return 'bg33.jpg';
    if (l.includes('sentence')) return 'sentence.jpg';
    if (l.includes('idiom')) return 'idiom.jpg';
    if (l.includes('word building') || l.includes('wordbuilding')) return 'bg31.jpg';
    if (l.includes('word search') || l.includes('wordsearch')) return 'wordsearch.jpg';
    if (l.includes('listening')) return 'bg24.jpg';
    if (l.includes('guided composition')) return 'bg25.jpg';
    if (l.includes('comprehension')) return 'bg22.jpg';
    return 'bg30.jpg';
}
var _c, _c1;
__turbopack_context__.k.register(_c, "Styled");
__turbopack_context__.k.register(_c1, "Playlist");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/comps/OnlyBigScreen.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OnlyBigScreen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
function OnlyBigScreen(props) {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        loading: true,
        smallScreen: false
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OnlyBigScreen.useEffect": ()=>{
            //taken from isSmallScreen() function
            if (window.innerWidth < (props.minSize || 900)) {
                setState({
                    ...state,
                    smallScreen: true,
                    loading: false
                });
            } else {
                setState({
                    ...state,
                    smallScreen: false,
                    loading: false
                });
            }
        }
    }["OnlyBigScreen.useEffect"], []);
    if (state.loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/comps/OnlyBigScreen.js",
            lineNumber: 19,
            columnNumber: 12
        }, this);
    }
    if (state.smallScreen) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                margin: 15,
                color: 'red'
            },
            children: "Sorry. This page is available only for big screen. Kindly check this in laptop or PC."
        }, void 0, false, {
            fileName: "[project]/comps/OnlyBigScreen.js",
            lineNumber: 23,
            columnNumber: 7
        }, this);
    }
    return props.children;
}
_s(OnlyBigScreen, "DhpjZDnvQGS3aGYkQqVfBnubPWg=");
_c = OnlyBigScreen;
var _c;
__turbopack_context__.k.register(_c, "OnlyBigScreen");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/comps/UserDropdown.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import React, { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/router';
// import { apiService } from '../utils/apiService';
// import Swal from 'sweetalert2'; // Imported SweetAlert2
// export default function UserDropdown() {
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(true);
//   const [childName, setChildName] = useState('');
//   // We only need the toast state now; Swal handles the popup state!
//   const [showToast, setShowToast] = useState(false);
//   const dropdownRef = useRef(null);
//   const timerRef = useRef(null);
//   const startTimer = () => {
//     if (timerRef.current) clearTimeout(timerRef.current);
//     timerRef.current = setTimeout(() => {
//       // setIsVisible(false);
//     }, 5000);
//   };
//   const stopTimer = () => {
//     if (timerRef.current) clearTimeout(timerRef.current);
//   };
//   useEffect(() => {
//     const storedName = localStorage.getItem('child_name');
//     if (storedName) setChildName(storedName);
//     startTimer();
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       stopTimer();
//     };
//   }, []);
//   // 1. Trigger the SweetAlert popup
//   // const triggerLogout = () => {
//   //   setIsOpen(false);
//   //   Swal.fire({
//   //     title: 'Leaving so soon?',
//   //     text: 'Are you sure you want to end your learning adventure for today?',
//   //     icon: 'question',
//   //     showCancelButton: true,
//   //     confirmButtonColor: '#e74c3c', // Red for logout
//   //     cancelButtonColor: '#2b7d10', // Green for staying
//   //     confirmButtonText: 'Yes, Log Out',
//   //     cancelButtonText: 'Keep Playing',
//   //     reverseButtons: true, // Puts the "Keep Playing" button on the left
//   //   }).then((result) => {
//   //     if (result.isConfirmed) {
//   //       executeLogout();
//   //     }
//   //   });
//   // };
//   // 1. Trigger the customized, smaller SweetAlert popup
//   const triggerLogout = () => {
//     setIsOpen(false);
//     Swal.fire({
//       title:
//         '<h3 style="margin:0; font-size:20px; color:#2b7d10; font-family:Quicksand, sans-serif;">Leaving so soon?</h3>',
//       html: '<p style="font-size:14px; margin-top:5px; color:#555; font-family:Quicksand, sans-serif;">Are you sure you want to end your learning adventure for today?</p>',
//       icon: 'question',
//       iconColor: '#2b7d10',
//       width: '420px', // Increased width to make it a more natural rectangular shape
//       padding: '20px 20px 30px', // Smoother padding
//       background: '#ffffff',
//       backdrop: 'rgba(0, 0, 0, 0.5)',
//       showCancelButton: true,
//       confirmButtonColor: '#2b7d10', // Dark Green
//       cancelButtonColor: '#2b7d10', // Dark Green (Now matches confirm button)
//       confirmButtonText: 'Yes, Log Out',
//       cancelButtonText: 'Keep Playing',
//       reverseButtons: true,
//       // Inject custom classes to shrink elements
//       customClass: {
//         popup: 'custom-swal-shape',
//         confirmButton: 'custom-swal-btn',
//         cancelButton: 'custom-swal-btn',
//         icon: 'custom-swal-icon',
//       },
//     }).then((result) => {
//       if (result.isConfirmed) {
//         executeLogout();
//       }
//     });
//   };
//   // 2. The actual logout logic that runs if they click "Yes"
//   const executeLogout = async () => {
//     setShowToast(true); // Show the smaller success toaster
//     const email = localStorage.getItem('user_email');
//     if (email) {
//       try {
//         await apiService.logout({ email: email });
//       } catch (err) {
//         console.error('Logout error:', err);
//       }
//     }
//     localStorage.clear();
//     // Wait for 2 seconds so the user can see the toaster, then redirect
//     setTimeout(() => {
//       window.location.href = '/lms-system';
//     }, 2000);
//   };
//   const handlePillClick = () => {
//     setIsOpen(!isOpen);
//   };
//   if (!childName) return null;
//   return (
//     <>
//       {/* --- SMALLER SUCCESS TOASTER --- */}
//       {showToast && (
//         <div
//           style={{
//             position: 'fixed',
//             top: '20px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             backgroundColor: '#6ebc64',
//             color: 'white',
//             padding: '8px 16px' /* Decreased padding */,
//             borderRadius: '4px',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px' /* Decreased gap */,
//             boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
//             zIndex: 4000,
//             fontFamily: "'Quicksand', sans-serif",
//             fontWeight: '600',
//             fontSize: '13px' /* Decreased font size */,
//           }}
//         >
//           {/* Decreased SVG size from 20 to 16 */}
//           <svg
//             width="16"
//             height="16"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="3"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <polyline points="20 6 9 17 4 12"></polyline>
//           </svg>
//           Awesome job today! Logged out successfully.
//         </div>
//       )}
//       {/* --- EXISTING DROPDOWN CODE --- */}
//       <div
//         ref={dropdownRef}
//         className="user-nav-wrapper"
//         onMouseEnter={() => {
//           setIsVisible(true);
//           stopTimer();
//         }}
//         onMouseLeave={startTimer}
//         style={{
//           opacity: isVisible ? 1 : 0,
//           transition: 'opacity 0.6s ease-in-out',
//         }}
//       >
//         <style jsx>{`
//           .user-nav-wrapper {
//             position: fixed;
//             top: 20px;
//             right: 25px;
//             z-index: 2000;
//             font-family: 'Quicksand', sans-serif;
//             display: flex;
//             flex-direction: column;
//             align-items: flex-end;
//             padding: 15px;
//             margin: -15px;
//           }
//           .trigger-pill {
//             background: white;
//             border: 2px solid #2b7d10;
//             height: 44px;
//             min-width: 44px;
//             max-width: 44px;
//             border-radius: 50px;
//             display: flex;
//             align-items: center;
//             justify-content: flex-start;
//             cursor: pointer;
//             overflow: hidden;
//             transition:
//               max-width 0.5s ease,
//               padding 0.5s ease,
//               box-shadow 0.5s ease;
//             box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
//             padding: 2px;
//             white-space: nowrap;
//           }
//           .trigger-pill:hover {
//             max-width: 250px;
//             padding-right: 15px;
//             box-shadow: 0 6px 15px rgba(43, 125, 16, 0.2);
//           }
//           .avatar-circle {
//             width: 36px;
//             height: 36px;
//             background: #2b7d10;
//             color: white;
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-weight: 700;
//             font-size: 16px;
//             flex-shrink: 0;
//           }
//           .name-and-icon {
//             display: flex;
//             align-items: center;
//             margin-left: 10px;
//             opacity: 0;
//             transition: opacity 0.4s ease;
//           }
//           .trigger-pill:hover .name-and-icon {
//             opacity: 1;
//           }
//           .user-name {
//             color: #2b7d10;
//             font-weight: 700;
//             font-size: 16px;
//             margin-right: 8px;
//           }
//           .dropdown-arrow {
//             width: 18px;
//             height: 18px;
//             color: #2b7d10;
//             transition: transform 0.3s ease;
//           }
//           .dropdown-arrow.open {
//             transform: rotate(180deg);
//           }
//           .modern-menu {
//             margin-top: 10px;
//             background: white;
//             border-radius: 16px;
//             border: 1px solid #eef2ee;
//             box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
//             width: 160px;
//             overflow: hidden;
//             padding: 6px;
//             transform-origin: top right;
//             animation: menuGrow 0.3s ease forwards;
//           }
//           @keyframes menuGrow {
//             from {
//               opacity: 0;
//               transform: scale(0.95) translateY(-5px);
//             }
//             to {
//               opacity: 1;
//               transform: scale(1) translateY(0);
//             }
//           }
//           .menu-item {
//             padding: 10px 12px;
//             border-radius: 10px;
//             cursor: pointer;
//             display: flex;
//             align-items: center;
//             gap: 10px;
//             color: #444;
//             font-weight: 600;
//             font-size: 14px;
//             transition: 0.2s;
//           }
//           .menu-item:hover {
//             background: #f0f7ef;
//             color: #2b7d10;
//           }
//           .menu-item.logout {
//             color: #e74c3c;
//           }
//           .menu-item.logout:hover {
//             background: #fff5f5;
//           }
//           .icon-sm {
//             width: 18px;
//             height: 18px;
//           }
//         `}</style>
//         <div className="trigger-pill" onClick={handlePillClick}>
//           <div className="avatar-circle">
//             {childName.charAt(0).toUpperCase()}
//           </div>
//           <div className="name-and-icon">
//             <span className="user-name">{childName}</span>
//             <svg
//               className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </div>
//         </div>
//         {isOpen && (
//           <div className="modern-menu">
//             <div
//               className="menu-item home-item"
//               onClick={() => router.push('/home')}
//             >
//               <svg
//                 className="icon-sm"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
//                 <polyline points="9 22 9 12 15 12 15 22"></polyline>
//               </svg>
//               Home
//             </div>
//             <div className="menu-item logout" onClick={triggerLogout}>
//               <svg
//                 className="icon-sm"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
//                 <polyline points="16 17 21 12 16 7"></polyline>
//                 <line x1="21" y1="12" x2="9" y2="12"></line>
//               </svg>
//               Logout
//             </div>
//           </div>
//         )}
//       </div>
//     </>
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
    const triggerLogout = ()=>{
        setIsOpen(false);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].fire({
            showConfirmButton: false,
            showCancelButton: false,
            html: `
        <div style="font-family: 'Quicksand', sans-serif;">
          <div style="display:flex; justify-content:center; margin-bottom: 15px;">
             <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#2b7d10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
             </svg>
          </div>

          <h3 style="margin:0; font-size:22px; color:#2b7d10; font-weight:700;">Leaving so soon?</h3>
          <p style="font-size:15px; margin: 10px 0 25px 0; color:#555; line-height: 1.4;">Are you sure you want to end your learning adventure for today?</p>

          <div style="display:flex; gap: 15px; justify-content: center;">
             <button id="swal-keep-playing" style="
                background-color: white;
                color: #2b7d10;
                border: 2px solid #2b7d10;
                padding: 10px 24px;
                border-radius: 8px;
                font-family: 'Quicksand', sans-serif;
                font-weight: 700;
                font-size: 14px;
                cursor: pointer;
                transition: 0.2s;
                min-width: 140px;
             ">Keep Playing</button>

             <button id="swal-yes-logout" style="
                background-color: #2b7d10;
                color: white;
                border: 2px solid #2b7d10;
                padding: 10px 24px;
                border-radius: 8px;
                font-family: 'Quicksand', sans-serif;
                font-weight: 700;
                font-size: 14px;
                cursor: pointer;
                transition: 0.2s;
                min-width: 140px;
             ">Yes, Log Out</button>
          </div>
        </div>
      `,
            width: '420px',
            padding: '30px',
            background: '#ffffff',
            backdrop: 'rgba(0, 0, 0, 0.4)',
            customClass: {
                popup: 'custom-swal-shape'
            },
            didOpen: ()=>{
                const keepPlayingBtn = document.getElementById('swal-keep-playing');
                const logoutBtn = document.getElementById('swal-yes-logout');
                keepPlayingBtn.onmouseover = ()=>keepPlayingBtn.style.backgroundColor = '#f0f7ef';
                keepPlayingBtn.onmouseout = ()=>keepPlayingBtn.style.backgroundColor = 'white';
                logoutBtn.onmouseover = ()=>logoutBtn.style.backgroundColor = '#205c0c';
                logoutBtn.onmouseout = ()=>logoutBtn.style.backgroundColor = '#2b7d10';
                keepPlayingBtn.addEventListener('click', ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].close());
                logoutBtn.addEventListener('click', ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].close();
                    executeLogout();
                });
            }
        });
    };
    // 2. The actual logout logic
    const executeLogout = async ()=>{
        setShowToast(true);
        const email = localStorage.getItem('user_email');
        if (email) {
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].logout({
                    email: email
                });
            } catch (err) {
                console.error('Logout error:', err);
            }
        }
        localStorage.clear();
        setTimeout(()=>{
            window.location.href = '/lms-system';
        }, 2000);
    };
    const handlePillClick = ()=>{
        setIsOpen(!isOpen);
    };
    if (!childName) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "2c748fda97f2349b",
                children: ".custom-swal-shape{border:1px solid #eef2ee!important;border-radius:16px!important}"
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "8d56bbe9a0d68cad",
                children: ".user-nav-wrapper.jsx-c0f7ccc42a88e6a7{z-index:2000;flex-direction:column;align-items:flex-end;margin:-15px;padding:15px;font-family:Quicksand,sans-serif;display:flex;position:fixed;top:20px;right:25px}.trigger-pill.jsx-c0f7ccc42a88e6a7{cursor:pointer;white-space:nowrap;background:#fff;border:2px solid #2b7d10;border-radius:50px;justify-content:flex-start;align-items:center;min-width:44px;max-width:44px;height:44px;padding:2px;transition:max-width .5s,padding .5s,box-shadow .5s;display:flex;overflow:hidden;box-shadow:0 4px 12px #00000014}.trigger-pill.jsx-c0f7ccc42a88e6a7:hover{max-width:250px;padding-right:15px;box-shadow:0 6px 15px #2b7d1033}.avatar-circle.jsx-c0f7ccc42a88e6a7{color:#fff;background:#2b7d10;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;width:36px;height:36px;font-size:16px;font-weight:700;display:flex}.name-and-icon.jsx-c0f7ccc42a88e6a7{opacity:0;align-items:center;margin-left:10px;transition:opacity .4s;display:flex}.trigger-pill.jsx-c0f7ccc42a88e6a7:hover .name-and-icon.jsx-c0f7ccc42a88e6a7{opacity:1}.user-name.jsx-c0f7ccc42a88e6a7{color:#2b7d10;margin-right:8px;font-size:16px;font-weight:700}.dropdown-arrow.jsx-c0f7ccc42a88e6a7{color:#2b7d10;width:18px;height:18px;transition:transform .3s}.dropdown-arrow.open.jsx-c0f7ccc42a88e6a7{transform:rotate(180deg)}.modern-menu.jsx-c0f7ccc42a88e6a7{transform-origin:100% 0;background:#fff;border:1px solid #eef2ee;border-radius:16px;width:160px;margin-top:10px;padding:6px;animation:.3s forwards menuGrow;overflow:hidden;box-shadow:0 10px 25px #0000001a}@keyframes menuGrow{0%{opacity:0;transform:scale(.95)translateY(-5px)}to{opacity:1;transform:scale(1)translateY(0)}}.menu-item.jsx-c0f7ccc42a88e6a7{cursor:pointer;color:#444;border-radius:10px;align-items:center;gap:10px;padding:10px 12px;font-size:14px;font-weight:600;transition:all .2s;display:flex}.menu-item.jsx-c0f7ccc42a88e6a7:hover{color:#2b7d10;background:#f0f7ef}.menu-item.logout.jsx-c0f7ccc42a88e6a7{color:#e74c3c}.menu-item.logout.jsx-c0f7ccc42a88e6a7:hover{background:#fff5f5}.icon-sm.jsx-c0f7ccc42a88e6a7{width:18px;height:18px}.toast-slide.jsx-c0f7ccc42a88e6a7{animation:.3s ease-out forwards slideDown}@keyframes slideDown{0%{opacity:0;transform:translate(-50%,-20px)}to{opacity:1;transform:translate(-50%)}}"
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
                className: "jsx-c0f7ccc42a88e6a7" + " " + "toast-slide",
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
                        className: "jsx-c0f7ccc42a88e6a7",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                            points: "20 6 9 17 4 12",
                            className: "jsx-c0f7ccc42a88e6a7"
                        }, void 0, false, {
                            fileName: "[project]/comps/UserDropdown.js",
                            lineNumber: 739,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/comps/UserDropdown.js",
                        lineNumber: 729,
                        columnNumber: 11
                    }, this),
                    "Awesome job today! Logged out successfully."
                ]
            }, void 0, true, {
                fileName: "[project]/comps/UserDropdown.js",
                lineNumber: 709,
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
                className: "jsx-c0f7ccc42a88e6a7" + " " + "user-nav-wrapper",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: handlePillClick,
                        className: "jsx-c0f7ccc42a88e6a7" + " " + "trigger-pill",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-c0f7ccc42a88e6a7" + " " + "avatar-circle",
                                children: childName.charAt(0).toUpperCase()
                            }, void 0, false, {
                                fileName: "[project]/comps/UserDropdown.js",
                                lineNumber: 760,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-c0f7ccc42a88e6a7" + " " + "name-and-icon",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-c0f7ccc42a88e6a7" + " " + "user-name",
                                        children: childName
                                    }, void 0, false, {
                                        fileName: "[project]/comps/UserDropdown.js",
                                        lineNumber: 764,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        viewBox: "0 0 20 20",
                                        fill: "currentColor",
                                        className: "jsx-c0f7ccc42a88e6a7" + " " + `dropdown-arrow ${isOpen ? 'open' : ''}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fillRule: "evenodd",
                                            d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
                                            clipRule: "evenodd",
                                            className: "jsx-c0f7ccc42a88e6a7"
                                        }, void 0, false, {
                                            fileName: "[project]/comps/UserDropdown.js",
                                            lineNumber: 770,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/comps/UserDropdown.js",
                                        lineNumber: 765,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/UserDropdown.js",
                                lineNumber: 763,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/UserDropdown.js",
                        lineNumber: 759,
                        columnNumber: 9
                    }, this),
                    isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-c0f7ccc42a88e6a7" + " " + "modern-menu",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>router.push('/home'),
                                className: "jsx-c0f7ccc42a88e6a7" + " " + "menu-item home-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2.5",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        className: "jsx-c0f7ccc42a88e6a7" + " " + "icon-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
                                                className: "jsx-c0f7ccc42a88e6a7"
                                            }, void 0, false, {
                                                fileName: "[project]/comps/UserDropdown.js",
                                                lineNumber: 794,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                points: "9 22 9 12 15 12 15 22",
                                                className: "jsx-c0f7ccc42a88e6a7"
                                            }, void 0, false, {
                                                fileName: "[project]/comps/UserDropdown.js",
                                                lineNumber: 795,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/comps/UserDropdown.js",
                                        lineNumber: 785,
                                        columnNumber: 15
                                    }, this),
                                    "Home"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/UserDropdown.js",
                                lineNumber: 781,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: triggerLogout,
                                className: "jsx-c0f7ccc42a88e6a7" + " " + "menu-item logout",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2.5",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        className: "jsx-c0f7ccc42a88e6a7" + " " + "icon-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
                                                className: "jsx-c0f7ccc42a88e6a7"
                                            }, void 0, false, {
                                                fileName: "[project]/comps/UserDropdown.js",
                                                lineNumber: 810,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                points: "16 17 21 12 16 7",
                                                className: "jsx-c0f7ccc42a88e6a7"
                                            }, void 0, false, {
                                                fileName: "[project]/comps/UserDropdown.js",
                                                lineNumber: 811,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "21",
                                                y1: "12",
                                                x2: "9",
                                                y2: "12",
                                                className: "jsx-c0f7ccc42a88e6a7"
                                            }, void 0, false, {
                                                fileName: "[project]/comps/UserDropdown.js",
                                                lineNumber: 812,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/comps/UserDropdown.js",
                                        lineNumber: 801,
                                        columnNumber: 15
                                    }, this),
                                    "Logout"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/UserDropdown.js",
                                lineNumber: 800,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/UserDropdown.js",
                        lineNumber: 780,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/comps/UserDropdown.js",
                lineNumber: 746,
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
"[project]/pages/p/[...slug].js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PlaylistPage,
    "loadPlaylist",
    ()=>loadPlaylist
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$Playlist$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/Playlist.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$OnlyBigScreen$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/OnlyBigScreen.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$DelayLoader$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/DelayLoader.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$UserDropdown$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/UserDropdown.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/apiService.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
function PlaylistPage(props) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        loading: true,
        toc: null,
        error: false
    });
    // 1. Create a reference to hold the smart back function from Playlist.js
    const playlistRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 2. When the back button is clicked, trigger the smart function. If it fails, go home.
    const handleBack = ()=>{
        if (playlistRef.current && playlistRef.current.handleSmartBack) {
            playlistRef.current.handleSmartBack();
        } else {
            router.push('/home');
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PlaylistPage.useEffect": ()=>{
            const fetchData = {
                "PlaylistPage.useEffect.fetchData": async (slugArray)=>{
                    const id = slugArray.join('/');
                    try {
                        let data = await loadPlaylist(id);
                        if (!data.type) {
                            data = {
                                ...data,
                                list: [
                                    {
                                        id: 'chap-1',
                                        label: 'Default Chapter',
                                        list: data.list || []
                                    }
                                ]
                            };
                        }
                        data.loadFirstAct = true;
                        setState({
                            toc: data,
                            loading: false,
                            error: false
                        });
                    } catch (err) {
                        console.error('Playlist Load Error:', err);
                        setState({
                            loading: false,
                            error: true,
                            toc: null
                        });
                    }
                }
            }["PlaylistPage.useEffect.fetchData"];
            if (router.isReady && router.query.slug) {
                fetchData(router.query.slug);
            }
        }
    }["PlaylistPage.useEffect"], [
        router.isReady,
        router.query.slug
    ]);
    if (state.loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "Loading..."
    }, void 0, false, {
        fileName: "[project]/pages/p/[...slug].js",
        lineNumber: 58,
        columnNumber: 29
    }, this);
    if (state.error) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "Activity not found."
    }, void 0, false, {
        fileName: "[project]/pages/p/[...slug].js",
        lineNumber: 59,
        columnNumber: 27
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'relative',
            minHeight: '100vh'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$UserDropdown$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/p/[...slug].js",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleBack,
                style: {
                    position: 'fixed',
                    left: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 10px',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    color: '#2b7d10',
                    border: '3px solid #2b7d10',
                    borderLeft: 'none',
                    borderRadius: '0 30px 30px 0',
                    cursor: 'pointer',
                    fontWeight: '800',
                    fontSize: '15px',
                    boxShadow: '3px 3px 0px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    width: '40px'
                },
                onMouseEnter: (e)=>{
                    e.currentTarget.style.width = '120px';
                    e.currentTarget.style.backgroundColor = '#2b7d10';
                    e.currentTarget.style.color = 'white';
                },
                onMouseLeave: (e)=>{
                    e.currentTarget.style.width = '40px';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#2b7d10';
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        width: "20",
                        height: "20",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "3",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        style: {
                            marginRight: '10px',
                            flexShrink: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: "19",
                                y1: "12",
                                x2: "5",
                                y2: "12"
                            }, void 0, false, {
                                fileName: "[project]/pages/p/[...slug].js",
                                lineNumber: 113,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                points: "12 19 5 12 12 5"
                            }, void 0, false, {
                                fileName: "[project]/pages/p/[...slug].js",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/p/[...slug].js",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            whiteSpace: 'nowrap'
                        },
                        children: "BACK"
                    }, void 0, false, {
                        fileName: "[project]/pages/p/[...slug].js",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/p/[...slug].js",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$DelayLoader$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                data: state.toc,
                lazyLoad: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$OnlyBigScreen$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    minSize: 700,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$Playlist$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        toc: state.toc,
                        playlistRef: playlistRef
                    }, void 0, false, {
                        fileName: "[project]/pages/p/[...slug].js",
                        lineNumber: 122,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/p/[...slug].js",
                    lineNumber: 120,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/p/[...slug].js",
                lineNumber: 119,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/p/[...slug].js",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
_s(PlaylistPage, "f00nGrbki57vvpxdbtUXMcWkro0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = PlaylistPage;
const loadPlaylist = async (id)=>{
    try {
        if (!isNaN(id)) {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$client$5d$__$28$ecmascript$29$__["apiService"].getActivityData(id);
            const json = response.data;
            if (json.id || json.list) {
                return json;
            }
            if (json.items && json.items.length > 0) {
                const item = json.items[0];
                if (item.data && typeof item.data === 'string') return JSON.parse(item.data);
                if (item.list && typeof item.list === 'string') return JSON.parse(item.list);
                const cleanItem = {
                    ...item
                };
                delete cleanItem.links;
                return cleanItem;
            }
            throw new Error('API returned empty items');
        }
        const getBasePath = ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (window.__NEXT_DATA__?.basePath) return window.__NEXT_DATA__.basePath;
            if (window.location?.pathname) {
                const parts = window.location.pathname.split('/');
                if (parts.length > 1 && parts[1] === 'lms-system') return '/lms-system';
            }
            return '';
        };
        const basePath = getBasePath();
        const res = await fetch(`${basePath}/json/${id}.pschool`);
        if (!res.ok) throw new Error('JSON file not found');
        return await res.json();
    } catch (e) {
        throw e;
    }
};
var _c;
__turbopack_context__.k.register(_c, "PlaylistPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/p/[...slug].js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/p/[...slug]";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/p/[...slug].js [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/p/[...slug].js\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/p/[...slug].js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__232deca3._.js.map