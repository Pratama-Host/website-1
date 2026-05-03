"use strict";

(function () {

  const CONFIG = Object.freeze({
    kodeRahasia:    "KODEKUSTOMU",
    triggerClicks:  5,
    triggerWindow:  2000,
    typewriterMs:   52,
    pesanTypewriter:"Hai, kamu... 🌸\nAku mau ngasih tau sesuatu\nyang udah lama aku simpan.",
    pesanKedua:     "Makasih udah ada. ✨\nSemoga harimu selalu\nseindah senyummu. 💕",
    fotoFallback:   "https://picsum.photos/400/500?blur=2",
    transisiMs:     900,
    jumlahBintang:  55,
  });

  let clickCount = 0;
  let lastClick  = 0;
  let isPlaying  = false;
  let entryBg    = null;
  let mainBg     = null;

  /* ── BOOT ─────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", function () {
    const el = queryAll();
    if (!el) return;

    setupFotoFallback(el.foto);
    setupAudio(el.audio, el.btnMusik);
    setupTrigger(el.trigger, el.modal, el.input);
    setupModal(el.modal, el.input, el.errorMsg, el.closeBtn);
    setupFormSubmit(el);
    setupMusikBtn(el.btnMusik, el.audio);

    entryBg = createSubtleCanvas("bg-canvas", "entry");
  });

  /* ── QUERY ────────────────────────────────────────────── */
  function queryAll() {
    const ids = {
      trigger:"trigger", modal:"modal-kode", input:"kode-input",
      errorMsg:"error-msg", closeBtn:"modal-close", pintu:"pintu-masuk",
      utama:"halaman-utama", pesanType:"pesan-typewriter",
      pesanDua:"pesan-dua", btnMusik:"btn-musik", audio:"audio-bg", foto:"foto-utama",
    };
    const out = {};
    for (const [k, id] of Object.entries(ids)) {
      const node = document.getElementById(id);
      if (!node) { console.warn("[EE] Missing:", id); return null; }
      out[k] = node;
    }
    out.kartu = document.querySelector(".kartu");
    return out;
  }

  /* ── FOTO FALLBACK ────────────────────────────────────── */
  function setupFotoFallback(foto) {
    foto.addEventListener("error", function h() {
      foto.removeEventListener("error", h);
      foto.src = CONFIG.fotoFallback;
    });
  }

  /* ── AUDIO ────────────────────────────────────────────── */
  function setupAudio(audio, btn) {
    if (!audio) return;
    audio.addEventListener("error", function () { btn.classList.add("hidden"); });
  }

  /* ── TRIGGER ──────────────────────────────────────────── */
  function setupTrigger(trigger, modal, input) {
    function activate() {
      const now = Date.now();
      clickCount = (now - lastClick > CONFIG.triggerWindow) ? 1 : clickCount + 1;
      lastClick  = now;
      if (clickCount >= CONFIG.triggerClicks) { clickCount = 0; openModal(modal, input); }
    }
    trigger.addEventListener("click", activate);
    trigger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
    });
  }

  /* ── MODAL ────────────────────────────────────────────── */
  function setupModal(modal, input, errorMsg, closeBtn) {
    closeBtn.addEventListener("click", function () { closeModal(modal, input, errorMsg); });
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal(modal, input, errorMsg);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.classList.contains("hidden"))
        closeModal(modal, input, errorMsg);
    });
    modal.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      const f = Array.from(modal.querySelectorAll(
        "button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex='-1'])"
      ));
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0])
        { e.preventDefault(); f[f.length-1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length-1])
        { e.preventDefault(); f[0].focus(); }
    });
  }

  function openModal(modal, input) {
    modal.classList.remove("hidden");
    modal.removeAttribute("aria-hidden");
    const err = document.getElementById("error-msg");
    if (err) { err.classList.add("hidden"); err.textContent = ""; }
    input.value = "";
    requestAnimationFrame(function () { input.focus(); });
  }

  function closeModal(modal, input, errorMsg) {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden","true");
    input.value = "";
    if (errorMsg) { errorMsg.textContent = ""; errorMsg.classList.add("hidden"); }
  }

  /* ── FORM SUBMIT ──────────────────────────────────────── */
  function setupFormSubmit(el) {
    const { modal, input, errorMsg, pintu, utama, pesanType, pesanDua, btnMusik, audio, kartu } = el;
    const submitBtn = document.getElementById("kode-submit");

    function handle() {
      if (input.value.trim().toUpperCase() === CONFIG.kodeRahasia.toUpperCase()) {
        closeModal(modal, input, errorMsg);
        bukaHalamanUtama(pintu, utama, pesanType, pesanDua, btnMusik, audio, kartu);
      } else {
        errorMsg.textContent = "Kode salah, coba lagi 🥺";
        errorMsg.classList.remove("hidden");
        input.classList.add("shake");
        input.addEventListener("animationend", function () {
          input.classList.remove("shake");
        }, { once: true });
        input.value = "";
        input.focus();
      }
    }

    submitBtn.addEventListener("click", handle);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); handle(); }
    });
  }

  /* ── MUSIK ────────────────────────────────────────────── */
  function setupMusikBtn(btn, audio) {
    if (!btn || !audio) return;
    btn.addEventListener("click", function () {
      if (audio.paused) {
        audio.play().then(function () {
          isPlaying = true; updateBtn(btn, true);
        }).catch(function () { isPlaying = false; updateBtn(btn, false); });
      } else {
        audio.pause(); isPlaying = false; updateBtn(btn, false);
      }
    });
  }

  function updateBtn(btn, playing) {
    const label = btn.querySelector(".musik-label");
    if (label) label.textContent = playing ? "Pause Musik" : "Play Musik";
    btn.classList.toggle("playing", playing);
    btn.setAttribute("aria-label", playing ? "Pause musik" : "Play musik");
  }

  /* ── BUKA HALAMAN UTAMA ───────────────────────────────── */
  function bukaHalamanUtama(pintu, utama, pesanType, pesanDua, btnMusik, audio, kartu) {
    if (audio) {
      audio.play()
        .then(function () { isPlaying = true; btnMusik.classList.remove("hidden"); updateBtn(btnMusik, true); })
        .catch(function () { btnMusik.classList.remove("hidden"); updateBtn(btnMusik, false); });
    }

    pintu.classList.add("fade-out");

    setTimeout(function () {
      if (entryBg) { entryBg.stop(); entryBg = null; }

      pintu.style.display = "none";
      utama.classList.remove("hidden");
      utama.removeAttribute("aria-hidden");
      utama.style.display = "flex";

      void utama.offsetWidth;
      utama.classList.add("fade-in");

      mainBg = createSubtleCanvas("main-bg-canvas", "main");
      spawnStars();
      staggerIn(kartu);
      setTimeout(function () { initTilt(kartu); }, 700);
      typewriter(pesanType, pesanDua);

    }, CONFIG.transisiMs);
  }

  /* ── STAGGER ENTRANCE ─────────────────────────────────── */
  function staggerIn(kartu) {
    if (!kartu) return;
    const children = Array.from(kartu.children);
    children.forEach(function (child, i) {
      child.style.opacity   = "0";
      child.style.transform = "translateY(22px)";
      child.style.transition = "none";
      setTimeout(function () {
        child.style.transition = "opacity 0.8s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)";
        child.style.opacity    = "";
        child.style.transform  = "";
      }, 150 + i * 130);
    });
  }

  /* ── GENTLE 3D TILT ───────────────────────────────────── */
  function initTilt(kartu) {
    if (!kartu) return;
    let tX = 0, tY = 0, cX = 0, cY = 0;

    kartu.addEventListener("mousemove", function (e) {
      const r = kartu.getBoundingClientRect();
      tX = ((e.clientY - r.top)  / r.height - 0.5) * -6;
      tY = ((e.clientX - r.left) / r.width  - 0.5) *  6;
    });
    kartu.addEventListener("mouseleave", function () { tX = 0; tY = 0; });

    (function loop() {
      cX += (tX - cX) * 0.07;
      cY += (tY - cY) * 0.07;
      kartu.style.transform =
        `perspective(1000px) rotateX(${cX.toFixed(3)}deg) rotateY(${cY.toFixed(3)}deg)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ── TYPEWRITER ───────────────────────────────────────── */
  function typewriter(pesanType, pesanDua) {
    const chars = Array.from(CONFIG.pesanTypewriter);
    let i = 0;
    pesanType.innerHTML = '<span class="tw-cursor" aria-hidden="true"></span>';
    const cursor = pesanType.querySelector(".tw-cursor");

    const iv = setInterval(function () {
      if (i >= chars.length) {
        clearInterval(iv);
        setTimeout(function () { cursor.classList.add("tw-cursor--done"); }, 400);
        setTimeout(function () {
          pesanDua.textContent = CONFIG.pesanKedua;
          pesanDua.removeAttribute("aria-hidden");
          pesanDua.classList.add("visible");
        }, 900);
        return;
      }
      const ch = chars[i];
      cursor.insertAdjacentHTML("beforebegin", ch === "\n" ? "<br>" : esc(ch));
      i++;
    }, CONFIG.typewriterMs);
  }

  /* ── BINTANG MELAYANG ─────────────────────────────────── */
  function spawnStars() {
    const layer = document.getElementById("stars-layer");
    if (!layer) return;
    const frag  = document.createDocumentFragment();
    const glyphs = ["✦","·","✧","⋆","✩","°"];

    for (let i = 0; i < CONFIG.jumlahBintang; i++) {
      const s   = document.createElement("div");
      const dur = 8 + Math.random() * 14;
      const del = Math.random() * 10;
      const sz  = 8 + Math.random() * 12;

      s.className = "star-particle";
      s.setAttribute("aria-hidden","true");
      s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      s.style.cssText = [
        `left:${(Math.random() * 98).toFixed(1)}vw`,
        `font-size:${sz}px`,
        `animation-duration:${dur.toFixed(2)}s`,
        `animation-delay:-${del.toFixed(2)}s`,
        `opacity:${(0.2 + Math.random() * 0.45).toFixed(2)}`,
      ].join(";");

      frag.appendChild(s);
    }
    layer.appendChild(frag);
  }

  /* ── SUBTLE BACKGROUND CANVAS ─────────────────────────── */
  function createSubtleCanvas(id, mode) {
    const canvas = document.getElementById(id);
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    let raf;

    const colors = mode === "entry"
      ? ["#3d1a2e","#1a1030","#0d1a2e"]
      : ["#2e1220","#1a0d28","#0d1520"];

    function resize() {
      canvas.width  = canvas.offsetWidth  || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    }
    resize();
    new ResizeObserver(resize).observe(canvas.parentElement || document.body);

    const blobs = colors.map(function (c) {
      return {
        x: Math.random(), y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0006,
        vy: (Math.random() - 0.5) * 0.0006,
        r: 0.35 + Math.random() * 0.2,
        color: c,
      };
    });

    function draw() {
      const W = canvas.width, H = canvas.height;
      if (!W || !H) { raf = requestAnimationFrame(draw); return; }

      ctx.clearRect(0,0,W,H);
      ctx.globalCompositeOperation = "screen";

      blobs.forEach(function (b) {
        b.x += b.vx; b.y += b.vy;
        if (b.x < 0 || b.x > 1) b.vx *= -1;
        if (b.y < 0 || b.y > 1) b.vy *= -1;

        const x = b.x * W, y = b.y * H, r = b.r * Math.min(W,H);
        const g = ctx.createRadialGradient(x,y,0,x,y,r);
        const [r2,g2,b2] = hexRgb(b.color);
        g.addColorStop(0,   `rgba(${r2},${g2},${b2},0.55)`);
        g.addColorStop(0.5, `rgba(${r2},${g2},${b2},0.15)`);
        g.addColorStop(1,   `rgba(${r2},${g2},${b2},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }
    draw();
    return { stop: function () { cancelAnimationFrame(raf); } };
  }

  /* ── UTIL ─────────────────────────────────────────────── */
  function hexRgb(hex) {
    return [
      parseInt(hex.slice(1,3),16),
      parseInt(hex.slice(3,5),16),
      parseInt(hex.slice(5,7),16),
    ];
  }

  function esc(s) {
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

})();
