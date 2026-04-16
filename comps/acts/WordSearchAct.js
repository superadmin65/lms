// comps/acts/WordSearchAct.js
import React, { useState, useEffect, useCallback } from "react";
import styles from "./WordSearchAct.module.css";

const WORD_COLORS = [
  "#F48FB1",
  "#90CAF9",
  "#CE93D8",
  "#80CBC4",
  "#FFCC80",
  "#B39DDB",
];

export default function WordSearchAct({ data }) {
  const [grid, setGrid] = useState([]);
  const [wordsData, setWordsData] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [foundLines, setFoundLines] = useState([]);
  const activityId = data?.id || "word_search_act";

  // Selection State
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState(null);
  const [currentSelection, setCurrentSelection] = useState([]);

  // Hint State
  const [hintActiveCell, setHintActiveCell] = useState(null);
  const [hintActiveWord, setHintActiveWord] = useState(null);

  // Initialize Game
  useEffect(() => {
    if (!data) return;

    // Parse Grid
    let parsedGrid = [];
    if (Array.isArray(data.table)) {
      parsedGrid = Array.isArray(data.table[0])
        ? data.table
        : data.table.map((row) => row.split(""));
    } else if (typeof data.table === "string") {
      parsedGrid = data.table
        .replace(/\r/g, "")
        .split("\n")
        .map((r) => r.split(""));
    }

    // Parse Words
    let parsedWords = [];
    if (data.words) {
      parsedWords = data.words.map((w) => ({
        wordStr: w.word.join(""),
        marker: w.marker,
      }));
    }

    // 🔥 CHECK SAVED STATE
    const saved = localStorage.getItem(activityId);

    if (saved) {
      const parsedState = JSON.parse(saved);

      setGrid(parsedGrid);
      setWordsData(parsedWords);

      setFoundWords(parsedState.foundWords || []);
      setFoundLines(parsedState.foundLines || []);

      return; // ✅ STOP fresh reset
    }

    // 👉 FIRST LOAD
    setGrid(parsedGrid);
    setWordsData(parsedWords);
  }, [data]);

  // --- SELECTION LOGIC ---
  const handleStart = (r, c) => {
    setIsSelecting(true);
    setStartCell({ r, c });
    setCurrentSelection([{ r, c }]);
  };
  // const saveProgress = (extra = {}) => {
  //   localStorage.setItem(
  //     activityId,
  //     JSON.stringify({
  //       foundWords,
  //       foundLines,
  //       ...extra,
  //     }),
  //   );
  // };
  const handleMove = (r, c) => {
    if (!isSelecting || !startCell) return;

    const r1 = startCell.r;
    const c1 = startCell.c;
    const r2 = r;
    const c2 = c;

    const dr = r2 - r1;
    const dc = c2 - c1;

    // Check diagonal or straight
    if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
      const steps = Math.max(Math.abs(dr), Math.abs(dc));
      const rStep = dr === 0 ? 0 : dr / steps;
      const cStep = dc === 0 ? 0 : dc / steps;

      const newSelection = [];
      for (let i = 0; i <= steps; i++) {
        newSelection.push({ r: r1 + i * rStep, c: c1 + i * cStep });
      }
      setCurrentSelection(newSelection);
    }
  };

  const checkWordAndEnd = useCallback(() => {
    if (!isSelecting || currentSelection.length === 0) return;

    const selectedWord = currentSelection
      .map((cell) => grid[cell.r][cell.c])
      .join("");
    const reverseWord = selectedWord.split("").reverse().join("");

    const targetObj = wordsData.find(
      (w) => w.wordStr === selectedWord || w.wordStr === reverseWord,
    );

    if (targetObj && !foundWords.includes(targetObj.wordStr)) {
      const wordStr = targetObj.wordStr;

      // Calculate Line perfectly based on 40px cell sizes
      const startCellSel = currentSelection[0];
      const endCellSel = currentSelection[currentSelection.length - 1];

      const x1 = startCellSel.c * 40 + 20;
      const y1 = startCellSel.r * 40 + 20;
      const x2 = endCellSel.c * 40 + 20;
      const y2 = endCellSel.r * 40 + 20;

      const length = Math.hypot(x2 - x1, y2 - y1);
      const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const color = WORD_COLORS[foundWords.length % WORD_COLORS.length];

      setFoundWords((prevWords) => {
        const updatedWords = [...prevWords, wordStr];

        setFoundLines((prevLines) => {
          const updatedLines = [
            ...prevLines,
            { width: length + 34, angle, midX, midY, color },
          ];

          // ✅ SAVE CORRECT STATE HERE
          localStorage.setItem(
            activityId,
            JSON.stringify({
              foundWords: updatedWords,
              foundLines: updatedLines,
            }),
          );

          return updatedLines;
        });

        return updatedWords;
      });
    }

    setIsSelecting(false);
    setStartCell(null);
    setCurrentSelection([]);
  }, [currentSelection, grid, wordsData, foundWords, isSelecting]);

  // Global Mouse Up
  useEffect(() => {
    const handleGlobalUp = () => checkWordAndEnd();
    document.addEventListener("mouseup", handleGlobalUp);
    document.addEventListener("touchend", handleGlobalUp);
    return () => {
      document.removeEventListener("mouseup", handleGlobalUp);
      document.removeEventListener("touchend", handleGlobalUp);
    };
  }, [checkWordAndEnd]);

  // Touch Handlers
  const handleTouchStart = (e) => {
    // Prevent scrolling while playing
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.dataset.row) {
      handleStart(parseInt(target.dataset.row), parseInt(target.dataset.col));
    }
  };

  const handleTouchMove = (e) => {
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.dataset.row) {
      handleMove(parseInt(target.dataset.row), parseInt(target.dataset.col));
    }
  };

  // --- HINT LOGIC ---
  const handleHint = () => {
    const targetWordObj = wordsData.find(
      (w) => !foundWords.includes(w.wordStr),
    );
    if (!targetWordObj) return;

    const c = targetWordObj.marker[0];
    const r = targetWordObj.marker[1];

    setHintActiveCell({ r, c });
    setHintActiveWord(targetWordObj.wordStr);

    setTimeout(() => {
      setHintActiveCell(null);
      setHintActiveWord(null);
    }, 1500);
  };

  // --- NEXT LOGIC ---
  const handleNext = () => {
    try {
      window.parent.postMessage(
        JSON.stringify({
          done: true,
          score: foundWords.length,
          total: wordsData.length,
        }),
        "*",
      );
    } catch (_) {}
  };

  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const isVictory =
    foundWords.length === wordsData.length && wordsData.length > 0;
  const resetActivity = () => {
    if (!window.confirm("Are you sure you want to reset this activity?"))
      return;

    localStorage.removeItem(activityId); // ✅ IMPORTANT

    setFoundWords([]);
    setFoundLines([]);

    setIsSelecting(false);
    setStartCell(null);
    setCurrentSelection([]);

    setHintActiveCell(null);
    setHintActiveWord(null);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleText}>
            {data.title || "Find the given words"}
          </div>
        </div>

        {/* Game Area */}
        <div className={styles.gameArea}>
          <div className={styles.gridWrapper}>
            <div
              className={styles.wordGrid}
              style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              {/* 1. Render Render Drawn Lines (Behind Text) */}
              {foundLines.map((line, i) => (
                <div
                  key={`line-${i}`}
                  className={styles.highlightLine}
                  style={{
                    width: `${line.width}px`,
                    backgroundColor: line.color,
                    left: `${line.midX}px`,
                    top: `${line.midY}px`,
                    transform: `translate(-50%, -50%) rotate(${line.angle}deg)`,
                  }}
                />
              ))}

              {/* 2. Render Grid Cells (Text) */}
              {grid.map((row, r) =>
                row.map((letter, c) => {
                  const isSelected = currentSelection.some(
                    (sel) => sel.r === r && sel.c === c,
                  );

                  // A cell is visually 'found' if it lies on ANY of the found words' markers
                  // But since we use absolute lines, we just need to know if it should be white.
                  // We can check if it exists in any correctly selected word logic, or just rely on the line background
                  // The original CSS `.cell.found` only changes text color to white.

                  // For React, we'll determine if it's found by checking if it belongs to a found word.
                  // Easiest way: if its coordinates fall into any found word's marker range.
                  let isFound = false;
                  wordsData.forEach((w) => {
                    if (foundWords.includes(w.wordStr)) {
                      const c1 = w.marker[0],
                        r1 = w.marker[1],
                        c2 = w.marker[2],
                        r2 = w.marker[3];
                      const dr = r2 - r1,
                        dc = c2 - c1;
                      const steps = Math.max(Math.abs(dr), Math.abs(dc));
                      const rStep = dr === 0 ? 0 : dr / steps;
                      const cStep = dc === 0 ? 0 : dc / steps;
                      for (let i = 0; i <= steps; i++) {
                        if (r === r1 + i * rStep && c === c1 + i * cStep)
                          isFound = true;
                      }
                    }
                  });

                  const isHintActive =
                    hintActiveCell?.r === r && hintActiveCell?.c === c;

                  let cellClass = styles.cell;
                  if (isSelected) cellClass += ` ${styles.selected}`;
                  if (isFound) cellClass += ` ${styles.found}`;
                  if (isHintActive) cellClass += ` ${styles.hintActive}`;

                  return (
                    <div
                      key={`${r}-${c}`}
                      data-row={r}
                      data-col={c}
                      className={cellClass}
                      onMouseDown={() => handleStart(r, c)}
                      onMouseEnter={() => handleMove(r, c)}
                    >
                      {letter}
                    </div>
                  );
                }),
              )}
            </div>
          </div>
        </div>

        {/* Word Strip */}
        <div className={styles.wordStrip}>
          <div className={styles.wordList}>
            {wordsData.map((item) => {
              const isFound = foundWords.includes(item.wordStr);
              const isHinting = hintActiveWord === item.wordStr;

              let itemClass = styles.wordItem;
              if (isFound) itemClass += ` ${styles.wordItemFound}`;

              return (
                <div
                  key={item.wordStr}
                  className={itemClass}
                  style={
                    isHinting
                      ? {
                          backgroundColor: "#ffd700",
                          transform: "scale(1.1)",
                          fontWeight: "bold",
                        }
                      : {}
                  }
                >
                  {item.wordStr}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.gameFooter}>
          <div className={styles.scoreBadge}>
            Score: {foundWords.length} / {wordsData.length}
          </div>

          <div style={{ display: "flex" }}>
            {!isVictory && (
              <button
                className={`${styles.actionBtn} ${styles.hintBtn}`}
                onClick={handleHint}
              >
                Hint 💡
              </button>
            )}
            {isVictory && (
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className={`${styles.btn} ${styles.primary}`}
                  onClick={resetActivity}
                >
                  Reset Activity
                </button>

                <button
                  className={`${styles.btn} ${styles.primary}`}
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Victory Toast */}
        {isVictory && (
          <div className={styles.victoryToast}>
            <span>🎉 Great Job! Click Next to continue.</span>
          </div>
        )}
      </div>
    </div>
  );
}
