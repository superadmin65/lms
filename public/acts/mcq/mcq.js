(function () {
  // ---------------------------------------------------
  // 1. CONFIGURATION
  // ---------------------------------------------------
  // TODO: Double check this matches your ORDS Workspace/Module
  // const API_BASE = 'http://192.168.0.127:8080/ords/lms/mcq';
  const API_BASE = 'http://localhost:8080/ords/lms/mcq';

  // ---------------------------------------------------
  // 2. LZ-STRING (Data Compression Lib)
  // ---------------------------------------------------
  const LZString = (function () {
    const f = String.fromCharCode;
    const keyStrBase64 =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    function getBaseValue(alphabet, character) {
      return alphabet.indexOf(character);
    }
    function decompressFromBase64(input) {
      if (input == null) return '';
      if (input === '') return null;
      return _decompress(input.length, 32, (index) =>
        getBaseValue(keyStrBase64, input.charAt(index))
      );
    }
    function decompressFromEncodedURIComponent(input) {
      if (input == null) return '';
      if (input === '') return null;
      try {
        input = decodeURIComponent(input);
      } catch (e) {}
      input = input.replace(/ /g, '+');
      return decompressFromBase64(input);
    }
    function _decompress(length, resetValue, getNextValue) {
      const dictionary = [];
      let next,
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = '',
        result = [],
        i,
        w,
        bits,
        resb,
        maxpower,
        power,
        c,
        data = { val: getNextValue(0), position: resetValue, index: 1 };
      for (i = 0; i < 3; i++) dictionary[i] = i;
      bits = 0;
      maxpower = Math.pow(2, 2);
      power = 1;
      while (power !== maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position === 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }
      switch ((next = bits)) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2, 8);
          power = 1;
          while (power !== maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position === 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          c = f(bits);
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2, 16);
          power = 1;
          while (power !== maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position === 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          c = f(bits);
          break;
        case 2:
          return '';
      }
      dictionary[3] = c;
      w = c;
      result.push(c);
      while (true) {
        if (data.index > length) return '';
        bits = 0;
        maxpower = Math.pow(2, numBits);
        power = 1;
        while (power !== maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position === 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }
        switch ((c = bits)) {
          case 0:
            bits = 0;
            maxpower = Math.pow(2, 8);
            power = 1;
            while (power !== maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position === 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            dictionary[dictSize++] = f(bits);
            c = dictSize - 1;
            enlargeIn--;
            break;
          case 1:
            bits = 0;
            maxpower = Math.pow(2, 16);
            power = 1;
            while (power !== maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position === 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            dictionary[dictSize++] = f(bits);
            c = dictSize - 1;
            enlargeIn--;
            break;
          case 2:
            return result.join('');
        }
        if (enlargeIn === 0) {
          enlargeIn = Math.pow(2, numBits);
          numBits++;
        }
        entry = dictionary[c] || (c === dictSize ? w + w.charAt(0) : null);
        if (!entry) return null;
        result.push(entry);
        dictionary[dictSize++] = w + entry.charAt(0);
        enlargeIn--;
        w = entry;
        if (enlargeIn === 0) {
          enlargeIn = Math.pow(2, numBits);
          numBits++;
        }
      }
    }
    return { decompressFromEncodedURIComponent };
  })();

  // ---------------------------------------------------
  // 3. UTILITIES
  // ---------------------------------------------------
  function readPayload() {
    try {
      const url = new URL(location.href);
      const c = url.searchParams.get('c');
      if (c) {
        const json = LZString.decompressFromEncodedURIComponent(c);
        if (json) return JSON.parse(json);
      }
      const p = url.searchParams.get('payload');
      if (p) return JSON.parse(decodeURIComponent(p));

      // Demo Data (Fallback)
      return {
        id: 'demo_quiz',
        title: 'Demo Activity',
        questions: [
          { qText: 'What is 10 + 10?', options: '10, *20, 30' },
          { qText: 'Is the sky blue?', options: '*Yes, No' },
        ],
      };
    } catch (e) {
      console.error('Payload error:', e);
      return null;
    }
  }

  function getUrlParam(param) {
    const url = new URL(location.href);
    return url.searchParams.get(param);
  }

  function parseOptionsString(raw) {
    return (raw || '')
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
      const original = q.qText || q.text || '';
      const rawOpts = parseOptionsString(q.options || q.option || '');
      let originalCorrectIndex = -1;
      const cleanedOpts = rawOpts.map((opt, idx) => {
        if (opt.includes('*')) {
          originalCorrectIndex = idx;
          return opt.replace(/\*/g, '').trim();
        }
        return opt;
      });
      if (originalCorrectIndex === -1) originalCorrectIndex = 0;

      const order = shuffleArray(cleanedOpts.map((_, i) => i));
      const shuffled = [];
      let newCorrectIndex = -1;
      order.forEach((oldIndex, newIndex) => {
        shuffled.push(cleanedOpts[oldIndex]);
        if (oldIndex === originalCorrectIndex) newCorrectIndex = newIndex;
      });

      return {
        qTextRaw: original,
        qText: original,
        options: shuffled,
        correctIndex: newCorrectIndex,
        answered: false,
        userChoice: null,
      };
    });
  }

  // ---------------------------------------------------
  // 4. APP STATE
  // ---------------------------------------------------
  const app = {
    payload: null,
    user_id: null,
    activity_id: null,
    questions: [],
    current: 0,
    score: 0,
    total: 0,
    attempted: 0,
    status: 'STARTED',
  };

  // ---------------------------------------------------
  // 5. API INTEGRATION
  // ---------------------------------------------------
  async function loadProgressAPI() {
    if (!app.user_id || !app.activity_id) return null;
    try {
      const ts = new Date().getTime();
      const res = await fetch(
        `${API_BASE}/progress/${app.user_id}/${app.activity_id}?t=${ts}`
      );
      if (!res.ok) return null;
      const text = await res.text();
      if (!text || text.trim() === '') return null;
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        return null;
      }
      if (data.status === 'empty') return null;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {}
      }
      return data;
    } catch (err) {
      console.error('API Load Error', err);
      return null;
    }
  }

  async function saveProgressAPI() {
    if (!app.user_id) return;
    const stateToSave = {
      current: app.current,
      score: app.score,
      attempted: app.attempted,
      questions: app.questions,
      total: app.total,
    };
    try {
      await fetch(`${API_BASE}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: app.user_id,
          activity_id: app.activity_id,
          progress_json: JSON.stringify(stateToSave),
          score: app.score,
          attempted: app.attempted,
          status: 'IN_PROGRESS',
        }),
      });
    } catch (err) {
      console.error('API Save Error', err);
    }
  }

  async function completeQuizAPI() {
    if (!app.user_id) return;
    try {
      await fetch(`${API_BASE}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: app.user_id,
          activity_id: app.activity_id,
          score: app.score,
          attempted: app.attempted,
        }),
      });
      app.status = 'COMPLETED';
    } catch (err) {
      console.error('API Complete Error', err);
    }
  }

  function notifyParent(donePayload = {}) {
    try {
      window.parent.postMessage(
        JSON.stringify(Object.assign({ done: true }, donePayload)),
        '*'
      );
    } catch (_) {}
  }

  // ---------------------------------------------------
  // 6. RENDER LOGIC
  // ---------------------------------------------------
  function renderQuestion() {
    const wrap = document.getElementById('qwrap');
    const nextBtn = document.getElementById('nextBtn');
    const titleEl = document.getElementById('actTitle');
    const qTitleEl = document.getElementById('questionTitle');

    // 1. Reset Content & Re-Inject Marks
    // We must manually re-add the mark divs because innerHTML='' wiped them
    wrap.innerHTML = `
      <div id="rightMark" class="mark right">✓</div>
      <div id="wrongMark" class="mark wrong">✗</div>
    `;

    // 2. Get References to new Mark Elements
    const rightMark = document.getElementById('rightMark');
    const wrongMark = document.getElementById('wrongMark');

    // 3. Update Titles
    if (titleEl)
      titleEl.textContent = app.payload?.title || 'Multiple Choice Question';
    if (qTitleEl)
      qTitleEl.textContent = `Question ${app.current + 1} of ${app.total}`;

    const q = app.questions[app.current];

    // 4. Render Passage (if exists)
    if (app.payload?.passage) {
      const passDiv = document.createElement('div');
      passDiv.className = 'passageBox';
      passDiv.textContent = app.payload.passage;
      wrap.appendChild(passDiv);
    }

    // 5. Render Question Text
    const qDiv = document.createElement('div');
    qDiv.className = 'question';
    qDiv.innerHTML = q.qText;
    wrap.appendChild(qDiv);

    // 6. Render Options
    const optBox = document.createElement('div');
    optBox.className = 'options';

    q.options.forEach((opt, i) => {
      const li = document.createElement('div');
      li.className = 'option';
      li.dataset.index = i;
      li.innerHTML = `<span class="radio"></span><div class="optionLabel">${opt}</div>`;

      li.addEventListener('click', () => {
        if (q.answered) return;
        q.answered = true;
        q.userChoice = i;
        app.attempted++;
        // --- NEW LINE ADDED HERE ---
        li.classList.add('selected');
        // ---------------------------

        // Logic for Right/Wrong
        if (i === q.correctIndex) {
          li.classList.add('correct');
          app.score++;
          if (rightMark) rightMark.style.display = 'block';
        } else {
          li.classList.add('wrong');
          // Highlight correct one
          const correctLi = optBox.querySelector(
            `.option[data-index="${q.correctIndex}"]`
          );
          if (correctLi) correctLi.classList.add('correct');
          if (wrongMark) wrongMark.style.display = 'block';
        }

        updateScore();
        saveProgressAPI();

        // Enable Next Button
        if (nextBtn) {
          nextBtn.disabled = false;
          nextBtn.style.display = 'inline-block';
          nextBtn.textContent =
            app.current === app.total - 1 ? 'Finish' : 'Next';
        }
      });

      // --- STATE RESTORATION (Refresh logic) ---
      if (q.answered) {
        if (i === q.correctIndex) li.classList.add('correct');
        else if (i === q.userChoice) li.classList.add('wrong');
        // --- NEW IF BLOCK ADDED HERE ---
        // Restore the selected look for the user's choice
        if (i === q.userChoice) {
          li.classList.add('selected');
        }

        // Show mark if this was the user's choice
        if (i === q.userChoice) {
          if (i === q.correctIndex && rightMark)
            rightMark.style.display = 'block';
          else if (wrongMark) wrongMark.style.display = 'block';
        }
      }

      optBox.appendChild(li);
    });

    wrap.appendChild(optBox);

    // 7. Update Button State
    if (nextBtn) {
      if (q.answered) {
        nextBtn.disabled = false;
        nextBtn.style.display = 'inline-block';
      } else {
        nextBtn.disabled = true;
        nextBtn.style.display = 'none';
      }
      nextBtn.textContent = app.current === app.total - 1 ? 'Finish' : 'Next';
    }
  }

  function updateScore() {
    const scoreEl = document.getElementById('scoreBox');
    if (scoreEl) scoreEl.textContent = `Score : ${app.score} / ${app.total}`;
  }

  function showSummary() {
    // Switch views
    const main = document.querySelector('.main'); // This targets the Quiz wrapper
    const finalWrap = document.getElementById('finalWrap');

    // Hide question area, show final area
    // Note: In your HTML, both share class 'main', but ID distinguishes them
    document.querySelector('.main:not(#finalWrap)').style.display = 'none';
    finalWrap.style.display = 'block';

    const sum = document.getElementById('summaryList');
    sum.innerHTML = '';

    app.questions.forEach((q, i) => {
      const div = document.createElement('div');
      div.className = 'summaryItem'; // You might need CSS for this class if not in your provided CSS
      // Inline styles for summary readability
      // div.style.borderBottom = '1px solid #eee';
      div.style.padding = '10px 0';

      const isCorrect = q.userChoice === q.correctIndex;
      div.innerHTML = `
        <div style="font-weight:bold; margin-bottom:4px;">${i + 1}. ${
          q.qTextRaw
        }</div>
        <div style="font-size:0.9em;">
            Your Answer: <span style="color:${
              isCorrect ? '#2ecc71' : '#e74c3c'
            }; font-weight:bold">
                ${q.options[q.userChoice] || 'Skipped'}
            </span>
            ${
              !isCorrect
                ? ` <span style="color:#777; margin-left:8px;">(Correct: ${
                    q.options[q.correctIndex]
                  })</span>`
                : ''
            }
        </div>
      `;
      sum.appendChild(div);
    });

    const finalScore = document.getElementById('finalScore');
    if (finalScore)
      finalScore.textContent = `Final Score: ${app.score} / ${app.attempted}`;
  }

  // ---------------------------------------------------
  // 7. INITIALIZATION
  // ---------------------------------------------------
  window.addEventListener('DOMContentLoaded', async () => {
    // A. Bind Buttons Immediately
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      nextBtn.onclick = async () => {
        nextBtn.disabled = true;
        const originalText = nextBtn.textContent;
        nextBtn.textContent = 'Saving...';

        try {
          if (app.current + 1 < app.total) {
            app.current++;
            await saveProgressAPI();
            renderQuestion();
          } else {
            await saveProgressAPI();
            await completeQuizAPI();
            showSummary();
          }
        } catch (e) {
          console.error('Nav error', e);
          nextBtn.disabled = false;
          nextBtn.textContent = originalText;
        }
      };
    }

    const finalNextBtn = document.getElementById('finalNextBtn');
    if (finalNextBtn) {
      finalNextBtn.addEventListener('click', () => {
        notifyParent({ score: app.score, total: app.attempted });
      });
    }

    // B. Load Data
    app.payload = readPayload();
    if (!app.payload) return;

    app.activity_id = app.payload.id || 'mcq_default';

    // C. User Logic (Email > Persistent Guest)
    const loggedInEmail = localStorage.getItem('user_email');
    if (loggedInEmail) {
      app.user_id = loggedInEmail;
    } else {
      let guestId = localStorage.getItem('mcq_guest_id');
      if (!guestId) {
        guestId = 'guest_' + Math.floor(Math.random() * 1000000);
        localStorage.setItem('mcq_guest_id', guestId);
      }
      app.user_id = guestId;
    }
    console.log('MCQ User:', app.user_id);

    const raw = app.payload.questions || [];
    app.questions = normalizeQuestions(raw);
    app.total = app.questions.length;

    // D. Fetch State
    const savedState = await loadProgressAPI();

    if (savedState) {
      app.current = savedState.current || 0;
      app.score = savedState.score || 0;
      app.attempted = savedState.attempted || 0;

      if (
        savedState.questions &&
        savedState.questions.length === app.questions.length
      ) {
        app.questions = savedState.questions;
      }

      // Check Completion
      if (
        app.current >= app.total ||
        (app.total > 0 && app.attempted === app.total)
      ) {
        updateScore();
        showSummary();
        return;
      }
    }

    // E. Initial Render
    updateScore();
    renderQuestion();
  });
})();
