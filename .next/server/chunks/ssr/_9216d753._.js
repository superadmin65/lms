module.exports=[22180,__turbopack_context__=>{"use strict";let allColors=[{name:"blue",value:"#21b0df"},{name:"orange",value:"#ffa858"},{name:"yellow",value:"#ddc800"},{name:"violet",value:"#9494ff"},{name:"green",value:"#43f0a5"},{name:"red",value:"#ff7f7f"},{name:"lavender",value:"#d165ff"},{name:"magenta",value:"#ff6bdd"},{name:"gray",value:"#a0a0a0"},{name:"lemon",value:"#afea30"}];function getColorArr(a,b=allColors){let c=b.map(a=>a.value||a);for(c.sort(()=>Math.random()-.5);a>c.length;)c=[...c,...c];return c.slice(0,a)}function inputStrToArr({text:a,breakLine:b}){let c;return c=-1!==a.indexOf("\n")?a.split("\n").map(a=>a.trim()).filter(a=>""!==a):a.split(",").map(a=>a.trim()).filter(a=>""!==a),b&&(c=-1!==c[0].indexOf("|")?c.map(a=>a.split("|").map(a=>a.trim()).filter(a=>""!==a)):c.map(a=>a.split(",").map(a=>a.trim()).filter(a=>""!==a))),c}function generateRandomCompare(data,count=10,isNonNegative,isUnique){let list=[],counter=0;for(;list.length<count;){let pattern=data.pattern;pattern=getRepeated(pattern),pattern=pattern.split(" ");let item=[...pattern];for(let k=0;k<pattern.length;k+=2)item[k]=getFormatedRandom(item[k]);item=item.join(" "),!(isNonNegative&&0>eval(item))&&(!isUnique||!(counter<100)||-1===list.indexOf(item))&&(list.push(item),counter++)}return list}function getRepeated(a){let b=["s","t","u","v"];for(let c=0;c<b.length;c++)if(-1!==a.indexOf(b[c])){let d=Math.ceil(9*Math.random());a=a.replaceAll(b[c],()=>d)}else break;return a}function getFormatedRandom(a){let b=a.split(/(\{\d+_\d+\})/).filter(a=>""!==a.trim()),c=Math.pow(10,(b=(b=b.map(a=>"{"===a.charAt(0)?a:a.split(""))).flat()).length),d=Math.pow(10,b.length-1),e=""+Math.floor(Math.random()*(c-d)+d);for(let a=0;a<b.length;a++)if("{"===b[a].charAt(0)){let c=+b[a].substring(1,b[a].indexOf("_")),d=+b[a].substring(b[a].indexOf("_")+1,b[a].length-1);b[a]=Math.round(Math.random()*(d-c))+c}else switch(b[a]){case"x":b[a]=e[a];break;case"a":b[a]=Math.ceil(4*Math.random());break;case"b":b[a]=Math.ceil(5*Math.random())+4;break;case"c":b[a]=Math.ceil(5*Math.random())}let f=b.map(a=>""+a).join("");return -1!==f.indexOf(".")&&"0"===f.charAt(e.length-1)&&(f=f.slice(0,f.length-1)+Math.ceil(9*Math.random())),+f}function getLocalItem(a,b=[]){return b}function setLocalItem(a,b){let c=localStorage||window.localStorage;c&&c.setItem(a,JSON.stringify(b))}function removeLocalItem(a){let b=localStorage||window.localStorage;b&&b.removeItem(a)}function getRandIndex(a,b=!0){if(a.length)return a.map((a,c)=>{let d=[...Array(a.options.length)].map((a,b)=>b);return a.noRandom||(b?d.sort(()=>Math.random()-.5):d=shuffleAll(d)),[...d]});{let c=[...Array(a)].map((a,b)=>b);return b?c.sort(()=>Math.random()-.5):c=shuffleAll(c),[...c]}}function shuffleAll(a){let b,c=[...a];for(;;){c.sort((a,b)=>Math.random()-.5),b=!1;for(let d=0;d<a.length;d++)if(a[d]===c[d]){b=!0;break}if(!b)return c}}let getPos=a=>a.clientX?{x:a.clientX,y:a.clientY}:a.touches&&a.touches[0]&&a.touches[0].clientX?a.touches.length>1?null:{x:a.touches[0].clientX,y:a.touches[0].clientY}:a.changedTouches&&a.changedTouches[0]&&a.changedTouches[0].clientX?a.changedTouches.length>1?null:{x:a.changedTouches[0].clientX,y:a.changedTouches[0].clientY}:void 0;function setStyles(a,b){for(let c in b)a.style[c]=b[c]}function getAsset(a){let b="https://asset.pschool.in";return 0===a.indexOf("http")?a:`${b}/${a}`}function getBasePath(){return""}function publicPath(a){if(!a)return a;let b=a.startsWith("/")?a:"/"+a;return getBasePath()+b}function getFile(a,b){let c="https://asset.pschool.in";if(!b||"audio"===b)return`${c}/sound/${a}`}function loadAsset(a){if(0===a.indexOf("http"))return a;let b="https://asset.pschool.in";return`${b}/${a}`}function getImage(a,b){if(console.log("getImage id",a),-1!==a.indexOf(">")&&(a=a.replaceAll(">","/")),-1===a.indexOf(".")&&(a=`${a}.jpg`),0===a.indexOf("http"))return a;let c="https://asset.pschool.in";return"dragDrop"===b?-1!==a.indexOf("/")?`/img/${a}`:`/img/dragDrop/${a}`:-1!==a.indexOf("/")?`/img/${a}`:b?`${c}/${b}/${a}`:`${c}/stockimg/${a}`}function generateDataFromPattern(data,count=4){let list=[];for(let i=0;i<10;i++){let arr=[],pattern=data.pattern;pattern=getRepeated(pattern),pattern=pattern.split(" ");let values=[];for(;arr.length<count;){let item=[...pattern];for(let k=0;k<pattern.length;k+=2)item[k]=getFormatedRandom(item[k]);item=item.join(" ");let val=eval(item);val<0||-1!==values.indexOf(val)||(values.push(val),arr.push(item))}arr.sort((a,b)=>"biggest"===data.probType||"descending"===data.probType?eval(b)-eval(a):eval(a)-eval(b)),arr=arr.map(a=>a.replace("*","×")),arr=arr.map(a=>a.replace("-","–"));let randArr=[...Array(arr.length)].map((a,b)=>b);randArr.sort(()=>Math.random()-.5),"descending"===data.probType||"ascending"===data.probType?list.push({options:arr,randArr}):list.push({words:arr,randArr})}return list}function getTimeStr(a){let b=Math.floor(a/60),c=a%60;return b<=9&&(b="0"+b),c<=9&&(c="0"+c),`${b}:${c}`}function delay(a){return new Promise(b=>setTimeout(()=>b("doneFromDelay"),a))}function setAttrs(a,b){if(a)for(let c in b)a.setAttribute(c,b[c])}function isValidEmail(a){return/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(a).toLowerCase())}function toggleDisableBtn(a,b){b?(a.classList.add("callInProg"),a.setAttribute("disabled","true")):(a.classList.remove("callInProg"),a.removeAttribute("disabled"))}let months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function getDateStr(a){if(!a)return null;isNaN(a)||(a*=1);let b=new Date(a);return`${months[b.getMonth()]} ${b.getDate()}`}function isSmallScreen(){return window.innerWidth<900}function inIframe(){try{return window.self!==window.top}catch(a){return!0}}__turbopack_context__.s(["getImage",()=>getImage,"getLocalItem",()=>getLocalItem,"loadAsset",()=>loadAsset,"publicPath",()=>publicPath,"setLocalItem",()=>setLocalItem])},18534,a=>{"use strict";var b=a.i(8171);a.i(27669);var c=a.i(46283);let d=c.keyframes`
0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`,e=(0,c.default)("button").withConfig({displayName:"Button__StyledButton",componentId:"sc-35cf991c-0"})`
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
  ${a=>a.primary&&c.css`
      background-color: var(--darkColor);

      color: #fff;
    `}
  ${a=>a.secondary&&c.css`
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
        animation: ${d} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
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
`,f=({children:a,updating:c,...d})=>(0,b.jsx)(e,{...d,children:a});a.s(["default",0,f])},60897,34830,a=>{"use strict";var b=a.i(8171),c=a.i(46283),d=a.i(27669);let e=c.default.div.withConfig({displayName:"InputWrap__InputWrapper",componentId:"sc-768cbaeb-0"})`
  margin: 10px 0;

  ${a=>a.sameLine&&c.css`
      display: flex;
      margin-right: 20px;
    `} & input {
    border: none;
    outline: none;
    border-bottom: 1px solid ${a=>a.error?"#f00":"#ccc"};
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
`,f=({error:a,label:c,children:d,sameLine:f,...g})=>(0,b.jsxs)(e,{error:a,style:g.style,sameLine:f,children:[!!c&&(0,b.jsx)("label",{children:c}),d,a&&(0,b.jsx)("label",{className:"errorLable",children:a})]});a.s(["default",0,f],60897);var g=b,h=d,i=c,j=a.i(25976);let k=i.default.div.withConfig({displayName:"Select__Styled",componentId:"sc-f454b202-0"})`
  width: ${a=>a.width||"130px"};
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
`;function l(a){let[b,c]=(0,h.useState)({open:!1}),d=a.options;"string"==typeof d[0]&&(d=d.map(a=>({label:a,value:a})));let e=d.find(b=>b.value===a.value||b.id===a.value),i=()=>{c(a=>({...a,open:!1}))};return(0,h.useEffect)(()=>(document.addEventListener("click",i),()=>document.removeEventListener("click",i)),[]),(0,g.jsx)(f,{label:a.label,sameLine:a.sameLine||!1,children:(0,g.jsxs)(k,{width:a.width,tabIndex:"0",children:[!b.open&&(0,g.jsxs)("div",{className:"control",onClick:a=>{a.stopPropagation(),c({...b,open:!0})},children:[(0,g.jsx)("div",{className:"placeholder",children:e?e.label:"Select"}),(0,g.jsx)(j.default,{id:"caretDown",size:"12",style:{position:"absolute",right:10,top:10}})]}),b.open&&(0,g.jsx)("div",{className:"menu",children:d.map((d,e)=>(0,g.jsx)("div",{onClick:()=>{a.onChange(d),c({...b,open:!1})},children:d.label},d.value||d.id||e))})]})})}a.s(["default",()=>l],34830)},65890,24306,a=>{"use strict";a.i(60897);var b=a.i(8171),c=a.i(46283),d=a.i(27669);a.i(25976);let e=c.default.div.withConfig({displayName:"Input__InputWrapper",componentId:"sc-acb101f1-0"})`
  margin: 10px 0;

  ${a=>a.sameLine&&c.css`
      display: flex;
      margin-right: 20px;
    `} & input, textarea {
    border: none;
    outline: none;
    border-bottom: 1px solid ${a=>a.error?"#f00":"#ccc"};
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
`,f=({error:a,label:c,sameLine:d,...f})=>(0,b.jsxs)(e,{sameLine:d,error:a,style:f.style,children:[!!c&&(0,b.jsx)("label",{htmlFor:c,children:c}),(0,b.jsxs)("div",{style:{width:f.width||""},children:[(0,b.jsx)("input",{id:c,type:"text",...f}),a&&(0,b.jsx)("label",{className:"errorLable",children:a})]})]});a.s(["default",0,f],24306);var g=c;g.default.input.attrs({type:"number"}).withConfig({displayName:"InputNumber",componentId:"sc-b8714d9f-0"})`
  width: 50px;
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 3px;
  outline: none;
`;var h=c;h.default.div.withConfig({displayName:"Checkbox__CheckboxWrapper",componentId:"sc-1bf5732d-0"})`
  outline: none;
  margin: 10px 0;
  & input[type='checkbox'] {
    width: 16px;
    height: 16px;
    display: inline-block;
    border-radius: 4px;
    vertical-align: middle;
    border: ${a=>a.checked?"":"2px solid #cccccc"};
    outline: none;
    transform: scale(1.5);
  }

  & .contentWrap {
    display: inline-block;
    margin-left: 10px;
    cursor: pointer;
  }
`;var i=c;i.default.div.withConfig({displayName:"Radio__CheckboxWrapper",componentId:"sc-6f4effd8-0"})`
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
`,a.i(18534);var j=c;j.default.div.withConfig({displayName:"ButtonBar",componentId:"sc-53964f1e-0"})`
  display: flex;
  justify-content: ${a=>"left"===a.align?"flext-start":"flex-end"};
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
`;var k=d,l=c;l.default.div.withConfig({displayName:"Overlay__OverlayWrapper",componentId:"sc-78964d82-0"})`
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
    ${a=>a.bgOpacity?a.bgOpacity:0}
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
    left: ${a=>`${a.left||400}px`};
    top: ${a=>`${a.top||300}px`};
    width: ${a=>`${a.width||400}px`};
    height: ${a=>a.height?`${a.height}px`:"auto"};
    overflow-y: auto;
    position: absolute;
    background-color: ${a=>a.bgColor||"white"};
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
    padding: ${a=>a.padding||"10px"};
    background-color: ${a=>a.bgColor||"white"};
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
`,k.default.Component,a.i(34830);var m=c;m.default.div.withConfig({displayName:"Section__SectionWrapper",componentId:"sc-864b9930-0"})`
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
`;var n=c;n.default.div.withConfig({displayName:"LinkButton__LinkButtonStyled",componentId:"sc-620befe9-0"})`
  padding: 10px;
  text-align: right;
  font-size: 0.8em;
  text-decoration: underline;
  cursor: pointer;
`,a.s([],65890)},23392,a=>{"use strict";var b=a.i(34830);a.s(["Select",()=>b.default])},6016,a=>a.a(async(b,c)=>{try{var d=a.i(8171),e=a.i(27669),f=a.i(46283),g=a.i(1257),h=a.i(22180),i=a.i(67507);a.i(65890);var j=a.i(23392),k=b([i]);[i]=k.then?(await k)():k;let m=f.default.div.withConfig({displayName:"IconViewMini__Styled",componentId:"sc-3f2e9eca-0"})`
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
`,n={width:120,margin:"25px 0",borderRadius:10},o=(a,b)=>{let c=b.iconStyle||{width:80,height:80};if(a&&a.id&&!isNaN(a.id)){let b=i.apiService.getIconUrl(a.id);return c.backgroundImage=`url(${b})`,c}let d=a,e=(0,h.getImage)(`${b.iconsLoc||"icons"}/${d}.png`),f=a=>a&&0!==a.indexOf("http")?(0,h.publicPath)(a.startsWith("/")?a:`/${a}`):a;return c.backgroundImage=`url(${f(e)})`,c};function l(a){let b,c=(0,h.getLocalItem)("config",{}),f=a.data||{};if(f.grades){let a=f.grades.find(a=>!0===a.default);a&&(b=a.id)}let[k,l]=(0,e.useState)({selectedGrade:c.selectedGrade||b}),p=f.list||[];if(f.grades){let a=k.selectedGrade.match(/(\d+)/),b=a&&+a[0]||0;p=p.filter(a=>{if(!a.grade)return!1;let c=a.grade.split("-").map(a=>+a);return 1===c.length?c[0]===b:c[0]<=b&&c[1]>=b})}let q=f.config||{};return(0,d.jsxs)(m,{children:[(0,d.jsxs)("main",{style:f.style||{maxWidth:1024,fontSize:"1rem"},children:[(0,d.jsxs)("div",{className:"flex-sb",children:[f.label&&(0,d.jsx)("h1",{style:f.titleStyle||{},children:f.label}),f.grades&&(0,d.jsx)(j.Select,{width:"150px",options:f.grades,value:k.selectedGrade,bgColor:"inherit",onChange:a=>{let b=(0,h.getLocalItem)("config",{});b.selectedGrade=a.value||a.id,b.selectedSubject="all",(0,h.setLocalItem)("config",b),l({...k,selectedGrade:a.value||a.id})}})]}),(0,d.jsx)("div",{className:"topics",children:p.map(a=>{let b=a.style||{},c=f.cardStyle||n;return c={...c,...b},(0,d.jsx)("div",{className:"card",style:c,children:(0,d.jsxs)(g.default,{href:`/p/${a.id}`,children:[!q.type&&(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("div",{className:"img",style:{...o(a,f),backgroundImage:`url(${function(){if(a.id&&!isNaN(a.id))return i.apiService.getIconUrl(a.id);let b=(0,h.getImage)(`${f.iconsLoc||"icons"}/${a.img}.png`);return b&&0!==b.indexOf("http")?(0,h.publicPath)(b.startsWith("/")?b:`/${b}`):b}()})`}}),(0,d.jsx)("div",{className:"label",style:f.labelStyle||{},children:a.label}),a.smLabel&&(0,d.jsx)("div",{className:"smLabel",style:f.smLabelStyle||{},children:a.smLabel})]}),"descType"===q.type&&(0,d.jsxs)("div",{className:"descCard",children:[(0,d.jsxs)("div",{children:[(0,d.jsx)("div",{className:"label title",style:f.labelStyle||{},children:a.label}),a.smLabel&&(0,d.jsx)("div",{className:"smLabel",style:f.smLabelStyle||{},children:a.smLabel}),(0,d.jsx)("div",{className:"desc",style:f.descStyle||{},children:a.desc})]}),(0,d.jsx)("div",{className:"img",style:{...o(a,f),backgroundImage:`url(${function(){if(a.id&&!isNaN(a.id))return i.apiService.getIconUrl(a.id);let b=(0,h.getImage)(`${f.iconsLoc||"icons"}/${a.img}.png`);return b&&0!==b.indexOf("http")?(0,h.publicPath)(b.startsWith("/")?b:`/${b}`):b}()})`}})]})]})},a.id)})})]}),f.moreActivities&&(0,d.jsx)("div",{className:"hilight",children:(0,d.jsx)("div",{children:(0,d.jsx)(g.default,{href:`/p/${f.moreActivities}`,children:"More Activities"})})})]})}a.s(["default",()=>l]),c()}catch(a){c(a)}},!1)];

//# sourceMappingURL=_9216d753._.js.map