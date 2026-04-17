import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { apiService } from '../utils/apiService';
import Swal from 'sweetalert2';

export default function UserDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [childName, setChildName] = useState('');
  const [showToast, setShowToast] = useState(false);

  const dropdownRef = useRef(null);
  const timerRef = useRef(null);

  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      // setIsVisible(false);
    }, 5000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    const storedName = localStorage.getItem('child_name');
    if (storedName) setChildName(storedName);

    startTimer();

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      stopTimer();
    };
  }, []);

  // 1. Trigger the customized SweetAlert popup
  // const triggerLogout = () => {
  //   setIsOpen(false);

  //   Swal.fire({
  //     showConfirmButton: false,
  //     showCancelButton: false,
  //     html: `
  //       <div style="font-family: 'Quicksand', sans-serif;">
  //         <div style="display:flex; justify-content:center; margin-bottom: 15px;">
  //            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#2b7d10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  //               <circle cx="12" cy="12" r="10"></circle>
  //               <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
  //               <line x1="12" y1="17" x2="12.01" y2="17"></line>
  //            </svg>
  //         </div>

  //         <h3 style="margin:0; font-size:22px; color:#2b7d10; font-weight:700;">Leaving so soon?</h3>
  //         <p style="font-size:15px; margin: 10px 0 25px 0; color:#555; line-height: 1.4;">Are you sure you want to end your learning adventure for today?</p>

  //         <div style="display:flex; gap: 15px; justify-content: center;">
  //            <button id="swal-keep-playing" style="
  //               background-color: white;
  //               color: #2b7d10;
  //               border: 2px solid #2b7d10;
  //               padding: 10px 24px;
  //               border-radius: 8px;
  //               font-family: 'Quicksand', sans-serif;
  //               font-weight: 700;
  //               font-size: 14px;
  //               cursor: pointer;
  //               transition: 0.2s;
  //               min-width: 140px;
  //            ">Keep Playing</button>

  //            <button id="swal-yes-logout" style="
  //               background-color: #2b7d10;
  //               color: white;
  //               border: 2px solid #2b7d10;
  //               padding: 10px 24px;
  //               border-radius: 8px;
  //               font-family: 'Quicksand', sans-serif;
  //               font-weight: 700;
  //               font-size: 14px;
  //               cursor: pointer;
  //               transition: 0.2s;
  //               min-width: 140px;
  //            ">Yes, Log Out</button>
  //         </div>
  //       </div>
  //     `,
  //     width: '420px',
  //     padding: '30px',
  //     background: '#ffffff',
  //     backdrop: 'rgba(0, 0, 0, 0.4)',
  //     customClass: {
  //       popup: 'custom-swal-shape',
  //     },
  //     didOpen: () => {
  //       const keepPlayingBtn = document.getElementById('swal-keep-playing');
  //       const logoutBtn = document.getElementById('swal-yes-logout');

  //       keepPlayingBtn.onmouseover = () =>
  //         (keepPlayingBtn.style.backgroundColor = '#f0f7ef');
  //       keepPlayingBtn.onmouseout = () =>
  //         (keepPlayingBtn.style.backgroundColor = 'white');

  //       logoutBtn.onmouseover = () =>
  //         (logoutBtn.style.backgroundColor = '#205c0c');
  //       logoutBtn.onmouseout = () =>
  //         (logoutBtn.style.backgroundColor = '#2b7d10');

  //       keepPlayingBtn.addEventListener('click', () => Swal.close());
  //       logoutBtn.addEventListener('click', () => {
  //         Swal.close();
  //         executeLogout();
  //       });
  //     },
  //   });
  // };
  // 1. Trigger the customized SweetAlert popup
  const triggerLogout = () => {
    setIsOpen(false);

    Swal.fire({
      showConfirmButton: false,
      showCancelButton: false,
      html: `
        <div style="font-family: 'Quicksand', sans-serif; text-align: center; padding: 10px 0;">


          <div style="width: 70px; height: 70px; border: 3px solid #2b7d10; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
             <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#2b7d10" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
             </svg>
          </div>

          <h3 style="margin: 0 0 8px; font-size: 20px; color: #2b7d10; font-weight: 700;">Leaving so soon?</h3>
          <p style="font-size: 15px; margin: 0 0 22px 0; color: #555;">Are you sure you want to log out?</p>

          <div style="display:flex; gap: 12px; justify-content: center;">
             <button id="swal-keep-playing" style="
                background-color: white;
                color: #2b7d10;
                border: 2px solid #2b7d10;
                padding: 10px 0;
                border-radius: 8px;
                font-family: 'Quicksand', sans-serif;
                font-weight: 700;
                font-size: 14px;
                cursor: pointer;
                transition: 0.2s;
                flex: 1;
                outline: none;
             ">Cancel</button>

             <button id="swal-yes-logout" style="
                background-color: #2b7d10;
                color: white;
                border: 2px solid #2b7d10;
                padding: 10px 0;
                border-radius: 8px;
                font-family: 'Quicksand', sans-serif;
                font-weight: 700;
                font-size: 14px;
                cursor: pointer;
                transition: 0.2s;
                flex: 1;
                outline: none;
             ">Log Out</button>
          </div>
        </div>
      `,
      width: '360px', // Shrunk from 420px
      padding: '20px',
      background: '#f4f9f4', // Matched login popup background
      backdrop: 'rgba(0, 0, 0, 0.7)',
      customClass: {
        popup: 'custom-swal-shape',
        backdrop: 'custom-blur-backdrop', // Added blur class
      },
      didOpen: () => {
        const keepPlayingBtn = document.getElementById('swal-keep-playing');
        const logoutBtn = document.getElementById('swal-yes-logout');

        keepPlayingBtn.onmouseover = () =>
          (keepPlayingBtn.style.backgroundColor = '#eaf3ea');
        keepPlayingBtn.onmouseout = () =>
          (keepPlayingBtn.style.backgroundColor = 'white');

        logoutBtn.onmouseover = () =>
          (logoutBtn.style.backgroundColor = '#1e5c0b');
        logoutBtn.onmouseout = () =>
          (logoutBtn.style.backgroundColor = '#2b7d10');

        keepPlayingBtn.addEventListener('click', () => Swal.close());
        logoutBtn.addEventListener('click', () => {
          Swal.close();
          executeLogout();
        });
      },
    });
  };

  const executeLogout = async () => {
    // 1. Show the toast immediately
    setShowToast(true);

    const email = localStorage.getItem('user_email');
    if (email) {
      try {
        // 2. Await the API call
        await apiService.logout({ email: email });
      } catch (err) {
        console.error('Logout error:', err);
      }
    }

    // 3. Clear local storage
    localStorage.clear();

    // 4. Redirect much faster! Changed from 2000 to 600
    setTimeout(() => {
      // window.location.href forces a hard browser redirect/refresh
      window.location.href = '/';
    }, 600);
  };

  const handlePillClick = () => {
    setIsOpen(!isOpen);
  };

  if (!childName) return null;

  return (
    <>
      {/* 1. Global CSS for the modal shape */}
      {/* 1. Global CSS for the modal shape and blur */}
      <style jsx global>{`
        .custom-swal-shape {
          border-radius: 16px !important;
          border: 1px solid #eef2ee !important;
        }
        .custom-blur-backdrop {
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
          background: rgba(0, 0, 0, 0.45) !important;
        }
      `}</style>

      {/* 2. Component CSS (Moved OUTSIDE the div to fix the Next.js compile error) */}
      <style jsx>{`
        .user-nav-wrapper {
          position: fixed;
          top: 20px;
          right: 25px;
          z-index: 2000;
          font-family: 'Quicksand', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding: 15px;
          margin: -15px;
        }

        .trigger-pill {
          background: white;
          border: 2px solid #2b7d10;
          height: 44px;
          min-width: 44px;
          max-width: 44px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          cursor: pointer;
          overflow: hidden;
          transition:
            max-width 0.5s ease,
            padding 0.5s ease,
            box-shadow 0.5s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          padding: 2px;
          white-space: nowrap;
        }

        .trigger-pill:hover {
          max-width: 250px;
          padding-right: 15px;
          box-shadow: 0 6px 15px rgba(43, 125, 16, 0.2);
        }

        .avatar-circle {
          width: 36px;
          height: 36px;
          background: #2b7d10;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          flex-shrink: 0;
        }

        .name-and-icon {
          display: flex;
          align-items: center;
          margin-left: 10px;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .trigger-pill:hover .name-and-icon {
          opacity: 1;
        }

        .user-name {
          color: #2b7d10;
          font-weight: 700;
          font-size: 16px;
          margin-right: 8px;
        }

        .dropdown-arrow {
          width: 18px;
          height: 18px;
          color: #2b7d10;
          transition: transform 0.3s ease;
        }

        .dropdown-arrow.open {
          transform: rotate(180deg);
        }

        .modern-menu {
          margin-top: 10px;
          background: white;
          border-radius: 16px;
          border: 1px solid #eef2ee;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          width: 160px;
          overflow: hidden;
          padding: 6px;
          transform-origin: top right;
          animation: menuGrow 0.3s ease forwards;
        }

        @keyframes menuGrow {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-5px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .menu-item {
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #444;
          font-weight: 600;
          font-size: 14px;
          transition: 0.2s;
        }

        .menu-item:hover {
          background: #f0f7ef;
          color: #2b7d10;
        }

        .menu-item.logout {
          color: #e74c3c;
        }

        .menu-item.logout:hover {
          background: #fff5f5;
        }

        .icon-sm {
          width: 18px;
          height: 18px;
        }

        .toast-slide {
          animation: slideDown 0.3s ease-out forwards;
        }

        @keyframes slideDown {
          from {
            transform: translate(-50%, -20px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>

      {/* --- SMALLER SUCCESS TOASTER --- */}
      {showToast && (
        <div
          className="toast-slide"
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            backgroundColor: '#6ebc64',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            zIndex: 4000,
            fontFamily: "'Quicksand', sans-serif",
            fontWeight: '600',
            fontSize: '14px',
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
          Logged out successfully !
        </div>
      )}

      {/* --- EXISTING DROPDOWN CODE --- */}
      <div
        ref={dropdownRef}
        className="user-nav-wrapper"
        onMouseEnter={() => {
          setIsVisible(true);
          stopTimer();
        }}
        onMouseLeave={startTimer}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.6s ease-in-out',
        }}
      >
        <div className="trigger-pill" onClick={handlePillClick}>
          <div className="avatar-circle">
            {childName.charAt(0).toUpperCase()}
          </div>
          <div className="name-and-icon">
            {/* <span className="user-name">{childName}</span> */}
            <span className="user-name">{childName.trim().split(' ')[0]}</span>
            <svg
              className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {isOpen && (
          <div className="modern-menu">

            <div
  className="menu-item"
  onClick={() => router.push('/profile')}
>
  <svg
    className="icon-sm"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M4 21v-2a4 4 0 0 1 3-3.87"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
  Profile
</div>
            <div
              className="menu-item home-item"
              onClick={() => router.push('/home')}
            >
              <svg
                className="icon-sm"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Home
            </div>

            <div className="menu-item logout" onClick={triggerLogout}>
              <svg
                className="icon-sm"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </div>
          </div>
        )}
      </div>
    </>
  );
}
