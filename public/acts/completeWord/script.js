

const API_BASE = 'http://localhost:8080/ords/lms/completedword';

const urlParams = new URLSearchParams(window.location.search);
let payloadData = {};

try {
  const rawPayload = urlParams.get('payload');
  if (rawPayload) {
    payloadData = JSON.parse(decodeURIComponent(rawPayload));
  }
} catch (e) {
  console.error('Error parsing payload', e);
}

// ---------------------------------------------------
// 1. DYNAMIC ID FETCHING (JSON Payload or LocalStorage)
// ---------------------------------------------------

// Check payload first, then localStorage, else default to 0
let userID = Number(
  payloadData.user_id || localStorage.getItem('user_id') || 0
);

// Check payload first, then localStorage, else default to 'spelling_01'
let activityID =
  payloadData.id || localStorage.getItem('activity_id') || 'spelling_01';

// ---------------------------------------------------
// 2. INITIAL STATE
// ---------------------------------------------------
let questions = [];
let currentQIndex = 0;
let score = 0;
let questionsAttempted = 0;
let userAnswers = [];

// DOM Elements
const titleEl = document.getElementById('activity-title');
const wordPuzzleEl = document.getElementById('word-puzzle');
const optionsContainer = document.getElementById('options-container');
const scoreEl = document.getElementById('score-box');
const nextBtn = document.getElementById('next-q-btn');
const gameArea = document.getElementById('game-area');
const summaryArea = document.getElementById('summary-area');
const summaryList = document.getElementById('summary-list');
const finalNextBtn = document.getElementById('final-next-btn');
const finalScoreEl = document.getElementById('final-score');

// ---------------------------------------------------
// API INTEGRATION FUNCTIONS
// ---------------------------------------------------

async function loadProgressAPI() {
  try {
    const res = await fetch(`${API_BASE}/progress/${userID}/${activityID}`);
    if (!res.ok) return null;
    const result = await res.json();

    if (result.status === 'IN_PROGRESS' || result.status === 'COMPLETED') {
      return result.data;
    }
    return null;
  } catch (err) {
    console.error('API Load Error', err);
    return null;
  }
}

async function saveProgressAPI() {
  const stateToSave = {
    currentQIndex,
    score,
    questionsAttempted,
    userAnswers,
  };
  try {
    await fetch(`${API_BASE}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userID,
        activity_id: activityID,
        progress_json: JSON.stringify(stateToSave),
        score: score,
        attempted: questionsAttempted,
      }),
    });
  } catch (err) {
    console.error('API Save Error', err);
  }
}

async function completeQuizAPI() {
  try {
    await fetch(`${API_BASE}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userID,
        activity_id: activityID,
        score: score,
        attempted: questionsAttempted,
      }),
    });
  } catch (err) {
    console.error('API Complete Error', err);
  }
}

// ---------------------------------------------------
// GAME LOGIC
// ---------------------------------------------------

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function parseData(textData) {
  const lines = textData.split('\n');
  return lines
    .map((line) => {
      const parts = line.split('|');
      if (parts.length < 4) return null;
      const rawOptions = parts[3].split(',');
      return {
        english: parts[0],
        fullWord: parts[1],
        puzzle: parts[2],
        correctAnswer: rawOptions[0],
        options: rawOptions,
      };
    })
    .filter((item) => item !== null);
}

async function initGame() {
  // Check if IDs are missing
  if (!userID) {
    console.warn('Warning: userID is not defined. API calls may fail.');
  }

  // Set the main title in the header
  if (payloadData.title && titleEl) {
    titleEl.textContent = payloadData.title;
    titleEl.classList.remove('hidden');
  }

  const summaryTitleEl = document.getElementById('summary-title');
  if (summaryTitleEl) {
    summaryTitleEl.textContent = '';
  }

  if (payloadData.text) {
    questions = parseData(payloadData.text);
  }

  const savedState = await loadProgressAPI();
  if (savedState) {
    currentQIndex = savedState.currentQIndex || 0;
    score = savedState.score || 0;
    questionsAttempted = savedState.questionsAttempted || 0;
    userAnswers = savedState.userAnswers || [];

    if (questionsAttempted >= questions.length && questions.length > 0) {
      showSummary();
      return;
    }
  }

  updateScore();
  loadQuestion(currentQIndex);
}

function updateScore() {
  scoreEl.textContent = `Score : ${score} / ${questionsAttempted}`;
}

function loadQuestion(index) {
  const q = questions[index];
  if (!q) return;

  optionsContainer.innerHTML = '';
  nextBtn.classList.add('hidden');
  wordPuzzleEl.innerHTML = '';

  const parts = q.puzzle.split('_');
  if (parts.length > 1) {
    wordPuzzleEl.innerHTML = `
            <span>${parts[0]}</span>
            <div class="missing-box" id="target-box">_</div>
            <span>${parts[1]}</span>
        `;
  } else {
    wordPuzzleEl.textContent = q.puzzle;
  }

  let displayOptions = [...q.options];
  shuffleArray(displayOptions);

  displayOptions.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.onclick = () => handleAnswer(opt, btn, q);
    optionsContainer.appendChild(btn);
  });
}

async function handleAnswer(selectedOption, btnElement, questionData) {
  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach((b) => (b.disabled = true));

  const isCorrect = selectedOption === questionData.correctAnswer;
  const targetBox = document.getElementById('target-box');

  if (targetBox) {
    targetBox.textContent = selectedOption;
    targetBox.style.color = isCorrect
      ? 'var(--green-correct, green)'
      : 'var(--red-wrong, red)';
    targetBox.style.backgroundColor = 'transparent';
    targetBox.style.fontSize = '3rem';
  }

  userAnswers.push({
    question: questionData,
    userSelected: selectedOption,
    isCorrect: isCorrect,
    fullCorrectWord: questionData.fullWord,
  });

  questionsAttempted++;
  if (isCorrect) score++;

  updateScore();

  await saveProgressAPI();

  nextBtn.classList.remove('hidden');
  if (currentQIndex === questions.length - 1) {
    nextBtn.textContent = 'Finish';
    nextBtn.onclick = async () => {
      await completeQuizAPI();
      showSummary();
    };
  } else {
    nextBtn.textContent = 'Next';
    nextBtn.onclick = nextQuestion;
  }
}

async function nextQuestion() {
  currentQIndex++;
  await saveProgressAPI();
  if (currentQIndex < questions.length) {
    loadQuestion(currentQIndex);
  }
}

function showSummary() {
  gameArea.classList.add('hidden');
  nextBtn.classList.add('hidden');

  if (titleEl) {
    titleEl.classList.add('hidden');
  }

  summaryArea.classList.remove('hidden');

  finalScoreEl.textContent = `Final Score : ${score} / ${questions.length}`;
  summaryList.innerHTML = '';

  userAnswers.forEach((ans, i) => {
    const div = document.createElement('div');
    div.className = 'summary-item';
    const userFormedWord = ans.question.puzzle.replace('_', ans.userSelected);

    if (ans.isCorrect) {
      div.innerHTML = `
                <span class="s-correct-num">${i + 1})</span>
                <span class="s-correct-text">${userFormedWord}</span>
            `;
    } else {
      div.innerHTML = `
                <span class="s-num">${i + 1})</span>
                <span class="s-wrong-text">${userFormedWord}</span>
                <span class="s-bracket">(${ans.fullCorrectWord})</span>
            `;
    }
    summaryList.appendChild(div);
  });
}

finalNextBtn.addEventListener('click', function () {
  const message = JSON.stringify({
    done: true,
    score: score,
    total: questions.length,
  });
  window.parent.postMessage(message, '*');
});

initGame();



// const API_BASE = 'http://192.168.0.127:8080/ords/lms/completedword';

// const urlParams = new URLSearchParams(window.location.search);
// let payloadData = {};

// try {
//   const rawPayload = urlParams.get('payload');
//   if (rawPayload) {
//     payloadData = JSON.parse(decodeURIComponent(rawPayload));
//   }
// } catch (e) {
//   console.error('Error parsing payload', e);
// }

// // 2. INITIAL STATE
// let questions = [];
// let currentQIndex = 0;
// let score = 0;
// let questionsAttempted = 0;
// let userAnswers = [];
// let userID = 21; // user_id in number format
// let activityID = payloadData.id || 'spelling_01';

// // DOM Elements
// const titleEl = document.getElementById('activity-title');
// const wordPuzzleEl = document.getElementById('word-puzzle');
// const optionsContainer = document.getElementById('options-container');
// const scoreEl = document.getElementById('score-box');
// const nextBtn = document.getElementById('next-q-btn');
// const gameArea = document.getElementById('game-area');
// const summaryArea = document.getElementById('summary-area');
// const summaryList = document.getElementById('summary-list');
// const finalNextBtn = document.getElementById('final-next-btn');
// const finalScoreEl = document.getElementById('final-score');

// // ---------------------------------------------------
// // API INTEGRATION FUNCTIONS
// // ---------------------------------------------------

// async function loadProgressAPI() {
//   try {
//     const res = await fetch(`${API_BASE}/progress/${userID}/${activityID}`);
//     if (!res.ok) return null;
//     const result = await res.json();

//     if (result.status === 'IN_PROGRESS' || result.status === 'COMPLETED') {
//       return result.data;
//     }
//     return null;
//   } catch (err) {
//     console.error('API Load Error', err);
//     return null;
//   }
// }

// async function saveProgressAPI() {
//   const stateToSave = {
//     currentQIndex,
//     score,
//     questionsAttempted,
//     userAnswers,
//   };
//   try {
//     await fetch(`${API_BASE}/progress`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         user_id: userID,
//         activity_id: activityID,
//         progress_json: JSON.stringify(stateToSave),
//         score: score,
//         attempted: questionsAttempted,
//       }),
//     });
//   } catch (err) {
//     console.error('API Save Error', err);
//   }
// }

// async function completeQuizAPI() {
//   try {
//     await fetch(`${API_BASE}/complete`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         user_id: userID,
//         activity_id: activityID,
//         score: score,
//         attempted: questionsAttempted,
//       }),
//     });
//   } catch (err) {
//     console.error('API Complete Error', err);
//   }
// }

// // ---------------------------------------------------
// // GAME LOGIC
// // ---------------------------------------------------

// function shuffleArray(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// }

// function parseData(textData) {
//   const lines = textData.split('\n');
//   return lines
//     .map((line) => {
//       const parts = line.split('|');
//       if (parts.length < 4) return null;
//       const rawOptions = parts[3].split(',');
//       return {
//         english: parts[0],
//         fullWord: parts[1],
//         puzzle: parts[2],
//         correctAnswer: rawOptions[0],
//         options: rawOptions,
//       };
//     })
//     .filter((item) => item !== null);
// }

// async function initGame() {
//   // Set the main title in the header for the question phase
//   if (payloadData.title && titleEl) {
//     titleEl.textContent = payloadData.title;
//     titleEl.classList.remove('hidden'); // Ensure visible at start
//   }

//   // Ensure summary title is empty
//   const summaryTitleEl = document.getElementById('summary-title');
//   if (summaryTitleEl) {
//     summaryTitleEl.textContent = '';
//   }

//   if (payloadData.text) {
//     questions = parseData(payloadData.text);
//   }

//   const savedState = await loadProgressAPI();
//   if (savedState) {
//     currentQIndex = savedState.currentQIndex || 0;
//     score = savedState.score || 0;
//     questionsAttempted = savedState.questionsAttempted || 0;
//     userAnswers = savedState.userAnswers || [];

//     if (questionsAttempted >= questions.length && questions.length > 0) {
//       showSummary();
//       return;
//     }
//   }

//   updateScore();
//   loadQuestion(currentQIndex);
// }

// function updateScore() {
//   scoreEl.textContent = `Score : ${score} / ${questionsAttempted}`;
// }

// function loadQuestion(index) {
//   const q = questions[index];
//   if (!q) return;

//   optionsContainer.innerHTML = '';
//   nextBtn.classList.add('hidden');
//   wordPuzzleEl.innerHTML = '';

//   const parts = q.puzzle.split('_');
//   if (parts.length > 1) {
//     wordPuzzleEl.innerHTML = `
//             <span>${parts[0]}</span>
//             <div class="missing-box" id="target-box">_</div>
//             <span>${parts[1]}</span>
//         `;
//   } else {
//     wordPuzzleEl.textContent = q.puzzle;
//   }

//   let displayOptions = [...q.options];
//   shuffleArray(displayOptions);

//   displayOptions.forEach((opt) => {
//     const btn = document.createElement('button');
//     btn.className = 'option-btn';
//     btn.textContent = opt;
//     btn.onclick = () => handleAnswer(opt, btn, q);
//     optionsContainer.appendChild(btn);
//   });
// }

// async function handleAnswer(selectedOption, btnElement, questionData) {
//   const allBtns = document.querySelectorAll('.option-btn');
//   allBtns.forEach((b) => (b.disabled = true));

//   const isCorrect = selectedOption === questionData.correctAnswer;
//   const targetBox = document.getElementById('target-box');

//   if (targetBox) {
//     targetBox.textContent = selectedOption;
//     targetBox.style.color = isCorrect
//       ? 'var(--green-correct, green)'
//       : 'var(--red-wrong, red)';
//     targetBox.style.backgroundColor = 'transparent';
//     targetBox.style.fontSize = '3rem';
//   }

//   userAnswers.push({
//     question: questionData,
//     userSelected: selectedOption,
//     isCorrect: isCorrect,
//     fullCorrectWord: questionData.fullWord,
//   });

//   questionsAttempted++;
//   if (isCorrect) score++;

//   updateScore();

//   // Save progress immediately after answering
//   await saveProgressAPI();

//   nextBtn.classList.remove('hidden');
//   if (currentQIndex === questions.length - 1) {
//     nextBtn.textContent = 'Finish';
//     nextBtn.onclick = async () => {
//       await completeQuizAPI();
//       showSummary();
//     };
//   } else {
//     nextBtn.textContent = 'Next';
//     nextBtn.onclick = nextQuestion;
//   }
// }

// async function nextQuestion() {
//   currentQIndex++;
//   await saveProgressAPI();
//   if (currentQIndex < questions.length) {
//     loadQuestion(currentQIndex);
//   }
// }

// function showSummary() {
//   // 1. Hide Game Elements
//   gameArea.classList.add('hidden');
//   nextBtn.classList.add('hidden');

//   // 2. HIDE THE TITLE-TEXT (Instructions)
//   if (titleEl) {
//     titleEl.classList.add('hidden');
//   }

//   // 3. Show Summary Area
//   summaryArea.classList.remove('hidden');

//   finalScoreEl.textContent = `Final Score : ${score} / ${questions.length}`;
//   summaryList.innerHTML = '';

//   userAnswers.forEach((ans, i) => {
//     const div = document.createElement('div');
//     div.className = 'summary-item';
//     const userFormedWord = ans.question.puzzle.replace('_', ans.userSelected);

//     if (ans.isCorrect) {
//       div.innerHTML = `
//                 <span class="s-correct-num">${i + 1})</span>
//                 <span class="s-correct-text">${userFormedWord}</span>
//             `;
//     } else {
//       div.innerHTML = `
//                 <span class="s-num">${i + 1})</span>
//                 <span class="s-wrong-text">${userFormedWord}</span>
//                 <span class="s-bracket">(${ans.fullCorrectWord})</span>
//             `;
//     }
//     summaryList.appendChild(div);
//   });
// }

// finalNextBtn.addEventListener('click', function () {
//   const message = JSON.stringify({
//     done: true,
//     score: score,
//     total: questions.length,
//   });
//   window.parent.postMessage(message, '*');
// });

// initGame();