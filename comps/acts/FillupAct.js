import React, { useState, useEffect } from "react";
import styles from "./FillupAct.module.css";
import Confetti from "react-confetti";

function generateId(title, text) {
  const str = (title || "") + (text || "");

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  return "act_" + Math.abs(hash);
}

export default function FillupAct({ data, onNext }) {
  const activityId = generateId(data?.title, data?.text);
  const [showConfetti, setShowConfetti] = useState(false);
  const [sentences, setSentences] = useState([]);
  const [activeBlank, setActiveBlank] = useState(null);

  const [appState, setAppState] = useState("PLAYING"); // PLAYING | EVALUATED
  const [score, setScore] = useState(0);

  /* ================= LOAD ================= */
  useEffect(() => {
    if (!data?.text) return;

    const rawLines = data.text.split("\n").filter((l) => l.trim());

    const parsed = rawLines.map((line, idx) => {
      const match = line.match(/\*(.*?)\*/);
      const full = match ? match[0] : "";
      const optionsRaw = match ? match[1] : "";

      const options = optionsRaw
        .split(/[()]/)
        .map((s) => s.trim())
        .filter(Boolean);

      return {
        id: idx,
        parts: line.split(full),
        options,
        correctAnswer: options[0],
        userAnswer: null,
      };
    });

    // 👉 restore from localStorage
    const saved = localStorage.getItem(activityId);

    if (saved) {
      try {
        const parsedSaved = JSON.parse(saved);

        setSentences(parsedSaved.sentences || parsed);
        setAppState(parsedSaved.appState || "PLAYING");
        setScore(parsedSaved.score || 0);
        return;
      } catch (e) {}
    }

    setSentences(parsed);
    setAppState("PLAYING");
    setScore(0);
  }, [data]);

  /* ================= SAVE ================= */
  const saveProgress = (next = {}) => {
    const state = {
      sentences,
      appState,
      score,
      ...next,
    };
    localStorage.setItem(activityId, JSON.stringify(state));
  };

  /* ================= SELECT ================= */
  const handleSelectOption = (idx, option) => {
    if (appState !== "PLAYING") return;

    const updated = [...sentences];
    updated[idx].userAnswer = option;

    setSentences(updated);
    setActiveBlank(null);

    saveProgress({ sentences: updated });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    let correct = 0;

    sentences.forEach((s) => {
      if (s.userAnswer === s.correctAnswer) correct++;
    });

    setScore(correct);
    setAppState("EVALUATED");

    // 🎉 show confetti on completion
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);

    saveProgress({
      appState: "EVALUATED",
      score: correct,
    });
  };
  /* ================= RESET ================= */
  const handleReset = () => {
    if (!window.confirm("Reset activity?")) return;

    const reset = sentences.map((s) => ({
      ...s,
      userAnswer: null,
    }));

    setSentences(reset);
    setScore(0);
    setAppState("PLAYING");

    localStorage.removeItem(activityId);
  };

  /* ================= NEXT ================= */
  const handleNext = () => {
    try {
      window.parent.postMessage(JSON.stringify({ done: true }), "*");
    } catch (e) {}

    if (onNext) onNext();
  };

  const allAnswered = sentences.every((s) => s.userAnswer);

  if (!sentences.length) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {showConfetti && <Confetti />}
        <div className={styles.main}>
          <div className={styles.mainCardInner}>
            {/* TITLE */}

            <div className={styles.title}>
              {(data?.title || "").replace(/\s*\(/, "\n(")}
            </div>

            {/* ================= PLAYING ================= */}
            {appState === "PLAYING" && (
              <>
                <div className={styles.matchArea}>
                  {sentences.map((s, idx) => (
                    <div key={s.id} className={styles.sentenceRow}>
                      <div className={styles.sentenceText}>
                        {s.parts[0]}

                        <span
                          className={`${styles.blankSpace} ${
                            s.userAnswer ? styles.filled : ""
                          }`}
                          onClick={() => {
                            if (appState !== "PLAYING") return;
                            setActiveBlank(activeBlank === idx ? null : idx);
                          }}
                        >
                          {s.userAnswer || "______"}
                        </span>

                        {s.parts[1]}
                      </div>

                      {activeBlank === idx && (
                        <div className={styles.optionPicker}>
                          {s.options.map((opt, i) => (
                            <button
                              key={i}
                              className={styles.optionBtn}
                              onClick={() => handleSelectOption(idx, opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* CONTROLS */}
                <div className={styles.controls}>
                  <div />
                  <button
                    className={`${styles.btn} ${styles.primary}`}
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}

            {/* ================= SUMMARY ================= */}
            {appState === "EVALUATED" && (
              <>
                <div className={styles.matchArea}>
                  {sentences.map((s, i) => (
                    <div key={i} className={styles.sentenceRow}>
                      <div className={styles.sentenceText}>
                        {s.parts[0]}

                        <span
                          className={`${styles.blankSpace} ${
                            s.userAnswer === s.correctAnswer
                              ? styles.correct
                              : styles.wrong
                          }`}
                        >
                          {s.userAnswer}
                        </span>

                        {s.parts[1]}
                      </div>

                      {s.userAnswer !== s.correctAnswer && (
                        <div className={styles.answerTag}>
                          Correct: {s.correctAnswer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className={styles.controls}>
                  <div className={styles.resultBox}>
                    Score: {score} / {sentences.length}
                  </div>
                  <div className={styles.btnGroup}>
                    <button
                      className={`${styles.btn} ${styles.primary}`}
                      onClick={handleReset}
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
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
