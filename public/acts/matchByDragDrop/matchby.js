(function () {
  // ---------------------------------------------------
  // 1. ORACLE API INTEGRATION
  // ---------------------------------------------------
  const API_BASE = 'http://localhost:8080/ords/lms/matchby';

  const getUserId = () => {
    const uid = localStorage.getItem('user_id');
    return uid ? parseInt(uid, 10) : null;
  };

  async function loadMatchByProgress(activityId) {
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

  async function saveMatchByProgress(activityId, score, totalItems) {
    const userId = getUserId();
    if (!userId) return; 

    try {
      await fetch(`${API_BASE}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          activity_id: activityId,
          progress_json: JSON.stringify({ filled: app.filled }),
          score: score,
          attempted: totalItems,
          status: 'IN_PROGRESS'
        })
      });
    } catch (e) {
      console.error("Save Error", e);
    }
  }

  async function completeMatchByActivity(activityId, finalScore, totalItems) {
    console.log("🚀 Starting Save Process...");
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
          attempted: totalItems
        })
      });
      const res = await response.json();
      console.log("✅ Activity Completed & Saved to Oracle:", res);
    } catch (e) {
      console.error("🔥 Complete Error", e);
    }
  }

// ---------------------------------------------------
  // HELPER: AUTO-GENERATE ID (NUMBERS ONLY)
  // ---------------------------------------------------
  function generateUniqueId(title, text) {
      // We combine Title + Text to ensure uniqueness, but we hash it all
      const source = (title || "") + (text || "");
      
      let hash = 0;
      for (let i = 0; i < source.length; i++) {
          hash = ((hash << 5) - hash) + source.charCodeAt(i);
          hash |= 0; // Convert to 32bit integer
      }
      
      // Return ONLY the absolute number as a string
      // Example Result: "360693919"
      return Math.abs(hash).toString();
  }



  // ---------------------------------------------------
  // APP LOGIC
  // ---------------------------------------------------

  function readPayload() {
    try {
      const url = new URL(location.href);
      const p = url.searchParams.get("payload");
      if (p) return JSON.parse(decodeURIComponent(p));
    } catch (e) {}
    return null;
  }

  const app = {
    activityId: "match_default", 
    sentences: [],    
    answers: [],
    filled: [], 
    options: [],
    history: [],
    draggedOption: null,
    isParagraphMode: false,
    originalText: "",
    isReadOnly: false,
  };

  function notifyParent() {
    try {
      window.parent.postMessage(JSON.stringify({ done: true }), "*");
    } catch (e) {}
  }

  function parseText(raw) {
    app.sentences = [];
    app.answers = [];
    app.filled = [];
    app.options = [];
    app.originalText = raw.trim();

    const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);

    if (lines.length === 1) {
      app.isParagraphMode = true;
      const matches = [...raw.matchAll(/\*(.*?)\*/g)];
      matches.forEach((match) => {
        const correct = match[1].trim();
        app.answers.push(correct);
        app.filled.push(null);
        app.options.push(correct);
      });
    } else {
      app.isParagraphMode = false;
      lines.forEach((line, i) => {
        const match = line.match(/\*(.*?)\*/);
        if (!match) return;

        const correct = match[1].trim();
        const sentence = line.replace(/\*(.*?)\*/, "_____");

        app.sentences.push(sentence);
        app.answers.push(correct);
        app.filled.push(null);
        app.options.push(correct);
      });
    }
    app.options = app.options.sort(() => Math.random() - 0.5);
  }

  function buildUI() {
    const area = document.getElementById("matchArea");
    const optionsArea = document.getElementById("optionsArea");

    if (!area || !optionsArea) return; 

    area.innerHTML = "";
    optionsArea.innerHTML = "";

    if (app.isParagraphMode) {
      buildParagraphModeUI(area);
    } else {
      buildSentenceModeUI(area);
    }

    if (app.isReadOnly) {
        optionsArea.innerHTML = "<div style='color:#666; font-style:italic;'>Examination Completed</div>";
        return; 
    }

    app.options.forEach((opt) => {
      const btn = document.createElement("div");
      btn.className = "option";
      btn.textContent = opt;
      btn.draggable = true;

      if (app.filled.includes(opt)) {
         btn.classList.add('used');
      }

      btn.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", opt);
        app.draggedOption = btn;
        btn.style.transform = "scale(1.05)";
      });

      btn.addEventListener("dragend", () => {
        app.draggedOption = null;
        btn.style.transform = "";
      });

      optionsArea.appendChild(btn);
    });
  }

  function buildParagraphModeUI(area) {
    const para = document.createElement("div");
    para.className = "paragraph";
    para.style.fontSize = "1.1rem";
    para.style.lineHeight = "1.6";
    para.style.margin = "20px 0";

    let html = app.originalText;
    let index = 0;
    html = html.replace(/\*(.*?)\*/g, (match, answer) => {
      return `<span class="drop-box" data-index="${index++}" style="display:inline-block;min-width:70px;text-align:center;border-bottom:2px solid #333;padding:2px 4px;margin:0 4px;vertical-align:baseline;"></span>`;
    });

    para.innerHTML = html;
    area.appendChild(para);

    document.querySelectorAll(".drop-box").forEach((box) => {
      const idx = parseInt(box.dataset.index);
      if (app.filled[idx]) {
        box.textContent = app.filled[idx];
      }

      if (app.isReadOnly) return; 

      box.addEventListener("dragover", (e) => {
        e.preventDefault();
        box.style.backgroundColor = "#f0f9ff";
      });
      box.addEventListener("dragleave", () => {
        box.style.backgroundColor = "";
      });
      box.addEventListener("drop", (e) => {
        e.preventDefault();
        box.style.backgroundColor = "";
        if (app.draggedOption) {
          handleDrop(box, app.draggedOption);
        }
      });
    });
  }

  function buildSentenceModeUI(area) {
    app.sentences.forEach((sent, i) => {
      const row = document.createElement("div");
      row.className = "match-row";

      const parts = sent.split("_____");
      const beforeBlank = parts[0] || "";
      const afterBlank = parts[1] || "";

      const textBefore = document.createElement("span");
      textBefore.className = "left-text";
      textBefore.textContent = beforeBlank;

      const box = document.createElement("div");
      box.className = "drop-box";
      box.dataset.index = i;

      if (app.filled[i]) {
        box.textContent = app.filled[i];
      }

      if (!app.isReadOnly) {
          box.addEventListener("dragover", (e) => e.preventDefault());
          box.addEventListener("drop", (e) => {
            e.preventDefault();
            if (app.draggedOption) {
              handleDrop(box, app.draggedOption);
            }
          });
      }

      const textAfter = document.createElement("span");
      textAfter.textContent = afterBlank;

      row.appendChild(textBefore);
      row.appendChild(box);
      row.appendChild(textAfter);

      area.appendChild(row);
    });
  }

  function handleDrop(box, draggedBtn) {
    if (app.isReadOnly) return; 

    const i = parseInt(box.dataset.index);
    const currentValue = box.textContent.trim();

    if (currentValue) {
      const prevButton = [...document.querySelectorAll(".option")].find(
        (btn) => btn.textContent === currentValue && btn.classList.contains("used")
      );
      if (prevButton) prevButton.classList.remove("used");
    }

    app.history.push({
      index: i,
      option: draggedBtn.textContent,
      button: draggedBtn,
      replaced: currentValue || null,
    });

    fillBox(box, draggedBtn.textContent);
    draggedBtn.classList.add("used");

    const currentFilledCount = app.filled.filter(Boolean).length;
    saveMatchByProgress(app.activityId, 0, currentFilledCount); 

    if (allFilled()) validate();
  }

  function fillBox(box, opt) {
    const i = parseInt(box.dataset.index);
    app.filled[i] = opt;
    box.textContent = opt;
  }

  function allFilled() {
    return app.filled.filter(Boolean).length === app.answers.length;
  }

  function revealCorrectAnswers() {
    if (app.isParagraphMode) {
      document.querySelectorAll(".drop-box").forEach((box, i) => {
        const correctAnswer = app.answers[i];
        const existing = box.parentElement.querySelector(`.answer-tag[data-for="${i}"]`);
        if (existing) existing.remove();
        const tag = document.createElement("span");
        tag.className = "answer-tag";
        tag.dataset.for = i;
        tag.textContent = ` → ${correctAnswer}`;
        tag.style.fontSize = "16px";
        tag.style.fontWeight = "bold";
        tag.style.fontFamily = "'Segoe UI', Arial, sans-serif";
        tag.style.color = "#1f2937";
        tag.style.backgroundColor = "#f3f4f6";
        tag.style.padding = "2px 6px";
        tag.style.borderRadius = "4px";
        tag.style.marginLeft = "6px";
        tag.style.verticalAlign = "middle";
        box.after(tag);
      });
    } else {
      document.querySelectorAll(".match-row").forEach((row, i) => {
        const correctAnswer = app.answers[i];
        const existing = row.querySelector(".answer-tag");
        if (existing) existing.remove();
        const tag = document.createElement("span");
        tag.className = "answer-tag";
        tag.textContent = ` → ${correctAnswer}`;
        tag.style.fontSize = "16px";
        tag.style.fontWeight = "bold";
        tag.style.fontFamily = "'Segoe UI', Arial, sans-serif";
        tag.style.color = "#1f2937";
        tag.style.backgroundColor = "#f3f4f6";
        tag.style.padding = "2px 6px";
        tag.style.borderRadius = "4px";
        tag.style.marginLeft = "12px";
        row.appendChild(tag);
      });
    }
  }

  function validate(skipSave = false) {
    let correctCount = 0;
    const total = app.answers.length;

    document.querySelectorAll(".drop-box").forEach((box, i) => {
      const given = app.filled[i];
      const correct = app.answers[i];

      if (given === correct) {
        correctCount++;
        box.classList.add("correct");
      } else {
        box.classList.add("wrong");
      }
    });

    revealCorrectAnswers();

    const resultBox = document.getElementById("resultBox");
    if (resultBox) {
        const isPerfect = correctCount === total;
        resultBox.className = "result-box " + (isPerfect ? "good-job" : "good-try");
        resultBox.innerHTML = `
          ${isPerfect ? "Excellent!" : "Good Try!"} <br>
          Score: <strong>${correctCount} / ${total}</strong>
        `;
        resultBox.style.display = "block";
    }

    const nextBtn = document.getElementById("nextBtn");
    if (nextBtn) nextBtn.style.display = "inline-block";




    if (!skipSave) {
        try {
            if (app && app.activityId) {
                completeMatchByActivity(app.activityId, correctCount, total);
            }
        } catch (e) {
            console.error("Save failed, but game finished:", e);
        }
    }

    
  }

  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) resetBtn.style.display = "none";

  const undoBtn = document.getElementById("undoBtn");
  if (undoBtn) undoBtn.style.display = "none";

  function resetAll() {
    if (app.isReadOnly) return; 

    app.filled = [];
    app.history = [];
    document.querySelectorAll(".drop-box").forEach((box) => {
      box.textContent = "";
      box.classList.remove("correct", "wrong");
    });
    document.querySelectorAll(".answer-tag").forEach(el => el.remove());
    document.querySelectorAll(".option").forEach((o) => o.classList.remove("used"));
    
    const rBox = document.getElementById("resultBox");
    if(rBox) rBox.style.display = "none";
    
    const nBtn = document.getElementById("nextBtn");
    if(nBtn) nBtn.style.display = "none";
  }

  function undo() {
    if (app.isReadOnly) return; 

    if (app.history.length === 0) return;
    const last = app.history.pop();
    app.filled[last.index] = null;
    const box = document.querySelector(`.drop-box[data-index="${last.index}"]`);
    if (box) {
      box.textContent = "";
      box.classList.remove("correct", "wrong");
    }
    if (last.button?.classList.contains("used")) {
      last.button.classList.remove("used");
    }
    if (last.replaced) {
      const replacedBtn = [...document.querySelectorAll(".option")].find(
        (btn) => btn.textContent === last.replaced && btn.classList.contains("used")
      );
      replacedBtn?.classList.remove("used");
    }
    document.querySelectorAll(".answer-tag").forEach(el => el.remove());
    
    const rBox = document.getElementById("resultBox");
    if(rBox) rBox.style.display = "none";
    
    const nBtn = document.getElementById("nextBtn");
    if(nBtn) nBtn.style.display = "none";
  }

  async function init() {
    const payload = readPayload();
    if (!payload) return;

    // ----------------------------------------------------
    // ✨ AUTO-GENERATE UNIQUE ID (The Magic Fix) ✨
    // ----------------------------------------------------
    // If URL has no ID, we make one from the Title + Content
    if (payload.id) {
        app.activityId = payload.id;
    } else {
        const rawContent = payload.text || payload.data?.text || "";
        app.activityId = generateUniqueId(payload.title, rawContent);
        console.log("🆔 Auto-Generated Activity ID:", app.activityId);
    }
    // ----------------------------------------------------

    const titleEl = document.getElementById("title");
    if(titleEl) titleEl.textContent = payload.title || "Fill in the Blanks";

    parseText(payload.text || payload.data?.text || "");

    const savedData = await loadMatchByProgress(app.activityId);
    
    if (savedData) {
        console.log("📥 Loaded Data:", savedData);
        
        if (savedData.data && savedData.data.filled) {
            app.filled = savedData.data.filled;
        }

        if (savedData.status === 'COMPLETED') {
             app.isReadOnly = true; 
             buildUI(); 
             validate(true); 
             
             const resetBtn = document.getElementById("resetBtn");
             if(resetBtn) resetBtn.style.display = "none";
             const undoBtn = document.getElementById("undoBtn");
             if(undoBtn) undoBtn.style.display = "none";
             
             return; 
        } 
        buildUI();
    } else {
        buildUI();
    }

    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) resetBtn.onclick = resetAll;

    const undoBtn = document.getElementById("undoBtn");
    if (undoBtn) undoBtn.onclick = undo;

    const nextBtn = document.getElementById("nextBtn");
    if (nextBtn) {
        nextBtn.onclick = function () {
            notifyParent();
            this.disabled = true;
        };
    }
    
    const nextExBtn = document.getElementById("nextExerciseBtn");
    if (nextExBtn) {
        nextExBtn.onclick = function () {
            notifyParent();
        };
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();

})();