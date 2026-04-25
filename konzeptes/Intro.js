import styled, { keyframes } from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import UserDropdown from "comps/UserDropdown";

// Gentle floating animation for the mascot to make it feel alive
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const Styled = styled.div`
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
    min-height: auto;
    height: auto;
    background-color: white;
    border-radius: 20px; /* Highly modern rounded corners */
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08); /* Deep, soft shadow */
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 30px;
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

    gap: 1.5rem; /* Perfect spacing between text and mascot */
  }

  h1 {
    font-family: var(--font1, "Arial", sans-serif);
    font-weight: 900;
    font-size: clamp(2.5rem, 4.5vw, 4rem);
    color: #2b7d10;
    line-height: 1.1;
    margin: 0;
    position: relative;
    z-index: 10;
    text-align: center;
    letter-spacing: -1px;
    text-shadow: 2px 2px 0px rgba(43, 125, 16, 0.05);
    background: none;
    
  }

  .tagline {
    font-weight: 700;
    font-size: clamp(1.1rem, 2vw, 1.4rem);
    font-family: var(--font2, "Arial", sans-serif);
    color: #00b4d8;
    margin: 0;
    text-align: center;
  }

  .mascot {
    height: 34vh;
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
    padding-top: 15px;
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

  .language-row {
    display: flex;
    gap: 120px;
    backdrop-filter: blur(6px);
  }

  .dropDown {
    display: flex;
    padding: 0 10px 0 0;
    justify-content: space-between;
    cursor: pointer;
    background: linear-gradient(135deg, #2b7d10, #89ca73);
    border-radius: 12px; /* Slightly tighter rounded corners */
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    width: 300px;
    outline: none; /* 🔥 removes black outline */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  .languageDrop {
    font-size: 1.1rem;
    font-family: var(--font1, sans-serif);
    font-weight: bold;
    background: transparent;
    color: white;
    cursor: pointer;
    width: 285px;
    border: none;
    outline: none; /* 🔥 removes black outline */
  }

  .dropDown:hover {
    box-shadow: 0 10px 22px rgba(0, 182, 9, 0.25);
    background: linear-gradient(135deg, #3eac19, #9ce783);
  }

  .languageDrop option {
    color: #27740e;
    background: white; /* important */
    font-size: bold;
    overflow: hidden;
    margin-right: 10px;
  }
  /* --- 4. Background Icons --- */
  .bg-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  .imgIcon {
    position: absolute;
    opacity: 0.8; /* 👈 Brought the opacity back up so they are clearly visible! */
    transform: scale(
      0.9
    ); /* Scales them down slightly so they don't look cramped */
  }

  @media (max-width: 768px) {
    .wrap {
      padding: 20px;
      border-radius: 12px;
    }

    .top-row {
      justify-content: center;
    }

    .logo-img {
      height: 50px;
    }

    .center-content {
      gap: 1rem;
    }

    h1 {
      font-size: 1.5rem;
    }

    .tagline {
      font-size: 0.8rem;
    }

    .language-row {
      flex-direction: column; /* 🔥 stack dropdowns */
      gap: 15px;
      width: 100%;
      align-items: center;
    }

    .languageDrop {
      width: 100%; /* 🔥 full width */
      max-width: 280px;
      font-size: 0.9rem;
    }

    .mascot {
      height: 200px; /* 🔥 fixed smaller size */
    }

    .bottom-row {
      justify-content: center; /* center button on mobile */
    }

    .actionBtn {
      width: 100%;
      max-width: 250px;
      text-align: center;
    }
  }
`;

var bgList = [
  {
    id: "icon1.png",
    pos: [
      { x: 450, y: 30 },
      { x: 110, y: 220 },
      { x: 920, y: 450 },
    ],
  },
  {
    id: "icon2.png",
    pos: [
      { x: 50, y: 100 },
      { x: 950, y: 100 },
      { x: 270, y: 320 },
    ],
  },
  {
    id: "icon3.png",
    pos: [
      { x: 700, y: 20 },
      { x: 700, y: 350 },
      { x: 40, y: 350 },
    ],
  },
  {
    id: "icon4.png",
    pos: [
      { x: 830, y: 250 },
      { x: 20, y: 550 },
    ],
  },
  {
    id: "icon5.png",
    pos: [
      { x: 950, y: 310 },
      { x: 170, y: 450 },
    ],
  },
  {
    id: "icon6.png",
    pos: [
      { x: 250, y: 80 },
      { x: 750, y: 500 },
      { x: 350, y: 500 },
    ],
  },
];

export default function Intro(props) {
  const router = useRouter();
  const basePath = router.basePath || "";

  // Converts your original coordinates into responsive percentages
  const getResponsivePos = (x, y) => {
    return {
      left: `${(x / 1100) * 100}%`,
      top: `${(y / 700) * 100}%`,
    };
  };

  return (
    <Styled>
      <div className="wrap">
        {/* User Dropdown moved back to its exact original place! */}
        <UserDropdown />

        {/* Background Icons Layer */}
        <div className="bg-container">
          {bgList.map((item) => (
            <div key={item.id}>
              {item.pos.map((p) => (
                <img
                  key={`${item.id}-${p.x}-${p.y}`}
                  className="imgIcon"
                  src={`${basePath}/kon/${item.id}`}
                  alt=""
                  style={getResponsivePos(p.x, p.y)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Top Header Layer */}
        <div className="top-row">
          <img
            className="logo-img"
            src={`${basePath}/img/konzeptes/logo.png`}
            alt="logo"
          />
        </div>

        {/* Center Content Layer */}
        <div className="center-content">
          <div>
            <h1>WELCOME TO KONZEPTES!</h1>
            <p className="tagline">
              Explore our learning modules and improve your language skills.
            </p>
          </div>
          <div className="language-row">
            <div className="dropDown">
              <select name="language" required className="languageDrop ">
                <option value="">Select Grade</option>
                <option value="free">Class I</option>
                <option value="paid">Class II</option>
                <option value="paid">Class III</option>
              </select>
            </div>
            <div className="dropDown">
              <select name="language" required className="languageDrop ">
                <option value="">Select Language </option>
                <option value="free">Hindi</option>
                {/* <option value="paid">French</option>
                <option value="paid">German</option> */}
              </select>
            </div>
          </div>

          <img
            className="mascot"
            src={`${basePath}/img/konzeptes/kea.png`}
            alt="mascot"
          />
        </div>

        {/* Bottom Button Layer */}
        <div className="bottom-row">
          <Link className="actionBtn" href="/home">
            Let&apos;s Go
          </Link>
        </div>
      </div>
    </Styled>
  );
}
