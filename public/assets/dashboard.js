/* ============================================================
   ORINUX — dashboard mockup: live chart, KPIs, agent feed, workflow
   ============================================================ */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- trusted-by marquee ---------- */
  (function () {
    var track = document.getElementById("trust-track");
    if (!track) return;
    // CMS: trust logos come from content.json via this global (fallback below).
    var brands = (window.__ORINUX_TRUST__ && window.__ORINUX_TRUST__.length)
      ? window.__ORINUX_TRUST__.map(function (b) { return [b.name, b.svg]; })
      : [
      ["M5", '<path d="M3 20h18M5 20V9l4-3 4 3M13 20V12l4-3 4 3v8"/>'],
      ["NOMAD", '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18"/>'],
      ["Gobi Tech", '<path d="M12 2 4 7v10l8 5 8-5V7z"/>'],
      ["Altan", '<path d="M12 2l3 6 6 .5-4.5 4 1.5 6-6-3.5L6 18.5 7.5 12.5 3 8.5 9 8z"/>'],
      ["Erdene", '<path d="M3 20h18M5 20V9l4-3 4 3M13 20V12l4-3 4 3v8"/>'],
      ["Khaan Co", '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12h8M12 8v8"/>'],
      ["Tenger", '<path d="M5 18a4 4 0 0 1 0-8 6 6 0 0 1 11.5-2A4.5 4.5 0 0 1 18 18z"/>'],
      ["Mandal", '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>']
    ];
    function mk() {
      return brands.map(function (b) {
        return '<div class="brandmark"><svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">' + b[1] + "</svg>" + b[0] + "</div>";
      }).join("");
    }
    track.innerHTML = mk() + mk(); // duplicate for seamless loop
  })();

  /* ---------- run dashboard when it scrolls into view ---------- */
  var win = document.getElementById("dash-win");
  if (!win) return;
  var started = false;
  function trigger() { if (started) return; started = true; startDash(); dio.disconnect(); }
  var dio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) trigger(); });
  }, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });
  dio.observe(win);
  // fallback: ensure content renders even if never scrolled into view
  window.addEventListener("load", function () { setTimeout(trigger, 3500); });

  function startDash() {
    drawChart();
    runKPIs();
    startFeed();
    runWorkflow();
  }

  /* ---------- animated area chart ---------- */
  function drawChart() {
    var svg = document.querySelector("#dash-chart svg");
    if (!svg) return;
    var W = 480, H = 180;
    var rev = [40, 52, 48, 66, 60, 82, 95];
    var aut = [20, 28, 34, 40, 52, 60, 74];
    function path(data, smooth) {
      var max = 110, n = data.length;
      var pts = data.map(function (v, i) { return [i / (n - 1) * W, H - (v / max) * (H - 16) - 6]; });
      var d = "M" + pts[0][0] + " " + pts[0][1];
      for (var i = 1; i < pts.length; i++) {
        var p0 = pts[i - 1], p1 = pts[i];
        var cx = (p0[0] + p1[0]) / 2;
        d += " C " + cx + " " + p0[1] + " " + cx + " " + p1[1] + " " + p1[0] + " " + p1[1];
      }
      return { line: d, area: d + " L " + W + " " + H + " L 0 " + H + " Z", pts: pts };
    }
    var r = path(rev), a = path(aut);
    var ns = "http://www.w3.org/2000/svg";
    svg.innerHTML = "";
    // gradient defs
    var defs = document.createElementNS(ns, "defs");
    defs.innerHTML =
      '<linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent-bright)"/><stop offset="1" stop-color="var(--accent-bright)" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent-2)"/><stop offset="1" stop-color="var(--accent-2)" stop-opacity="0"/></linearGradient>';
    svg.appendChild(defs);
    function add(tag, attrs) { var el = document.createElementNS(ns, tag); for (var k in attrs) el.setAttribute(k, attrs[k]); svg.appendChild(el); return el; }
    // areas
    add("path", { d: a.area, fill: "url(#ga)", class: "garea" });
    add("path", { d: r.area, fill: "url(#gr)", class: "garea" });
    // lines
    var la = add("path", { d: a.line, stroke: "var(--accent-2)", class: "gline" });
    var lr = add("path", { d: r.line, stroke: "var(--accent-bright)", class: "gline" });
    // end dots
    add("circle", { cx: r.pts[6][0], cy: r.pts[6][1], r: 3.5, fill: "var(--accent-bright)" });
    add("circle", { cx: a.pts[6][0], cy: a.pts[6][1], r: 3.5, fill: "var(--accent-2)" });
    // draw-on animation
    if (!reduced) {
      [lr, la].forEach(function (p, idx) {
        var len = p.getTotalLength();
        p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
        p.style.transition = "stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1) " + (idx * 0.15) + "s";
        requestAnimationFrame(function () { requestAnimationFrame(function () { p.style.strokeDashoffset = 0; }); });
      });
    }
  }

  /* ---------- KPI counters ---------- */
  function runKPIs() {
    var defs = {
      rev: { to: 23.8, pre: "₮", suf: "сая", dec: 1 },
      ord: { to: 1284, suf: "", dec: 0 },
      auto: { to: 87, suf: "%", dec: 0 },
      task: { to: 3412, suf: "", dec: 0 }
    };
    Object.keys(defs).forEach(function (k) {
      var el = document.querySelector('[data-kpi="' + k + '"]');
      if (!el) return;
      var d = defs[k];
      if (reduced) { el.textContent = (d.pre || "") + d.to + (d.suf || ""); return; }
      var start = null, dur = 1500;
      var finalText = (d.pre || "") + (d.dec ? d.to.toFixed(d.dec) : Math.floor(d.to).toLocaleString()) + (d.suf || "");
      function tick(t) {
        if (!start) start = t;
        var p = Math.min((t - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        var v = d.to * e;
        el.textContent = (d.pre || "") + (d.dec ? v.toFixed(d.dec) : Math.floor(v).toLocaleString()) + (d.suf || "");
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      setTimeout(function () { el.textContent = finalText; }, dur + 250); // safety if rAF throttled
    });
  }

  /* ---------- agent activity feed (streams) ---------- */
  var FEED = [
    ["box", "ag", "Агуулахын Agent", " 12 барааны нөөц дуусч байгааг илрүүлэв", "одоо"],
    ["ok", "ag", "Худалдан авалтын Agent", " нийлүүлэгчид автомат захиалга илгээв", "1м"],
    ["doc", "ag", "Санхүүгийн Agent", " 8 нэхэмжлэхийг тулгаж баталгаажуулав", "3м"],
    ["ok", "ag", "HR Agent", " цалингийн тооцоог бэлтгэж дуусгав", "6м"],
    ["box", "ag", "CRM Agent", " 24 шинэ лидийг ангилж хувиарлав", "9м"],
    ["ok", "ag", "Маркетингийн Agent", " имэйл кампанит ажил илгээв (412 хүлээн авагч)", "14м"],
    ["doc", "ag", "Логистикийн Agent", " 6 хүргэлтийн маршрутыг оновчлов", "18м"]
  ];
  function feedIcon(type) {
    var I = {
      box: '<path d="M3 8l9-4 9 4-9 4-9-4z"/><path d="M3 8l9 4 9-4M12 12v8"/>',
      doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
      ok: '<path d="M20 6 9 17l-5-5"/>'
    };
    return I[type] || I.box;
  }
  function startFeed() {
    var list = document.getElementById("feed-list");
    if (!list) return;
    var i = 0, max = 4;
    function push() {
      var f = FEED[i % FEED.length]; i++;
      var item = document.createElement("div");
      item.className = "feed-item";
      item.innerHTML =
        '<div class="feed-ic ' + (f[0] === "ok" ? "ok" : "") + '"><svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">' + feedIcon(f[0]) + "</svg></div>" +
        '<div class="feed-tx"><b><span class="ag">' + f[2] + "</span>" + f[3] + "</b></div>" +
        '<div class="feed-time">' + f[4] + "</div>";
      list.insertBefore(item, list.firstChild);
      while (list.children.length > max) list.removeChild(list.lastChild);
    }
    for (var k = 0; k < max; k++) push();
    if (!reduced) setInterval(push, 3200);
  }

  /* ---------- workflow approval animation ---------- */
  function runWorkflow() {
    var wf = document.getElementById("wf");
    var status = document.getElementById("wf-status");
    if (!wf) return;
    var steps = wf.querySelectorAll(".wf-step");
    var labels = ["хүлээн авч байна…", "AI шалгаж байна…", "хүн баталж байна…", "төлбөр хийгдэж байна…", "✓ амжилттай дууслаа"];
    var idx = 0;
    function cycle() {
      steps.forEach(function (s, si) {
        s.classList.remove("active", "done");
        if (si < idx) s.classList.add("done");
        else if (si === idx) s.classList.add("active");
      });
      if (status) status.textContent = labels[Math.min(idx, labels.length - 1)];
      idx++;
      if (idx > steps.length) {
        steps.forEach(function (s) { s.classList.add("done"); s.classList.remove("active"); });
        if (status) { status.textContent = labels[4]; status.style.color = "var(--emerald)"; }
        if (!reduced) setTimeout(function () { idx = 0; if (status) status.style.color = ""; cycle(); }, 2600);
        return;
      }
      if (!reduced) setTimeout(cycle, 1100);
    }
    cycle();
  }
})();
