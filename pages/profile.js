import { useState, useEffect , useRef} from "react";
import UserDropdown from "comps/UserDropdown";
import Head from "next/head";
import "../pages/login.css"; // reuse SAME CSS
import Swal from "sweetalert2";

export default function Profile() {
  const [form, setForm] = useState({
    c_first: "",
    c_last: "",
    p_first: "",
    p_last: "",
    mobile: "",
    email: "",
    grade: "",
    curriculum: "",
    language: [],
    package: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
const dropdownRef = useRef(null);

  useEffect(() => {
    const name = localStorage.getItem("child_name") || "";
    setForm((prev) => ({
      ...prev,
      c_first: name.split(" ")[0] || "",
      c_last: name.split(" ")[1] || "",
    }));
  }, []);
useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowLangDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

 const handleSave = () => {
  Swal.fire({
    showConfirmButton: false,
    showCancelButton: false,
    html: `
      <div style="font-family: 'Quicksand', sans-serif; text-align: center; padding: 10px 0;">

        <div style="width: 70px; height: 70px; border: 3px solid #2b7d10; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
           <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#2b7d10" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 13l4 4L19 7"></path>
           </svg>
        </div>

        <h3 style="margin: 0 0 8px; font-size: 20px; color: #2b7d10; font-weight: 700;">Save Changes?</h3>
        <p style="font-size: 15px; margin: 0 0 22px 0; color: #555;">Do you want to update your profile details?</p>

        <div style="display:flex; gap: 12px; justify-content: center;">
           <button id="swal-cancel" style="
              background-color: white;
              color: #2b7d10;
              border: 2px solid #2b7d10;
              padding: 10px 0;
              border-radius: 8px;
              font-weight: 700;
              font-size: 14px;
              cursor: pointer;
              flex: 1;
           ">Cancel</button>

           <button id="swal-confirm" style="
              background-color: #2b7d10;
              color: white;
              border: 2px solid #2b7d10;
              padding: 10px 0;
              border-radius: 8px;
              font-weight: 700;
              font-size: 14px;
              cursor: pointer;
              flex: 1;
           ">Yes, Save</button>
        </div>
      </div>
    `,
    width: '360px',
    padding: '20px',
    background: '#f4f9f4',
    backdrop: 'rgba(0,0,0,0.7)',
    customClass: {
      popup: 'custom-swal-shape',
      backdrop: 'custom-blur-backdrop',
    },
    didOpen: () => {
      const cancelBtn = document.getElementById('swal-cancel');
      const confirmBtn = document.getElementById('swal-confirm');

      cancelBtn.onclick = () => Swal.close();

      confirmBtn.onclick = () => {
        Swal.close();
        executeSave(); // 👈 call actual save
      };
    },
  });
};

const executeSave = async () => {
  try {
    // 1. Show toast immediately
    setShowToast(true);

    // 👉 Later API call here
    console.log("Saving:", form);

    // 2. Hide toast after 2 sec
    setTimeout(() => {
      setShowToast(false);
    }, 2000);

  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong!",
    });
  }
};
  return (
<>
    {/* ✅ SAVE SUCCESS TOAST */}
{showToast && (
  <div
    style={{
      position: "fixed",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#6ebc64",
      color: "white",
      padding: "10px 20px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      zIndex: 4000,
      fontFamily: "'Quicksand', sans-serif",
      fontWeight: "600",
      fontSize: "14px",
    }}
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    Profile updated successfully!
  </div>
)}
  
    <div className="auth-page">
      <Head>
        <title>Konzeptes | Profile</title>
      </Head>

      <UserDropdown />

      <div className="auth-card-container register-mode">
        <h2 className="auth-title">My Profile</h2>

        {/* 👤 Avatar Upload */}
<div style={{ textAlign: "center", marginBottom: "15px" }}>
  
  {/* ✅ Hidden Input */}
  <input
    type="file"
    id="avatarUpload"
    style={{ display: "none" }}
    onChange={handleAvatar}
  />

  {/* ✅ Clickable Avatar */}
  <div
    onClick={() => document.getElementById("avatarUpload").click()}
    style={{
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      background: "#33691e",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "26px",
      cursor: "pointer",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    }}
  >
    {avatar ? (
      <img src={avatar} style={{ width: "100%", height: "100%" }} />
    ) : (
      form.c_first?.charAt(0)
    )}
  </div>

  <p style={{ fontSize: "12px", marginTop: "6px", color: "#2b7d10" }}>
    Click to change photo
  </p>
</div>

        {/* STUDENT */}
        <div className="field-group">
          <label className="group-label">Student Details</label>
          <div className="registration-grid">
            <input
              name="c_first"
              value={form.c_first}
              onChange={handleChange}
              placeholder="First Name"
              className="col-4"
            />
            <input
              name="c_last"
              value={form.c_last}
              onChange={handleChange}
              placeholder="Last Name"
              className="col-4"
            />
          </div>
        </div>

        {/* PARENT */}
        <div className="field-group">
          <label className="group-label">Parent Details</label>
          <div className="registration-grid">
            <input
              name="p_first"
              value={form.p_first}
              onChange={handleChange}
              placeholder="First Name"
              className="col-4"
            />
            <input
              name="p_last"
              value={form.p_last}
              onChange={handleChange}
              placeholder="Last Name"
              className="col-4"
            />
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              className="col-4"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="col-4"
            />
          </div>
        </div>

        {/* ACCOUNT */}
        {/* ACCOUNT INFO */}
<div className="field-group">
  <label className="group-label">Account Info</label>

  <div className="registration-grid">

    {/* Grade */}
    <select
      name="grade"
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

    {/* Curriculum */}
    <select
      name="curriculum"
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

    {/* LANGUAGE MULTI SELECT */}
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

    {/* Package */}
    <select
      name="package"
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

        {/* PASSWORD */}
        <div className="field-group">
          <label className="group-label">Change Password</label>
          <div className="registration-grid">
            <input type="password" placeholder="New Password" className="col-4" />
            <input type="password" placeholder="Confirm Password" className="col-4" />
          </div>
        </div>

        <button className="main-submit-btn-register" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
    </>
  );
  
}
