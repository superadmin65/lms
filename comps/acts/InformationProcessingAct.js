import React, { useState, useEffect, useRef } from 'react';
import styles from './InformationProcessingAct.module.css';
import confetti from 'canvas-confetti';

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
  return (raw || '')
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeQuestions(raw) {
  return raw.map((q) => {
    const original = q.qText || q.text || '';
    const rawOpts = parseOptionsString(q.options || q.option || '');
    let originalCorrectIndex = -1;

    const cleaned = rawOpts.map((o, idx) => {
      if (o.includes('*')) {
        originalCorrectIndex = idx;
        return o.replace(/\*/g, '').trim();
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
      selectedOption: null,
      userChoice: null,
      answered: false,
    };
  });
}

function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function InformationProcessingAct({ data }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [status, setStatus] = useState('PLAYING');

  const [title, setTitle] = useState('');
  const [imageSrc, setImageSrc] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [imgStyles, setImgStyles] = useState({});

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!data) return;

    const actTitle = data.title || data.label || 'Answer the Questions';
    setTitle(actTitle.replace(/\s*\(/, '\n('));

    setImageSrc(
      data.image ||
        data.bgData?.bgImg ||
        data.data?.image ||
        null
    );

    setAudioSrc(data.audio || data.data?.audio || null);

    const bg = data.bgData || data.data?.bgData;
    let tempStyles = {};

    if (bg) {
      if (bg.width) tempStyles.maxWidth = bg.width + 'px';
      if (bg.height) tempStyles.maxHeight = bg.height + 'px';
    }

    setImgStyles(tempStyles);

    const rawQuestions =
      data.questions ||
      data.data?.questions ||
      (Array.isArray(data) ? data : []);

    if (rawQuestions.length > 0) {
      setQuestions(normalizeQuestions(rawQuestions));
    }
  }, [data]);

  // AUDIO HANDLERS
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();

    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    const currentT = audioRef.current.currentTime;
    const totalD = audioRef.current.duration;

    setCurrentTime(currentT);

    if (totalD > 0) {
      setAudioProgress((currentT / totalD) * 100);
    }
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

  // GAME HANDLERS
  const handleOptionClick = (idx) => {
    const updated = [...questions];
    const activeQ = updated[current];

    if (activeQ.answered) return;

    activeQ.selectedOption = idx;
    setQuestions(updated);
  };

  const handleSubmit = () => {
    const updated = [...questions];
    const activeQ = updated[current];

    if (activeQ.selectedOption === null) return;

    activeQ.answered = true;
    activeQ.userChoice = activeQ.selectedOption;

    const isCorrect = activeQ.userChoice === activeQ.correctIndex;

    setQuestions(updated);
    setAttempted((prev) => prev + 1);

    if (isCorrect) {
      setScore((prev) => prev + 1);

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);

      const scrollContainer = document.getElementById('infoProcInner');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setStatus('SUMMARY');

      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const resetActivity = () => {
    if (!window.confirm('Are you sure you want to reset this activity?')) return;

    const rawQuestions =
      data.questions ||
      data.data?.questions ||
      (Array.isArray(data) ? data : []);

    setQuestions(normalizeQuestions(rawQuestions));
    setCurrent(0);
    setScore(0);
    setAttempted(0);
    setStatus('PLAYING');

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsPlaying(false);
    setAudioProgress(0);
    setCurrentTime(0);
  };

  const handleFinalNext = () => {
    try {
      window.parent.postMessage(
        JSON.stringify({
          done: true,
          score,
          total: attempted,
        }),
        '*'
      );
    } catch (_) {}
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const q = questions[current];

      if (e.key === 'Enter' && q && q.answered && status === 'PLAYING') {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  if (questions.length === 0) return null;

  const q = questions[current];
  const total = questions.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainCard}>
        <div className={styles.mainCardInner} id="infoProcInner">

          {(title || imageSrc || audioSrc) && status === 'PLAYING' && (
            <div className={styles.mediaWrap}>
              {title && <div className={styles.title}>{title}</div>}

              {imageSrc && (
                <div className={styles.imageWrap}>
                  <img src={imageSrc} alt="Activity Resource" style={imgStyles} />
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
                    {isPlaying ? '❚❚' : '▶'}
                  </button>

                  <div className={styles.seekBarContainer}>
                    <div
                      className={styles.seekFill}
                      style={{ width: `${audioProgress}%` }}
                    />
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

          {status === 'PLAYING' && imageSrc && (
            <div className={styles.scrollHint}>
              Scroll Down To Answer 👇
            </div>
          )}

          {status === 'PLAYING' ? (
            <>
              <div className={styles.qTitle}>
                Question {current + 1} of {total}
              </div>

              <div
                className={styles.question}
                dangerouslySetInnerHTML={{ __html: q.qText }}
              />

              <div className={styles.options}>
                {q.options.map((opt, i) => {
                  const isSelected = q.selectedOption === i;
                  const isCorrectAns = q.correctIndex === i;

                  let labelClass = styles.optLabel;
                  let radioClass = styles.radio;

                  if (!q.answered && isSelected) {
                    labelClass += ` ${styles.selected}`;
                    radioClass += ` ${styles.checked}`;
                  }

                  if (q.answered) {
                    if (isCorrectAns) labelClass += ` ${styles.correct}`;
                    else if (q.userChoice === i) labelClass += ` ${styles.wrong}`;

                    if (q.userChoice === i) radioClass += ` ${styles.checked}`;
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

              {q.answered && (
                <div
                  className={`${styles.mark} ${
                    q.userChoice === q.correctIndex
                      ? styles.right
                      : styles.wrong
                  }`}
                >
                  {q.userChoice === q.correctIndex ? '✔' : '✖'}
                </div>
              )}

              <div className={styles.controlsRow}>
                <div className={styles.score}>
                  Score : {score} / {attempted}
                </div>

                <button
                  className={styles.nextBtn}
                  onClick={!q.answered ? handleSubmit : handleNext}
                  disabled={!q.answered && q.selectedOption === null}
                >
                  {!q.answered
                    ? 'Submit'
                    : current + 1 === total
                    ? 'Finish'
                    : 'Next'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.summaryTitle}>
                Activity Completed!
              </div>

              <div className={styles.summary}>
                {questions.map((sq, i) => (
                  <div key={i} className={styles.summaryItem}>
                    <div>
                      {i + 1}. {sq.qTextRaw}
                    </div>
                    <div>
                      Your Answer: {sq.options[sq.userChoice]}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.controlsRow}>
                <div className={styles.score}>
                  Final Score: {score} / {attempted}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className={`${styles.btn} ${styles.primary}`}
                    onClick={resetActivity}
                  >
                    Reset Activity
                  </button>

                  <button
                    className={`${styles.btn} ${styles.primary}`}
                    onClick={handleFinalNext}
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
  );
}