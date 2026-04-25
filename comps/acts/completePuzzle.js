import styles from "./completePuzzle.module.css";
import Confetti from "react-confetti";
import React, { useState, useMemo, useEffect } from "react";

export default function JoinWords({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placedSuffix, setPlacedSuffix] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [status, setStatus] = useState("STARTED"); // STARTED | SUMMARY //
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);

  const activityId = data?.id || "join_words";

  useEffect(() => {
    const saved = localStorage.getItem(activityId);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);

      setCurrentIndex(parsed.currentIndex || 0);
      setPlacedSuffix(parsed.placedSuffix || null);
      setIsCorrect(parsed.isCorrect ?? null);
      setScore(parsed.score || 0);
      setAttempted(parsed.attempted || 0);
      setStatus(parsed.status || "STARTED");
      setUserAnswers(parsed.userAnswers || []);
    } catch (e) {
      console.error("Failed to load state");
    }
  }, [activityId]);

  const saveProgress = (nextState = {}) => {
    const stateToSave = {
      currentIndex,
      placedSuffix,
      isCorrect,
      score,
      attempted,
      status,
      userAnswers,
      ...nextState,
    };

    localStorage.setItem(activityId, JSON.stringify(stateToSave));
  };

  const successMsgs = [
    "🎉 Awesome!",
    "🌟 Great job!",
    "👏 Well done!",
    "🥳 You got it!",
  ];

  const wrongMsgs = [
    "❌ Oops!",
    "😅 Not quite!",
    "🤔 Almost there!",
    "🙈 Keep trying!",
  ];

  const handleFinalNext = () => {
    try {
      window.parent.postMessage(
        JSON.stringify({
          done: true,
          score,
          total: attempted,
        }),
        "*",
      );
    } catch (_) {}
  };
  const puzzles = useMemo(() => {
    if (!data?.data?.text) return [];
    return data.data.text.split("\n").map((line) => {
      const [prefix, correct, distractor] = line
        .split(",")
        .map((s) => s.trim());
      return {
        prefix,
        correct,
        options: [correct, distractor].sort(() => Math.random() - 0.5),
      };
    });
  }, [data]);

  const currentPuzzle = puzzles[currentIndex];

  const handleDragStart = (e, word) => {
    e.dataTransfer.setData("text/plain", word);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isCorrect !== null) return; // prevent change after submit 

    const droppedWord = e.dataTransfer.getData("text/plain");
    setPlacedSuffix(droppedWord);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    if (!placedSuffix) return;

    const correct = placedSuffix === currentPuzzle.correct;

    setIsCorrect(correct);
    setAttempted((prev) => prev + 1);

    const newAnswer = {
      prefix: currentPuzzle.prefix,
      selected: placedSuffix,
      correctAnswer: currentPuzzle.correct,
      isCorrect: correct,
    };

    saveProgress({
      isCorrect: correct,
      attempted: attempted + 1,
      score: correct ? score + 1 : score,
      userAnswers: [...userAnswers, newAnswer],
    });
    // ✅ ADD THIS LINE
    setUserAnswers((prev) => [...prev, newAnswer]);

    if (correct) {
      setScore((prev) => prev + 1);

      setFeedback(successMsgs[Math.floor(Math.random() * successMsgs.length)]);
      setShowConfetti(true);

      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      setFeedback(wrongMsgs[Math.floor(Math.random() * wrongMsgs.length)]);
    }
  };

  /* ================= NEXT ================= */
  const nextQuestion = () => {
    setFeedback("");

    if (currentIndex < puzzles.length - 1) {
      const nextIdx = currentIndex + 1;

      setCurrentIndex(nextIdx);
      setPlacedSuffix(null);
      setIsCorrect(null);

      saveProgress({
        currentIndex: nextIdx,
        placedSuffix: null,
        isCorrect: null,
      });
    } else {
      setStatus("SUMMARY");

      saveProgress({
        status: "SUMMARY",
      });
    }
  };

  /* ================= RESET ================= */
  const resetQuiz = () => {
    if (!window.confirm("Reset activity?")) return;

    setCurrentIndex(0);
    setPlacedSuffix(null);
    setIsCorrect(null);
    setScore(0);
    setAttempted(0);
    setStatus("STARTED");
    setFeedback("");
    setUserAnswers([]);

    localStorage.removeItem(activityId);
  };

  if (!currentPuzzle) return null;

  const isSummary = status === "SUMMARY";

  return (
    <div className={styles.wrapper}>
      {showConfetti && <Confetti />}
      <div className={styles.mainCard}>
        
          <div className={styles.title}>
          {(data.data.title || "").replace(/\s*\(/, "\n(")}
        </div>
       
        {!isSummary ? (
          <>
            <div className={styles.gameArea}>
              <div className={styles.puzzleContainer}>
                <div className={styles.prefixPiece}>
                  {currentPuzzle.prefix}
                  <div className={styles.tab}></div>
                </div>

                <div
                  className={`${styles.dropZone} ${
                    isCorrect ? styles.hitCorrect : ""
                  } ${isCorrect === false ? styles.hitWrong : ""}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <div className={styles.slot}></div>
                  {placedSuffix && (
                    <span className={styles.placedText}>{placedSuffix}</span>
                  )}
                </div>
              </div>

              <div className={styles.optionsContainer}>
                {currentPuzzle.options.map((option, idx) => {
                  if (placedSuffix === option)
                    return <div key={idx} className={styles.hiddenOption} />;

                  return (
                    <div
                      key={`${currentIndex}-${idx}`}
                      className={styles.optionPiece}
                      draggable={isCorrect === null}
                      onDragStart={(e) => handleDragStart(e, option)}
                    >
                      <div className={styles.slot}></div>
                      {option}
                    </div>
                  );
                })}
              </div>
            </div>
            {isCorrect !== null && (
              <div style={{ fontWeight: "bold", textAlign: "center" }}>
                {feedback}
              </div>
            )}
            <div className={styles.footer}>
              <div className={styles.small}>
                Score : {score} / {attempted}
              </div>

              {/* SUBMIT BUTTON */}
              {isCorrect === null && (
                <button
                  className={styles.nextBtn}
                  onClick={handleSubmit}
                  disabled={!placedSuffix}
                >
                  Submit
                </button>
              )}

              {/* NEXT BUTTON */}
              {isCorrect !== null && (
                <button className={styles.nextBtn} onClick={nextQuestion}>
                  {currentIndex === puzzles.length - 1 ? "Finish" : "Next"}
                </button>
              )}
            </div>
          </>
        ) : (
          /* ================= SUMMARY ================= */
          <div
            style={{
              width: "100%",
              maxWidth: "1000px",
            }}
          >
            <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
              You have completed this activity.
            </h2>

            {/* LIST */}
            <div className={styles.listArea}>
              {userAnswers.map((ans, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div>
                    <strong>{i + 1}.</strong> {ans.prefix}
                    <span
                      style={{
                        fontWeight: "bold",
                        color: ans.isCorrect ? "#2ecc71" : "#e74c3c",
                        marginLeft: 6,
                      }}
                    >
                      {ans.selected}
                    </span>
                  </div>

                  {!ans.isCorrect && (
                    <div style={{ color: "#777", marginLeft: 20 }}>
                      Correct: {ans.correctAnswer}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div></div>
            {/* FOOTER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "auto",
              }}
            >
              <div className={styles.small}>
                Final Score: {score} / {puzzles.length}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button className={styles.nextBtn} onClick={resetQuiz}>
                  Reset Activity
                </button>

                <button className={styles.nextBtn} onClick={handleFinalNext}>
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
