(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,20955,(e,t,n)=>{!function(){var e={229:function(e){var t,n,r,o=e.exports={};function i(){throw Error("setTimeout has not been defined")}function a(){throw Error("clearTimeout has not been defined")}function l(e){if(t===setTimeout)return setTimeout(e,0);if((t===i||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}function s(e){if(n===clearTimeout)return clearTimeout(e);if((n===a||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{return n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:i}catch(e){t=i}try{n="function"==typeof clearTimeout?clearTimeout:a}catch(e){n=a}}();var c=[],u=!1,d=-1;function f(){u&&r&&(u=!1,r.length?c=r.concat(c):d=-1,c.length&&p())}function p(){if(!u){var e=l(f);u=!0;for(var t=c.length;t;){for(r=c,c=[];++d<t;)r&&r[d].run();d=-1,t=c.length}r=null,u=!1,s(e)}}function h(e,t){this.fun=e,this.array=t}function m(){}o.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];c.push(new h(e,t)),1!==c.length||u||l(p)},h.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=m,o.addListener=m,o.once=m,o.off=m,o.removeListener=m,o.removeAllListeners=m,o.emit=m,o.prependListener=m,o.prependOnceListener=m,o.listeners=function(e){return[]},o.binding=function(e){throw Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw Error("process.chdir is not supported")},o.umask=function(){return 0}}},n={};function r(t){var o=n[t];if(void 0!==o)return o.exports;var i=n[t]={exports:{}},a=!0;try{e[t](i,i.exports,r),a=!1}finally{a&&delete n[t]}return i.exports}r.ab="/ROOT/node_modules/next/dist/compiled/process/",t.exports=r(229)}()},50461,(e,t,n)=>{"use strict";var r,o;t.exports=(null==(r=e.g.process)?void 0:r.env)&&"object"==typeof(null==(o=e.g.process)?void 0:o.env)?e.g.process:e.r(20955)},41705,(e,t,n)=>{"use strict";n._=function(e){return e&&e.__esModule?e:{default:e}}},8481,(e,t,n)=>{"use strict";var r=Symbol.for("react.transitional.element");function o(e,t,n){var o=null;if(void 0!==n&&(o=""+n),void 0!==t.key&&(o=""+t.key),"key"in t)for(var i in n={},t)"key"!==i&&(n[i]=t[i]);else n=t;return{$$typeof:r,type:e,key:o,ref:void 0!==(t=n.ref)?t:null,props:n}}n.Fragment=Symbol.for("react.fragment"),n.jsx=o,n.jsxs=o},91398,(e,t,n)=>{"use strict";t.exports=e.r(8481)},61556,(e,t,n)=>{"use strict";var r=e.i(50461),o=Symbol.for("react.transitional.element"),i=Symbol.for("react.portal"),a=Symbol.for("react.fragment"),l=Symbol.for("react.strict_mode"),s=Symbol.for("react.profiler"),c=Symbol.for("react.consumer"),u=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),f=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),h=Symbol.for("react.lazy"),m=Symbol.for("react.activity"),v=Symbol.iterator;function g(e){return null===e||"object"!=typeof e?null:"function"==typeof(e=v&&e[v]||e["@@iterator"])?e:null}var x={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},y=Object.assign,b={};function w(e,t,n){this.props=e,this.context=t,this.refs=b,this.updater=n||x}function j(){}function z(e,t,n){this.props=e,this.context=t,this.refs=b,this.updater=n||x}w.prototype.isReactComponent={},w.prototype.setState=function(e,t){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")},w.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},j.prototype=w.prototype;var _=z.prototype=new j;_.constructor=z,y(_,w.prototype),_.isPureReactComponent=!0;var k=Array.isArray;function S(){}var M={H:null,A:null,T:null,S:null},$=Object.prototype.hasOwnProperty;function C(e,t,n){var r=n.ref;return{$$typeof:o,type:e,key:t,ref:void 0!==r?r:null,props:n}}function N(e,t){return C(e.type,t,e.props)}function O(e){return"object"==typeof e&&null!==e&&e.$$typeof===o}function E(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(e){return t[e]})}var T=/\/+/g;function P(e,t){return"object"==typeof e&&null!==e&&null!=e.key?E(""+e.key):t.toString(36)}function I(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch("string"==typeof e.status?e.then(S,S):(e.status="pending",e.then(function(t){"pending"===e.status&&(e.status="fulfilled",e.value=t)},function(t){"pending"===e.status&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function L(e,t,n,r,a){var l=typeof e;("undefined"===l||"boolean"===l)&&(e=null);var s=!1;if(null===e)s=!0;else switch(l){case"bigint":case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case o:case i:s=!0;break;case h:return L((s=e._init)(e._payload),t,n,r,a)}}if(s)return a=a(e),s=""===r?"."+P(e,0):r,k(a)?(n="",null!=s&&(n=s.replace(T,"$&/")+"/"),L(a,t,n,"",function(e){return e})):null!=a&&(O(a)&&(a=N(a,n+(null==a.key||e&&e.key===a.key?"":(""+a.key).replace(T,"$&/")+"/")+s)),t.push(a)),1;s=0;var c=""===r?".":r+":";if(k(e))for(var u=0;u<e.length;u++)l=c+P(r=e[u],u),s+=L(r,t,n,l,a);else if("function"==typeof(u=g(e)))for(e=u.call(e),u=0;!(r=e.next()).done;)l=c+P(r=r.value,u++),s+=L(r,t,n,l,a);else if("object"===l){if("function"==typeof e.then)return L(I(e),t,n,r,a);throw Error("Objects are not valid as a React child (found: "+("[object Object]"===(t=String(e))?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return s}function A(e,t,n){if(null==e)return e;var r=[],o=0;return L(e,r,"","",function(e){return t.call(n,e,o++)}),r}function R(e){if(-1===e._status){var t=e._result;(t=t()).then(function(t){(0===e._status||-1===e._status)&&(e._status=1,e._result=t)},function(t){(0===e._status||-1===e._status)&&(e._status=2,e._result=t)}),-1===e._status&&(e._status=0,e._result=t)}if(1===e._status)return e._result.default;throw e._result}var B="function"==typeof reportError?reportError:function(e){if("object"==typeof window&&"function"==typeof window.ErrorEvent){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:"object"==typeof e&&null!==e&&"string"==typeof e.message?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if("object"==typeof r.default&&"function"==typeof r.default.emit)return void r.default.emit("uncaughtException",e);console.error(e)},D={map:A,forEach:function(e,t,n){A(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return A(e,function(){t++}),t},toArray:function(e){return A(e,function(e){return e})||[]},only:function(e){if(!O(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};n.Activity=m,n.Children=D,n.Component=w,n.Fragment=a,n.Profiler=s,n.PureComponent=z,n.StrictMode=l,n.Suspense=f,n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=M,n.__COMPILER_RUNTIME={__proto__:null,c:function(e){return M.H.useMemoCache(e)}},n.cache=function(e){return function(){return e.apply(null,arguments)}},n.cacheSignal=function(){return null},n.cloneElement=function(e,t,n){if(null==e)throw Error("The argument must be a React element, but you passed "+e+".");var r=y({},e.props),o=e.key;if(null!=t)for(i in void 0!==t.key&&(o=""+t.key),t)$.call(t,i)&&"key"!==i&&"__self"!==i&&"__source"!==i&&("ref"!==i||void 0!==t.ref)&&(r[i]=t[i]);var i=arguments.length-2;if(1===i)r.children=n;else if(1<i){for(var a=Array(i),l=0;l<i;l++)a[l]=arguments[l+2];r.children=a}return C(e.type,o,r)},n.createContext=function(e){return(e={$$typeof:u,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null}).Provider=e,e.Consumer={$$typeof:c,_context:e},e},n.createElement=function(e,t,n){var r,o={},i=null;if(null!=t)for(r in void 0!==t.key&&(i=""+t.key),t)$.call(t,r)&&"key"!==r&&"__self"!==r&&"__source"!==r&&(o[r]=t[r]);var a=arguments.length-2;if(1===a)o.children=n;else if(1<a){for(var l=Array(a),s=0;s<a;s++)l[s]=arguments[s+2];o.children=l}if(e&&e.defaultProps)for(r in a=e.defaultProps)void 0===o[r]&&(o[r]=a[r]);return C(e,i,o)},n.createRef=function(){return{current:null}},n.forwardRef=function(e){return{$$typeof:d,render:e}},n.isValidElement=O,n.lazy=function(e){return{$$typeof:h,_payload:{_status:-1,_result:e},_init:R}},n.memo=function(e,t){return{$$typeof:p,type:e,compare:void 0===t?null:t}},n.startTransition=function(e){var t=M.T,n={};M.T=n;try{var r=e(),o=M.S;null!==o&&o(n,r),"object"==typeof r&&null!==r&&"function"==typeof r.then&&r.then(S,B)}catch(e){B(e)}finally{null!==t&&null!==n.types&&(t.types=n.types),M.T=t}},n.unstable_useCacheRefresh=function(){return M.H.useCacheRefresh()},n.use=function(e){return M.H.use(e)},n.useActionState=function(e,t,n){return M.H.useActionState(e,t,n)},n.useCallback=function(e,t){return M.H.useCallback(e,t)},n.useContext=function(e){return M.H.useContext(e)},n.useDebugValue=function(){},n.useDeferredValue=function(e,t){return M.H.useDeferredValue(e,t)},n.useEffect=function(e,t){return M.H.useEffect(e,t)},n.useEffectEvent=function(e){return M.H.useEffectEvent(e)},n.useId=function(){return M.H.useId()},n.useImperativeHandle=function(e,t,n){return M.H.useImperativeHandle(e,t,n)},n.useInsertionEffect=function(e,t){return M.H.useInsertionEffect(e,t)},n.useLayoutEffect=function(e,t){return M.H.useLayoutEffect(e,t)},n.useMemo=function(e,t){return M.H.useMemo(e,t)},n.useOptimistic=function(e,t){return M.H.useOptimistic(e,t)},n.useReducer=function(e,t,n){return M.H.useReducer(e,t,n)},n.useRef=function(e){return M.H.useRef(e)},n.useState=function(e){return M.H.useState(e)},n.useSyncExternalStore=function(e,t,n){return M.H.useSyncExternalStore(e,t,n)},n.useTransition=function(){return M.H.useTransition()},n.version="19.2.0"},91788,(e,t,n)=>{"use strict";t.exports=e.r(61556)},13584,(e,t,n)=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0}),Object.defineProperty(n,"HeadManagerContext",{enumerable:!0,get:function(){return r}});let r=e.r(41705)._(e.r(91788)).default.createContext({})},94470,(e,t,n)=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0}),Object.defineProperty(n,"warnOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},52456,(e,t,n)=>{"use strict";function r(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(r=function(e){return e?n:t})(e)}n._=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var n=r(t);if(n&&n.has(e))return n.get(e);var o={__proto__:null},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if("default"!==a&&Object.prototype.hasOwnProperty.call(e,a)){var l=i?Object.getOwnPropertyDescriptor(e,a):null;l&&(l.get||l.set)?Object.defineProperty(o,a,l):o[a]=e[a]}return o.default=e,n&&n.set(e,o),o}},89129,(e,t,n)=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(n,{DecodeError:function(){return m},MiddlewareNotFoundError:function(){return y},MissingStaticPage:function(){return x},NormalizeError:function(){return v},PageNotFoundError:function(){return g},SP:function(){return p},ST:function(){return h},WEB_VITALS:function(){return r},execOnce:function(){return o},getDisplayName:function(){return c},getLocationOrigin:function(){return l},getURL:function(){return s},isAbsoluteUrl:function(){return a},isResSent:function(){return u},loadGetInitialProps:function(){return f},normalizeRepeatedSlashes:function(){return d},stringifyError:function(){return b}});let r=["CLS","FCP","FID","INP","LCP","TTFB"];function o(e){let t,n=!1;return(...r)=>(n||(n=!0,t=e(...r)),t)}let i=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,a=e=>i.test(e);function l(){let{protocol:e,hostname:t,port:n}=window.location;return`${e}//${t}${n?":"+n:""}`}function s(){let{href:e}=window.location,t=l();return e.substring(t.length)}function c(e){return"string"==typeof e?e:e.displayName||e.name||"Unknown"}function u(e){return e.finished||e.headersSent}function d(e){let t=e.split("?");return t[0].replace(/\\/g,"/").replace(/\/\/+/g,"/")+(t[1]?`?${t.slice(1).join("?")}`:"")}async function f(e,t){let n=t.res||t.ctx&&t.ctx.res;if(!e.getInitialProps)return t.ctx&&t.Component?{pageProps:await f(t.Component,t.ctx)}:{};let r=await e.getInitialProps(t);if(n&&u(n))return r;if(!r)throw Object.defineProperty(Error(`"${c(e)}.getInitialProps()" should resolve to an object. But found "${r}" instead.`),"__NEXT_ERROR_CODE",{value:"E394",enumerable:!1,configurable:!0});return r}let p="undefined"!=typeof performance,h=p&&["mark","measure","getEntriesByName"].every(e=>"function"==typeof performance[e]);class m extends Error{}class v extends Error{}class g extends Error{constructor(e){super(),this.code="ENOENT",this.name="PageNotFoundError",this.message=`Cannot find module for page: ${e}`}}class x extends Error{constructor(e,t){super(),this.message=`Failed to load static file for page: ${e} ${t}`}}class y extends Error{constructor(){super(),this.code="ENOENT",this.message="Cannot find the middleware module"}}function b(e){return JSON.stringify({message:e.message,stack:e.stack})}},94941,(e,t,n)=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0}),Object.defineProperty(n,"default",{enumerable:!0,get:function(){return l}});let r=e.r(91788),o="undefined"==typeof window,i=o?()=>{}:r.useLayoutEffect,a=o?()=>{}:r.useEffect;function l(e){let{headManager:t,reduceComponentsToState:n}=e;function l(){if(t&&t.mountedInstances){let e=r.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(n(e))}}return o&&(t?.mountedInstances?.add(e.children),l()),i(()=>(t?.mountedInstances?.add(e.children),()=>{t?.mountedInstances?.delete(e.children)})),i(()=>(t&&(t._pendingUpdate=l),()=>{t&&(t._pendingUpdate=l)})),a(()=>(t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),()=>{t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)})),null}},80963,(e,t,n)=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(n,{default:function(){return h},defaultHead:function(){return c}});let r=e.r(41705),o=e.r(52456),i=e.r(91398),a=o._(e.r(91788)),l=r._(e.r(94941)),s=e.r(13584);function c(){return[(0,i.jsx)("meta",{charSet:"utf-8"},"charset"),(0,i.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function u(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===a.default.Fragment?e.concat(a.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}e.r(94470);let d=["name","httpEquiv","charSet","itemProp"];function f(){let e=new Set,t=new Set,n=new Set,r={};return o=>{let i=!0,a=!1;if(o.key&&"number"!=typeof o.key&&o.key.indexOf("$")>0){a=!0;let t=o.key.slice(o.key.indexOf("$")+1);e.has(t)?i=!1:e.add(t)}switch(o.type){case"title":case"base":t.has(o.type)?i=!1:t.add(o.type);break;case"meta":for(let e=0,t=d.length;e<t;e++){let t=d[e];if(o.props.hasOwnProperty(t))if("charSet"===t)n.has(t)?i=!1:n.add(t);else{let e=o.props[t],n=r[t]||new Set;("name"!==t||!a)&&n.has(e)?i=!1:(n.add(e),r[t]=n)}}}return i}}function p(e){return e.reduce(u,[]).reverse().concat(c().reverse()).filter(f()).reverse().map((e,t)=>{let n=e.key||t;return a.default.cloneElement(e,{key:n})})}let h=function({children:e}){let t=(0,a.useContext)(s.HeadManagerContext);return(0,i.jsx)(l.default,{reduceComponentsToState:p,headManager:t,children:e})};("function"==typeof n.default||"object"==typeof n.default&&null!==n.default)&&void 0===n.default.__esModule&&(Object.defineProperty(n.default,"__esModule",{value:!0}),Object.assign(n.default,n),t.exports=n.default)},58678,(e,t,n)=>{t.exports=e.r(80963)},79186,e=>{"use strict";var t=e.i(91398);e.i(91788);let n={facebook:"M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z",youtube:"M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z",youtube2:"M4.652 0h1.44l.988 3.702.916-3.702h1.454l-1.665 5.505v3.757h-1.431v-3.757l-1.702-5.505zm6.594 2.373c-1.119 0-1.861.74-1.861 1.835v3.349c0 1.204.629 1.831 1.861 1.831 1.022 0 1.826-.683 1.826-1.831v-3.349c0-1.069-.797-1.835-1.826-1.835zm.531 5.127c0 .372-.19.646-.532.646-.351 0-.554-.287-.554-.646v-3.179c0-.374.172-.651.529-.651.39 0 .557.269.557.651v3.179zm4.729-5.07v5.186c-.155.194-.5.512-.747.512-.271 0-.338-.186-.338-.46v-5.238h-1.27v5.71c0 .675.206 1.22.887 1.22.384 0 .918-.2 1.468-.853v.754h1.27v-6.831h-1.27zm2.203 13.858c-.448 0-.541.315-.541.763v.659h1.069v-.66c.001-.44-.092-.762-.528-.762zm-4.703.04c-.084.043-.167.109-.25.198v4.055c.099.106.194.182.287.229.197.1.485.107.619-.067.07-.092.105-.241.105-.449v-3.359c0-.22-.043-.386-.129-.5-.147-.193-.42-.214-.632-.107zm4.827-5.195c-2.604-.177-11.066-.177-13.666 0-2.814.192-3.146 1.892-3.167 6.367.021 4.467.35 6.175 3.167 6.367 2.6.177 11.062.177 13.666 0 2.814-.192 3.146-1.893 3.167-6.367-.021-4.467-.35-6.175-3.167-6.367zm-12.324 10.686h-1.363v-7.54h-1.41v-1.28h4.182v1.28h-1.41v7.54zm4.846 0h-1.21v-.718c-.223.265-.455.467-.696.605-.652.374-1.547.365-1.547-.955v-5.438h1.209v4.988c0 .262.063.438.322.438.236 0 .564-.303.711-.487v-4.939h1.21v6.506zm4.657-1.348c0 .805-.301 1.431-1.106 1.431-.443 0-.812-.162-1.149-.583v.5h-1.221v-8.82h1.221v2.84c.273-.333.644-.608 1.076-.608.886 0 1.18.749 1.18 1.631v3.609zm4.471-1.752h-2.314v1.228c0 .488.042.91.528.91.511 0 .541-.344.541-.91v-.452h1.245v.489c0 1.253-.538 2.013-1.813 2.013-1.155 0-1.746-.842-1.746-2.013v-2.921c0-1.129.746-1.914 1.837-1.914 1.161 0 1.721.738 1.721 1.914v1.656z",instagram:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",twitter:"M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z",linkedin:"M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",pinterest:"M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z",github:"M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",whatsapp:"M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z",email:"M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z",pencil:"M14.078 4.232l-12.64 12.639-1.438 7.129 7.127-1.438 12.641-12.64-5.69-5.69zm-10.369 14.893l-.85-.85 11.141-11.125.849.849-11.14 11.126zm2.008 2.008l-.85-.85 11.141-11.125.85.85-11.141 11.125zm18.283-15.444l-2.816 2.818-5.691-5.691 2.816-2.816 5.691 5.689z",paint:"M21.143 9.667c-.733-1.392-1.914-3.05-3.617-4.753-2.977-2.978-5.478-3.914-6.785-3.914-.414 0-.708.094-.86.246l-1.361 1.36c-1.899-.236-3.42.106-4.294.983-.876.875-1.164 2.159-.792 3.523.492 1.806 2.305 4.049 5.905 5.375.038.323.157.638.405.885.588.588 1.535.586 2.121 0s.588-1.533.002-2.119c-.588-.587-1.537-.588-2.123-.001l-.17.256c-2.031-.765-3.395-1.828-4.232-2.9l3.879-3.875c.496 2.73 6.432 8.676 9.178 9.178l-7.115 7.107c-.234.153-2.798-.316-6.156-3.675-3.393-3.393-3.175-5.271-3.027-5.498l1.859-1.856c-.439-.359-.925-1.103-1.141-1.689l-2.134 2.131c-.445.446-.685 1.064-.685 1.82 0 1.634 1.121 3.915 3.713 6.506 2.764 2.764 5.58 4.243 7.432 4.243.648 0 1.18-.195 1.547-.562l8.086-8.078c.91.874-.778 3.538-.778 4.648 0 1.104.896 1.999 2 1.999 1.105 0 2-.896 2-2 0-3.184-1.425-6.81-2.857-9.34zm-16.209-5.371c.527-.53 1.471-.791 2.656-.761l-3.209 3.206c-.236-.978-.049-1.845.553-2.445zm9.292 4.079l-.03-.029c-1.292-1.292-3.803-4.356-3.096-5.063.715-.715 3.488 1.521 5.062 3.096.862.862 2.088 2.247 2.937 3.458-1.717-1.074-3.491-1.469-4.873-1.462z",eraser:"M5.662 23l-5.369-5.365c-.195-.195-.293-.45-.293-.707 0-.256.098-.512.293-.707l14.929-14.928c.195-.194.451-.293.707-.293.255 0 .512.099.707.293l7.071 7.073c.196.195.293.451.293.708 0 .256-.097.511-.293.707l-11.216 11.219h5.514v2h-12.343zm3.657-2l-5.486-5.486-1.419 1.414 4.076 4.072h2.829zm6.605-17.581l-10.677 10.68 5.658 5.659 10.676-10.682-5.657-5.657z",refresh:"M13.5 2c-5.288 0-9.649 3.914-10.377 9h-3.123l4 5.917 4-5.917h-2.847c.711-3.972 4.174-7 8.347-7 4.687 0 8.5 3.813 8.5 8.5s-3.813 8.5-8.5 8.5c-3.015 0-5.662-1.583-7.171-3.957l-1.2 1.775c1.916 2.536 4.948 4.182 8.371 4.182 5.797 0 10.5-4.702 10.5-10.5s-4.703-10.5-10.5-10.5z",sort:"M12 3.202l3.839 4.798h-7.678l3.839-4.798zm0-3.202l-8 10h16l-8-10zm3.839 16l-3.839 4.798-3.839-4.798h7.678zm4.161-2h-16l8 10 8-10z",arrowLeft:"M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm-4.828 11.5l4.608 3.763-.679.737-6.101-5 6.112-5 .666.753-4.604 3.747h11.826v1h-11.828z",save:"M13 3h2.996v5h-2.996v-5zm11 1v20h-24v-24h20l4 4zm-17 5h10v-7h-10v7zm15-4.171l-2.828-2.829h-.172v9h-14v-9h-3v20h20v-17.171z",pdf:"M11.363 2c4.155 0 2.637 6 2.637 6s6-1.65 6 2.457v11.543h-16v-20h7.363zm.826-2h-10.189v24h20v-14.386c0-2.391-6.648-9.614-9.811-9.614zm4.811 13h-2.628v3.686h.907v-1.472h1.49v-.732h-1.49v-.698h1.721v-.784zm-4.9 0h-1.599v3.686h1.599c.537 0 .961-.181 1.262-.535.555-.658.587-2.034-.062-2.692-.298-.3-.712-.459-1.2-.459zm-.692.783h.496c.473 0 .802.173.915.644.064.267.077.679-.021.948-.128.351-.381.528-.754.528h-.637v-2.12zm-2.74-.783h-1.668v3.686h.907v-1.277h.761c.619 0 1.064-.277 1.224-.763.095-.291.095-.597 0-.885-.16-.484-.606-.761-1.224-.761zm-.761.732h.546c.235 0 .467.028.576.228.067.123.067.366 0 .489-.109.199-.341.227-.576.227h-.546v-.944z",lock:"M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-10 0v-4c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-8z",caretDown:"M12 21l-12-18h24z",upload:"M8 10h-5l9-10 9 10h-5v10h-8v-10zm11 9v3h-14v-3h-2v5h18v-5h-2z",audio:"M6 7l8-5v20l-8-5v-10zm-6 10h4v-10h-4v10zm20.264-13.264l-1.497 1.497c1.847 1.783 2.983 4.157 2.983 6.767 0 2.61-1.135 4.984-2.983 6.766l1.498 1.498c2.305-2.153 3.735-5.055 3.735-8.264s-1.43-6.11-3.736-8.264zm-.489 8.264c0-2.084-.915-3.967-2.384-5.391l-1.503 1.503c1.011 1.049 1.637 2.401 1.637 3.888 0 1.488-.623 2.841-1.634 3.891l1.503 1.503c1.468-1.424 2.381-3.309 2.381-5.394z",target:"M6 12c0 2.206 1.794 4 4 4 1.761 0 3.242-1.151 3.775-2.734l2.224-1.291.001.025c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6c1.084 0 2.098.292 2.975.794l-2.21 1.283c-.248-.048-.503-.077-.765-.077-2.206 0-4 1.794-4 4zm4-2c-1.105 0-2 .896-2 2s.895 2 2 2 2-.896 2-2l-.002-.015 3.36-1.95c.976-.565 2.704-.336 3.711.159l4.931-2.863-3.158-1.569.169-3.632-4.945 2.87c-.07 1.121-.734 2.736-1.705 3.301l-3.383 1.964c-.29-.163-.621-.265-.978-.265zm7.995 1.911l.005.089c0 4.411-3.589 8-8 8s-8-3.589-8-8 3.589-8 8-8c1.475 0 2.853.408 4.041 1.107.334-.586.428-1.544.146-2.18-1.275-.589-2.69-.927-4.187-.927-5.523 0-10 4.477-10 10s4.477 10 10 10c5.233 0 9.521-4.021 9.957-9.142-.301-.483-1.066-1.061-1.962-.947z",barchart:"M5 19h-4v-8h4v8zm6 0h-4v-18h4v18zm6 0h-4v-12h4v12zm6 0h-4v-4h4v4zm1 2h-24v2h24v-2z",view:"M12.015 7c4.751 0 8.063 3.012 9.504 4.636-1.401 1.837-4.713 5.364-9.504 5.364-4.42 0-7.93-3.536-9.478-5.407 1.493-1.647 4.817-4.593 9.478-4.593zm0-2c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 3c-2.209 0-4 1.792-4 4 0 2.209 1.791 4 4 4s4-1.791 4-4c0-2.208-1.791-4-4-4z",viewHide:"M19.604 2.562l-3.346 3.137c-1.27-.428-2.686-.699-4.243-.699-7.569 0-12.015 6.551-12.015 6.551s1.928 2.951 5.146 5.138l-2.911 2.909 1.414 1.414 17.37-17.035-1.415-1.415zm-6.016 5.779c-3.288-1.453-6.681 1.908-5.265 5.206l-1.726 1.707c-1.814-1.16-3.225-2.65-4.06-3.66 1.493-1.648 4.817-4.594 9.478-4.594.927 0 1.796.119 2.61.315l-1.037 1.026zm-2.883 7.431l5.09-4.993c1.017 3.111-2.003 6.067-5.09 4.993zm13.295-4.221s-4.252 7.449-11.985 7.449c-1.379 0-2.662-.291-3.851-.737l1.614-1.583c.715.193 1.458.32 2.237.32 4.791 0 8.104-3.527 9.504-5.364-.729-.822-1.956-1.99-3.587-2.952l1.489-1.46c2.982 1.9 4.579 4.327 4.579 4.327z",star:"M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z",play:"M3 22v-20l18 10-18 10z",download:"M12 21l-8-9h6v-12h4v12h6l-8 9zm9-1v2h-18v-2h-2v4h22v-4h-2z",pause:"M11 22h-4v-20h4v20zm10-20h-4v20h4v-20z",zoom:"M15.853 16.56c-1.683 1.517-3.911 2.44-6.353 2.44-5.243 0-9.5-4.257-9.5-9.5s4.257-9.5 9.5-9.5 9.5 4.257 9.5 9.5c0 2.442-.923 4.67-2.44 6.353l7.44 7.44-.707.707-7.44-7.44zm-6.353-15.56c4.691 0 8.5 3.809 8.5 8.5s-3.809 8.5-8.5 8.5-8.5-3.809-8.5-8.5 3.809-8.5 8.5-8.5z",like:"M15.43 8.814c.808-3.283 1.252-8.814-2.197-8.814-1.861 0-2.35 1.668-2.833 3.329-1.971 6.788-5.314 7.342-8.4 7.743v9.928c3.503 0 5.584.729 8.169 1.842 1.257.541 3.053 1.158 5.336 1.158 2.538 0 4.295-.997 5.009-3.686.5-1.877 1.486-7.25 1.486-8.25 0-1.649-1.168-2.446-2.594-2.507-1.21-.051-2.87-.277-3.976-.743zm3.718 4.321l-1.394.167s-.609 1.109.141 1.115c0 0 .201.01 1.069-.027 1.082-.046 1.051 1.469.004 1.563l-1.761.099c-.734.094-.656 1.203.141 1.172 0 0 .686-.017 1.143-.041 1.068-.056 1.016 1.429.04 1.551-.424.053-1.745.115-1.745.115-.811.072-.706 1.235.109 1.141l.771-.031c.822-.074 1.003.825-.292 1.661-1.567.881-4.685.131-6.416-.614-2.238-.965-4.437-1.934-6.958-2.006v-6c3.263-.749 6.329-2.254 8.321-9.113.898-3.092 1.679-1.931 1.679.574 0 2.071-.49 3.786-.921 5.533 1.061.543 3.371 1.402 6.12 1.556 1.055.059 1.025 1.455-.051 1.585z",comment:"M12 1c-6.338 0-12 4.226-12 10.007 0 2.05.739 4.063 2.047 5.625l-1.993 6.368 6.946-3c1.705.439 3.334.641 4.864.641 7.174 0 12.136-4.439 12.136-9.634 0-5.812-5.701-10.007-12-10.007zm0 1c6.065 0 11 4.041 11 9.007 0 4.922-4.787 8.634-11.136 8.634-1.881 0-3.401-.299-4.946-.695l-5.258 2.271 1.505-4.808c-1.308-1.564-2.165-3.128-2.165-5.402 0-4.966 4.935-9.007 11-9.007zm-5 7.5c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm5 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm5 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z",share:"M6 17c2.269-9.881 11-11.667 11-11.667v-3.333l7 6.637-7 6.696v-3.333s-6.17-.171-11 5zm12 .145v2.855h-16v-12h6.598c.768-.787 1.561-1.449 2.339-2h-10.937v16h20v-6.769l-2 1.914z",minimize:"M24 22h-24v-20h24v20zm-23-9v8h10v-8h-10zm22 8v-18h-22v9h11v9h11zm-4-9h-5v-5h1v3.241l5.241-5.241.759.759-5.241 5.241h3.241v1z"};function r(e){let r=e.style||{};return(0,t.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:e.size||24,height:e.size||24,viewBox:e.viewBox||"0 0 24 24",style:{verticalAlign:"bottom",display:"inline-block",margin:"0 5px",cursor:"pointer",...r},className:e.className||"",fillRule:"evenodd",onClick:e.onClick,children:(0,t.jsx)("path",{d:e.d||n[e.id],fill:e.color||"currentcolor"})})}e.s(["default",()=>r])},78115,38607,98395,10739,75092,18611,__turbopack_context__=>{"use strict";var __TURBOPACK__imported__module__91398__=__turbopack_context__.i(91398),__TURBOPACK__imported__module__91788__=__turbopack_context__.i(91788),__TURBOPACK__imported__module__60814__=__turbopack_context__.i(60814),__TURBOPACK__imported__module__41158__=__turbopack_context__.i(41158);let allColors=[{name:"blue",value:"#21b0df"},{name:"orange",value:"#ffa858"},{name:"yellow",value:"#ddc800"},{name:"violet",value:"#9494ff"},{name:"green",value:"#43f0a5"},{name:"red",value:"#ff7f7f"},{name:"lavender",value:"#d165ff"},{name:"magenta",value:"#ff6bdd"},{name:"gray",value:"#a0a0a0"},{name:"lemon",value:"#afea30"}];function getColorArr(e,t=allColors){let n=t.map(e=>e.value||e);for(n.sort(()=>Math.random()-.5);e>n.length;)n=[...n,...n];return n.slice(0,e)}function inputStrToArr({text:e,breakLine:t}){let n;return n=-1!==e.indexOf("\n")?e.split("\n").map(e=>e.trim()).filter(e=>""!==e):e.split(",").map(e=>e.trim()).filter(e=>""!==e),t&&(n=-1!==n[0].indexOf("|")?n.map(e=>e.split("|").map(e=>e.trim()).filter(e=>""!==e)):n.map(e=>e.split(",").map(e=>e.trim()).filter(e=>""!==e))),n}function generateRandomCompare(data,count=10,isNonNegative,isUnique){let list=[],counter=0;for(;list.length<count;){let pattern=data.pattern;pattern=getRepeated(pattern),pattern=pattern.split(" ");let item=[...pattern];for(let k=0;k<pattern.length;k+=2)item[k]=getFormatedRandom(item[k]);item=item.join(" "),!(isNonNegative&&0>eval(item))&&(!isUnique||!(counter<100)||-1===list.indexOf(item))&&(list.push(item),counter++)}return list}function getRepeated(e){let t=["s","t","u","v"];for(let n=0;n<t.length;n++)if(-1!==e.indexOf(t[n])){let r=Math.ceil(9*Math.random());e=e.replaceAll(t[n],()=>r)}else break;return e}function getFormatedRandom(e){let t=e.split(/(\{\d+_\d+\})/).filter(e=>""!==e.trim()),n=Math.pow(10,(t=(t=t.map(e=>"{"===e.charAt(0)?e:e.split(""))).flat()).length),r=Math.pow(10,t.length-1),o=""+Math.floor(Math.random()*(n-r)+r);for(let e=0;e<t.length;e++)if("{"===t[e].charAt(0)){let n=+t[e].substring(1,t[e].indexOf("_")),r=+t[e].substring(t[e].indexOf("_")+1,t[e].length-1);t[e]=Math.round(Math.random()*(r-n))+n}else switch(t[e]){case"x":t[e]=o[e];break;case"a":t[e]=Math.ceil(4*Math.random());break;case"b":t[e]=Math.ceil(5*Math.random())+4;break;case"c":t[e]=Math.ceil(5*Math.random())}let i=t.map(e=>""+e).join("");return -1!==i.indexOf(".")&&"0"===i.charAt(o.length-1)&&(i=i.slice(0,i.length-1)+Math.ceil(9*Math.random())),+i}function getLocalItem(e,t=[]){let n=window.localStorage;if(!n)return t;let r=n.getItem(e);if(!r)return t;try{return JSON.parse(r)}catch(e){return t}}function setLocalItem(e,t){let n=localStorage||window.localStorage;n&&n.setItem(e,JSON.stringify(t))}function removeLocalItem(e){let t=localStorage||window.localStorage;t&&t.removeItem(e)}function getRandIndex(e,t=!0){if(e.length)return e.map((e,n)=>{let r=[...Array(e.options.length)].map((e,t)=>t);return e.noRandom||(t?r.sort(()=>Math.random()-.5):r=shuffleAll(r)),[...r]});{let n=[...Array(e)].map((e,t)=>t);return t?n.sort(()=>Math.random()-.5):n=shuffleAll(n),[...n]}}function shuffleAll(e){let t,n=[...e];for(;;){n.sort((e,t)=>Math.random()-.5),t=!1;for(let r=0;r<e.length;r++)if(e[r]===n[r]){t=!0;break}if(!t)return n}}let getPos=e=>e.clientX?{x:e.clientX,y:e.clientY}:e.touches&&e.touches[0]&&e.touches[0].clientX?e.touches.length>1?null:{x:e.touches[0].clientX,y:e.touches[0].clientY}:e.changedTouches&&e.changedTouches[0]&&e.changedTouches[0].clientX?e.changedTouches.length>1?null:{x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY}:void 0;function setStyles(e,t){for(let n in t)e.style[n]=t[n]}function getAsset(e){let t="https://asset.pschool.in";return 0===e.indexOf("http")?e:`${t}/${e}`}function getBasePath(){try{if(window.__NEXT_DATA__&&window.__NEXT_DATA__.basePath)return window.__NEXT_DATA__.basePath;if((window.location.pathname||"").startsWith("/lms-system"))return"/lms-system"}catch(e){}return""}function publicPath(e){if(!e)return e;let t=e.startsWith("/")?e:"/"+e;return getBasePath()+t}function getFile(e,t){let n="https://asset.pschool.in";if(!t||"audio"===t)return`${n}/sound/${e}`}function loadAsset(e){if(0===e.indexOf("http"))return e;let t="https://asset.pschool.in";return`${t}/${e}`}function getImage(e,t){if(console.log("getImage id",e),-1!==e.indexOf(">")&&(e=e.replaceAll(">","/")),-1===e.indexOf(".")&&(e=`${e}.jpg`),0===e.indexOf("http"))return e;let n="https://asset.pschool.in";return"dragDrop"===t?-1!==e.indexOf("/")?`/img/${e}`:`/img/dragDrop/${e}`:-1!==e.indexOf("/")?`/img/${e}`:t?`${n}/${t}/${e}`:`${n}/stockimg/${e}`}function generateDataFromPattern(data,count=4){let list=[];for(let i=0;i<10;i++){let arr=[],pattern=data.pattern;pattern=getRepeated(pattern),pattern=pattern.split(" ");let values=[];for(;arr.length<count;){let item=[...pattern];for(let k=0;k<pattern.length;k+=2)item[k]=getFormatedRandom(item[k]);item=item.join(" ");let val=eval(item);val<0||-1!==values.indexOf(val)||(values.push(val),arr.push(item))}arr.sort((a,b)=>"biggest"===data.probType||"descending"===data.probType?eval(b)-eval(a):eval(a)-eval(b)),arr=arr.map(e=>e.replace("*","×")),arr=arr.map(e=>e.replace("-","–"));let randArr=[...Array(arr.length)].map((e,t)=>t);randArr.sort(()=>Math.random()-.5),"descending"===data.probType||"ascending"===data.probType?list.push({options:arr,randArr}):list.push({words:arr,randArr})}return list}function getTimeStr(e){let t=Math.floor(e/60),n=e%60;return t<=9&&(t="0"+t),n<=9&&(n="0"+n),`${t}:${n}`}function delay(e){return new Promise(t=>setTimeout(()=>t("doneFromDelay"),e))}function setAttrs(e,t){if(e)for(let n in t)e.setAttribute(n,t[n])}function isValidEmail(e){return/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(e).toLowerCase())}function toggleDisableBtn(e,t){t?(e.classList.add("callInProg"),e.setAttribute("disabled","true")):(e.classList.remove("callInProg"),e.removeAttribute("disabled"))}let months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function getDateStr(e){if(!e)return null;isNaN(e)||(e*=1);let t=new Date(e);return`${months[t.getMonth()]} ${t.getDate()}`}function isSmallScreen(){return window.innerWidth<900}function inIframe(){try{return window.self!==window.top}catch(e){return!0}}__turbopack_context__.s(["getImage",()=>getImage,"getLocalItem",()=>getLocalItem,"loadAsset",()=>loadAsset,"publicPath",()=>publicPath,"setLocalItem",()=>setLocalItem],38607);var __TURBOPACK__imported__module__272__=__turbopack_context__.i(272),__TURBOPACK__imported__module__91398__1=__TURBOPACK__imported__module__91398__,__TURBOPACK__imported__module__60814__1=__TURBOPACK__imported__module__60814__,__TURBOPACK__imported__module__91788__1=__TURBOPACK__imported__module__91788__;let InputWrapper=__TURBOPACK__imported__module__60814__1.default.div.withConfig({displayName:"InputWrap__InputWrapper",componentId:"sc-768cbaeb-0"})`
  margin: 10px 0;

  ${e=>e.sameLine&&__TURBOPACK__imported__module__60814__1.css`
      display: flex;
      margin-right: 20px;
    `} & input {
    border: none;
    outline: none;
    border-bottom: 1px solid ${e=>e.error?"#f00":"#ccc"};
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
`,InputWrap=({error:e,label:t,children:n,sameLine:r,...o})=>(0,__TURBOPACK__imported__module__91398__1.jsxs)(InputWrapper,{error:e,style:o.style,sameLine:r,children:[!!t&&(0,__TURBOPACK__imported__module__91398__1.jsx)("label",{children:t}),n,e&&(0,__TURBOPACK__imported__module__91398__1.jsx)("label",{className:"errorLable",children:e})]}),__TURBOPACK__default__export__=InputWrap;var __TURBOPACK__imported__module__91398__2=__TURBOPACK__imported__module__91398__,__TURBOPACK__imported__module__60814__2=__TURBOPACK__imported__module__60814__,__TURBOPACK__imported__module__91788__2=__TURBOPACK__imported__module__91788__,__TURBOPACK__imported__module__79186__=__turbopack_context__.i(79186);let InputWrapper1=__TURBOPACK__imported__module__60814__2.default.div.withConfig({displayName:"Input__InputWrapper",componentId:"sc-acb101f1-0"})`
  margin: 10px 0;

  ${e=>e.sameLine&&__TURBOPACK__imported__module__60814__2.css`
      display: flex;
      margin-right: 20px;
    `} & input, textarea {
    border: none;
    outline: none;
    border-bottom: 1px solid ${e=>e.error?"#f00":"#ccc"};
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
`,Input=({error:e,label:t,sameLine:n,...r})=>(0,__TURBOPACK__imported__module__91398__2.jsxs)(InputWrapper1,{sameLine:n,error:e,style:r.style,children:[!!t&&(0,__TURBOPACK__imported__module__91398__2.jsx)("label",{htmlFor:t,children:t}),(0,__TURBOPACK__imported__module__91398__2.jsxs)("div",{style:{width:r.width||""},children:[(0,__TURBOPACK__imported__module__91398__2.jsx)("input",{id:t,type:"text",...r}),e&&(0,__TURBOPACK__imported__module__91398__2.jsx)("label",{className:"errorLable",children:e})]})]}),TextArea=({error:e,label:t,sameLine:n,...r})=>{let o=(0,__TURBOPACK__imported__module__91788__2.useRef)(null);return(0,__TURBOPACK__imported__module__91398__2.jsxs)(InputWrapper1,{sameLine:n,error:e,style:r.style,children:[!!t&&(0,__TURBOPACK__imported__module__91398__2.jsx)("label",{htmlFor:t,children:t}),(0,__TURBOPACK__imported__module__91398__2.jsx)("textarea",{id:t,ref:o,...r}),e&&(0,__TURBOPACK__imported__module__91398__2.jsx)("label",{className:"errorLable",children:e})]})},FileUpload=({error:e,iconOnly:t,label:n,...r})=>(0,__TURBOPACK__imported__module__91398__2.jsxs)("div",{children:[(0,__TURBOPACK__imported__module__91398__2.jsx)("label",{htmlFor:"fileUpload",className:t?"":"button is-primary",children:t?(0,__TURBOPACK__imported__module__91398__2.jsx)(__TURBOPACK__imported__module__79186__.default,{id:"upload"}):n}),(0,__TURBOPACK__imported__module__91398__2.jsxs)("div",{children:[(0,__TURBOPACK__imported__module__91398__2.jsx)("input",{id:"fileUpload",style:{display:"none"},type:"file",...r}),e&&(0,__TURBOPACK__imported__module__91398__2.jsx)("label",{className:"errorLable",children:e})]})]}),__TURBOPACK__default__export__1=Input;__turbopack_context__.s(["default",0,__TURBOPACK__default__export__1],98395);var __TURBOPACK__imported__module__60814__3=__TURBOPACK__imported__module__60814__;let InputNumber=__TURBOPACK__imported__module__60814__3.default.input.attrs({type:"number"}).withConfig({displayName:"InputNumber",componentId:"sc-b8714d9f-0"})`
  width: 50px;
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 3px;
  outline: none;
`,__TURBOPACK__default__export__2=InputNumber;var __TURBOPACK__imported__module__91398__3=__TURBOPACK__imported__module__91398__,__TURBOPACK__imported__module__60814__4=__TURBOPACK__imported__module__60814__,__TURBOPACK__imported__module__91788__3=__TURBOPACK__imported__module__91788__;let CheckboxWrapper=__TURBOPACK__imported__module__60814__4.default.div.withConfig({displayName:"Checkbox__CheckboxWrapper",componentId:"sc-1bf5732d-0"})`
  outline: none;
  margin: 10px 0;
  & input[type='checkbox'] {
    width: 16px;
    height: 16px;
    display: inline-block;
    border-radius: 4px;
    vertical-align: middle;
    border: ${e=>e.checked?"":"2px solid #cccccc"};
    outline: none;
    transform: scale(1.5);
  }

  & .contentWrap {
    display: inline-block;
    margin-left: 10px;
    cursor: pointer;
  }
`,Checkbox=({onClick:e,children:t,checked:n})=>(0,__TURBOPACK__imported__module__91398__3.jsxs)(CheckboxWrapper,{onClick:e,role:"checkbox","aria-checked":n,tabIndex:0,checked:n,children:[(0,__TURBOPACK__imported__module__91398__3.jsx)("input",{type:"checkbox",checked:n}),(0,__TURBOPACK__imported__module__91398__3.jsx)("span",{className:"contentWrap",children:t})]}),__TURBOPACK__default__export__3=Checkbox;var __TURBOPACK__imported__module__91398__4=__TURBOPACK__imported__module__91398__,__TURBOPACK__imported__module__60814__5=__TURBOPACK__imported__module__60814__,__TURBOPACK__imported__module__91788__4=__TURBOPACK__imported__module__91788__;let CheckboxWrapper1=__TURBOPACK__imported__module__60814__5.default.div.withConfig({displayName:"Radio__CheckboxWrapper",componentId:"sc-6f4effd8-0"})`
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
`,Radio=({onClick:e,options:t,value:n,name:r})=>(0,__TURBOPACK__imported__module__91398__4.jsx)("div",{children:t.map((t,o)=>(0,__TURBOPACK__imported__module__91398__4.jsxs)(CheckboxWrapper1,{checked:t.value===n,children:[(0,__TURBOPACK__imported__module__91398__4.jsx)("input",{type:"radio",checked:t.value===n,name:r,value:t.value,onChange:()=>e(t.value)}),(0,__TURBOPACK__imported__module__91398__4.jsx)("label",{children:t.label})]},o))}),__TURBOPACK__default__export__4=Radio;var __TURBOPACK__imported__module__91398__5=__TURBOPACK__imported__module__91398__,__TURBOPACK__imported__module__91788__5=__TURBOPACK__imported__module__91788__,__TURBOPACK__imported__module__60814__6=__TURBOPACK__imported__module__60814__;let Loader=(0,__TURBOPACK__imported__module__91398__5.jsx)("div",{children:"..."}),ring=__TURBOPACK__imported__module__60814__6.keyframes`
0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`,StyledButton=(0,__TURBOPACK__imported__module__60814__6.default)("button").withConfig({displayName:"Button__StyledButton",componentId:"sc-35cf991c-0"})`
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
  ${e=>e.primary&&__TURBOPACK__imported__module__60814__6.css`
      background-color: var(--darkColor);

      color: #fff;
    `}
  ${e=>e.secondary&&__TURBOPACK__imported__module__60814__6.css`
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
`,ProgButton=({children:e,updating:t,...n})=>(0,__TURBOPACK__imported__module__91398__5.jsxs)(StyledButton,{...n,ref:n.innerRef,children:[e,(0,__TURBOPACK__imported__module__91398__5.jsxs)("div",{className:"updating",children:[(0,__TURBOPACK__imported__module__91398__5.jsx)("div",{}),(0,__TURBOPACK__imported__module__91398__5.jsx)("div",{}),(0,__TURBOPACK__imported__module__91398__5.jsx)("div",{}),(0,__TURBOPACK__imported__module__91398__5.jsx)("div",{})]})]}),Button=({children:e,updating:t,...n})=>(0,__TURBOPACK__imported__module__91398__5.jsx)(StyledButton,{...n,children:e}),__TURBOPACK__default__export__5=Button;__turbopack_context__.s(["default",0,__TURBOPACK__default__export__5],10739);var __TURBOPACK__imported__module__60814__7=__TURBOPACK__imported__module__60814__;let ButtonBar=__TURBOPACK__imported__module__60814__7.default.div.withConfig({displayName:"ButtonBar",componentId:"sc-53964f1e-0"})`
  display: flex;
  justify-content: ${e=>"left"===e.align?"flext-start":"flex-end"};
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
`,__TURBOPACK__default__export__6=ButtonBar;var __TURBOPACK__imported__module__91398__6=__TURBOPACK__imported__module__91398__,__TURBOPACK__imported__module__91788__6=__TURBOPACK__imported__module__91788__,__TURBOPACK__imported__module__60814__8=__TURBOPACK__imported__module__60814__;let OverlayWrapper=__TURBOPACK__imported__module__60814__8.default.div.withConfig({displayName:"Overlay__OverlayWrapper",componentId:"sc-78964d82-0"})`
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
    ${e=>e.bgOpacity?e.bgOpacity:0}
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
    left: ${e=>`${e.left||400}px`};
    top: ${e=>`${e.top||300}px`};
    width: ${e=>`${e.width||400}px`};
    height: ${e=>e.height?`${e.height}px`:"auto"};
    overflow-y: auto;
    position: absolute;
    background-color: ${e=>e.bgColor||"white"};
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
    padding: ${e=>e.padding||"10px"};
    background-color: ${e=>e.bgColor||"white"};
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
`;class Overlay extends __TURBOPACK__imported__module__91788__6.default.Component{constructor(){super(),this.dragPanel=null,this.rootBox={},this.dragOffset=null}panelDragStart=e=>{e.preventDefault(),this.dragPanel=e.currentTarget.parentNode,this.dragOffset={x:e.clientX-this.dragPanel.getBoundingClientRect().left,y:e.clientY-this.dragPanel.getBoundingClientRect().top},this.rootBox={left:0,right:0,top:0,bottom:0},document.addEventListener("mousemove",this.panelDragMove),document.addEventListener("mouseup",this.panelDragStop)};panelDragMove=e=>{let t=e.clientX-this.dragOffset.x;t<this.rootBox.left&&(t=this.rootBox.left),t>this.rootBox.left+this.rootBox.width-this.dragPanel.getBoundingClientRect().width&&(t=this.rootBox.left+this.rootBox.width-this.dragPanel.getBoundingClientRect().width);let n=e.clientY-this.dragOffset.y+window.scrollY;n<this.rootBox.top&&(n=this.rootBox.top),n>this.rootBox.top+this.rootBox.height-this.dragPanel.getBoundingClientRect().height&&(n=this.rootBox.top+this.rootBox.height-this.dragPanel.getBoundingClientRect().height),this.dragPanel.style.left=`${t}px`,this.dragPanel.style.top=`${n-window.scrollY}px`};panelDragStop=e=>{document.removeEventListener("mousemove",this.panelDragMove),document.removeEventListener("mouseup",this.panelDragStop)};render(){let{title:e,children:t,onClose:n,...r}=this.props;return(0,__TURBOPACK__imported__module__91398__6.jsxs)(OverlayWrapper,{...r,children:[(0,__TURBOPACK__imported__module__91398__6.jsx)("div",{className:"background",onClick:e=>{e.stopPropagation(),e.preventDefault()}}),(0,__TURBOPACK__imported__module__91398__6.jsxs)("div",{className:"overlayContent",children:[(0,__TURBOPACK__imported__module__91398__6.jsxs)("div",{className:"title",onMouseDown:this.panelDragStart,children:[(0,__TURBOPACK__imported__module__91398__6.jsx)("div",{children:e}),n&&(0,__TURBOPACK__imported__module__91398__6.jsx)("div",{className:"overlayClose icon-times",onClick:n,children:"×"})]}),(0,__TURBOPACK__imported__module__91398__6.jsx)("div",{className:"body",children:t})]})]})}}let __TURBOPACK__default__export__7=Overlay;var __TURBOPACK__imported__module__91398__7=__TURBOPACK__imported__module__91398__,__TURBOPACK__imported__module__91788__7=__TURBOPACK__imported__module__91788__,__TURBOPACK__imported__module__60814__9=__TURBOPACK__imported__module__60814__,__TURBOPACK__imported__module__79186__1=__TURBOPACK__imported__module__79186__;let Styled=__TURBOPACK__imported__module__60814__9.default.div.withConfig({displayName:"Select__Styled",componentId:"sc-f454b202-0"})`
  width: ${e=>e.width||"130px"};
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
`;function Select(e){let[t,n]=(0,__TURBOPACK__imported__module__91788__7.useState)({open:!1}),r=e.options;"string"==typeof r[0]&&(r=r.map(e=>({label:e,value:e})));let o=r.find(t=>t.value===e.value||t.id===e.value),i=()=>{n(e=>({...e,open:!1}))};return(0,__TURBOPACK__imported__module__91788__7.useEffect)(()=>(document.addEventListener("click",i),()=>document.removeEventListener("click",i)),[]),(0,__TURBOPACK__imported__module__91398__7.jsx)(__TURBOPACK__default__export__,{label:e.label,sameLine:e.sameLine||!1,children:(0,__TURBOPACK__imported__module__91398__7.jsxs)(Styled,{width:e.width,tabIndex:"0",children:[!t.open&&(0,__TURBOPACK__imported__module__91398__7.jsxs)("div",{className:"control",onClick:e=>{e.stopPropagation(),n({...t,open:!0})},children:[(0,__TURBOPACK__imported__module__91398__7.jsx)("div",{className:"placeholder",children:o?o.label:"Select"}),(0,__TURBOPACK__imported__module__91398__7.jsx)(__TURBOPACK__imported__module__79186__1.default,{id:"caretDown",size:"12",style:{position:"absolute",right:10,top:10}})]}),t.open&&(0,__TURBOPACK__imported__module__91398__7.jsx)("div",{className:"menu",children:r.map((r,o)=>(0,__TURBOPACK__imported__module__91398__7.jsx)("div",{onClick:()=>{e.onChange(r),n({...t,open:!1})},children:r.label},r.value||r.id||o))})]})})}var __TURBOPACK__imported__module__91398__8=__TURBOPACK__imported__module__91398__,__TURBOPACK__imported__module__60814__10=__TURBOPACK__imported__module__60814__,__TURBOPACK__imported__module__91788__8=__TURBOPACK__imported__module__91788__;let SectionWrapper=__TURBOPACK__imported__module__60814__10.default.div.withConfig({displayName:"Section__SectionWrapper",componentId:"sc-864b9930-0"})`
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
`,Section=({title:e,style:t,children:n,btnBar:r})=>(0,__TURBOPACK__imported__module__91398__8.jsxs)(SectionWrapper,{children:[(0,__TURBOPACK__imported__module__91398__8.jsxs)("div",{className:"sec-head",children:[(0,__TURBOPACK__imported__module__91398__8.jsx)("h2",{children:e}),r]}),(0,__TURBOPACK__imported__module__91398__8.jsx)("div",{className:"sectionBody",style:t,children:n})]}),__TURBOPACK__default__export__8=Section;var __TURBOPACK__imported__module__91398__9=__TURBOPACK__imported__module__91398__,__TURBOPACK__imported__module__60814__11=__TURBOPACK__imported__module__60814__,__TURBOPACK__imported__module__91788__9=__TURBOPACK__imported__module__91788__;let LinkButtonStyled=__TURBOPACK__imported__module__60814__11.default.div.withConfig({displayName:"LinkButton__LinkButtonStyled",componentId:"sc-620befe9-0"})`
  padding: 10px;
  text-align: right;
  font-size: 0.8em;
  text-decoration: underline;
  cursor: pointer;
`,LinkButton=({children:e,...t})=>(0,__TURBOPACK__imported__module__91398__9.jsx)(LinkButtonStyled,{...t,role:"button",children:e}),__TURBOPACK__default__export__9=LinkButton;__turbopack_context__.s([],75092),__turbopack_context__.s(["Select",()=>Select],18611);let Styled1=__TURBOPACK__imported__module__60814__.default.div.withConfig({displayName:"IconViewMini__Styled",componentId:"sc-3f2e9eca-0"})`
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
`,defaultCardStyle={width:120,margin:"25px 0",borderRadius:10},getIconStyle=(e,t)=>{let n=t.iconStyle||{width:80,height:80};if(e&&e.id&&!isNaN(e.id)){let t=__TURBOPACK__imported__module__272__.apiService.getIconUrl(e.id);return n.backgroundImage=`url(${t})`,n}let r=e,o=getImage(`${t.iconsLoc||"icons"}/${r}.png`),i=e=>e&&0!==e.indexOf("http")?publicPath(e.startsWith("/")?e:`/${e}`):e;return n.backgroundImage=`url(${i(o)})`,n};function IconView(e){let t,n=getLocalItem("config",{}),r=e.data||{};if(r.grades){let e=r.grades.find(e=>!0===e.default);e&&(t=e.id)}let[o,i]=(0,__TURBOPACK__imported__module__91788__.useState)({selectedGrade:n.selectedGrade||t}),a=r.list||[];if(r.grades){let e=o.selectedGrade.match(/(\d+)/),t=e&&+e[0]||0;a=a.filter(e=>{if(!e.grade)return!1;let n=e.grade.split("-").map(e=>+e);return 1===n.length?n[0]===t:n[0]<=t&&n[1]>=t})}let l=r.config||{};return(0,__TURBOPACK__imported__module__91398__.jsxs)(Styled1,{children:[(0,__TURBOPACK__imported__module__91398__.jsxs)("main",{style:r.style||{maxWidth:1024,fontSize:"1rem"},children:[(0,__TURBOPACK__imported__module__91398__.jsxs)("div",{className:"flex-sb",children:[r.label&&(0,__TURBOPACK__imported__module__91398__.jsx)("h1",{style:r.titleStyle||{},children:r.label}),r.grades&&(0,__TURBOPACK__imported__module__91398__.jsx)(Select,{width:"150px",options:r.grades,value:o.selectedGrade,bgColor:"inherit",onChange:e=>{let t=getLocalItem("config",{});t.selectedGrade=e.value||e.id,t.selectedSubject="all",setLocalItem("config",t),i({...o,selectedGrade:e.value||e.id})}})]}),(0,__TURBOPACK__imported__module__91398__.jsx)("div",{className:"topics",children:a.map(e=>{let t=e.style||{},n=r.cardStyle||defaultCardStyle;return n={...n,...t},(0,__TURBOPACK__imported__module__91398__.jsx)("div",{className:"card",style:n,children:(0,__TURBOPACK__imported__module__91398__.jsxs)(__TURBOPACK__imported__module__41158__.default,{href:`/p/${e.id}`,children:[!l.type&&(0,__TURBOPACK__imported__module__91398__.jsxs)(__TURBOPACK__imported__module__91398__.Fragment,{children:[(0,__TURBOPACK__imported__module__91398__.jsx)("div",{className:"img",style:{...getIconStyle(e,r),backgroundImage:`url(${function(){if(e.id&&!isNaN(e.id))return __TURBOPACK__imported__module__272__.apiService.getIconUrl(e.id);let t=getImage(`${r.iconsLoc||"icons"}/${e.img}.png`);return t&&0!==t.indexOf("http")?publicPath(t.startsWith("/")?t:`/${t}`):t}()})`}}),(0,__TURBOPACK__imported__module__91398__.jsx)("div",{className:"label",style:r.labelStyle||{},children:e.label}),e.smLabel&&(0,__TURBOPACK__imported__module__91398__.jsx)("div",{className:"smLabel",style:r.smLabelStyle||{},children:e.smLabel})]}),"descType"===l.type&&(0,__TURBOPACK__imported__module__91398__.jsxs)("div",{className:"descCard",children:[(0,__TURBOPACK__imported__module__91398__.jsxs)("div",{children:[(0,__TURBOPACK__imported__module__91398__.jsx)("div",{className:"label title",style:r.labelStyle||{},children:e.label}),e.smLabel&&(0,__TURBOPACK__imported__module__91398__.jsx)("div",{className:"smLabel",style:r.smLabelStyle||{},children:e.smLabel}),(0,__TURBOPACK__imported__module__91398__.jsx)("div",{className:"desc",style:r.descStyle||{},children:e.desc})]}),(0,__TURBOPACK__imported__module__91398__.jsx)("div",{className:"img",style:{...getIconStyle(e,r),backgroundImage:`url(${function(){if(e.id&&!isNaN(e.id))return __TURBOPACK__imported__module__272__.apiService.getIconUrl(e.id);let t=getImage(`${r.iconsLoc||"icons"}/${e.img}.png`);return t&&0!==t.indexOf("http")?publicPath(t.startsWith("/")?t:`/${t}`):t}()})`}})]})]})},e.id)})})]}),r.moreActivities&&(0,__TURBOPACK__imported__module__91398__.jsx)("div",{className:"hilight",children:(0,__TURBOPACK__imported__module__91398__.jsx)("div",{children:(0,__TURBOPACK__imported__module__91398__.jsx)(__TURBOPACK__imported__module__41158__.default,{href:`/p/${r.moreActivities}`,children:"More Activities"})})})]})}__turbopack_context__.s(["default",()=>IconView],78115)}]);