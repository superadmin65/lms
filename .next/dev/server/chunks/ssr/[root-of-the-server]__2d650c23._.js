module.exports = [
"[project]/pages/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// import { useState, useEffect } from 'react';
// import { apiService } from '../utils/apiService'; // Centralized API service
// import Swal from 'sweetalert2';
// import Intro from 'konzeptes/Intro';
// import './login.css';
// export default function HomeView() {
//   const [isSignup, setIsSignup] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   // Login Form States
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
//   // 🔐 Check login state ONCE on mount
//   useEffect(() => {
//     const loggedIn = localStorage.getItem('isLoggedIn');
//     if (loggedIn === 'true') {
//       setIsLoggedIn(true);
//     }
//   }, []);
//   // ================= VALIDATION LOGIC =================
//   const validatePassword = (password) => {
//     const regex =
//       /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]\\;':,.\/?]).{1,16}$/;
//     return regex.test(password);
//   };
//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   const validateMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);
//   // ================= LOGIN HANDLER =================
//   async function handleLogin(e) {
//     e.preventDefault();
//     // 1. Validation
//     if (!validatePassword(loginPassword)) {
//       Swal.fire({
//         icon: 'error',
//         text: 'Password must contain uppercase, lowercase, number & special character',
//       });
//       return;
//     }
//     try {
//       // 2. Call Centralized apiService
//       const response = await apiService.login({
//         email: loginEmail,
//         password: loginPassword,
//       });
//       const data = response.data; // Axios automatically parses JSON
//       console.log('Login API Response:', data);
//       // 3. Logic Check (ORDS sometimes sends success status even for failed logic)
//       const isActuallyFailure =
//         data.status === 'error' ||
//         (data.message && data.message.toLowerCase().includes('fail')) ||
//         (data.message && data.message.toLowerCase().includes('invalid'));
//       if (isActuallyFailure) {
//         Swal.fire({ icon: 'error', text: data.message || 'Login Failed' });
//         return;
//       }
//       // 4. Handle Success
//       const uid = data.user_id || data.USER_ID;
//       if (uid) {
//         localStorage.setItem('user_id', uid.toString());
//         localStorage.setItem('user_email', loginEmail);
//         localStorage.setItem('isLoggedIn', 'true');
//         localStorage.removeItem('mcq_guest_id');
//         localStorage.setItem(
//           'child_name',
//           data.child_name || data.user || 'Student'
//         );
//         // This await ensures the popup stays on the login page until "OK" is clicked
//         await Swal.fire({
//           icon: 'success',
//           text: 'Login Successfully!',
//           showConfirmButton: true,
//           confirmButtonText: 'OK',
//           confirmButtonColor: '#007bff', // Blue background
//         });
//         setIsLoggedIn(true);
//       } else {
//         Swal.fire({
//           icon: 'error',
//           text: 'Critical Error: User ID missing from server',
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       const errorMsg = error.response?.data?.message || 'Server not reachable';
//       Swal.fire({ icon: 'error', text: errorMsg });
//     }
//   }
//   // ================= REGISTER HANDLER =================
//   async function handleRegister(e) {
//     e.preventDefault();
//     if (!validateMobile(regMobile))
//       return Swal.fire({ icon: 'error', text: 'Invalid mobile number' });
//     if (!validateEmail(regEmail))
//       return Swal.fire({ icon: 'error', text: 'Invalid email address' });
//     if (!validatePassword(regPassword))
//       return Swal.fire({ icon: 'error', text: 'Weak Password' });
//     try {
//       // 1. Call Centralized apiService
//       const response = await apiService.register({
//         salutation: regSalutation,
//         parent_name: regParentName,
//         level: regLevel,
//         child_name: regChildName,
//         mobile: regMobile,
//         email: regEmail,
//         password: regPassword,
//       });
//       const data = response.data;
//       // 2. Error Check
//       if (
//         data.status === 'error' ||
//         (data.message && data.message.toLowerCase().includes('exists'))
//       ) {
//         Swal.fire({
//           icon: 'error',
//           text: data.message || 'Registration Failed',
//         });
//         return;
//       }
//       // 3. Success
//       await Swal.fire({
//         icon: 'success',
//         text: 'Account Created Successfully!',
//         showConfirmButton: true,
//         confirmButtonText: 'OK',
//         confirmButtonColor: '#007bff', // Blue background
//       });
//       setIsSignup(false); // Switch to Login view
//     } catch (error) {
//       const errorMsg =
//         error.response?.data?.message || 'Server error during registration';
//       Swal.fire({ icon: 'error', text: errorMsg });
//     }
//   }
//   // ================= RENDER LOGIC =================
//   if (isLoggedIn) return <Intro />;
//   return (
//     <div className="body">
//       <style>{`
//         .error-text { color: #ff4d4f; font-size: 11px; margin-top: 4px; display: block; font-weight: bold; line-height: 1.2; }
//       `}</style>
//       <div className="container">
//         <div className="mascotArea">
//           <img src="/mascot-owl.png" className="mascotImage" alt="Mascot" />
//         </div>
//         <div
//           className={isSignup ? 'formCard registerCard' : 'formCard loginCard'}
//         >
//           {/* LOGIN VIEW */}
//           {!isSignup && (
//             <div>
//               <div className="loginIcon">
//                 <img
//                   src="/lms-system/img/konzeptes/logo.png"
//                   className="loginIconImg"
//                   alt="Logo"
//                 />
//               </div>
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
//                     onClick={() => {
//                       const f = document.getElementById('loginPassword');
//                       f.type = f.type === 'password' ? 'text' : 'password';
//                     }}
//                   >
//                     👁️
//                   </span>
//                 </div>
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
//           {/* REGISTER VIEW */}
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
//                     placeholder="Mobile no"
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
//                 </div>
//                 <button className="btn btnGreen" type="submit">
//                   Sign Up
//                 </button>
//                 <button
//                   type="button"
//                   className="linkBtn"
//                   onClick={() => setIsSignup(false)}
//                 >
//                   Back to Login
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
var __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/sweetalert2 [external] (sweetalert2, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/apiService.js [ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../components/konzeptes/Intro'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
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
    const [showPass, setShowPass] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Unified Form State
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        email: '',
        password: '',
        salutation: '',
        p_first: '',
        p_last: '',
        c_first: '',
        c_last: '',
        level: '',
        mobile: ''
    });
    // Check login on load
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const loggedIn = localStorage.getItem('isLoggedIn');
        if (loggedIn === 'true') {
            setIsLoggedIn(true);
        }
    }, []);
    const handleChange = (e)=>{
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };
    const handleAuth = async (e)=>{
        e.preventDefault();
        try {
            const action = isSignup ? __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].register : __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$apiService$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].login;
            // Map frontend state to backend expected keys
            const payload = isSignup ? {
                salutation: form.salutation,
                p_first_name: form.p_first,
                p_last_name: form.p_last,
                c_first_name: form.c_first,
                c_last_name: form.c_last,
                level: form.level,
                mobile: form.mobile,
                email: form.email,
                password: form.password
            } : {
                email: form.email,
                password: form.password
            };
            const { data } = await action(payload);
            if (data.status === 'success') {
                if (isSignup) {
                    await __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Account Created! Please Login.'
                    });
                    setIsSignup(false);
                } else {
                    localStorage.setItem('user_id', data.user_id);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('child_name', data.child_name || 'Student');
                    setIsLoggedIn(true);
                }
            } else {
                __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.message || 'Error occurred'
                });
            }
        } catch (err) {
            console.error(err);
            __TURBOPACK__imported__module__$5b$externals$5d2f$sweetalert2__$5b$external$5d$__$28$sweetalert2$2c$__cjs$29$__["default"].fire({
                icon: 'error',
                title: 'Connection Error',
                text: 'Server is not responding'
            });
        }
    };
    // If logged in, show the Dashboard/Intro
    if (isLoggedIn) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Intro, {}, void 0, false, {
        fileName: "[project]/pages/index.js",
        lineNumber: 441,
        columnNumber: 26
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "auth-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                    children: [
                        isSignup ? 'Register' : 'Login',
                        " | Konzeptes"
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/index.js",
                    lineNumber: 446,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 445,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: `auth-card ${isSignup ? 'register-mode' : ''}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "logo-section",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                            src: "/lms-system/img/konzeptes/logo.png",
                            alt: "Konzeptes Logo",
                            className: "auth-logo"
                        }, void 0, false, {
                            fileName: "[project]/pages/index.js",
                            lineNumber: 451,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 450,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "auth-title",
                        children: isSignup ? 'Create Account' : 'Welcome Back'
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 458,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                        onSubmit: handleAuth,
                        className: "auth-form",
                        children: [
                            isSignup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "registration-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                        name: "salutation",
                                        required: true,
                                        value: form.salutation,
                                        onChange: handleChange,
                                        className: "span-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Title"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 473,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                children: "Mr."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 474,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                children: "Mrs."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 475,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                children: "Ms."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 476,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 466,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        name: "p_first",
                                        placeholder: "Parent First Name",
                                        required: true,
                                        value: form.p_first,
                                        onChange: handleChange,
                                        className: "span-4"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 478,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        name: "p_last",
                                        placeholder: "Parent Last Name",
                                        required: true,
                                        value: form.p_last,
                                        onChange: handleChange,
                                        className: "span-5"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 486,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        name: "c_first",
                                        placeholder: "Child First Name",
                                        required: true,
                                        value: form.c_first,
                                        onChange: handleChange,
                                        className: "span-6"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 496,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        name: "c_last",
                                        placeholder: "Child Last Name",
                                        required: true,
                                        value: form.c_last,
                                        onChange: handleChange,
                                        className: "span-6"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 504,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                        name: "level",
                                        required: true,
                                        value: form.level,
                                        onChange: handleChange,
                                        className: "span-5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Select Level"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 521,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: "easy",
                                                children: "Easy"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 522,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: "intermediate",
                                                children: "Intermediate"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 523,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: "hard",
                                                children: "Hard"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 524,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 514,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        name: "mobile",
                                        placeholder: "Mobile Number",
                                        required: true,
                                        value: form.mobile,
                                        onChange: handleChange,
                                        className: "span-7"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 526,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 464,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                name: "email",
                                type: "email",
                                placeholder: "Email Address",
                                className: "full-input",
                                required: true,
                                value: form.email,
                                onChange: handleChange
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 538,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "password-wrapper",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        name: "password",
                                        type: showPass ? 'text' : 'password',
                                        placeholder: "Password",
                                        required: true,
                                        value: form.password,
                                        onChange: handleChange
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 549,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "password-toggle",
                                        onClick: ()=>setShowPass(!showPass),
                                        children: showPass ? '🔒' : '👁️'
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 557,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 548,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "auth-submit-btn",
                                children: isSignup ? 'Sign Up' : 'Login'
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 565,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "auth-switch",
                                onClick: ()=>setIsSignup(!isSignup),
                                children: isSignup ? 'Already have an account? Login' : "Don't have an account? Create one"
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 569,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 462,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 449,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/index.js",
        lineNumber: 444,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__2d650c23._.js.map