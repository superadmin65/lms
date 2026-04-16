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

// import React, { useState } from 'react';
// import styled from 'styled-components';
// import Link from 'next/link';
// import { getImage, setLocalItem, getLocalItem, publicPath } from 'utils';
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
//   // background-color: white;
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
//     .hoverdesc {
//       position: absolute;
//       left: -1000px;
//       width: 300px;
//       background-color: orange;
//       padding: 10px;
//       border-radius: 10px;
//       color: white;
//       top: 100px;
//       box-shadow: var(--shadow);
//       z-index: 1;
//     }
//     &:hover .hoverdesc {
//       /*left: 0;*/
//     }
//   }
//   .infobar {
//     margin: -10px;
//     padding: 5px 10px 15px 10px;
//     font-size: 0.8rem;
//     background-color: var(--darkColor2);
//     color: white;
//     a:hover {
//       color: white;
//     }
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
//   .hilight {
//     background-color: var(--darkColor2);
//     box-shadow: var(--shadow);
//     font-size: 2rem;
//     text-align: center;
//     margin-bottom: 20px;
//     letter-spacing: 2px;
//     a {
//       color: white;
//     }
//   }
//   .lang-contact {
//     font-size: 0.9rem;
//   }
//   .flex-sb {
//     display: flex;
//     justify-content: space-around;
//   }
// `;
// const defaultCardStyle = {
//   width: 120,
//   margin: '25px 0',
//   borderRadius: 10,
// };
// const getIconStyle = (img, data) => {
//   let iconStyle = data.iconStyle || {
//     width: 80,
//     height: 80,
//   };
//   const imgPath = getImage(`${data.iconsLoc || 'icons'}/${img}.png`);
//   const resolveImg = (src) => {
//     if (!src) return src;
//     if (src.indexOf('http') === 0) return src;
//     return publicPath(src.startsWith('/') ? src : `/${src}`);
//   };
//   iconStyle.backgroundImage = `url(${resolveImg(imgPath)})`;
//   return iconStyle;
// };
// export default function IconView(props) {
//   //const {title, menu, onPick} = props;
//   let config = getLocalItem('config', {});
//   let defaultGrade;
//   const data = props.data;
//   console.log('props.data IconView', props.data);
//   if (data.grades) {
//     let defaultItem = data.grades.find((item) => item.default === true);
//     if (defaultItem) {
//       defaultGrade = defaultItem.id;
//     }
//   }
//   let [state, setState] = useState({
//     selectedGrade: config.selectedGrade || defaultGrade,
//   });
//   let menu = data.list;
//   if (data.grades) {
//     let matches = state.selectedGrade.match(/(\d+)/);
//     let gradeNo = (matches && +matches[0]) || 0;
//     menu = menu.filter((item) => {
//       if (!item.grade) {
//         return false;
//       }
//       let range = item.grade.split('-').map((no) => +no);
//       if (range.length === 1) {
//         return range[0] === gradeNo;
//       } else {
//         return range[0] <= gradeNo && range[1] >= gradeNo;
//       }
//       //item.grade.indexOf(state.selectedGrade) !== -1
//     });
//   }
//   console.log('data.grades', data.grades);
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
//             let style = data.cardStyle || defaultCardStyle;
//             style = { ...style, ...localStyle };
//             return (
//               <div className="card" style={style} key={item.id}>
//                 <Link
//                   reload
//                   href={`/p/${item.id}` /*`/playlist?id=${item.id}`*/}
//                 >
//                   {!tocConfig.type && (
//                     <>
//                       <div
//                         className="img"
//                         style={{
//                           ...getIconStyle(item.img, data),
//                           backgroundImage: `url(${(function () {
//                             const imgPath = getImage(
//                               `${data.iconsLoc || 'icons'}/${item.img}.png`
//                             );
//                             if (!imgPath) return imgPath;
//                             if (imgPath.indexOf('http') === 0) return imgPath;
//                             return publicPath(
//                               imgPath.startsWith('/') ? imgPath : `/${imgPath}`
//                             );
//                           })()})`,
//                         }}
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
//                   )}
//                   {tocConfig.type === 'descType' && (
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
//                         style={{
//                           ...getIconStyle(item.img, data),
//                           backgroundImage: `url(${(function () {
//                             const imgPath = getImage(
//                               `${data.iconsLoc || 'icons'}/${item.img}.png`
//                             );
//                             if (!imgPath) return imgPath;
//                             if (imgPath.indexOf('http') === 0) return imgPath;
//                             return publicPath(
//                               imgPath.startsWith('/') ? imgPath : `/${imgPath}`
//                             );
//                           })()})`,
//                         }}
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
//             <Link href={`/p/${data.moreActivities}`}>
//               {/*<Link href={`/playlist?id=${data.moreActivities}`}> */}
//               More Activities
//             </Link>
//           </div>
//         </div>
//       )}
//     </Styled>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>IconView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/base/comps/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Select$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__ = __turbopack_context__.i("[project]/base/comps/Select.js [client] (ecmascript) <export default as Select>");
;
var _s = __turbopack_context__.k.signature();
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
    // 1. API Image Handling
    if (item && item.id && !isNaN(item.id)) {
        const apiUrl = `http://192.168.0.127:8080/ords/lms/v1/konzeptes/image/icon/${item.id}`;
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
                                lineNumber: 504,
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
                                lineNumber: 506,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                        lineNumber: 503,
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
                                                            // UPDATED: Check for ID first
                                                            if (item.id && !isNaN(item.id)) {
                                                                return `http://192.168.0.127:8080/ords/lms/v1/konzeptes/image/icon/${item.id}`;
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
                                                    lineNumber: 533,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "label",
                                                    style: data.labelStyle || {},
                                                    children: item.label
                                                }, void 0, false, {
                                                    fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                    lineNumber: 555,
                                                    columnNumber: 23
                                                }, this),
                                                item.smLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "smLabel",
                                                    style: data.smLabelStyle || {},
                                                    children: item.smLabel
                                                }, void 0, false, {
                                                    fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                    lineNumber: 559,
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
                                                            lineNumber: 571,
                                                            columnNumber: 25
                                                        }, this),
                                                        item.smLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "smLabel",
                                                            style: data.smLabelStyle || {},
                                                            children: item.smLabel
                                                        }, void 0, false, {
                                                            fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                            lineNumber: 578,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "desc",
                                                            style: data.descStyle || {},
                                                            children: item.desc
                                                        }, void 0, false, {
                                                            fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                            lineNumber: 585,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                    lineNumber: 570,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "img",
                                                    style: {
                                                        // UPDATED: Pass 'item' object
                                                        ...getIconStyle(item, data),
                                                        backgroundImage: `url(${function() {
                                                            // UPDATED: Check for ID first
                                                            if (item.id && !isNaN(item.id)) {
                                                                return `http://192.168.0.127:8080/ords/lms/v1/konzeptes/image/icon/${item.id}`;
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
                                                    lineNumber: 589,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                            lineNumber: 569,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                    lineNumber: 530,
                                    columnNumber: 17
                                }, this)
                            }, item.id, false, {
                                fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                lineNumber: 528,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                        lineNumber: 522,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                lineNumber: 502,
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
                        lineNumber: 622,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                    lineNumber: 621,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                lineNumber: 620,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/comps/curriculumViews/IconViewMini.js",
        lineNumber: 501,
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
    width: ${(p)=>p.hideTOC ? 'calc(100vw - 80px)' : 'calc(100vw - 490px)'};
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
    // 1. Extract the ID from the URL (e.g., '10' from /p/10)
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
    // Analytics logging
    const localTypes = [
        'mcq',
        'classifySentence',
        'matchByDragDrop',
        'informationProcessing',
        'sequence',
        'dragAndDrop',
        'completeWord',
        'wordsearch'
    ];
    // (Optional: You can re-enable your analytics logic here if needed)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Playlist.useEffect": ()=>{
            stateRef.current = state;
        }
    }["Playlist.useEffect"], [
        state
    ]);
    function onSelect(item, activeChap, i) {
        if (splTypes.indexOf(item.type) !== -1) {
        // Logic for special types if needed
        }
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
    // Attach message handler
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
    // set screen width once on mount
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
    return(// <Styled hideTOC={state.hideTOC}>
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Styled, {
        $hideTOC: state.hideTOC,
        children: [
            props.toc.type === 'curriculumIcon' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$IconViewMini$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                data: props.toc
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 340,
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
                                    lineNumber: 348,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: props.toc.label
                                }, void 0, false, {
                                    fileName: "[project]/comps/Playlist.js",
                                    lineNumber: 352,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/comps/Playlist.js",
                            lineNumber: 344,
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
                                                lineNumber: 367,
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
                                                lineNumber: 388,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/comps/Playlist.js",
                                        lineNumber: 366,
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
                                                        lineNumber: 431,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "item",
                                                        children: item.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/comps/Playlist.js",
                                                        lineNumber: 432,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, item.id, true, {
                                                fileName: "[project]/comps/Playlist.js",
                                                lineNumber: 415,
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
                                                                    lineNumber: 451,
                                                                    columnNumber: 31
                                                                }, this),
                                                                item.label
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/comps/Playlist.js",
                                                            lineNumber: 449,
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
                                                                    lineNumber: 457,
                                                                    columnNumber: 35
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/comps/Playlist.js",
                                                            lineNumber: 455,
                                                            columnNumber: 31
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/comps/Playlist.js",
                                                    lineNumber: 448,
                                                    columnNumber: 27
                                                }, this)
                                            }, item.id, false, {
                                                fileName: "[project]/comps/Playlist.js",
                                                lineNumber: 437,
                                                columnNumber: 25
                                            }, this);
                                        }
                                    })
                                ]
                            }, chap.id || i, true, {
                                fileName: "[project]/comps/Playlist.js",
                                lineNumber: 355,
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
                                    lineNumber: 483,
                                    columnNumber: 17
                                }, this),
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: "Video Help"
                                }, void 0, false, {
                                    fileName: "[project]/comps/Playlist.js",
                                    lineNumber: 487,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/comps/Playlist.js",
                            lineNumber: 482,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 343,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 342,
                columnNumber: 9
            }, this),
            props.toc.type === 'curriculumList' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$PIconView$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                data: props.toc,
                appType: "small"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 494,
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
                    lineNumber: 498,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 497,
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
                                lineNumber: 510,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "chapName",
                                children: props.toc.list[state.activeChap].label
                            }, void 0, false, {
                                fileName: "[project]/comps/Playlist.js",
                                lineNumber: 513,
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
                                    lineNumber: 517,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/comps/Playlist.js",
                                lineNumber: 516,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/Playlist.js",
                        lineNumber: 509,
                        columnNumber: 13
                    }, this),
                    !props.toc.cardView && !state.active && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "placeHolder",
                        children: "Click on the resource on the left to load the content here."
                    }, void 0, false, {
                        fileName: "[project]/comps/Playlist.js",
                        lineNumber: 534,
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
                        lineNumber: 539,
                        columnNumber: 13
                    }, this),
                    state.active && state.active.type !== 'chapter' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$DelayLoader$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        lazyLoad: true,
                        data: state.active,
                        children: displayResource(state.active, ()=>setState({
                                ...state,
                                active: null
                            }), null, // 2. PASS THE PLAYLIST ID TO THE HELPER FUNCTION
                        getCategoryBackground(props.toc.label, playlistId))
                    }, void 0, false, {
                        fileName: "[project]/comps/Playlist.js",
                        lineNumber: 560,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 507,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/comps/Playlist.js",
        lineNumber: 339,
        columnNumber: 5
    }, this));
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
                lineNumber: 579,
                columnNumber: 14
            }, this);
        case 'link':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["publicPath"])('/img/icons/linkIcon.png'),
                alt: "Link"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 581,
                columnNumber: 14
            }, this);
        case 'pLink':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["publicPath"])('/img/icons/icon32.png'),
                alt: "Link"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 583,
                columnNumber: 14
            }, this);
        case 'mvid':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["publicPath"])('/img/icons/videoIcon.png'),
                alt: "Video"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 585,
                columnNumber: 14
            }, this);
        case 'youtube':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["publicPath"])('/img/icons/youtubeIcon.png'),
                alt: "YouTube"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 588,
                columnNumber: 9
            }, this);
        default:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "imgPlaceHolder"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 591,
                columnNumber: 14
            }, this);
    }
}
function displayResource(item, onClose, onChapterNext, bgImage) {
    // 3. HANDLE API BACKGROUNDS (Check if bgImage is a URL)
    // If it starts with 'http', use it as-is. Otherwise, treat as local file.
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
                    lineNumber: 605,
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
                    lineNumber: 615,
                    columnNumber: 9
                }, this);
            }
        case 'link':
        case 'youtube':
        case 'pLink':
            return null;
        default:
            {
                let style = {
                    border: 'none'
                };
                const localTypes = [
                    'mcq',
                    'classifySentence',
                    'matchByDragDrop',
                    'informationProcessing',
                    'sequence',
                    'dragAndDrop',
                    'wordsearch',
                    'completeWord'
                ];
                const isLocal = localTypes.includes(item.type);
                if (item.data.bgData) {
                    if (item.data.bgData.imgWidth) style.width = item.data.bgData.imgWidth;
                    if (item.data.bgData.imgHeight) style.height = item.data.bgData.imgHeight;
                } else {
                    style.width = '100%';
                    style.height = '100%';
                }
                if (!isLocal) {
                    style.mixBlendMode = 'multiply';
                }
                let iframeSrc;
                let str = JSON.stringify(item.data);
                if (item.type === 'mcq') {
                    const payload = {
                        id: item.id,
                        ...item.data
                    };
                    const compressed = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lz$2d$string$2f$libs$2f$lz$2d$string$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].compressToEncodedURIComponent(JSON.stringify(payload));
                    iframeSrc = `/lms-system/acts/mcq/index.html?c=${compressed}`;
                } else if (item.type === 'classifySentence') {
                    const payload = {
                        id: item.id,
                        ...item.data
                    };
                    const compressed = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lz$2d$string$2f$libs$2f$lz$2d$string$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].compressToEncodedURIComponent(JSON.stringify(payload));
                    iframeSrc = `/lms-system/acts/classifySentence/index.html?c=${compressed}`;
                } else if (localTypes.includes(item.type)) {
                    iframeSrc = `/lms-system/acts/${item.type}/index.html?payload=${encodeURIComponent(str)}`;
                } else {
                    iframeSrc = `https://pschool.app/acts/${item.type}?payload=${str}`;
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        backgroundImage: `url(${bgUrl})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'transparent'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                        className: "actIFrame",
                        style: style,
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
                        lineNumber: 707,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 676,
                    columnNumber: 9
                }, this);
            }
    }
}
// 4. UPDATED BACKGROUND HELPER
function getCategoryBackground(label, id) {
    // A: If we have a numeric ID, use the API
    if (id && !isNaN(id)) {
        return `http://192.168.0.127:8080/ords/lms/v1/konzeptes/image/bg/${id}`;
    }
    // B: Fallback to static Logic if ID is missing (or text-based slug)
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
    const [childName, setChildName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 1. Get Name on Load
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserDropdown.useEffect": ()=>{
            const storedName = localStorage.getItem('child_name');
            if (storedName) {
                setChildName(storedName);
            }
            // Close dropdown if clicking outside
            function handleClickOutside(event) {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            }
            document.addEventListener('mousedown', handleClickOutside);
            return ({
                "UserDropdown.useEffect": ()=>document.removeEventListener('mousedown', handleClickOutside)
            })["UserDropdown.useEffect"];
        }
    }["UserDropdown.useEffect"], []);
    // 2. Logout Logic
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
        localStorage.clear(); // Clear all storage
        window.location.href = '/lms-system';
    };
    const goHome = ()=>{
        router.push('/home');
        setIsOpen(false);
    };
    // If no name is loaded yet, render nothing to prevent flickering
    if (!childName) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: dropdownRef,
        className: "jsx-c9a6ab668ec96eb3" + " " + "user-dropdown-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "c9a6ab668ec96eb3",
                children: ".user-dropdown-container.jsx-c9a6ab668ec96eb3{z-index:2000;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;position:fixed;top:20px;right:20px}.dropdown-trigger.jsx-c9a6ab668ec96eb3{color:#2b7d10;cursor:pointer;-webkit-user-select:none;user-select:none;background-color:#fff;border:1px solid #2b7d10;border-radius:50px;align-items:center;gap:10px;padding:5px 16px 5px 5px;font-size:14px;font-weight:600;transition:all .2s;display:flex;box-shadow:0 2px 5px #0000000d}.dropdown-trigger.jsx-c9a6ab668ec96eb3:hover{transform:translateY(-1px);box-shadow:0 4px 8px #2b7d1026}.avatar.jsx-c9a6ab668ec96eb3{color:#fff;background-color:#2b7d10;border-radius:50%;justify-content:center;align-items:center;width:30px;height:30px;font-size:14px;font-weight:700;display:flex}.arrow.jsx-c9a6ab668ec96eb3{font-size:10px;transition:transform .2s}.arrow.open.jsx-c9a6ab668ec96eb3{transform:rotate(180deg)}.dropdown-menu.jsx-c9a6ab668ec96eb3{background:#fff;border:1px solid #f0f0f0;border-radius:12px;width:160px;animation:.2s ease-out slideDown;position:absolute;top:45px;right:0;overflow:hidden;box-shadow:0 10px 30px #0000001a}@keyframes slideDown{0%{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}.menu-item.jsx-c9a6ab668ec96eb3{cursor:pointer;color:#444;align-items:center;gap:12px;padding:12px 16px;font-size:14px;font-weight:500;transition:background .15s;display:flex}.menu-item.jsx-c9a6ab668ec96eb3:hover{color:#2b7d10;background-color:#f7f9f7}.menu-item.jsx-c9a6ab668ec96eb3+.menu-item.jsx-c9a6ab668ec96eb3{border-top:1px solid #f5f5f5}.menu-item.logout.jsx-c9a6ab668ec96eb3{color:#e74c3c}.menu-item.logout.jsx-c9a6ab668ec96eb3:hover{background-color:#fff5f5}.icon.jsx-c9a6ab668ec96eb3{stroke-width:2px;width:18px;height:18px}"
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: ()=>setIsOpen(!isOpen),
                className: "jsx-c9a6ab668ec96eb3" + " " + "dropdown-trigger",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-c9a6ab668ec96eb3" + " " + "avatar",
                        children: childName.charAt(0).toUpperCase()
                    }, void 0, false, {
                        fileName: "[project]/comps/UserDropdown.js",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "jsx-c9a6ab668ec96eb3",
                        children: childName
                    }, void 0, false, {
                        fileName: "[project]/comps/UserDropdown.js",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "jsx-c9a6ab668ec96eb3" + " " + `arrow ${isOpen ? 'open' : ''}`,
                        children: "▼"
                    }, void 0, false, {
                        fileName: "[project]/comps/UserDropdown.js",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/comps/UserDropdown.js",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-c9a6ab668ec96eb3" + " " + "dropdown-menu",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: goHome,
                        className: "jsx-c9a6ab668ec96eb3" + " " + "menu-item",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                className: "jsx-c9a6ab668ec96eb3" + " " + "icon",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
                                        className: "jsx-c9a6ab668ec96eb3"
                                    }, void 0, false, {
                                        fileName: "[project]/comps/UserDropdown.js",
                                        lineNumber: 193,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                        points: "9 22 9 12 15 12 15 22",
                                        className: "jsx-c9a6ab668ec96eb3"
                                    }, void 0, false, {
                                        fileName: "[project]/comps/UserDropdown.js",
                                        lineNumber: 194,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/UserDropdown.js",
                                lineNumber: 185,
                                columnNumber: 13
                            }, this),
                            "Home"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/UserDropdown.js",
                        lineNumber: 184,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: handleLogout,
                        className: "jsx-c9a6ab668ec96eb3" + " " + "menu-item logout",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                className: "jsx-c9a6ab668ec96eb3" + " " + "icon",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
                                        className: "jsx-c9a6ab668ec96eb3"
                                    }, void 0, false, {
                                        fileName: "[project]/comps/UserDropdown.js",
                                        lineNumber: 209,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                        points: "16 17 21 12 16 7",
                                        className: "jsx-c9a6ab668ec96eb3"
                                    }, void 0, false, {
                                        fileName: "[project]/comps/UserDropdown.js",
                                        lineNumber: 210,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "21",
                                        y1: "12",
                                        x2: "9",
                                        y2: "12",
                                        className: "jsx-c9a6ab668ec96eb3"
                                    }, void 0, false, {
                                        fileName: "[project]/comps/UserDropdown.js",
                                        lineNumber: 211,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/comps/UserDropdown.js",
                                lineNumber: 201,
                                columnNumber: 13
                            }, this),
                            "Logout"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/UserDropdown.js",
                        lineNumber: 200,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/comps/UserDropdown.js",
                lineNumber: 182,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/comps/UserDropdown.js",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_s(UserDropdown, "GI4OZr4NKgeFR8CG9CAI5H0CuvQ=", false, function() {
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

// // import React, { useState, useEffect } from 'react';
// // import { useRouter } from 'next/router';
// // import Playlist from 'comps/Playlist';
// // import OnlyBigScreen from 'comps/OnlyBigScreen';
// // import DelayLoader from 'comps/DelayLoader';
// // import UserDropdown from 'comps/UserDropdown'; // 👈 IMPORT DROPDOWN
// // export default function PlaylistPage(props) {
// //   const router = useRouter();
// //   const [state, setState] = useState({
// //     loading: true,
// //     toc: null,
// //     error: false,
// //   });
// //   // --- BACK BUTTON LOGIC ---
// //   const handleBack = () => {
// //     router.push('/home'); // Goes back to Dashboard
// //   };
// //   useEffect(() => {
// //     const fetchData = async (slugArray) => {
// //       const id = slugArray.join('/');
// //       try {
// //         let data = await loadPlaylist(id);
// //         if (!data.type) {
// //           data = {
// //             ...data,
// //             list: [{ id: 'chap-1', label: 'Default Chapter', list: data.list }],
// //           };
// //         }
// //         setState({ toc: data, loading: false, error: false });
// //       } catch (err) {
// //         setState({ loading: false, error: true, toc: null });
// //       }
// //     };
// //     if (router.isReady && router.query.slug) {
// //       fetchData(router.query.slug);
// //     }
// //   }, [router.isReady, router.query.slug]);
// //   if (state.loading) return <div>Loading...</div>;
// //   if (state.error) return <div>Activity not found.</div>;
// //   return (
// //     <div style={{ position: 'relative', minHeight: '100vh' }}>
// //       {/* 🟢 USER DROPDOWN (Top Right) */}
// //       <UserDropdown />
// //       {/* 🔙 BACK BUTTON (Left Side) */}
// //       <button
// //         onClick={handleBack}
// //         style={{
// //           position: 'fixed', // Fixed so it stays visible while scrolling questions
// //           bottom: '20px',
// //           left: '20px',
// //           padding: '8px 16px',
// //           backgroundColor: 'white',
// //           border: '2px solid #2b7d10',
// //           borderRadius: '8px',
// //           fontWeight: 'bold',
// //           cursor: 'pointer',
// //           zIndex: 1000,
// //         }}
// //       >
// //         ← Back
// //       </button>
// //       <DelayLoader data={state.toc} lazyLoad={true}>
// //         <OnlyBigScreen minSize={700}>
// //           <Playlist toc={state.toc} />
// //         </OnlyBigScreen>
// //       </DelayLoader>
// //     </div>
// //   );
// // }
// // export const loadPlaylist = async (id) => {
// //   try {
// //     const getBasePath = () => {
// //       if (typeof window === 'undefined') return '';
// //       if (window.__NEXT_DATA__?.basePath) return window.__NEXT_DATA__.basePath;
// //       if (window.location?.pathname) {
// //         const parts = window.location.pathname.split('/');
// //         if (parts.length > 1 && parts[1] === 'lms-system') return '/lms-system';
// //       }
// //       return '';
// //     };
// //     const basePath = getBasePath();
// //     const res = await fetch(`${basePath}/json/${id}.pschool`);
// //     if (!res.ok) throw new Error('JSON file not found');
// //     return await res.json();
// //   } catch (e) {
// //     throw e;
// //   }
// // };
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Playlist from 'comps/Playlist';
// import OnlyBigScreen from 'comps/OnlyBigScreen';
// import DelayLoader from 'comps/DelayLoader';
// import UserDropdown from 'comps/UserDropdown';
// export default function PlaylistPage(props) {
//   const router = useRouter();
//   const [state, setState] = useState({
//     loading: true,
//     toc: null,
//     error: false,
//   });
//   const handleBack = () => {
//     router.push('/home');
//   };
//   useEffect(() => {
//     const fetchData = async (slugArray) => {
//       const id = slugArray.join('/');
//       try {
//         let data = await loadPlaylist(id);
//         // Safety Check: Ensure the data has a 'list'
//         if (!data.type) {
//           data = {
//             ...data,
//             list: [
//               { id: 'chap-1', label: 'Default Chapter', list: data.list || [] },
//             ],
//           };
//         }
//         setState({ toc: data, loading: false, error: false });
//       } catch (err) {
//         console.error('Playlist Load Error:', err);
//         setState({ loading: false, error: true, toc: null });
//       }
//     };
//     if (router.isReady && router.query.slug) {
//       fetchData(router.query.slug);
//     }
//   }, [router.isReady, router.query.slug]);
//   if (state.loading) return <div>Loading...</div>;
//   if (state.error) return <div>Activity not found.</div>;
//   return (
//     <div style={{ position: 'relative', minHeight: '100vh' }}>
//       <UserDropdown />
//       <button
//         onClick={handleBack}
//         style={{
//           position: 'fixed',
//           bottom: '20px',
//           left: '20px',
//           padding: '8px 16px',
//           backgroundColor: 'white',
//           border: '2px solid #2b7d10',
//           borderRadius: '8px',
//           fontWeight: 'bold',
//           cursor: 'pointer',
//           zIndex: 1000,
//         }}
//       >
//         ← Back
//       </button>
//       <DelayLoader data={state.toc} lazyLoad={true}>
//         <OnlyBigScreen minSize={700}>
//           <Playlist toc={state.toc} />
//         </OnlyBigScreen>
//       </DelayLoader>
//     </div>
//   );
// }
// // --- UPDATED LOAD FUNCTION ---
// export const loadPlaylist = async (id) => {
//   try {
//     // 1. IF ID IS NUMERIC -> CALL API
//     if (!isNaN(id)) {
//       const res = await fetch(
//         `http://192.168.0.127:8080/ords/lms/activity/data?id=${id}`
//       );
//       if (!res.ok) throw new Error('API Data not found');
//       const json = await res.json();
//       console.log('API Response:', json); // Debugging help
//       // SCENARIO 1: Direct Object (This matches your screenshot!)
//       // If the response already has 'id' or 'list', use it directly.
//       if (json.id || json.list) {
//         return json;
//       }
//       // SCENARIO 2: ORDS Wrapper (Fallback)
//       // If the API wraps data in { items: [...] }
//       if (json.items && json.items.length > 0) {
//         const item = json.items[0];
//         // Handle if data is stringified inside a column
//         if (item.data && typeof item.data === 'string')
//           return JSON.parse(item.data);
//         if (item.list && typeof item.list === 'string')
//           return JSON.parse(item.list);
//         const cleanItem = { ...item };
//         delete cleanItem.links;
//         return cleanItem;
//       }
//       throw new Error('API returned empty items');
//     }
//     // 2. IF ID IS STRING -> CALL STATIC FILE (Legacy Support)
//     const getBasePath = () => {
//       if (typeof window === 'undefined') return '';
//       if (window.__NEXT_DATA__?.basePath) return window.__NEXT_DATA__.basePath;
//       if (window.location?.pathname) {
//         const parts = window.location.pathname.split('/');
//         if (parts.length > 1 && parts[1] === 'lms-system') return '/lms-system';
//       }
//       return '';
//     };
//     const basePath = getBasePath();
//     const res = await fetch(`${basePath}/json/${id}.pschool`);
//     if (!res.ok) throw new Error('JSON file not found');
//     return await res.json();
//   } catch (e) {
//     throw e;
//   }
// };
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
;
var _s = __turbopack_context__.k.signature();
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
    const handleBack = ()=>{
        router.push('/home');
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PlaylistPage.useEffect": ()=>{
            const fetchData = {
                "PlaylistPage.useEffect.fetchData": async (slugArray)=>{
                    const id = slugArray.join('/');
                    try {
                        let data = await loadPlaylist(id);
                        // Safety Check: Ensure structure
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
                        // 🟢 FIX: Force the first activity to open automatically
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
        lineNumber: 288,
        columnNumber: 29
    }, this);
    if (state.error) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "Activity not found."
    }, void 0, false, {
        fileName: "[project]/pages/p/[...slug].js",
        lineNumber: 289,
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
                lineNumber: 293,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleBack,
                style: {
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    border: '2px solid #2b7d10',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    zIndex: 1000
                },
                children: "← Back"
            }, void 0, false, {
                fileName: "[project]/pages/p/[...slug].js",
                lineNumber: 295,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$DelayLoader$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                data: state.toc,
                lazyLoad: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$OnlyBigScreen$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    minSize: 700,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$Playlist$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        toc: state.toc
                    }, void 0, false, {
                        fileName: "[project]/pages/p/[...slug].js",
                        lineNumber: 315,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/p/[...slug].js",
                    lineNumber: 314,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/p/[...slug].js",
                lineNumber: 313,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/p/[...slug].js",
        lineNumber: 292,
        columnNumber: 5
    }, this);
}
_s(PlaylistPage, "RP3UIUrU3czjixiFKtSwlhNNGgU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = PlaylistPage;
const loadPlaylist = async (id)=>{
    try {
        // 1. IF ID IS NUMERIC -> CALL API
        if (!isNaN(id)) {
            const res = await fetch(`http://192.168.0.127:8080/ords/lms/activity/data?id=${id}`);
            if (!res.ok) throw new Error('API Data not found');
            const json = await res.json();
            // SCENARIO 1: Direct Object (Matches your API)
            if (json.id || json.list) {
                return json;
            }
            // SCENARIO 2: ORDS Wrapper (Fallback)
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
        // 2. IF ID IS STRING -> CALL STATIC FILE
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

//# sourceMappingURL=%5Broot-of-the-server%5D__7980805c._.js.map