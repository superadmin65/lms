import React, { useState, useEffect, useRef } from "react";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import styled from "styled-components";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { loadAsset, publicPath } from "utils";
import DelayLoader from "comps/DelayLoader";
import { getDataFromGroupAct } from "utils/playlistUtils";
import Svg from "components/Svg";
import { Button } from "base/comps";
import IconView from "./curriculumViews/IconViewMini";
import PIconView from "./curriculumViews/PIconView";
import SubCards from "./curriculumViews/SubCards";
import LZString from "lz-string";
import { apiService } from "../utils/apiService";

import McqAct from "./acts/McqAct";
import CompleteWordAct from "./acts/CompleteWordAct";
import WordSearchAct from "./acts/WordSearchAct";
import SequenceAct from "./acts/SequenceAct";
import ClassifySentenceAct from "./acts/ClassifySentenceAct";
import MatchByAct from "./acts/MatchByAct";
import InformationProcessingAct from "./acts/InformationProcessingAct";
import DragDropAct from "./acts/DragDropAct";

import MatchPairs from "./acts/MatchPairs";
import JoinWords from "./acts/completePuzzle";
import FillupAct from "./acts/FillupAct";
import SelectWordAct from "./acts/SelectWordAct";
import RightOneAct from "./acts/RightOneAct";
import GroupAct from "./acts/GroupAct";

const playlistIconSvgPath =
  "m21 4c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm12.5 10.75c0-.414-.336-.75-.75-.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75zm0-3.248c0-.414-.336-.75-.75-.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75zm0-3.252c0-.414-.336-.75-.75-.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75z";

const Styled = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  user-select: none;
  background-color: var(--l2);
  color: #222;
  .chapWrap {
    background-color: var(--l2);

    &.selected {
      background-color: var(--h);
    }
  }

  .chap {
    padding: 5px 5px 5px 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .chapDisplay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 10px 40px;
    min-height: 600px;
    .chapName {
      font-size: 3rem;
      margin: 40px 0;
    }
  }

  ol {
    width: 400px;
    border: 1px solid var(--lightColor);
    li {
      padding: 5px 10px;
      border: 1px solid var(--l);
      cursor: pointer;
      display: flex;
      &.head {
        color: var(--darkColor2);
        text-align: center;
        padding: 10px;
        font-size: 1.5rem;
        font-weight: bold;
      }

      &.selected {
        background-color: var(--h2);
      }

      .numbering {
        display: block;
        min-width: 20px;
        text-align: right;
        margin-right: 10px;
        font-size: 0.8rem;
        padding-top: 3px;
      }
    }
  }

  .numWrap {
    display: flex;
    flex-wrap: wrap;
    margin-left: 50px;
    > div {
      padding: 5px;
      margin: 5px;
      background-color: var(--h);
      border-radius: 3px;
      min-width: 40px;
      text-align: center;

      &.selected {
        background-color: var(--h3);
        color: white;
      }
    }
  }

  img,
  .imgPlaceHolder {
    width: 24px;
    height: 24px;
    margin-right: 5px;
  }

  .mainPlaceHolder {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 95vh;
  }

  .placeHolder {
    font-size: 2rem;
    font-style: italic;
    padding: 200px 0 0 100px;
  }

  .videoHelp {
    display: flex;
    background-color: var(--l2);
    padding: 10px;
    font-style: italic;
    padding-left: 30px;
    text-decoration: underline;
    > img {
      margin-right: 10px;
    }
  }

  .actIFrame {
    border: none;
    min-width: 100vw;
    width: ${(p) =>
      p.$hideTOC ? "calc(100vw - 80px)" : "calc(100vw - 490px)"};
    height: 100vh;
  }

  .tags {
    display: flex;
  }

  .tag {
    margin: 2px 10px;
    padding: 5px;
    min-width: 60px;
    background-color: var(--h2);
    cursor: pointer;
    text-align: center;
    border-radius: 5px;
  }

  @media only screen and (max-width: 800px) {
    // ol {
    //   position: absolute;
    //   left: 0;
    //   top: 0;
    // }
    ol {
      position: fixed;
      left: 0;
      top: 0;
      width: 260px;
      height: 100vh;
      background: white;
      z-index: 1000;
      overflow-y: auto;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }

    /* when visible */
    .showSidebar ol {
      transform: translateX(0);
    }
  }

  @media (min-width: 500px) {
    .actIFrame {
      min-width: 500px;
    }
  }
`;

const splTypes = ["pdf", "link", "pLink", "mvid", "youtube"];

//sidebar
// const [showSidebar, setShowSidebar] = useState(false);

export default function Playlist(props) {
  const router = useRouter();
  const pathname = usePathname();

  const playlistId = router.query.slug ? router.query.slug[0] : null;

  const hasData = props.toc && props.toc.list && props.toc.list.length > 0;

  let toggleChaps = hasData ? Array(props.toc.list.length).fill(true) : [];
  if (props.toc?.collapseRest && hasData) {
    toggleChaps = toggleChaps.map((item, i) => i === 0);
  }

  const firstChapter = hasData ? props.toc.list[0] : null;
  const firstActivity = firstChapter
    ? firstChapter.list
      ? firstChapter.list[0]
      : firstChapter
    : null;

  const [state, setState] = useState({
    active:
      props.toc?.loadFirstAct && firstActivity
        ? Array.isArray(firstActivity?.data)
          ? getDataFromGroupAct(firstActivity, 0)
          : firstActivity
        : null,
    activeNum: 1,
    activeChap: props.toc?.loadFirstAct && firstChapter ? 0 : -1,
    hideTOC: props.toc?.cardView ? true : false,
    toggleChaps,
  });

  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const handleSmartBack = () => {
    const s = stateRef.current || state;

    // SCENARIO 1: If we are already on the SubCards Grid Menu, go to Dashboard!
    if (!s.active || s.activeChap === -1) {
      router.push("/home");
      return;
    }

    const chapList = props.toc?.list?.[s.activeChap]?.list;
    if (!chapList) {
      router.push("/home");
      return;
    }

    const index = chapList.findIndex((it) => it.id === s.active.id);
    const currentOriginalItem = chapList[index];

    // SCENARIO 2: Step back inside a multi-question activity (e.g. 8 -> 7)
    if (
      currentOriginalItem &&
      Array.isArray(currentOriginalItem.data) &&
      s.activeNum > 1
    ) {
      numberSelect(currentOriginalItem, s.activeChap, s.activeNum - 2);
      return;
    }

    // SCENARIO 3: Go to the PREVIOUS activity in the SAME chapter
    if (index > 0) {
      const prevItem = chapList[index - 1];
      if (Array.isArray(prevItem.data)) {
        numberSelect(prevItem, s.activeChap, prevItem.data.length - 1);
      } else {
        onSelect(prevItem, s.activeChap);
      }
      return;
    }

    if (props.toc.cardView) {
      setState((prev) => ({
        ...prev,
        active: null,
        activeChap: -1,
        hideTOC: true, // We hide TOC so the grid looks nice
      }));
      return;
    }

    // SCENARIO 5: (NON-GRID VIEW) Go to the PREVIOUS CHAPTER
    if (s.activeChap > 0) {
      const prevChapIndex = s.activeChap - 1;
      const prevChapList = props.toc.list[prevChapIndex].list;
      const prevItem = prevChapList[prevChapList.length - 1];

      let newToggleChaps = [...s.toggleChaps];
      if (props.toc.collapseRest) {
        newToggleChaps = newToggleChaps.map(() => false);
      }
      newToggleChaps[prevChapIndex] = true;
      setState((prev) => ({ ...prev, toggleChaps: newToggleChaps }));

      if (Array.isArray(prevItem.data)) {
        numberSelect(prevItem, prevChapIndex, prevItem.data.length - 1);
      } else {
        onSelect(prevItem, prevChapIndex);
      }
      return;
    }

    router.push("/home");
  };

  if (props.playlistRef) {
    props.playlistRef.current = { handleSmartBack };
  }

  async function onSelect(item, activeChap, i = 0) {
    // 1️⃣ Handle external links immediately
    if (item.type === "link" || item.type === "youtube") {
      window.open(loadAsset(item.src), "child");
      return;
    }
    if (item.type === "pLink") {
      window.open(`https://pschool.app/p/${item.src}`, "child");
      return;
    }

    //  Show loading state
    setState((prev) => ({
      ...prev,
      active: { loading: true },
      activeChap,
    }));

    try {
      //  FIXED: Replace with empty string, not space
      // const activityId = String(item.id).replace("act-", "");
      const activityId = String(item.id);
      const res = await apiService.getActivityDetail(activityId);
      let data = res.data;
      if (!data) {
        console.error("Empty API response");
        data = {};
      } else if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.error("Invalid JSON:", data);
          data = {};
        }
      }

      setState((prev) => ({
        ...prev,
        active: { ...item, data: data || {} },
        activeChap,
        activeNum: i + 1, // UI expects 1-based indexing
        hideTOC: false,
      }));
    } catch (err) {
      console.error("Activity load failed", err);
      setState((prev) => ({
        ...prev,
        active: { type: "error", message: "Failed to load activity" },
      }));
    }
  }

  /////////////////////////////////////////////////////

  useEffect(() => {
    const dataList = props.toc?.list || props.toc?.chapters;
    if (!dataList || dataList.length === 0) return;

    const isGridMenu =
      props.toc.cardView === true || props.toc.type === "nested";
    const shouldLoadFirst = String(props.toc.loadFirstAct) === "true";

    // If we just clicked a card (activeChap is set) but no activity is loaded
    if (
      isGridMenu &&
      state.activeChap !== -1 &&
      !state.active?.loading &&
      !state.active?.data
    ) {
      const selectedChapter = dataList[state.activeChap];
      const items = selectedChapter.list || selectedChapter.contents;

      if (items && items.length > 0) {
        const firstActivity = items[0];
        // Recursive drill-down to find the first real activity
        onSelect(firstActivity, state.activeChap, 0);
        return;
      }
    }

    // Standard auto-load for non-grid views
    if (!shouldLoadFirst || state.active) return;

    const firstChapter = dataList[0];
    const items = firstChapter.list || firstChapter.contents;
    if (items && items.length > 0) {
      onSelect(items[0], 0, 0);
    }
  }, [props.toc, state.activeChap, state.active]); // Added state.activeChap to dependencies

  ///////////////////////////////////////////////////////////
  function numberSelect(item, activeChap, i, e) {
    if (e) e.stopPropagation();
    let data = item.commonData || {};
    let subData = item.data[i];
    if (subData.refs) {
      let refId = subData.refs;
      if (refId.indexOf("~") !== -1) {
        const refIndex = +refId.substr(refId.indexOf("~") + 1);
        refId = refId.substr(0, refId.indexOf("~"));
        subData = props.toc.defs[refId][refIndex];
      } else {
        subData = props.toc.defs[refId];
      }
    }
    if (typeof subData === "string") {
      data = { ...data, text: subData };
    } else if (Array.isArray(subData)) {
      data = { ...data, arr: subData };
    } else {
      data = { ...data, ...subData };
    }
    onSelect({ ...item, data }, activeChap, i + 1);
  }

  useEffect(() => {
    const handler = (msg) => {
      if (typeof msg.data !== "string") return;
      let msgData;
      try {
        msgData = JSON.parse(msg.data);
      } catch (e) {
        return;
      }
      if (!msgData || !msgData.done) return;

      const s = stateRef.current;
      if (!s || !s.active) return;
      const chapList =
        props.toc.list[s.activeChap] && props.toc.list[s.activeChap].list;
      if (!chapList) return;

      const index = chapList.findIndex((it) => it.id === s.active.id);
      if (index === -1) return;

      const currentItem = chapList[index];
      if (Array.isArray(currentItem.data)) {
        if (s.activeNum < currentItem.data.length) {
          numberSelect(currentItem, s.activeChap, s.activeNum);
          return;
        } else {
          // If we finished a chapter and we are in CardView, go back to the Grid!
          if (props.toc.cardView) {
            handleSmartBack();
            return;
          }
          if (props.toc.list.length > s.activeChap + 1) {
            setState((prev) => ({
              ...prev,
              active: { type: "chapter" },
              activeChap: prev.activeChap + 1,
            }));
          } else {
            setState((prev) => ({ ...prev, active: null }));
          }
        }
      }

      if (index + 1 < chapList.length) {
        const nextItem = chapList[index + 1];
        if (Array.isArray(nextItem.data)) {
          numberSelect(nextItem, s.activeChap, 0);
        } else {
          onSelect(nextItem, s.activeChap);
        }
      } else {
        // If we finished a chapter and we are in CardView, go back to the Grid!
        if (props.toc.cardView) {
          handleSmartBack();
          return;
        }
        if (props.toc.list.length > s.activeChap + 1) {
          setState((prev) => ({
            ...prev,
            active: { type: "chapter" },
            activeChap: prev.activeChap + 1,
          }));
        } else {
          setState((prev) => ({ ...prev, active: null }));
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    setState((prev) => ({ ...prev, screenWidth: window.innerWidth }));
  }, []);

  if (!hasData) {
    return (
      <Styled $hideTOC={true}>
        <div
          className="mainPlaceHolder"
          style={{
            flexDirection: "column",
            width: "100%",
            textAlign: "center",
            backgroundColor: "#f6fff5",
          }}
        >
          <div style={{ fontSize: "5rem", marginBottom: "20px" }}>🚀</div>
          <h1
            style={{ fontSize: "3rem", color: "#2b7d10", marginBottom: "10px" }}
          >
            Coming Soon!
          </h1>
          <p
            style={{
              fontSize: "1.5rem",
              color: "#555",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            We are working hard to build exciting exercises for this section.
            Please check back later!
          </p>
        </div>
      </Styled>
    );
  }

  return (
    <Styled
      $hideTOC={state.hideTOC}
      className={!state.hideTOC ? "showSidebar" : ""}
    >
      {props.toc.type === "curriculumIcon" && <IconView data={props.toc} />}
      {(!props.toc.type || props.toc.type === "nested") && !state.hideTOC && (
        <div style={{ maxHeight: "100vh", overflow: "auto" }}>
          <ol>
            <li
              className="head"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Svg
                id="minimize"
                onClick={() => setState({ ...state, hideTOC: true })}
              />
              <div>{props.toc.label}</div>
            </li>

            {hasData &&
              props.toc.list.map((chap, i) => {
                // 🟢 ISOLATE CHAPTER LOGIC: If using Grid View, ONLY show the selected chapter in the sidebar!
                if (
                  props.toc.cardView &&
                  state.activeChap !== -1 &&
                  state.activeChap !== i
                ) {
                  return null;
                }

                return (
                  <div
                    key={chap.id || i}
                    className={`chapWrap ${
                      !props.toc.collapseRest &&
                      props.toc.list.length > 1 &&
                      state.activeChap === i
                        ? "selected"
                        : ""
                    }`}
                  >
                    {props.toc.list.length > 1 && (
                      <div className="chap">
                        <Svg
                          id="caretDown"
                          size="18"
                          color="var(--darkColor2)"
                          style={
                            state.toggleChaps[i]
                              ? {}
                              : { transform: "rotate(-90deg)" }
                          }
                          onClick={() => {
                            let toggleChaps = [...state.toggleChaps];
                            if (props.toc.collapseRest) {
                              toggleChaps = toggleChaps.map((item, j) =>
                                i === j ? !toggleChaps[i] : false,
                              );
                            } else {
                              toggleChaps[i] = !toggleChaps[i];
                            }
                            setState({ ...state, toggleChaps });
                          }}
                        />
                        <div
                          onClick={() => {
                            let toggleChaps = [...state.toggleChaps];
                            if (props.toc.collapseRest) {
                              toggleChaps = toggleChaps.map(() => false);
                            }
                            toggleChaps[i] = true;
                            setState({
                              ...state,
                              active: Array.isArray(
                                props.toc.list[i].list[0].data,
                              )
                                ? getDataFromGroupAct(
                                    props.toc.list[i].list[0],
                                    0,
                                  )
                                : props.toc.list[i].list[0],
                              activeChap: i,
                              toggleChaps,
                            });
                          }}
                        >
                          {i + 1}. {chap.label}{" "}
                          {chap.altLabel ? `(${chap.altLabel})` : ""}
                        </div>
                      </div>
                    )}

                    {state.toggleChaps[i] &&
                      chap.list?.map((item, j) => {
                        if (!Array.isArray(item.data)) {
                          return (
                            <li
                              key={item.id}
                              className={
                                state.active &&
                                state.active.id === item.id &&
                                state.activeChap === i
                                  ? "selected"
                                  : ""
                              }
                              onClick={() => onSelect(item, i, j)}
                              style={{
                                backgroundColor:
                                  item.type === "chapter" ? "pink" : "",
                              }}
                            >
                              {getIcon(item.type)}
                              <span className="numbering"> {j + 1}. </span>
                              <span className="item">{item.label}</span>
                            </li>
                          );
                        } else {
                          return (
                            <li
                              key={item.id}
                              onClick={(e) => numberSelect(item, i, 0, e)}
                              className={
                                state.active &&
                                state.active.id === item.id &&
                                state.activeChap === i
                                  ? "selected"
                                  : ""
                              }
                            >
                              <div>
                                <div style={{ display: "flex" }}>
                                  {getIcon(item.type)}
                                  <span className="numbering"> {j + 1}. </span>
                                  {item.label}
                                </div>
                                {Array.isArray(item.data) && (
                                  <div className="numWrap">
                                    {item.data.map((data, k) => (
                                      <div
                                        key={k}
                                        className={
                                          state.active &&
                                          state.active.id === item.id &&
                                          state.activeNum === k + 1
                                            ? "selected"
                                            : ""
                                        }
                                        onClick={(e) =>
                                          numberSelect(item, i, k, e)
                                        }
                                      >
                                        {k + 1}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </li>
                          );
                        }
                      })}
                  </div>
                );
              })}
          </ol>
        </div>
      )}

      {props.toc.type === "curriculumList" && (
        <PIconView data={props.toc} appType="small" />
      )}

      {/* {state.hideTOC && state.activeChap !== -1 && ( */}
      {state.hideTOC && (
        // <div style={{ marginTop: 50 }}>
        <div
          style={{
            position: "fixed",
            top: "10px",
            left: "10px",
            zIndex: 1100,
          }}
        >
          <Svg
            size="32"
            d={playlistIconSvgPath}
            color="var(--d)"
            onClick={() => setState({ ...state, hideTOC: false })}
          />
        </div>
      )}

      {(!props.toc.type || props.toc.type === "nested") && (
        <div className="mainPlaceHolder">
          {state.active && state.active.type === "chapter" && (
            <div className="chapDisplay">
              <div style={{ textDecoration: "underline" }}>
                Chapter {state.activeChap + 1}{" "}
              </div>
              <div className="chapName">
                {props.toc.list[state.activeChap].label}
              </div>
              <div style={{ marginTop: 40 }}>
                <Button
                  primary
                  onClick={() => {
                    const firstItem = props.toc.list[state.activeChap].list[0];
                    if (Array.isArray(firstItem.data)) {
                      numberSelect(firstItem, state.activeChap, 0);
                    } else {
                      onSelect(firstItem, state.activeChap);
                    }
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
          {!props.toc.cardView && !state.active && (
            <div className="placeHolder">
              Click on the resource on the left to load the content here.
            </div>
          )}
          {}

          {/* {props.toc.cardView && !state.active && ( */}
          {props.toc.cardView && state.activeChap === -1 && (
            <SubCards
              toc={props.toc}
              onSelect={(index) => {
                const selectedChapter = props.toc.list[index];
                console.log("🎯 onSelect called with:", selectedChapter);
                if (!selectedChapter) return;

                // 1️⃣ Find the first valid activity (skip menus/folders/nested chapters)
                let firstItem = selectedChapter.list?.[0];
                while (
                  firstItem &&
                  ["chapter", "menu", "folder"].includes(firstItem.type)
                ) {
                  firstItem = firstItem.list?.[0];
                }

                if (!firstItem) {
                  console.error("No valid activity found in this chapter.");
                  return;
                }

                // 2️⃣ Update UI to show sidebar & loading state
                setState((prev) => ({
                  ...prev,
                  hideTOC: false,
                  activeChap: index,
                  active: null,
                  // active: { loading: true },
                }));

                onSelect(firstItem, index, 0);

                // if (Array.isArray(firstItem.data)) {
                //   numberSelect(firstItem, index, 0);
                // } else {
                //   onSelect(firstItem, index, 0);
                // }
              }}
            />
          )}

          {state.active?.loading ? (
            <div>⏳ Loading...</div>
          ) : state.active &&
            state.active.type !== "chapter" &&
            state.active.data ? (
            <DelayLoader lazyLoad data={state.active}>
              {displayResource(
                state.active,
                () => setState({ ...state, active: null }),
                null,
                getCategoryBackground(props.toc.label, playlistId),
              )}
            </DelayLoader>
          ) : null}
        </div>
      )}
    </Styled>
  );
}

function getIcon(type) {
  switch (type) {
    case "pdf":
      return <img src={publicPath("/img/icons/pdfIcon.png")} alt="PDF" />;
    case "link":
      return <img src={publicPath("/img/icons/linkIcon.png")} alt="Link" />;
    case "pLink":
      return <img src={publicPath("/img/icons/icon32.png")} alt="Link" />;
    case "mvid":
      return <img src={publicPath("/img/icons/videoIcon.png")} alt="Video" />;
    case "youtube":
      return (
        <img src={publicPath("/img/icons/youtubeIcon.png")} alt="YouTube" />
      );
    default:
      return <div className="imgPlaceHolder" />;
  }
}

function displayResource(item, onClose, onChapterNext, bgImage) {
  const isApiBg = bgImage && bgImage.startsWith("http");
  const bgUrl = isApiBg ? bgImage : publicPath("/bg-images/" + bgImage);

  if (!item || !item.data) {
    return (
      <div
        style={{
          fontSize: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        ⏳ Loading...
      </div>
    );
  }

  switch (item.type) {
    case "pdf": {
      let src = item.src;
      if (src.indexOf(".") === -1) src += ".pdf";
      return <iframe className="actIFrame" src={loadAsset(src)} />;
    }
    case "mvid": {
      let video = item.src;
      let payload =
        typeof video === "string"
          ? { src: video, width: 360, height: 600 }
          : { src: video.file, width: video.width, height: video.height };
      if (payload.src.indexOf(".") === -1) payload.src += ".mp4";
      return (
        <iframe
          className="actIFrame"
          src="/lmsLearning/acts/video"
          data-payload={JSON.stringify(payload)}
        />
      );
    }
    case "link":
    case "youtube":
    case "pLink":
      return null;
  }

  // const payload = { id: item.id, bgImage: bgUrl, ...item.data };
  const payload = { id: item.id, bgImage: bgUrl, ...(item.data || {}) };

  const containerStyle = {
    backgroundImage: `url(${bgUrl})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    width: "100%",
    height: "100vh",
    backgroundColor: "transparent",
    position: "relative",
    overflow: "hidden",
  };

  switch (item.type) {
    case "mcq":
      return (
        <div style={containerStyle}>
          <McqAct data={payload} />
        </div>
      );
    case "completeWord":
      return (
        <div style={containerStyle}>
          <CompleteWordAct data={payload} />
        </div>
      );
    case "wordsearch":
      return (
        <div style={containerStyle}>
          <WordSearchAct data={payload} />
        </div>
      );
    case "sequence":
      return (
        <div style={containerStyle}>
          <SequenceAct data={payload} />
        </div>
      );
    case "classifySentence":
      return (
        <div style={containerStyle}>
          <ClassifySentenceAct data={payload} />
        </div>
      );
    case "matchByDragDrop":
      return (
        <div style={containerStyle}>
          <MatchByAct data={payload} />
        </div>
      );
    case "informationProcessing":
      return (
        <div style={containerStyle}>
          <InformationProcessingAct data={payload} />
        </div>
      );
    case "dragAndDrop":
      return (
        <div style={containerStyle}>
          <DragDropAct data={payload} />
        </div>
      );
    case "match": {
      const text = item.data?.text || "";
      const isPairFormat = text.includes(",") && text.includes("\n");

      return (
        <div style={containerStyle}>
          {isPairFormat ? (
            <MatchPairs data={payload} />
          ) : (
            <MatchByAct data={payload} />
          )}
        </div>
      );
    }
    case "completePuzzle":
      // return <JoinWords data={item} />;
      return (
        <div style={containerStyle}>
          <JoinWords data={item} />
        </div>
      );

    case "fillup":
      return (
        <div style={containerStyle}>
          <FillupAct data={payload} />
        </div>
      );

    case "selectWord":
      return (
        <div style={containerStyle}>
          <SelectWordAct data={payload} />
        </div>
      );

    case "rightOne":
      return (
        <div style={containerStyle}>
          <RightOneAct data={payload} />
        </div>
      );

    case "group":
      return (
        <div style={containerStyle}>
          <GroupAct data={payload} />
        </div>
      );

    default: {
      const localTypes = [
        "classifySentence",
        "matchByDragDrop",
        "informationProcessing",
        "sequence",
        "dragAndDrop",
        "wordsearch",
        "completeWord",
      ];
      const isLocal = localTypes.includes(item.type);
      let iframeSrc;
      let str = JSON.stringify(item.data);

      if (item.type === "classifySentence") {
        const payloadData = { id: item.id, ...item.data };
        const compressed = LZString.compressToEncodedURIComponent(
          JSON.stringify(payloadData),
        );
        iframeSrc = `/lms-system/acts/classifySentence/index.html?c=${compressed}`;
      } else if (isLocal) {
        iframeSrc = `/lms-system/acts/${item.type}/index.html?payload=${encodeURIComponent(str)}`;
      } else {
        iframeSrc = `https://pschool.app/acts/${item.type}?payload=${str}`;
      }

      return (
        <div style={containerStyle}>
          <iframe
            className="actIFrame"
            style={{
              border: "none",
              width: "100%",
              height: "100%",
              mixBlendMode: !isLocal ? "multiply" : "normal",
              padding: "20px",
            }}
            sandbox="allow-scripts allow-same-origin allow-forms"
            referrerPolicy="no-referrer"
            src={iframeSrc}
            onLoad={(e) => {
              if (isLocal) {
                try {
                  const doc =
                    e.target.contentDocument || e.target.contentWindow.document;
                  if (doc) doc.body.style.backgroundColor = "transparent";
                } catch {}
              }
            }}
          />
        </div>
      );
    }
  }
}

function getCategoryBackground(label, id) {
  if (id && !isNaN(id)) {
    return apiService.getBgImageUrl(id);
  }
  if (!label) return "bg30.jpg";

  const l = label.toLowerCase();
  if (l.includes("composition")) return "bg25.jpg";
  if (l.includes("spelling")) return "bg30.jpg";
  if (l.includes("grammar")) return "bg32.jpg";
  if (l.includes("vocabulary")) return "bg33.jpg";
  if (l.includes("sentence")) return "sentence.jpg";
  if (l.includes("idiom")) return "idiom.jpg";
  if (l.includes("word building") || l.includes("wordbuilding"))
    return "bg31.jpg";
  if (l.includes("word search") || l.includes("wordsearch"))
    return "wordsearch.jpg";
  if (l.includes("listening")) return "bg24.jpg";
  if (l.includes("guided composition")) return "bg25.jpg";
  if (l.includes("comprehension")) return "bg22.jpg";

  return "bg30.jpg";
}
