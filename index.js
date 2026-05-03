/* ================================================================
   index.js — TKJ XI-9 | Main JavaScript Module
   Versi 2.0 · Renovasi 2026
   ================================================================ */
"use strict";

/* CACHE CONFIGURATION */
const CACHE_NAME = "tkj-cache-v1";
const OFFLINE_FALLBACK = "page/offline.html";

/* ================================================================
   MODULE: CANVAS PARTICLE NETWORK BACKGROUND
   ================================================================ */
function initNetworkCanvas() {
  const canvas = document.getElementById("network-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let dpr = window.devicePixelRatio || 1;
  let width = 0,
    height = 0;
  let particles = [];
  const PARTICLE_COUNT = Math.floor(
    (window.innerWidth * window.innerHeight) / 3800,
  );
  const LINK_DIST = 110;
  const PARTICLE_SIZE = 2.2;
  const SPEED = 0.09;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  function randomParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(randomParticle());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    // Get theme colors
    const root = document.documentElement;
    const accent =
      getComputedStyle(root).getPropertyValue("--accent").trim() || "#ef4444";
    const accent2 =
      getComputedStyle(root).getPropertyValue("--accent-2").trim() || "#0ea5a4";
    // Draw links
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i],
          b = particles[j];
        const dx = a.x - b.x,
          dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.save();
          ctx.globalAlpha = 0.13 * (1 - dist / LINK_DIST);
          ctx.strokeStyle = accent2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    // Draw particles
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(p.x, p.y, PARTICLE_SIZE, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    }
  }

  function update() {
    for (const p of particles) {
      p.x += p.vx * width * 0.0015;
      p.y += p.vy * height * 0.0015;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      p.x = Math.max(0, Math.min(width, p.x));
      p.y = Math.max(0, Math.min(height, p.y));
    }
  }

  function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
  }

  resize();
  initParticles();
  animate();
  window.addEventListener("resize", () => {
    resize();
    initParticles();
  });
  // Recolor on theme change
  const observer = new MutationObserver(draw);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("network-canvas")) {
    initNetworkCanvas();
  }
});

("use strict");

/* ================================================================
   MODULE: URL VALIDATOR
   ================================================================ */
const URLValidator = (function () {
  return {
    isSafe(url) {
      if (!url || typeof url !== "string") return false;
      const trimmed = url.trim();

      // Cegah javascript: dan data: URIs (XSS risk)
      if (
        trimmed.toLowerCase().startsWith("javascript:") ||
        trimmed.toLowerCase().startsWith("data:")
      ) {
        return false;
      }

      // Izinkan relative paths (./..., ../, /path)
      if (trimmed.startsWith(".") || trimmed.startsWith("/")) {
        return true;
      }

      // Izinkan absolute URLs (http, https)
      try {
        const parsed = new URL(trimmed);
        return ["http:", "https:"].includes(parsed.protocol);
      } catch {
        // Bukan URL valid, tapi mungkin relative path tanpa leading ./
        // Jika hanya berisi path tanpa scheme, izinkan
        return !trimmed.includes("://");
      }
    },
    sanitize(url) {
      return this.isSafe(url) ? url.trim() : "";
    },
  };
})();

/* ================================================================
   MODULE: HERO TYPING + SCROLL PROGRESS + EASTER EGG
   ================================================================ */
function initHeroTyping() {
  const el = document.getElementById("hero-slogan");
  const text =
    (typeof G !== "undefined" && G.sloganHero) ||
    el?.dataset?.fallback ||
    (el && el.textContent) ||
    "";
  if (!el || !text) return;
  el.textContent = "";
  el.classList.add("typing");
  let i = 0;
  const speed = 28; // ms per char
  const t = setInterval(
    () => {
      el.textContent += text.charAt(i++);
      if (i >= text.length) {
        clearInterval(t);
        el.classList.remove("typing");
      }
    },
    speed + Math.floor(Math.random() * 20),
  );
}

function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  let ticking = false;
  function update() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct =
      h > 0 ? Math.min(100, Math.max(0, (window.scrollY / h) * 100)) : 0;
    bar.style.width = pct + "%";
    ticking = false;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
  update();
}

/* Simple secret code (typing 't','k','j') */
function initSecretCode() {
  const seq = ["t", "k", "j"];
  let buf = [];
  document.addEventListener("keydown", (e) => {
    buf.push(e.key.toLowerCase());
    if (buf.length > seq.length) buf.shift();
    if (buf.join("") === seq.join("")) {
      // toggle accent color
      const root = document.documentElement;
      const current =
        getComputedStyle(root).getPropertyValue("--accent").trim() || "#ef4444";
      const alt = current === "#ef4444" ? "#0ea5a4" : "#ef4444";
      root.style.setProperty("--accent", alt);
      // small visual toast
      let t = document.getElementById("secret-toast");
      if (!t) {
        t = document.createElement("div");
        t.id = "secret-toast";
        t.setAttribute("role", "status");
        t.className = "toast-text";
        t.style.position = "fixed";
        t.style.right = "18px";
        t.style.bottom = "18px";
        t.style.zIndex = 99999;
        t.innerHTML = "<strong>Rahasia ditemukan!</strong> Warna aksen diubah.";
        document.body.appendChild(t);
      }
      t.classList.add("visible");
      setTimeout(() => t.classList.remove("visible"), 4000);
    }
  });
}

/* ================================================================
   MODULE: THEME
   ================================================================ */
(function initTheme() {
  const root = document.documentElement;
  const validThemes = ["light", "dark", "blue"];
  const defaultTheme = "light";
  let saved = localStorage.getItem("tkj-theme");
  let themeListenerAttached = false;

  if (!validThemes.includes(saved)) {
    saved = defaultTheme;
    localStorage.setItem("tkj-theme", defaultTheme);
  }

  function getThemeButton() {
    return document.getElementById("theme-btn");
  }

  function updateButtonIcon(t) {
    const btn = getThemeButton();
    if (!btn) return;
    const icon = btn.querySelector("i");
    if (icon) {
      if (t === "dark") icon.className = "fas fa-sun";
      else if (t === "light") icon.className = "fas fa-moon";
      else icon.className = "fas fa-palette";
    }
    btn.setAttribute(
      "aria-label",
      t === "dark"
        ? "Aktifkan mode terang"
        : t === "light"
          ? "Aktifkan mode biru"
          : "Aktifkan mode gelap",
    );
  }

  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    localStorage.setItem("tkj-theme", t);
    updateButtonIcon(t);
    const btn = getThemeButton();
    if (!btn) return;
    btn.setAttribute("data-switching", "true");
    document.body.classList.add("theme-switching");
    setTimeout(() => {
      btn.removeAttribute("data-switching");
      document.body.classList.remove("theme-switching");
    }, 600);
  }

  function attachThemeListener() {
    if (themeListenerAttached) return;
    const btn = getThemeButton();
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const current = root.getAttribute("data-theme") || defaultTheme;
      const idx = validThemes.indexOf(current);
      const next = validThemes[(idx + 1) % validThemes.length];
      applyTheme(next);
    });
    themeListenerAttached = true;
    updateButtonIcon(root.getAttribute("data-theme") || saved);
  }

  applyTheme(saved);
  document.addEventListener("DOMContentLoaded", () => {
    attachThemeListener();
    setTimeout(attachThemeListener, 100);
  });
  window.addEventListener("load", attachThemeListener);

  const buttonObserver = new MutationObserver(() => {
    if (!themeListenerAttached && getThemeButton()) {
      attachThemeListener();
      buttonObserver.disconnect();
    }
  });
  buttonObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();

/* ================================================================
   MODULE: TAB BAR ACTIVE STATE
   ================================================================ */
(function initTabActive() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".tab-item").forEach((tab) => {
    const tabPage = (tab.getAttribute("href") || "").split("/").pop();
    if (tabPage === page || (page === "" && tabPage === "index.html")) {
      tab.classList.add("active");
      tab.setAttribute("aria-current", "page");
    }
  });
})();

/* ================================================================
   MODULE: PAGE PROGRESS BAR
   ================================================================ */
(function initProgressBar() {
  const bar = document.getElementById("page-progress");
  if (!bar) return;
  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (
      href.startsWith("#") ||
      href.startsWith("javascript") ||
      href.startsWith("mailto") ||
      href.startsWith("http")
    )
      return;
    link.addEventListener("click", (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      bar.style.width = "0%";
      bar.classList.add("active");
      let w = 0;
      const t = setInterval(() => {
        w = Math.min(w + Math.random() * 15, 80);
        bar.style.width = w + "%";
      }, 80);
      setTimeout(() => {
        clearInterval(t);
        bar.style.width = "100%";
        setTimeout(() => {
          bar.classList.remove("active");
          bar.style.width = "0%";
        }, 400);
      }, 400);
    });
  });
})();

/* ================================================================
   MODULE: GLOBAL INTERSECTION OBSERVER (singleton)
   ================================================================ */
const RevealObserver = (function () {
  let io = null;
  function getObserver() {
    if (!io)
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("on");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -10px 0px" },
      );
    return io;
  }
  return {
    observe(els) {
      const o = getObserver();
      (els instanceof NodeList || Array.isArray(els) ? els : [els]).forEach(
        (el) => {
          if (el && !el.classList.contains("on")) o.observe(el);
        },
      );
    },
  };
})();

function initReveal() {
  RevealObserver.observe(document.querySelectorAll(".reveal:not(.on)"));
}

/* ================================================================
   FOCUS TRAP (simple, works for modal/lightbox)
   enableFocusTrap(container) => traps Tab within container
   disableFocusTrap() => removes trap and restores focus
   ================================================================ */
let _focusTrap = null;
let _prevActive = null;
function enableFocusTrap(container) {
  try {
    if (!_isElement(container)) return;
  } catch {}
  _prevActive = document.activeElement;
  const focusable = container.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
  );
  const list = Array.from(focusable).filter(
    (el) => !el.hasAttribute("disabled"),
  );
  if (!list.length) {
    // ensure modal-close receives focus
    container
      .querySelector("button, [data-focus]")
      ?.setAttribute("tabindex", "0");
  }
  _focusTrap = function (e) {
    if (e.key !== "Tab") return;
    const els = Array.from(
      container.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute("disabled"));
    if (!els.length) return;
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  document.addEventListener("keydown", _focusTrap);
}
function disableFocusTrap() {
  if (_focusTrap) {
    document.removeEventListener("keydown", _focusTrap);
    _focusTrap = null;
  }
  try {
    if (_prevActive && _prevActive.focus) _prevActive.focus();
  } catch {}
  _prevActive = null;
}

function _isElement(obj) {
  return obj && obj.nodeType === 1;
}

/* ================================================================
   TERMINAL ASSISTANT (Floating CLI)
   - Toggle with `/` (handled in keyboard shortcuts)
   - Supports simple commands: home, dark, light, gallery
  ================================================================ */
function createTerminalUI() {
  if (document.getElementById("terminal-ui")) return;
  const t = document.createElement("div");
  t.id = "terminal-ui";
  t.setAttribute("role", "dialog");
  t.setAttribute("aria-hidden", "true");
  t.innerHTML = `
    <div class="term-wrap">
      <div class="term-header"><span class="term-title">[ROOT@TKJ-XI9]</span><button class="term-close" aria-label="Tutup terminal">×</button></div>
      <div class="term-log" id="term-log" aria-live="polite"></div>
      <div class="term-input"><span class="term-prompt">$</span><input id="term-input" autocomplete="off" placeholder="ketik perintah, mis. home, dark, gallery" /></div>
    </div>`;
  document.body.appendChild(t);
  t.querySelector(".term-close")?.addEventListener("click", () =>
    toggleTerminal(false),
  );
  const input = t.querySelector("#term-input");
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const cmd = input.value.trim();
      if (!cmd) return;
      appendTerminalLog(`$ ${cmd}`);
      handleTerminalCommand(cmd.toLowerCase());
      input.value = "";
    } else if (e.key === "Escape") {
      toggleTerminal(false);
    }
  });
}

function appendTerminalLog(msg, ok = true) {
  const log = document.getElementById("term-log");
  if (!log) return;
  const line = document.createElement("div");
  line.className = ok ? "term-line ok" : "term-line err";
  line.textContent = msg;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

function handleTerminalCommand(cmd) {
  const isInPage = window.location.pathname.includes("/page/");
  const pagePrefix = isInPage ? "./" : "./page/";
  const rootPrefix = isInPage ? "../" : "./";

  if (cmd === "home") {
    appendTerminalLog("[ROOT@TKJ-XI9]: Redirecting to home...");
    setTimeout(() => {
      window.location.href = rootPrefix + "index.html";
    }, 350);
    return;
  }
  if (cmd === "dark" || cmd === "light") {
    const theme = cmd === "dark" ? "dark" : "light";
    const btn = document.getElementById("theme-btn");
    if (btn) {
      btn.setAttribute("data-switching", "true");
      document.body.classList.add("theme-switching");
    }
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("tkj-theme", theme);
    if (btn) {
      const icon = btn.querySelector("i");
      if (icon)
        icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
      setTimeout(() => {
        btn.removeAttribute("data-switching");
        document.body.classList.remove("theme-switching");
      }, 600);
    }
    appendTerminalLog(`[ROOT@TKJ-XI9]: Theme set to ${theme} — Success!`);
    return;
  }
  if (cmd === "gallery") {
    appendTerminalLog("[ROOT@TKJ-XI9]: Accessing gallery... Success!");
    setTimeout(() => {
      window.location.href = pagePrefix + "gallery.html";
    }, 250);
    return;
  }
  appendTerminalLog(`[ROOT@TKJ-XI9]: Unknown command: ${cmd}`, false);
}

function toggleTerminal(force) {
  createTerminalUI();
  const t = document.getElementById("terminal-ui");
  if (!t) return;
  const isOpen = t.classList.contains("open");
  const show = typeof force === "boolean" ? force : !isOpen;
  t.classList.toggle("open", show);
  t.setAttribute("aria-hidden", String(!show));
  if (show) {
    document.getElementById("term-input")?.focus();
    appendTerminalLog(
      "[ROOT@TKJ-XI9]: Welcome. Type `home`, `dark`, `light`, or `gallery`.",
    );
  }
}

/* ================================================================
   MATRIX / NEURAL BACKGROUND (CSS + mouse tracking)
  ================================================================ */
function createMatrixBG() {
  if (document.getElementById("matrix-bg")) return;
  const el = document.createElement("div");
  el.id = "matrix-bg";
  el.style.pointerEvents = "none";
  document.body.appendChild(el);
  let raf = null;
  document.addEventListener(
    "mousemove",
    (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      el.style.setProperty("--mx", x + "%");
      el.style.setProperty("--my", y + "%");
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.opacity = "1";
        setTimeout(() => {
          el.style.opacity = "0.9";
        }, 120);
      });
    },
    { passive: true },
  );
}

/* ================================================================
   MODULE: COUNTER ANIMATION
   ================================================================ */
function animateCounter(el, target, suffix = "") {
  if (!el || isNaN(target)) return;
  let n = 0;
  const step = Math.max(1, Math.ceil(target / 50));
  const t = setInterval(() => {
    n = Math.min(n + step, target);
    el.textContent = n + suffix;
    if (n >= target) clearInterval(t);
  }, 35);
}

/* ================================================================
   MODULE: SKILL BARS
   FIX: Dipanggil HANYA dari initSkillsPage — tidak di DOMContentLoaded
   ================================================================ */
function initSkillBars() {
  const section = document.querySelector(".skills-list");
  if (!section) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          section.querySelectorAll(".bar-fill").forEach((bar) => {
            bar.style.width = (bar.dataset.level || "0") + "%";
          });
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.2 },
  );
  io.observe(section);
}
/* Add small 'filled' class when bars animate to show shimmer/dot */
function markSkillBarsFilled() {
  document.querySelectorAll(".bar-fill").forEach((bar) => {
    // add filled slightly after width transition
    setTimeout(() => bar.classList.add("filled"), 700);
  });
}

/* ================================================================
   MODULE: AVATAR HELPER
   ================================================================ */
function makeInitials(nama) {
  const parts = (nama || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function renderAvatar(container, nama, foto, sizeClass = "md") {
  if (!container) return;
  const initials = makeInitials(nama);
  const safeClass = `avatar ${sizeClass} avatar-ring`;
  if (foto && URLValidator.isSafe(foto)) {
    const img = document.createElement("img");
    img.src = foto;
    img.alt = nama || "Avatar";
    img.loading = "lazy";
    img.setAttribute("width", "200");
    img.setAttribute("height", "200");
    img.addEventListener("error", () => {
      container.innerHTML = "";
      container.textContent = initials;
      container.className = safeClass;
    });
    container.innerHTML = "";
    container.appendChild(img);
  } else {
    container.textContent = initials;
  }
  container.className = safeClass;
}

/* ================================================================
   MODULE: BACK TO TOP
   ================================================================ */
(function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;
  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("visible", window.scrollY > 300),
    { passive: true },
  );
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
})();

/* ================================================================
   MODULE: KEYBOARD SHORTCUTS
   ================================================================ */
(function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    const isInput = tag === "input" || tag === "textarea" || tag === "select";
    if (e.key === "t" && !isInput && !e.ctrlKey && !e.metaKey)
      document.getElementById("theme-btn")?.click();
    if (e.key === "/" && !isInput) {
      e.preventDefault();
      // Toggle floating terminal assistant
      if (typeof toggleTerminal === "function") toggleTerminal();
    }
    if (e.key === "Escape" && isInput) {
      const s = document.getElementById("member-search");
      if (s && document.activeElement === s) {
        s.value = "";
        s.dispatchEvent(new Event("input"));
        s.blur();
      }
    }
  });
})();

/* ================================================================
   MODULE: COUNTDOWN - REMOVED (User Request)
   ================================================================ */

/* ================================================================
   MODULE: FOOTER SOCIAL MEDIA
   ================================================================ */
function renderFooterSocial() {
  document.querySelectorAll(".footer-social").forEach((container) => {
    if (typeof G === "undefined" || !G.sosmed) return;
    const platforms = [
      { key: "instagram", icon: "fa-brands fa-instagram", label: "Instagram" },
      { key: "youtube", icon: "fa-brands fa-youtube", label: "YouTube" },
      { key: "tiktok", icon: "fa-brands fa-tiktok", label: "TikTok" },
    ];
    container.innerHTML = platforms
      .filter((p) => G.sosmed[p.key] && URLValidator.isSafe(G.sosmed[p.key]))
      .map(
        (p) => `
        <a href="${G.sosmed[p.key]}" target="_blank" rel="noopener noreferrer"
           aria-label="${p.label} TKJ XI-9">
          <i class="${p.icon}" aria-hidden="true"></i><span>${p.label}</span>
        </a>`,
      )
      .join("");
  });
}

/* ================================================================
   MODULE: FOOTER YEAR
   ================================================================ */
(function initFooterYear() {
  document.querySelectorAll(".footer-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();

/* ================================================================
   MODULE: REPLAY INTRO BUTTON
   ================================================================ */
function initReplayIntroBtn() {
  const btn = document.getElementById("replay-intro-btn");
  if (!btn) return;
  if (sessionStorage.getItem("tkj-intro-done")) btn.classList.add("visible");
  btn.addEventListener("click", () => {
    const isInPage = window.location.pathname.includes("/page/");
    const rootPrefix = isInPage ? "../" : "./";
    sessionStorage.removeItem("tkj-intro-done");
    window.location.href = rootPrefix + "index.html";
  });
}

/* ================================================================
   MODULE: ONLINE / OFFLINE INDICATOR
   ================================================================ */
(function initNetworkStatus() {
  let badge = document.getElementById("offline-badge");
  if (!badge) {
    badge = document.createElement("div");
    badge.id = "offline-badge";
    badge.setAttribute("role", "status");
    badge.setAttribute("aria-live", "polite");
    badge.innerHTML =
      '<i class="fas fa-wifi" style="text-decoration:line-through" aria-hidden="true"></i><span>Mode Offline</span>';
    document.body.appendChild(badge);
  }
  function update() {
    badge.classList.toggle("visible", !navigator.onLine);
  }
  window.addEventListener("online", update);
  window.addEventListener("offline", update);
  update();
})();

/* ================================================================
   MODULE: SERVICE WORKER — REGISTRATION + UPDATE TOAST
   ================================================================ */
(function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js", { scope: "./" })
      .then((reg) => {
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              showUpdateToast(newWorker);
            }
          });
        });
      })
      .catch(() => {});
  });
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
})();

function showUpdateToast(newWorker) {
  let toast = document.getElementById("sw-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "sw-toast";
    toast.setAttribute("role", "alert");
    toast.innerHTML = `
      <div class="toast-text">
        <strong>Update Tersedia 🚀</strong>
        Versi baru website sudah siap!
      </div>
      <button class="btn btn-primary btn-sm" id="sw-toast-btn">Perbarui</button>`;
    document.body.appendChild(toast);
  }
  toast.classList.add("visible");
  document.getElementById("sw-toast-btn")?.addEventListener("click", () => {
    toast.classList.remove("visible");
    newWorker.postMessage({ type: "SKIP_WAITING" });
  });
  setTimeout(() => toast.classList.remove("visible"), 30000);
}

/* ================================================================
   DOM READY
   ================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  /* NOTE: initSkillBars() tidak dipanggil di sini — hanya di initSkillsPage() */
  renderFooterSocial();
  initReplayIntroBtn();

  /* Float icons: CSS @media max-width:639px yang handle hide — bukan JS */

  const page = window.location.pathname.split("/").pop() || "index.html";
  if (page === "index.html" || page === "") initIndexPage();
  // Hero typing + scroll progress (global)
  initScrollProgress();
  initSecretCode();
  // Futuristic niceties
  createMatrixBG();
  if (page === "about.html") initAboutPage();
  if (page === "structure.html") initStructurePage();
  if (page === "members.html") initMembersPage();
  if (page === "skills.html") initSkillsPage();
  if (page === "gallery.html") initGalleryPage();
  if (page === "tkj.html") initTkjPage();
  if (page === "admin.html") initAdminPage && initAdminPage();
  if (page === "404.html") init404Page();
  // global UI niceties
  createGlobalClock();
  initThemeToggleHeader();
  initHamburger();
});

/* ================================================================
   GLOBAL: CLOCK (tampilkan waktu nyata di pojok kiri atas)
   ================================================================ */
function createGlobalClock() {
  if (document.getElementById("global-clock")) return;
  const el = document.createElement("div");
  el.id = "global-clock";
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.setAttribute("title", "Drag to move | Double-click to reset");

  function fmt(d) {
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
  function update() {
    el.textContent = fmt(new Date());
  }
  update();
  setInterval(update, 1000);
  document.body.appendChild(el);

  // Draggable logic
  let isDragging = false,
    offsetX = 0,
    offsetY = 0;
  const savedPos = localStorage.getItem("tkj-clock-pos");
  if (savedPos) {
    try {
      const pos = JSON.parse(savedPos);
      el.style.setProperty("left", pos.x + "px", "important");
      el.style.setProperty("top", pos.y + "px", "important");
    } catch {}
  }

  el.addEventListener("mousedown", (e) => {
    isDragging = true;
    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    el.classList.add("dragging");
    el.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;
    el.style.setProperty(
      "left",
      Math.max(0, Math.min(newX, window.innerWidth - el.offsetWidth)) + "px",
      "important",
    );
    el.style.setProperty(
      "top",
      Math.max(56, Math.min(newY, window.innerHeight - 60)) + "px",
      "important",
    );
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    el.classList.remove("dragging");
    el.style.cursor = "move";
    const left = getComputedStyle(el).left;
    const top = getComputedStyle(el).top;
    localStorage.setItem(
      "tkj-clock-pos",
      JSON.stringify({
        x: parseInt(left),
        y: parseInt(top),
      }),
    );
  });

  el.addEventListener("dblclick", () => {
    el.style.setProperty("left", "12px", "important");
    el.style.setProperty("top", "12px", "important");
    localStorage.removeItem("tkj-clock-pos");
  });
}

/* ================================================================
   GLOBAL: INIT THEME TOGGLE (di top-bar-actions)
   ================================================================ */
function initThemeToggleHeader() {
  const topBarActions = document.querySelector(".top-bar-actions");
  if (!topBarActions || document.getElementById("theme-btn")) return;

  const btn = document.createElement("button");
  btn.id = "theme-btn";
  btn.className = "theme-toggle";
  btn.setAttribute("aria-label", "Ganti tema");
  btn.setAttribute("data-tooltip", "Toggle Tema (T)");
  btn.innerHTML = `
    <span class="theme-icon-wrapper">
      <i class="fas fa-moon" aria-hidden="true"></i>
    </span>
  `;

  topBarActions.appendChild(btn);
}

/* ================================================================
   GLOBAL: HAMBURGER MENU (tombol di kanan atas, muncul di semua halaman)
   ================================================================ */
function initHamburger() {
  const topBarActions = document.querySelector(".top-bar-actions");
  if (!topBarActions || document.getElementById("hamburger-btn")) return;

  const isInPage = window.location.pathname.includes("/page/");
  const pagePrefix = isInPage ? "./" : "./page/";
  const rootPrefix = isInPage ? "../" : "./";

  const btn = document.createElement("button");
  btn.id = "hamburger-btn";
  btn.className = "hamburger-btn";
  btn.setAttribute("aria-label", "Buka menu");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML =
    '<span class="hamburger-icon"><i class="fas fa-bars" aria-hidden="true"></i></span>';
  topBarActions.appendChild(btn);

  const menu = document.createElement("nav");
  menu.id = "hamburger-menu";
  menu.setAttribute("aria-hidden", "true");

  // Static menu items (no tab-bar dependency)
  const items = [
    {
      href: rootPrefix + "index.html",
      text: "Home",
      icon: '<i class="fas fa-house"></i>',
    },
    {
      href: pagePrefix + "about.html",
      text: "Tentang",
      icon: '<i class="fas fa-circle-info"></i>',
    },
    {
      href: pagePrefix + "structure.html",
      text: "Struktur",
      icon: '<i class="fas fa-sitemap"></i>',
    },
    {
      href: pagePrefix + "members.html",
      text: "Anggota",
      icon: '<i class="fas fa-users"></i>',
    },
    {
      href: pagePrefix + "skills.html",
      text: "Skills",
      icon: '<i class="fas fa-code"></i>',
    },
    {
      href: pagePrefix + "gallery.html",
      text: "Galeri",
      icon: '<i class="fas fa-images"></i>',
    },
    {
      href: pagePrefix + "statistics.html",
      text: "Statistik",
      icon: '<i class="fas fa-chart-bar"></i>',
    },
    {
      href: pagePrefix + "tkj.html",
      text: "TKJ",
      icon: '<i class="fas fa-network-wired"></i>',
    },
  ];

  menu.innerHTML = `
    <div class="hamburger-menu-panel">
      <button type="button" class="hamburger-menu-close" aria-label="Tutup menu">
        <i class="fas fa-times" aria-hidden="true"></i>
      </button>
      ${items
        .map(
          (it) =>
            `<a class="hamburger-link" href="${it.href}"><span>${it.icon}</span><span>${it.text}</span></a>`,
        )
        .join("")}
    </div>`;
  document.body.appendChild(menu);

  const panel = menu.querySelector(".hamburger-menu-panel");
  const closeBtn = menu.querySelector(".hamburger-menu-close");

  function open() {
    btn.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
    document.body.classList.add("hamburger-open");
  }
  function close() {
    btn.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("hamburger-open");
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    if (isOpen) close();
    else open();
  });

  menu.addEventListener("click", close);
  panel?.addEventListener("click", (e) => e.stopPropagation());
  closeBtn?.addEventListener("click", close);

  menu.querySelectorAll(".hamburger-link").forEach((link) => {
    link.addEventListener("click", () => {
      close();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* ================================================================
   PAGE: index.html
   ================================================================ */
function initIndexPage() {
  const intro = document.getElementById("intro");
  const bar = document.getElementById("intro-bar");
  const pct = document.getElementById("intro-pct");
  const sub = document.getElementById("intro-sub");
  const main = document.getElementById("main-content");

  if (!intro) {
    renderIndexContent();
    return;
  }
  if (sessionStorage.getItem("tkj-intro-done")) {
    intro.style.display = "none";
    if (main) main.style.visibility = "visible";
    renderIndexContent();
    return;
  }

  const phrases = [
    "Initializing TKJ XI-9...",
    "Loading modules...",
    "Connecting network...",
    "Rendering interface...",
    "ACCESS GRANTED",
  ];
  let progress = 0,
    phaseIdx = 0;
  document.body.style.overflow = "hidden";
  if (main) main.style.visibility = "hidden";

  const TOTAL = 2800,
    INTERVAL = 38;
  const timer = setInterval(() => {
    progress += 100 / (TOTAL / INTERVAL);
    if (progress >= 100) progress = 100;
    if (bar) {
      bar.style.width = progress + "%";
      bar.setAttribute("aria-valuenow", Math.floor(progress));
    }
    if (pct) pct.textContent = Math.floor(progress) + "%";
    const nextPhase = Math.min(
      Math.floor((progress / 100) * phrases.length),
      phrases.length - 1,
    );
    if (nextPhase !== phaseIdx) {
      phaseIdx = nextPhase;
      if (sub) sub.textContent = phrases[phaseIdx];
    }
    if (progress >= 100) {
      clearInterval(timer);
      if (sub) sub.textContent = "ACCESS GRANTED";
      setTimeout(() => {
        intro.classList.add("out");
        if (main) main.style.visibility = "visible";
        sessionStorage.setItem("tkj-intro-done", "1");
        document.getElementById("replay-intro-btn")?.classList.add("visible");
        setTimeout(() => {
          intro.style.display = "none";
          document.body.style.overflow = "";
          renderIndexContent();
        }, 700);
      }, 500);
    }
  }, INTERVAL);
}

function renderIndexContent() {
  renderStats();
  // initReveal() is already called inside renderStats() — no need here
  initHeroTyping();
  initKenaliKamiIntro();
  const qlCount = document.getElementById("ql-member-count");
  if (qlCount && typeof G !== "undefined" && Array.isArray(G.namaSiswa)) {
    qlCount.textContent = G.namaSiswa.length + " siswa";
  }
}

function initKenaliKamiIntro() {
  const trigger = document.querySelector(
    '.hero-cta a[href="./page/about.html"]',
  );
  if (!trigger || document.getElementById("about-intro-modal")) return;

  const modal = document.createElement("div");
  modal.id = "about-intro-modal";
  modal.className = "page-modal";
  modal.innerHTML = `
    <div class="page-modal-panel" role="dialog" aria-modal="true" aria-labelledby="intro-modal-title" aria-describedby="intro-modal-desc">
      <button type="button" class="modal-close" aria-label="Tutup intro">×</button>
      <div class="modal-badge">Kenali Kami</div>
      <h2 id="intro-modal-title">Sebelum masuk, kenali kami lebih dulu</h2>
      <p id="intro-modal-desc">
        Temukan visi, misi, dan semangat TKJ XI-9 sebelum melangkah ke halaman profil kami. Semoga ini membuat pengalamanmu lebih personal dan menarik.
      </p>
      <div class="modal-actions">
        <button type="button" class="btn btn-primary" id="about-intro-confirm">Masuk ke Kenali Kami</button>
        <button type="button" class="btn btn-outline" id="about-intro-dismiss">Nanti saja</button>
      </div>
    </div>`;

  document.body.appendChild(modal);
  const panel = modal.querySelector(".page-modal-panel");
  const closeBtn = modal.querySelector(".modal-close");
  const confirmBtn = modal.querySelector("#about-intro-confirm");
  const dismissBtn = modal.querySelector("#about-intro-dismiss");

  function showIntro() {
    modal.classList.add("visible");
    document.body.style.overflow = "hidden";
    enableFocusTrap(panel);
    confirmBtn?.focus();
  }

  function hideIntro() {
    modal.classList.remove("visible");
    document.body.style.overflow = "";
    disableFocusTrap();
    trigger.focus();
  }

  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    showIntro();
  });
  closeBtn?.addEventListener("click", hideIntro);
  dismissBtn?.addEventListener("click", hideIntro);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) hideIntro();
  });
  confirmBtn?.addEventListener("click", () => {
    hideIntro();
    window.location.href = trigger.href;
  });
}

function renderStats() {
  const grid = document.getElementById("stats-strip");
  if (!grid || typeof G === "undefined" || !Array.isArray(G.stats)) return;
  grid.innerHTML = G.stats
    .map((s) => {
      const angka = Number(s.angka) || 0;
      const suffix = s.suffix || "";
      const label = s.label || "";
      return `<div class="stat-cell reveal"><div class="stat-num" data-target="${angka}" data-suffix="${suffix}">${angka}${suffix}</div><div class="stat-lbl">${label}</div></div>`;
    })
    .join("");
  initReveal();
  setTimeout(() => {
    grid.querySelectorAll(".stat-num[data-target]").forEach((el) => {
      animateCounter(
        el,
        parseInt(el.dataset.target, 10),
        el.dataset.suffix || "",
      );
    });
  }, 300);
}

/* ================================================================
   PAGE: about.html
   FIX: Sekarang merender G.prestasi yang sebelumnya tidak pernah dipanggil
   ================================================================ */
function initAboutPage() {
  if (typeof G === "undefined") return;
  const visiEl = document.getElementById("visi-text");
  const misiEl = document.getElementById("misi-list");
  const mottoEl = document.getElementById("motto-text");
  const descEl = document.getElementById("kelas-desc");
  const waliEl = document.getElementById("wali-card");

  if (visiEl) visiEl.textContent = G.visi || "";
  if (mottoEl) mottoEl.textContent = "\u201C" + (G.motto || "") + "\u201D";
  if (descEl) descEl.textContent = G.deskripsi || "";

  if (misiEl && Array.isArray(G.misi)) {
    misiEl.innerHTML = G.misi
      .map(
        (m, i) => `
      <li>
        <span class="misi-num">${String(i + 1).padStart(2, "0")}.</span>
        <span>${(m || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>
      </li>`,
      )
      .join("");
  }

  if (waliEl && G.waliKelas) {
    const wk = G.waliKelas;
    renderAvatar(
      waliEl.querySelector(".avatar"),
      wk.nama || "",
      URLValidator.sanitize(wk.foto || ""),
      "lg",
    );
    const nameEl = waliEl.querySelector(".wali-name");
    const posEl = waliEl.querySelector(".wali-pos");
    if (nameEl) nameEl.textContent = wk.nama || "";
    if (posEl) posEl.textContent = wk.jabatan || "";
  }

  renderPrestasi();
  initReveal();

  // Guestbook (localStorage)
  (function initGuestbook() {
    const form = document.getElementById("guestbook-form");
    const listWrap = document.getElementById("guestbook-list");
    const clearBtn = document.getElementById("guest-clear");
    const key = "tkj_guestbook_v1";
    function load() {
      try {
        return JSON.parse(localStorage.getItem(key) || "[]");
      } catch {
        return [];
      }
    }
    function save(arr) {
      localStorage.setItem(key, JSON.stringify(arr));
    }
    function render() {
      const items = load();
      if (!listWrap) return;
      listWrap.innerHTML = items
        .map(
          (it) => `
        <div class="card" style="padding:10px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <strong>${(it.name || "Anon").replace(/</g, "&lt;")}</strong>
            <span style="color:var(--text-3);font-size:0.78rem">${new Date(it.ts).toLocaleString()}</span>
          </div>
          <div style="margin-top:6px;color:var(--text-2)">${(it.msg || "").replace(/</g, "&lt;")}</div>
        </div>
      `,
        )
        .join("");
    }
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name =
          document.getElementById("guest-name")?.value.trim() || "Anon";
        const msg = document.getElementById("guest-msg")?.value.trim() || "";
        if (!msg) return;
        const arr = load();
        arr.unshift({ name, msg, ts: Date.now() });
        save(arr);
        form.reset();
        render();
      });
    }
    if (clearBtn)
      clearBtn.addEventListener("click", () => {
        form?.reset();
      });
    render();
  })();
}

function renderPrestasi() {
  const container = document.getElementById("prestasi-list");
  if (!container || typeof G === "undefined" || !Array.isArray(G.prestasi))
    return;
  const frag = document.createDocumentFragment();
  G.prestasi.forEach((p) => {
    const item = document.createElement("div");
    item.className = "prestasi-item";
    item.innerHTML = `
      <div class="prestasi-badge">${(p.tahun || "").replace(/</g, "&lt;")}</div>
      <div class="prestasi-judul">${(p.judul || "").replace(/</g, "&lt;")}</div>
      <div class="prestasi-tingkat">${(p.tingkat || "").replace(/</g, "&lt;")}</div>`;
    frag.appendChild(item);
  });
  container.appendChild(frag);
}

/* ================================================================
   PAGE: structure.html
   ================================================================ */
function initStructurePage() {
  if (typeof G === "undefined") return;
  const wrap = document.getElementById("org-wrap");
  if (!wrap) return;
  const org = G.strukturOrg || [],
    wk = G.waliKelas || { nama: "", jabatan: "", foto: "" };
  wrap.innerHTML = "";
  wrap.appendChild(buildOrgRow([{ ...wk, isWali: true }], "xl"));
  if (org.length > 0) wrap.appendChild(connector());
  if (org.length >= 2) {
    wrap.appendChild(buildOrgRow(org.slice(0, 2), "lg"));
    if (org.length > 2) wrap.appendChild(connector());
  }
  if (org.length >= 6) {
    wrap.appendChild(buildOrgRow(org.slice(2, 6), "md"));
    if (org.length > 6) wrap.appendChild(connector());
  }
  if (org.length >= 8) {
    wrap.appendChild(
      buildOrgRow(org.slice(6, 8), "md"),
    ); /* No connector after last row */
  }
  initReveal();
}

function buildOrgRow(items, avatarSize) {
  const row = document.createElement("div");
  row.className = "org-row";
  items.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = `card org-card ${item.isWali ? "is-wali" : ""} reveal`;
    card.style.setProperty("--d", `${i * 0.07}s`);
    const avatarEl = document.createElement("div");
    renderAvatar(
      avatarEl,
      item.nama || "",
      URLValidator.sanitize(item.foto || ""),
      avatarSize,
    );
    const nameEl = document.createElement("div");
    nameEl.className = "org-card-name";
    nameEl.textContent = item.nama || "—";
    const posEl = document.createElement("div");
    posEl.className = "org-card-pos";
    posEl.textContent = item.jabatan || "";
    card.appendChild(avatarEl);
    card.appendChild(nameEl);
    card.appendChild(posEl);
    row.appendChild(card);
  });
  return row;
}

function connector() {
  const d = document.createElement("div");
  d.className = "org-connector";
  d.setAttribute("aria-hidden", "true");
  return d;
}

/* ================================================================
   PAGE: members.html
   ================================================================ */
function initMembersPage() {
  if (typeof G === "undefined") return;
  const grid = document.getElementById("members-grid");
  const search = document.getElementById("member-search");
  const clearBtn = document.getElementById("search-clear");
  const countEl = document.getElementById("member-count");
  const siswa = G.namaSiswa || [];
  let rafId = null;

  function render(filter = "") {
    const q = filter.toLowerCase().trim();
    const list = q
      ? siswa.filter((s) => (s.nama || "").toLowerCase().includes(q))
      : siswa;
    if (countEl) {
      countEl.textContent = q
        ? `Menampilkan ${list.length} dari ${siswa.length} anggota`
        : `Semua ${siswa.length} anggota`;
    }
    if (!grid) return;
    if (!list.length) {
      grid.innerHTML = "";
      const msg = document.createElement("p");
      msg.style.cssText =
        'grid-column:1/-1;text-align:center;color:var(--text-3);font-family:"Fira Code",monospace;font-size:var(--text-xs);padding:40px 0';
      msg.textContent = "Anggota tidak ditemukan.";
      grid.appendChild(msg);
      return;
    }
    grid.innerHTML = "";
    const frag = document.createDocumentFragment();
    list.forEach((s, i) => {
      const card = document.createElement("div");
      card.className = "card member-card card-accent-top reveal";
      card.setAttribute("data-nis", s.nis || "");
      card.style.setProperty("--d", `${(i % 5) * 0.05}s`);
      const avatarEl = document.createElement("div");
      renderAvatar(
        avatarEl,
        s.nama || "",
        URLValidator.sanitize(s.foto || ""),
        "lg",
      );
      const nameEl = document.createElement("div");
      nameEl.className = "member-card-name";
      nameEl.textContent = s.nama || "—";
      const nisEl = document.createElement("div");
      nisEl.className = "member-card-nis mono";
      nisEl.textContent = s.nis || "";
      card.appendChild(avatarEl);
      card.appendChild(nameEl);
      card.appendChild(nisEl);
      frag.appendChild(card);
    });
    grid.appendChild(frag);
    initReveal();
  }
  render();

  if (search) {
    search.addEventListener("input", () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        render(search.value);
        clearBtn?.classList.toggle("visible", search.value.length > 0);
      });
    });
  }
  /* Event delegation — lebih robust */
  document.querySelector(".search-bar")?.addEventListener("click", (e) => {
    if (e.target.closest("#search-clear")) {
      if (search) {
        search.value = "";
        search.dispatchEvent(new Event("input"));
        search.focus();
      }
    }
  });

  // Wheel scroll handler untuk horizontal slider
  if (grid) {
    grid.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return; // let natural horizontal scroll work
        e.preventDefault();
        const scrollAmount = e.deltaY > 0 ? 80 : -80;
        grid.scrollBy({ left: scrollAmount, behavior: "smooth" });
      },
      { passive: false },
    );
  }

  // Member modal: open detail when member card clicked
  const modal = document.getElementById("member-modal");
  const modalClose = document.getElementById("member-modal-close");
  const modalAvatar = document.getElementById("modal-avatar");
  const modalName = document.getElementById("modal-name");
  const modalNis = document.getElementById("modal-nis");
  const modalDesc = document.getElementById("modal-desc");
  const modalSocial = document.getElementById("modal-social");

  grid?.addEventListener("click", (e) => {
    const card = e.target.closest(".member-card");
    if (!card) return;
    const nis = card.getAttribute("data-nis");
    if (!nis) return;
    const data = (Array.isArray(siswa) ? siswa : []).find(
      (x) => (x.nis || "") === nis,
    );
    if (!data || !modal) return;
    modalName.textContent = data.nama || "—";
    modalNis.textContent = data.nis || "";
    modalDesc.textContent = data.desc || "";
    modalSocial.innerHTML = "";
    if (data.social && typeof data.social === "object") {
      Object.keys(data.social).forEach((k) => {
        const a = document.createElement("a");
        a.href = data.social[k];
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.innerHTML = `<i class="fab fa-${k}" aria-hidden="true"></i>`;
        modalSocial.appendChild(a);
      });
    }
    renderAvatar(
      modalAvatar,
      data.nama || "",
      URLValidator.sanitize(data.foto || ""),
      "lg",
    );
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalClose?.focus();
    enableFocusTrap(modal);
  });

  function closeMemberModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    disableFocusTrap();
  }
  modalClose?.addEventListener("click", closeMemberModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeMemberModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMemberModal();
  });
}

/* ================================================================
   PAGE: skills.html
   FIX: initSkillBars() hanya dipanggil SATU KALI di sini
   ================================================================ */
function initSkillsPage() {
  if (typeof G === "undefined") return;
  const list = document.getElementById("skills-list");
  if (!list || !Array.isArray(G.skills)) return;
  const frag = document.createDocumentFragment();
  G.skills.forEach((sk, i) => {
    const card = document.createElement("div");
    card.className = "card skill-card reveal";
    card.style.setProperty("--d", `${i * 0.07}s`);
    const icon = sk.icon || "fa-code",
      nome = sk.nama || "Skill",
      desc = sk.desc || "";
    const level = Math.min(100, Math.max(0, Number(sk.level) || 0));
    card.innerHTML = `
      <div class="skill-top">
        <div class="icon-box lg" aria-hidden="true"><i class="fas ${icon}"></i></div>
        <div class="skill-info"><div class="skill-name">${nome}</div><div class="skill-desc">${desc}</div></div>
        <div class="skill-pct" aria-label="${level} persen">${level}%</div>
      </div>
      <div class="bar-bg" role="progressbar" aria-valuenow="${level}" aria-valuemin="0" aria-valuemax="100" aria-label="${nome}: ${level}%">
        <div class="bar-fill" data-level="${level}"></div>
      </div>`;
    frag.appendChild(card);
  });
  list.appendChild(frag);
  initReveal();
  initSkillBars(); /* SATU KALI di sini — tidak di DOMContentLoaded */
  // add filled visuals after bars animate
  setTimeout(markSkillBarsFilled, 350);
}

/* ================================================================
   PAGE: gallery.html
   BARU: Filter per kategori + skeleton loading
   ================================================================ */
function initGalleryPage() {
  const grid = document.getElementById("gallery-grid");
  const filterWrap = document.getElementById("gallery-filters");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");

  if (!grid) {
    initReveal();
    return;
  }
  if (typeof G === "undefined" || !Array.isArray(G?.galeri)) {
    initReveal();
    return;
  }
  const galeri = G.galeri;

  /* Skeleton placeholder sebelum gambar muncul */
  grid.innerHTML = galeri
    .map(
      () => `<div class="gallery-skeleton skeleton" aria-hidden="true"></div>`,
    )
    .join("");

  /* Kumpulkan kategori unik */
  const allLabel = "SEMUA";
  const labels = [
    allLabel,
    ...new Set(galeri.map((g) => g.label || "LAINNYA")),
  ];

  if (filterWrap) {
    filterWrap.innerHTML = labels
      .map(
        (lbl, i) => `
      <button class="filter-btn ${i === 0 ? "active" : ""}" data-filter="${lbl}"
              aria-pressed="${i === 0 ? "true" : "false"}">${lbl}</button>`,
      )
      .join("");

    filterWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filterWrap.querySelectorAll(".filter-btn").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      // smooth transition: fade-out grid then render
      grid.classList.add("fade-out");
      setTimeout(() => {
        renderGallery(btn.dataset.filter);
        grid.classList.remove("fade-out");
      }, 220);
    });
  }

  // lightbox navigation state
  let currentLightboxIndex = -1;
  let visibleIndices = [];

  function renderGallery(activeFilter = allLabel) {
    const filtered =
      activeFilter === allLabel
        ? galeri
        : galeri.filter((g) => (g.label || "LAINNYA") === activeFilter);
    grid.innerHTML = "";
    visibleIndices = [];
    if (!filtered.length) {
      const msg = document.createElement("p");
      msg.style.cssText =
        'grid-column:1/-1;text-align:center;color:var(--text-3);font-family:"Fira Code",monospace;font-size:var(--text-xs);padding:40px 0';
      msg.textContent = "Tidak ada foto pada kategori ini.";
      grid.appendChild(msg);
      return;
    }
    const frag = document.createDocumentFragment();
    filtered.forEach((item, i) => {
      const safeUrl = URLValidator.sanitize(item.src || "");
      const caption = item.caption || item.label || "Foto Kegiatan TKJ XI-9";
      const label = item.label || "FOTO";
      const div = document.createElement("div");
      div.className = "gallery-item reveal";
      div.style.setProperty("--d", `${i * 0.04}s`);
      div.setAttribute("role", "button");
      div.setAttribute("tabindex", "0");
      div.setAttribute("aria-label", `Lihat foto: ${caption}`);

      // preserve reference to original index in G.galeri for navigation
      const originalIndex = galeri.findIndex((g) => g === item);
      if (originalIndex >= 0) {
        div.setAttribute("data-index", String(originalIndex));
        visibleIndices.push(originalIndex);
      }

      if (safeUrl) {
        div.classList.add("skeleton");
        const img = document.createElement("img");
        img.alt = caption;
        img.loading = "lazy";
        img.decoding = "async";
        img.style.opacity = "0";
        img.addEventListener("load", () => {
          // prefer decode when available
          try {
            if (img.decode) img.decode().catch(() => {});
          } catch {}
          div.classList.remove("skeleton");
          img.classList.add("loaded");
          img.style.opacity = "1";
        });
        img.addEventListener("error", () => {
          div.classList.remove("skeleton");
          div.innerHTML = `<div class="gallery-ph"><i class="fas fa-image" aria-hidden="true"></i><span>${label}</span></div>`;
        });
        img.src = safeUrl;
        div.appendChild(img);
      } else {
        div.innerHTML = `<div class="gallery-ph"><i class="fas fa-camera" aria-hidden="true"></i><span>${label}</span></div>`;
      }

      const capDiv = document.createElement("div");
      capDiv.className = "gallery-caption";
      const capSpan = document.createElement("span");
      capSpan.textContent = label;
      capDiv.appendChild(capSpan);
      div.appendChild(capDiv);

      frag.appendChild(div);
    });
    grid.appendChild(frag);
    initReveal();
    maybeInitStack && maybeInitStack();
  }

  renderGallery(allLabel);
  // initialize stack carousel visuals & interactions only for wide screens and small galleries
  function maybeInitStack() {
    const items = grid.querySelectorAll(".gallery-item");
    if (
      window.matchMedia &&
      window.matchMedia("(min-width:900px)").matches &&
      items.length > 0 &&
      items.length <= 6
    ) {
      initStackCarousel();
    } else {
      grid.classList.remove("stack-carousel");
      items.forEach((it) => {
        it.style.transform = "";
        it.style.opacity = "";
        it.style.zIndex = "";
        it.classList.remove("is-front");
      });
    }
  }
  maybeInitStack();

  /* Event Delegation untuk gallery items + keyboard nav */
  grid.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery-item");
    if (!item) return;
    const img = item.querySelector("img");
    if (!img || !img.src) return;
    const idx = Number(item.getAttribute("data-index") || -1);
    openLightbox(img.src, img.alt, idx);
  });
  grid.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const item = e.target.closest(".gallery-item");
    if (!item) return;
    e.preventDefault();
    const img = item.querySelector("img");
    if (!img || !img.src) return;
    const idx = Number(item.getAttribute("data-index") || -1);
    openLightbox(img.src, img.alt, idx);
  });

  // openLightbox accepts optional index (index in G.galeri) for navigation
  /* ================================================================
     STACK CAROUSEL: 3D stacked visuals and drag/arrow navigation
     Applies transforms to `.gallery-item` elements inside `#gallery-grid`.
  ================================================================ */
  function initStackCarousel() {
    if (!grid) return;
    grid.classList.add("stack-carousel");
    const parent = grid.parentElement || grid;
    let items = Array.from(grid.querySelectorAll(".gallery-item"));
    if (!items.length) return;
    let cur = 0;

    function update() {
      items = Array.from(grid.querySelectorAll(".gallery-item"));
      const len = items.length;
      items.forEach((it, i) => {
        const offset = i - cur;
        const abs = Math.abs(offset);
        const z = Math.max(0, 100 - abs * 10);
        const tx = offset * 28;
        const ty = abs * 10;
        const rz = offset * -3;
        it.style.zIndex = String(1000 - abs);
        it.style.opacity =
          offset < -6 || offset > 6
            ? "0"
            : String(Math.max(0.12, 1 - abs * 0.14));
        it.style.transform = `translate3d(${tx}px, ${ty}px, ${-abs * 40}px) rotateZ(${rz}deg)`;
        it.classList.toggle("is-front", offset === 0);
      });
    }

    // controls
    let prevBtn = parent.querySelector(".stack-prev");
    let nextBtn = parent.querySelector(".stack-next");
    if (!prevBtn) {
      prevBtn = document.createElement("button");
      prevBtn.className = "stack-prev";
      prevBtn.setAttribute("aria-label", "Sebelumnya");
      prevBtn.innerHTML =
        '<i class="fas fa-chevron-left" aria-hidden="true"></i>';
      nextBtn = document.createElement("button");
      nextBtn.className = "stack-next";
      nextBtn.setAttribute("aria-label", "Berikutnya");
      nextBtn.innerHTML =
        '<i class="fas fa-chevron-right" aria-hidden="true"></i>';
      parent.appendChild(prevBtn);
      parent.appendChild(nextBtn);
    }
    prevBtn.addEventListener("click", () => {
      cur = (cur - 1 + items.length) % items.length;
      update();
    });
    nextBtn.addEventListener("click", () => {
      cur = (cur + 1) % items.length;
      update();
    });

    // drag / swipe
    let sx = 0,
      dragging = false;
    grid.addEventListener("pointerdown", (e) => {
      dragging = true;
      sx = e.clientX;
      grid.setPointerCapture(e.pointerId);
    });
    grid.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 48) {
        if (dx > 0) {
          cur = (cur - 1 + items.length) % items.length;
        } else {
          cur = (cur + 1) % items.length;
        }
        sx = e.clientX;
        update();
      }
    });
    grid.addEventListener("pointerup", (e) => {
      dragging = false;
      try {
        grid.releasePointerCapture(e.pointerId);
      } catch {}
    });
    grid.addEventListener("pointercancel", () => {
      dragging = false;
    });

    // keyboard navigation when focus inside grid
    grid.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        cur = (cur - 1 + items.length) % items.length;
        update();
      }
      if (e.key === "ArrowRight") {
        cur = (cur + 1) % items.length;
        update();
      }
    });

    // init
    update();
  }
  function openLightbox(src, alt, index = -1) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    const capEl =
      document.getElementById("lb-caption-bar") ||
      document.getElementById("lightbox-caption");
    if (capEl) capEl.textContent = alt || "";
    currentLightboxIndex = typeof index === "number" ? index : -1;
    const counterEl = document.getElementById("lb-counter");
    if (counterEl) {
      const pos = visibleIndices.indexOf(currentLightboxIndex);
      counterEl.textContent =
        (pos >= 0 ? pos + 1 : 0) +
        " / " +
        (visibleIndices.length || galeri.length);
    }
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightboxClose?.focus();
    enableFocusTrap(lightbox);
  }
  function closeLightbox() {
    if (!lightbox) return;
    const capEl =
      document.getElementById("lb-caption-bar") ||
      document.getElementById("lightbox-caption");
    if (capEl) capEl.textContent = "";
    const counterEl = document.getElementById("lb-counter");
    if (counterEl) counterEl.textContent = "";
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    disableFocusTrap();
  }
  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  // prev/next buttons inside lightbox
  const lbPrevBtn = document.getElementById("lb-prev");
  const lbNextBtn = document.getElementById("lb-next");
  lbPrevBtn?.addEventListener("click", () => {
    if (visibleIndices && visibleIndices.length) {
      const pos = visibleIndices.indexOf(currentLightboxIndex);
      const nextPos = (pos - 1 + visibleIndices.length) % visibleIndices.length;
      const idx = visibleIndices[nextPos];
      const src = URLValidator.sanitize(galeri[idx]?.src || "");
      if (src) openLightbox(src, galeri[idx]?.caption || "", idx);
    } else if (currentLightboxIndex >= 0) {
      const prev = (currentLightboxIndex - 1 + galeri.length) % galeri.length;
      const src = URLValidator.sanitize(galeri[prev]?.src || "");
      if (src) openLightbox(src, galeri[prev]?.caption || "", prev);
    }
  });
  lbNextBtn?.addEventListener("click", () => {
    if (visibleIndices && visibleIndices.length) {
      const pos = visibleIndices.indexOf(currentLightboxIndex);
      const nextPos = (pos + 1) % visibleIndices.length;
      const idx = visibleIndices[nextPos];
      const src = URLValidator.sanitize(galeri[idx]?.src || "");
      if (src) openLightbox(src, galeri[idx]?.caption || "", idx);
    } else if (currentLightboxIndex >= 0) {
      const next = (currentLightboxIndex + 1) % galeri.length;
      const src = URLValidator.sanitize(galeri[next]?.src || "");
      if (src) openLightbox(src, galeri[next]?.caption || "", next);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("open")) return;
    if (e.key === "Escape") {
      closeLightbox();
      return;
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      if (visibleIndices && visibleIndices.length) {
        const pos = visibleIndices.indexOf(currentLightboxIndex);
        if (pos >= 0) {
          const nextPos =
            e.key === "ArrowLeft"
              ? (pos - 1 + visibleIndices.length) % visibleIndices.length
              : (pos + 1) % visibleIndices.length;
          const idx = visibleIndices[nextPos];
          const src = URLValidator.sanitize(galeri[idx]?.src || "");
          if (src) openLightbox(src, galeri[idx]?.caption || "", idx);
        }
      } else {
        if (e.key === "ArrowLeft") {
          const prev =
            (currentLightboxIndex - 1 + galeri.length) % galeri.length;
          const src = URLValidator.sanitize(galeri[prev]?.src || "");
          if (src) openLightbox(src, galeri[prev]?.caption || "", prev);
        } else {
          const next = (currentLightboxIndex + 1) % galeri.length;
          const src = URLValidator.sanitize(galeri[next]?.src || "");
          if (src) openLightbox(src, galeri[next]?.caption || "", next);
        }
      }
    }
  });
}

/* ================================================================
   PAGE: tkj.html
   ================================================================ */
function initTkjPage() {
  if (typeof G === "undefined" || !G.tkj) return;
  const tkj = G.tkj;
  const descEl = document.getElementById("tkj-desc");
  const mapelEl = document.getElementById("tkj-mapel");
  const karirEl = document.getElementById("tkj-karir");
  const kurEl = document.getElementById("tkj-kurikulum");
  if (descEl) descEl.textContent = tkj.deskripsi || "";

  if (mapelEl && Array.isArray(tkj.mapel)) {
    const frag = document.createDocumentFragment();
    tkj.mapel.forEach((m) => {
      const div = document.createElement("div");
      div.className = "mapel-item";
      div.innerHTML = `<i class="fas ${m.icon || "fa-circle"}" aria-hidden="true"></i><span>${m.nama || ""}</span>`;
      frag.appendChild(div);
    });
    mapelEl.appendChild(frag);
  }
  if (karirEl && Array.isArray(tkj.karir)) {
    const frag = document.createDocumentFragment();
    tkj.karir.forEach((k) => {
      const div = document.createElement("div");
      div.className = "karir-item";
      div.innerHTML = `
        <div class="karir-icon" aria-hidden="true"><i class="fas ${k.icon || "fa-briefcase"}"></i></div>
        <div class="karir-info"><h4>${(k.jabatan || "").replace(/</g, "&lt;")}</h4><p>${(k.desc || "").replace(/</g, "&lt;")}</p></div>`;
      frag.appendChild(div);
    });
    karirEl.appendChild(frag);
  }
  if (kurEl && Array.isArray(tkj.kurikulum)) {
    const frag = document.createDocumentFragment();
    tkj.kurikulum.forEach((k) => {
      const div = document.createElement("div");
      div.className = "kur-item";
      div.innerHTML = `<div class="kur-dot" aria-hidden="true"></div><div><h4>${(k.fase || "").replace(/</g, "&lt;")}</h4><p>${(k.fokus || "").replace(/</g, "&lt;")}</p></div>`;
      frag.appendChild(div);
    });
    kurEl.appendChild(frag);
  }
  /* TKJ Tools: subnet calculator + ping simulator */
  (function initTkjTools() {
    function ipToInt(ip) {
      return (
        ip
          .split(".")
          .map(Number)
          .reduce((acc, n) => (acc << 8) + (n & 255), 0) >>> 0
      );
    }
    function intToIp(int) {
      return [
        (int >>> 24) & 255,
        (int >>> 16) & 255,
        (int >>> 8) & 255,
        int & 255,
      ].join(".");
    }
    function maskFromCidr(cidr) {
      return cidr === 0 ? 0 : ~((1 << (32 - cidr)) - 1) >>> 0;
    }

    const inp = document.getElementById("subnet-input");
    const btn = document.getElementById("subnet-calc-btn");
    const out = document.getElementById("subnet-result");
    if (btn && inp && out) {
      btn.addEventListener("click", () => {
        const v = (inp.value || "").trim();
        const parts = v.split("/");
        if (parts.length !== 2) {
          out.textContent = "Format tidak valid (contoh: 192.168.1.1/24)";
          return;
        }
        try {
          const ip = parts[0];
          const cidr = Number(parts[1]);
          if (cidr < 0 || cidr > 32) throw new Error("CIDR invalid");
          const ipInt = ipToInt(ip);
          const mask = maskFromCidr(cidr);
          const network = ipInt & mask;
          const broadcast = network | (~mask >>> 0);
          const first = network + (cidr === 32 ? 0 : 1);
          const last = broadcast - (cidr === 32 ? 0 : 1);
          out.innerHTML = `Network: <strong>${intToIp(network)}</strong><br/>Broadcast: <strong>${intToIp(broadcast)}</strong><br/>Range: <strong>${intToIp(first)} - ${intToIp(last)}</strong><br/>Mask: /${cidr}`;
        } catch (err) {
          out.textContent =
            "Tidak bisa menghitung: " + (err.message || "input salah");
        }
      });
    }

    // Ping simulator
    const pingBtn = document.getElementById("ping-btn");
    const pingHost = document.getElementById("ping-host");
    const pingLog = document.getElementById("ping-log");
    if (pingBtn && pingLog && pingHost) {
      pingBtn.addEventListener("click", () => {
        const host = (pingHost.value || "tkj-xi9").trim();
        pingBtn.disabled = true;
        pingBtn.textContent = "Pinging...";
        pingLog.textContent = "";
        const start = Date.now();
        let dots = 0;
        const pInt = setInterval(() => {
          pingLog.textContent =
            "Pinging " + host + " " + ".".repeat((dots % 3) + 1);
          dots++;
        }, 300);
        // simulate network
        setTimeout(
          () => {
            clearInterval(pInt);
            const ok = Math.random() > 0.15; // 85% success
            const latency = Math.floor(8 + Math.random() * 220);
            if (ok) {
              pingLog.innerHTML = `Reply from ${host}: time=${latency}ms`;
            } else {
              pingLog.innerHTML = `Request timed out.`;
            }
            pingBtn.disabled = false;
            pingBtn.textContent = "Ping";
          },
          600 + Math.floor(Math.random() * 1200),
        );
      });
    }
  })();
  initReveal();
}

/* ================================================================
   PAGE: admin.html (simulated)
   ================================================================ */
function initAdminPage() {
  const form = document.getElementById("admin-login");
  const dashboard = document.getElementById("admin-dashboard");
  const statsWrap = document.getElementById("admin-stats");
  if (!form || !dashboard) return;
  function showDashboard() {
    form.style.display = "none";
    dashboard.style.display = "block";
    // render stats from G
    if (statsWrap && typeof G !== "undefined" && Array.isArray(G.stats)) {
      statsWrap.innerHTML = G.stats
        .map(
          (s) => `
        <div class="card">
          <div style="font-size:1.6rem;font-weight:700">${s.angka}${s.suffix || ""}</div>
          <div style="color:var(--text-3)">${s.label}</div>
        </div>
      `,
        )
        .join("");
    }
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const u = document.getElementById("admin-user")?.value || "";
    const p = document.getElementById("admin-pass")?.value || "";
    // very simple client-side check (simulasi)
    if ((u === "admin" && p === "admin") || u === "guest") {
      showDashboard();
    } else {
      alert(
        "Login gagal — ini hanya simulasi client-side. Coba username: admin / password: admin",
      );
    }
  });
  document
    .getElementById("admin-guest")
    ?.addEventListener("click", () => showDashboard());
}

/* ================================================================
   PAGE: 404.html
   FIX: Script dipindah dari inline HTML ke sini
   Redirect otomatis DIHAPUS — diganti countdown informatif saja
   ================================================================ */
function init404Page() {
  const cdEl = document.getElementById("nf-countdown");
  const rdWrap = document.getElementById("nf-redirect-wrap");
  let n = 10;

  if (cdEl) {
    const t = setInterval(() => {
      n--;
      cdEl.textContent = n;
      if (n <= 0) {
        clearInterval(t);
        /* TIDAK redirect otomatis — tampilkan pesan informatif saja */
        if (rdWrap)
          rdWrap.innerHTML = `
          <span style="color:var(--text-3);font-family:'Fira Code',monospace;font-size:var(--text-xs)">
            Gunakan tombol di atas untuk navigasi.
          </span>`;
      }
    }, 1000);
  }

  const phrases = [
    "$ ping beranda.tkj-xi9 --ttl=5",
    "$ traceroute 404.error.null",
    "$ nmap -sV this.page",
    "$ ssh admin@tkj-xi9.local",
    "$ cat /var/log/missing.txt",
  ];
  let pIdx = 0;
  const typeEl = document.getElementById("nf-typetext");
  if (typeEl) {
    setInterval(() => {
      pIdx = (pIdx + 1) % phrases.length;
      typeEl.textContent = phrases[pIdx];
    }, 2500);
  }
}
