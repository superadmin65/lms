import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Playlist from "comps/Playlist";
import OnlyBigScreen from "comps/OnlyBigScreen";
import DelayLoader from "comps/DelayLoader";
import UserDropdown from "comps/UserDropdown";
import { apiService } from "../../utils/apiService";
import Head from "next/head";

export default function PlaylistPage(props) {
  const router = useRouter();
  const [state, setState] = useState({
    loading: true,
    toc: null,
    error: false,
  });

  const playlistRef = useRef(null);

  const handleBack = () => {
    if (playlistRef.current && playlistRef.current.handleSmartBack) {
      playlistRef.current.handleSmartBack();
    } else {
      router.push("/home");
    }
  };

  useEffect(() => {
    const fetchData = async (slugArray) => {
      const id = slugArray.join("/");

      try {
        let data = await loadPlaylist(id);

        if (!data.type) {
          data = {
            ...data,
            list: [
              { id: "chap-1", label: "Default Chapter", list: data.list || [] },
            ],
          };
        }

        // 🟢 FIX: We removed "data.loadFirstAct = true;" from here.
        // Now it will respect the database settings and show the Grid!

        setState({ toc: data, loading: false, error: false });
      } catch (err) {
        console.error("Playlist Load Error:", err);
        setState({ loading: false, error: true, toc: null });
      }
    };

    if (router.isReady && router.query.slug) {
      fetchData(router.query.slug);
    }
  }, [router.isReady, router.query.slug]);

  if (state.loading) return <div>Loading...</div>;
  if (state.error) return <div>Activity not found.</div>;

  return (
    <>
      {/* 2. ADD HEAD COMPONENT HERE */}
      <Head>
        <title>Konzeptes | 🎓 Learning App </title>
      </Head>
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <UserDropdown />

        <button
          onClick={handleBack}
          style={{
            position: "fixed",
            left: "0",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            padding: "8px 10px",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            color: "#2b7d10",
            border: "3px solid #2b7d10",
            borderLeft: "none",
            borderRadius: "0 30px 30px 0",
            cursor: "pointer",
            fontWeight: "800",
            fontSize: "15px",
            boxShadow: "3px 3px 0px rgba(0,0,0,0.1)",
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            width: "40px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.width = "120px";
            e.currentTarget.style.backgroundColor = "#2b7d10";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.width = "40px";
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.color = "#2b7d10";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: "10px", flexShrink: 0 }}
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span style={{ whiteSpace: "nowrap" }}>BACK</span>
        </button>

        <DelayLoader data={state.toc} lazyLoad={true}>
          <OnlyBigScreen minSize={700}>
            <Playlist toc={state.toc} playlistRef={playlistRef} />
          </OnlyBigScreen>
        </DelayLoader>
      </div>
    </>
  );
}

export const loadPlaylist = async (id) => {
  try {
    if (!isNaN(id)) {
      const response = await apiService.getActivityData(id);

      let json = response.data;
      if (typeof json === "string") {
        try {
          json = JSON.parse(json);
        } catch (e) {
          throw new Error("Invalid JSON");
        }
      }

      if (json && (json.id || json.list)) return json;
      if (json && json.items && json.items.length > 0) {
        const item = json.items[0];
        if (item.data && typeof item.data === "string")
          return JSON.parse(item.data);
        if (item.list && typeof item.list === "string")
          return JSON.parse(item.list);
        const cleanItem = { ...item };
        delete cleanItem.links;
        return cleanItem;
      }
      throw new Error("API returned empty items");
    }

    const getBasePath = () => {
      if (typeof window === "undefined") return "";
      if (window.__NEXT_DATA__?.basePath) return window.__NEXT_DATA__.basePath;
      if (window.location?.pathname) {
        const parts = window.location.pathname.split("/");
        if (parts.length > 1 && parts[1] === "lms-system") return "/lms-system";
      }
      return "";
    };

    const basePath = getBasePath();
    const res = await fetch(`${basePath}/json/${id}.pschool`);
    if (!res.ok) throw new Error("JSON file not found");
    return await res.json();
  } catch (e) {
    throw e;
  }
};
