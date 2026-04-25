// // 1. Get Payload
// const urlParams = new URLSearchParams(window.location.search);
// let payloadData = {};

// try {
//   const rawPayload = urlParams.get('payload');
//   if (rawPayload) {
//     payloadData = JSON.parse(decodeURIComponent(rawPayload));
//   }
// } catch (e) {
//   console.error('Payload error', e);
// }

// // --- COLORS ---
// const WORD_COLORS = [
//   '#F48FB1', // Pink
//   '#90CAF9', // Blue
//   '#CE93D8', // Purple
//   '#80CBC4', // Teal
//   '#FFCC80', // Orange
//   '#B39DDB', // Deep Purple
// ];

// // 2. State
// let grid = [];
// let wordsData = [];
// let foundWords = [];
// let isSelecting = false;
// let startCell = null;
// let currentSelection = [];

// // DOM
// const titleEl = document.getElementById('activity-title');
// const gridEl = document.getElementById('word-grid');
// const wordListEl = document.getElementById('word-list');
// const scoreEl = document.getElementById('score-box');
// const hintBtn = document.getElementById('hint-btn');
// const nextBtn = document.getElementById('next-q-btn');
// const victoryToast = document.getElementById('victory-toast');

// // 3. Initialize
// function initGame() {
//   if (payloadData.title) titleEl.textContent = payloadData.title;

//   // Parse Words
//   if (payloadData.words) {
//     wordsData = payloadData.words.map((w) => ({
//       wordStr: w.word.join(''),
//       marker: w.marker, // [startRow, startCol, endRow, endCol]
//     }));
//     renderWordList();
//   }

//   // Parse Grid
//   parseGridData(payloadData.table);
//   renderGrid();
//   updateScore();
// }

// function parseGridData(tableData) {
//   if (Array.isArray(tableData)) {
//     if (Array.isArray(tableData[0])) {
//       grid = tableData;
//     } else {
//       grid = tableData.map((row) => row.split(''));
//     }
//   } else if (typeof tableData === 'string') {
//     const rows = tableData.replace(/\r/g, '').split('\n');
//     grid = rows.map((row) => row.split(''));
//   }
// }

// // 4. Render
// function renderGrid() {
//   gridEl.innerHTML = '';
//   const rows = grid.length;
//   const cols = grid[0].length;

//   gridEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

//   for (let r = 0; r < rows; r++) {
//     for (let c = 0; c < cols; c++) {
//       const cell = document.createElement('div');
//       cell.className = 'cell';
//       cell.textContent = grid[r][c];
//       cell.dataset.row = r;
//       cell.dataset.col = c;

//       // Events
//       cell.addEventListener('mousedown', handleStart);
//       cell.addEventListener('mouseenter', handleMove);
//       cell.addEventListener('touchstart', handleTouchStart, { passive: false });
//       cell.addEventListener('touchmove', handleTouchMove, { passive: false });

//       gridEl.appendChild(cell);
//     }
//   }

//   document.addEventListener('mouseup', handleEnd);
//   document.addEventListener('touchend', handleEnd);
// }

// function renderWordList() {
//   wordListEl.innerHTML = '';
//   wordsData.forEach((item) => {
//     const div = document.createElement('div');
//     div.className = 'word-item';
//     div.id = `word-${item.wordStr}`;
//     div.textContent = item.wordStr;
//     wordListEl.appendChild(div);
//   });
// }

// // 5. Interaction
// function handleStart(e) {
//   isSelecting = true;
//   startCell = e.target;
//   updateSelection(e.target);
// }

// function handleMove(e) {
//   if (!isSelecting) return;
//   updateSelection(e.target);
// }

// function handleTouchStart(e) {
//   e.preventDefault();
//   const touch = e.touches[0];
//   const target = document.elementFromPoint(touch.clientX, touch.clientY);
//   if (target && target.classList.contains('cell')) handleStart({ target });
// }

// function handleTouchMove(e) {
//   e.preventDefault();
//   const touch = e.touches[0];
//   const target = document.elementFromPoint(touch.clientX, touch.clientY);
//   if (target && target.classList.contains('cell')) handleMove({ target });
// }

// function handleEnd() {
//   if (!isSelecting) return;
//   isSelecting = false;
//   checkWord();
//   clearSelection();
// }

// function updateSelection(endCell) {
//   // Clear selection style (keep found)
//   document
//     .querySelectorAll('.cell.selected')
//     .forEach((c) => c.classList.remove('selected'));
//   currentSelection = [];

//   const r1 = parseInt(startCell.dataset.row);
//   const c1 = parseInt(startCell.dataset.col);
//   const r2 = parseInt(endCell.dataset.row);
//   const c2 = parseInt(endCell.dataset.col);

//   const dr = r2 - r1;
//   const dc = c2 - c1;

//   // Check diagonal/straight
//   if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
//     const steps = Math.max(Math.abs(dr), Math.abs(dc));
//     const rStep = dr === 0 ? 0 : dr / steps;
//     const cStep = dc === 0 ? 0 : dc / steps;

//     for (let i = 0; i <= steps; i++) {
//       const r = r1 + i * rStep;
//       const c = c1 + i * cStep;
//       const cell = document.querySelector(
//         `.cell[data-row="${r}"][data-col="${c}"]`
//       );
//       if (cell) {
//         cell.classList.add('selected'); // This adds the border only
//         currentSelection.push(cell);
//       }
//     }
//   }
// }

// function clearSelection() {
//   document
//     .querySelectorAll('.cell.selected')
//     .forEach((c) => c.classList.remove('selected'));
//   currentSelection = [];
//   startCell = null;
// }

// function checkWord() {
//   const selectedWord = currentSelection.map((c) => c.textContent).join('');
//   const reverseWord = selectedWord.split('').reverse().join('');

//   // Check match
//   const targetObj = wordsData.find(
//     (w) => w.wordStr === selectedWord || w.wordStr === reverseWord
//   );

//   if (targetObj && !foundWords.includes(targetObj.wordStr)) {
//     markFound(targetObj.wordStr);
//   }
// }

// function markFound(wordStr) {
//   foundWords.push(wordStr);

//   // Pick next color
//   const color = WORD_COLORS[(foundWords.length - 1) % WORD_COLORS.length];

//   // Style the cells
//   currentSelection.forEach((cell, index) => {
//     cell.classList.add('found');
//     cell.classList.remove('selected');
//     cell.style.backgroundColor = color;

//     // --- Rounded Ends Logic ---
//     // Horizontal
//     if (
//       currentSelection[1] &&
//       currentSelection[0].dataset.row === currentSelection[1].dataset.row
//     ) {
//       if (index === 0) cell.style.borderRadius = '50% 0 0 50%';
//       if (index === currentSelection.length - 1)
//         cell.style.borderRadius = '0 50% 50% 0';
//     }
//     // Vertical
//     else if (
//       currentSelection[1] &&
//       currentSelection[0].dataset.col === currentSelection[1].dataset.col
//     ) {
//       if (index === 0) cell.style.borderRadius = '50% 50% 0 0';
//       if (index === currentSelection.length - 1)
//         cell.style.borderRadius = '0 0 50% 50%';
//     }
//     // Diagonal: Just standard rounded corners for start/end
//     else {
//       if (index === 0 || index === currentSelection.length - 1) {
//         cell.style.borderRadius = '30%';
//       }
//     }
//   });

//   // Mark List
//   const listItem = document.getElementById(`word-${wordStr}`);
//   if (listItem) listItem.classList.add('found');

//   updateScore();

//   // Check Win
//   if (foundWords.length === wordsData.length) {
//     hintBtn.classList.add('hidden');
//     nextBtn.classList.remove('hidden'); // Show Next button
//     victoryToast.classList.remove('hidden'); // Show small message
//   }
// }

// // 6. HINT LOGIC (Fixed)
// // 6. IMPROVED HINT LOGIC
// // 6. CORRECTED HINT LOGIC (Deterministic + Fixed Coordinates)
// hintBtn.addEventListener('click', function () {
//   // 1. Find the FIRST word that hasn't been found yet (No Randomness)
//   const targetWordObj = wordsData.find((w) => !foundWords.includes(w.wordStr));

//   if (!targetWordObj) return; // All words found

//   // 2. Extract Coordinates CORRECTLY
//   // Your JSON format is [Col, Row, ColEnd, RowEnd]
//   const c = targetWordObj.marker[0]; // Index 0 is Column (x)
//   const r = targetWordObj.marker[1]; // Index 1 is Row (y)

//   // 3. Select the specific cell
//   const cell = document.querySelector(
//     `.cell[data-row="${r}"][data-col="${c}"]`
//   );

//   // 4. Trigger the Pop-up Animation
//   if (cell) {
//     // Reset animation so it plays again if clicked multiple times
//     cell.classList.remove('hint-active');
//     void cell.offsetWidth; // Force browser to repaint (magic trick for restarting animation)
//     cell.classList.add('hint-active');

//     // Remove the highlight after 1.5 seconds
//     setTimeout(() => {
//       cell.classList.remove('hint-active');
//     }, 1500);
//   }

//   // 5. Flash the word in the list so the user knows WHICH word to look for
//   const wordListItem = document.getElementById(`word-${targetWordObj.wordStr}`);
//   if (wordListItem) {
//     wordListItem.style.transition = '0.3s';
//     wordListItem.style.backgroundColor = '#ffd700';
//     wordListItem.style.transform = 'scale(1.1)';
//     wordListItem.style.fontWeight = 'bold';

//     setTimeout(() => {
//       wordListItem.style.backgroundColor = '';
//       wordListItem.style.transform = '';
//       wordListItem.style.fontWeight = '';
//     }, 1500);
//   }
// });
// function updateScore() {
//   scoreEl.textContent = `Score: ${foundWords.length} / ${wordsData.length}`;
// }

// // Final Navigation
// nextBtn.addEventListener('click', function () {
//   const message = JSON.stringify({
//     done: true,
//     score: foundWords.length,
//     total: wordsData.length,
//   });
//   window.parent.postMessage(message, '*');
// });

// initGame();
// 1. Get Payload
const urlParams = new URLSearchParams(window.location.search);
let payloadData = {};

try {
  const rawPayload = urlParams.get('payload');
  if (rawPayload) {
    payloadData = JSON.parse(decodeURIComponent(rawPayload));
  }
} catch (e) {
  console.error('Payload error', e);
}

// --- COLORS ---
const WORD_COLORS = [
  '#F48FB1', // Pink
  '#90CAF9', // Blue
  '#CE93D8', // Purple
  '#80CBC4', // Teal
  '#FFCC80', // Orange
  '#B39DDB', // Deep Purple
];

// 2. State
let grid = [];
let wordsData = [];
let foundWords = [];
let isSelecting = false;
let startCell = null;
let currentSelection = [];

// DOM
const titleEl = document.getElementById('activity-title');
const gridEl = document.getElementById('word-grid');
const wordListEl = document.getElementById('word-list');
const scoreEl = document.getElementById('score-box');
const hintBtn = document.getElementById('hint-btn');
const nextBtn = document.getElementById('next-q-btn');
const victoryToast = document.getElementById('victory-toast');

// 3. Initialize
function initGame() {
  if (payloadData.title) titleEl.textContent = payloadData.title;

  // Parse Words
  if (payloadData.words) {
    wordsData = payloadData.words.map((w) => ({
      wordStr: w.word.join(''),
      marker: w.marker, // [startRow, startCol, endRow, endCol]
    }));
    renderWordList();
  }

  // Parse Grid
  parseGridData(payloadData.table);
  renderGrid();
  updateScore();
}

function parseGridData(tableData) {
  if (Array.isArray(tableData)) {
    if (Array.isArray(tableData[0])) {
      grid = tableData;
    } else {
      grid = tableData.map((row) => row.split(''));
    }
  } else if (typeof tableData === 'string') {
    const rows = tableData.replace(/\r/g, '').split('\n');
    grid = rows.map((row) => row.split(''));
  }
}

// 4. Render
function renderGrid() {
  gridEl.innerHTML = '';
  const rows = grid.length;
  const cols = grid[0].length;

  gridEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = grid[r][c];
      cell.dataset.row = r;
      cell.dataset.col = c;

      // Events
      cell.addEventListener('mousedown', handleStart);
      cell.addEventListener('mouseenter', handleMove);
      cell.addEventListener('touchstart', handleTouchStart, { passive: false });
      cell.addEventListener('touchmove', handleTouchMove, { passive: false });

      gridEl.appendChild(cell);
    }
  }

  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchend', handleEnd);
}

function renderWordList() {
  wordListEl.innerHTML = '';
  wordsData.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'word-item';
    div.id = `word-${item.wordStr}`;
    div.textContent = item.wordStr;
    wordListEl.appendChild(div);
  });
}

// 5. Interaction
function handleStart(e) {
  isSelecting = true;
  startCell = e.target;
  updateSelection(e.target);
}

function handleMove(e) {
  if (!isSelecting) return;
  updateSelection(e.target);
}

function handleTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  if (target && target.classList.contains('cell')) handleStart({ target });
}

function handleTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  if (target && target.classList.contains('cell')) handleMove({ target });
}

function handleEnd() {
  if (!isSelecting) return;
  isSelecting = false;
  checkWord();
  clearSelection();
}

function updateSelection(endCell) {
  // Clear selection style (keep found)
  document
    .querySelectorAll('.cell.selected')
    .forEach((c) => c.classList.remove('selected'));
  currentSelection = [];

  const r1 = parseInt(startCell.dataset.row);
  const c1 = parseInt(startCell.dataset.col);
  const r2 = parseInt(endCell.dataset.row);
  const c2 = parseInt(endCell.dataset.col);

  const dr = r2 - r1;
  const dc = c2 - c1;

  // Check diagonal/straight
  if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    const rStep = dr === 0 ? 0 : dr / steps;
    const cStep = dc === 0 ? 0 : dc / steps;

    for (let i = 0; i <= steps; i++) {
      const r = r1 + i * rStep;
      const c = c1 + i * cStep;
      const cell = document.querySelector(
        `.cell[data-row="${r}"][data-col="${c}"]`
      );
      if (cell) {
        cell.classList.add('selected'); // This adds the border only
        currentSelection.push(cell);
      }
    }
  }
}

function clearSelection() {
  document
    .querySelectorAll('.cell.selected')
    .forEach((c) => c.classList.remove('selected'));
  currentSelection = [];
  startCell = null;
}

function checkWord() {
  const selectedWord = currentSelection.map((c) => c.textContent).join('');
  const reverseWord = selectedWord.split('').reverse().join('');

  // Check match
  const targetObj = wordsData.find(
    (w) => w.wordStr === selectedWord || w.wordStr === reverseWord
  );

  if (targetObj && !foundWords.includes(targetObj.wordStr)) {
    markFound(targetObj.wordStr);
  }
}

// --- NEW FUNCTION: DRAW LINE CAPSULE ---
function drawLine(startCell, endCell, color) {
  const gridRect = gridEl.getBoundingClientRect();
  const startRect = startCell.getBoundingClientRect();
  const endRect = endCell.getBoundingClientRect();

  // 1. Calculate centers relative to the grid container
  const x1 = startRect.left - gridRect.left + startRect.width / 2;
  const y1 = startRect.top - gridRect.top + startRect.height / 2;
  const x2 = endRect.left - gridRect.left + endRect.width / 2;
  const y2 = endRect.top - gridRect.top + endRect.height / 2;

  // 2. Calculate distance and angle
  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

  // 3. Calculate midpoint
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // 4. Create Line
  const line = document.createElement('div');
  line.className = 'highlight-line';

  // Length + 1 Cell width (34px) so it rounds over the first and last letter
  line.style.width = `${length + 34}px`;
  line.style.backgroundColor = color;

  // Position
  line.style.left = `${midX}px`;
  line.style.top = `${midY}px`;
  line.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

  gridEl.appendChild(line);
}

// --- UPDATED: MARK FOUND LOGIC ---
function markFound(wordStr) {
  foundWords.push(wordStr);

  // Pick next color
  const color = WORD_COLORS[(foundWords.length - 1) % WORD_COLORS.length];

  // 1. Draw the smooth line
  const startCell = currentSelection[0];
  const endCell = currentSelection[currentSelection.length - 1];
  drawLine(startCell, endCell, color);

  // 2. Style the cells (Just turn text white, remove selection border)
  currentSelection.forEach((cell) => {
    cell.classList.add('found');
    cell.classList.remove('selected');
    // Note: We NO LONGER set background-color or border-radius on the cell here.
    // The line drawn above handles the visual background.
  });

  // Mark List
  const listItem = document.getElementById(`word-${wordStr}`);
  if (listItem) listItem.classList.add('found');

  updateScore();

  // Check Win
  if (foundWords.length === wordsData.length) {
    hintBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden'); // Show Next button
    victoryToast.classList.remove('hidden'); // Show small message
  }
}

// 6. HINT LOGIC (Deterministic + Fixed Coordinates)
hintBtn.addEventListener('click', function () {
  // 1. Find the FIRST word that hasn't been found yet
  const targetWordObj = wordsData.find((w) => !foundWords.includes(w.wordStr));

  if (!targetWordObj) return;

  // 2. Extract Coordinates (JSON is [Col, Row])
  const c = targetWordObj.marker[0];
  const r = targetWordObj.marker[1];

  // 3. Select cell
  const cell = document.querySelector(
    `.cell[data-row="${r}"][data-col="${c}"]`
  );

  // 4. Animation
  if (cell) {
    cell.classList.remove('hint-active');
    void cell.offsetWidth; // Trigger reflow
    cell.classList.add('hint-active');

    setTimeout(() => {
      cell.classList.remove('hint-active');
    }, 1500);
  }

  // 5. Flash Word List
  const wordListItem = document.getElementById(`word-${targetWordObj.wordStr}`);
  if (wordListItem) {
    wordListItem.style.transition = '0.3s';
    wordListItem.style.backgroundColor = '#ffd700';
    wordListItem.style.transform = 'scale(1.1)';
    wordListItem.style.fontWeight = 'bold';

    setTimeout(() => {
      wordListItem.style.backgroundColor = '';
      wordListItem.style.transform = '';
      wordListItem.style.fontWeight = '';
    }, 1500);
  }
});

function updateScore() {
  scoreEl.textContent = `Score: ${foundWords.length} / ${wordsData.length}`;
}

// Final Navigation
nextBtn.addEventListener('click', function () {
  const message = JSON.stringify({
    done: true,
    score: foundWords.length,
    total: wordsData.length,
  });
  window.parent.postMessage(message, '*');
});

initGame();
