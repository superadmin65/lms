module.exports = [
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

////
__turbopack_context__.s([
    "default",
    ()=>HomeView
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/sweetalert2 [external] (sweetalert2, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$konzeptes$2f$Intro$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/konzeptes/Intro.js [ssr] (ecmascript)");
;
;
;
;
;
function HomeView() {
    const [isSignup, setIsSignup] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isLoggedIn, setIsLoggedIn] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // --- State for Real-time Input Tracking ---
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
    // 🔐 Check login state ONCE
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const loggedIn = localStorage.getItem('isLoggedIn');
        if (loggedIn === 'true') {
            setIsLoggedIn(true);
        }
    }, []);
    // ================= VALIDATION LOGIC =================
    function validatePassword(password) {
        // Regex: At least 1 Upper, 1 Lower, 1 Number, 1 Special Char, Max 16 chars
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]\\;':,.\/?]).{1,16}$/;
        return regex.test(password);
    }
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function validateMobile(mobile) {
        return /^[6-9]\d{9}$/.test(mobile);
    }
    // ================= LOGIN HANDLER =================
    async function handleLogin(e) {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/ords/lms/v2/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword
                })
            });
            const data = await res.json();
            console.log('Login API Raw Data:', data); // Check this on the LOGIN PAGE console
            if (data.status === 'success') {
                // FIX: Handle potential case sensitivity from Oracle
                const uid = data.user_id || data.USER_ID;
                if (uid) {
                    localStorage.setItem('user_id', uid.toString());
                    localStorage.setItem('user_email', loginEmail);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('child_name', data.child_name || data.user || 'Student');
                    setIsLoggedIn(true);
                } else {
                    __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                        icon: 'error',
                        text: 'Critical Error: User ID not received from server'
                    });
                }
            } else {
                __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                    icon: 'error',
                    text: data.message || 'Login Failed'
                });
            }
        } catch (error) {
            console.error(error);
        }
        const email = loginEmail;
        const password = loginPassword;
        // 1. Client-side Check
        if (!validatePassword(password)) {
            await __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                icon: 'error',
                text: 'Password must contain uppercase, lowercase, number & special character'
            });
            return;
        }
        try {
            const res = await fetch(// 'http://192.168.0.127:8080/ords/lms/auth/login',
            'http://192.168.0.127:8080/ords/lms/v2/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const data = await res.json();
            console.log('DEBUG: Data from Oracle:', data);
            // 🛑 BUG FIX: Check for "Fake 200 OK" or explicit error messages
            const isFailure = !res.ok || data.message && data.message.toLowerCase().includes('invalid') || data.message && data.message.toLowerCase().includes('fail') || data.message && data.message.toLowerCase().includes('incorrect');
            if (isFailure) {
                await __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                    icon: 'error',
                    text: data.message || 'Invalid Email or Password'
                });
                return; // ⛔ STOP HERE
            }
            // ✅ SUCCESS
            await __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                icon: 'success',
                text: data.message || 'Login Successfully!'
            });
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('user_email', email);
            localStorage.removeItem('mcq_guest_id');
            localStorage.setItem('isLoggedIn', 'true');
            // 👇 KEY UPDATE: SAVE CHILD NAME FROM API 👇
            if (data.child_name) {
                localStorage.setItem('child_name', data.child_name);
            } else if (data.user) {
                // Fallback to parent name if child name is missing
                localStorage.setItem('child_name', data.user);
            } else {
                localStorage.setItem('child_name', 'Student');
            }
            setIsLoggedIn(true);
        } catch (error) {
            console.error(error);
            await __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                icon: 'error',
                text: 'Server not reachable'
            });
        }
    }
    // ================= REGISTER HANDLER =================
    async function handleRegister(e) {
        e.preventDefault();
        if (!validateMobile(regMobile)) {
            __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                icon: 'error',
                text: 'Invalid mobile number'
            });
            return;
        }
        if (!validateEmail(regEmail)) {
            __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                icon: 'error',
                text: 'Invalid email address'
            });
            return;
        }
        if (!validatePassword(regPassword)) {
            __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                icon: 'error',
                text: 'Password must contain uppercase, lowercase, number & special character'
            });
            return;
        }
        try {
            const res = await fetch('http://192.168.0.127:8080/ords/lms/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    salutation: regSalutation,
                    parent_name: regParentName,
                    level: regLevel,
                    child_name: regChildName,
                    mobile: regMobile,
                    email: regEmail,
                    password: regPassword
                })
            });
            const data = await res.json();
            // 🛑 FIX: Check for "error" status or specific messages inside the data
            const isFailure = !res.ok || data.status === 'error' || data.message && data.message.toLowerCase().includes('exists');
            if (isFailure) {
                await __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                    icon: 'error',
                    text: data.message || 'Registration Failed'
                });
                return; // Stop here!
            }
            // ✅ SUCCESS
            await __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                icon: 'success',
                text: 'Account Created Successfully!'
            });
            setIsSignup(false);
        } catch  {
            __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                icon: 'error',
                text: 'Server not reachable'
            });
        }
    }
    // ================= LMS AFTER LOGIN =================
    // if (isLoggedIn) {
    //   // Added inline CSS here to scale the Intro page to 90%
    //   return (
    //     <div style={{ zoom: '0.9' }}>
    //       <Intro />
    //     </div>
    //   );
    // }
    // ================= LMS AFTER LOGIN =================
    if (isLoggedIn) {
        // Removed the zoom hack, the new Intro.js handles scaling naturally!
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$konzeptes$2f$Intro$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/pages/index.js",
            lineNumber: 238,
            columnNumber: 12
        }, this);
    }
    // ================= LOGIN / REGISTER UI =================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "body",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("style", {
                children: `
        .error-text {
          color: #ff4d4f; /* Red color */
          font-size: 11px;
          margin-top: 4px;
          display: block;
          font-weight: bold;
          line-height: 1.2;
        }
      `
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 245,
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
                            lineNumber: 258,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 257,
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
                                            lineNumber: 268,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 267,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        className: "title",
                                        children: "𝚕𝚘𝚐𝚒𝚗"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 276,
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
                                                    lineNumber: 280,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 279,
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
                                                        lineNumber: 290,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "toggleEye",
                                                        onClick: (event)=>{
                                                            const field = document.getElementById('loginPassword');
                                                            const icon = event.target;
                                                            if (field.type === 'password') {
                                                                field.type = 'text';
                                                                icon.textContent = '🙈';
                                                            } else {
                                                                field.type = 'password';
                                                                icon.textContent = '👁️';
                                                            }
                                                        },
                                                        children: "👁️"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 300,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 289,
                                                columnNumber: 17
                                            }, this),
                                            loginPassword && !validatePassword(loginPassword) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "error-text",
                                                children: "⚠️ Password must contain uppercase, lowercase, number & special character"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 320,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                className: "btn btnGreen",
                                                type: "submit",
                                                children: "Login"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 326,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "linkBtn",
                                                onClick: ()=>setIsSignup(true),
                                                children: "Create New Account"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 330,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 278,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 266,
                                columnNumber: 13
                            }, this),
                            isSignup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        className: "title",
                                        children: "Register"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 344,
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
                                                                lineNumber: 349,
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
                                                                        lineNumber: 355,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        children: "Mr"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 356,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        children: "Mrs"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 357,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        children: "Ms"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 358,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 350,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 348,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "inputGroup",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                children: "Parent Name *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 363,
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
                                                                lineNumber: 364,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 362,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 347,
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
                                                                lineNumber: 375,
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
                                                                        lineNumber: 381,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "easy",
                                                                        children: "Easy"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 382,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "intermediate",
                                                                        children: "Intermediate"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 383,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "hard",
                                                                        children: "Hard"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/index.js",
                                                                        lineNumber: 384,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 376,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 374,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "inputGroup",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                children: "Child Name *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 388,
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
                                                                lineNumber: 389,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 387,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 373,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "inputGroup",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        children: "Mobile *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 400,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "Mobile no ",
                                                        required: true,
                                                        value: regMobile,
                                                        onChange: (e)=>setRegMobile(e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 401,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 399,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "inputGroup",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        children: "Email *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 411,
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
                                                        lineNumber: 412,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 410,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "inputGroup",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        children: "Password *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 422,
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
                                                        lineNumber: 423,
                                                        columnNumber: 19
                                                    }, this),
                                                    regPassword && !validatePassword(regPassword) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "error-text",
                                                        children: "⚠️ Password must contain uppercase, lowercase, number & special character"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 433,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 421,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                className: "btn btnGreen",
                                                type: "submit",
                                                children: "Sign Up"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 440,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "linkBtn",
                                                onClick: ()=>setIsSignup(false),
                                                children: "login to existing account"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 444,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 346,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 343,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 261,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 256,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/index.js",
        lineNumber: 243,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__83f66e21._.js.map