import React, { useState, useEffect } from "react";
import styles from "./RightOneAct.module.css";
import Confetti from "react-confetti";

export default function RightOneAct({ data, onNext }) {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const activityId = data?.id || "right_one_act";
  useEffect(() => {
    if (!data?.text) return;

    const saved = localStorage.getItem(activityId);

    if (saved) {
      const parsed = JSON.parse(saved);

      setQuestions(parsed.questions || []);
      setCurrentIdx(parsed.currentIdx || 0);
      setScore(parsed.score || 0);
      setShowResult(parsed.showResult || false);

      return; // ✅ STOP fresh parsing
    }

    // 👉 Fresh load (only first time)
    const lines = data.text.split("\n").filter((line) => line.trim() !== "");

    const parsed = lines.map((line) => {
      const parts = line.split(",").map((s) => s.trim());
      return {
        options: shuffleArray(parts),
        correctValue: parts[0],
        answered: false,
        userChoice: null,
      };
    });

    setQuestions(parsed);
    setScore(0);
    setShowResult(false);
    setCurrentIdx(0);
  }, [data]);

  const saveProgress = (updatedState = {}) => {
    localStorage.setItem(
      activityId,
      JSON.stringify({
        questions,
        currentIdx,
        score,
        showResult,
        ...updatedState,
      }),
    );
  };

  const shuffleArray = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const handleOptionClick = (option) => {
    if (questions[currentIdx].answered) return;

    setSelectedOption(option);
  };

  const handleSubmit = () => {
    const updated = [...questions];
    const currentQ = updated[currentIdx];

    if (!selectedOption) return;

    currentQ.answered = true;
    currentQ.userChoice = selectedOption;

    let isCorrect = selectedOption === currentQ.correctValue;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    setQuestions(updated);
    setShowFeedback(true);
    saveProgress({
      questions: updated,
      score: isCorrect ? score + 1 : score,
    });
  };

  const handleNextBtn = () => {
    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;

      setCurrentIdx(nextIdx);
      setSelectedOption(null);
      setShowFeedback(false);

      saveProgress({ currentIdx: nextIdx });
    } else {
      setShowResult(true);

      saveProgress({ showResult: true });
    }
  };

  const resetActivity = () => {
    if (!window.confirm("Reset this activity?")) return;

    localStorage.removeItem(activityId); // ✅ important

    const lines = data.text.split("\n").filter((line) => line.trim() !== "");

    const parsed = lines.map((line) => {
      const parts = line.split(",").map((s) => s.trim());
      return {
        options: shuffleArray(parts),
        correctValue: parts[0],
        answered: false,
        userChoice: null,
      };
    });

    setQuestions(parsed);
    setScore(0);
    setCurrentIdx(0);
    setShowResult(false);
    setSelectedOption(null);
    setShowFeedback(false);
  };
  const handleFinalFinish = () => {
    try {
      window.parent.postMessage(JSON.stringify({ done: true }), "*");
    } catch (e) {}

    if (onNext) onNext();
  };

  const renderTitle = () => {
    const title = data.title || "";

    // 👉 Convert (English) into new line
    const formatted = title.replace(/\s*\(/, "\n(");

    const parts = formatted.split("\n");

    return (
      <div className={styles.hindiTitle}>
        {parts[0]?.replace(/\s*\($/, "")}
        <br />
        {parts[1].replace(/[()]/g, "")}
      </div>
    );
  };

  if (questions.length === 0) return null;

  const currentQ = questions[currentIdx];

  return (
    <div className={styles.wrapper}>
      {showConfetti && <Confetti />}

      <div className={styles.container}>
        <div className={styles.main}>
          <div style={{ textAlign: "center" }}>{renderTitle()}</div>

          {!showResult ? (
            <>
              <div className={styles.optionsGrid}>
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = option === currentQ.correctValue;

                  let cardClass = styles.optionCard;

                  // ✅ BEFORE SUBMIT → highlight selected
                  if (!currentQ.answered && isSelected) {
                    cardClass += ` ${styles.selected}`;
                  }

                  // ✅ AFTER SUBMIT → show result
                  if (currentQ.answered) {
                    if (isCorrect) {
                      cardClass += ` ${styles.correct}`; // green
                    } else if (isSelected && !isCorrect) {
                      cardClass += ` ${styles.wrong}`; // red (THIS WAS MISSING/ISSUE)
                    }
                  }

                  return (
                    <div
                      key={idx}
                      className={cardClass}
                      onClick={() => handleOptionClick(option)}
                    >
                      <span className={styles.optionText}>{option}</span>
                    </div>
                  );
                })}
              </div>

              <div className={styles.footer}>
                <div className={styles.progress}>
                  Question {currentIdx + 1} of {questions.length}
                </div>

                <div className={styles.actionRow}>
                  {!currentQ.answered ? (
                    <button
                      className={styles.nextBtn}
                      onClick={handleSubmit}
                      disabled={!selectedOption}
                    >
                      Submit
                    </button>
                  ) : (
                    <button className={styles.nextBtn} onClick={handleNextBtn}>
                      {currentIdx === questions.length - 1 ? "Finish" : "Next"}
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <h2 className={styles.hindiTitle}>अभ्यास पूर्ण हुआ!</h2>

              <div className={styles.finalScoreDisplay}>
                Score: {score} / {questions.length}
              </div>

              <div
                className={styles.actionRow}
                style={{ justifyContent: "center", gap: "10px" }}
              >
                <button className={styles.nextBtn} onClick={resetActivity}>
                  Reset Activity
                </button>

                <button className={styles.nextBtn} onClick={handleFinalFinish}>
                  Next Exercise
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
