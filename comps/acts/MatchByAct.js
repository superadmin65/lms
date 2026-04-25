import React, { useState, useEffect } from "react";
import styles from "./MatchByAct.module.css";
import { apiService } from "../../utils/apiService"; // Imported Central Service

function generateUniqueId(title, text) {
  const source = (title || "") + (text || "");
  let hash = 0;
  for (let i = 0; i < source.length; i++) {
    hash = (hash << 5) - hash + source.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString();
}

export default function MatchByAct({ data }) {
  const [appState, setAppState] = useState("LOADING");
  const [sentences, setSentences] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [options, setOptions] = useState([]);
  const [filled, setFilled] = useState([]);
  const [history, setHistory] = useState([]);
  const [isParagraphMode, setIsParagraphMode] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const STORAGE_KEY = `matchby_${data?.id || "default"}`;

  const [isReadOnly, setIsReadOnly] = useState(false);
  const [userId, setUserId] = useState(null);
  const [activityId, setActivityId] = useState("");
  const [title, setTitle] = useState("Loading...");

  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [score, setScore] = useState(0);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!data) return;

    const uid = Number(data.user_id || localStorage.getItem("user_id") || 0);
    setUserId(uid);

    const rawTitle = data.title || "Fill in the Blanks";
    let rawText = data.text || "";
    const generatedId = data.id || generateUniqueId(rawTitle, rawText);

    setActivityId(generatedId);
    setTitle(rawTitle.replace(/\s*\(/, "\n("));

    const lines = rawText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    let parsedSents = [],
      parsedAnswers = [],
      parsedFilled = [],
      parsedOpts = [],
      isPara = false;

    if (lines.length === 1) {
      isPara = true;
      const matches = [...rawText.matchAll(/\*(.*?)\*/g)];
      matches.forEach((match) => {
        parsedAnswers.push(match[1].trim());
        parsedFilled.push(null);
        parsedOpts.push(match[1].trim());
      });
    } else {
      isPara = false;
      lines.forEach((line) => {
        const match = line.match(/\*(.*?)\*/);
        if (!match) return;
        parsedSents.push(line.replace(/\*(.*?)\*/, "_____"));
        parsedAnswers.push(match[1].trim());
        parsedFilled.push(null);
        parsedOpts.push(match[1].trim());
      });
    }

    setSentences(parsedSents);
    setAnswers(parsedAnswers);
    setOriginalText(rawText);
    setIsParagraphMode(isPara);
    setOptions([...parsedOpts].sort(() => Math.random() - 0.5));

    // 🔥 LOAD FROM LOCAL STORAGE FIRST
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      setFilled(parsed.filled || []);
      setScore(parsed.score || 0);
      setAppState(parsed.appState || "PLAYING");
      setOptions(parsed.options || []);
      setIsParagraphMode(parsed.isParagraphMode || false);
      setOriginalText(parsed.originalText || "");
      setSentences(parsed.sentences || []);
      setAnswers(parsed.answers || []);

      return; // ⛔ stop API call
    }

    // fallback to API
    const fetchProgress = async () => {
      if (!uid) {
        setFilled(parsedFilled);
        setAppState("PLAYING");
        return;
      }
      try {
        // --- REFACTORED TO USE apiService ---
        const res = await apiService.getMatchByProgress(uid, generatedId);
        const savedData = res.data;

        if (savedData && savedData.status === "COMPLETED") {
          if (savedData.data && savedData.data.filled) {
            parsedFilled = savedData.data.filled;
          }
          setIsReadOnly(true);
          setFilled(parsedFilled);
          evaluateAnswers(parsedFilled, parsedAnswers, true);
          return;
        }
      } catch (e) {
        console.log("No saved progress found.");
      }

      setFilled(parsedFilled);
      setAppState("PLAYING");
    };

    fetchProgress();
  }, [data]);
  useEffect(() => {
    if (appState === "LOADING") return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        filled,
        score,
        appState,
        options,
        isParagraphMode,
        originalText,
        sentences,
        answers,
      }),
    );
  }, [
    filled,
    score,
    appState,
    options,
    isParagraphMode,
    originalText,
    sentences,
    answers,
  ]);
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

  const handleDragStart = (e, optText) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", optText);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    setDragOverIdx(null);
    setIsDragging(false);

    if (isReadOnly) return;

    const droppedText = e.dataTransfer.getData("text/plain");
    if (!droppedText) return;

    const newFilled = [...filled];
    newFilled[index] = droppedText;

    setHistory([
      ...history,
      { index, option: droppedText, replaced: filled[index] || null },
    ]);
    setFilled(newFilled);

    const currentFilledCount = newFilled.filter(Boolean).length;
    saveProgressAPI(0, currentFilledCount, newFilled);

    if (currentFilledCount === answers.length)
      evaluateAnswers(newFilled, answers, false);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (!isReadOnly) setDragOverIdx(index);
  };
  const handleDragLeave = () => setDragOverIdx(null);

  const handleUndo = () => {
    if (isReadOnly || history.length === 0) return;
    const last = history[history.length - 1];
    const newFilled = [...filled];
    newFilled[last.index] = last.replaced;
    setFilled(newFilled);
    setHistory(history.slice(0, -1));
    setAppState("PLAYING");
  };
  function shuffleArray(arr) {
    const array = [...arr];

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }
  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset this activity?"))
      return;

    localStorage.removeItem(STORAGE_KEY); // 🔥 important

    const resetFilled = Array(answers.length).fill(null);

    setFilled(resetFilled);
    setHistory([]);
    setScore(0);
    setDragOverIdx(null);
    setAppState("PLAYING");

    setOptions(shuffleArray([...answers]));

    try {
      await saveProgressAPI(0, 0, resetFilled);
    } catch (e) {
      console.error("Failed to reset backend progress", e);
    }
  };

  const evaluateAnswers = (currentFilled, currentAnswers, skipSave) => {
    let correctCount = 0;
    currentFilled.forEach((given, i) => {
      if (given === currentAnswers[i]) correctCount++;
    });
    setScore(correctCount);
    setAppState("EVALUATED");
    if (!skipSave) completeActivityAPI(correctCount, currentAnswers.length);
  };

  const handleNextClick = () => {
    try {
      window.parent.postMessage(JSON.stringify({ done: true }), "*");
    } catch (e) {}
  };

  // --- REFACTORED API CALLS ---
  const saveProgressAPI = async (
    currentScore,
    attemptedCount,
    currentFilled,
  ) => {
    if (!userId) return;
    try {
      await apiService.saveMatchByProgress({
        user_id: userId,
        activity_id: activityId,
        progress_json: JSON.stringify({ filled: currentFilled }),
        score: currentScore,
        attempted: attemptedCount,
        status: "IN_PROGRESS",
      });
    } catch (e) {
      console.error("Progress save failed");
    }
  };

  const completeActivityAPI = async (finalScore, totalItems) => {
    if (!userId) return;
    try {
      await apiService.completeMatchBy({
        user_id: userId,
        activity_id: activityId,
        score: finalScore,
        attempted: totalItems,
      });
    } catch (e) {
      console.error("Completion save failed");
    }
  };

  const getUsedIndices = () => {
    const used = new Set();
    const filledCopy = [...filled];
    options.forEach((opt, idx) => {
      const fIdx = filledCopy.indexOf(opt);
      if (fIdx !== -1) {
        used.add(idx);
        filledCopy[fIdx] = null;
      }
    });
    return used;
  };
  const usedIndices = getUsedIndices();

  const renderParagraph = () => {
    const parts = originalText.split(/(\*.*?\*)/g);
    let dropIndex = 0;
    return (
      <div className={styles.paragraph}>
        {parts.map((part, i) => {
          if (part.startsWith("*") && part.endsWith("*"))
            return renderDropBox(dropIndex++, i);
          return <span key={i}>{part}</span>;
        })}
      </div>
    );
  };

  const renderSentences = () => {
    return sentences.map((sent, i) => {
      const parts = sent.split("_____");
      return (
        <div key={i} className={styles.matchRow}>
          <span className={styles.leftText}>{parts[0]}</span>
          {renderDropBox(i, i)}
          <span>{parts[1]}</span>
        </div>
      );
    });
  };

  const renderDropBox = (idx, key) => {
    const given = filled[idx],
      correct = answers[idx];
    const isEvaluated = appState === "EVALUATED";
    let boxClass = styles.dropBox;
    if (dragOverIdx === idx) boxClass += ` ${styles.dragOver}`;
    if (isEvaluated)
      boxClass += given === correct ? ` ${styles.correct}` : ` ${styles.wrong}`;

    return (
      <React.Fragment key={key}>
        <span
          className={boxClass}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, idx)}
        >
          {given}
        </span>
        {isEvaluated && <span className={styles.answerTag}> → {correct}</span>}
      </React.Fragment>
    );
  };

  if (appState === "LOADING") return null;

  const total = answers.length;
  const isPerfect = score === total;

  return (
    <div
      className={styles.wrapper}
      style={{ overflowY: isDragging ? "hidden" : "auto" }}
    >
      <div className={styles.mainCard}>
        <div className={styles.mainCardInner}>
         
            <div className={styles.title}>{title}</div>
        

          {(appState === "PLAYING" || appState === "EVALUATED") && (
            <>
              <div
                className={styles.matchArea}
                style={{ overflowY: isDragging ? "hidden" : "auto" }}
              >
                {isParagraphMode ? renderParagraph() : renderSentences()}
              </div>

              <div className={styles.optionsArea}>
                {isReadOnly ? (
                  <div
                    style={{
                      color: "#666",
                      fontStyle: "italic",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Examination Completed
                  </div>
                ) : (
                  options.map((opt, i) => (
                    <div
                      key={i}
                      draggable
                      onDragStart={(e) => handleDragStart(e, opt)}
                      onDragEnd={handleDragEnd}
                      className={`${styles.option} ${usedIndices.has(i) ? styles.used : ""}`}
                    >
                      {opt}
                    </div>
                  ))
                )}
              </div>

              {appState === "EVALUATED" && !isReadOnly && (
                <div
                  className={`${styles.resultBox} ${isPerfect ? styles.goodJob : styles.goodTry}`}
                >
                  {isPerfect ? "Excellent!" : "Good Try!"} <br />
                  Score:{" "}
                  <strong>
                    {score} / {total}
                  </strong>
                </div>
              )}

              <div className={styles.controls}>
                <div className={styles.btnGroup} >
                  {!isReadOnly && (
                    <>
                      {appState === "PLAYING" && (
                        <button
                          className={`${styles.btn} ${styles.primary}`}
                          onClick={handleUndo}
                          
                        >
                          Undo
                        </button>
                      )}
                    </>
                  )}

                  {appState === "EVALUATED" && isReadOnly && (
                    <div
                      style={{
                        background: "#fff",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      Final Score: {score} / {total}
                    </div>
                  )}
                </div>

                {appState === "EVALUATED" && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      className={`${styles.btn} ${styles.primary}`}
                      onClick={handleReset}
                    >
                      Reset Activity
                    </button>
                    <button
                      className={`${styles.btn} ${styles.primary}`}
                      onClick={handleNextClick}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
