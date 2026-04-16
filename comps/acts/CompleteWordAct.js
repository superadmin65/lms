// import React, { useState, useEffect } from 'react';
// import styles from './CompleteWordAct.module.css';

// // const API_BASE = 'http://192.168.0.127:8080/ords/lms/completedword';
// import { apiService } from '../../utils/apiService'; // 1. Import the service

// function shuffleArray(array) {
//   const arr = [...array];
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
//   return arr;
// }

// function parseData(textData) {
//   if (!textData) return [];
//   const lines = textData.split('\n');
//   return lines
//     .map((line) => {
//       const parts = line.split('|');
//       if (parts.length < 4) return null;
//       const rawOptions = parts[3].split(',').map((o) => o.trim());

//       return {
//         english: parts[0],
//         fullWord: parts[1],
//         puzzle: parts[2],
//         correctAnswer: rawOptions[0],
//         options: rawOptions,
//         displayOptions: shuffleArray(rawOptions), // Shuffle once during parse
//         answered: false,
//         selectedOption: null,
//       };
//     })
//     .filter((item) => item !== null);
// }

// export default function CompleteWordAct({ data }) {
//   const [questions, setQuestions] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [score, setScore] = useState(0);
//   const [attempted, setAttempted] = useState(0);
//   const [userAnswers, setUserAnswers] = useState([]);
//   const [status, setStatus] = useState('STARTED');
//   const [userId, setUserId] = useState(0);
//   const [isSaving, setIsSaving] = useState(false);

//   const activityId = data?.id || 'spelling_01';

//   // INITIALIZATION
//   useEffect(() => {
//     if (!data) return;

//     // 🟢 FIX 1: Fetch user_id precisely like the old script.js and force it to be a Number
//     const currentUserId = Number(
//       data.user_id || localStorage.getItem('user_id') || 0
//     );
//     setUserId(currentUserId);

//     const initGame = async () => {
//       let initialQuestions = [];
//       if (data.text) {
//         initialQuestions = parseData(data.text);
//       } else if (data.questions) {
//         initialQuestions = data.questions;
//       }

//       try {
//         const res = await fetch(
//           `${API_BASE}/progress/${currentUserId}/${activityId}`
//         );
//         if (res.ok) {
//           const result = await res.json();
//           if (
//             (result.status === 'IN_PROGRESS' ||
//               result.status === 'COMPLETED') &&
//             result.data
//           ) {
//             const savedState = result.data;

//             setCurrent(savedState.currentQIndex || 0);
//             setScore(savedState.score || 0);
//             setAttempted(savedState.questionsAttempted || 0);
//             setUserAnswers(savedState.userAnswers || []);

//             if (
//               savedState.questionsAttempted >= initialQuestions.length &&
//               initialQuestions.length > 0
//             ) {
//               setStatus('SUMMARY');
//             }
//           }
//         }
//       } catch (err) {}

//       setQuestions(initialQuestions);
//     };

//     initGame();
//   }, [data, activityId]);

//   // ACTION HANDLERS
//   const handleAnswer = async (selectedOpt) => {
//     const q = questions[current];
//     if (q.answered) return;

//     const isCorrect = selectedOpt === q.correctAnswer;

//     const updatedQuestions = [...questions];
//     updatedQuestions[current] = {
//       ...q,
//       answered: true,
//       selectedOption: selectedOpt,
//     };

//     // 🟢 FIX 2: Clean the question object to exactly match the old payload structure
//     const cleanQuestion = {
//       english: q.english,
//       fullWord: q.fullWord,
//       puzzle: q.puzzle,
//       correctAnswer: q.correctAnswer,
//       options: q.options,
//     };

//     const newScore = score + (isCorrect ? 1 : 0);
//     const newAttempted = attempted + 1;
//     const newUserAnswers = [
//       ...userAnswers,
//       {
//         question: cleanQuestion, // Only send the clean data
//         userSelected: selectedOpt,
//         isCorrect: isCorrect,
//         fullCorrectWord: q.fullWord,
//       },
//     ];

//     setQuestions(updatedQuestions);
//     setScore(newScore);
//     setAttempted(newAttempted);
//     setUserAnswers(newUserAnswers);

//     // Save Progress
//     // Save Progress
//     saveProgressAPI(current, newScore, newAttempted, newUserAnswers, userId);
//   };

//   const nextQuestion = async () => {
//     setIsSaving(true);
//     if (current + 1 < questions.length) {
//       const nextIdx = current + 1;
//       await saveProgressAPI(nextIdx, score, attempted, userAnswers, userId);
//       setCurrent(nextIdx);
//     } else {
//       await saveProgressAPI(current, score, attempted, userAnswers, userId);
//       await completeQuizAPI();
//       setStatus('SUMMARY');
//     }
//     setIsSaving(false);
//   };

//   // API CALLS
//   const saveProgressAPI = async (
//     currIdx,
//     currentScore,
//     currentAttempted,
//     currentAnswers,
//     uid = userId
//   ) => {
//     if (!uid) return;

//     const stateToSave = {
//       currentQIndex: currIdx,
//       score: currentScore,
//       questionsAttempted: currentAttempted,
//       userAnswers: currentAnswers,
//     };

//     try {
//       await fetch(`${API_BASE}/progress`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           user_id: uid, // Number format
//           activity_id: activityId,
//           progress_json: JSON.stringify(stateToSave),
//           score: currentScore,
//           attempted: currentAttempted,
//         }),
//       });
//     } catch (err) {}
//   };

//   const completeQuizAPI = async () => {
//     if (!userId) return;
//     try {
//       await fetch(`${API_BASE}/complete`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           user_id: userId, // Number format
//           activity_id: activityId,
//           score: score,
//           attempted: attempted,
//         }),
//       });
//     } catch (err) {}
//   };

//   const handleFinalNext = () => {
//     try {
//       window.parent.postMessage(
//         JSON.stringify({ done: true, score: score, total: questions.length }),
//         '*'
//       );
//     } catch (_) {}
//   };

//   // RENDER
//   if (questions.length === 0) return null;

//   const currentQ = questions[current];
//   const isSummary = status === 'SUMMARY';

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.mainCard}>
//         {/* Header */}
//         <div className={styles.titleText}>{data.title || ''}</div>

//         {!isSummary ? (
//           <div className={styles.gameArea}>
//             {/* Word Puzzle Display */}
//             <div className={styles.wordDisplayContainer}>
//               <div className={styles.wordPuzzle}>
//                 {currentQ.puzzle.split('_').length > 1 ? (
//                   <>
//                     <span>{currentQ.puzzle.split('_')[0]}</span>
//                     <div
//                       className={styles.missingBox}
//                       style={{
//                         backgroundColor: currentQ.answered
//                           ? 'transparent'
//                           : 'var(--purple-box)',
//                         color: currentQ.answered
//                           ? currentQ.selectedOption === currentQ.correctAnswer
//                             ? 'var(--green-correct)'
//                             : 'var(--red-wrong)'
//                           : 'white',
//                         fontSize: currentQ.answered ? '3rem' : 'inherit',
//                       }}
//                     >
//                       {currentQ.answered ? currentQ.selectedOption : '_'}
//                     </div>
//                     <span>{currentQ.puzzle.split('_')[1]}</span>
//                   </>
//                 ) : (
//                   <span>{currentQ.puzzle}</span>
//                 )}
//               </div>
//             </div>

//             {/* Options */}
//             <div className={styles.optionsContainer}>
//               {currentQ.displayOptions.map((opt, i) => (
//                 <button
//                   key={i}
//                   className={styles.optionBtn}
//                   disabled={currentQ.answered}
//                   onClick={() => handleAnswer(opt)}
//                 >
//                   {opt}
//                 </button>
//               ))}
//             </div>

//             {/* Floating Next Button */}
//             {currentQ.answered && (
//               <button
//                 className={`${styles.nextBtn} ${styles.floatNext}`}
//                 onClick={nextQuestion}
//                 disabled={isSaving}
//               >
//                 {isSaving
//                   ? 'Saving...'
//                   : current + 1 === questions.length
//                     ? 'Finish'
//                     : 'Next'}
//               </button>
//             )}

//             {/* Footer */}
//             <div className={styles.gameFooter}>
//               <div className={styles.scoreBadge}>
//                 Score : {score} / {attempted}
//               </div>
//             </div>
//           </div>
//         ) : (
//           /* SUMMARY AREA */
//           <div className={styles.summaryArea}>
//             <h2 style={{ textAlign: 'center', color: '#333' }}>
//               You have completed this activity.
//             </h2>

//             <div className={styles.summaryList}>
//               {userAnswers.map((ans, i) => {
//                 const userFormedWord = ans.question.puzzle.replace(
//                   '_',
//                   ans.userSelected
//                 );

//                 return (
//                   <div key={i} className={styles.summaryItem}>
//                     {ans.isCorrect ? (
//                       <>
//                         <span className={styles.sCorrectNum}>{i + 1})</span>
//                         <span className={styles.sCorrectText}>
//                           {userFormedWord}
//                         </span>
//                       </>
//                     ) : (
//                       <>
//                         <span className={styles.sNum}>{i + 1})</span>
//                         <span className={styles.sWrongText}>
//                           {userFormedWord}
//                         </span>
//                         <span className={styles.sBracket}>
//                           ({ans.fullCorrectWord})
//                         </span>
//                       </>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             <div className={styles.summaryFooter}>
//               <div className={styles.scoreBadge}>
//                 Final Score: {score} / {questions.length}
//               </div>
//               <button className={styles.nextBtn} onClick={handleFinalNext}>
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import styles from "./CompleteWordAct.module.css";
import { apiService } from "../../utils/apiService";
import confetti from "canvas-confetti";

/* ================= HELPERS ================= */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function parseData(textData) {
  if (!textData) return [];
  const lines = textData.split("\n");

  return lines
    .map((line) => {
      const parts = line.split("|");
      if (parts.length < 4) return null;

      const rawOptions = parts[3].split(",").map((o) => o.trim());

      return {
        english: parts[0],
        fullWord: parts[1],
        puzzle: parts[2],
        correctAnswer: rawOptions[0],
        options: rawOptions,
        displayOptions: shuffleArray(rawOptions),
        answered: false,
        selectedOption: null,
      };
    })
    .filter(Boolean);
}

/* ================= COMPONENT ================= */
export default function CompleteWordAct({ data }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [status, setStatus] = useState("STARTED");
  const [userId, setUserId] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const activityId = data?.id || "spelling_01";

  /* ================= INIT ================= */
  useEffect(() => {
    if (!data) return;

    const currentUserId = Number(
      data.user_id || localStorage.getItem("user_id") || 0,
    );
    setUserId(currentUserId);

    const initGame = async () => {
      let initialQuestions = [];

      if (data.text) {
        initialQuestions = parseData(data.text);
      } else if (data.questions) {
        initialQuestions = data.questions;
      }

      try {
        const res = await apiService.getSpellingProgress(
          currentUserId,
          activityId,
        );
        const result = res.data;

        if (
          (result.status === "IN_PROGRESS" || result.status === "COMPLETED") &&
          result.data
        ) {
          const savedState = result.data;

          setCurrent(savedState.currentQIndex || 0);
          setScore(savedState.score || 0);
          setAttempted(savedState.questionsAttempted || 0);
          setUserAnswers(savedState.userAnswers || []);

          if (
            savedState.questionsAttempted >= initialQuestions.length &&
            initialQuestions.length > 0
          ) {
            setStatus("SUMMARY");
          }
        }
      } catch {
        console.log("No previous progress");
      }

      setQuestions(initialQuestions);
    };

    initGame();
  }, [data, activityId]);

  /* ================= ACTIONS ================= */

  // SELECT OPTION
  const handleAnswer = (opt) => {
    const updated = [...questions];
    if (updated[current].answered) return;

    updated[current].selectedOption = opt;
    setQuestions(updated);
  };

  // CONFETTI
  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // SUBMIT ANSWER
  const handleSubmit = () => {
    const updated = [...questions];
    const q = updated[current];

    if (q.selectedOption === null) return;

    const isCorrect = q.selectedOption === q.correctAnswer;

    if (isCorrect) triggerConfetti();

    q.answered = true;

    const cleanQuestion = {
      fullWord: q.fullWord,
      puzzle: q.puzzle,
      correctAnswer: q.correctAnswer,
      options: q.options,
    };

    const newScore = score + (isCorrect ? 1 : 0);
    const newAttempted = attempted + 1;

    const newUserAnswers = [
      ...userAnswers,
      {
        question: cleanQuestion,
        userSelected: q.selectedOption,
        isCorrect,
        fullCorrectWord: q.fullWord,
      },
    ];

    setQuestions(updated);
    setScore(newScore);
    setAttempted(newAttempted);
    setUserAnswers(newUserAnswers);

    saveProgressAPI(current, newScore, newAttempted, newUserAnswers);
  };

  // NEXT
  const nextQuestion = async () => {
    setIsSaving(true);

    if (current + 1 < questions.length) {
      const nextIdx = current + 1;
      await saveProgressAPI(nextIdx, score, attempted, userAnswers);
      setCurrent(nextIdx);
    } else {
      await saveProgressAPI(current, score, attempted, userAnswers);
      await completeQuizAPI();
      setStatus("SUMMARY");
    }

    setIsSaving(false);
  };

  /* ================= RESET ================= */
  const resetQuiz = async () => {
    if (!window.confirm("Reset activity?")) return;

    let initialQuestions = [];

    if (data.text) {
      initialQuestions = parseData(data.text);
    } else if (data.questions) {
      initialQuestions = data.questions.map((q) => ({
        ...q,
        answered: false,
        selectedOption: null,
        displayOptions: shuffleArray(q.options || []),
      }));
    }

    setQuestions(initialQuestions);
    setCurrent(0);
    setScore(0);
    setAttempted(0);
    setUserAnswers([]);
    setStatus("STARTED");

    await apiService.saveSpellingProgress({
      user_id: userId,
      activity_id: activityId,
      progress_json: JSON.stringify({
        currentQIndex: 0,
        score: 0,
        questionsAttempted: 0,
        userAnswers: [],
      }),
      score: 0,
      attempted: 0,
    });
  };

  /* ================= API ================= */
  const saveProgressAPI = async (currIdx, scoreVal, attemptedVal, answers) => {
    if (!userId) return;

    await apiService.saveSpellingProgress({
      user_id: userId,
      activity_id: activityId,
      progress_json: JSON.stringify({
        currentQIndex: currIdx,
        score: scoreVal,
        questionsAttempted: attemptedVal,
        userAnswers: answers,
      }),
      score: scoreVal,
      attempted: attemptedVal,
    });
  };

  const completeQuizAPI = async () => {
    if (!userId) return;

    await apiService.completeSpelling({
      user_id: userId,
      activity_id: activityId,
      score,
      attempted,
    });
  };

  const handleFinalNext = () => {
    window.parent.postMessage(
      JSON.stringify({ done: true, score, total: questions.length }),
      "*",
    );
  };

  if (!questions.length) return null;

  const currentQ = questions[current];
  const isSummary = status === "SUMMARY";

  /* ================= UI ================= */
  return (
    <div className={styles.wrapper}>
      <div className={styles.mainCard}>
        <div className={styles.titleText}>
          {(data.title || "").replace(/\s*\(/, "\n(")}
        </div>

        {!isSummary ? (
          <div className={styles.gameArea}>
            {/* WORD */}
            <div className={styles.wordDisplayContainer}>
              <div className={styles.wordPuzzle}>
                {currentQ.puzzle.split("_").length > 1 ? (
                  <>
                    <span>{currentQ.puzzle.split("_")[0]}</span>
                    <div
                      className={styles.missingBox}
                      style={{
                        backgroundColor: currentQ.answered
                          ? "transparent"
                          : "var(--purple-box)",
                        color: currentQ.answered
                          ? currentQ.selectedOption === currentQ.correctAnswer
                            ? "var(--green-correct)"
                            : "var(--red-wrong)"
                          : "white",
                      }}
                    >
                      {currentQ.answered ? currentQ.selectedOption : "_"}
                    </div>
                    <span>{currentQ.puzzle.split("_")[1]}</span>
                  </>
                ) : (
                  currentQ.puzzle
                )}
              </div>
            </div>

            {/* OPTIONS */}
            <div className={styles.optionsContainer}>
              {currentQ.displayOptions.map((opt, i) => (
                <button
                  key={i}
                  className={`${styles.optionBtn}
                  ${currentQ.selectedOption === opt ? styles.selected : ""}
                  ${currentQ.answered && opt === currentQ.correctAnswer ? styles.correct : ""}
                  ${currentQ.answered && currentQ.selectedOption === opt && opt !== currentQ.correctAnswer ? styles.wrong : ""}
                  `}
                  onClick={() => handleAnswer(opt)}
                  disabled={currentQ.answered}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* RESULT */}
            {currentQ.answered && (
              <div style={{ textAlign: "center", fontWeight: "bold" }}>
                {currentQ.selectedOption === currentQ.correctAnswer
                  ? "Correct 🎉"
                  : "Wrong ❌"}
              </div>
            )}

            {/* FOOTER */}
            <div className={styles.gameFooter}>
              <div className={styles.scoreBadge}>
                Score : {score} / {attempted}
              </div>

              <button
                className={`${styles.btn} ${styles.primary}`}
                onClick={!currentQ.answered ? handleSubmit : nextQuestion}
                disabled={
                  !currentQ.answered && currentQ.selectedOption === null
                }
              >
                {!currentQ.answered
                  ? "Submit"
                  : current + 1 === questions.length
                    ? "Finish"
                    : "Next"}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.summaryArea}>
            <h2>You have completed this activity.</h2>

            <div className={styles.summaryList}>
              {userAnswers.map((ans, i) => {
                const word = ans.question.puzzle.replace("_", ans.userSelected);

                return (
                  <div key={i} className={styles.summaryItem}>
                    {ans.isCorrect ? (
                      <>
                        <span className={styles.sCorrectNum}>{i + 1})</span>
                        <span className={styles.sCorrectText}>{word}</span>
                      </>
                    ) : (
                      <>
                        <span className={styles.sNum}>{i + 1})</span>
                        <span className={styles.sWrongText}>{word}</span>
                        <span className={styles.sBracket}>
                          ({ans.fullCorrectWord})
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={styles.summaryFooter}>
              <div className={styles.scoreBadge}>
                Final Score: {score} / {questions.length}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className={`${styles.btn} ${styles.primary}`}
                  onClick={resetQuiz}
                >
                  Reset
                </button>

                <button
                  className={`${styles.btn} ${styles.primary}`}
                  onClick={handleFinalNext}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
