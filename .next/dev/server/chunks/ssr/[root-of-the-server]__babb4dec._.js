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
"[project]/comps/curriculumViews/IconViewMini.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-components [external] (styled-components, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/index.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/apiService.js [ssr] (ecmascript)"); // Central Service
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
const Styled = __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["default"].div.withConfig({
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
// Helper to resolve the URL (Matches IconView logic)
const resolveIconUrl = (item, iconsLoc)=>{
    // 1. API Image Handling (LMS numeric IDs)
    if (item && item.id && !isNaN(item.id)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].getIconUrl(item.id);
    }
    // 2. Static Asset Handling
    const imgPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getImage"])(`${iconsLoc || 'icons'}/${item.img || item}.png`);
    if (!imgPath) return '';
    if (imgPath.indexOf('http') === 0) return imgPath;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["publicPath"])(imgPath.startsWith('/') ? imgPath : `/${imgPath}`);
};
function IconViewMini({ data }) {
    const list = data?.list || [];
    const iconsLoc = data?.iconsLoc || 'icons';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Styled, {
        children: list.map((item)=>{
            const bgImage = `url(${resolveIconUrl(item, iconsLoc)})`;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mini-card",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: `/p/${item.id}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "img",
                            style: {
                                backgroundImage: bgImage
                            }
                        }, void 0, false, {
                            fileName: "[project]/comps/curriculumViews/IconViewMini.js",
                            lineNumber: 915,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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

//# sourceMappingURL=%5Broot-of-the-server%5D__babb4dec._.js.map