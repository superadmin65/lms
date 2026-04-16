module.exports = [
"[project]/utils/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
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
    if ("TURBOPACK compile-time truthy", 1) {
        return defaultVal;
    }
    //TURBOPACK unreachable
    ;
    // 2. Now it is safe to check for localStorage
    const ls = undefined;
    const data = undefined;
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
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
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
}),
"[externals]/axios [external] (axios, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("axios");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/utils/apiService.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "apiService",
    ()=>apiService
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
// 1. Declare the constant at the top so it's accessible to the whole file
const API_BASE = ("TURBOPACK compile-time value", "http://192.168.0.127:8080/ords/lms");
const api = __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].create({
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/base/comps/InputWrap.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-components [external] (styled-components, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
const InputWrapper = __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["default"].div.withConfig({
    displayName: "InputWrap__InputWrapper",
    componentId: "sc-768cbaeb-0"
})`
  margin: 10px 0;

  ${(props)=>props.sameLine && __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["css"]`
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
const InputWrap = ({ error, label, children, sameLine, ...otherProps })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(InputWrapper, {
        error: error,
        style: otherProps.style,
        sameLine: sameLine,
        children: [
            !!label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                children: label
            }, void 0, false, {
                fileName: "[project]/base/comps/InputWrap.js",
                lineNumber: 39,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
            children,
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
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
const __TURBOPACK__default__export__ = InputWrap;
}),
"[project]/base/comps/Input.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileUpload",
    ()=>FileUpload,
    "TextArea",
    ()=>TextArea,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-components [external] (styled-components, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Svg.js [ssr] (ecmascript)");
;
;
;
;
const InputWrapper = __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["default"].div.withConfig({
    displayName: "Input__InputWrapper",
    componentId: "sc-acb101f1-0"
})`
  margin: 10px 0;

  ${(props)=>props.sameLine && __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["css"]`
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
const Input = ({ error, label, sameLine, ...otherProps })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(InputWrapper, {
        sameLine: sameLine,
        error: error,
        style: otherProps.style,
        children: [
            !!label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                htmlFor: label,
                children: label
            }, void 0, false, {
                fileName: "[project]/base/comps/Input.js",
                lineNumber: 41,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    width: otherProps.width || ''
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        id: label,
                        type: "text",
                        ...otherProps
                    }, void 0, false, {
                        fileName: "[project]/base/comps/Input.js",
                        lineNumber: 43,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
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
const TextArea = ({ error, label, sameLine, ...otherProps })=>{
    const inputRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    /*
  useEffect(() => {
    const dom = inputRef.current;
    dom.style.height = `${dom.scrollHeight}px`;
  });
  */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(InputWrapper, {
        sameLine: sameLine,
        error: error,
        style: otherProps.style,
        children: [
            !!label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                htmlFor: label,
                children: label
            }, void 0, false, {
                fileName: "[project]/base/comps/Input.js",
                lineNumber: 59,
                columnNumber: 19
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                id: label,
                ref: inputRef,
                ...otherProps
            }, void 0, false, {
                fileName: "[project]/base/comps/Input.js",
                lineNumber: 60,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
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
const FileUpload = ({ error, iconOnly, label, ...otherProps })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                htmlFor: "fileUpload",
                className: iconOnly ? '' : 'button is-primary',
                children: iconOnly ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
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
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
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
const __TURBOPACK__default__export__ = Input;
}),
"[project]/base/comps/InputNumber.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-components [external] (styled-components, cjs)");
;
const InputNumber = __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["default"].input.attrs({
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
}),
"[project]/base/comps/Checkbox.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-components [external] (styled-components, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
const CheckboxWrapper = __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["default"].div.withConfig({
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
const Checkbox = ({ onClick, children, checked })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(CheckboxWrapper, {
        onClick: onClick,
        role: 'checkbox',
        "aria-checked": checked,
        tabIndex: 0,
        checked: checked,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                type: "checkbox",
                checked: checked
            }, void 0, false, {
                fileName: "[project]/base/comps/Checkbox.js",
                lineNumber: 38,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
const __TURBOPACK__default__export__ = Checkbox;
}),
"[project]/base/comps/Radio.js [ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-components [external] (styled-components, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
const CheckboxWrapper = __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["default"].div.withConfig({
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
const Radio = ({ onClick, options, value, name })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: options.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(CheckboxWrapper, {
                checked: item.value === value,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
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
const __TURBOPACK__default__export__ = Radio;
}),
"[project]/base/comps/Button.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProgButton",
    ()=>ProgButton,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-components [external] (styled-components, cjs)");
;
;
;
//import Loader from "../libs/SpinKit";
const Loader = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
    children: "..."
}, void 0, false, {
    fileName: "[project]/base/comps/Button.js",
    lineNumber: 5,
    columnNumber: 16
}, ("TURBOPACK compile-time value", void 0));
const ring = __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["keyframes"]`
0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;
const StyledButton = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["default"])('button').withConfig({
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
  ${(props)=>props.primary && __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["css"]`
      background-color: var(--darkColor);

      color: #fff;
    `}
  ${(props)=>props.secondary && __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["css"]`
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
const ProgButton = ({ children, updating, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(StyledButton, {
        ...props,
        ref: props.innerRef,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "updating",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                        fileName: "[project]/base/comps/Button.js",
                        lineNumber: 89,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                        fileName: "[project]/base/comps/Button.js",
                        lineNumber: 90,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                        fileName: "[project]/base/comps/Button.js",
                        lineNumber: 91,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
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
const Button = ({ children, updating, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(StyledButton, {
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/base/comps/Button.js",
        lineNumber: 99,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Button;
}),
"[project]/base/comps/ButtonBar.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-components [external] (styled-components, cjs)");
;
const ButtonBar = __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["default"].div.withConfig({
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
}),
"[project]/base/comps/Overlay.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-components [external] (styled-components, cjs)");
;
;
;
const OverlayWrapper = __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["default"].div.withConfig({
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
class Overlay extends __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["default"].Component {
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(OverlayWrapper, {
            ...otherProps,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "overlayContent",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "title",
                            onMouseDown: this.panelDragStart,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/base/comps/Overlay.js",
                                    lineNumber: 156,
                                    columnNumber: 13
                                }, this),
                                onClose && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
}),
"[project]/base/comps/Select.js [ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-components [external] (styled-components, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$InputWrap$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/InputWrap.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Svg.js [ssr] (ecmascript)");
;
;
;
;
;
const Styled = __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["default"].div.withConfig({
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
function Select(props) {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
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
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        document.addEventListener('click', outsideClick);
        return ()=>document.removeEventListener('click', outsideClick);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$InputWrap$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        label: props.label,
        sameLine: props.sameLine || false,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Styled, {
            width: props.width,
            tabIndex: "0",
            children: [
                !state.open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "control",
                    onClick: (e)=>{
                        e.stopPropagation();
                        setState({
                            ...state,
                            open: true
                        });
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "placeholder",
                            children: selected ? selected.label : 'Select'
                        }, void 0, false, {
                            fileName: "[project]/base/comps/Select.js",
                            lineNumber: 208,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                state.open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "menu",
                    children: options.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
}),
"[project]/base/comps/Section.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-components [external] (styled-components, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
const SectionWrapper = __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["default"].div.withConfig({
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
const Section = ({ title, style, children, btnBar })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(SectionWrapper, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "sec-head",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
const __TURBOPACK__default__export__ = Section;
}),
"[project]/base/comps/LinkButton.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-components [external] (styled-components, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
const LinkButtonStyled = __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["default"].div.withConfig({
    displayName: "LinkButton__LinkButtonStyled",
    componentId: "sc-620befe9-0"
})`
  padding: 10px;
  text-align: right;
  font-size: 0.8em;
  text-decoration: underline;
  cursor: pointer;
`;
const LinkButton = ({ children, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(LinkButtonStyled, {
        ...props,
        role: 'button',
        children: children
    }, void 0, false, {
        fileName: "[project]/base/comps/LinkButton.js",
        lineNumber: 13,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const __TURBOPACK__default__export__ = LinkButton;
}),
"[project]/base/comps/index.js [ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$InputWrap$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/InputWrap.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Input$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Input.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$InputNumber$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/InputNumber.js [ssr] (ecmascript)");
//export { default as TextArea } from "./TextArea";
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Checkbox$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Checkbox.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Radio$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Radio.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Button$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Button.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$ButtonBar$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/ButtonBar.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Overlay$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Overlay.js [ssr] (ecmascript)");
//export { default as DropDown } from './DropDown';
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Select$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Select.js [ssr] (ecmascript)");
/*
export { default as DropDown } from "../core/DropDown";
export { default as DropDownMini } from "../core/DropDownMini";
export { default as FuzzyDropDown } from "../core/FuzzyDropDown";
export { default as Menu } from "../core/Menu";


export { default as OverlayFullView } from "./OverlayFullView";

export { default as ErrorOverlay } from "./ErrorOverlay";
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Section$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Section.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$LinkButton$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/LinkButton.js [ssr] (ecmascript)");
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
}),
"[project]/base/comps/Select.js [ssr] (ecmascript) <export default as Select>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Select$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Select$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Select.js [ssr] (ecmascript)");
}),
"[project]/comps/curriculumViews/IconViewMini.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>IconView
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-components [external] (styled-components, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/index.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/apiService.js [ssr] (ecmascript)"); // Imported apiService
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/base/comps/index.js [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Select$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__ = __turbopack_context__.i("[project]/base/comps/Select.js [ssr] (ecmascript) <export default as Select>");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
const Styled = __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["default"].div.withConfig({
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
        const apiUrl = __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].getIconUrl(item.id);
        iconStyle.backgroundImage = `url(${apiUrl})`;
        return iconStyle;
    }
    // 2. Static Image Handling (Original Logic)
    const img = item; // assuming item passed was img string in old code
    const imgPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getImage"])(`${data.iconsLoc || 'icons'}/${img}.png`);
    const resolveImg = (src)=>{
        if (!src) return src;
        if (src.indexOf('http') === 0) return src;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["publicPath"])(src.startsWith('/') ? src : `/${src}`);
    };
    iconStyle.backgroundImage = `url(${resolveImg(imgPath)})`;
    return iconStyle;
};
function IconView(props) {
    //const {title, menu, onPick} = props;
    let config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getLocalItem"])('config', {});
    let defaultGrade;
    const data = props.data || {};
    if (data.grades) {
        let defaultItem = data.grades.find((item)=>item.default === true);
        if (defaultItem) {
            defaultGrade = defaultItem.id;
        }
    }
    let [state, setState] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Styled, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                style: data.style || {
                    maxWidth: 1024,
                    fontSize: '1rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex-sb",
                        children: [
                            data.label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                style: data.titleStyle || {},
                                children: data.label
                            }, void 0, false, {
                                fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                lineNumber: 199,
                                columnNumber: 26
                            }, this),
                            data.grades && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Select$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                width: "150px",
                                options: data.grades,
                                value: state.selectedGrade,
                                bgColor: "inherit",
                                onChange: (e)=>{
                                    const cfg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getLocalItem"])('config', {});
                                    cfg.selectedGrade = e.value || e.id;
                                    cfg.selectedSubject = 'all';
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["setLocalItem"])('config', cfg);
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "topics",
                        children: menu.map((item)=>{
                            const localStyle = item.style || {};
                            let style = data.cardStyle || defaultCardStyle;
                            style = {
                                ...style,
                                ...localStyle
                            };
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "card",
                                style: style,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/p/${item.id}`,
                                    children: [
                                        !tocConfig.type && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "img",
                                                    style: {
                                                        // UPDATED: Pass 'item' object instead of 'item.img'
                                                        ...getIconStyle(item, data),
                                                        backgroundImage: `url(${function() {
                                                            // UPDATED: Check for ID first - DYNAMIC URL
                                                            if (item.id && !isNaN(item.id)) {
                                                                return __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].getIconUrl(item.id);
                                                            }
                                                            // Original Logic Fallback
                                                            const imgPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getImage"])(`${data.iconsLoc || 'icons'}/${item.img}.png`);
                                                            if (!imgPath) return imgPath;
                                                            if (imgPath.indexOf('http') === 0) return imgPath;
                                                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["publicPath"])(imgPath.startsWith('/') ? imgPath : `/${imgPath}`);
                                                        }()})`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                    lineNumber: 228,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "label",
                                                    style: data.labelStyle || {},
                                                    children: item.label
                                                }, void 0, false, {
                                                    fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                    lineNumber: 250,
                                                    columnNumber: 23
                                                }, this),
                                                item.smLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                        tocConfig.type === 'descType' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "descCard",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "label title",
                                                            style: data.labelStyle || {},
                                                            children: item.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                            lineNumber: 266,
                                                            columnNumber: 25
                                                        }, this),
                                                        item.smLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "smLabel",
                                                            style: data.smLabelStyle || {},
                                                            children: item.smLabel
                                                        }, void 0, false, {
                                                            fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                            lineNumber: 273,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "img",
                                                    style: {
                                                        // UPDATED: Pass 'item' object
                                                        ...getIconStyle(item, data),
                                                        backgroundImage: `url(${function() {
                                                            // UPDATED: Check for ID first - DYNAMIC URL
                                                            if (item.id && !isNaN(item.id)) {
                                                                return __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].getIconUrl(item.id);
                                                            }
                                                            // Original Logic
                                                            const imgPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getImage"])(`${data.iconsLoc || 'icons'}/${item.img}.png`);
                                                            if (!imgPath) return imgPath;
                                                            if (imgPath.indexOf('http') === 0) return imgPath;
                                                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["publicPath"])(imgPath.startsWith('/') ? imgPath : `/${imgPath}`);
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
            data.moreActivities && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "hilight",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/home.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$IconViewMini$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/curriculumViews/IconViewMini.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$UserDropdown$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/UserDropdown.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$IconViewMini$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$IconViewMini$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
function HomeView() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [menuData, setMenuData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
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
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // 1. Check Login
        const loggedIn = localStorage.getItem('isLoggedIn');
        if (loggedIn !== 'true') {
            window.location.href = '/lms-system';
            return;
        }
        // 2. Fetch API Data
        fetch('http://192.168.0.127:8080/ords/lms/v1/konzeptes/config').then((res)=>res.json()).then((data)=>{
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
        }).catch((err)=>console.error('Fetch error:', err));
    }, []);
    const handleBack = ()=>{
        router.push('/');
    };
    if (isLoading || !menuData) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            backgroundColor: 'var(--l)',
            minHeight: '100vh',
            position: 'relative'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$UserDropdown$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/home.js",
                lineNumber: 149,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$IconViewMini$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b63f7315._.js.map