/* Playground JavaScript tương tác cho MkDocs Material.
 *
 * Cách dùng trong Markdown:
 *
 *   <div class="js-demo" data-title="Tiêu đề tuỳ chọn" data-canvas="1">
 *   <textarea class="js-demo-src">
 *   // Viết JS ở đây. console.log(...) sẽ in ra khung kết quả.
 *   // Nếu data-canvas="1": có sẵn biến `canvas` và `ctx` (2D) để vẽ.
 *   print('Xin chào');            // print() là alias của console.log
 *   </textarea>
 *   </div>
 *
 * Component tạo: khung soạn code (có thể sửa), nút "▶ Chạy" / "↺ Đặt lại",
 * và khung kết quả bắt mọi console.log/err. An toàn: chạy trong Function scope,
 * bắt lỗi và in ra thay vì làm hỏng trang.
 */
(function () {
  "use strict";

  function makeConsole(outEl) {
    function line(kind, args) {
      const div = document.createElement("div");
      div.className = "jsd-line jsd-" + kind;
      div.textContent = args.map(fmt).join(" ");
      outEl.appendChild(div);
    }
    function fmt(v) {
      if (typeof v === "string") return v;
      if (v instanceof Error) return v.name + ": " + v.message;
      try { return JSON.stringify(v); } catch (e) { return String(v); }
    }
    return {
      log: (...a) => line("log", a),
      info: (...a) => line("log", a),
      warn: (...a) => line("warn", a),
      error: (...a) => line("error", a),
      clear: () => { outEl.innerHTML = ""; }
    };
  }

  function initDemo(root) {
    const srcEl = root.querySelector(".js-demo-src");
    if (!srcEl) return;
    const original = srcEl.value != null ? srcEl.value : srcEl.textContent;
    const title = root.dataset.title || "";
    const wantCanvas = root.dataset.canvas === "1";

    root.innerHTML = "";
    root.classList.add("jsd");

    if (title) {
      const h = document.createElement("div");
      h.className = "jsd-title"; h.textContent = title;
      root.appendChild(h);
    }

    const ta = document.createElement("textarea");
    ta.className = "jsd-editor";
    ta.spellcheck = false;
    ta.value = original.replace(/^\n/, "").replace(/\s+$/, "");
    ta.rows = Math.min(20, Math.max(4, ta.value.split("\n").length + 1));
    root.appendChild(ta);

    const bar = document.createElement("div");
    bar.className = "jsd-bar";
    const run = document.createElement("button");
    run.className = "jsd-btn jsd-run"; run.textContent = "▶ Chạy";
    const reset = document.createElement("button");
    reset.className = "jsd-btn"; reset.textContent = "↺ Đặt lại";
    bar.append(run, reset);
    root.appendChild(bar);

    let canvas = null, ctx = null;
    if (wantCanvas) {
      canvas = document.createElement("canvas");
      canvas.className = "jsd-canvas";
      canvas.width = 600; canvas.height = 260;
      ctx = canvas.getContext("2d");
      root.appendChild(canvas);
    }

    const out = document.createElement("div");
    out.className = "jsd-output";
    root.appendChild(out);

    const sandbox = makeConsole(out);

    function execute() {
      out.innerHTML = "";
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      const code = ta.value;
      const print = (...a) => sandbox.log(...a);
      try {
        // Chạy với console riêng + print + canvas/ctx (nếu có). Không truy cập biến ngoài.
        const fn = new Function("console", "print", "canvas", "ctx",
          '"use strict";\n' + code);
        fn(sandbox, print, canvas, ctx);
      } catch (e) {
        sandbox.error(e);
      }
    }

    run.addEventListener("click", execute);
    reset.addEventListener("click", () => {
      ta.value = original.replace(/^\n/, "").replace(/\s+$/, "");
      out.innerHTML = "";
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Ctrl/Cmd + Enter để chạy nhanh
    ta.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); execute(); }
    });

    // Chạy sẵn một lần để người đọc thấy kết quả ngay.
    execute();
  }

  function initAll() {
    document.querySelectorAll(".js-demo").forEach(el => {
      if (!el.dataset.jsdInit) { el.dataset.jsdInit = "1"; initDemo(el); }
    });
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initAll); // MkDocs Material SPA
  } else {
    document.addEventListener("DOMContentLoaded", initAll);
  }
})();
