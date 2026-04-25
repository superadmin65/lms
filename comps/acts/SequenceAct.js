import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./SequenceAct.module.css";
import { apiService } from "../../utils/apiService"; // Imported Central Service
import Confetti from "react-confetti";

function generateUniqueId(title, text) {
  const source = (title || "") + (text || "");
  let hash = 0;
  for (let i = 0; i < source.length; i++) {
    hash = (hash << 5) - hash + source.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString();
}

export default function SequenceAct({ data }) {
  const [appState, setAppState] = useState("LOADING");
  const [queue, setQueue] = useState([]);
  const [currentRound, setCurrentRound] = useState(null);
  const [history, setHistory] = useState([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [blocks, setBlocks] = useState([]);
  const [connections, setConnections] = useState([]);
  const [hasUsedHint, setHasUsedHint] = useState(false);
  const [hasGivenUp, setHasGivenUp] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const [isDrawing, setIsDrawing] = useState(false);
  const [startIdx, setStartIdx] = useState(-1);
  const [tempLine, setTempLine] = useState(null);

  const canvasRef = useRef(null);
  const blockRefs = useRef(new Map());

  const [userId, setUserId] = useState(null);
  const [activityId, setActivityId] = useState("");
  const [title, setTitle] = useState("Sequence Activity");

  // --- 1. INITIALIZATION ---
  useEffect(() => {
    if (!data) return;

    const uid = Number(data.user_id || localStorage.getItem("user_id") || 0);
    setUserId(uid);

    const rawTitle = data.title || "Sequence Game";
    let rawText = data.text || "";
    const generatedId = data.id || generateUniqueId(rawTitle, rawText);

    setActivityId(generatedId);
    setTitle(rawTitle);

    const lines = rawText.split("\n").filter((line) => line.trim().length > 0);
    const parsedQueue = lines.map((line) => {
      const cleanLine = line.trim();
      let chunks = [];
      if (cleanLine.includes(" ")) {
        chunks = cleanLine.split(/\s+/).filter(Boolean);
      } else if (cleanLine.includes(",")) {
        chunks = cleanLine.split(",").map((s) => s.trim());
      } else {
        try {
          const segmenter = new Intl.Segmenter("hi", {
            granularity: "grapheme",
          });
          chunks = Array.from(segmenter.segment(cleanLine)).map(
            (s) => s.segment,
          );
        } catch (e) {
          chunks = cleanLine.split("");
        }
      }
      return { fullText: cleanLine, chunks };
    });

    setQueue(parsedQueue);

    const fetchProgress = async () => {
      if (!uid) {
        startNextRound(parsedQueue);
        return;
      }
      try {
        // --- REFACTORED TO USE apiService ---
        const res = await apiService.getSequenceProgress(uid, generatedId);
        const savedData = res.data;

        if (savedData && savedData.status === "COMPLETED") {
          setIsReadOnly(true);
          if (savedData.data && savedData.data.history) {
            setHistory(savedData.data.history);
          }
          setAppState("SUMMARY");
          return;
        }
      } catch (e) {
        console.log("New session or progress not found.");
      }
      startNextRound(parsedQueue);
    };

    fetchProgress();
  }, [data]);

  // --- 2. ROUND MANAGEMENT ---
  const startNextRound = (currentQueue) => {
    if (currentQueue.length === 0) {
      endGame(history);
      return;
    }

    const nextRound = currentQueue[0];
    setQueue(currentQueue.slice(1));
    setCurrentRound(nextRound);
    setConnections([]);
    setHasUsedHint(false);
    setHasGivenUp(false);
    setResultMessage("");
    setTempLine(null);
    setIsDrawing(false);
    setStartIdx(-1);

    setTimeout(() => spawnBlocks(nextRound.chunks), 50);
  };

  const spawnBlocks = (chunks) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const existingPositions = [];
    const newBlocks = [];

    const blockW = 100;
    const blockH = 100;
    const padding = 30;
    const maxW = rect.width - blockW - padding;
    const maxH = rect.height - blockH - padding;

    chunks.forEach((text, index) => {
      let attempts = 0;
      let x, y, safe;
      do {
        safe = true;
        x = Math.random() * (maxW - padding) + padding;
        y = Math.random() * (maxH - padding) + padding;

        for (let pos of existingPositions) {
          const dist = Math.sqrt(
            Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2),
          );
          if (dist < 90) {
            safe = false;
            break;
          }
        }
        attempts++;
      } while (!safe && attempts < 50);

      existingPositions.push({ x, y });
      newBlocks.push({ index, text, x, y, isShaking: false, isHint: false });
    });

    setBlocks(newBlocks);
    setAppState("PLAYING");
  };

  // --- 3. DRAWING & CONNECTIONS ---
  const getBlockCenter = (idx) => {
    const b = blocks.find((b) => b.index === idx);
    const el = blockRefs.current.get(idx);
    if (!b || !el) return { x: 0, y: 0 };
    return {
      x: b.x + el.offsetWidth / 2,
      y: b.y + el.offsetHeight / 2,
    };
  };

  const handlePointerDown = (e, index) => {
    if (appState !== "PLAYING" || (e.button !== 0 && e.type !== "touchstart"))
      return;
    if (e.cancelable) e.preventDefault();

    const lastConnected =
      connections.length > 0 ? connections[connections.length - 1] : -1;
    let validStart = false;

    if (connections.length === 0 && index === 0) validStart = true;
    else if (lastConnected === index) validStart = true;

    if (!validStart) {
      triggerShake(index);
      return;
    }

    setIsDrawing(true);
    setStartIdx(index);
    const center = getBlockCenter(index);
    setTempLine({ x1: center.x, y1: center.y, x2: center.x, y2: center.y });
  };

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDrawing || !canvasRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const rect = canvasRef.current.getBoundingClientRect();
      const x2 = clientX - rect.left;
      const y2 = clientY - rect.top;

      setTempLine((prev) => (prev ? { ...prev, x2, y2 } : null));
    },
    [isDrawing],
  );

  const handlePointerUp = useCallback(
    (e) => {
      if (!isDrawing) return;
      setIsDrawing(false);
      setTempLine(null);

      const clientX = e.changedTouches
        ? e.changedTouches[0].clientX
        : e.clientX;
      const clientY = e.changedTouches
        ? e.changedTouches[0].clientY
        : e.clientY;

      let targetIdx = -1;
      blockRefs.current.forEach((el, idx) => {
        if (!el) return;

        const rect = el.getBoundingClientRect();
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          targetIdx = idx;
        }
      });

      if (targetIdx !== -1 && targetIdx !== startIdx) {
        validateConnection(startIdx, targetIdx);
      }
      setStartIdx(-1);
    },
    [isDrawing, startIdx, connections, blocks],
  );

  useEffect(() => {
    document.addEventListener("mousemove", handlePointerMove);
    document.addEventListener("mouseup", handlePointerUp);
    document.addEventListener("touchmove", handlePointerMove, {
      passive: false,
    });
    document.addEventListener("touchend", handlePointerUp);
    return () => {
      document.removeEventListener("mousemove", handlePointerMove);
      document.removeEventListener("mouseup", handlePointerUp);
      document.removeEventListener("touchmove", handlePointerMove);
      document.removeEventListener("touchend", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  const validateConnection = (from, to) => {
    if (to === from + 1) {
      const newConns = [...connections, to];
      setConnections(newConns);
      if (newConns.length === blocks.length - 1) {
        completeRound(newConns, false);
      }
    } else {
      triggerShake(to);
    }
  };

  const triggerShake = (idx) => {
    setBlocks((prev) =>
      prev.map((b) => (b.index === idx ? { ...b, isShaking: true } : b)),
    );
    setTimeout(() => {
      setBlocks((prev) =>
        prev.map((b) => (b.index === idx ? { ...b, isShaking: false } : b)),
      );
    }, 300);
  };

  // --- 4. GAME ACTIONS ---
  const handleHint = () => {
    if (isReadOnly) return;
    setHasUsedHint(true);
    const nextIdx =
      connections.length === 0 ? 0 : connections[connections.length - 1] + 1;

    setBlocks((prev) =>
      prev.map((b) => (b.index === nextIdx ? { ...b, isHint: true } : b)),
    );
    setTimeout(() => {
      setBlocks((prev) =>
        prev.map((b) => (b.index === nextIdx ? { ...b, isHint: false } : b)),
      );
    }, 500);
  };

  const handleGiveUp = () => {
    if (isReadOnly) return;
    setHasGivenUp(true);
    const fullConns = [];
    for (let i = 1; i < blocks.length; i++) fullConns.push(i);
    setConnections(fullConns);
    completeRound(fullConns, true);
  };

  const completeRound = (finalConns, gaveUp) => {
    setAppState("ROUND_END");

    let score = 1;
    let status = "perfect";
    if (gaveUp) {
      score = 0;
      status = "fail";
    } else if (hasUsedHint) {
      score = 0.5;
      status = "hint";
    }

    const newHistory = [
      ...history,
      { text: currentRound.fullText, status, score },
    ];
    setHistory(newHistory);

    let totalScore = newHistory.reduce((acc, h) => acc + h.score, 0);
    saveProgressAPI(newHistory, totalScore, newHistory.length);

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const gap = 10;
      let totalW = 0;
      blocks.forEach((_, i) => {
        const el = blockRefs.current.get(i);
        totalW += (el ? el.offsetWidth : 80) + gap;
      });

      let currentX = (rect.width - totalW) / 2;
      const centerY = rect.height / 2 - 22;

      setBlocks((prev) =>
        prev.map((b) => {
          const el = blockRefs.current.get(b.index);
          const w = el ? el.offsetWidth : 80;
          const res = { ...b, x: currentX, y: centerY };
          currentX += w + gap;
          return res;
        }),
      );
    }

    setResultMessage(gaveUp ? "Solution Shown" : "Good Job!");
    if (!gaveUp && !hasUsedHint) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const endGame = (finalHistory) => {
    setAppState("SUMMARY");
    let totalScore = finalHistory.reduce((acc, h) => acc + h.score, 0);
    if (!isReadOnly) {
      completeActivityAPI(totalScore, finalHistory.length);
    }
  };

  // --- 5. REFACTORED API CALLS ---
  const saveProgressAPI = async (hist, score, totalRounds) => {
    if (!userId) return;
    try {
      await apiService.saveSequenceProgress({
        user_id: userId,
        activity_id: activityId,
        progress_json: JSON.stringify({ history: hist }),
        score: score,
        attempted: totalRounds,
        status: "IN_PROGRESS",
      });
    } catch (e) {
      console.error("Progress save failed");
    }
  };

  const completeActivityAPI = async (finalScore, totalRounds) => {
    if (!userId) return;
    try {
      await apiService.completeSequence({
        user_id: userId,
        activity_id: activityId,
        score: finalScore,
        attempted: totalRounds,
      });
    } catch (e) {
      console.error("Completion save failed");
    }
  };

  const handleFinish = () => {
    try {
      window.parent.postMessage(JSON.stringify({ done: true }), "*");
    } catch (e) {}
  };

  const totalScoreCalc = history.reduce((acc, h) => acc + h.score, 0);
  const resetActivity = async () => {
    if (!window.confirm("Are you sure you want to reset this activity?"))
      return;

    const rawText = data.text || "";
    const lines = rawText.split("\n").filter((line) => line.trim().length > 0);

    const parsedQueue = lines.map((line) => {
      const cleanLine = line.trim();
      let chunks = [];

      if (cleanLine.includes(" ")) {
        chunks = cleanLine.split(/\s+/).filter(Boolean);
      } else if (cleanLine.includes(",")) {
        chunks = cleanLine.split(",").map((s) => s.trim());
      } else {
        try {
          const segmenter = new Intl.Segmenter("hi", {
            granularity: "grapheme",
          });
          chunks = Array.from(segmenter.segment(cleanLine)).map(
            (s) => s.segment,
          );
        } catch {
          chunks = cleanLine.split("");
        }
      }

      return { fullText: cleanLine, chunks };
    });

    // Reset frontend state
    setHistory([]);
    setQueue(parsedQueue);
    setCurrentRound(null);
    setBlocks([]);
    setConnections([]);
    setHasUsedHint(false);
    setHasGivenUp(false);
    setResultMessage("");
    setTempLine(null);
    setIsDrawing(false);
    setStartIdx(-1);
    setIsReadOnly(false);
    setAppState("LOADING");

    // Reset backend progress
    try {
      await apiService.saveSequenceProgress({
        user_id: userId,
        activity_id: activityId,
        progress_json: JSON.stringify({
          history: [],
        }),
        score: 0,
        attempted: 0,
        status: "IN_PROGRESS",
      });
    } catch (e) {
      console.error("Failed to reset sequence progress");
    }

    // Restart game
    startNextRound(parsedQueue);
  };

  return (
    <div className={styles.wrapper}>
      {showConfetti && <Confetti />}
      <div className={styles.mainCard}>
        <div className={styles.mainCardInner}>
          {appState !== "SUMMARY" && (
            <>
               <div
                  className={styles.title}
                  dangerouslySetInnerHTML={{
                    __html: (title || "").replace(/\(/g, "<br>("),
                  }}
                />
             

              <div style={{ display: "flex", justifyContent: "end" }}>
                <div
                  className={styles.score}
                  style={{ display: appState !== "LOADING" ? "block" : "none" }}
                >
                  Remaining: {queue.length + (appState === "PLAYING" ? 1 : 0)}
                </div>
              </div>

              <div className={styles.canvasArea} ref={canvasRef}>
                <svg className={styles.svgLayer}>
                  {appState === "PLAYING" &&
                    connections.map((toIdx) => {
                      const fromIdx = toIdx - 1;
                      const c1 = getBlockCenter(fromIdx);
                      const c2 = getBlockCenter(toIdx);

                      return (
                        <line
                          key={`conn-${toIdx}`}
                          x1={c1.x}
                          y1={c1.y}
                          x2={c2.x}
                          y2={c2.y}
                          stroke="#ef4444"
                          strokeWidth="4"
                        />
                      );
                    })}

                  {appState === "PLAYING" && tempLine && startIdx !== -1 && (
                    <line
                      x1={getBlockCenter(startIdx).x}
                      y1={getBlockCenter(startIdx).y}
                      x2={tempLine.x2}
                      y2={tempLine.y2}
                      stroke="#60a5fa"
                      strokeWidth="4"
                      strokeDasharray="5,5"
                    />
                  )}
                </svg>

                {blocks.map((b) => {
                  const isActive = startIdx === b.index;
                  const isCompleted = appState === "ROUND_END";

                  const shapeType = currentRound?.fullText?.length % 2 || 0;
                  let shapeClass = "";
                  if (shapeType === 0) shapeClass = styles.shapePlane;
                  else shapeClass = styles.shapeBlob;
                  let bClass = `${styles.wordBlock} ${shapeClass}`;

                  if (isActive) bClass += ` ${styles.wordBlockActive}`;
                  if (isCompleted) bClass += ` ${styles.wordBlockCompleted}`;
                  if (b.isShaking) bClass += ` ${styles.shake}`;
                  if (b.isHint) bClass += ` ${styles.hintBorder}`;

                  return (
                    <div
                      key={`block-${b.index}`}
                      ref={(el) => blockRefs.current.set(b.index, el)}
                      className={bClass}
                      style={{ left: `${b.x}px`, top: `${b.y}px` }}
                      onMouseDown={(e) => handlePointerDown(e, b.index)}
                      onTouchStart={(e) => handlePointerDown(e, b.index)}
                    >
                      {b.text}
                    </div>
                  );
                })}
              </div>

              <div className={styles.resultMessage}>{resultMessage}</div>

              <div className={styles.controls}>
                {appState === "PLAYING" && (
                  <div className={styles.btnGroup}>
                    <button
                      className={`${styles.btn} ${styles.primary}`}
                      onClick={handleHint}
                      disabled={isReadOnly}
                    >
                      Hint
                    </button>

                    <button
                      className={`${styles.btn} ${styles.danger}`}
                      onClick={handleGiveUp}
                      disabled={isReadOnly}
                    >
                      Give Up
                    </button>
                  </div>
                )}

                {appState === "ROUND_END" && (
                  <button
                    className={`${styles.btn} ${styles.primary}`}
                    onClick={() => startNextRound(queue)}
                  >
                    Next
                  </button>
                )}
              </div>
            </>
          )}

          {appState === "SUMMARY" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div className={styles.main}>
                  <div className={styles.title}>
                  You have completed this activity.
                </div>
                  </div>

              </div>

              <div
                style={{
                  flexGrow: 1,
                  overflowY: "auto",
                  paddingRight: "10px",
                  marginTop: "10px",
                }}
              >
                {history.length > 0 ? (
                  history.map((item, i) => {
                    const isPerfect = item.score === 1;
                    const isFail = item.score === 0;
                    return (
                      <div key={i} className={styles.summaryItem}>
                        <div
                          style={{ fontWeight: "bold", marginBottom: "4px" }}
                        >
                          {i + 1}. {item.text}
                        </div>
                        <div style={{ fontSize: "0.9em" }}>
                          Score:{" "}
                          <span
                            style={{
                              color: isPerfect
                                ? "#2ecc71"
                                : isFail
                                  ? "#e74c3c"
                                  : "#d97706",
                              fontWeight: "bold",
                            }}
                          >
                            {item.score}
                          </span>
                          {item.status === "hint" && (
                            <span style={{ color: "#777", marginLeft: "8px" }}>
                              (Hint used)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: "20px", textAlign: "center" }}>
                    No data available.
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <div className={styles.small} style={{ margin: 0 }}>
                  Final Score: {totalScoreCalc} / {history.length}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <button
                    className={`${styles.btn} ${styles.primary}`}
                    onClick={resetActivity}
                  >
                    Reset Activity
                  </button>

                  <button
                    className={`${styles.btn} ${styles.primary}`}
                    onClick={handleFinish}
                  >
                    Finish{" "}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
