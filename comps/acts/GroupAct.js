import React, { useState, useEffect } from "react";
import styles from "./GroupAct.module.css";
import Confetti from "react-confetti";

export default function GroupAct({ data, onNext }) {
  const STORAGE_KEY = `groupact_${data?.id || "default"}`;
  const [wordPool, setWordPool] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    if (!data?.types) return;

    // ⛔ STOP if already initialized
    if (isInitialized) return;

    // 🔥 FIRST: check localStorage
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      setWordPool(parsed.wordPool || []);
      setGroups(parsed.groups || []);
      setIsFinished(parsed.isFinished || false);
      setScore(parsed.score || 0);
      setShowConfetti(false);

      setIsInitialized(true); // 🔒 lock
      return;
    }

    // 👉 ONLY FIRST TIME INITIALIZATION
    let allWords = [];
    const initialGroups = data.types.map((type, idx) => {
      const words = type.text.split(",").map((w) => w.trim());
      words.forEach((w) => allWords.push({ text: w, correctGroupId: idx }));
      return { ...type, id: idx, currentWords: [] };
    });

    setWordPool(allWords.sort(() => Math.random() - 0.5));
    setGroups(initialGroups);

    setIsInitialized(true); // 🔒 lock
  }, [data, isInitialized]);
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        wordPool,
        groups,
        isFinished,
        score,
      }),
    );
  }, [wordPool, groups, isFinished, score, isInitialized]);

  const handleSort = (wordObj, groupId) => {
    // Add word to the group
    const newGroups = [...groups];
    newGroups[groupId].currentWords.push(wordObj);
    setGroups(newGroups);

    // Remove word from pool
    setWordPool(wordPool.filter((w) => w !== wordObj));
  };

  const handleReset = () => {
    if (!window.confirm("Are you sure you want to reset this activity?"))
      return;

    localStorage.removeItem(STORAGE_KEY);

    let allWords = [];
    groups.forEach((g) => {
      g.currentWords.forEach((w) => allWords.push(w));
    });
    wordPool.forEach((w) => allWords.push(w));

    setWordPool(allWords.sort(() => Math.random() - 0.5));
    setGroups(groups.map((g) => ({ ...g, currentWords: [] })));

    setIsFinished(false);
    setScore(0);
    setShowConfetti(false);

    setIsInitialized(false); // 🔥 allow fresh init again
  };
  const handleFinish = () => {
    let correctCount = 0;
    let totalCount = 0;

    groups.forEach((g) => {
      g.currentWords.forEach((w) => {
        totalCount++;
        if (w.correctGroupId === g.id) correctCount++;
      });
    });

    setScore(correctCount);

    // 🎉 trigger confetti if all correct
    if (correctCount === totalCount && totalCount > 0) {
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        setIsFinished(true);
      }, 2000);
    } else {
      setIsFinished(true);
    }
  };

  const renderTitle = () => {
    const [hindi, english] = (data.title || "").split("\n");
    return (
      <div className={styles.hindiTitle}>
        {hindi}
        <br></br>
        {english}
      </div>
    );
  };

  if (isFinished) {
    return (
      <div className={styles.wrapper}>
        {showConfetti && <Confetti />}
        <div className={styles.container}>
          <div className={styles.main} style={{ textAlign: "center" }}>
            <h2 className={styles.hindiTitle}>परिणाम (Result)</h2>
            <div className={styles.finalScoreDisplay}>
              Score: {score} /{" "}
              {score +
                wordPool.length +
                groups.reduce((acc, g) => acc + g.currentWords.length, 0) -
                score}
            </div>
            <div className={styles.actionRow}>
              <button className={styles.nextBtn} onClick={onNext}>
                Finish
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {showConfetti && <Confetti />}
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.titleContainer}>{renderTitle()}</div>
          {/* Word Pool */}
          <div className={styles.pool}>
            {wordPool.map((word, i) => (
              <div key={i} className={styles.draggableWord}>
                {word.text}
                <div className={styles.dropOverlay}>
                  {groups.map((g) => (
                    <button key={g.id} onClick={() => handleSort(word, g.id)}>
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Buckets */}
          <div className={styles.bucketsContainer}>
            {groups.map((g) => (
              <div key={g.id} className={styles.bucket}>
                <div className={styles.bucketHeader}>{g.name}</div>
                <div className={styles.bucketContent}>
                  {g.currentWords.map((w, i) => (
                    <span key={i} className={styles.sortedWord}>
                      {w.text}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <button className={styles.nextBtn} onClick={handleReset}>
              Reset
            </button>
            <div className={styles.actionRow}>
              {wordPool.length === 0 && (
                <button className={styles.nextBtn} onClick={handleFinish}>
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
