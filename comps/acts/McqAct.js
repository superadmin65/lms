import React, { useState, useEffect } from "react";
import styles from "./McqAct.module.css";
import { apiService } from "../../utils/apiService";
import Confetti from "react-confetti";

function parseOptionsString(raw) {
  return (raw || "")
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalizeQuestions(raw) {
  return raw.map((q) => {
    const original = q.qText || q.text || "";
    const rawOpts = parseOptionsString(q.options || q.option || "");

    let originalCorrectIndex = -1;

    const cleanedOpts = rawOpts.map((opt, idx) => {
      if (opt.includes("*")) {
        originalCorrectIndex = idx;
        return opt.replace(/\*/g, "").trim();
      }
      return opt;
    });

    if (originalCorrectIndex === -1) originalCorrectIndex = 0;

    const order = shuffleArray(cleanedOpts.map((_, i) => i));

    const shuffled = [];
    let newCorrectIndex = -1;

    order.forEach((oldIndex, newIndex) => {
      shuffled.push(cleanedOpts[oldIndex]);
      if (oldIndex === originalCorrectIndex) {
        newCorrectIndex = newIndex;
      }
    });

    return {
      qTextRaw: original,
      qText: original,
      options: shuffled,
      correctIndex: newCorrectIndex,
      answered: false,
      userChoice: null,
      selectedOption: null,
    };
  });
}

export default function McqAct({ data }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [status, setStatus] = useState("STARTED");
  const [userId, setUserId] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedback, setFeedback] = useState("");

  const total = questions.length;
  const activityId = data?.id || "mcq_default";

  const successMsgs = [
    "🎉 Awesome!",
    "🌟 Great job!",
    "👏 Well done!",
    "🥳 You got it!",
  ];

  const wrongMsgs = [
    "❌ Oops! Try next one!",
    "😅 Not quite!",
    "🤔 Almost there!",
    "🙈 Keep learning!",
  ];

  useEffect(() => {
    if (!data) return;

    const currentUserId = Number(
      data.user_id || localStorage.getItem("user_id") || 0,
    );

    setUserId(currentUserId);

    const initQuiz = async () => {
      const raw = data.questions || [];
      let initialQuestions = normalizeQuestions(raw);

      try {
        const response = await apiService.getMcqProgress(
          currentUserId,
          activityId,
        );

        const savedState = response.data || response;

        if (savedState && savedState.status !== "empty") {
          if (
            savedState.questions &&
            savedState.questions.length === initialQuestions.length
          ) {
            initialQuestions = savedState.questions;
          }

          setCurrent(savedState.current || 0);
          setScore(savedState.score || 0);
          setAttempted(savedState.attempted || 0);

          const isFinished =
            savedState.attempted >= initialQuestions.length ||
            savedState.current >= initialQuestions.length;

          if (isFinished && initialQuestions.length > 0) {
            setStatus("SUMMARY");
          }
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
      }

      setQuestions(initialQuestions);
    };

    initQuiz();
  }, [data, activityId]);

  const saveProgressAPI = async (
    qs,
    currIdx,
    currentScore,
    currentAttempted,
    overrideStatus = "IN_PROGRESS",
  ) => {
    if (!userId) return;

    const stateToSave = {
      current: currIdx,
      score: currentScore,
      attempted: currentAttempted,
      questions: qs,
      total: qs.length,
      status: overrideStatus,
    };

    try {
      await apiService.saveMcqProgress({
        user_id: userId,
        activity_id: activityId,
        progress_json: JSON.stringify(stateToSave),
        score: currentScore,
        attempted: currentAttempted,
        status: overrideStatus,
      });
    } catch (err) {
      console.error("Failed to save progress", err);
    }
  };

  const completeQuizAPI = async () => {
    if (!userId) return;

    try {
      await apiService.completeMcq({
        user_id: userId,
        activity_id: activityId,
        score,
        attempted,
      });
    } catch (err) {
      console.error("Failed to complete quiz", err);
    }
  };

  const handleOptionClick = (idx) => {
    const updatedQuestions = [...questions];
    const activeQ = updatedQuestions[current];

    if (activeQ.answered) return;

    activeQ.selectedOption = idx;

    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    const updatedQuestions = [...questions];
    const activeQ = updatedQuestions[current];

    if (activeQ.selectedOption === null) return;

    activeQ.answered = true;
    activeQ.userChoice = activeQ.selectedOption;

    let newScore = score;
    let isCorrect = false;

    if (activeQ.userChoice === activeQ.correctIndex) {
      newScore += 1;
      isCorrect = true;
    }

    const newAttempted = attempted + 1;

    setQuestions(updatedQuestions);
    setScore(newScore);
    setAttempted(newAttempted);

    if (isCorrect) {
      setFeedback(successMsgs[Math.floor(Math.random() * successMsgs.length)]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      setFeedback(wrongMsgs[Math.floor(Math.random() * wrongMsgs.length)]);
    }

    await saveProgressAPI(updatedQuestions, current, newScore, newAttempted);
  };

  const handleNext = async () => {
    setFeedback("");
    setIsSaving(true);

    if (current + 1 < total) {
      const nextIdx = current + 1;

      await saveProgressAPI(questions, nextIdx, score, attempted);

      setCurrent(nextIdx);
    } else {
      await saveProgressAPI(questions, total, score, attempted, "COMPLETED");

      await completeQuizAPI();

      setStatus("SUMMARY");
    }

    setIsSaving(false);
  };

  const resetQuiz = async () => {
    if (!window.confirm("Are you sure you want to reset this activity?"))
      return;

    const raw = data.questions || [];
    const resetQuestions = normalizeQuestions(raw);

    setQuestions(resetQuestions);
    setCurrent(0);
    setScore(0);
    setAttempted(0);
    setStatus("STARTED");
    setFeedback("");

    await saveProgressAPI(resetQuestions, 0, 0, 0, "IN_PROGRESS");
  };

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

  if (questions.length === 0) return null;

  const currentQ = questions[current];
  const isSummary = status === "SUMMARY";

  return (
    <div className={styles.wrapper}>
      {showConfetti && <Confetti />}

      <div className={styles.container}>
        {!isSummary ? (
          <div className={styles.main} >
            {/* TITLE */}
            <div className={styles.title} id="actTitle">
              {(data.title || "Multiple Choice Question").replace(
                /\s*\(/,
                "\n(",
              )}
            </div>

            <div className={styles.small}>
              Question {current + 1} of {total}
            </div>

            <div className={styles.qwrap}>
              {data.passage && (
                <div className={styles.passageBox}>{data.passage}</div>
              )}

              <div
                className={styles.question}
                dangerouslySetInnerHTML={{
                  __html: currentQ.qText,
                }}
              />

              <div className={styles.options}>
                {currentQ.options.map((opt, i) => {
                  const isSelected = currentQ.selectedOption === i;

                  const isCorrectAns = currentQ.correctIndex === i;

                  let labelClass = styles.optLabel;
                  let radioClass = styles.radio;

                  if (!currentQ.answered && isSelected) {
                    labelClass += ` ${styles.selected}`;
                  }

                  if (currentQ.answered) {
                    if (isCorrectAns) labelClass += ` ${styles.correct}`;
                    else if (isSelected) labelClass += ` ${styles.wrong}`;
                  }

                  if (isSelected) {
                    radioClass += ` ${styles.checked}`;
                  }

                  return (
                    <div
                      key={i}
                      className={styles.option}
                      onClick={() => handleOptionClick(i)}
                    >
                      <span className={radioClass}></span>
                      <div className={labelClass}>{opt}</div>
                    </div>
                  );
                })}
              </div>

              {currentQ.answered && (
                <div
                  className={`${styles.feedback} ${
                    currentQ.userChoice === currentQ.correctIndex
                      ? styles.correct
                      : styles.wrong
                  }`}
                >
                  {feedback}
                </div>
              )}
            </div>

            <div className={styles.controls}>
              <div className={styles.score}>
                Score : {score} / {total}
              </div>

              <button
                className={`${styles.btn} ${styles.primary}`}
                onClick={!currentQ.answered ? handleSubmit : handleNext}
                disabled={
                  !currentQ.answered && currentQ.selectedOption === null
                }
              >
                {!currentQ.answered
                  ? "Submit"
                  : isSaving
                    ? "Saving..."
                    : current + 1 === total
                      ? "Finish"
                      : "Next"}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.main}>
            <div className={styles.title}>
              You have completed this activity.
            </div>

            <div className={styles.summary}>
              {questions.map((q, i) => {
                const isCorrect = q.userChoice === q.correctIndex;

                return (
                  <div key={i} className={styles.summaryItem}>
                    <div>
                      <strong>
                        {i + 1}. {q.qTextRaw}
                      </strong>
                    </div>

                    <div>
                      Your Answer:{" "}
                      <span
                        style={{
                          color: isCorrect ? "#2ecc71" : "#e74c3c",
                          fontWeight: "bold",
                        }}
                      >
                        {q.options[q.userChoice] || "Skipped"}
                      </span>
                      {!isCorrect && (
                        <span
                          style={{
                            color: "#777",
                            marginLeft: 8,
                          }}
                        >
                          (Correct: {q.options[q.correctIndex]})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 12,
                gap: 10,
              }}
            >
              <div className={styles.small}>
                Final Score: {score} / {attempted}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className={`${styles.btn} ${styles.primary}`}
                  onClick={resetQuiz}
                >
                  Reset Activity
                </button>

                <button
                  className={`${styles.btn} ${styles.primary}`}
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
