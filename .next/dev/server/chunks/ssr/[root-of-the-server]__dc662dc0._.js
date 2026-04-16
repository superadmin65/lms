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
"[project]/comps/DelayLoader.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DelayLoader
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
function DelayLoader(props) {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        isLoading: false
    });
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        let intervalID;
        if (props.lazyLoad) {
            setState({
                ...state,
                isLoading: true
            });
            intervalID = setTimeout(()=>setState({
                    ...state,
                    isLoading: false
                }), 200);
        }
        return ()=>intervalID && clearTimeout(intervalID);
    }, [
        props.lazyLoad,
        props.data
    ]);
    if (state.isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/comps/DelayLoader.js",
            lineNumber: 19,
            columnNumber: 12
        }, this);
    }
    return props.children;
}
}),
"[project]/utils/playlistUtils.js [ssr] (ecmascript)", ((__turbopack_context__) => {
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
            if ("TURBOPACK compile-time truthy", 1) return '';
            //TURBOPACK unreachable
            ;
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
}),
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
"[project]/base/comps/Button.js [ssr] (ecmascript) <export default as Button>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Button$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Button$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Button.js [ssr] (ecmascript)");
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
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-components [external] (styled-components, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/index.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/base/comps/index.js [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Select$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__ = __turbopack_context__.i("[project]/base/comps/Select.js [ssr] (ecmascript) <export default as Select>");
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
    // 1. API Image Handling
    if (item && item.id && !isNaN(item.id)) {
        const apiUrl = `http://192.168.0.127:8080/ords/lms/v1/konzeptes/image/icon/${item.id}`;
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
                                lineNumber: 504,
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
                                lineNumber: 506,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                        lineNumber: 503,
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
                                                            // UPDATED: Check for ID first
                                                            if (item.id && !isNaN(item.id)) {
                                                                return `http://192.168.0.127:8080/ords/lms/v1/konzeptes/image/icon/${item.id}`;
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
                                                    lineNumber: 533,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "label",
                                                    style: data.labelStyle || {},
                                                    children: item.label
                                                }, void 0, false, {
                                                    fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                    lineNumber: 555,
                                                    columnNumber: 23
                                                }, this),
                                                item.smLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                            lineNumber: 571,
                                                            columnNumber: 25
                                                        }, this),
                                                        item.smLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "smLabel",
                                                            style: data.smLabelStyle || {},
                                                            children: item.smLabel
                                                        }, void 0, false, {
                                                            fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                                                            lineNumber: 578,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                            const imgPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getImage"])(`${data.iconsLoc || 'icons'}/${item.img}.png`);
                                                            if (!imgPath) return imgPath;
                                                            if (imgPath.indexOf('http') === 0) return imgPath;
                                                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["publicPath"])(imgPath.startsWith('/') ? imgPath : `/${imgPath}`);
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
            data.moreActivities && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "hilight",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
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
}),
"[project]/base/comps/Input.js [ssr] (ecmascript) <export default as Input>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Input$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Input$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/base/comps/Input.js [ssr] (ecmascript)");
}),
"[project]/comps/curriculumViews/PIconView.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PIconView
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-components [external] (styled-components, cjs)");
//import { useNavigate } from 'react-router-dom';
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/base/comps/index.js [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Input$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__ = __turbopack_context__.i("[project]/base/comps/Input.js [ssr] (ecmascript) <export default as Input>");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Select$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__ = __turbopack_context__.i("[project]/base/comps/Select.js [ssr] (ecmascript) <export default as Select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/index.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Svg.js [ssr] (ecmascript)");
;
;
;
;
;
;
;
const Styled = __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["default"].div.withConfig({
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
function PIconView(props) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    let { data } = props;
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        loading: true,
        showFavorites: false
    });
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        let config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getLocalItem"])('config', {});
        let masterProgress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getLocalItem"])('masterProgress', {});
        setState((s)=>({
                ...s,
                config,
                masterProgress,
                selectedGrade: config.selectedGrade || 'all',
                selectedSubject: config.selectedSubject || 'all',
                isSearch: !!config.searchText,
                searchText: config.searchText || '',
                favorites: config.favorites || [],
                loading: false
            }));
    }, []);
    if (state.loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["setLocalItem"])('config', config);
    };
    const handleItemClick = (item)=>{
        if (state.searchText.length >= 3) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["setLocalItem"])('config', {
                ...state.config,
                searchText: state.searchText
            });
        }
        router.push(`/p/${item.id}`);
    // router.push(`/playlist?id=${item.id}`);
    };
    subjects = subjects.filter((item)=>item.list.length !== 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Styled, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: `tocHeader ${state.showFavorites ? 'disable' : ''}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
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
                    (isGradePicker || isSubjectPicker) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "filterWrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 200
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "caption",
                                        children: "Class / Grade"
                                    }, void 0, false, {
                                        fileName: "[project]/comps/curriculumViews/PIconView.js",
                                        lineNumber: 419,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Select$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 200
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "caption",
                                            children: "Subject"
                                        }, void 0, false, {
                                            fileName: "[project]/comps/curriculumViews/PIconView.js",
                                            lineNumber: 432,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Select$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Input$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__["Input"], {
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
                            state.searchText.length >= 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["setLocalItem"])('config', config);
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: `view subjectWrap ${state.showGradePick ? '' : 'goLeft'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                    subjects.map((subject)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "otherTopics",
                            children: [
                                subjects.length > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "subject",
                                    children: subject.label
                                }, void 0, false, {
                                    fileName: "[project]/comps/curriculumViews/PIconView.js",
                                    lineNumber: 495,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "subject",
                                    children: " "
                                }, void 0, false, {
                                    fileName: "[project]/comps/curriculumViews/PIconView.js",
                                    lineNumber: 497,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                    style: {
                                        marginBottom: 20
                                    },
                                    children: subject.list.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                onClick: ()=>handleItemClick(item),
                                                className: "item",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "sno",
                                                        children: i + 1
                                                    }, void 0, false, {
                                                        fileName: "[project]/comps/curriculumViews/PIconView.js",
                                                        lineNumber: 503,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "main",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "captionBar",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                                    /*!item.locked ||*/ iAmMember && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["setLocalItem"])('config', config);
                                                                        },
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                                                            state.masterProgress[item.id] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "infoBar",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "progress",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
            subjects.length === 0 && (state.showFavorites ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "noStars",
                children: "Your playlist favorites is empty. Click on the star in playlists to make them your favorites."
            }, void 0, false, {
                fileName: "[project]/comps/curriculumViews/PIconView.js",
                lineNumber: 567,
                columnNumber: 11
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
function getIcon(item) {
    //if (!item.img) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
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
}),
"[project]/comps/curriculumViews/SubCards.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SubCards
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-components [external] (styled-components, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/base/comps/index.js [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Button$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/base/comps/Button.js [ssr] (ecmascript) <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/index.js [ssr] (ecmascript)");
;
;
;
;
const Styled = __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["default"].div.withConfig({
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
function SubCards(props) {
    console.log('SubCards', props.toc.list);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Styled, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                children: props.toc.label
            }, void 0, false, {
                fileName: "[project]/comps/curriculumViews/SubCards.js",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "cards",
                children: props.toc.list.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "card",
                        style: item.style || {},
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "label",
                                children: [
                                    item.labelPrefix && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "desc",
                                        children: item.desc
                                    }, void 0, false, {
                                        fileName: "[project]/comps/curriculumViews/SubCards.js",
                                        lineNumber: 69,
                                        columnNumber: 15
                                    }, this),
                                    item.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                        className: "cardIcon",
                                        src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["publicPath"])('/' + item.icon),
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Button$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
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
}),
"[externals]/lz-string [external] (lz-string, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("lz-string", () => require("lz-string"));

module.exports = mod;
}),
"[project]/comps/acts/McqAct.module.css [ssr] (css module)", ((__turbopack_context__) => {

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
const api = __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].create({
    baseURL: ("TURBOPACK compile-time value", "http://192.168.0.127:8080/ords/lms"),
    headers: {
        'Content-Type': 'application/json'
    }
});
const apiService = {
    // --- AUTH ---
    login: (data)=>api.post('/v2/user/login', data),
    register: (data)=>api.post('/auth/register', data),
    // --- MCQ ---
    getMcqProgress: (userId, actId)=>api.get(`/mcq/progress/${userId}/${actId}?t=${new Date().getTime()}`),
    saveMcqProgress: (payload)=>api.post('/mcq/progress', payload),
    completeMcq: (payload)=>api.post('/mcq/complete', payload),
    // --- SPELLING (CompleteWord) ---
    getSpellingProgress: (uid, aid)=>api.get(`/completedword/progress/${uid}/${aid}`),
    saveSpellingProgress: (data)=>api.post('/completedword/progress', data),
    completeSpelling: (data)=>api.post('/completedword/complete', data),
    // --- PLAYLIST / ACTIVITY DATA ---
    // Fetches numeric activities from Oracle ORDS
    getActivityData: (id)=>api.get('/activity/data', {
            params: {
                id
            }
        }),
    // Helper to get the correct Image URL without hardcoding IPs
    getIconUrl: (id)=>`${API_BASE}/v1/konzeptes/image/icon/${id}`
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/comps/acts/McqAct.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// comps/acts/McqAct.js
__turbopack_context__.s([
    "default",
    ()=>McqAct
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/comps/acts/McqAct.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/apiService.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
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
    const [questions, setQuestions] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [current, setCurrent] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [score, setScore] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [attempted, setAttempted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('STARTED');
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const total = questions.length;
    const activityId = data?.id || 'mcq_default';
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
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
        const initQuiz = async ()=>{
            const raw = data.questions || [];
            let initialQuestions = normalizeQuestions(raw);
            try {
                // 1. Single clean call to your central service
                const savedState = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].getMcqProgress(currentUserId, activityId);
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
        };
        initQuiz();
    }, [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wrapper,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].container,
            children: !isSummary ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].main,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].title,
                        id: "actTitle",
                        children: data.title || 'Multiple Choice Question'
                    }, void 0, false, {
                        fileName: "[project]/comps/acts/McqAct.js",
                        lineNumber: 438,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        id: "questionTitle",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].small,
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        id: "qwrap",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].qwrap,
                        children: [
                            data.passage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].passageBox,
                                children: data.passage
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/McqAct.js",
                                lineNumber: 449,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].question,
                                dangerouslySetInnerHTML: {
                                    __html: currentQ.qText
                                }
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/McqAct.js",
                                lineNumber: 453,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].options,
                                children: currentQ.options.map((opt, i)=>{
                                    let optionClass = __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].option;
                                    if (currentQ.answered) {
                                        if (i === currentQ.correctIndex) optionClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].correct}`;
                                        else if (i === currentQ.userChoice) optionClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wrong}`;
                                        if (i === currentQ.userChoice) optionClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].selected}`;
                                    }
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: optionClass,
                                        "data-index": i,
                                        onClick: ()=>handleOptionClick(i),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].radio
                                            }, void 0, false, {
                                                fileName: "[project]/comps/acts/McqAct.js",
                                                lineNumber: 478,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].optionLabel,
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
                            currentQ.answered && currentQ.userChoice === currentQ.correctIndex && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                id: "rightMark",
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].mark} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].right}`,
                                children: "✔"
                            }, void 0, false, {
                                fileName: "[project]/comps/acts/McqAct.js",
                                lineNumber: 488,
                                columnNumber: 19
                            }, this),
                            currentQ.answered && currentQ.userChoice !== currentQ.correctIndex && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                id: "wrongMark",
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].mark} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wrong}`,
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].controls,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].score,
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginLeft: 'auto'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].btn} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].primary}`,
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
            }, this) : /* FINAL SUMMARY VIEW */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                id: "finalWrap",
                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].main,
                style: {
                    marginTop: '18px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].title,
                        children: "You have completed this activity."
                    }, void 0, false, {
                        fileName: "[project]/comps/acts/McqAct.js",
                        lineNumber: 537,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        id: "summaryList",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].summary,
                        children: questions.map((q, i)=>{
                            const isCorrect = q.userChoice === q.correctIndex;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].summaryItem,
                                style: {
                                    padding: '10px 0'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '0.9em'
                                        },
                                        children: [
                                            "Your Answer:",
                                            ' ',
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
                                            !isCorrect && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: '12px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].small,
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].btn} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].primary}`,
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/comps/acts/CompleteWordAct.module.css [ssr] (css module)", ((__turbopack_context__) => {

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
"[project]/comps/acts/CompleteWordAct.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/comps/acts/CompleteWordAct.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/apiService.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
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
    const [questions, setQuestions] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [current, setCurrent] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [score, setScore] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [attempted, setAttempted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [userAnswers, setUserAnswers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('STARTED');
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const activityId = data?.id || 'spelling_01';
    // INITIALIZATION
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!data) return;
        const currentUserId = Number(data.user_id || localStorage.getItem('user_id') || 0);
        setUserId(currentUserId);
        const initGame = async ()=>{
            let initialQuestions = [];
            if (data.text) {
                initialQuestions = parseData(data.text);
            } else if (data.questions) {
                initialQuestions = data.questions;
            }
            try {
                // --- Centralized Service Call ---
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].getSpellingProgress(currentUserId, activityId);
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
        };
        initGame();
    }, [
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
            await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].saveSpellingProgress({
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
            await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].completeSpelling({
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wrapper,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].mainCard,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].titleText,
                    children: data.title || ''
                }, void 0, false, {
                    fileName: "[project]/comps/acts/CompleteWordAct.js",
                    lineNumber: 571,
                    columnNumber: 9
                }, this),
                !isSummary ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].gameArea,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wordDisplayContainer,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wordPuzzle,
                                children: currentQ.puzzle.split('_').length > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            children: currentQ.puzzle.split('_')[0]
                                        }, void 0, false, {
                                            fileName: "[project]/comps/acts/CompleteWordAct.js",
                                            lineNumber: 579,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].missingBox,
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            children: currentQ.puzzle.split('_')[1]
                                        }, void 0, false, {
                                            fileName: "[project]/comps/acts/CompleteWordAct.js",
                                            lineNumber: 596,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].optionsContainer,
                            children: currentQ.displayOptions.map((opt, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].optionBtn,
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
                        currentQ.answered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].nextBtn} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].floatNext}`,
                            onClick: nextQuestion,
                            disabled: isSaving,
                            children: isSaving ? 'Saving...' : current + 1 === questions.length ? 'Finish' : 'Next'
                        }, void 0, false, {
                            fileName: "[project]/comps/acts/CompleteWordAct.js",
                            lineNumber: 618,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].gameFooter,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].scoreBadge,
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
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].summaryArea,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].summaryList,
                            children: userAnswers.map((ans, i)=>{
                                const userFormedWord = ans.question.puzzle.replace('_', ans.userSelected);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].summaryItem,
                                    children: ans.isCorrect ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sCorrectNum,
                                                children: [
                                                    i + 1,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/comps/acts/CompleteWordAct.js",
                                                lineNumber: 654,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sCorrectText,
                                                children: userFormedWord
                                            }, void 0, false, {
                                                fileName: "[project]/comps/acts/CompleteWordAct.js",
                                                lineNumber: 655,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sNum,
                                                children: [
                                                    i + 1,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/comps/acts/CompleteWordAct.js",
                                                lineNumber: 661,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sWrongText,
                                                children: userFormedWord
                                            }, void 0, false, {
                                                fileName: "[project]/comps/acts/CompleteWordAct.js",
                                                lineNumber: 662,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sBracket,
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].summaryFooter,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].scoreBadge,
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].nextBtn,
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/comps/acts/WordSearchAct.module.css [ssr] (css module)", ((__turbopack_context__) => {

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
"[project]/comps/acts/WordSearchAct.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// comps/acts/WordSearchAct.js
__turbopack_context__.s([
    "default",
    ()=>WordSearchAct
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/comps/acts/WordSearchAct.module.css [ssr] (css module)");
;
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
    const [grid, setGrid] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [wordsData, setWordsData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [foundWords, setFoundWords] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [foundLines, setFoundLines] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    // Selection State
    const [isSelecting, setIsSelecting] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [startCell, setStartCell] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [currentSelection, setCurrentSelection] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    // Hint State
    const [hintActiveCell, setHintActiveCell] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [hintActiveWord, setHintActiveWord] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    // Initialize Game
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!data) return;
        // Parse Grid
        let parsedGrid = [];
        if (Array.isArray(data.table)) {
            parsedGrid = Array.isArray(data.table[0]) ? data.table : data.table.map((row)=>row.split(''));
        } else if (typeof data.table === 'string') {
            parsedGrid = data.table.replace(/\r/g, '').split('\n').map((r)=>r.split(''));
        }
        setGrid(parsedGrid);
        // Parse Words
        if (data.words) {
            const parsedWords = data.words.map((w)=>({
                    wordStr: w.word.join(''),
                    marker: w.marker
                }));
            setWordsData(parsedWords);
        }
    }, [
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
    const checkWordAndEnd = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(()=>{
        if (!isSelecting || currentSelection.length === 0) return;
        const selectedWord = currentSelection.map((cell)=>grid[cell.r][cell.c]).join('');
        const reverseWord = selectedWord.split('').reverse().join('');
        const targetObj = wordsData.find((w)=>w.wordStr === selectedWord || w.wordStr === reverseWord);
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
            setFoundLines((prev)=>[
                    ...prev,
                    {
                        width: length + 34,
                        angle,
                        midX,
                        midY,
                        color
                    }
                ]);
            setFoundWords((prev)=>[
                    ...prev,
                    wordStr
                ]);
        }
        setIsSelecting(false);
        setStartCell(null);
        setCurrentSelection([]);
    }, [
        currentSelection,
        grid,
        wordsData,
        foundWords,
        isSelecting
    ]);
    // Global Mouse Up
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const handleGlobalUp = ()=>checkWordAndEnd();
        document.addEventListener('mouseup', handleGlobalUp);
        document.addEventListener('touchend', handleGlobalUp);
        return ()=>{
            document.removeEventListener('mouseup', handleGlobalUp);
            document.removeEventListener('touchend', handleGlobalUp);
        };
    }, [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wrapper,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].mainCard,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].header,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].titleText,
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].gameArea,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].gridWrapper,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wordGrid,
                            style: {
                                gridTemplateColumns: `repeat(${cols}, 1fr)`
                            },
                            onTouchStart: handleTouchStart,
                            onTouchMove: handleTouchMove,
                            children: [
                                foundLines.map((line, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].highlightLine,
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
                                        let cellClass = __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cell;
                                        if (isSelected) cellClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].selected}`;
                                        if (isFound) cellClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].found}`;
                                        if (isHintActive) cellClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].hintActive}`;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wordStrip,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wordList,
                        children: wordsData.map((item)=>{
                            const isFound = foundWords.includes(item.wordStr);
                            const isHinting = hintActiveWord === item.wordStr;
                            let itemClass = __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wordItem;
                            if (isFound) itemClass += ` ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wordItemFound}`;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].gameFooter,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].scoreBadge,
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex'
                            },
                            children: [
                                !isVictory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].actionBtn} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].hintBtn}`,
                                    onClick: handleHint,
                                    children: "Hint 💡"
                                }, void 0, false, {
                                    fileName: "[project]/comps/acts/WordSearchAct.js",
                                    lineNumber: 332,
                                    columnNumber: 15
                                }, this),
                                isVictory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].actionBtn} ${__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].nextBtn}`,
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
                isVictory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].victoryToast,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
}),
"[project]/comps/Playlist.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// import React, { useState, useEffect, useRef } from 'react';
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @next/next/no-img-element */
// import styled from 'styled-components';
// import { useRouter } from 'next/router';
// import { usePathname } from 'next/navigation';
// import { loadAsset } from 'utils';
// import DelayLoader from 'comps/DelayLoader';
// import { getDataFromGroupAct } from 'utils/playlistUtils';
// import Svg from 'components/Svg';
// import { Button } from 'base/comps';
// import IconView from './curriculumViews/IconViewMini';
// import PIconView from './curriculumViews/PIconView';
// import SubCards from './curriculumViews/SubCards';
// import { publicPath } from '../utils';
// import LZString from 'lz-string';
// const playlistIconSvgPath =
//   'm21 4c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm12.5 10.75c0-.414-.336-.75-.75-.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75zm0-3.248c0-.414-.336-.75-.75-.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75zm0-3.252c0-.414-.336-.75-.75-.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75z';
// const Styled = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   position: relative;
//   user-select: none;
//   background-color: var(--l2);
//   color: #222;
//   .chapWrap {
//     background-color: var(--l2);
//     &.selected {
//       background-color: var(--h);
//     }
//   }
//   .chap {
//     padding: 5px 5px 5px 10px;
//     display: flex;
//     align-items: center;
//     cursor: pointer;
//   }
//   .chapDisplay {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     margin: 10px 40px;
//     min-height: 600px;
//     .chapName {
//       font-size: 3rem;
//       margin: 40px 0;
//     }
//   }
//   ol {
//     width: 400px;
//     border: 1px solid var(--lightColor);
//     li {
//       padding: 5px 10px;
//       border: 1px solid var(--l);
//       cursor: pointer;
//       display: flex;
//       &.head {
//         color: var(--darkColor2);
//         text-align: center;
//         padding: 10px;
//         font-size: 1.5rem;
//         font-weight: bold;
//       }
//       &.selected {
//         background-color: var(--h2);
//       }
//       .numbering {
//         display: block;
//         min-width: 20px;
//         text-align: right;
//         margin-right: 10px;
//         font-size: 0.8rem;
//         padding-top: 3px;
//       }
//     }
//   }
//   .numWrap {
//     display: flex;
//     flex-wrap: wrap;
//     margin-left: 50px;
//     > div {
//       padding: 5px;
//       margin: 5px;
//       background-color: var(--h);
//       border-radius: 3px;
//       min-width: 40px;
//       text-align: center;
//       &.selected {
//         background-color: var(--h3);
//         color: white;
//       }
//     }
//   }
//   img,
//   .imgPlaceHolder {
//     width: 24px;
//     height: 24px;
//     margin-right: 5px;
//   }
//   .mainPlaceHolder {
//     flex-grow: 1;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     min-height: 95vh;
//   }
//   .placeHolder {
//     font-size: 2rem;
//     font-style: italic;
//     padding: 200px 0 0 100px;
//   }
//   .videoHelp {
//     display: flex;
//     background-color: var(--l2);
//     padding: 10px;
//     font-style: italic;
//     padding-left: 30px;
//     text-decoration: underline;
//     > img {
//       margin-right: 10px;
//     }
//   }
//   .actIFrame {
//     border: none;
//     min-width: 100vw;
//     width: ${(p) => (p.hideTOC ? 'calc(100vw - 80px)' : 'calc(100vw - 490px)')};
//     height: 100vh;
//   }
//   .tags {
//     display: flex;
//   }
//   .tag {
//     margin: 2px 10px;
//     padding: 5px;
//     min-width: 60px;
//     background-color: var(--h2);
//     cursor: pointer;
//     text-align: center;
//     border-radius: 5px;
//   }
//   @media only screen and (max-width: 800px) {
//     ol {
//       position: absolute;
//       left: 0;
//       top: 0;
//     }
//   }
//   @media (min-width: 500px) {
//     .actIFrame {
//       min-width: 500px;
//     }
//   }
// `;
// const splTypes = ['pdf', 'link', 'pLink', 'mvid', 'youtube'];
// export default function Playlist(props) {
//   const router = useRouter();
//   const pathname = usePathname();
//   // 1. Extract the ID from the URL (e.g., '10' from /p/10)
//   const playlistId = router.query.slug ? router.query.slug[0] : null;
//   let toggleChaps = Array(props.toc.list.length).fill(true);
//   if (props.toc.collapseRest) {
//     toggleChaps = toggleChaps.map((item, i) => i === 0);
//   }
//   const [state, setState] = useState({
//     active: props.toc.loadFirstAct
//       ? Array.isArray(props.toc.list[0].data)
//         ? getDataFromGroupAct(props.toc.list[0].list[0], 0)
//         : props.toc.list[0].list[0]
//       : null,
//     activeNum: 1,
//     activeChap: props.toc.loadFirstAct ? 0 : -1,
//     hideTOC: props.toc.cardView ? true : false,
//     toggleChaps,
//   });
//   const stateRef = useRef(state);
//   // Analytics logging
//   const localTypes = [
//     'mcq',
//     'classifySentence',
//     'matchByDragDrop',
//     'informationProcessing',
//     'sequence',
//     'dragAndDrop',
//     'completeWord',
//     'wordsearch',
//   ];
//   // (Optional: You can re-enable your analytics logic here if needed)
//   useEffect(() => {
//     stateRef.current = state;
//   }, [state]);
//   function onSelect(item, activeChap, i) {
//     if (splTypes.indexOf(item.type) !== -1) {
//       // Logic for special types if needed
//     }
//     if (item.type === 'link' || item.type === 'youtube') {
//       window.open(loadAsset(item.src), 'child');
//     }
//     if (item.type === 'pLink') {
//       window.open(`https://pschool.app/p/${item.src}`, 'child');
//     }
//     if (item.onlyBigScreen) {
//       item.data.onlyBigScreen = true;
//     }
//     const s = stateRef.current || state;
//     const hideTOC = s.screenWidth < 800 ? true : s.hideTOC;
//     setState((prev) => ({
//       ...prev,
//       active: item,
//       activeChap,
//       activeNum: i,
//       hideTOC,
//     }));
//   }
//   function numberSelect(item, activeChap, i, e) {
//     if (e) {
//       e.stopPropagation();
//     }
//     let data = item.commonData || {};
//     let subData = item.data[i];
//     if (subData.refs) {
//       let refId = subData.refs;
//       if (refId.indexOf('~') !== -1) {
//         const refIndex = +refId.substr(refId.indexOf('~') + 1);
//         refId = refId.substr(0, refId.indexOf('~'));
//         subData = props.toc.defs[refId][refIndex];
//       } else {
//         subData = props.toc.defs[refId];
//       }
//     }
//     if (typeof subData === 'string') {
//       data = { ...data, text: subData };
//     } else if (Array.isArray(subData)) {
//       data = { ...data, arr: subData };
//     } else {
//       data = { ...data, ...subData };
//     }
//     onSelect({ ...item, data }, activeChap, i + 1);
//   }
//   // Attach message handler
//   useEffect(() => {
//     const handler = (msg) => {
//       if (typeof msg.data !== 'string') return;
//       let msgData;
//       try {
//         msgData = JSON.parse(msg.data);
//       } catch (e) {
//         return;
//       }
//       if (!msgData || !msgData.done) return;
//       const s = stateRef.current;
//       if (!s || !s.active) return;
//       const chapList =
//         props.toc.list[s.activeChap] && props.toc.list[s.activeChap].list;
//       if (!chapList) return;
//       const index = chapList.findIndex((it) => it.id === s.active.id);
//       if (index === -1) return;
//       const currentItem = chapList[index];
//       if (Array.isArray(currentItem.data)) {
//         if (s.activeNum < currentItem.data.length) {
//           numberSelect(currentItem, s.activeChap, s.activeNum);
//           return;
//         } else {
//           if (props.toc.list.length > s.activeChap + 1) {
//             setState((prev) => ({
//               ...prev,
//               active: { type: 'chapter' },
//               activeChap: prev.activeChap + 1,
//             }));
//           } else {
//             setState((prev) => ({ ...prev, active: null }));
//           }
//         }
//       }
//       if (index + 1 < chapList.length) {
//         const nextItem = chapList[index + 1];
//         if (Array.isArray(nextItem.data)) {
//           numberSelect(nextItem, s.activeChap, 0);
//         } else {
//           onSelect(nextItem, s.activeChap);
//         }
//       } else {
//         if (props.toc.list.length > s.activeChap + 1) {
//           setState((prev) => ({
//             ...prev,
//             active: { type: 'chapter' },
//             activeChap: prev.activeChap + 1,
//           }));
//         } else {
//           setState((prev) => ({ ...prev, active: null }));
//         }
//       }
//     };
//     window.addEventListener('message', handler);
//     return () => window.removeEventListener('message', handler);
//   }, []);
//   // set screen width once on mount
//   useEffect(() => {
//     setState((prev) => ({ ...prev, screenWidth: window.innerWidth }));
//   }, []);
//   return (
//     // <Styled hideTOC={state.hideTOC}>
//     <Styled $hideTOC={state.hideTOC}>
//       {props.toc.type === 'curriculumIcon' && <IconView data={props.toc} />}
//       {(!props.toc.type || props.toc.type === 'nested') && !state.hideTOC && (
//         <div style={{ maxHeight: '100vh', overflow: 'auto' }}>
//           <ol>
//             <li
//               className="head"
//               style={{ display: 'flex', alignItems: 'center' }}
//             >
//               <Svg
//                 id="minimize"
//                 onClick={() => setState({ ...state, hideTOC: true })}
//               />
//               <div>{props.toc.label}</div>
//             </li>
//             {props.toc.list.map((chap, i) => (
//               <div
//                 key={chap.id || i}
//                 className={`chapWrap ${
//                   !props.toc.collapseRest &&
//                   props.toc.list.length > 1 &&
//                   state.activeChap === i
//                     ? 'selected'
//                     : ''
//                 }`}
//               >
//                 {props.toc.list.length > 1 && (
//                   <div className="chap">
//                     <Svg
//                       id="caretDown"
//                       size="18"
//                       color="var(--darkColor2)"
//                       style={
//                         state.toggleChaps[i]
//                           ? {}
//                           : { transform: 'rotate(-90deg)' }
//                       }
//                       onClick={() => {
//                         let toggleChaps = [...state.toggleChaps];
//                         if (props.toc.collapseRest) {
//                           toggleChaps = toggleChaps.map((item, j) =>
//                             i === j ? !toggleChaps[i] : false
//                           );
//                         } else {
//                           toggleChaps[i] = !toggleChaps[i];
//                         }
//                         setState({ ...state, toggleChaps });
//                       }}
//                     />
//                     <div
//                       onClick={() => {
//                         let toggleChaps = [...state.toggleChaps];
//                         if (props.toc.collapseRest) {
//                           toggleChaps = toggleChaps.map(() => false);
//                         }
//                         toggleChaps[i] = true;
//                         setState({
//                           ...state,
//                           active: Array.isArray(props.toc.list[i].list[0].data)
//                             ? getDataFromGroupAct(props.toc.list[i].list[0], 0)
//                             : props.toc.list[i].list[0],
//                           activeChap: i,
//                           toggleChaps,
//                         });
//                       }}
//                     >
//                       {i + 1}. {chap.label}{' '}
//                       {chap.altLabel ? `(${chap.altLabel})` : ''}
//                     </div>
//                   </div>
//                 )}
//                 {state.toggleChaps[i] &&
//                   chap.list.map((item, j) => {
//                     if (!Array.isArray(item.data)) {
//                       return (
//                         <li
//                           key={item.id}
//                           className={
//                             state.active &&
//                             state.active.id === item.id &&
//                             state.activeChap === i
//                               ? 'selected'
//                               : ''
//                           }
//                           onClick={() => onSelect(item, i)}
//                           style={{
//                             backgroundColor:
//                               item.type === 'chapter' ? 'pink' : '',
//                           }}
//                         >
//                           {getIcon(item.type)}
//                           <span className="numbering"> {j + 1}. </span>
//                           <span className="item">{item.label}</span>
//                         </li>
//                       );
//                     } else {
//                       return (
//                         <li
//                           key={item.id}
//                           onClick={(e) => numberSelect(item, i, 0, e)}
//                           className={
//                             state.active &&
//                             state.active.id === item.id &&
//                             state.activeChap === i
//                               ? 'selected'
//                               : ''
//                           }
//                         >
//                           <div>
//                             <div style={{ display: 'flex' }}>
//                               {getIcon(item.type)}
//                               <span className="numbering"> {j + 1}. </span>
//                               {item.label}
//                             </div>
//                             {Array.isArray(item.data) && (
//                               <div className="numWrap">
//                                 {item.data.map((data, k) => (
//                                   <div
//                                     key={k}
//                                     className={
//                                       state.active &&
//                                       state.active.id === item.id &&
//                                       state.activeNum === k + 1
//                                         ? 'selected'
//                                         : ''
//                                     }
//                                     onClick={(e) => numberSelect(item, i, k, e)}
//                                   >
//                                     {k + 1}
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         </li>
//                       );
//                     }
//                   })}
//               </div>
//             ))}
//             {props.toc.videoHelp && (
//               <div className="videoHelp">
//                 <img
//                   src={publicPath('/img/icons/youtubeIcon.png')}
//                   alt="YouTube"
//                 />{' '}
//                 <div>Video Help</div>
//               </div>
//             )}
//           </ol>
//         </div>
//       )}
//       {props.toc.type === 'curriculumList' && (
//         <PIconView data={props.toc} appType="small" />
//       )}
//       {state.hideTOC && (
//         <div style={{ marginTop: 50 }}>
//           <Svg
//             size="32"
//             d={playlistIconSvgPath}
//             color="var(--d)"
//             onClick={() => setState({ ...state, hideTOC: false })}
//           />
//         </div>
//       )}
//       {(!props.toc.type || props.toc.type === 'nested') && (
//         <div className="mainPlaceHolder">
//           {state.active && state.active.type === 'chapter' && (
//             <div className="chapDisplay">
//               <div style={{ textDecoration: 'underline' }}>
//                 Chapter {state.activeChap + 1}{' '}
//               </div>
//               <div className="chapName">
//                 {props.toc.list[state.activeChap].label}
//               </div>
//               <div style={{ marginTop: 40 }}>
//                 <Button
//                   primary
//                   onClick={() => {
//                     const firstItem = props.toc.list[state.activeChap].list[0];
//                     if (Array.isArray(firstItem.data)) {
//                       numberSelect(firstItem, state.activeChap, 0);
//                     } else {
//                       onSelect(firstItem, state.activeChap);
//                     }
//                   }}
//                 >
//                   Continue
//                 </Button>
//               </div>
//             </div>
//           )}
//           {!props.toc.cardView && !state.active && (
//             <div className="placeHolder">
//               Click on the resource on the left to load the content here.
//             </div>
//           )}
//           {props.toc.cardView && !state.active && (
//             <SubCards
//               toc={props.toc}
//               onSelect={(index) => {
//                 let toggleChaps = state.toggleChaps;
//                 if (props.toc.collapseRest) {
//                   toggleChaps = toggleChaps.map((d, i) => i === index);
//                 }
//                 setState({
//                   ...state,
//                   active: Array.isArray(props.toc.list[index].list[0].data)
//                     ? getDataFromGroupAct(props.toc.list[index].list[0], 0)
//                     : props.toc.list[index].list[0],
//                   activeChap: index,
//                   hideTOC: false,
//                   toggleChaps,
//                 });
//               }}
//             />
//           )}
//           {state.active && state.active.type !== 'chapter' && (
//             <DelayLoader lazyLoad data={state.active}>
//               {displayResource(
//                 state.active,
//                 () => setState({ ...state, active: null }),
//                 null,
//                 // 2. PASS THE PLAYLIST ID TO THE HELPER FUNCTION
//                 getCategoryBackground(props.toc.label, playlistId)
//               )}
//             </DelayLoader>
//           )}
//         </div>
//       )}
//     </Styled>
//   );
// }
// function getIcon(type) {
//   switch (type) {
//     case 'pdf':
//       return <img src={publicPath('/img/icons/pdfIcon.png')} alt="PDF" />;
//     case 'link':
//       return <img src={publicPath('/img/icons/linkIcon.png')} alt="Link" />;
//     case 'pLink':
//       return <img src={publicPath('/img/icons/icon32.png')} alt="Link" />;
//     case 'mvid':
//       return <img src={publicPath('/img/icons/videoIcon.png')} alt="Video" />;
//     case 'youtube':
//       return (
//         <img src={publicPath('/img/icons/youtubeIcon.png')} alt="YouTube" />
//       );
//     default:
//       return <div className="imgPlaceHolder" />;
//   }
// }
// function displayResource(item, onClose, onChapterNext, bgImage) {
//   // 3. HANDLE API BACKGROUNDS (Check if bgImage is a URL)
//   // If it starts with 'http', use it as-is. Otherwise, treat as local file.
//   const isApiBg = bgImage && bgImage.startsWith('http');
//   const bgUrl = isApiBg ? bgImage : publicPath('/bg-images/' + bgImage);
//   switch (item.type) {
//     case 'pdf': {
//       let src = item.src;
//       if (src.indexOf('.') === -1) src += '.pdf';
//       return <iframe className="actIFrame" src={loadAsset(src)} />;
//     }
//     case 'mvid': {
//       let video = item.src;
//       let payload =
//         typeof video === 'string'
//           ? { src: video, width: 360, height: 600 }
//           : { src: video.file, width: video.width, height: video.height };
//       if (payload.src.indexOf('.') === -1) payload.src += '.mp4';
//       return (
//         <iframe
//           className="actIFrame"
//           src="/lmsLearning/acts/video"
//           data-payload={JSON.stringify(payload)}
//         />
//       );
//     }
//     case 'link':
//     case 'youtube':
//     case 'pLink':
//       return null;
//     default: {
//       let style = { border: 'none' };
//       const localTypes = [
//         'mcq',
//         'classifySentence',
//         'matchByDragDrop',
//         'informationProcessing',
//         'sequence',
//         'dragAndDrop',
//         'wordsearch',
//         'completeWord',
//       ];
//       const isLocal = localTypes.includes(item.type);
//       if (item.data.bgData) {
//         if (item.data.bgData.imgWidth) style.width = item.data.bgData.imgWidth;
//         if (item.data.bgData.imgHeight)
//           style.height = item.data.bgData.imgHeight;
//       } else {
//         style.width = '100%';
//         style.height = '100%';
//       }
//       if (!isLocal) {
//         style.mixBlendMode = 'multiply';
//       }
//       let iframeSrc;
//       let str = JSON.stringify(item.data);
//       if (item.type === 'mcq') {
//         const payload = { id: item.id, ...item.data };
//         const compressed = LZString.compressToEncodedURIComponent(
//           JSON.stringify(payload)
//         );
//         iframeSrc = `/lms-system/acts/mcq/index.html?c=${compressed}`;
//       } else if (item.type === 'classifySentence') {
//         const payload = { id: item.id, ...item.data };
//         const compressed = LZString.compressToEncodedURIComponent(
//           JSON.stringify(payload)
//         );
//         iframeSrc = `/lms-system/acts/classifySentence/index.html?c=${compressed}`;
//       } else if (localTypes.includes(item.type)) {
//         iframeSrc = `/lms-system/acts/${item.type}/index.html?payload=${encodeURIComponent(str)}`;
//       } else {
//         iframeSrc = `https://pschool.app/acts/${item.type}?payload=${str}`;
//       }
//       return (
//         <div
//           style={{
//             backgroundImage: `url(${bgUrl})`, // UPDATED: Use the resolved bgUrl
//             backgroundSize: 'contain',
//             backgroundRepeat: 'no-repeat',
//             backgroundPosition: 'center',
//             width: '100%',
//             height: '100%',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             backgroundColor: 'transparent',
//           }}
//         >
//           {/* <iframe
//             className="actIFrame"
//             style={style}
//             sandbox="allow-scripts allow-same-origin allow-forms"
//             referrerPolicy="no-referrer"
//             allowTransparency="true"
//             src={iframeSrc}
//             onLoad={(e) => {
//               if (isLocal) {
//                 try {
//                   const doc =
//                     e.target.contentDocument || e.target.contentWindow.document;
//                   if (doc) doc.body.style.backgroundColor = 'transparent';
//                 } catch (err) {}
//               }
//             }}
//           /> */}
//           <iframe
//             className="actIFrame"
//             style={style}
//             sandbox="allow-scripts allow-same-origin allow-forms"
//             referrerPolicy="no-referrer"
//             src={iframeSrc}
//             onLoad={(e) => {
//               if (isLocal) {
//                 try {
//                   const doc =
//                     e.target.contentDocument || e.target.contentWindow.document;
//                   if (doc) doc.body.style.backgroundColor = 'transparent';
//                 } catch {}
//               }
//             }}
//           />
//         </div>
//       );
//     }
//   }
// }
// // 4. UPDATED BACKGROUND HELPER
// function getCategoryBackground(label, id) {
//   // A: If we have a numeric ID, use the API
//   if (id && !isNaN(id)) {
//     return `http://192.168.0.127:8080/ords/lms/v1/konzeptes/image/bg/${id}`;
//   }
//   // B: Fallback to static Logic if ID is missing (or text-based slug)
//   if (!label) return 'bg30.jpg';
//   const l = label.toLowerCase();
//   if (l.includes('composition')) return 'bg25.jpg';
//   if (l.includes('spelling')) return 'bg30.jpg';
//   if (l.includes('grammar')) return 'bg32.jpg';
//   if (l.includes('vocabulary')) return 'bg33.jpg';
//   if (l.includes('sentence')) return 'sentence.jpg';
//   if (l.includes('idiom')) return 'idiom.jpg';
//   if (l.includes('word building') || l.includes('wordbuilding'))
//     return 'bg31.jpg';
//   if (l.includes('word search') || l.includes('wordsearch'))
//     return 'wordsearch.jpg';
//   if (l.includes('listening')) return 'bg24.jpg';
//   if (l.includes('guided composition')) return 'bg25.jpg';
//   if (l.includes('comprehension')) return 'bg22.jpg';
//   return 'bg30.jpg';
// }
__turbopack_context__.s([
    "default",
    ()=>Playlist
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
/* eslint-disable react-hooks/exhaustive-deps */ /* eslint-disable @next/next/no-img-element */ var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-components [external] (styled-components, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/index.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$DelayLoader$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/DelayLoader.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$playlistUtils$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/playlistUtils.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Svg.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/base/comps/index.js [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Button$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/base/comps/Button.js [ssr] (ecmascript) <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$IconViewMini$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/curriculumViews/IconViewMini.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$PIconView$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/curriculumViews/PIconView.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$SubCards$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/curriculumViews/SubCards.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$lz$2d$string__$5b$external$5d$__$28$lz$2d$string$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/lz-string [external] (lz-string, cjs)"); // Still needed for the older iframes until we convert them all
// --- IMPORT YOUR NEW NATIVE REACT ACTIVITIES HERE ---
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/acts/McqAct.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/acts/CompleteWordAct.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/acts/WordSearchAct.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
// import ClassifySentenceAct from './acts/ClassifySentenceAct'; // Uncomment when built
// import MatchByDragDropAct from './acts/MatchByDragDropAct';   // Uncomment when built
const playlistIconSvgPath = 'm21 4c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm12.5 10.75c0-.414-.336-.75-.75-.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75zm0-3.248c0-.414-.336-.75-.75-.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75zm0-3.252c0-.414-.336-.75-.75-.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75z';
const Styled = __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["default"].div.withConfig({
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
const splTypes = [
    'pdf',
    'link',
    'pLink',
    'mvid',
    'youtube'
];
function Playlist(props) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const playlistId = router.query.slug ? router.query.slug[0] : null;
    let toggleChaps = Array(props.toc.list.length).fill(true);
    if (props.toc.collapseRest) {
        toggleChaps = toggleChaps.map((item, i)=>i === 0);
    }
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        active: props.toc.loadFirstAct ? Array.isArray(props.toc.list[0].data) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$playlistUtils$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getDataFromGroupAct"])(props.toc.list[0].list[0], 0) : props.toc.list[0].list[0] : null,
        activeNum: 1,
        activeChap: props.toc.loadFirstAct ? 0 : -1,
        hideTOC: props.toc.cardView ? true : false,
        toggleChaps
    });
    const stateRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(state);
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
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        stateRef.current = state;
    }, [
        state
    ]);
    function onSelect(item, activeChap, i) {
        if (splTypes.indexOf(item.type) !== -1) {}
        if (item.type === 'link' || item.type === 'youtube') {
            window.open((0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["loadAsset"])(item.src), 'child');
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
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const handler = (msg)=>{
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
            const index = chapList.findIndex((it)=>it.id === s.active.id);
            if (index === -1) return;
            const currentItem = chapList[index];
            if (Array.isArray(currentItem.data)) {
                if (s.activeNum < currentItem.data.length) {
                    numberSelect(currentItem, s.activeChap, s.activeNum);
                    return;
                } else {
                    if (props.toc.list.length > s.activeChap + 1) {
                        setState((prev)=>({
                                ...prev,
                                active: {
                                    type: 'chapter'
                                },
                                activeChap: prev.activeChap + 1
                            }));
                    } else {
                        setState((prev)=>({
                                ...prev,
                                active: null
                            }));
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
                    setState((prev)=>({
                            ...prev,
                            active: {
                                type: 'chapter'
                            },
                            activeChap: prev.activeChap + 1
                        }));
                } else {
                    setState((prev)=>({
                            ...prev,
                            active: null
                        }));
                }
            }
        };
        window.addEventListener('message', handler);
        return ()=>window.removeEventListener('message', handler);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setState((prev)=>({
                ...prev,
                screenWidth: window.innerWidth
            }));
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Styled, {
        $hideTOC: state.hideTOC,
        children: [
            props.toc.type === 'curriculumIcon' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$IconViewMini$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                data: props.toc
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 1097,
                columnNumber: 47
            }, this),
            (!props.toc.type || props.toc.type === 'nested') && !state.hideTOC && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    maxHeight: '100vh',
                    overflow: 'auto'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ol", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                            className: "head",
                            style: {
                                display: 'flex',
                                alignItems: 'center'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    id: "minimize",
                                    onClick: ()=>setState({
                                            ...state,
                                            hideTOC: true
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/comps/Playlist.js",
                                    lineNumber: 1105,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: props.toc.label
                                }, void 0, false, {
                                    fileName: "[project]/comps/Playlist.js",
                                    lineNumber: 1109,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/comps/Playlist.js",
                            lineNumber: 1101,
                            columnNumber: 13
                        }, this),
                        props.toc.list.map((chap, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: `chapWrap ${!props.toc.collapseRest && props.toc.list.length > 1 && state.activeChap === i ? 'selected' : ''}`,
                                children: [
                                    props.toc.list.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "chap",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                                                lineNumber: 1124,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                        active: Array.isArray(props.toc.list[i].list[0].data) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$playlistUtils$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getDataFromGroupAct"])(props.toc.list[i].list[0], 0) : props.toc.list[i].list[0],
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
                                                lineNumber: 1145,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/comps/Playlist.js",
                                        lineNumber: 1123,
                                        columnNumber: 19
                                    }, this),
                                    state.toggleChaps[i] && chap.list.map((item, j)=>{
                                        if (!Array.isArray(item.data)) {
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                className: state.active && state.active.id === item.id && state.activeChap === i ? 'selected' : '',
                                                onClick: ()=>onSelect(item, i),
                                                style: {
                                                    backgroundColor: item.type === 'chapter' ? 'pink' : ''
                                                },
                                                children: [
                                                    getIcon(item.type),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "numbering",
                                                        children: [
                                                            " ",
                                                            j + 1,
                                                            ". "
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/comps/Playlist.js",
                                                        lineNumber: 1188,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "item",
                                                        children: item.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/comps/Playlist.js",
                                                        lineNumber: 1189,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, item.id, true, {
                                                fileName: "[project]/comps/Playlist.js",
                                                lineNumber: 1172,
                                                columnNumber: 25
                                            }, this);
                                        } else {
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                onClick: (e)=>numberSelect(item, i, 0, e),
                                                className: state.active && state.active.id === item.id && state.activeChap === i ? 'selected' : '',
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'flex'
                                                            },
                                                            children: [
                                                                getIcon(item.type),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "numbering",
                                                                    children: [
                                                                        " ",
                                                                        j + 1,
                                                                        ". "
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/comps/Playlist.js",
                                                                    lineNumber: 1208,
                                                                    columnNumber: 31
                                                                }, this),
                                                                item.label
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/comps/Playlist.js",
                                                            lineNumber: 1206,
                                                            columnNumber: 29
                                                        }, this),
                                                        Array.isArray(item.data) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "numWrap",
                                                            children: item.data.map((data, k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: state.active && state.active.id === item.id && state.activeNum === k + 1 ? 'selected' : '',
                                                                    onClick: (e)=>numberSelect(item, i, k, e),
                                                                    children: k + 1
                                                                }, k, false, {
                                                                    fileName: "[project]/comps/Playlist.js",
                                                                    lineNumber: 1214,
                                                                    columnNumber: 35
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/comps/Playlist.js",
                                                            lineNumber: 1212,
                                                            columnNumber: 31
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/comps/Playlist.js",
                                                    lineNumber: 1205,
                                                    columnNumber: 27
                                                }, this)
                                            }, item.id, false, {
                                                fileName: "[project]/comps/Playlist.js",
                                                lineNumber: 1194,
                                                columnNumber: 25
                                            }, this);
                                        }
                                    })
                                ]
                            }, chap.id || i, true, {
                                fileName: "[project]/comps/Playlist.js",
                                lineNumber: 1112,
                                columnNumber: 15
                            }, this)),
                        props.toc.videoHelp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "videoHelp",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["publicPath"])('/img/icons/youtubeIcon.png'),
                                    alt: "YouTube"
                                }, void 0, false, {
                                    fileName: "[project]/comps/Playlist.js",
                                    lineNumber: 1240,
                                    columnNumber: 17
                                }, this),
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: "Video Help"
                                }, void 0, false, {
                                    fileName: "[project]/comps/Playlist.js",
                                    lineNumber: 1244,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/comps/Playlist.js",
                            lineNumber: 1239,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 1100,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 1099,
                columnNumber: 9
            }, this),
            props.toc.type === 'curriculumList' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$PIconView$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                data: props.toc,
                appType: "small"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 1251,
                columnNumber: 9
            }, this),
            state.hideTOC && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 50
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Svg$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    size: "32",
                    d: playlistIconSvgPath,
                    color: "var(--d)",
                    onClick: ()=>setState({
                            ...state,
                            hideTOC: false
                        })
                }, void 0, false, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 1255,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 1254,
                columnNumber: 9
            }, this),
            (!props.toc.type || props.toc.type === 'nested') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mainPlaceHolder",
                children: [
                    state.active && state.active.type === 'chapter' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "chapDisplay",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                lineNumber: 1267,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "chapName",
                                children: props.toc.list[state.activeChap].label
                            }, void 0, false, {
                                fileName: "[project]/comps/Playlist.js",
                                lineNumber: 1270,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 40
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$base$2f$comps$2f$Button$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
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
                                    lineNumber: 1274,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/comps/Playlist.js",
                                lineNumber: 1273,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/comps/Playlist.js",
                        lineNumber: 1266,
                        columnNumber: 13
                    }, this),
                    !props.toc.cardView && !state.active && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "placeHolder",
                        children: "Click on the resource on the left to load the content here."
                    }, void 0, false, {
                        fileName: "[project]/comps/Playlist.js",
                        lineNumber: 1291,
                        columnNumber: 13
                    }, this),
                    props.toc.cardView && !state.active && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$curriculumViews$2f$SubCards$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        toc: props.toc,
                        onSelect: (index)=>{
                            let toggleChaps = state.toggleChaps;
                            if (props.toc.collapseRest) {
                                toggleChaps = toggleChaps.map((d, i)=>i === index);
                            }
                            setState({
                                ...state,
                                active: Array.isArray(props.toc.list[index].list[0].data) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$playlistUtils$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getDataFromGroupAct"])(props.toc.list[index].list[0], 0) : props.toc.list[index].list[0],
                                activeChap: index,
                                hideTOC: false,
                                toggleChaps
                            });
                        }
                    }, void 0, false, {
                        fileName: "[project]/comps/Playlist.js",
                        lineNumber: 1296,
                        columnNumber: 13
                    }, this),
                    state.active && state.active.type !== 'chapter' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$DelayLoader$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        lazyLoad: true,
                        data: state.active,
                        children: displayResource(state.active, ()=>setState({
                                ...state,
                                active: null
                            }), null, getCategoryBackground(props.toc.label, playlistId))
                    }, void 0, false, {
                        fileName: "[project]/comps/Playlist.js",
                        lineNumber: 1317,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 1264,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/comps/Playlist.js",
        lineNumber: 1096,
        columnNumber: 5
    }, this);
}
function getIcon(type) {
    switch(type){
        case 'pdf':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["publicPath"])('/img/icons/pdfIcon.png'),
                alt: "PDF"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 1335,
                columnNumber: 14
            }, this);
        case 'link':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["publicPath"])('/img/icons/linkIcon.png'),
                alt: "Link"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 1337,
                columnNumber: 14
            }, this);
        case 'pLink':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["publicPath"])('/img/icons/icon32.png'),
                alt: "Link"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 1339,
                columnNumber: 14
            }, this);
        case 'mvid':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["publicPath"])('/img/icons/videoIcon.png'),
                alt: "Video"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 1341,
                columnNumber: 14
            }, this);
        case 'youtube':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["publicPath"])('/img/icons/youtubeIcon.png'),
                alt: "YouTube"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 1344,
                columnNumber: 9
            }, this);
        default:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "imgPlaceHolder"
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 1347,
                columnNumber: 14
            }, this);
    }
}
// -------------------------------------------------------------
// NEW displayResource FUNCTION (Handling native React & Fallbacks)
// -------------------------------------------------------------
function displayResource(item, onClose, onChapterNext, bgImage) {
    const isApiBg = bgImage && bgImage.startsWith('http');
    const bgUrl = isApiBg ? bgImage : (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["publicPath"])('/bg-images/' + bgImage);
    // 1. Handle Legacy iframe types (PDF, Videos)
    switch(item.type){
        case 'pdf':
            {
                let src = item.src;
                if (src.indexOf('.') === -1) src += '.pdf';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("iframe", {
                    className: "actIFrame",
                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["loadAsset"])(src)
                }, void 0, false, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 1363,
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
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("iframe", {
                    className: "actIFrame",
                    src: "/lmsLearning/acts/video",
                    "data-payload": JSON.stringify(payload)
                }, void 0, false, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 1373,
                    columnNumber: 9
                }, this);
            }
        case 'link':
        case 'youtube':
        case 'pLink':
            return null;
    }
    // 2. Setup Container for Activities
    const payload = {
        id: item.id,
        bgImage: bgUrl,
        ...item.data
    }; // Passing bgUrl in payload just in case
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
    // 3. Render Native React components OR Fallback to iframe
    switch(item.type){
        case 'mcq':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: containerStyle,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$McqAct$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    data: payload
                }, void 0, false, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 1406,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 1405,
                columnNumber: 9
            }, this);
        case 'completeWord':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: containerStyle,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$CompleteWordAct$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    data: payload
                }, void 0, false, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 1412,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 1411,
                columnNumber: 9
            }, this);
        case 'wordsearch':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: containerStyle,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$acts$2f$WordSearchAct$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    data: payload
                }, void 0, false, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 1418,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/comps/Playlist.js",
                lineNumber: 1417,
                columnNumber: 9
            }, this);
            //TURBOPACK unreachable
            ;
        // Uncomment these as you build them!
        // case 'classifySentence':
        //   return (
        //     <div style={containerStyle}>
        //       <ClassifySentenceAct data={payload} />
        //     </div>
        //   );
        // case 'matchByDragDrop':
        //   return (
        //     <div style={containerStyle}>
        //       <MatchByDragDropAct data={payload} />
        //     </div>
        //   );
        default:
            {
                // FALLBACK: For activities we haven't converted to React yet, keep using the iframe
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
                    const compressed = __TURBOPACK__imported__module__$5b$externals$5d2f$lz$2d$string__$5b$external$5d$__$28$lz$2d$string$2c$__cjs$29$__["default"].compressToEncodedURIComponent(JSON.stringify(payloadData));
                    iframeSrc = `/lms-system/acts/classifySentence/index.html?c=${compressed}`;
                } else if (isLocal) {
                    iframeSrc = `/lms-system/acts/${item.type}/index.html?payload=${encodeURIComponent(str)}`;
                } else {
                    iframeSrc = `https://pschool.app/acts/${item.type}?payload=${str}`;
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: containerStyle,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("iframe", {
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
                        lineNumber: 1466,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/comps/Playlist.js",
                    lineNumber: 1465,
                    columnNumber: 9
                }, this);
            }
    }
}
function getCategoryBackground(label, id) {
    if (id && !isNaN(id)) {
        return `http://192.168.0.127:8080/ords/lms/v1/konzeptes/image/bg/${id}`;
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/p/[...slug].js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
//         // Safety Check: Ensure structure
//         if (!data.type) {
//           data = {
//             ...data,
//             list: [
//               { id: 'chap-1', label: 'Default Chapter', list: data.list || [] },
//             ],
//           };
//         }
//         // 🟢 FIX: Force the first activity to open automatically
//         data.loadFirstAct = true;
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
// // --- LOAD FUNCTION ---
// export const loadPlaylist = async (id) => {
//   try {
//     // 1. IF ID IS NUMERIC -> CALL API
//     if (!isNaN(id)) {
//       const res = await fetch(
//         `http://192.168.0.127:8080/ords/lms/activity/data?id=${id}`
//       );
//       if (!res.ok) throw new Error('API Data not found');
//       const json = await res.json();
//       // SCENARIO 1: Direct Object (Matches your API)
//       if (json.id || json.list) {
//         return json;
//       }
//       // SCENARIO 2: ORDS Wrapper (Fallback)
//       if (json.items && json.items.length > 0) {
//         const item = json.items[0];
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
//     // 2. IF ID IS STRING -> CALL STATIC FILE
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
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$Playlist$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/Playlist.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$OnlyBigScreen$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/OnlyBigScreen.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$DelayLoader$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/DelayLoader.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$UserDropdown$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/UserDropdown.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/apiService.js [ssr] (ecmascript)"); // Import the central service
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$Playlist$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$Playlist$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
function PlaylistPage(props) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        loading: true,
        toc: null,
        error: false
    });
    const handleBack = ()=>{
        router.push('/home');
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const fetchData = async (slugArray)=>{
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
                // Force the first activity to open automatically
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
        };
        if (router.isReady && router.query.slug) {
            fetchData(router.query.slug);
        }
    }, [
        router.isReady,
        router.query.slug
    ]);
    if (state.loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: "Loading..."
    }, void 0, false, {
        fileName: "[project]/pages/p/[...slug].js",
        lineNumber: 190,
        columnNumber: 29
    }, this);
    if (state.error) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: "Activity not found."
    }, void 0, false, {
        fileName: "[project]/pages/p/[...slug].js",
        lineNumber: 191,
        columnNumber: 27
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            position: 'relative',
            minHeight: '100vh'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$UserDropdown$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/p/[...slug].js",
                lineNumber: 195,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
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
                lineNumber: 197,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$DelayLoader$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                data: state.toc,
                lazyLoad: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$OnlyBigScreen$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    minSize: 700,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$Playlist$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        toc: state.toc
                    }, void 0, false, {
                        fileName: "[project]/pages/p/[...slug].js",
                        lineNumber: 217,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/p/[...slug].js",
                    lineNumber: 216,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/p/[...slug].js",
                lineNumber: 215,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/p/[...slug].js",
        lineNumber: 194,
        columnNumber: 5
    }, this);
}
const loadPlaylist = async (id)=>{
    try {
        // 1. IF ID IS NUMERIC -> USE CENTRAL API SERVICE
        if (!isNaN(id)) {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].getActivityData(id);
            const json = response.data; // Axios auto-parses JSON
            // SCENARIO 1: Direct Object
            if (json.id || json.list) {
                return json;
            }
            // SCENARIO 2: ORDS Wrapper Fallback
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
        // (Note: We keep 'fetch' here because these are local static assets in /public, not API calls)
        const getBasePath = ()=>{
            if ("TURBOPACK compile-time truthy", 1) return '';
            //TURBOPACK unreachable
            ;
        };
        const basePath = getBasePath();
        const res = await fetch(`${basePath}/json/${id}.pschool`);
        if (!res.ok) throw new Error('JSON file not found');
        return await res.json();
    } catch (e) {
        throw e;
    }
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dc662dc0._.js.map