import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import IconView from "comps/curriculumViews/IconViewMini";
import UserDropdown from "comps/UserDropdown";
import { apiService } from "../utils/apiService"; // Centralized Service
import Head from "next/head";

export default function HomeView() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [menuData, setMenuData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Define your exact static style configuration here
  const staticConfig = {
    iconsLoc: "konzeptes/icons",
    label: " Konzeptes",
    type: "curriculumIcon",
    style: {
      fontSize: "2.4rem",
      maxWidth: 1300,
      margin: "0 auto",
    },
    titleStyle: {
      fontSize: "2.4rem",
      fontWeight: "800",
      textAlign: "center",
      margin: "0 auto 8px",
      color: "#2b7d10", // 👈 solid color
      letterSpacing: "1.5px",
      textShadow: "0 2px 8px rgba(43,125,16,0.3)", // 👈 soft glow
    },
    cardStyle: {
      margin: "25px 0",
      borderRadius: 10,
      padding: 10,
      backgroundColor: "#dbf7c3",
      border: "1px solid white",
      boxShadow: "var(--shadow)",
    },
    iconStyle: {
      width: 200,
      height: 200,
    },
    labelStyle: {
      fontSize: "1.5rem",
    },
    smLabelStyle: {
      fontSize: "1rem",
    },
    list: [], // This will be filled by the API
  };

  useEffect(() => {
    // 1. Check Login
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn !== "true") {
      window.location.href = "/lms-system";
      return;
    }

    // 2. Fetch API Data using Centralized Service
    const loadConfig = async () => {
      try {
        const response = await apiService.getHomeConfig();
        const data = response.data;

        // Parse the stringified list from the API
        const rawString = data.items[0].list;
        const parsedList = JSON.parse(rawString);

        // Merge API list with your static styles
        setMenuData({ ...staticConfig, list: parsedList });
        setIsLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    loadConfig();
  }, []);

  const handleBack = () => {
    router.push("/");
  };

  if (isLoading || !menuData) return null;

  return (
    <>
      {/* 2. ADD HEAD COMPONENT HERE */}
      <Head>
        <title> Konzeptes | Home Page </title>
      </Head>
      <div
        style={{
          backgroundColor: "var(--l)",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        {/* 🟢 USER DROPDOWN */}
        <UserDropdown />

        {/* 🔙 BACK BUTTON - ULTRA MODERN */}
        <button
          onClick={handleBack}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: "absolute",
            top: "20px",
            left: "25px",
            height: "44px",
            width: isHovered ? "110px" : "44px",
            borderRadius: "50px",
            backgroundColor: "white",
            border: "2px solid #2b7d10",
            padding: "2px",
            boxShadow: isHovered
              ? "0 6px 15px rgba(43, 125, 16, 0.2)"
              : "0 4px 12px rgba(0, 0, 0, 0.08)",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.5s ease",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#2b7d10",
              color: "white",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "2px" }}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </div>

          <span
            style={{
              color: "#2b7d10",
              fontWeight: "700",
              fontSize: "16px",
              marginLeft: "8px",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.4s ease",
              whiteSpace: "nowrap",
            }}
          >
            Back
          </span>
        </button>
        <IconView data={menuData} />
      </div>
    </>
  );
}
