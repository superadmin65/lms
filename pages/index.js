import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { apiService } from "../utils/apiService";
import Intro from "konzeptes/Intro";
import Head from "next/head";
import "./login.css";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useRef } from "react";

export default function HomeView() {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const [form, setForm] = useState({
    identifier: "",
    password: "",
    salutation: "",
    p_first: "",
    p_last: "",
    c_first: "",
    c_last: "",
    level: "",
    mobile: "",
    package: "",
    grade: "",
   language: [],
    curriculum: "",
  });

  const dropdownRef = useRef();

useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowLangDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  // 1. Initial check for logged in status
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") setIsLoggedIn(true);
  }, []);

  // 2. NEW: Fire the popup AFTER the redirect happens
  useEffect(() => {
    if (isLoggedIn) {
      const showPopup = localStorage.getItem("show_login_popup");
      if (showPopup === "true") {
        // Remove the flag so it doesn't show again on manual page reloads
        localStorage.removeItem("show_login_popup");

        Swal.fire({
          html: `
            <div style="padding: 10px; font-family: 'Quicksand', sans-serif;">
              <div style="width: 70px; height: 70px; border: 3px solid #2b7d10; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#2b7d10" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 style="color: #2b7d10; font-size: 18px; font-weight: 600; margin: 0;">Login Success!</h3>
            </div>
          `,
          showConfirmButton: true,
          confirmButtonText: "OK",
          buttonsStyling: false,
          width: "380px",
          background: "#f4f9f4", // Off-white/light-green matching your image
          backdrop: `rgba(0,0,0,0.7)`, // Fallback color
          customClass: {
            popup: "custom-login-popup",
            backdrop: "custom-blur-backdrop",
            confirmButton: "custom-login-btn",
          },
        });
      }
    }
  }, [isLoggedIn]);

  const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]\\;':,.\/?]).{1,16}$/.test(
      password,
    );
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // remove non-digits
    setForm({ ...form, mobile: value });
  };

  // const handleAuth = async (e) => {
  //   e.preventDefault();
  //   if (isSignup && !validatePassword(form.password)) return;

  //   try {
  //     const action = isSignup ? apiService.register : apiService.login;
  //     const payload = isSignup
  //       ? {
  //           salutation: form.salutation,
  //           p_first_name: form.p_first,
  //           p_last_name: form.p_last,
  //           c_first_name: form.c_first,
  //           c_last_name: form.c_last,
  //           level: form.level,
  //           mobile: form.mobile,
  //           email: form.email,
  //           password: form.password,
  //           package_type: form.package,
  //         }
  //       : { email: form.email, password: form.password };

  //     const { data } = await action(payload);

  //     if (data.status === 'success') {
  //       if (isSignup) {
  //         await Swal.fire({
  //           icon: 'success',
  //           title: 'Success!',
  //           text: 'Registration Successful!',
  //           confirmButtonColor: '#33691e',
  //         });
  //         setIsSignup(false);
  //       } else {
  //         // --- CHANGED LOGIC HERE ---
  //         // DO NOT show Swal here. Just set storage and trigger redirect!
  //         localStorage.setItem('user_id', data.user_id);
  //         localStorage.setItem('isLoggedIn', 'true');
  //         localStorage.setItem('child_name', data.child_name || 'Student');

  //         // Set flag for the popup
  //         localStorage.setItem('show_login_popup', 'true');

  //         // Trigger the component switch ("redirect")
  //         setIsLoggedIn(true);
  //       }
  //     } else {
  //       Swal.fire({
  //         icon: 'error',
  //         text: data.message || 'Action Failed',
  //         confirmButtonColor: '#33691e',
  //       });
  //     }
  //   } catch (err) {
  //     Swal.fire({
  //       icon: 'error',
  //       text: 'Server Connection Error',
  //       confirmButtonColor: '#33691e',
  //     });
  //   }
  // };
  const handleAuth = async (e) => {
    e.preventDefault();

    
    const submitData = new FormData(e.target);
    const actualIdentifier = submitData.get("identifier"); 
    const actualPassword = submitData.get("password");

    // Use actualPassword instead of form.password for validation
    

    try {
      const action = isSignup ? apiService.register : apiService.login;

      // Use actualEmail and actualPassword in the payload instead of state
      const payload = isSignup
        ? {
            salutation: form.salutation,
            p_first_name: form.p_first,
            p_last_name: form.p_last,
            c_first_name: form.c_first,
            c_last_name: form.c_last,
            level: form.level,
            mobile: form.mobile,
          email: submitData.get("email"),
            package_type: form.package,
          }
        : {  email: actualIdentifier, password: actualPassword };

      const { data } = await action(payload);

      if (data.status === "success") {
        if (isSignup) {
          await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Registration Successful!",
            confirmButtonColor: "#33691e",
          });
          setIsSignup(false);
        } else {
          localStorage.setItem("user_id", data.user_id);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("child_name", data.child_name || "Student");
          localStorage.setItem("show_login_popup", "true");
          setIsLoggedIn(true);
        }
      } else {
        Swal.fire({
          icon: "error",
          text: data.message || "Action Failed",
          confirmButtonColor: "#33691e",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: "Server Connection Error",
        confirmButtonColor: "#33691e",
      });
    }
  };

  useEffect(() => {
    if (isSignup) {
      setForm({
       identifier: "",
        salutation: "",
        p_first: "",
        p_last: "",
        c_first: "",
        c_last: "",
        level: "",
        mobile: "",
        package: "",
        grade: "",
       language: [],
        curriculum: "",
      });
    }
  }, [isSignup]);

  if (isLoggedIn) {
    return (
      <>
        <Head>
          <title>Konzeptes | Learning App 🎓</title>
        </Head>

        {/* We inject the CSS globally so SweetAlert can read it while <Intro /> is showing */}
        {/* We inject the CSS globally so SweetAlert can read it while <Intro /> is showing */}
        <style jsx global>{`
          /* 1. Increase the blur effect drastically */
          .custom-blur-backdrop {
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important; /* For Safari */
            background: rgba(
              0,
              0,
              0,
              0.45
            ) !important; /* Slightly darker tint helps the blur pop */
          }

          .custom-login-popup {
            border-radius: 16px !important;
          }

          /* 2. Fix the OK button and kill the browser's default blue focus ring */
          .custom-login-btn {
            background-color: #2b7d10 !important;
            color: white !important;
            border: none !important;
            outline: none !important; /* Removes the default browser outline */
            box-shadow: none !important; /* Removes the default browser glow */
            padding: 10px 36px !important;
            border-radius: 8px !important;
            font-family: "Quicksand", sans-serif !important;
            font-weight: 700 !important;
            font-size: 15px !important;
            cursor: pointer !important;
            margin-top: 10px !important;
            transition: all 0.2s ease !important;
          }

          /* Add a clean, custom green hover/focus state instead */
          .custom-login-btn:hover,
          .custom-login-btn:focus {
            background-color: #1e5c0b !important;
            box-shadow: 0 4px 12px rgba(43, 125, 16, 0.3) !important;
            outline: none !important;
          }
        `}</style>

        <Intro />
      </>
    );
  }

  // ... (Keep the rest of your original return statement with the auth-card-container here) ...
  return (
    <div className="auth-page">
      <Head>
        <title>
          {isSignup ? "Konzeptes | Register  page " : "Konzeptes | Login Page "}
        </title>
      </Head>

      <div
        className={`auth-card-container ${isSignup ? "register-mode" : "login-mode"}`}
      >
        {/* Your form code exactly as it was... */}
        <img src="/img/konzeptes/logo.png" className="auth-logo" alt="Logo" />

        {!isSignup && (
          <form onSubmit={handleAuth} className="auth-form" autoComplete="on">
            <div className="login-section transition-fade">
              <h2 className="auth-title"> Login </h2>

              {/* Email Field with Icon */}
              <div className="input-with-icon full-width-field">
                <input
                  name="identifier"
                  type="text"
                  placeholder="Email Address / Username"
                  required
                 value={form.identifier || ""}
                  onChange={handleChange}
                  autoComplete="username" /* <-- Add this */
                />
                <span className="input-icon">
                  <Mail size={20} />
                </span>
              </div>

              {/* Password Field with Icon */}
              <div className="password-container full-width-field">
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password" /* <-- Add this */
                />
                <span
                  className="eye-btn"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <Eye size={20} /> : <EyeOff size={20} />}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className={
                isSignup ? "main-submit-btn-register" : "main-submit-btn"
              }
            >
              {isSignup ? "Register Now" : "Login !"}
            </button>
            <p className="toggle-view" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Back to Login" : "Create New Account"}
            </p>
          </form>
        )}

        {isSignup && (
          <form onSubmit={handleAuth} className="auth-form" autoComplete="off">
            <div className="register-section transition-fade">
              <h2 className="auth-title">Create Account</h2>
              <div className="field-group">
                
              <div className="field-group">
                <label className="group-label">Student Details</label>
                <div className="registration-grid">
                  <input
                    name="c_first"
                    placeholder=" First Name"
                    required
                    value={form.c_first}
                    onChange={handleChange}
                    className="col-4"
                  />
                  <input
                    name="c_last"
                    placeholder=" Last Name"
                    required
                    value={form.c_last}
                    onChange={handleChange}
                    className="col-4"
                  />
                 
                </div>
              </div>
              <label className="group-label">Parent Details</label>
                <div className="registration-grid">
                  <select
                    name="salutation"
                    required
                    value={form.salutation}
                    onChange={handleChange}
                    className="col-4"
                  >
                    <option value="">Title</option>
                    <option>Mr.</option>
                    <option>Mrs.</option>
                    <option>Ms.</option>
                  </select>
                  <input
                    name="p_first"
                    placeholder="First Name"
                    required
                    value={form.p_first}
                    onChange={handleChange}
                    className="col-4"
                  />
                  <input
                    name="p_last"
                    placeholder="Last Name"
                    required
                    value={form.p_last}
                    onChange={handleChange}
                    className="col-4"
                  />
                 <input
                    name="mobile"
                    placeholder="Mobile"
                    required
                    value={form.mobile}
                    maxLength={10}
                    onChange={handleMobileChange}
                    className="col-4"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="col-4"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="field-group ">
                <label className="group-label">Account Information</label>

                <div className="registration-grid ">
                 
                  <select
                    name="grade"
                    required
                    value={form.grade}
                    onChange={handleChange}
                    className="col-4"
                  >
                    <option value="">Select Grade</option>
<option>Primary 1</option>
<option>Primary 2</option>
<option>Primary 3</option>
<option>Primary 4</option>
<option>Primary 5</option>
<option>Primary 6 (PSLE)</option>

<option>Secondary 1</option>
<option>Secondary 2</option>
<option>Secondary 3</option>
<option>Secondary 4 (O Level)</option>

<option>A Level</option>
                  </select>

                  <select
                    name="curriculum"
                    required
                    value={form.curriculum}
                    onChange={handleChange}
                    className="col-4"
                  >
                    <option value="">Select Curriculum</option>
<option value="MOE">MOE</option>
<option value="IGCSE">IGCSE</option>
<option value="IB">IB</option>
<option value="CBSE">CBSE</option>
                  </select>
                  
    <div className="col-4 lang-dropdown" ref={dropdownRef}>
  <div
  className="custom-select-box"
  onClick={() => setShowLangDropdown(!showLangDropdown)}
>
  <span>
    {form.language.length > 0
      ? form.language.join(", ")
      : "Select Language"}
  </span>

  
</div>

  {showLangDropdown && (
    <div className="custom-dropdown">
      {["Hindi", "French", "German"].map((lang) => (
        <label key={lang} className="dropdown-item">
          <input
            type="checkbox"
            checked={form.language.includes(lang)}
            onChange={() => {
              const updated = form.language.includes(lang)
                ? form.language.filter((l) => l !== lang)
                : [...form.language, lang];

              setForm({ ...form, language: updated });
            }}
          />
          {lang}
        </label>
      ))}
    </div>
  )}
</div>
<select
                    name="package"
                    required
                    value={form.package}
                    onChange={handleChange}
                    className="col-4"
                  >
                    <option value="">Select Package</option>
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                  

                  </div>
</div>
</div>
                
            <button
              type="submit"
              className={
                isSignup ? "main-submit-btn-register" : "main-submit-btn"
              }
            >
              {isSignup ? "Register Now" : "Login !"}
            </button>
            <p className="toggle-view" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Back to Login" : "Create New Account"}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
