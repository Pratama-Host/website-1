"use strict";

(function () {
  /* ─── KONFIGURASI ────────────────────────────────────────────────── */
  const CONFIG = Object.freeze({
    kodeRahasia:   "KODEKUSTOMU",   // ganti sesuai kode yang diinginkan
    triggerClicks: 5,
    triggerWindow: 2000,            // ms — jendela waktu multi-klik
    typewriterDelay: 50,            // ms per karakter
    pesanTypewriter: "Hai, kamu... 🌸\nAku mau ngasih tau sesuatu\nyang udah lama aku simpan.",
    pesanKedua:     "Makasih udah ada. ✨\nSemoga harimu selalu\nseindah kamu. 💕",
    jumlahHati: 18,
    emojiHati:  ["🩷", "💜", "🤍", "🌸", "✨", "💗", "🫧", "🌷"],
    fotoFallback: "https://picsum.photos/400/500?blur=2",
    transisiDurasi: 800,            // ms — durasi fade in/out
  });

  /* ─── STATE ──────────────────────────────────────────────────────── */
  let clickCount   = 0;
  let lastClick    = 0;
  let isPlaying    = false;

  /* ─── INIT ───────────────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    const el = getElements();
    if (!el) return;

    setupFotoFallback(el.foto);
    setupAudio(el.audio, el.btnMusik);
    setupTrigger(el.trigger, el.modal, el.input);
    setupModal(el.modal, el.input, el.errorMsg, el.closeBtn, el.form);
    setupFormSubmit(el.form, el.input, el.errorMsg, el.modal, el.pintu, el.utama, el.pesanType, el.pesanDua, el.btnMusik, el.audio);
    setupMusikBtn(el.btnMusik, el.audio);
  }

  /* ─── ELEMEN ─────────────────────────────────────────────────────── */
  function getElements() {
    const ids = [
      "trigger", "modal-kode", "kode-input", "error-msg",
      "modal-close", "kode-form", "pintu-masuk", "halaman-utama",
      "pesan-typewriter", "pesan-dua", "btn-musik", "audio-bg", "foto-utama",
    ];

    const elements = {};
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) {
        console.warn("[EasterEgg] Elemen tidak ditemukan:", id);
        return null;
      }
      elements[id] = el;
    }

    return {
      trigger:    elements["trigger"],
      modal:      elements["modal-kode"],
      input:      elements["kode-input"],
      errorMsg:   elements["error-msg"],
      closeBtn:   elements["modal-close"],
      form:       elements["kode-form"],
      pintu:      elements["pintu-masuk"],
      utama:      elements["halaman-utama"],
      pesanType:  elements["pesan-typewriter"],
      pesanDua:   elements["pesan-dua"],
      btnMusik:   elements["btn-musik"],
      audio:      elements["audio-bg"],
      foto:       elements["foto-utama"],
    };
  }

  /* ─── FOTO FALLBACK ──────────────────────────────────────────────── */
  function setupFotoFallback(foto) {
    foto.addEventListener("error", function onFotoError() {
      foto.removeEventListener("error", onFotoError);
      foto.src = CONFIG.fotoFallback;
    });
  }

  /* ─── AUDIO ──────────────────────────────────────────────────────── */
  function setupAudio(audio, btnMusik) {
    if (!audio || typeof audio.play !== "function") return;

    audio.addEventListener("error", function () {
      btnMusik.classList.add("hidden");
    });
  }

  /* ─── TRIGGER (klik tersembunyi) ─────────────────────────────────── */
  function setupTrigger(trigger, modal, input) {
    function handleActivate() {
      const now   = Date.now();
      const delta = now - lastClick;
      lastClick   = now;

      clickCount = (delta > CONFIG.triggerWindow) ? 1 : clickCount + 1;

      if (clickCount >= CONFIG.triggerClicks) {
        clickCount = 0;
        openModal(modal, input);
      }
    }

    trigger.addEventListener("click", handleActivate);
    trigger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleActivate();
      }
    });
  }

  /* ─── MODAL ──────────────────────────────────────────────────────── */
  function setupModal(modal, input, errorMsg, closeBtn, _form) {
    // Tutup dengan tombol close
    closeBtn.addEventListener("click", function () {
      closeModal(modal, input, errorMsg);
    });

    // Tutup klik di luar panel
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal(modal, input, errorMsg);
    });

    // Tutup dengan Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal(modal, input, errorMsg);
      }
    });

    // Focus trap di dalam modal
    modal.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;

      const focusable = Array.from(
        modal.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ─── FORM SUBMIT ────────────────────────────────────────────────── */
  function setupFormSubmit(form, input, errorMsg, modal, pintu, utama, pesanType, pesanDua, btnMusik, audio) {
    const submitBtn = document.getElementById("kode-submit");

    function handleSubmit() {
      const value  = input.value.trim().toUpperCase();
      const secret = CONFIG.kodeRahasia.toUpperCase();

      if (value === secret) {
        closeModal(modal, input, errorMsg);
        bukaHalamanUtama(pintu, utama, pesanType, pesanDua, btnMusik, audio);
        return;
      }

      tampilkanError(errorMsg, input, "Kode salah, coba lagi 🥺");
    }

    submitBtn.addEventListener("click", handleSubmit);

    // Submit saat tekan Enter di input
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    });
  }

  /* ─── MUSIK ──────────────────────────────────────────────────────── */
  function setupMusikBtn(btnMusik, audio) {
    if (!btnMusik || !audio) return;

    btnMusik.addEventListener("click", function () {
      if (audio.paused) {
        audio.play()
          .then(function () {
            isPlaying = true;
            updateMusikBtn(btnMusik, true);
          })
          .catch(function () {
            isPlaying = false;
            updateMusikBtn(btnMusik, false);
          });
      } else {
        audio.pause();
        isPlaying = false;
        updateMusikBtn(btnMusik, false);
      }
    });
  }

  /* ─── HELPER: UPDATE TOMBOL MUSIK ───────────────────────────────── */
  function updateMusikBtn(btn, playing) {
    btn.textContent    = playing ? "🎵 Pause Musik" : "🎵 Play Musik";
    btn.dataset.state  = playing ? "playing" : "paused";
    btn.setAttribute("aria-label", playing ? "Pause musik" : "Play musik");
    btn.classList.toggle("paused", !playing);
  }

  /* ─── HELPER: TAMPILKAN ERROR ────────────────────────────────────── */
  function tampilkanError(errorMsg, input, teks) {
    errorMsg.textContent = teks;
    errorMsg.classList.remove("hidden");

    input.classList.add("shake");
    input.addEventListener(
      "animationend",
      function () { input.classList.remove("shake"); },
      { once: true }
    );

    input.value = "";
    input.focus();
  }

  /* ─── BUKA / TUTUP MODAL ─────────────────────────────────────────── */
  function openModal(modal, input) {
    modal.classList.remove("hidden");
    modal.removeAttribute("aria-hidden");

    // Reset state
    const errorMsg = document.getElementById("error-msg");
    if (errorMsg) {
      errorMsg.classList.add("hidden");
      errorMsg.textContent = "";
    }
    input.value = "";

    // Fokus ke input setelah transisi
    requestAnimationFrame(function () { input.focus(); });
  }

  function closeModal(modal, input, errorMsg) {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");

    input.value        = "";
    errorMsg.textContent = "";
    errorMsg.classList.add("hidden");
  }

  /* ─── BUKA HALAMAN UTAMA ─────────────────────────────────────────── */
  function bukaHalamanUtama(pintu, utama, pesanType, pesanDua, btnMusik, audio) {
    // Coba putar audio
    if (audio && typeof audio.play === "function") {
      audio.play()
        .then(function () {
          isPlaying = true;
          btnMusik.classList.remove("hidden");
          updateMusikBtn(btnMusik, true);
        })
        .catch(function () {
          // Autoplay diblokir browser → tampilkan tombol manual
          btnMusik.classList.remove("hidden");
          updateMusikBtn(btnMusik, false);
        });
    }

    // Transisi keluar pintu masuk
    pintu.classList.add("fade-out");

    setTimeout(function () {
      pintu.style.display = "none";

      // FIX: hapus kelas 'hidden' & set display flex
      utama.classList.remove("hidden");
      utama.removeAttribute("aria-hidden");
      utama.style.display = "flex";

      // Paksa reflow agar animasi fade-in berjalan
      void utama.offsetWidth;
      utama.classList.add("fade-in");

      spawnHearts(utama);
      typewriterEffect(pesanType, pesanDua);
    }, CONFIG.transisiDurasi);
  }

  /* ─── TYPEWRITER ─────────────────────────────────────────────────── */
  function typewriterEffect(pesanType, pesanDua) {
    const chars = Array.from(CONFIG.pesanTypewriter);
    let index   = 0;
    pesanType.innerHTML = '<span class="tw-cursor" aria-hidden="true"></span>';

    const cursor = pesanType.querySelector(".tw-cursor");

    const interval = setInterval(function () {
      if (index >= chars.length) {
        clearInterval(interval);

        // Hapus kursor setelah selesai
        setTimeout(function () {
          cursor.classList.add("tw-cursor--done");
        }, 600);

        // Tampilkan pesan kedua
        setTimeout(function () {
          pesanDua.textContent = CONFIG.pesanKedua;
          pesanDua.removeAttribute("aria-hidden");
          pesanDua.classList.add("visible");
        }, 1000);

        return;
      }

      const char = chars[index];
      cursor.insertAdjacentHTML(
        "beforebegin",
        char === "\n" ? "<br>" : escapeHTML(char)
      );
      index += 1;
    }, CONFIG.typewriterDelay);
  }

  /* ─── SPAWN HEARTS ───────────────────────────────────────────────── */
  function spawnHearts(container) {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < CONFIG.jumlahHati; i += 1) {
      const heart = document.createElement("div");
      heart.className  = "heart";
      heart.textContent =
        CONFIG.emojiHati[Math.floor(Math.random() * CONFIG.emojiHati.length)];
      heart.setAttribute("aria-hidden", "true");
      heart.style.cssText = [
        `left: ${(Math.random() * 95).toFixed(1)}vw`,
        `animation-duration: ${(6 + Math.random() * 8).toFixed(2)}s`,
        `animation-delay: ${(Math.random() * 5).toFixed(2)}s`,
        `font-size: ${(14 + Math.random() * 16).toFixed(0)}px`,
      ].join(";");

      fragment.appendChild(heart);
    }

    container.appendChild(fragment);
  }

  /* ─── UTIL: HTML ESCAPE ──────────────────────────────────────────── */
  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
