/* Hoạt hình trực quan thuật toán sắp xếp — vanilla JS + Canvas.
   Tự khởi tạo trên mọi phần tử <div class="sort-viz"></div>.
   Thuộc tính tuỳ chọn: data-algos="bubble,selection,insertion,merge,quick"
                        data-size="30"  data-speed="60" (ms mỗi bước). */
(function () {
  "use strict";

  // ---- Sinh danh sách "bước" (frames) cho từng thuật toán ----
  // Mỗi frame: {array:[...], compare:[i,j], swap:[i,j], sorted:[...]}
  function framesBubble(a) {
    const arr = a.slice(), frames = [], n = arr.length, done = [];
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        frames.push({ array: arr.slice(), compare: [j, j + 1], sorted: done.slice() });
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          frames.push({ array: arr.slice(), swap: [j, j + 1], sorted: done.slice() });
        }
      }
      done.push(n - 1 - i);
    }
    done.push(0);
    frames.push({ array: arr.slice(), sorted: done.slice() });
    return frames;
  }

  function framesSelection(a) {
    const arr = a.slice(), frames = [], n = arr.length, done = [];
    for (let i = 0; i < n; i++) {
      let min = i;
      for (let j = i + 1; j < n; j++) {
        frames.push({ array: arr.slice(), compare: [min, j], sorted: done.slice() });
        if (arr[j] < arr[min]) min = j;
      }
      if (min !== i) {
        [arr[i], arr[min]] = [arr[min], arr[i]];
        frames.push({ array: arr.slice(), swap: [i, min], sorted: done.slice() });
      }
      done.push(i);
    }
    frames.push({ array: arr.slice(), sorted: done.slice() });
    return frames;
  }

  function framesInsertion(a) {
    const arr = a.slice(), frames = [], n = arr.length;
    for (let i = 1; i < n; i++) {
      let j = i;
      while (j > 0) {
        frames.push({ array: arr.slice(), compare: [j - 1, j] });
        if (arr[j - 1] > arr[j]) {
          [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
          frames.push({ array: arr.slice(), swap: [j - 1, j] });
          j--;
        } else break;
      }
    }
    frames.push({ array: arr.slice(), sorted: arr.map((_, k) => k) });
    return frames;
  }

  function framesMerge(a) {
    const arr = a.slice(), frames = [];
    function merge(lo, mid, hi) {
      const left = arr.slice(lo, mid + 1), right = arr.slice(mid + 1, hi + 1);
      let i = 0, j = 0, k = lo;
      while (i < left.length && j < right.length) {
        frames.push({ array: arr.slice(), compare: [lo + i, mid + 1 + j] });
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else arr[k++] = right[j++];
        frames.push({ array: arr.slice(), swap: [k - 1, k - 1] });
      }
      while (i < left.length) { arr[k++] = left[i++]; frames.push({ array: arr.slice(), swap: [k - 1, k - 1] }); }
      while (j < right.length) { arr[k++] = right[j++]; frames.push({ array: arr.slice(), swap: [k - 1, k - 1] }); }
    }
    function sort(lo, hi) {
      if (lo >= hi) return;
      const mid = (lo + hi) >> 1;
      sort(lo, mid); sort(mid + 1, hi); merge(lo, mid, hi);
    }
    sort(0, arr.length - 1);
    frames.push({ array: arr.slice(), sorted: arr.map((_, k) => k) });
    return frames;
  }

  function framesQuick(a) {
    const arr = a.slice(), frames = [];
    function partition(lo, hi) {
      const pivot = arr[hi];
      let i = lo;
      for (let j = lo; j < hi; j++) {
        frames.push({ array: arr.slice(), compare: [j, hi] });
        if (arr[j] < pivot) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          frames.push({ array: arr.slice(), swap: [i, j] });
          i++;
        }
      }
      [arr[i], arr[hi]] = [arr[hi], arr[i]];
      frames.push({ array: arr.slice(), swap: [i, hi] });
      return i;
    }
    function sort(lo, hi) {
      if (lo >= hi) return;
      const p = partition(lo, hi);
      sort(lo, p - 1); sort(p + 1, hi);
    }
    sort(0, arr.length - 1);
    frames.push({ array: arr.slice(), sorted: arr.map((_, k) => k) });
    return frames;
  }

  const GENERATORS = {
    bubble: { name: "Sắp xếp nổi bọt (Bubble Sort)", fn: framesBubble },
    selection: { name: "Sắp xếp chọn (Selection Sort)", fn: framesSelection },
    insertion: { name: "Sắp xếp chèn (Insertion Sort)", fn: framesInsertion },
    merge: { name: "Sắp xếp trộn (Merge Sort)", fn: framesMerge },
    quick: { name: "Sắp xếp nhanh (Quick Sort)", fn: framesQuick }
  };

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.body).getPropertyValue(name);
    return (v && v.trim()) || fallback;
  }

  function randomArray(n) {
    const a = [];
    for (let i = 0; i < n; i++) a.push(Math.floor(Math.random() * 95) + 5);
    return a;
  }

  function initViz(root) {
    const algoKeys = (root.dataset.algos || "bubble,selection,insertion,merge,quick")
      .split(",").map(s => s.trim()).filter(k => GENERATORS[k]);
    const size = Math.max(5, Math.min(80, parseInt(root.dataset.size || "30", 10)));
    let stepMs = Math.max(5, parseInt(root.dataset.speed || "60", 10));

    root.innerHTML = "";
    const bar = document.createElement("div");
    bar.className = "sv-controls";

    const sel = document.createElement("select");
    sel.className = "sv-select";
    algoKeys.forEach(k => {
      const o = document.createElement("option");
      o.value = k; o.textContent = GENERATORS[k].name; sel.appendChild(o);
    });

    const btnPlay = document.createElement("button");
    btnPlay.className = "sv-btn"; btnPlay.textContent = "⏸ Tạm dừng";
    const btnShuffle = document.createElement("button");
    btnShuffle.className = "sv-btn"; btnShuffle.textContent = "🔀 Trộn lại";

    const speedWrap = document.createElement("label");
    speedWrap.className = "sv-speed"; speedWrap.textContent = "Tốc độ ";
    const speed = document.createElement("input");
    speed.type = "range"; speed.min = "5"; speed.max = "200"; speed.step = "5";
    speed.value = String(205 - stepMs); // thanh trượt: phải = nhanh
    speedWrap.appendChild(speed);

    bar.append(sel, btnPlay, btnShuffle, speedWrap);

    const canvas = document.createElement("canvas");
    canvas.className = "sv-canvas";
    const status = document.createElement("div");
    status.className = "sv-status";

    root.append(bar, canvas, status);

    const ctx = canvas.getContext("2d");
    let base = randomArray(size);
    let frames = [], idx = 0, playing = true, timer = null, algo = algoKeys[0];

    function buildFrames() {
      frames = GENERATORS[algo].fn(base);
      idx = 0;
    }

    function resize() {
      const w = root.clientWidth || 640;
      const h = Math.max(180, Math.round(w * 0.38));
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      const f = frames[idx] || { array: base };
      const arr = f.array, n = arr.length;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const gap = n > 50 ? 1 : 2;
      const bw = (w - gap * (n - 1)) / n;
      const cBar = cssVar("--sv-bar", "#4db6ac");
      const cCmp = cssVar("--sv-compare", "#ffb74d");
      const cSwp = cssVar("--sv-swap", "#e57373");
      const cDone = cssVar("--sv-sorted", "#81c784");
      const cmp = f.compare || [], swp = f.swap || [], sorted = new Set(f.sorted || []);
      for (let i = 0; i < n; i++) {
        const bh = (arr[i] / 100) * (h - 6);
        let color = cBar;
        if (sorted.has(i)) color = cDone;
        if (cmp.includes(i)) color = cCmp;
        if (swp.includes(i)) color = cSwp;
        ctx.fillStyle = color;
        ctx.fillRect(i * (bw + gap), h - bh, bw, bh);
      }
    }

    function tick() {
      draw();
      const pct = frames.length ? Math.round((idx / (frames.length - 1)) * 100) : 0;
      status.textContent = GENERATORS[algo].name + " — bước " + idx + "/" +
        (frames.length - 1) + " (" + pct + "%)";
      if (!playing) return;
      idx++;
      if (idx >= frames.length) {
        // Xong một lượt → dừng 1 giây rồi trộn lại, chạy tiếp liên tục.
        idx = frames.length - 1; draw();
        clearTimeout(timer);
        timer = setTimeout(() => { base = randomArray(size); buildFrames(); loop(); }, 1000);
        return;
      }
      timer = setTimeout(tick, stepMs);
    }

    function loop() { clearTimeout(timer); if (playing) tick(); else draw(); }

    sel.addEventListener("change", () => { algo = sel.value; base = randomArray(size); buildFrames(); loop(); });
    btnPlay.addEventListener("click", () => {
      playing = !playing;
      btnPlay.textContent = playing ? "⏸ Tạm dừng" : "▶ Chạy";
      loop();
    });
    btnShuffle.addEventListener("click", () => { base = randomArray(size); buildFrames(); loop(); });
    speed.addEventListener("input", () => { stepMs = 205 - parseInt(speed.value, 10); });
    window.addEventListener("resize", () => { resize(); draw(); });

    resize(); buildFrames(); loop();
  }

  function initAll() {
    document.querySelectorAll(".sort-viz").forEach(el => {
      if (!el.dataset.svInit) { el.dataset.svInit = "1"; initViz(el); }
    });
  }

  // MkDocs Material dùng navigation.instant (SPA) → khởi tạo lại sau mỗi lần chuyển trang.
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initAll);
  } else {
    document.addEventListener("DOMContentLoaded", initAll);
  }
})();
