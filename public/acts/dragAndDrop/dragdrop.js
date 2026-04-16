(function () {
  const app = {
    gameData: null,
    zones: [],
    totalCount: 0,
    dragItem: null,
    cloneItem: null,
    offset: { x: 0, y: 0 },
    isFlowMode: false,
    baseW: 400,
    baseH: 400,
    isCompleted: false
  };

  async function init() {
    try {
      let rawPayload = getPayloadFromURL();

      if (!rawPayload) {
        try {
          const res = await fetch('data.json');
          if (!res.ok) throw new Error("Local JSON not found");
          rawPayload = await res.json();
        } catch (err) {
          throw new Error("No Data Found.");
        }
      }

      if (rawPayload.data && rawPayload.data.words) {
        app.gameData = rawPayload.data;
        if (!app.gameData.title) app.gameData.title = rawPayload.label;
      } else {
        app.gameData = rawPayload;
      }

      if (!app.gameData || !app.gameData.words) {
        throw new Error("Invalid Data: Missing words.");
      }

      renderGame();
      setupEvents();

    } catch (e) {
      console.error(e);
      document.body.innerHTML = `<h3 style='text-align:center; padding:20px; color:red;'>${e.message}</h3>`;
    }
  }

  function getPayloadFromURL() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const payloadParam = urlParams.get('payload');
      if (!payloadParam) return null;
      return JSON.parse(decodeURIComponent(payloadParam));
    } catch (e) { return null; }
  }

  function fixImgPath(src) {
    if (!src) return "";
    if (src.startsWith('http')) return src;
    if (src.startsWith('/img')) return '/lms-system' + src;
    return src;
  }


  function renderGame() {
    app.isCompleted = false;
    const d = app.gameData;

    const board = document.getElementById('gameBoard');
    const bank = document.getElementById('wordBank');
    board.innerHTML = '';
    bank.innerHTML = '';
    app.zones = [];


    let textObj = d.svg && d.svg.paths ? d.svg.paths.find(p => p.type === 'text') : null;
    app.isFlowMode = !!(textObj && textObj.text);

    if (app.isFlowMode) {
      board.classList.remove('absolute-mode');
      renderFlowMode(board, d, textObj);
    } else {
      board.classList.add('absolute-mode');
      renderAbsoluteMode(board, d);
    }

  
    const options = d.words.map(w => w.word);
    shuffle(options);
    const uniqueOptions = [...new Set(options)];

    uniqueOptions.forEach(text => {
      const btn = document.createElement('button');
      btn.className = 'draggable';
      btn.innerText = text;
      btn.dataset.word = text;

      btn.addEventListener('mousedown', startDrag);
      btn.addEventListener('touchstart', startDrag, { passive: false });

      bank.appendChild(btn);
    });
  }

 
  function renderFlowMode(board, d, textObj) {
    const titleEl = document.createElement("h2");
    titleEl.className = "game-title";
    titleEl.innerText = d.title || "Drag the words to the correct place";
    board.appendChild(titleEl);

    board.style.transform = 'none';
    board.style.width = '100%';

    if (d.svg && d.svg.paths) {
      const imgPath = d.svg.paths.find(p => p.type === 'image');
      if (imgPath) {
        const img = document.createElement('img');
        img.src = fixImgPath(imgPath.src);
        img.className = 'static-img-flow';
        board.appendChild(img);
      }
    }

    const textDiv = document.createElement('div');
    textDiv.className = 'text-content';

    let htmlContent = textObj.text;
    let blankIndex = 0;

    htmlContent = htmlContent.replace(/_{2,}/g, () => {
      if (blankIndex < d.words.length) {
        const zoneHtml = `<span class="drop-zone-flow" data-index="${blankIndex}"></span>`;
        blankIndex++;
        return zoneHtml;
      }
      return "______";
    });

    textDiv.innerHTML = htmlContent;
    board.appendChild(textDiv);

    const zoneEls = textDiv.querySelectorAll('.drop-zone-flow');
    zoneEls.forEach((el, i) => {
      app.zones.push({
        el: el,
        correctWord: d.words[i].word,
        filled: false,
        userWord: null
      });
      addZoneListeners(el);
    });

    app.totalCount = app.zones.length;
  }


  function renderAbsoluteMode(board, d) {
    board.innerHTML = "";
    board.classList.add("absolute-mode");

    const titleWrap = document.createElement("div");
    titleWrap.style.textAlign = "center";
    titleWrap.style.marginBottom = "25px";

    const title1 = document.createElement("h2");
    title1.innerText = "चित्रों को उनके विशेषणों से मिलाएँ।";
    title1.style.margin = "0";

    const title2 = document.createElement("div");
    title2.innerText = "(Match pictures to their adjectives)";
    title2.style.fontStyle = "italic";
    title2.style.marginTop = "5px";

    titleWrap.appendChild(title1);
    titleWrap.appendChild(title2);

    board.appendChild(titleWrap);

    const layout = document.createElement("div");
    layout.className = "abs-layout";
    board.appendChild(layout);

    d.words.forEach((w, i) => {
      const row = document.createElement("div");
      row.className = "abs-row";

      let imgPath = d.svg.paths.filter(p => p.type === 'image')[i];
      if (!imgPath) imgPath = d.svg.paths.find(p => p.type === 'image');

      const img = document.createElement("img");
      img.src = fixImgPath(imgPath.src);
      img.className = "abs-img";

      const zone = document.createElement("div");
      zone.className = "drop-zone-abs";
      zone.dataset.index = i;

      app.zones.push({
        el: zone,
        correctWord: w.word,
        filled: false,
        userWord: null
      });

      addZoneListeners(zone);
      row.appendChild(img);
      row.appendChild(zone);
      layout.appendChild(row);
    });

    app.totalCount = app.zones.length;
  }


  function addZoneListeners(el) {
    el.addEventListener('dragenter', () => el.classList.add('hovered'));
    el.addEventListener('dragleave', () => el.classList.remove('hovered'));
    el.addEventListener('drop', () => el.classList.remove('hovered'));
  }

 
  function startDrag(e) {
    e.preventDefault();
    if (e.target.classList.contains('used')) return;

    app.dragItem = e.target;
    const rect = app.dragItem.getBoundingClientRect();

    app.cloneItem = app.dragItem.cloneNode(true);
    app.cloneItem.classList.add('drag-clone');
    app.cloneItem.style.width = `${rect.width}px`;
    app.cloneItem.style.height = `${rect.height}px`;
    app.cloneItem.style.left = `${rect.left}px`;
    app.cloneItem.style.top = `${rect.top}px`;

    document.body.appendChild(app.cloneItem);
    app.dragItem.style.opacity = '0.5';

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    app.offset.x = clientX - rect.left;
    app.offset.y = clientY - rect.top;

    document.addEventListener('mousemove', moveDrag);
    document.addEventListener('touchmove', moveDrag, { passive: false });
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
  }

  function moveDrag(e) {
    if (!app.cloneItem) return;
    if (e.type === 'touchmove') e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    app.cloneItem.style.left = `${clientX - app.offset.x}px`;
    app.cloneItem.style.top = `${clientY - app.offset.y}px`;
  }

  function endDrag(e) {
    if (!app.cloneItem) return;

    const rect = app.cloneItem.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    app.cloneItem.style.display = 'none';
    const elemBelow = document.elementFromPoint(cx, cy);
    app.cloneItem.style.display = 'block';

    const zoneEl = elemBelow ? elemBelow.closest('.drop-zone-flow, .drop-zone-abs') : null;
    const targetZone = app.zones.find(z => z.el === zoneEl);

    if (targetZone && !targetZone.filled) {
      const draggedWord = app.dragItem.dataset.word;

      targetZone.filled = true;
      targetZone.userWord = draggedWord;
      targetZone.el.innerText = draggedWord;

  

      app.dragItem.classList.add('used');
      app.dragItem.style.opacity = '0.5';

      checkCompletion();
    } else {
      resetDragBtn();
    }

    app.cloneItem.remove();
    app.cloneItem = null;

    document.removeEventListener('mousemove', moveDrag);
    document.removeEventListener('touchmove', moveDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchend', endDrag);
  }

  function resetDragBtn() {
    if (app.dragItem) app.dragItem.style.opacity = '1';
    app.dragItem = null;
  }

  function checkCompletion() {
    const filledCount = app.zones.filter(z => z.filled).length;

    if (filledCount === app.totalCount) {

      app.zones.forEach(zone => {
        zone.el.classList.remove("hovered");

        if (zone.userWord === zone.correctWord) {
          zone.el.classList.add("correct");
        } else {
          
          zone.el.classList.add("wrong");
 
          const existingFeedback = zone.el.nextElementSibling;
          if (existingFeedback && existingFeedback.classList.contains('feedback-correct')) {
            existingFeedback.remove();
          }
     
          const feedbackSpan = document.createElement('span');
          feedbackSpan.className = 'feedback-correct';
          feedbackSpan.innerHTML = ` → <span style="color:#22c55e; font-weight:bold;">${zone.correctWord}</span>`;
    
          zone.el.parentNode.insertBefore(feedbackSpan, zone.el.nextSibling);
        }
      });

      const nextBtn = document.getElementById("nextBtn");
      if (nextBtn) nextBtn.style.display = "inline-block";
    }
}


  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  
  function resizeBoard() {
    if (app.isFlowMode) return;

    const wrapper = document.querySelector('.game-wrapper');
    const board = document.getElementById('gameBoard');
    if (!wrapper || !board) return;

    const availW = wrapper.clientWidth - 40;
    let scale = availW / app.baseW;

    scale = Math.min(scale, 2.5);
    scale = Math.max(scale, 1.0);

    board.style.transform = `scale(${scale})`;

    const hDiff = (app.baseH * scale) - app.baseH;
    board.style.marginBottom = `${hDiff}px`;
  }

  
  function setupEvents() {
    window.addEventListener('resize', resizeBoard);

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.onclick = () => {
      try {
        window.parent.postMessage(
          JSON.stringify({ done: true }),
          "*"
        );
      } catch (e) {
        console.error("postMessage failed:", e);
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
