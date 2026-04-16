module.exports = [
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
    getIconUrl: (id)=>`${API_BASE}/v1/konzeptes/image/icon/${id}`
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/sweetalert2 [external] (sweetalert2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("sweetalert2", () => require("sweetalert2"));

module.exports = mod;
}),
"[project]/konzeptes/Intro.js [ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-components [external] (styled-components, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$UserDropdown$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/comps/UserDropdown.js [ssr] (ecmascript)");
;
;
;
;
;
// Gentle floating animation for the mascot to make it feel alive
const float = __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["keyframes"]`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;
const Styled = __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$components__$5b$external$5d$__$28$styled$2d$components$2c$__cjs$29$__["default"].div.withConfig({
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
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const basePath = router.basePath || '';
    // Converts your original coordinates into responsive percentages
    const getResponsivePos = (x, y)=>{
        return {
            left: `${x / 1100 * 100}%`,
            top: `${y / 700 * 100}%`
        };
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Styled, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "wrap",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$comps$2f$UserDropdown$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/konzeptes/Intro.js",
                    lineNumber: 391,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-container",
                    children: bgList.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: item.pos.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "top-row",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "center-content",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    children: "WELCOME TO KONZEPTES!"
                                }, void 0, false, {
                                    fileName: "[project]/konzeptes/Intro.js",
                                    lineNumber: 422,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bottom-row",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
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
}),
"[project]/pages/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// import { useState, useEffect } from 'react';
// import { apiService } from '../utils/apiService'; // Import the service
// import Swal from 'sweetalert2';
// import Intro from 'konzeptes/Intro';
// import './login.css';
// export default function HomeView() {
//   const [isSignup, setIsSignup] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   // --- State for Real-time Input Tracking ---
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
//   // 🔐 Check login state ONCE
//   useEffect(() => {
//     const loggedIn = localStorage.getItem('isLoggedIn');
//     if (loggedIn === 'true') {
//       setIsLoggedIn(true);
//     }
//   }, []);
//   // ================= VALIDATION LOGIC =================
//   function validatePassword(password) {
//     // Regex: At least 1 Upper, 1 Lower, 1 Number, 1 Special Char, Max 16 chars
//     const regex =
//       /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]\\;':,.\/?]).{1,16}$/;
//     return regex.test(password);
//   }
//   function validateEmail(email) {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   }
//   function validateMobile(mobile) {
//     return /^[6-9]\d{9}$/.test(mobile);
//   }
//   // ================= LOGIN HANDLER =================
//   async function handleLogin(e) {
//     e.preventDefault();
//     try {
//       // const res = await fetch('http://localhost:8080/ords/lms/v2/user/login', {
//       //   method: 'POST',
//       //   headers: { 'Content-Type': 'application/json' },
//       //   body: JSON.stringify({ email: loginEmail, password: loginPassword }),
//       // });
//       // Cleaner call! No hardcoded URL.
//       const response = await apiService.login({
//         email: loginEmail,
//         password: loginPassword,
//       });
//       const data = response.data;
//       // const data = await res.json();
//       console.log('Login API Raw Data:', data); // Check this on the LOGIN PAGE console
//       if (data.status === 'success') {
//         // FIX: Handle potential case sensitivity from Oracle
//         const uid = data.user_id || data.USER_ID;
//         if (uid) {
//           localStorage.setItem('user_id', uid.toString());
//           localStorage.setItem('user_email', loginEmail);
//           localStorage.setItem('isLoggedIn', 'true');
//           localStorage.setItem(
//             'child_name',
//             data.child_name || data.user || 'Student'
//           );
//           setIsLoggedIn(true);
//         } else {
//           Swal.fire({
//             icon: 'error',
//             text: 'Critical Error: User ID not received from server',
//           });
//         }
//       } else {
//         Swal.fire({ icon: 'error', text: data.message || 'Login Failed' });
//       }
//     } catch (error) {
//       console.error(error);
//     }
//     const email = loginEmail;
//     const password = loginPassword;
//     // 1. Client-side Check
//     if (!validatePassword(password)) {
//       await Swal.fire({
//         icon: 'error',
//         text: 'Password must contain uppercase, lowercase, number & special character',
//       });
//       return;
//     }
//     try {
//       const res = await fetch(
//         // 'http://192.168.0.127:8080/ords/lms/auth/login',
//         'http://192.168.0.127:8080/ords/lms/v2/user/login',
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email, password }),
//         }
//       );
//       const data = await res.json();
//       console.log('DEBUG: Data from Oracle:', data);
//       // 🛑 BUG FIX: Check for "Fake 200 OK" or explicit error messages
//       const isFailure =
//         !res.ok ||
//         (data.message && data.message.toLowerCase().includes('invalid')) ||
//         (data.message && data.message.toLowerCase().includes('fail')) ||
//         (data.message && data.message.toLowerCase().includes('incorrect'));
//       if (isFailure) {
//         await Swal.fire({
//           icon: 'error',
//           text: data.message || 'Invalid Email or Password',
//         });
//         return; // ⛔ STOP HERE
//       }
//       // ✅ SUCCESS
//       await Swal.fire({
//         icon: 'success',
//         text: data.message || 'Login Successfully!',
//       });
//       localStorage.setItem('user_id', data.user_id);
//       localStorage.setItem('user_email', email);
//       localStorage.removeItem('mcq_guest_id');
//       localStorage.setItem('isLoggedIn', 'true');
//       // 👇 KEY UPDATE: SAVE CHILD NAME FROM API 👇
//       if (data.child_name) {
//         localStorage.setItem('child_name', data.child_name);
//       } else if (data.user) {
//         // Fallback to parent name if child name is missing
//         localStorage.setItem('child_name', data.user);
//       } else {
//         localStorage.setItem('child_name', 'Student');
//       }
//       setIsLoggedIn(true);
//     } catch (error) {
//       console.error(error);
//       await Swal.fire({ icon: 'error', text: 'Server not reachable' });
//     }
//   }
//   // ================= REGISTER HANDLER =================
//   async function handleRegister(e) {
//     e.preventDefault();
//     if (!validateMobile(regMobile)) {
//       Swal.fire({ icon: 'error', text: 'Invalid mobile number' });
//       return;
//     }
//     if (!validateEmail(regEmail)) {
//       Swal.fire({ icon: 'error', text: 'Invalid email address' });
//       return;
//     }
//     if (!validatePassword(regPassword)) {
//       Swal.fire({
//         icon: 'error',
//         text: 'Password must contain uppercase, lowercase, number & special character',
//       });
//       return;
//     }
//     try {
//       const res = await fetch(
//         'http://192.168.0.127:8080/ords/lms/auth/register',
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             salutation: regSalutation,
//             parent_name: regParentName,
//             level: regLevel,
//             child_name: regChildName,
//             mobile: regMobile,
//             email: regEmail,
//             password: regPassword,
//           }),
//         }
//       );
//       const data = await res.json();
//       // 🛑 FIX: Check for "error" status or specific messages inside the data
//       const isFailure =
//         !res.ok ||
//         data.status === 'error' ||
//         (data.message && data.message.toLowerCase().includes('exists'));
//       if (isFailure) {
//         await Swal.fire({
//           icon: 'error',
//           text: data.message || 'Registration Failed',
//         });
//         return; // Stop here!
//       }
//       // ✅ SUCCESS
//       await Swal.fire({
//         icon: 'success',
//         text: 'Account Created Successfully!',
//       });
//       setIsSignup(false);
//     } catch {
//       Swal.fire({ icon: 'error', text: 'Server not reachable' });
//     }
//   }
//   // ================= LMS AFTER LOGIN =================
//   // if (isLoggedIn) {
//   //   // Added inline CSS here to scale the Intro page to 90%
//   //   return (
//   //     <div style={{ zoom: '0.9' }}>
//   //       <Intro />
//   //     </div>
//   //   );
//   // }
//   // ================= LMS AFTER LOGIN =================
//   if (isLoggedIn) {
//     // Removed the zoom hack, the new Intro.js handles scaling naturally!
//     return <Intro />;
//   }
//   // ================= LOGIN / REGISTER UI =================
//   return (
//     <div className="body">
//       {/* CSS for inline error */}
//       <style>{`
//         .error-text {
//           color: #ff4d4f; /* Red color */
//           font-size: 11px;
//           margin-top: 4px;
//           display: block;
//           font-weight: bold;
//           line-height: 1.2;
//         }
//       `}</style>
//       <div className="container">
//         <div className="mascotArea">
//           <img src="/mascot-owl.png" className="mascotImage" alt="Mascot" />
//         </div>
//         <div
//           className={isSignup ? 'formCard registerCard' : 'formCard loginCard'}
//         >
//           {/* ---------------- LOGIN ---------------- */}
//           {!isSignup && (
//             <div>
//               <div className="loginIcon">
//                 <img
//                   src="/lms-system/img/konzeptes/logo.png"
//                   className="loginIconImg"
//                   alt="Logo"
//                 />
//               </div>
//               {/* <h2 className="title">Login</h2> */}
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
//                     onClick={(event) => {
//                       const field = document.getElementById('loginPassword');
//                       const icon = event.target;
//                       if (field.type === 'password') {
//                         field.type = 'text';
//                         icon.textContent = '🙈';
//                       } else {
//                         field.type = 'password';
//                         icon.textContent = '👁️';
//                       }
//                     }}
//                   >
//                     👁️
//                   </span>
//                 </div>
//                 {/* 🔴 INLINE WARNING - Shows if password exists AND is invalid */}
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
//           {/* ---------------- REGISTER ---------------- */}
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
//                     placeholder="Mobile no "
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
//                   {/* INLINE WARNING - Shows if password exists AND is invalid */}
//                   {regPassword && !validatePassword(regPassword) && (
//                     <span className="error-text">
//                       ⚠️ Password must contain uppercase, lowercase, number &
//                       special character
//                     </span>
//                   )}
//                 </div>
//                 <button className="btn btnGreen" type="submit">
//                   Sign Up
//                 </button>
//                 <button
//                   type="button"
//                   className="linkBtn"
//                   onClick={() => setIsSignup(false)}
//                 >
//                   login to existing account
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
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/apiService.js [ssr] (ecmascript)"); // Centralized API service
var __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/sweetalert2 [external] (sweetalert2, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$konzeptes$2f$Intro$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/konzeptes/Intro.js [ssr] (ecmascript)");
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
function HomeView() {
    const [isSignup, setIsSignup] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isLoggedIn, setIsLoggedIn] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Login Form States
    const [loginEmail, setLoginEmail] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [loginPassword, setLoginPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    // Register Form States
    const [regSalutation, setRegSalutation] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [regParentName, setRegParentName] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [regChildName, setRegChildName] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [regLevel, setRegLevel] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [regMobile, setRegMobile] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [regEmail, setRegEmail] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [regPassword, setRegPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    // 🔐 Check login state ONCE on mount
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const loggedIn = localStorage.getItem('isLoggedIn');
        if (loggedIn === 'true') {
            setIsLoggedIn(true);
        }
    }, []);
    // ================= VALIDATION LOGIC =================
    const validatePassword = (password)=>{
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]\\;':,.\/?]).{1,16}$/;
        return regex.test(password);
    };
    const validateEmail = (email)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validateMobile = (mobile)=>/^[6-9]\d{9}$/.test(mobile);
    // ================= LOGIN HANDLER =================
    async function handleLogin(e) {
        e.preventDefault();
        // 1. Validation
        if (!validatePassword(loginPassword)) {
            __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                icon: 'error',
                text: 'Password must contain uppercase, lowercase, number & special character'
            });
            return;
        }
        try {
            // 2. Call Centralized apiService
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].login({
                email: loginEmail,
                password: loginPassword
            });
            const data = response.data; // Axios automatically parses JSON
            console.log('Login API Response:', data);
            // 3. Logic Check (ORDS sometimes sends success status even for failed logic)
            const isActuallyFailure = data.status === 'error' || data.message && data.message.toLowerCase().includes('fail') || data.message && data.message.toLowerCase().includes('invalid');
            if (isActuallyFailure) {
                __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                    icon: 'error',
                    text: data.message || 'Login Failed'
                });
                return;
            }
            // 4. Handle Success
            const uid = data.user_id || data.USER_ID;
            if (uid) {
                localStorage.setItem('user_id', uid.toString());
                localStorage.setItem('user_email', loginEmail);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.removeItem('mcq_guest_id');
                localStorage.setItem('child_name', data.child_name || data.user || 'Student');
                // This await ensures the popup stays on the login page until "OK" is clicked
                await __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                    icon: 'success',
                    text: 'Login Successfully!',
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#007bff'
                });
                setIsLoggedIn(true);
            } else {
                __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                    icon: 'error',
                    text: 'Critical Error: User ID missing from server'
                });
            }
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || 'Server not reachable';
            __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                icon: 'error',
                text: errorMsg
            });
        }
    }
    // ================= REGISTER HANDLER =================
    async function handleRegister(e) {
        e.preventDefault();
        if (!validateMobile(regMobile)) return __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
            icon: 'error',
            text: 'Invalid mobile number'
        });
        if (!validateEmail(regEmail)) return __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
            icon: 'error',
            text: 'Invalid email address'
        });
        if (!validatePassword(regPassword)) return __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
            icon: 'error',
            text: 'Weak Password'
        });
        try {
            // 1. Call Centralized apiService
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].register({
                salutation: regSalutation,
                parent_name: regParentName,
                level: regLevel,
                child_name: regChildName,
                mobile: regMobile,
                email: regEmail,
                password: regPassword
            });
            const data = response.data;
            // 2. Error Check
            if (data.status === 'error' || data.message && data.message.toLowerCase().includes('exists')) {
                __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                    icon: 'error',
                    text: data.message || 'Registration Failed'
                });
                return;
            }
            // 3. Success
            await __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                icon: 'success',
                text: 'Account Created Successfully!',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#007bff'
            });
            setIsSignup(false); // Switch to Login view
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Server error during registration';
            __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                icon: 'error',
                text: errorMsg
            });
        }
    }
    // ================= RENDER LOGIC =================
    if (isLoggedIn) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$konzeptes$2f$Intro$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/pages/index.js",
        lineNumber: 629,
        columnNumber: 26
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "body",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("style", {
                children: `
        .error-text { color: #ff4d4f; font-size: 11px; margin-top: 4px; display: block; font-weight: bold; line-height: 1.2; }
      `
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 633,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "mascotArea",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                            src: "/mascot-owl.png",
                            className: "mascotImage",
                            alt: "Mascot"
                        }, void 0, false, {
                            fileName: "[project]/pages/index.js",
                            lineNumber: 639,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 638,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: isSignup ? 'formCard registerCard' : 'formCard loginCard',
                        children: [
                            !isSignup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "loginIcon",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                            src: "/lms-system/img/konzeptes/logo.png",
                                            className: "loginIconImg",
                                            alt: "Logo"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/index.js",
                                            lineNumber: 649,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 648,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        className: "title",
                                        children: "𝚕𝚘𝚐𝚒𝚗"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 655,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                                        onSubmit: handleLogin,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "inputGroup",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    type: "email",
                                                    placeholder: "Email",
                                                    required: true,
                                                    value: loginEmail,
                                                    onChange: (e)=>setLoginEmail(e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 658,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 657,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "passwordWrapper",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
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
                                                        lineNumber: 667,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "toggleEye",
                                                        onClick: ()=>{
                                                            const f = document.getElementById('loginPassword');
                                                            f.type = f.type === 'password' ? 'text' : 'password';
                                                        },
                                                        children: "👁️"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 677,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 666,
                                                columnNumber: 17
                                            }, this),
                                            loginPassword && !validatePassword(loginPassword) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "error-text",
                                                children: "⚠️ Password must contain uppercase, lowercase, number & special character"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 688,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                className: "btn btnGreen",
                                                type: "submit",
                                                children: "Login"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 693,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "linkBtn",
                                                onClick: ()=>setIsSignup(true),
                                                children: "Create New Account"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 696,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 656,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 647,
                                columnNumber: 13
                            }, this),
                            isSignup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        className: "title",
                                        children: "Register"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 710,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                                        onSubmit: handleRegister,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "rowGroup",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "inputGroup",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                children: "Salutation *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 714,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                required: true,
                                                                value: regSalutation,
                                                                onChange: (e)=>setRegSalutation(e.target.value),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: "Select"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 720,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        children: "Mr"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 721,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        children: "Mrs"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 722,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        children: "Ms"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 723,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 715,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 713,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "inputGroup",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                children: "Parent Name *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 727,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                placeholder: "Parent Name",
                                                                required: true,
                                                                value: regParentName,
                                                                onChange: (e)=>setRegParentName(e.target.value)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 728,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 726,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 712,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "rowGroup_1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "inputGroup",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                children: "Level *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 739,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                required: true,
                                                                value: regLevel,
                                                                onChange: (e)=>setRegLevel(e.target.value),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: "Select "
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 745,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "easy",
                                                                        children: "Easy"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 746,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "intermediate",
                                                                        children: "Intermediate"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 747,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "hard",
                                                                        children: "Hard"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 748,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 740,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 738,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "inputGroup",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                children: "Child Name *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 752,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                placeholder: "Child Name",
                                                                required: true,
                                                                value: regChildName,
                                                                onChange: (e)=>setRegChildName(e.target.value)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 753,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 751,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 737,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "inputGroup",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        children: "Mobile *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 763,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "Mobile no",
                                                        required: true,
                                                        value: regMobile,
                                                        onChange: (e)=>setRegMobile(e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 764,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 762,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "inputGroup",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        children: "Email *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 773,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                        type: "email",
                                                        placeholder: "Email",
                                                        required: true,
                                                        value: regEmail,
                                                        onChange: (e)=>setRegEmail(e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 774,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 772,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "inputGroup",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        children: "Password *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 783,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                        type: "password",
                                                        required: true,
                                                        maxLength: 16,
                                                        placeholder: "Password",
                                                        value: regPassword,
                                                        onChange: (e)=>setRegPassword(e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 784,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 782,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                className: "btn btnGreen",
                                                type: "submit",
                                                children: "Sign Up"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 793,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "linkBtn",
                                                onClick: ()=>setIsSignup(false),
                                                children: "Back to Login"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 796,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 711,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 709,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 642,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 637,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/index.js",
        lineNumber: 632,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__f2fcc671._.js.map