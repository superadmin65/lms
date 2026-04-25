import React, { useEffect, useState, useRef } from "react";
import styles from "./MatchPairs.module.css";

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function MatchPairs({ data }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [pairs, setPairs] = useState([]);
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [connections, setConnections] = useState([]);

  const [dragging, setDragging] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredRight, setHoveredRight] = useState(null);

  const [evaluated, setEvaluated] = useState(false);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("STARTED");

  const activityId = data?.id || "match_pairs";
  const STORAGE_KEY = `match_pairs_${activityId}`;

  const containerRef = useRef(null);
  const leftRefs = useRef({});
  const rightRefs = useRef({});

  /* ================= LOAD ================= */
  useEffect(() => {
    if (!data?.text || isInitialized) return;

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsedState = JSON.parse(saved);

      // ✅ Restore EVERYTHING
      setPairs(parsedState.pairs || []);
      setLeftItems(parsedState.leftItems || []);
      setRightItems(parsedState.rightItems || []);
      setConnections(parsedState.connections || []);
      setScore(parsedState.score || 0);
      setEvaluated(parsedState.evaluated || false);
      setStatus(parsedState.status || "STARTED");

      setIsInitialized(true);
      return;
    }

    // ✅ FIRST TIME INIT
    const lines = data.text.trim().split("\n");
    const parsed = lines.map((line) => {
      const [left, right] = line.split(",");
      return { left: left.trim(), right: right.trim() };
    });

    const left = parsed.map((p) => p.left);
    const right = shuffle(parsed.map((p) => p.right));

    setPairs(parsed);
    setLeftItems(left);
    setRightItems(right);

    // ✅ SAVE INITIAL STATE IMMEDIATELY
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        pairs: parsed,
        leftItems: left,
        rightItems: right,
        connections: [],
        score: 0,
        evaluated: false,
        status: "STARTED",
      }),
    );

    setIsInitialized(true);
  }, [data, isInitialized]);

  const saveProgress = (extra = {}) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        connections,
        score,
        evaluated,
        status,
        leftItems,
        rightItems,
        pairs,
        ...extra,
      }),
    );
  };

  useEffect(() => {
    if (!isInitialized) return;

    const timeout = setTimeout(() => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          pairs,
          leftItems,
          rightItems,
          connections,
          score,
          evaluated,
          status,
        }),
      );
    }, 100);

    return () => clearTimeout(timeout);
  }, [
    pairs,
    leftItems,
    rightItems,
    connections,
    score,
    evaluated,
    status,
    isInitialized,
  ]);
  /* ================= DRAG ================= */
  const getPoint = (el, side) => {
    if (!el || !containerRef.current) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    const parentRect = containerRef.current.getBoundingClientRect();

    return {
      x:
        side === "left"
          ? rect.right - parentRect.left
          : rect.left - parentRect.left,
      y: rect.top - parentRect.top + rect.height / 2,
    };
  };

  const handleMouseDown = (e, item) => {
    if (evaluated) return;
    e.preventDefault();

    const startPoint = getPoint(leftRefs.current[item], "left");
    setDragging({
      left: item,
      startX: startPoint.x,
      startY: startPoint.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - parentRect.left,
      y: e.clientY - parentRect.top,
    });
  };

  const handleMouseUp = () => {
    if (!dragging) return;

    if (hoveredRight) {
      const newConnections = [
        ...connections.filter(
          (c) => c.left !== dragging.left && c.right !== hoveredRight,
        ),
        { left: dragging.left, right: hoveredRight },
      ];

      setConnections(newConnections);
      saveProgress({ connections: newConnections });
    }

    setDragging(null);
    setHoveredRight(null);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    let correct = 0;

    connections.forEach((c) => {
      const match = pairs.find((p) => p.left === c.left);
      if (match?.right === c.right) correct++;
    });

    setScore(correct);
    setEvaluated(true);
    setStatus("SUMMARY");

    saveProgress({
      score: correct,
      evaluated: true,
      status: "SUMMARY",
    });
  };

  /* ================= RESET ================= */
  const resetQuiz = () => {
    if (!window.confirm("Reset activity?")) return;

    localStorage.removeItem(STORAGE_KEY);

    setPairs([]);
    setLeftItems([]);
    setRightItems([]);
    setConnections([]);
    setScore(0);
    setEvaluated(false);
    setStatus("STARTED");

    setIsInitialized(false); // 🔥 forces fresh init
  };

  const handleFinalNext = () => {
    try {
      window.parent.postMessage(
        JSON.stringify({
          done: true,
          score,
          total: pairs.length,
        }),
        "*",
      );
    } catch (_) {}
  };

  const getLineColorClass = (left, right) => {
    if (!evaluated) return styles.lineDefault;
    const match = pairs.find((p) => p.left === left);
    return match?.right === right ? styles.correct : styles.wrong;
  };

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!isInitialized) return;

    // wait for DOM paint
    const id = requestAnimationFrame(() => {
      forceUpdate((n) => n + 1);
    });

    return () => cancelAnimationFrame(id);
  }, [isInitialized, leftItems, rightItems]);

  /* ================= UI ================= */

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainCard}>
        <div className={styles.title}>
          {(data.title || "Match the Pairs").replace(/\s*\(/, "\n(")}
        </div>

        {status !== "SUMMARY" ? (
          <div className={styles.main}>
            <div
              className={styles.matchContainer}
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => setDragging(null)}
            >
              {/* LEFT */}
              <div className={styles.column}>
                {leftItems.map((item, i) => (
                  <div
                    key={i}
                    ref={(el) => (leftRefs.current[item] = el)}
                    className={`${styles.box} ${
                      dragging?.left === item ? styles.selected : ""
                    }`}
                    onMouseDown={(e) => handleMouseDown(e, item)}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* SVG */}
              <svg className={styles.lines}>
                {connections.map((c, i) => {
                  const p1 = getPoint(leftRefs.current[c.left], "left");
                  const p2 = getPoint(rightRefs.current[c.right], "right");

                  return (
                    <line
                      key={i}
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      className={getLineColorClass(c.left, c.right)}
                    />
                  );
                })}

                {dragging && (
                  <line
                    x1={dragging.startX}
                    y1={dragging.startY}
                    x2={mousePos.x}
                    y2={mousePos.y}
                    className={styles.lineDefault}
                    strokeDasharray="5,5"
                  />
                )}
              </svg>

              {/* RIGHT */}
              <div className={styles.column}>
                {rightItems.map((item, i) => (
                  <div
                    key={i}
                    ref={(el) => (rightRefs.current[item] = el)}
                    className={`${styles.box} ${
                      hoveredRight === item ? styles.hoverTarget : ""
                    }`}
                    onMouseEnter={() => setHoveredRight(item)}
                    onMouseLeave={() => setHoveredRight(null)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* FOOTER */}
            <div className={styles.footer}>
              <div className={styles.small}>
                Connected: {connections.length} / {pairs.length}
              </div>

              <button
                className={styles.nextBtn}
                onClick={handleSubmit}
                disabled={connections.length !== pairs.length}
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.main}>
            <h2 style={{ textAlign: "center", marginBottom: 10 }}>
              You have completed this activity.
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 12,
              }}
            >
              <div className={styles.small}>
                Final Score: {score} / {pairs.length}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button className={`${styles.nextBtn} `} onClick={resetQuiz}>
                  Reset Activity
                </button>

                <button
                  className={`${styles.nextBtn}`}
                  onClick={handleFinalNext}
                >
                  Next Activity
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
