// comps/acts/McqAudioAct.js
import React, { useState, useEffect, useRef } from "react";
import styles from "./McqAudioAct.module.css";

// Helpers
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function parseOptionsString(raw) {
  return (raw || "")
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeQuestions(raw) {
  return raw.map((q) => {
    const original = q.qText || q.text || "";
    const rawOpts = parseOptionsString(q.options || q.option || "");
    let originalCorrectIndex = -1;

    const cleaned = rawOpts.map((o, idx) => {
      if (o.indexOf("*") !== -1) {
        originalCorrectIndex = idx;
        return o.replace(/\*/g, "").trim();
      }
      return o;
    });

    if (originalCorrectIndex === -1) originalCorrectIndex = 0;

    const indices = cleaned.map((_, i) => i);
    const shuffledIndices = shuffleArray(indices);
    const shuffledOpts = [];
    let newCorrect = -1;

    shuffledIndices.forEach((origIdx, newIdx) => {
      shuffledOpts.push(cleaned[origIdx]);
      if (origIdx === originalCorrectIndex) newCorrect = newIdx;
    });

    return {
      qTextRaw: original,
      qText: original,
      options: shuffledOpts,
      correctIndex: newCorrect,
      userChoice: null,
      answered: false,
    };
  });
}

function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export default function McqAudioAct({ data }) {
  // Activity State
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [status, setStatus] = useState("PLAYING");

  // Media State
  const [title, setTitle] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);

  // Audio Player State
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Parse payload on mount
  useEffect(() => {
    if (!data) return;

    // Extract Title & Media
    const actTitle = data.title || data.label || "Multiple Choice";
    setTitle(actTitle);
    setImageSrc(data.image || data.bgData?.bgImg || null);
    setAudioSrc(data.audio || null);

    // Extract Questions
    const rawQuestions = data.questions || (Array.isArray(data) ? data : []);
    if (rawQuestions.length > 0) {
      setQuestions(normalizeQuestions(rawQuestions));
    }
  }, [data]);

  // Audio Player Event Handlers
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const currentT = audioRef.current.currentTime;
    const totalD = audioRef.current.duration;
    setCurrentTime(currentT);
    if (totalD > 0) setAudioProgress((currentT / totalD) * 100);
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setAudioProgress(e.target.value);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setAudioProgress(0);
    setCurrentTime(0);
  };

  // Game Handlers
  const handleOptionClick = (idx) => {
    const q = questions[current];
    if (q.answered) return;

    const isCorrect = idx === q.correctIndex;
    const updatedQuestions = [...questions];
    updatedQuestions[current] = { ...q, answered: true, userChoice: idx };

    setQuestions(updatedQuestions);
    setAttempted((prev) => prev + 1);
    if (isCorrect) setScore((prev) => prev + 1);
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setStatus("SUMMARY");
      // Stop audio if moving to summary
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleFinalNext = () => {
    try {
      window.parent.postMessage(
        JSON.stringify({ done: true, score: score, total: attempted }),
        "*",
      );
    } catch (_) {}
  };

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      const q = questions[current];
      if (e.key === "Enter" && q && q.answered && status === "PLAYING") {
        handleNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  if (questions.length === 0) return null;

  const q = questions[current];
  const total = questions.length;

  const resetActivity = () => {
    if (!window.confirm("Are you sure you want to reset this activity?"))
      return;

    const rawQuestions = data.questions || (Array.isArray(data) ? data : []);

    setQuestions(normalizeQuestions(rawQuestions));
    setCurrent(0);
    setScore(0);
    setAttempted(0);
    setStatus("PLAYING");

    // Reset audio player
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsPlaying(false);
    setAudioProgress(0);
    setCurrentTime(0);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainCard}>
        <div className={styles.mainCardInner}>
          {/* Top Title & Media Area */}
          {(title || imageSrc || audioSrc) && status === "PLAYING" && (
            <div className={styles.mediaWrap}>
              {title && <div className={styles.title}>{title}</div>}

              {imageSrc && (
                <div className={styles.imageWrap}>
                  <img src={imageSrc} alt="Activity Graphic" />
                </div>
              )}

              {audioSrc && (
                <div className={styles.customAudioPlayer}>
                  <audio
                    ref={audioRef}
                    src={audioSrc}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleAudioEnded}
                  />
                  <button className={styles.playPauseBtn} onClick={togglePlay}>
                    {isPlaying ? "❚❚" : "▶"}
                  </button>
                  <div className={styles.seekBarContainer}>
                    <div
                      className={styles.seekFill}
                      style={{ width: `${audioProgress}%` }}
                    ></div>
                    <input
                      type="range"
                      className={styles.seekBar}
                      value={audioProgress}
                      max="100"
                      onChange={handleSeek}
                    />
                  </div>
                  <span className={styles.timeDisplay}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Game UI */}
          {status === "PLAYING" ? (
            <>
              {/* Question Text */}
              <div className={styles.qTitle}>
                Question {current + 1} of {total}
              </div>
              <div
                className={styles.question}
                dangerouslySetInnerHTML={{ __html: q.qText }}
              />

              {/* Options */}
              <div className={styles.options}>
                {q.options.map((opt, i) => {
                  const isSelected = q.userChoice === i;
                  const isCorrectAns = q.correctIndex === i;

                  let labelClass = styles.optLabel;
                  let radioClass = styles.radio;

                  if (q.answered) {
                    if (isCorrectAns) labelClass += ` ${styles.correct}`;
                    else if (isSelected) labelClass += ` ${styles.wrong}`;
                  }
                  if (isSelected) radioClass += ` ${styles.checked}`;

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

              {/* Floating Validation Marks */}
              {q.answered && (
                <div
                  className={`${styles.mark} ${q.userChoice === q.correctIndex ? styles.right : styles.wrong}`}
                >
                  {q.userChoice === q.correctIndex ? "✔" : "✖"}
                </div>
              )}

              {/* Bottom Controls */}
              <div className={styles.controlsRow}>
                <div className={styles.score}>
                  Score : {score} / {attempted}
                </div>
                <button
                  className={styles.nextBtn}
                  disabled={!q.answered}
                  onClick={handleNext}
                >
                  {current + 1 === total ? "Finish" : "Next"}
                </button>
              </div>
            </>
          ) : (
            /* 🟢 UPGRADED SUMMARY UI */
            <>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: 600,
                  marginBottom: "16px",
                }}
              >
                Activity Completed!
              </div>

              <div className={styles.summary}>
                {questions.map((sq, i) => {
                  const user =
                    sq.userChoice === null
                      ? "(Skipped)"
                      : sq.options[sq.userChoice];
                  const correct = sq.options[sq.correctIndex];
                  const isCorrect = sq.userChoice === sq.correctIndex;

                  return (
                    <div key={i} className={styles.summaryItem}>
                      <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
                        {i + 1}.{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: sq.qTextRaw || sq.qText,
                          }}
                        />
                      </div>
                      <div style={{ fontSize: "0.95em" }}>
                        Your Answer:{" "}
                        <span
                          className={
                            isCorrect
                              ? styles.summaryCorrect
                              : styles.summaryWrong
                          }
                        >
                          {user}
                        </span>
                        {!isCorrect && (
                          <span style={{ color: "#555", marginLeft: "8px" }}>
                            (Correct: <strong>{correct}</strong>)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.controlsRow}>
                <div className={styles.score}>
                  Final Score: {score} / {attempted}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button className={styles.nextBtn} onClick={resetActivity}>
                    Reset Activity
                  </button>

                  <button className={styles.nextBtn} onClick={handleFinalNext}>
                    Next
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
