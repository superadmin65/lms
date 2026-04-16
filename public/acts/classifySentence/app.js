// (function () {
//   // small CSS injection to position tick/cross near options
//   (function injectStyles() {
//     const css = `
//       .optBtn { position: relative; display:inline-block; margin:8px 12px; padding:14px 20px; border-radius:6px; background:#dff0fb; cursor:pointer; user-select:none; box-shadow:0 2px 0 rgba(0,0,0,0.06); }
//       .optBtn.selected { background: #6fbf73; color:#fff; }
//       .optBtn.wrong { opacity:0.9; background:#fbe8e9; }
//       .optionsRow { display:flex; flex-wrap:wrap; gap:12px; margin-top:16px; }
//       .markIcon { position: absolute; right: -36px; top: 50%; transform: translateY(-50%); font-size:26px; display:none; pointer-events:none; }
//       .markIcon.tick { color: #2ecc71; }
//       .markIcon.cross { color: #e74c3c; }
//       @media (max-width:800px){ .markIcon { right:-26px; font-size:22px } .optionsRow { gap:8px } }
//     `;
//     const s = document.createElement('style');
//     s.type = 'text/css';
//     s.appendChild(document.createTextNode(css));
//     document.head.appendChild(s);
//   })();


//   function shuffleArray(arr) {
//     const a = [...arr];
//     for (let i = a.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [a[i], a[j]] = [a[j], a[i]];
//     }
//     return a;
//   }


//   function readPayload() {
//     const urlParams = new URLSearchParams(window.location.search);
//     let raw = urlParams.get('payload');

//     if (!raw) {
//       try {
//         const fe = window.frameElement;
//         if (fe?.dataset?.payload) raw = fe.dataset.payload;
//       } catch (_) {}
//     }

//     if (!raw && window.location.hash) raw = window.location.hash.substring(1);
//     if (!raw) return null;

//     try {
//       let dec = decodeURIComponent(raw);
//       try {
//         dec = decodeURIComponent(dec);
//       } catch (_) {}
//       return JSON.parse(dec);
//     } catch (e) {
//       console.error('Payload parse failed', e);
//       return null;
//     }
//   }


//   function parseClassify(text) {
//     if (!text) return [];
//     const lines = text
//       .split(/\r?\n/)
//       .map((s) => s.trim())
//       .filter(Boolean);

//     return lines.map((line) => {
//       const parts = line.split('|').map((p) => p.trim());
//       let qText = '',
//         optsRaw = '';

//       if (parts.length === 3) {
//         qText = parts[1];
//         optsRaw = parts[2];
//       } else {
//         qText = parts[0];
//         optsRaw = parts[1] || '';
//       }

//       const rawOpts = optsRaw
//         .split(',')
//         .map((o) => o.trim())
//         .filter(Boolean);

//       let correctIdx = -1;

//       const cleanOpts = rawOpts.map((o, i) => {
//         if (o.startsWith('*')) {
//           correctIdx = i;
//           return o.replace(/^\*+/, '').trim();
//         }
//         return o;
//       });

//       if (correctIdx === -1) correctIdx = 0;

   
//       const order = shuffleArray(cleanOpts.map((_, i) => i));
//       const shuffled = [];
//       let newCorrect = -1;

//       order.forEach((oldIdx, newIdx) => {
//         shuffled.push(cleanOpts[oldIdx]);
//         if (oldIdx === correctIdx) newCorrect = newIdx;
//       });

//       return {
//         qText,
//         options: shuffled,
//         correctIndex: newCorrect,
//         userChoice: null,
//       };
//     });
//   }


//   const payload = readPayload();
//   const samplePayload = {
//     title: 'Pick the right option',
//     data: {
//       text: `dog| कुत्ता _____ पर बैठा है।|ज़मीन,किनारे
// hummingbird| चिड़िया _______ में उड़ रही है।|आकाश,खेत
// fish| मछली ________ में तैरती है।|पानी,जंगल`,
//     },
//   };

//   const usePayload = payload || samplePayload;
//   const rawText = usePayload?.data?.text || usePayload?.text || '';

//   let questions = parseClassify(rawText);


//   questions = shuffleArray(questions);

//   let current = 0;
//   let score = 0;
//   let attempted = 0;
//   const total = questions.length;

//   // UI elements
//   const content = document.getElementById('content');
//   const scoreBox = document.getElementById('scoreBox');
//   const nextBtn = document.getElementById('nextBtn');
//   const finalWrap = document.getElementById('finalWrap');
//   const summaryList = document.getElementById('summaryList');
//   const finalScore = document.getElementById('finalScore');
//   const doneBtn = document.getElementById('doneBtn');
//   const cardRoot = document.getElementById('cardRoot');

//   const titleEl = document.getElementById('actTitle');
//   if (titleEl)
//     titleEl.textContent =
//       usePayload.title || usePayload.data?.title || 'Activity';

//   function updateScoreUI() {
//     scoreBox.textContent = `Score: ${score} / ${attempted}`;
//   }

//   function createIconSpan(cls, text) {
//     const sp = document.createElement('span');
//     sp.className = 'markIcon ' + cls;
//     sp.textContent = text;
//     sp.style.display = 'none';
//     return sp;
//   }


//   function renderQuestion(idx) {
//     const q = questions[idx];
//     if (!q) return;

//     content.innerHTML = '';
//     nextBtn.disabled = true;
//     nextBtn.style.display = 'none';

//     const num = document.createElement('div');
//     num.className = 'small';
//     num.textContent = idx + 1 + ')';

//     const qtext = document.createElement('div');
//     qtext.className = 'qText';
//     qtext.innerHTML = q.qText;

//     content.appendChild(num);
//     content.appendChild(qtext);

//     const row = document.createElement('div');
//     row.className = 'optionsRow';

//     q.options.forEach((opt, i) => {
//       const btn = document.createElement('div');
//       btn.className = 'optBtn';
//       btn.dataset.idx = i;
//       btn.textContent = opt;

//       const tickEl = createIconSpan('tick', '✓');
//       const crossEl = createIconSpan('cross', '✘');
//       btn.appendChild(tickEl);
//       btn.appendChild(crossEl);

//       btn.addEventListener('click', function () {
//         if (q.userChoice !== null) return;

//         q.userChoice = i;
//         attempted++;

//         if (i === q.correctIndex) {
//           btn.classList.add('selected');
//           score++;
//           tickEl.style.display = 'block';
//         } else {
//           btn.classList.add('wrong');
//           crossEl.style.display = 'block';

//           const correctBtn = row.querySelector(
//             `[data-idx="${q.correctIndex}"]`
//           );
//           if (correctBtn) {
//             const t = correctBtn.querySelector('.markIcon.tick');
//             if (t) t.style.display = 'block';
//             correctBtn.classList.add('selected');
//           }
//         }

//         updateScoreUI();
//         nextBtn.disabled = false;
//         nextBtn.style.display = 'inline-block';
//       });

//       row.appendChild(btn);
//     });

//     content.appendChild(row);
//     nextBtn.textContent = idx + 1 === total ? 'Finish' : 'Next';
//   }


//   nextBtn.addEventListener('click', function () {
//     if (current + 1 < total) {
//       current++;
//       renderQuestion(current);
//     } else {
//       showSummary();
//     }
//   });


//   function showSummary() {
//     cardRoot.style.display = 'none';
//     finalWrap.style.display = 'block';

//     summaryList.innerHTML = '';
//     questions.forEach((q, i) => {
//       const div = document.createElement('div');
//       div.className = 'summaryItem';

//       const user =
//         q.userChoice === null ? '(no answer)' : q.options[q.userChoice];
//       const correct = q.options[q.correctIndex];
//       const color = q.userChoice === q.correctIndex ? 'green' : 'red';

//       div.innerHTML = `
//         <strong>${i + 1})</strong> ${q.qText}<br>
//         Answer: <span style="color:${color}">${user}</span>
//         — Correct: <strong>${correct}</strong>
//       `;
//       summaryList.appendChild(div);
//     });

//     finalScore.textContent = `Score: ${score} / ${attempted}`;
//   }

//   doneBtn.addEventListener('click', function () {
//     const msg = JSON.stringify({
//       done: true,
//       score: score,
//       total: attempted,
//     });
//     window.parent.postMessage(msg, '*');
//     doneBtn.disabled = true;
//     doneBtn.textContent = 'Sent';
//   });


//   updateScoreUI();
//   renderQuestion(current);

//   document.addEventListener('keydown', function (e) {
//     if (e.key === 'Enter' && !nextBtn.disabled) nextBtn.click();
//   });
// })();










(function () {
  // small CSS injection to position tick/cross near options
  (function injectStyles() {
    const css = `
      .optBtn { position: relative; display:inline-block; margin:8px 12px; padding:14px 20px; border-radius:6px; background:#dff0fb; cursor:pointer; user-select:none; box-shadow:0 2px 0 rgba(0,0,0,0.06); }
      .optBtn.selected { background: #6fbf73; color:#fff; }
      .optBtn.wrong { opacity:0.9; background:#fbe8e9; }
      .optionsRow { display:flex; flex-wrap:wrap; gap:12px; margin-top:16px; }
      .markIcon { position: absolute; right: -36px; top: 50%; transform: translateY(-50%); font-size:26px; display:none; pointer-events:none; }
      .markIcon.tick { color: #2ecc71; }
      .markIcon.cross { color: #e74c3c; }
      @media (max-width:800px){ .markIcon { right:-26px; font-size:22px } .optionsRow { gap:8px } }
    `;
    const s = document.createElement('style');
    s.type = 'text/css';
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  })();

  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // --- FIXED READPAYLOAD FUNCTION ---
  function readPayload() {
    const urlParams = new URLSearchParams(window.location.search);

    // 1. CHECK FOR COMPRESSED DATA (Priority)
    const compressed = urlParams.get('c');
    if (compressed) {
      if (typeof LZString === 'undefined') {
        console.error('LZString library is missing! Please include it in your index.html file.');
        return null;
      }
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
        if (decompressed) {
          return JSON.parse(decompressed);
        }
      } catch (e) {
        console.error('Decompression failed', e);
      }
    }

    // 2. FALLBACK TO OLD LOGIC (Legacy 'payload' param)
    let raw = urlParams.get('payload');

    if (!raw) {
      try {
        const fe = window.frameElement;
        if (fe?.dataset?.payload) raw = fe.dataset.payload;
      } catch (_) {}
    }

    if (!raw && window.location.hash) raw = window.location.hash.substring(1);
    if (!raw) return null;

    try {
      let dec = decodeURIComponent(raw);
      try {
        dec = decodeURIComponent(dec);
      } catch (_) {}
      return JSON.parse(dec);
    } catch (e) {
      console.error('Payload parse failed', e);
      return null;
    }
  }

  function parseClassify(text) {
    if (!text) return [];
    const lines = text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    return lines.map((line) => {
      const parts = line.split('|').map((p) => p.trim());
      let qText = '',
        optsRaw = '';

      if (parts.length === 3) {
        qText = parts[1];
        optsRaw = parts[2];
      } else {
        qText = parts[0];
        optsRaw = parts[1] || '';
      }

      const rawOpts = optsRaw
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);

      let correctIdx = -1;

      const cleanOpts = rawOpts.map((o, i) => {
        if (o.startsWith('*')) {
          correctIdx = i;
          return o.replace(/^\*+/, '').trim();
        }
        return o;
      });

      if (correctIdx === -1) correctIdx = 0;

      const order = shuffleArray(cleanOpts.map((_, i) => i));
      const shuffled = [];
      let newCorrect = -1;

      order.forEach((oldIdx, newIdx) => {
        shuffled.push(cleanOpts[oldIdx]);
        if (oldIdx === correctIdx) newCorrect = newIdx;
      });

      return {
        qText,
        options: shuffled,
        correctIndex: newCorrect,
        userChoice: null,
      };
    });
  }

  const payload = readPayload();
  const samplePayload = {
    title: 'Pick the right option',
    data: {
      text: `dog| कुत्ता _____ पर बैठा है।|ज़मीन,किनारे
hummingbird| चिड़िया _______ में उड़ रही है।|आकाश,खेत
fish| मछली ________ में तैरती है।|पानी,जंगल`,
    },
  };

  const usePayload = payload || samplePayload;
  const rawText = usePayload?.data?.text || usePayload?.text || '';

  let questions = parseClassify(rawText);

  questions = shuffleArray(questions);

  let current = 0;
  let score = 0;
  let attempted = 0;
  const total = questions.length;

  // UI elements
  const content = document.getElementById('content');
  const scoreBox = document.getElementById('scoreBox');
  const nextBtn = document.getElementById('nextBtn');
  const finalWrap = document.getElementById('finalWrap');
  const summaryList = document.getElementById('summaryList');
  const finalScore = document.getElementById('finalScore');
  const doneBtn = document.getElementById('doneBtn');
  const cardRoot = document.getElementById('cardRoot');

  const titleEl = document.getElementById('actTitle');
  if (titleEl)
    titleEl.textContent =
      usePayload.title || usePayload.data?.title || 'Activity';

  function updateScoreUI() {
    scoreBox.textContent = `Score: ${score} / ${attempted}`;
  }

  function createIconSpan(cls, text) {
    const sp = document.createElement('span');
    sp.className = 'markIcon ' + cls;
    sp.textContent = text;
    sp.style.display = 'none';
    return sp;
  }

  function renderQuestion(idx) {
    const q = questions[idx];
    if (!q) return;

    content.innerHTML = '';
    nextBtn.disabled = true;
    nextBtn.style.display = 'none';

    const num = document.createElement('div');
    num.className = 'small';
    num.textContent = idx + 1 + ')';

    const qtext = document.createElement('div');
    qtext.className = 'qText';
    qtext.innerHTML = q.qText;

    content.appendChild(num);
    content.appendChild(qtext);

    const row = document.createElement('div');
    row.className = 'optionsRow';

    q.options.forEach((opt, i) => {
      const btn = document.createElement('div');
      btn.className = 'optBtn';
      btn.dataset.idx = i;
      btn.textContent = opt;

      const tickEl = createIconSpan('tick', '✓');
      const crossEl = createIconSpan('cross', '✘');
      btn.appendChild(tickEl);
      btn.appendChild(crossEl);

      btn.addEventListener('click', function () {
        if (q.userChoice !== null) return;

        q.userChoice = i;
        attempted++;

        if (i === q.correctIndex) {
          btn.classList.add('selected');
          score++;
          tickEl.style.display = 'block';
        } else {
          btn.classList.add('wrong');
          crossEl.style.display = 'block';

          const correctBtn = row.querySelector(
            `[data-idx="${q.correctIndex}"]`
          );
          if (correctBtn) {
            const t = correctBtn.querySelector('.markIcon.tick');
            if (t) t.style.display = 'block';
            correctBtn.classList.add('selected');
          }
        }

        updateScoreUI();
        nextBtn.disabled = false;
        nextBtn.style.display = 'inline-block';
      });

      row.appendChild(btn);
    });

    content.appendChild(row);
    nextBtn.textContent = idx + 1 === total ? 'Finish' : 'Next';
  }

  nextBtn.addEventListener('click', function () {
    if (current + 1 < total) {
      current++;
      renderQuestion(current);
    } else {
      showSummary();
    }
  });

  function showSummary() {
    cardRoot.style.display = 'none';
    finalWrap.style.display = 'block';

    summaryList.innerHTML = '';
    questions.forEach((q, i) => {
      const div = document.createElement('div');
      div.className = 'summaryItem';

      const user =
        q.userChoice === null ? '(no answer)' : q.options[q.userChoice];
      const correct = q.options[q.correctIndex];
      const color = q.userChoice === q.correctIndex ? 'green' : 'red';

      div.innerHTML = `
        <strong>${i + 1})</strong> ${q.qText}<br>
        Answer: <span style="color:${color}">${user}</span>
        — Correct: <strong>${correct}</strong>
      `;
      summaryList.appendChild(div);
    });

    finalScore.textContent = `Score: ${score} / ${attempted}`;
  }

  doneBtn.addEventListener('click', function () {
    const msg = JSON.stringify({
      done: true,
      score: score,
      total: attempted,
    });
    window.parent.postMessage(msg, '*');
    doneBtn.disabled = true;
    doneBtn.textContent = 'Sent';
  });

  updateScoreUI();
  renderQuestion(current);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !nextBtn.disabled) nextBtn.click();
  });
})();
