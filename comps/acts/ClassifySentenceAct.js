import React, { useState, useEffect } from "react";
import styles from "./ClassifySentenceAct.module.css";
import Confetti from "react-confetti";

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function parseClassify(text) {
  if (!text) return [];
  const lines = text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  return lines.map((line) => {
    const parts = line.split("|").map((p) => p.trim());
    let qText = "",
      optsRaw = "";

    if (parts.length === 3) {
      qText = parts[1];
      optsRaw = parts[2];
    } else {
      qText = parts[0];
      optsRaw = parts[1] || "";
    }

    const rawOpts = optsRaw
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
    let correctIdx = -1;

    const cleanOpts = rawOpts.map((o, i) => {
      if (o.startsWith("*")) {
        correctIdx = i;
        return o.replace(/^\*+/, "").trim();
      }
      return o;
    });

    if (correctIdx === -1) correctIdx = 0;

    const order = shuffleArray(cleanOpts.map((_, i) => i));
    const shuffled = [];
    let newCorrect = -1;

    order.forEach((oldIdx, newIdx) => {
      shuffled.push(cleanOpts[oldIdx]);
      if (oldIdx === correctIdx) newCorrect = newIdx;
    });

    return {
      qText,
      options: shuffled,
      correctIndex: newCorrect,
      userChoice: null,
      selectedOption: null, // ✅ NEW
      answered: false,
    };
  });
}

export default function ClassifySentenceAct({ data }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [status, setStatus] = useState("PLAYING");
  const [showConfetti, setShowConfetti] = useState(false);
  const activityId = data?.id || "classify_sentence_act";

  const title = (data?.title || "Some Title").replace(/\s*\(/, "\n(");

  useEffect(() => {
    if (!data) return;

    const saved = localStorage.getItem(activityId);

    if (saved) {
      const parsed = JSON.parse(saved);

      setQuestions(parsed.questions || []);
      setCurrent(parsed.current || 0);
      setScore(parsed.score || 0);
      setAttempted(parsed.attempted || 0);
      setStatus(parsed.status || "PLAYING");

      return; // ✅ STOP fresh load
    }

    // 👉 First time load
    const rawText = data.text || "";
    let parsedQs = parseClassify(rawText);
    parsedQs = shuffleArray(parsedQs);

    setQuestions(parsedQs);
  }, [data]);

  const saveProgress = (extra = {}) => {
    localStorage.setItem(
      activityId,
      JSON.stringify({
        questions,
        current,
        score,
        attempted,
        status,
        ...extra,
      }),
    );
  };

  const handleOptionClick = (idx) => {
    const updated = [...questions];
    const q = updated[current];

    if (q.answered) return;

    q.selectedOption = idx;

    setQuestions(updated);

    // ✅ SAVE selection also
    saveProgress({ questions: updated });
  };

  const handleSubmit = () => {
    const updated = [...questions];
    const q = updated[current];

    if (q.selectedOption === null) return;

    q.answered = true;
    q.userChoice = q.selectedOption;

    const isCorrect = q.userChoice === q.correctIndex;

    const newScore = isCorrect ? score + 1 : score;
    const newAttempted = attempted + 1;

    setQuestions(updated);
    setScore(newScore);
    setAttempted(newAttempted);

    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    // ✅ SAVE
    saveProgress({
      questions: updated,
      score: newScore,
      attempted: newAttempted,
    });
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      const nextIdx = current + 1;
      setCurrent(nextIdx);

      saveProgress({ current: nextIdx });
    } else {
      setStatus("SUMMARY");

      saveProgress({ status: "SUMMARY" });
    }
  };
  const handleDone = () => {
    try {
      window.parent.postMessage(
        JSON.stringify({ done: true, score: score, total: attempted }),
        "*",
      );
    } catch (_) {}
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const q = questions[current];
      if (
        e.key === "Enter" &&
        q &&
        q.userChoice !== null &&
        status === "PLAYING"
      ) {
        handleNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  if (questions.length === 0) return null;

  const q = questions[current];
  const total = questions.length;

  const resetQuiz = () => {
    if (!window.confirm("Are you sure you want to reset this activity?"))
      return;

    localStorage.removeItem(activityId); // ✅ IMPORTANT

    const rawText = data?.text || "";
    let parsedQs = parseClassify(rawText);
    parsedQs = shuffleArray(parsedQs);

    setQuestions(parsedQs);
    setCurrent(0);
    setScore(0);
    setAttempted(0);
    setStatus("PLAYING");
  };

  return (
    <div className={styles.wrapper}>
      {showConfetti && <Confetti />}
      <div className={styles.container}>
        <div className={styles.wrap}>
          <div className={styles.title} id="actTitle">
            {title}
          </div>

          {status === "PLAYING" ? (
           <>
            <div className={styles.card} id="cardRoot">
              {/* Wrapped in a flex container for side-by-side alignment */}
              <div className={styles.questionHeader}>
                <div className={styles.questionNum}>{current + 1})</div>
                <div
                  className={styles.qText}
                  dangerouslySetInnerHTML={{ __html: q.qText }}
                />
              </div>

              <div className={styles.optionsRow}>
                {q.options.map((opt, i) => {
                  const isSelected = q.selectedOption === i;
                  const isCorrectAns = q.correctIndex === i;
                  const showTick = q.answered && isCorrectAns;
                  const showCross = q.answered && isSelected && !isCorrectAns;

                  let btnClass = styles.optBtn;

                  if (!q.answered && isSelected) {
                    btnClass += ` ${styles.selected}`;
                  }

                  if (q.answered) {
                    if (isCorrectAns) btnClass += ` ${styles.selected}`;
                    else if (isSelected) btnClass += ` ${styles.wrong}`;
                  }

                  return (
                    <div
                      key={i}
                      className={btnClass}
                      onClick={() => handleOptionClick(i)}
                    >
                      {opt}
                      <span
                        className={`${styles.markIcon} ${styles.tick}`}
                        style={{ display: showTick ? "block" : "none" }}
                      >
                        ✓
                      </span>
                      <span
                        className={`${styles.markIcon} ${styles.cross}`}
                        style={{ display: showCross ? "block" : "none" }}
                      >
                        ✘
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ height: "18px" }}></div>

             
            </div>
             <div className={styles.controlsRow}>
                <div className={styles.score} id="scoreBox">
                  Score: {score} / {attempted}
                </div>
                <div>
                  <button
                    className={styles.btn}
                    disabled={!q.answered && q.selectedOption === null}
                    onClick={!q.answered ? handleSubmit : handleNext}
                  >
                    {!q.answered
                      ? "Submit"
                      : current + 1 === total
                        ? "Finish"
                        : "Next"}
                  </button>
                </div>
              </div>
           </>
          ) : (
            /* EXACTLY matching the summary from index.html & app.js */
            <div
              id="finalWrap"
              className={`${styles.card} ${styles.summaryCard}`}
              style={{ marginTop: "18px" }}
            >
              <div style={{ fontSize: "18px", fontWeight: 600 }}>
                You have completed this activity.
              </div>
              <div className={styles.summary} id="summaryList">
                {questions.map((sq, i) => {
                  const user =
                    sq.userChoice === null
                      ? "(no answer)"
                      : sq.options[sq.userChoice];
                  const correct = sq.options[sq.correctIndex];
                  const color =
                    sq.userChoice === sq.correctIndex ? "green" : "red";

                  return (
                    <div key={i} className={styles.summaryItem}>
                      <strong>{i + 1})</strong>{" "}
                      <span dangerouslySetInnerHTML={{ __html: sq.qText }} />
                      <br />
                      Answer: <span style={{ color: color }}>{user}</span>
                      <span style={{ color: "#777", marginLeft: "8px" }}>
                        — Correct: <strong>{correct}</strong>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  className={styles.small}
                  id="finalScore"
                  style={{ fontSize: "14px" }}
                >
                  Score: {score} / {attempted}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    className={`${styles.btn} ${styles.primary}`}
                    onClick={resetQuiz}
                  >
                    Reset Activity
                  </button>

                  <button
                    className={`${styles.btn} ${styles.primary}`}
                    id="doneBtn"
                    onClick={handleDone}
                  >
                    Next
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
