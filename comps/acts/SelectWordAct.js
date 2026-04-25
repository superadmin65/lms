import React, { useState, useEffect } from "react";
import styles from "./SelectWordAct.module.css";
import Confetti from "react-confetti";

export default function SelectWordAct({ data, onNext }) {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const activityId = data?.id || "select_word";
  const STORAGE_KEY = `select_word_${activityId}`;

  useEffect(() => {
    if (!data?.text) return;

    const saved = localStorage.getItem(STORAGE_KEY);

    // ✅ RESTORE
    if (saved) {
      const parsedState = JSON.parse(saved);

      setQuestions(parsedState.questions || []);
      setCurrentIdx(parsedState.currentIdx || 0);
      setScore(parsedState.score || 0);
      setSelectedWord(parsedState.selectedWord || null);
      setShowFeedback(parsedState.showFeedback || false);
      setShowResult(parsedState.showResult || false);

      return;
    }

    // ✅ FIRST TIME INIT
    const lines = data.text.split("\n").filter((line) => line.trim() !== "");

    const parsed = lines.map((line) => {
      const match = line.match(/\*(.*?)\*/);
      const correctWord = match ? match[1] : "";
      const cleanLine = line.replace(/\*/g, "");
      const words = cleanLine.split(" ");

      return {
        words,
        correctValue: correctWord,
      };
    });

    setQuestions(parsed);
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    resetState();

    // ✅ SAVE INITIAL
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        questions: parsed,
        currentIdx: 0,
        score: 0,
        selectedWord: null,
        showFeedback: false,
        showResult: false,
      }),
    );
  }, [data]);

  useEffect(() => {
    if (!questions.length) return;

    const timeout = setTimeout(() => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          questions,
          currentIdx,
          score,
          selectedWord,
          showFeedback,
          showResult,
        }),
      );
    }, 100);

    return () => clearTimeout(timeout);
  }, [questions, currentIdx, score, selectedWord, showFeedback, showResult]);

  const resetState = () => {
    setSelectedWord(null);
    setShowFeedback(false);
  };

  const handleWordClick = (word, index) => {
    if (showFeedback) return;

    const isCorrect = word.includes(questions[currentIdx].correctValue);

    setSelectedWord({ index, isCorrect });
  };

  // ✅ SUBMIT
  const handleSubmit = () => {
    if (!selectedWord) return;

    if (selectedWord.isCorrect) {
      setScore((prev) => prev + 1);

      // 🎉 confetti on correct
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }

    setShowFeedback(true);
  };

  const handleNextBtn = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      resetState();
    } else {
      setShowResult(true);
    }
  };

  // ✅ RESET
  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);

    if (!data?.text) return;

    const lines = data.text.split("\n").filter((line) => line.trim() !== "");

    const parsed = lines.map((line) => {
      const match = line.match(/\*(.*?)\*/);
      const correctWord = match ? match[1] : "";
      const cleanLine = line.replace(/\*/g, "");
      const words = cleanLine.split(" ");

      return {
        words,
        correctValue: correctWord,
      };
    });

    setQuestions(parsed);
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setShowConfetti(false);
    setSelectedWord(null);
    setShowFeedback(false);
  };

  const handleFinalFinish = () => {
    if (onNext) onNext();
  };

  const renderTitle = () => {
    const title = data.title || "";

    // 👉 Convert (English) into new line
    const formatted = title.replace(/\s*\(/, "\n(");

    const parts = formatted.split("\n");

    return (
      <div>
        <div className={styles.hindiTitle}>
          {parts[0]?.replace(/\s*\($/, "")}
          <br />
          {parts[1].replace(/[()]/g, "")}
        </div>
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
              <div className={styles.sentenceDisplay}>
                {currentQ.words.map((word, idx) => {
                  const isCorrectTarget = word.includes(currentQ.correctValue);
                  const isSelected = selectedWord?.index === idx;

                  let wordClass = styles.word;

                  if (isSelected && !showFeedback) {
                    wordClass += ` ${styles.selectedWord}`;
                  }

                  if (showFeedback) {
                    if (isCorrectTarget)
                      wordClass += ` ${styles.highlightCorrect}`;
                    if (isSelected && !selectedWord.isCorrect)
                      wordClass += ` ${styles.highlightWrong}`;
                  }

                  return (
                    <span
                      key={idx}
                      className={wordClass}
                      onClick={() => handleWordClick(word, idx)}
                    >
                      {word}
                      {isSelected && showFeedback && (
                        <span className={styles.iconMark}>
                          {selectedWord.isCorrect ? " ✓" : " ✗"}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>

              <div className={styles.footer}>
                <div className={styles.progress}>
                  Question {currentIdx + 1} of {questions.length}
                </div>

                <div className={styles.score}>Score: {score}</div>

                {!showFeedback ? (
                  <button
                    className={styles.nextBtn}
                    onClick={handleSubmit}
                    disabled={!selectedWord}
                  >
                    Submit
                  </button>
                ) : (
                  <button className={styles.nextBtn} onClick={handleNextBtn}>
                    {currentIdx === questions.length - 1 ? "Finish" : "Next"}
                  </button>
                )}
              </div>
            </>
          ) : (
            
             <>
              <div className={styles.sentenceDisplay}>
                <h2 style={{ color: "#0b4f71", fontSize: "32px" }}>
                Activity Complete!
              </h2>
              </div>

              <div className={styles.footer}>
                <div className={styles.score}>
                  Score: {score} / {questions.length}
                </div>

                {/* ✅ RESET ONLY HERE */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  <button className={styles.nextBtn} onClick={handleReset}>
                    Reset Activity
                  </button>

                  <button
                    className={styles.nextBtn}
                    onClick={handleFinalFinish}
                  >
                    Next Exercise
                  </button>
                </div>
              </div>
              </>
            
          )}
        </div>
      </div>
    </div>
  );
}
