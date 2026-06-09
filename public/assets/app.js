/* ============================================================
   ORINUX — interactions
   ============================================================ */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- nav scroll state ---------- */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        if (e.target.hasAttribute("data-count")) animateCount(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal, [data-count]").forEach(function (el) { io.observe(el); });

  /* ---------- animated counters ---------- */
  function animateCount(el) {
    if (reduced) { el.textContent = el.getAttribute("data-suffix-final") || el.getAttribute("data-count"); return; }
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    var dur = 1500, start = null;
    function tick(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      var disp = target % 1 === 0 ? Math.floor(val) : val.toFixed(1);
      el.textContent = prefix + disp + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    var fin = target % 1 === 0 ? Math.floor(target) : target.toFixed(1);
    setTimeout(function () { el.textContent = prefix + fin + suffix; }, dur + 250);
  }

  /* ---------- feature card cursor glow ---------- */
  document.querySelectorAll(".feat-card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ---------- module tabs filter ---------- */
  var tabs = document.querySelectorAll(".mod-tab");
  var cards = document.querySelectorAll(".mod-card");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.setAttribute("aria-selected", "false"); });
      tab.setAttribute("aria-selected", "true");
      var cat = tab.getAttribute("data-cat");
      cards.forEach(function (c) {
        var show = cat === "all" || c.getAttribute("data-cat") === cat;
        c.classList.toggle("hide", !show);
      });
    });
  });

  /* ---------- mobile menu (simple anchor jump, just closes nothing fancy) ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () { location.hash = "#modules"; });
  }

  /* ============================================================
     HERO — data-network canvas (industries connected by AI)
     ============================================================ */
  var canvas = document.getElementById("hero-canvas");
  if (canvas && !reduced) {
    var ctx = canvas.getContext("2d");
    var W, H, DPR, nodes = [], pulses = [];
    var mouse = { x: -999, y: -999 };

    function accentRGB() {
      // read computed accent via a temp element
      var probe = document.createElement("span");
      probe.style.color = "var(--accent)";
      document.body.appendChild(probe);
      var c = getComputedStyle(probe).color;
      document.body.removeChild(probe);
      var m = c.match(/\d+(\.\d+)?/g);
      return m ? [Math.round(m[0]), Math.round(m[1]), Math.round(m[2])] : [110, 140, 255];
    }
    var col = accentRGB();

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      buildNodes();
    }

    function buildNodes() {
      nodes = [];
      var count = Math.max(34, Math.min(72, Math.floor((W * H) / 26000)));
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.6 + 0.6,
          hub: Math.random() < 0.12
        });
      }
    }

    function spawnPulse() {
      if (nodes.length < 2) return;
      var a = nodes[Math.floor(Math.random() * nodes.length)];
      // find a near-ish neighbor
      var best = null, bestD = 1e9;
      for (var k = 0; k < 6; k++) {
        var b = nodes[Math.floor(Math.random() * nodes.length)];
        if (b === a) continue;
        var d = (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
        if (d < bestD) { bestD = d; best = b; }
      }
      if (best && bestD < 260 * 260) pulses.push({ a: a, b: best, t: 0, sp: 0.012 + Math.random() * 0.02 });
    }

    var maxDist = 165;
    function frame() {
      ctx.clearRect(0, 0, W, H);
      // links
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        // mouse gravity
        var dxm = n.x - mouse.x, dym = n.y - mouse.y;
        var dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < 130) { n.x += dxm / dm * 0.5; n.y += dym / dm * 0.5; }

        for (var j = i + 1; j < nodes.length; j++) {
          var m = nodes[j];
          var dx = n.x - m.x, dy = n.y - m.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            var alpha = (1 - dist / maxDist) * 0.22;
            ctx.strokeStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + alpha + ")";
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }
      // nodes
      for (var p = 0; p < nodes.length; p++) {
        var nd = nodes[p];
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, nd.hub ? nd.r + 1.4 : nd.r, 0, Math.PI * 2);
        ctx.fillStyle = nd.hub
          ? "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",0.95)"
          : "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",0.5)";
        ctx.fill();
        if (nd.hub) {
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, nd.r + 5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",0.08)";
          ctx.fill();
        }
      }
      // data pulses traveling along links
      for (var q = pulses.length - 1; q >= 0; q--) {
        var pu = pulses[q];
        pu.t += pu.sp;
        if (pu.t >= 1) { pulses.splice(q, 1); continue; }
        var px = pu.a.x + (pu.b.x - pu.a.x) * pu.t;
        var py = pu.a.y + (pu.b.y - pu.a.y) * pu.t;
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",0.95)";
        ctx.shadowColor = "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",0.9)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      if (Math.random() < 0.08) spawnPulse();
      requestAnimationFrame(frame);
    }

    canvas.addEventListener("mousemove", function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener("mouseleave", function () { mouse.x = -999; mouse.y = -999; });
    window.addEventListener("resize", resize);
    resize();
    frame();

    // recolor on tweak change
    window.addEventListener("orinux:accent", function () { col = accentRGB(); });
  }

  /* ---------- parallax on hero content ---------- */
  if (!reduced) {
    var heroInner = document.querySelector(".hero-inner");
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (heroInner && y < window.innerHeight) {
        heroInner.style.transform = "translateY(" + y * 0.18 + "px)";
        heroInner.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.75)));
      }
    }, { passive: true });
  }
})();
