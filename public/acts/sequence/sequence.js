
(function () {
  // ---------------------------------------------------
  // 1. ORACLE API INTEGRATION
  // ---------------------------------------------------
  const API_BASE = 'http://localhost:8080/ords/lms/sequence';

  const getUserId = () => {
    const uid = localStorage.getItem('user_id');
    return uid ? parseInt(uid, 10) : null;
  };

  // Helper: Auto-Generate ID (Numbers Only)
  function generateUniqueId(title, text) {
      const source = (title || "") + (text || "");
      let hash = 0;
      for (let i = 0; i < source.length; i++) {
          hash = ((hash << 5) - hash) + source.charCodeAt(i);
          hash |= 0;
      }
      return Math.abs(hash).toString();
  }

  async function loadSequenceProgress(activityId) {
    const userId = getUserId();
    if (!userId) return null;

    try {
      const res = await fetch(`${API_BASE}/progress/${userId}/${activityId}?t=${new Date().getTime()}`);
      if (!res.ok) return null;
      
      const text = await res.text();
      if (!text || text.includes('empty') || text.includes('error')) return null;
      
      return JSON.parse(text); 
    } catch (e) {
      console.error("Load Error", e);
      return null;
    }
  }

  async function saveSequenceProgress(activityId, history, score, totalRounds) {
    const userId = getUserId();
    if (!userId) return; 

    try {
      await fetch(`${API_BASE}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          activity_id: activityId,
          progress_json: JSON.stringify({ history: history }), // Saving round history
          score: score,
          attempted: totalRounds,
          status: 'IN_PROGRESS'
        })
      });
    } catch (e) {
      console.error("Save Error", e);
    }
  }

  async function completeSequenceActivity(activityId, finalScore, totalRounds) {
    console.log("🚀 Completing Sequence Activity...");
    const userId = getUserId();
    if (!userId) {
        console.error("❌ SAVE FAILED: User ID is missing.");
        return;
    }

    try {
      const response = await fetch(`${API_BASE}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          activity_id: activityId,
          score: finalScore,
          attempted: totalRounds
        })
      });
      const res = await response.json();
      console.log("✅ Saved to Oracle:", res);
    } catch (e) {
      console.error("Complete Error", e);
    }
  }

  // ---------------------------------------------------
  // APP LOGIC
  // ---------------------------------------------------

  const app = {
    activityId: "seq_default",
    queue: [], 
    currentRound: null,
    history: [], 
    blocks: [],
    connections: [],
    isDrawing: false,
    startBlockIndex: -1,
    canvasRect: null,
    
    // Scoring
    hasUsedHint: false,
    hasGivenUp: false,
    isReadOnly: false // Lock flag
  };

  async function init() {
    const payload = getPayloadFromURL();
    const dataToLoad = payload || {
       data: { title: "Demo", text: "Test, One\nTest, Two" }
    };

    // --- 1. GENERATE ID ---
    const rawTitle = (dataToLoad.data && dataToLoad.data.title) ? dataToLoad.data.title : (dataToLoad.title || "Sequence Game");
    let rawText = "";
    if (dataToLoad.data && dataToLoad.data.text) rawText = dataToLoad.data.text;
    else if (dataToLoad.text) rawText = dataToLoad.text;

    if (payload && payload.id) {
        app.activityId = payload.id;
    } else {
        app.activityId = generateUniqueId(rawTitle, rawText);
        console.log("🆔 Auto-Generated Activity ID:", app.activityId);
    }

    processData(dataToLoad);
    setupEventListeners();

    // --- 2. CHECK ORACLE STATUS ---
    const savedData = await loadSequenceProgress(app.activityId);

    if (savedData) {
        console.log("📥 Loaded Data:", savedData);
        
        // If Completed, Show Final Screen Immediately
        if (savedData.status === 'COMPLETED') {
             console.log("🔒 Exam Completed. Locking UI.");
             app.isReadOnly = true; 
             
             // Restore history from JSON to show in summary
             if (savedData.data && savedData.data.history) {
                 app.history = savedData.data.history;
             }
             
             finishGame(); // Jump straight to summary
             return; 
        } 
        
        // If In Progress, you might want to restore history (optional for Sequence game logic)
        // For now, we start fresh rounds but could potentially skip rounds already done.
    }

    loadNextRound();
  }

  function getPayloadFromURL() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const p = urlParams.get('payload');
      if (p) return JSON.parse(decodeURIComponent(p));
    } catch (e) { console.error(e); }
    return null;
  }

  function processData(payload) {
    const title = (payload.data && payload.data.title) ? payload.data.title : (payload.title || "Sequence Game");
    const tEl = document.getElementById('title');
    if(tEl) tEl.innerText = title;

    let rawText = "";
    if (payload.data && payload.data.text) rawText = payload.data.text;
    else if (payload.text) rawText = payload.text;

    const lines = rawText.split('\n').filter(line => line.trim().length > 0);

    app.queue = lines.map(line => {
      const cleanLine = line.trim();
      let chunks = [];
      if (cleanLine.includes(' ')) {
        chunks = cleanLine.split(/\s+/).filter(Boolean); 
      } else if (cleanLine.includes(',')) {
        chunks = cleanLine.split(',').map(s => s.trim());
      } else {
        try {
          const segmenter = new Intl.Segmenter('hi', { granularity: 'grapheme' });
          chunks = Array.from(segmenter.segment(cleanLine)).map(s => s.segment);
        } catch (e) { chunks = cleanLine.split(''); }
      }
      return { fullText: cleanLine, chunks: chunks };
    });
  }

  function loadNextRound() {
    // If no words left, show Final Screen
    if (app.queue.length === 0) {
      finishGame();
      // SAVE COMPLETION
      let totalScore = 0;
      app.history.forEach(h => totalScore += h.score);
      completeSequenceActivity(app.activityId, totalScore, app.history.length);
      return;
    }

    // Reset State
    app.currentRound = app.queue.shift();
    app.connections = [];
    app.blocks = [];
    app.isDrawing = false;
    app.startBlockIndex = -1;
    app.hasUsedHint = false;
    app.hasGivenUp = false;

    // UI Updates
    document.getElementById('scoreBox').innerText = `Remaining: ${app.queue.length + 1}`;
    document.getElementById('scoreBox').style.display = 'block'; 
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('resultBox').innerText = '';
    
    // Enable controls
    const hintBtn = document.getElementById('hintBtn');
    if(hintBtn) hintBtn.disabled = false;
    
    const giveUpBtn = document.getElementById('giveUpBtn');
    if(giveUpBtn) giveUpBtn.disabled = false;
    
    // Clear Canvas
    const canvas = document.getElementById('canvasArea');
    const svg = document.getElementById('svgLayer');
    while (canvas.lastChild && canvas.lastChild !== svg) {
      canvas.removeChild(canvas.lastChild);
    }
    svg.innerHTML = '';

    updateCanvasRect();
    spawnBlocks();
  }

  function spawnBlocks() {
    const canvas = document.getElementById('canvasArea');
    const chunks = app.currentRound.chunks;
    const existingPositions = []; 

    chunks.forEach((text, index) => {
      const el = document.createElement('div');
      el.className = 'word-block';
      el.innerText = text;
      el.dataset.index = index;
      
      const blockW = 80; 
      const blockH = 60;
      const padding = 20;
      const maxW = app.canvasRect.width - blockW - padding;
      const maxH = app.canvasRect.height - blockH - padding;

      // Collision Detection Loop
      let attempts = 0;
      let x, y, safe;
      
      do {
        safe = true;
        x = Math.random() * (maxW - padding) + padding;
        y = Math.random() * (maxH - padding) + padding;

        for (let pos of existingPositions) {
          const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
          if (dist < 90) { 
            safe = false;
            break;
          }
        }
        attempts++;
      } while (!safe && attempts < 50);

      existingPositions.push({ x, y });

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;

      el.addEventListener('mousedown', (e) => startDrawing(e, index));
      el.addEventListener('touchstart', (e) => startDrawing(e, index));

      canvas.appendChild(el);
      app.blocks.push(el);
    });
  }

  function startDrawing(e, index) {
    if(document.getElementById('nextBtn').style.display !== 'none') return; 
    e.preventDefault();

    const lastConnected = app.connections.length > 0 ? app.connections[app.connections.length - 1] : -1;
    
    let validStart = false;
    if (app.connections.length === 0 && index === 0) validStart = true;
    else if (lastConnected === index) validStart = true;

    if (!validStart) {
      shakeBlock(app.blocks[index]);
      return;
    }

    app.isDrawing = true;
    app.startBlockIndex = index;
    createTempLine();
    app.blocks[index].classList.add('active');
  }

  function handleGlobalMouseMove(e) {
    if (!app.isDrawing) return;
    const point = getEventPoint(e);
    const line = document.getElementById('temp-line');
    
    if (line && app.canvasRect) {
      const startEl = app.blocks[app.startBlockIndex];
      const sRect = startEl.getBoundingClientRect();
      const x1 = (sRect.left + sRect.width/2) - app.canvasRect.left;
      const y1 = (sRect.top + sRect.height/2) - app.canvasRect.top;
      const x2 = point.client_x - app.canvasRect.left;
      const y2 = point.client_y - app.canvasRect.top;
      line.setAttribute('x1', x1); line.setAttribute('y1', y1); line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    }
  }

  function handleGlobalMouseUp(e) {
    if (!app.isDrawing) return;
    app.isDrawing = false;
    const line = document.getElementById('temp-line');
    if(line) line.remove();
    if(app.startBlockIndex > -1) app.blocks[app.startBlockIndex].classList.remove('active');

    const point = getEventPoint(e);
    const targetIndex = findBlockUnderPoint(point.client_x, point.client_y);

    if (targetIndex !== -1 && targetIndex !== app.startBlockIndex) {
      validateConnection(app.startBlockIndex, targetIndex);
    }
  }

  function validateConnection(from, to) {
    if (to === from + 1) {
      app.connections.push(to);
      drawPermanentLine(from, to);
      if (app.connections.length === app.blocks.length - 1) {
        animateCompletion();
      }
    } else {
      shakeBlock(app.blocks[to]);
    }
  }

  function animateCompletion() {
    document.getElementById('svgLayer').innerHTML = ''; 

    // Calculate Score (Max 1)
    let score = 1;
    let status = "perfect";
    if (app.hasGivenUp) { score = 0; status = "fail"; }
    else if (app.hasUsedHint) { score = 0.5; status = "hint"; }

    app.history.push({
      text: app.currentRound.fullText,
      status: status,
      score: score
    });

    // --- SAVE PROGRESS (Per Round) ---
    // Note: We send total rounds attempted so far
    let totalScore = 0;
    app.history.forEach(h => totalScore += h.score);
    saveSequenceProgress(app.activityId, app.history, totalScore, app.history.length);
    // ---------------------------------

    let totalWidth = 0;
    const gap = 10;
    app.blocks.forEach(b => { totalWidth += b.offsetWidth + gap; });
    let currentX = (app.canvasRect.width - totalWidth) / 2;
    const centerY = (app.canvasRect.height / 2) - 22;

    app.blocks.forEach((block) => {
      block.style.left = `${currentX}px`;
      block.style.top = `${centerY}px`;
      block.classList.add('completed');
      currentX += block.offsetWidth + gap;
    });

    const msg = app.hasGivenUp ? "Solution Shown" : "Good Job!";
    document.getElementById('resultBox').innerText = msg;
    document.getElementById('nextBtn').style.display = 'inline-block';
    
    document.getElementById('hintBtn').disabled = true;
    document.getElementById('giveUpBtn').disabled = true;
  }

  function finishGame() {

    // Lift result screen to top
document.querySelector('.container')?.classList.add('show-results');

    // Hide Game UI
    const canvasArea = document.getElementById('canvasArea');
    if(canvasArea) canvasArea.style.display = 'none';
    
    const gameControls = document.getElementById('gameControls');
    if(gameControls) gameControls.style.display = 'none';
    
    const resBox = document.getElementById('resultBox');
    if(resBox) resBox.style.display = 'none';
    
    // Hide Remaining Count
    const scoreBox = document.getElementById('scoreBox');
    if(scoreBox) scoreBox.style.display = 'none';

     const headerRow = document.getElementById('headerRow');
  if(headerRow) headerRow.style.display = 'none';

    // Show Final Screen
    const finalScreen = document.getElementById('finalScreen');
    if(finalScreen) finalScreen.style.display = 'flex';
    
    const scoreDisplay = document.getElementById('finalScoreDisplay');
    const list = document.getElementById('resultDetails');
    
    let totalScore = 0;
    let html = "";
    
    if (app.history && app.history.length > 0) {
        app.history.forEach(item => {
          totalScore += item.score;
          let statusClass = "status-perfect";
          if(item.status === 'hint') statusClass = "status-hint";
          if(item.status === 'fail') statusClass = "status-fail";

          html += `
            <div class="result-item">
              <span>${item.text.substring(0, 30)}${item.text.length > 30 ? '...' : ''}</span>
              <span class="points ${statusClass}">${item.score}</span>
            </div>
          `;
        });
        
        if(scoreDisplay) scoreDisplay.innerText = `${totalScore} / ${app.history.length}`;
        if(list) list.innerHTML = html;
        
        // If ReadOnly mode, hide "Finish" button if you don't want them re-submitting
        // or change text to "Close"
        if(app.isReadOnly) {
             const finBtn = document.getElementById('finishBtn');
             if(finBtn) finBtn.innerText = "Next";
        }
    } else {
        if(list) list.innerHTML = "<div>No data available.</div>";
    }
  }

  function triggerNextExercise() {
    try {
        window.parent.postMessage(JSON.stringify({ done: true }), '*');
        console.log("Navigating to next exercise...");
    } catch(e) {
        console.log("Cannot post message to parent");
    }
  }

  // Utilities
  function createTempLine() {
    const svg = document.getElementById('svgLayer');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.id = 'temp-line';
    line.setAttribute('stroke', '#60a5fa');
    line.setAttribute('stroke-width', '4');
    line.setAttribute('stroke-dasharray', '5,5');
    svg.appendChild(line);
  }

  function drawPermanentLine(from, to) {
    const svg = document.getElementById('svgLayer');
    const r1 = app.blocks[from].getBoundingClientRect();
    const r2 = app.blocks[to].getBoundingClientRect();
    const x1 = (r1.left + r1.width/2) - app.canvasRect.left;
    const y1 = (r1.top + r1.height/2) - app.canvasRect.top;
    const x2 = (r2.left + r2.width/2) - app.canvasRect.left;
    const y2 = (r2.top + r2.height/2) - app.canvasRect.top;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1); line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#ef4444'); line.setAttribute('stroke-width', '4');
    svg.appendChild(line);
  }

  function findBlockUnderPoint(x, y) {
    for (let i = 0; i < app.blocks.length; i++) {
      const rect = app.blocks[i].getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return i;
    }
    return -1;
  }

  function shakeBlock(el) {
    el.style.transform = "translateX(5px)";
    setTimeout(() => el.style.transform = "translateX(-5px)", 50);
    setTimeout(() => el.style.transform = "none", 150);
  }

  function updateCanvasRect() {
    const c = document.getElementById('canvasArea');
    if(c) app.canvasRect = c.getBoundingClientRect();
  }

  function getEventPoint(e) {
    if (e.touches && e.touches.length > 0) return { client_x: e.touches[0].clientX, client_y: e.touches[0].clientY };
    return { client_x: e.clientX, client_y: e.clientY };
  }

  function setupEventListeners() {
    window.addEventListener('resize', updateCanvasRect);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('touchmove', handleGlobalMouseMove, { passive: false });
    
    // SAFE BINDINGS
    const nextBtn = document.getElementById('nextBtn');
    if(nextBtn) nextBtn.onclick = loadNextRound;
    
    const finishBtn = document.getElementById('finishBtn');
    if(finishBtn) finishBtn.onclick = triggerNextExercise;

    const giveUpBtn = document.getElementById('giveUpBtn');
    if(giveUpBtn) {
        giveUpBtn.onclick = () => {
          if (app.isReadOnly) return;
          app.hasGivenUp = true;
          for(let i=0; i<app.blocks.length-1; i++) {
              if (!app.connections.includes(i+1)) {
                  app.connections.push(i+1);
                  drawPermanentLine(i, i+1);
              }
          }
          animateCompletion();
        };
    }

    const hintBtn = document.getElementById('hintBtn');
    if(hintBtn) {
        hintBtn.onclick = () => {
          if (app.isReadOnly) return;
          app.hasUsedHint = true;
          const nextIdx = app.connections.length === 0 ? 0 : app.connections[app.connections.length - 1] + 1;
          if (app.blocks[nextIdx]) {
             const el = app.blocks[nextIdx];
             el.style.transform = "scale(1.2)";
             el.style.borderColor = "orange";
             setTimeout(() => {
                 el.style.transform = "";
                 el.style.borderColor = "";
             }, 500);
          }
        };
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
























// (function () {
//   const app = {
//     queue: [], 
//     currentRound: null,
//     history: [], 
//     blocks: [],
//     connections: [],
//     isDrawing: false,
//     startBlockIndex: -1,
//     canvasRect: null,
    
//     // Scoring
//     hasUsedHint: false,
//     hasGivenUp: false
//   };

//   function init() {
//     const payload = getPayloadFromURL();
//     const dataToLoad = payload || {
//        data: { title: "Demo", text: "Test, One\nTest, Two" }
//     };

//     processData(dataToLoad);
//     setupEventListeners();
//     loadNextRound();
//   }

//   function getPayloadFromURL() {
//     try {
//       const urlParams = new URLSearchParams(window.location.search);
//       const p = urlParams.get('payload');
//       if (p) return JSON.parse(decodeURIComponent(p));
//     } catch (e) { console.error(e); }
//     return null;
//   }

//   function processData(payload) {
//     const title = (payload.data && payload.data.title) ? payload.data.title : (payload.title || "Sequence Game");
//     document.getElementById('title').innerText = title;

//     let rawText = "";
//     if (payload.data && payload.data.text) rawText = payload.data.text;
//     else if (payload.text) rawText = payload.text;

//     const lines = rawText.split('\n').filter(line => line.trim().length > 0);

//     app.queue = lines.map(line => {
//       const cleanLine = line.trim();
//       let chunks = [];
//       if (cleanLine.includes(' ')) {
//         chunks = cleanLine.split(/\s+/).filter(Boolean); 
//       } else if (cleanLine.includes(',')) {
//         chunks = cleanLine.split(',').map(s => s.trim());
//       } else {
//         try {
//           const segmenter = new Intl.Segmenter('hi', { granularity: 'grapheme' });
//           chunks = Array.from(segmenter.segment(cleanLine)).map(s => s.segment);
//         } catch (e) { chunks = cleanLine.split(''); }
//       }
//       return { fullText: cleanLine, chunks: chunks };
//     });
//   }

//   function loadNextRound() {
//     // If no words left, show Final Screen
//     if (app.queue.length === 0) {
//       finishGame();
//       return;
//     }

//     // Reset State
//     app.currentRound = app.queue.shift();
//     app.connections = [];
//     app.blocks = [];
//     app.isDrawing = false;
//     app.startBlockIndex = -1;
//     app.hasUsedHint = false;
//     app.hasGivenUp = false;

//     // UI Updates
//     document.getElementById('scoreBox').innerText = `Remaining: ${app.queue.length + 1}`;
//     document.getElementById('scoreBox').style.display = 'block'; // Ensure visible
//     document.getElementById('nextBtn').style.display = 'none';
//     document.getElementById('resultBox').innerText = '';
    
//     // Enable controls
//     document.getElementById('hintBtn').disabled = false;
//     document.getElementById('giveUpBtn').disabled = false;
    
//     // Clear Canvas
//     const canvas = document.getElementById('canvasArea');
//     const svg = document.getElementById('svgLayer');
//     while (canvas.lastChild && canvas.lastChild !== svg) {
//       canvas.removeChild(canvas.lastChild);
//     }
//     svg.innerHTML = '';

//     updateCanvasRect();
//     spawnBlocks();
//   }

//   function spawnBlocks() {
//     const canvas = document.getElementById('canvasArea');
//     const chunks = app.currentRound.chunks;
//     const existingPositions = []; 

//     chunks.forEach((text, index) => {
//       const el = document.createElement('div');
//       el.className = 'word-block';
//       el.innerText = text;
//       el.dataset.index = index;
      
//       const blockW = 80; 
//       const blockH = 60;
//       const padding = 20;
//       const maxW = app.canvasRect.width - blockW - padding;
//       const maxH = app.canvasRect.height - blockH - padding;

//       // Collision Detection Loop
//       let attempts = 0;
//       let x, y, safe;
      
//       do {
//         safe = true;
//         x = Math.random() * (maxW - padding) + padding;
//         y = Math.random() * (maxH - padding) + padding;

//         for (let pos of existingPositions) {
//           const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
//           if (dist < 90) { 
//             safe = false;
//             break;
//           }
//         }
//         attempts++;
//       } while (!safe && attempts < 50);

//       existingPositions.push({ x, y });

//       el.style.left = `${x}px`;
//       el.style.top = `${y}px`;

//       el.addEventListener('mousedown', (e) => startDrawing(e, index));
//       el.addEventListener('touchstart', (e) => startDrawing(e, index));

//       canvas.appendChild(el);
//       app.blocks.push(el);
//     });
//   }

//   function startDrawing(e, index) {
//     if(document.getElementById('nextBtn').style.display !== 'none') return; 
//     e.preventDefault();

//     const lastConnected = app.connections.length > 0 ? app.connections[app.connections.length - 1] : -1;
    
//     let validStart = false;
//     if (app.connections.length === 0 && index === 0) validStart = true;
//     else if (lastConnected === index) validStart = true;

//     if (!validStart) {
//       shakeBlock(app.blocks[index]);
//       return;
//     }

//     app.isDrawing = true;
//     app.startBlockIndex = index;
//     createTempLine();
//     app.blocks[index].classList.add('active');
//   }

//   function handleGlobalMouseMove(e) {
//     if (!app.isDrawing) return;
//     const point = getEventPoint(e);
//     const line = document.getElementById('temp-line');
    
//     if (line && app.canvasRect) {
//       const startEl = app.blocks[app.startBlockIndex];
//       const sRect = startEl.getBoundingClientRect();
//       const x1 = (sRect.left + sRect.width/2) - app.canvasRect.left;
//       const y1 = (sRect.top + sRect.height/2) - app.canvasRect.top;
//       const x2 = point.client_x - app.canvasRect.left;
//       const y2 = point.client_y - app.canvasRect.top;
//       line.setAttribute('x1', x1); line.setAttribute('y1', y1); line.setAttribute('x2', x2); line.setAttribute('y2', y2);
//     }
//   }

//   function handleGlobalMouseUp(e) {
//     if (!app.isDrawing) return;
//     app.isDrawing = false;
//     const line = document.getElementById('temp-line');
//     if(line) line.remove();
//     if(app.startBlockIndex > -1) app.blocks[app.startBlockIndex].classList.remove('active');

//     const point = getEventPoint(e);
//     const targetIndex = findBlockUnderPoint(point.client_x, point.client_y);

//     if (targetIndex !== -1 && targetIndex !== app.startBlockIndex) {
//       validateConnection(app.startBlockIndex, targetIndex);
//     }
//   }

//   function validateConnection(from, to) {
//     if (to === from + 1) {
//       app.connections.push(to);
//       drawPermanentLine(from, to);
//       if (app.connections.length === app.blocks.length - 1) {
//         animateCompletion();
//       }
//     } else {
//       shakeBlock(app.blocks[to]);
//     }
//   }

//   function animateCompletion() {
//     document.getElementById('svgLayer').innerHTML = ''; 

//     // Calculate Score (Max 1)
//     let score = 1;
//     let status = "perfect";
//     if (app.hasGivenUp) { score = 0; status = "fail"; }
//     else if (app.hasUsedHint) { score = 0.5; status = "hint"; }

//     app.history.push({
//       text: app.currentRound.fullText,
//       status: status,
//       score: score
//     });

//     let totalWidth = 0;
//     const gap = 10;
//     app.blocks.forEach(b => { totalWidth += b.offsetWidth + gap; });
//     let currentX = (app.canvasRect.width - totalWidth) / 2;
//     const centerY = (app.canvasRect.height / 2) - 22;

//     app.blocks.forEach((block) => {
//       block.style.left = `${currentX}px`;
//       block.style.top = `${centerY}px`;
//       block.classList.add('completed');
//       currentX += block.offsetWidth + gap;
//     });

//     const msg = app.hasGivenUp ? "Solution Shown" : "Good Job!";
//     document.getElementById('resultBox').innerText = msg;
//     document.getElementById('nextBtn').style.display = 'inline-block';
    
//     document.getElementById('hintBtn').disabled = true;
//     document.getElementById('giveUpBtn').disabled = true;
//   }

//   function finishGame() {
//     // Hide Game UI
//     document.getElementById('canvasArea').style.display = 'none';
//     document.getElementById('gameControls').style.display = 'none';
//     document.getElementById('resultBox').style.display = 'none';
//     // Hide Remaining Count
//     document.getElementById('scoreBox').style.display = 'none';

//     // Show Final Screen
//     const finalScreen = document.getElementById('finalScreen');
//     finalScreen.style.display = 'flex';
    
//     const scoreDisplay = document.getElementById('finalScoreDisplay');
//     const list = document.getElementById('resultDetails');
    
//     let totalScore = 0;
    
//     let html = "";
//     app.history.forEach(item => {
//       totalScore += item.score;
//       let statusClass = "status-perfect";
//       if(item.status === 'hint') statusClass = "status-hint";
//       if(item.status === 'fail') statusClass = "status-fail";

//       html += `
//         <div class="result-item">
//           <span>${item.text.substring(0, 30)}${item.text.length > 30 ? '...' : ''}</span>
//           <span class="points ${statusClass}">${item.score}</span>
//         </div>
//       `;
//     });

//     scoreDisplay.innerText = `${totalScore} / ${app.history.length}`;
//     list.innerHTML = html;
//   }

//   function triggerNextExercise() {
//     // Standard LMS Message to Parent Window
//     try {
//               window.parent.postMessage(JSON.stringify({ done: true }), '*');
//         // window.parent.postMessage({ type: 'next', score: app.history }, '*');
//         console.log("Navigating to next exercise...");
//     } catch(e) {
//         console.log("Cannot post message to parent");
//     }
//     // Fallback if no parent
//     alert("This exercise is complete. Please navigate to the next section.");
//   }

//   // Utilities
//   function createTempLine() {
//     const svg = document.getElementById('svgLayer');
//     const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
//     line.id = 'temp-line';
//     line.setAttribute('stroke', '#60a5fa');
//     line.setAttribute('stroke-width', '4');
//     line.setAttribute('stroke-dasharray', '5,5');
//     svg.appendChild(line);
//   }

//   function drawPermanentLine(from, to) {
//     const svg = document.getElementById('svgLayer');
//     const r1 = app.blocks[from].getBoundingClientRect();
//     const r2 = app.blocks[to].getBoundingClientRect();
//     const x1 = (r1.left + r1.width/2) - app.canvasRect.left;
//     const y1 = (r1.top + r1.height/2) - app.canvasRect.top;
//     const x2 = (r2.left + r2.width/2) - app.canvasRect.left;
//     const y2 = (r2.top + r2.height/2) - app.canvasRect.top;

//     const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
//     line.setAttribute('x1', x1); line.setAttribute('y1', y1); line.setAttribute('x2', x2); line.setAttribute('y2', y2);
//     line.setAttribute('stroke', '#ef4444'); line.setAttribute('stroke-width', '4');
//     svg.appendChild(line);
//   }

//   function findBlockUnderPoint(x, y) {
//     for (let i = 0; i < app.blocks.length; i++) {
//       const rect = app.blocks[i].getBoundingClientRect();
//       if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return i;
//     }
//     return -1;
//   }

//   function shakeBlock(el) {
//     el.style.transform = "translateX(5px)";
//     setTimeout(() => el.style.transform = "translateX(-5px)", 50);
//     setTimeout(() => el.style.transform = "none", 150);
//   }

//   function updateCanvasRect() {
//     const c = document.getElementById('canvasArea');
//     if(c) app.canvasRect = c.getBoundingClientRect();
//   }

//   function getEventPoint(e) {
//     if (e.touches && e.touches.length > 0) return { client_x: e.touches[0].clientX, client_y: e.touches[0].clientY };
//     return { client_x: e.clientX, client_y: e.clientY };
//   }

//   function setupEventListeners() {
//     window.addEventListener('resize', updateCanvasRect);
//     document.addEventListener('mouseup', handleGlobalMouseUp);
//     document.addEventListener('touchend', handleGlobalMouseUp);
//     document.addEventListener('mousemove', handleGlobalMouseMove);
//     document.addEventListener('touchmove', handleGlobalMouseMove, { passive: false });
    
//     document.getElementById('nextBtn').onclick = loadNextRound;
//     document.getElementById('finishBtn').onclick = triggerNextExercise;

//     document.getElementById('giveUpBtn').onclick = () => {
//       app.hasGivenUp = true;
//       for(let i=0; i<app.blocks.length-1; i++) {
//           if (!app.connections.includes(i+1)) {
//               app.connections.push(i+1);
//               drawPermanentLine(i, i+1);
//           }
//       }
//       animateCompletion();
//     };

//     document.getElementById('hintBtn').onclick = () => {
//       app.hasUsedHint = true;
//       const nextIdx = app.connections.length === 0 ? 0 : app.connections[app.connections.length - 1] + 1;
//       if (app.blocks[nextIdx]) {
//          const el = app.blocks[nextIdx];
//          el.style.transform = "scale(1.2)";
//          el.style.borderColor = "orange";
//          setTimeout(() => {
//              el.style.transform = "";
//              el.style.borderColor = "";
//          }, 500);
//       }
//     };
//   }

//   if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
//   else init();

// })();

