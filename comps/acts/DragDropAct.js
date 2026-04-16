// comps/acts/DragDropAct.js
import React, { useState, useEffect } from "react";
import styles from "./DragDropAct.module.css";

// Helpers
function fixImgPath(src) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  if (src.startsWith("/img")) return "/lms-system" + src;
  return src;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DragDropAct({ data }) {
  const [appState, setAppState] = useState("LOADING"); // LOADING, PLAYING, EVALUATED
  const [mode, setMode] = useState("FLOW"); // FLOW or ABSOLUTE
  const [title, setTitle] = useState("");

  // Flow Mode Data
  const [flowImage, setFlowImage] = useState(null);
  const [flowTextParts, setFlowTextParts] = useState([]);

  // Absolute Mode Data
  const [absRows, setAbsRows] = useState([]);

  // Interaction Data
  const [zones, setZones] = useState([]); // [{ index, correctWord, userWord }]
  const [options, setOptions] = useState([]); // Unique draggable words
  const [dragOverIdx, setDragOverIdx] = useState(null);

  // Mobile UI Fixes
  const [isDragging, setIsDragging] = useState(false);

  const initializeActivity = () => {
    if (!data) return;

    const d = data.data && data.data.words ? data.data : data;
    if (!d || !d.words) {
      console.error("Invalid DragDrop Data");
      return;
    }
    useEffect(() => {
      initializeActivity();
    }, [data]);

    setTitle(
      (d.title || data.label || "Drag the words to the correct place").replace(
        /\s*\(/,
        "\n(",
      ),
    );

    const textObj =
      d.svg && d.svg.paths ? d.svg.paths.find((p) => p.type === "text") : null;

    const isFlow = !!(textObj && textObj.text);
    setMode(isFlow ? "FLOW" : "ABSOLUTE");

    const wordsList = d.words.map((w) => w.word);
    const uniqueOptions = shuffleArray([...new Set(wordsList)]);
    setOptions(uniqueOptions);

    const initialZones = [];

    if (isFlow) {
      const imgPath = d.svg.paths.find((p) => p.type === "image");
      setFlowImage(imgPath ? fixImgPath(imgPath.src) : null);

      const rawHtml = textObj.text;
      const parts = rawHtml.split(/(_{2,})/g);
      setFlowTextParts(parts);

      let blankCount = 0;
      parts.forEach((part) => {
        if (part.match(/_{2,}/)) {
          initialZones.push({
            index: blankCount,
            correctWord: d.words[blankCount]?.word || "",
            userWord: null,
          });
          blankCount++;
        }
      });
    } else {
      const rows = [];

      d.words.forEach((w, i) => {
        let imgP = d.svg.paths.filter((p) => p.type === "image")[i];
        if (!imgP) imgP = d.svg.paths.find((p) => p.type === "image");

        rows.push({
          index: i,
          imgSrc: fixImgPath(imgP?.src),
        });

        initialZones.push({
          index: i,
          correctWord: w.word,
          userWord: null,
        });
      });

      setAbsRows(rows);
    }

    setZones(initialZones);
    setAppState("PLAYING");
  };

  // GLOBALLY LOCK BODY SCROLL DURING DRAG FOR MOBILE UX
  useEffect(() => {
    if (isDragging) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isDragging]);

  // --- Handlers ---
  const handleDragStart = (e, optText) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", optText);
  };

  const handleDragEnd = () => setIsDragging(false);

  const handleDrop = (e, index) => {
    e.preventDefault();
    setDragOverIdx(null);
    setIsDragging(false);

    if (appState === "EVALUATED") return;

    const droppedText = e.dataTransfer.getData("text/plain");
    if (!droppedText) return;

    const newZones = [...zones];
    newZones[index].userWord = droppedText;
    setZones(newZones);

    // Auto-validate immediately if all blanks are filled!
    const allFilled = newZones.every((z) => z.userWord !== null);
    if (allFilled) {
      setAppState("EVALUATED");
    }
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (appState !== "EVALUATED") setDragOverIdx(index);
  };

  const handleDragLeave = () => setDragOverIdx(null);

  const handleNextClick = () => {
    try {
      window.parent.postMessage(JSON.stringify({ done: true }), "*");
    } catch (e) {}
  };

  // --- Render Helpers ---
  const renderZone = (index) => {
    const zone = zones[index];
    if (!zone) return null;

    const isEvaluated = appState === "EVALUATED";
    const isHovered = dragOverIdx === index;
    const isCorrect = isEvaluated && zone.userWord === zone.correctWord;
    const isWrong = isEvaluated && zone.userWord !== zone.correctWord;

    let boxClass = mode === "FLOW" ? styles.dropZoneFlow : styles.dropZoneAbs;
    if (isHovered) boxClass += ` ${styles.dropZoneHover}`;
    if (isCorrect) boxClass += ` ${styles.correct}`;
    if (isWrong) boxClass += ` ${styles.wrong}`;
    const resetActivity = () => {
      if (!window.confirm("Are you sure you want to reset this activity?"))
        return;

      initializeActivity();
    };
    return (
      <React.Fragment key={`zone-${index}`}>
        <span
          className={boxClass}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
        >
          {zone.userWord}
        </span>
        {isWrong && (
          <span className={styles.feedbackSpan}> → {zone.correctWord}</span>
        )}
      </React.Fragment>
    );
  };

  const renderFlowMode = () => {
    let blankIndex = 0;
    return (
      <div>
        {flowImage && (
          <>
            <img
              src={flowImage}
              alt="Activity Resource"
              className={styles.flowImg}
            />
            {/* 🟢 ADDED: Bouncing Scroll Hint */}
            {appState === "PLAYING" && (
              <div className={styles.scrollHint}>Scroll Down To Answer 👇</div>
            )}
          </>
        )}
        <div className={styles.textContent}>
          {flowTextParts.map((part, i) => {
            if (part.match(/_{2,}/)) {
              return renderZone(blankIndex++);
            }
            return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
          })}
        </div>
      </div>
    );
  };

  const renderAbsoluteMode = () => {
    return (
      <div className={styles.absLayout}>
        {absRows.map((row) => (
          <div key={row.index} className={styles.absRow}>
            {row.imgSrc && (
              <img src={row.imgSrc} alt="Item" className={styles.absImg} />
            )}
            {renderZone(row.index)}
          </div>
        ))}
      </div>
    );
  };

  if (appState === "LOADING") return null;

  const usedOptions = zones.map((z) => z.userWord).filter(Boolean);

  return (
    <div
      className={styles.wrapper}
      style={{ overflowY: isDragging ? "hidden" : "auto" }}
    >
      <div className={styles.mainCard}>
        <div className={styles.mainCardInner}>
          <h2 className={styles.title}>{title}</h2>

          {/* The Scrollable Game Area */}
          <div
            className={styles.gameArea}
            style={{ overflowY: isDragging ? "hidden" : "auto" }}
          >
            {mode === "FLOW" ? renderFlowMode() : renderAbsoluteMode()}
          </div>

          {/* Word Bank safely locked to the bottom! */}
          {appState === "PLAYING" && (
            <div className={styles.wordBank}>
              {options.map((opt, i) => (
                <button
                  key={i}
                  draggable
                  onDragStart={(e) => handleDragStart(e, opt)}
                  onDragEnd={handleDragEnd}
                  className={`${styles.option} ${usedOptions.includes(opt) ? styles.used : ""}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {appState === "EVALUATED" && (
            <div className={styles.controlsRow}>
              <button
                className={`${styles.btn} ${styles.primary}`}
                onClick={resetActivity}
              >
                Reset Activity
              </button>

              <button
                className={`${styles.btn} ${styles.primary}`}
                onClick={handleNextClick}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
