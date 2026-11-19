/* Intro V5 "Órbita que enciende" — script de salida (sin build).
   Se carga desde el servidor vía <script src="/intro-exit.js" defer>.
   Ejecuta:
     - temporizadores por fase (separación 1.2 s, carga 2.0 s, medición
       FLIP 3.72 s, apertura 3.8 s, fin 4.8 s a 1×)
     - salto a la fase de apertura con un clic/toque en cualquier parte del overlay
     - failsafe: el bail vive en el script inline de <head> (≥ 6 s, escala
       con --intro-speed para que nunca corte el intro de baja velocidad)
     - FLIP progresivo (Web Animations API, 0.9 s) hacia el header al abrir
     - marca data-intro-exit="timeline|failsafe|skip" en <html>

   Decisiones pre-pintadas por el script inline de <head> (theme-init):
     intro-on, movimiento, congelado (introAt), ritmo (--intro-speed, con
     repeatSpeed si ya se vio en la pestaña), failsafe ≥ 6 s (bail) y
     frecuencia/marca de visita (data-intro-frequency: session | once | always).

   Registrador de rendimiento SOLO desarrollo (localhost o ?introperf=1):
   intervalos entre fotogramas (rAF) + long tasks (PerformanceObserver); al
   terminar imprime "[intro] perf fps_avg=… fps_min=… frames>32ms=… longtasks=…ms".
*/
/* Secuencia del intro V5. El arranque espera a que el script inline de
   <head> (theme-init) marque la raíz con la clase "js": en desarrollo el
   orden entre el script inline y este defer no está garantizado; en
   producción el inline es parser-blocking y llega antes. Tope defensivo
   de 4 s para jamás dejar el contenido atascado. */
(function () {
  var booted = false;
  function startIntroExit() {
    if (booted) return;
    booted = true;
    var root = document.documentElement;
    var T0 = performance.now();
  var activeFlips = [];
  var T = { split: 1.2, load: 2.0, measure: 3.72, opening: 3.8, end: 4.8, failsafe: 6.0 };

  function logPhase(name) {
    try {
      console.log("[intro] phase=" + name + " t=" + Math.round(performance.now() - T0) + "ms");
    } catch (e) {}
  }

  /* Congelado: no hay temporizadores; el estado queda para depuración manual */
  var frozenAttr = root.getAttribute("data-intro-at");
  var frozen = frozenAttr !== null;
  var frozenAtNum = frozen ? parseFloat(frozenAttr) : 0;
  if (!isFinite(frozenAtNum)) frozenAtNum = 0;

  var SPEED = 1;
  try {
    var v = parseFloat(window.getComputedStyle(root).getPropertyValue("--intro-speed"));
    if (isFinite(v) && v > 0) SPEED = v;
  } catch (e) {}
  function MS(seconds) {
    return Math.round((seconds * 1000) / SPEED);
  }

  /* Registrador de rendimiento SOLO desarrollo: rAF + PerformanceObserver */
  var perf = null;
  try {
    var isLocal =
      /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname) ||
      /[?&]introperf=1(?:&|$)/.test(window.location.search);
    if (isLocal && !frozen) {
      perf = { last: 0, deltas: [], long: 0, observer: null, raf: 0 };
      try {
        if (window.PerformanceObserver) {
          var po = new PerformanceObserver(function (list) {
            var entries = list.getEntries();
            for (var i = 0; i < entries.length; i++) {
              perf.long += entries[i].duration;
            }
          });
          po.observe({ type: "longtask", buffered: true });
          perf.observer = po;
        }
      } catch (e) {
        perf.observer = null;
      }
      var tick = function (now) {
        if (perf.last) perf.deltas.push(now - perf.last);
        perf.last = now;
        perf.raf = window.requestAnimationFrame(tick);
      };
      perf.raf = window.requestAnimationFrame(tick);
    }
  } catch (e) {
    perf = null;
  }

  function reportPerf() {
    if (!perf) return;
    try {
      window.cancelAnimationFrame(perf.raf);
    } catch (e) {}
    try {
      if (perf.observer) perf.observer.disconnect();
    } catch (e) {}
    var d = perf.deltas;
    var sum = 0;
    var max = 0;
    var over32 = 0;
    for (var i = 0; i < d.length; i++) {
      sum += d[i];
      if (d[i] > max) max = d[i];
      if (d[i] > 32) over32++;
    }
    var avg = d.length ? sum / d.length : 16.7;
    var fpsAvg = (1000 / avg).toFixed(1);
    var fpsMin = max > 0 ? (1000 / max).toFixed(1) : "60.0";
    try {
      console.log(
        "[intro] perf fps_avg=" + fpsAvg +
        " fps_min=" + fpsMin +
        " frames>32ms=" + over32 +
        " longtasks=" + Math.round(perf.long) + "ms"
      );
    } catch (e) {}
    perf = null;
  }

  var scheduled = [];
  function clearScheduled() {
    for (var i = 0; i < scheduled.length; i++) window.clearTimeout(scheduled[i]);
    scheduled.length = 0;
  }
  function schedule(name, seconds, fn) {
    if (frozen) return;
    scheduled.push(
      window.setTimeout(function () {
        logPhase(name);
        fn();
      }, MS(seconds))
    );
  }

  function setExit(kind) {
    try {
      root.setAttribute("data-intro-exit", kind);
    } catch (e) {}
  }

  /* Marca de visita: SOLO al terminar la secuencia o al saltar (Skip,
     Escape o clic que lleva a la apertura). El failsafe del <head> nunca la
     escribe. La clave depende de intro.frequency (data-intro-frequency):
     session → sessionStorage · once → localStorage (TTL 30 días) · always →
     sessionStorage también (la marca alimenta intro.repeatSpeed, aunque el
     intro se repita en cada carga). */
  function markSeen() {
    try {
      var freq = root.getAttribute("data-intro-frequency") || "session";
      if (freq === "once") {
        window.localStorage.setItem("ingenio-intro", JSON.stringify({ t: Date.now() }));
      } else {
        window.sessionStorage.setItem("ingenio-intro-session", "1");
      }
    } catch (e) {}
  }

  function end(kind) {
    kind = kind || "timeline";
    if (!root.classList.contains("intro-on")) {
      setExit(kind);
      try {
        console.log("[intro] exit=" + kind);
      } catch (e) {}
      reportPerf();
      return;
    }
    if (root.classList.contains("intro-done")) {
      setExit(kind);
      reportPerf();
      return;
    }
    clearScheduled();
    reportPerf();
    root.classList.add("intro-done");
    root.classList.remove("intro-on");
    root.classList.remove("scroll-locked");
    root.classList.remove("intro-opening");
    setExit(kind);
    try {
      window.__scrollUnlockAll && window.__scrollUnlockAll();
    } catch (e) {}
    markSeen();
    try {
      window.__introExit = kind;
    } catch (e) {}
    try {
      console.log("[intro] exit=" + kind);
    } catch (e) {}
    for (var i = 0; i < activeFlips.length; i++) {
      try {
        activeFlips[i].cancel();
      } catch (e) {}
    }
    activeFlips.length = 0;
    var m = document.getElementById("contenido");
    if (m) {
      try {
        m.focus({ preventScroll: true });
      } catch (e) {}
    }
  }

  /* ===== FLIP: medición ÚNICA y temprana (antes de la apertura) =====
     Nunca durante el movimiento ni al abrir. Se dispara en T.measure
     (3.72 s, con todo encendido y antes de la apertura 3.8 s). Todo se
     calcula aquí (pose actual, pose base y destino) y se guarda; startFlip
     solo aplica los keyframes. Medir = idempotente; nunca dos veces. */
  var measured = null;
  function measureFlip() {
    if (measured) return measured;
    var em = document.querySelector("#intro [data-intro-emblem]");
    var wI = document.querySelector('#intro [data-intro-word="ingenio"]');
    var wD = document.querySelector('#intro [data-intro-word="digital"]');
    var dstE = document.querySelector('[data-intro-target="emblem"]');
    var dstI = document.querySelector('[data-intro-target="ingenio"]');
    var dstD = document.querySelector('[data-intro-target="digital"]');
    if (!(em && wI && wD && dstE && dstI && dstD)) return null;

    var capture = function (el) {
      var cs = window.getComputedStyle(el);
      var fromT = cs.transform;
      var fromO = cs.opacity;
      var r1 = el.getBoundingClientRect();
      // Pose base: desactivar animaciones vía UNA hoja temporal (sin tocar
      // estilos inline ni atributos; misma tarea → sin frame intermedio).
      var disabler = document.createElement("style");
      disabler.textContent =
        "#intro [data-intro-emblem], #intro [data-intro-word] { animation: none !important; transform: none !important; }";
      document.head.appendChild(disabler);
      var base = el.getBoundingClientRect();
      document.head.removeChild(disabler);
      return { fromT: fromT, fromO: fromO, r1: r1, base: base };
    };

    try {
      measured = {
        em: capture(em),
        wI: capture(wI),
        wD: capture(wD),
        dstE: dstE.getBoundingClientRect(),
        dstI: dstI.getBoundingClientRect(),
        dstD: dstD.getBoundingClientRect(),
      };
      return measured;
    } catch (e) {
      measured = null;
      return null;
    }
  }

  function flip(el, dstRect, cap) {
    if (!el || !dstRect || !cap) return false;
    try {
      var base = cap.base;
      var r2 = dstRect;
      if (!(base.width > 0 && base.height > 0 && r2.width > 0 && r2.height > 0)) {
        return false;
      }
      var dx = r2.left + r2.width / 2 - (base.left + base.width / 2);
      var dy = r2.top + r2.height / 2 - (base.top + base.height / 2);
      var scale = r2.height / base.height;
      if (!isFinite(scale) || scale <= 0) scale = 1;
      var o = parseFloat(cap.fromO);
      if (!isFinite(o)) o = 1;
      var animation = el.animate(
        [
          { transform: cap.fromT === "none" ? "none" : cap.fromT, opacity: o },
          { transform: "translate(" + dx + "px, " + dy + "px) scale(" + scale + ")", opacity: 1 },
        ],
        { duration: Math.round(900 / SPEED), easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
      );
      if (animation) activeFlips.push(animation);
      return true;
    } catch (e) {
      return false;
    }
  }

  function startFlip() {
    var rects = measureFlip();
    if (!rects) {
      try {
        root.classList.add("intro-flip-fallback");
      } catch (e) {}
      return;
    }
    var em = document.querySelector("#intro [data-intro-emblem]");
    var wI = document.querySelector('#intro [data-intro-word="ingenio"]');
    var wD = document.querySelector('#intro [data-intro-word="digital"]');
    var okE = flip(em, rects.dstE, rects.em);
    var okI = flip(wI, rects.dstI, rects.wI);
    var okD = flip(wD, rects.dstD, rects.wD);
    if (!(okE && okI && okD)) {
      try {
        root.classList.add("intro-flip-fallback");
      } catch (e) {}
    }
    if (frozen) {
      for (var i = 0; i < activeFlips.length; i++) {
        try {
          activeFlips[i].pause();
          var nt = (frozenAtNum - T.opening) * 1000;
          activeFlips[i].currentTime = nt > 0 ? nt : 0;
        } catch (e) {}
      }
    }
  }

  var openingStarted = false;
  function startOpening() {
    if (openingStarted || root.classList.contains("intro-done")) return;
    openingStarted = true;
    try {
      root.classList.add("intro-opening");
    } catch (e) {}
    startFlip();
  }

  /* Clic/toque en cualquier parte del overlay (fuera de Skip): adelanta
     directamente a la fase de apertura si aún no empezó. */
  function jumpToOpening() {
    if (openingStarted || root.classList.contains("intro-done")) return;
    /* Clic/toque que lleva a la apertura = salto: marca la visita (solo si
       el intro real está activo; en /intro-test no hay intro-on). */
    if (root.classList.contains("intro-on")) markSeen();
    clearScheduled();
    logPhase("apertura (salto)");
    startOpening();
    if (!frozen) {
      scheduled.push(
        window.setTimeout(function () {
          logPhase("fin");
          end("timeline");
        }, MS(0.95))
      );
    }
  }

  var overlay = document.getElementById("intro");
  if (overlay) {
    overlay.addEventListener("pointerdown", function (event) {
      try {
        if (event.target && event.target.closest && event.target.closest("[data-intro-skip]")) {
          return; // el botón Saltar cierra de inmediato
        }
      } catch (e) {}
      jumpToOpening();
    });
  }

  var skip = document.querySelector("[data-intro-skip]");
  if (skip) {
    skip.addEventListener("click", function () {
      end("skip");
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") end("skip");
  });

  if (!overlay) {
    end("timeline");
    return;
  }

  if (frozen) {
    logPhase("entrada");
    if (frozenAtNum >= T.opening) {
      try {
        root.classList.add("intro-opening");
      } catch (e) {}
      openingStarted = true;
    }
    startFlip();
    return;
  }

  logPhase("entrada");
  schedule("separación", T.split, function () {});
  schedule("carga", T.load, function () {});
  schedule("medición", T.measure, measureFlip);
  schedule("apertura", T.opening, startOpening);
  schedule("fin", T.end, function () {
    end("timeline");
  });
  }

  /* Esperar a theme-init ("js") con tope defensivo de 4 s */
  function isInlineReady() {
    return document.documentElement.classList.contains("js");
  }
  if (isInlineReady()) {
    startIntroExit();
    return;
  }
  var tries = 0;
  var poller = window.setInterval(function () {
    tries += 1;
    if (isInlineReady() || tries > 400) {
      window.clearInterval(poller);
      startIntroExit();
    }
  }, 10);
})();
