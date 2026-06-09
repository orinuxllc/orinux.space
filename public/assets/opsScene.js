/* ============================================================
   ORINUX — Industry Operations Stage
   Animated data-flow diagram: field sources -> ARP AI Core -> outcomes
   ============================================================ */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ops = document.getElementById("ops");
  if (!ops) return;

  /* ---- icon set (simple line icons) ---- */
  var I = {
    worker: '<path d="M4 19a8 8 0 0 1 16 0"/><path d="M5 13a7 7 0 0 1 14 0"/><path d="M12 3v3"/><path d="M9 6h6"/>',
    truck: '<path d="M2 7h11v8H2z"/><path d="M13 10h4l4 3v2h-8z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',
    sensor: '<circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4"/><path d="M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/>',
    patient: '<circle cx="12" cy="8" r="3.2"/><path d="M5 20a7 7 0 0 1 14 0"/><path d="M12 12.5v3M10.5 14h3"/>',
    doctor: '<circle cx="12" cy="8" r="3.2"/><path d="M5 20a7 7 0 0 1 14 0"/><path d="M16 3v2.5"/>',
    device: '<rect x="3" y="4" width="18" height="14" rx="2"/><circle cx="12" cy="11" r="3"/><path d="M3 18v2M21 18v2"/>',
    teacher: '<circle cx="12" cy="7" r="3"/><path d="M6 20a6 6 0 0 1 12 0"/><path d="M19 9v5"/>',
    student: '<path d="M12 4 3 8l9 4 9-4z"/><path d="M7 10.5V15c0 1.5 2.5 2.5 5 2.5s5-1 5-2.5v-4.5"/>',
    camera: '<path d="M3 7h3l2-2h8l2 2h3v12H3z"/><circle cx="12" cy="13" r="3.2"/>',
    conveyor: '<circle cx="6" cy="15" r="2.4"/><circle cx="18" cy="15" r="2.4"/><path d="M6 15h12"/><rect x="9" y="6" width="6" height="5" rx="1"/>',
    quality: '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>',
    alert: '<path d="M12 4 21 20H3z"/><path d="M12 10v4"/><path d="M12 17h.01"/>',
    chart: '<path d="M4 5v15h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
    shield: '<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>',
    pulse: '<path d="M3 12h4l2-6 4 13 2-7h6"/>',
    box: '<path d="M3 8l9-4 9 4v8l-9 4-9-4z"/><path d="M3 8l9 4 9-4M12 12v8"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    users: '<circle cx="9" cy="9" r="3"/><path d="M3 19a6 6 0 0 1 12 0"/><path d="M16 7a3 3 0 0 1 0 6M21 19a6 6 0 0 0-4-5.6"/>',
    cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
    user: '<circle cx="12" cy="8" r="3.4"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
    risk: '<path d="M12 3l9 16H3z"/><path d="M12 9v5M12 16.5h.01"/>',
    money: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M14.5 9.5C14 8.5 13 8 12 8c-1.4 0-2.5.8-2.5 2s1.1 1.6 2.5 2 2.5.9 2.5 2-1.1 2-2.5 2c-1 0-2-.5-2.5-1.5"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M16 7h5v5"/>',
    cart: '<path d="M3 4h2l2.5 12h11"/><path d="M7 7h14l-1.5 7H8.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
    store: '<path d="M4 9h16v11H4z"/><path d="M4 9l1.5-5h13L20 9"/><path d="M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0"/>',
    price: '<path d="M3 3h7l11 11-7 7L3 10z"/><circle cx="7.5" cy="7.5" r="1.4"/>'
  };
  function ic(name) { return '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">' + (I[name] || I.box) + "</svg>"; }

  /* ---- industry data ---- */
  var IND = [
    {
      name: "Уул уурхай", desc: "Талбайн ажилтан, хүнд техник, аюулгүйн сенсорын өгөгдлийг AI бодит цагт боловсруулж удирдлагад дамжуулна.",
      left: [["worker", "Талбайн ажилтан"], ["truck", "Хүнд техник"], ["sensor", "Аюулгүйн сенсор"]],
      right: [["alert", "Урьдчилсан засвар"], ["chart", "Бүтээмж · KPI"], ["shield", "Аюулгүй байдал"]]
    },
    {
      name: "Эрүүл мэнд", desc: "Өвчтөн, эмч, тоног төхөөрөмжийн мэдээллийг нэгтгэж, цаг захиалга, оношийг AI ухаалгаар зохицуулна.",
      left: [["patient", "Өвчтөн"], ["doctor", "Эмч"], ["device", "Тоног төхөөрөмж"]],
      right: [["calendar", "Цаг захиалга"], ["pulse", "AI онош"], ["box", "Эмийн нөөц"]]
    },
    {
      name: "Боловсрол", desc: "Багш, сурагч, аюулгүй байдлын өгөгдлийг автоматжуулж, ирц, дүнг эцэг эхтэй холбоно.",
      left: [["teacher", "Багш"], ["student", "Сурагч"], ["camera", "Аюулгүй байдал"]],
      right: [["check", "Ирц бүртгэл"], ["chart", "Дүн шинжилгээ"], ["users", "Эцэг эхийн портал"]]
    },
    {
      name: "Үйлдвэрлэл", desc: "Үйлдвэрлэлийн шугам, оператор, чанарын сенсорыг хянаж, BOM/MRP, чанарыг real-time удирдана.",
      left: [["conveyor", "Үйлдвэрлэлийн шугам"], ["worker", "Оператор"], ["quality", "Чанарын сенсор"]],
      right: [["cube", "BOM / MRP"], ["check", "Чанарын хяналт"], ["trend", "Бүтээмж"]]
    },
    {
      name: "Даатгал", desc: "Үйлчлүүлэгч, полис, эрсдэлийн мэдээллийг AI-аар үнэлж, нөхөн олговрыг автоматжуулна.",
      left: [["user", "Үйлчлүүлэгч"], ["doc", "Полис"], ["risk", "Эрсдэл"]],
      right: [["money", "Нөхөн олговор"], ["chart", "Эрсдэлийн үнэлгээ"], ["users", "Агент сүлжээ"]]
    },
    {
      name: "Худалдаа", desc: "Худалдан авагч, дэлгүүр, агуулахын урсгалыг AI-аар таамаглаж, үнэ, хүргэлтийг оновчтой болгоно.",
      left: [["cart", "Худалдан авагч"], ["store", "Дэлгүүр / POS"], ["box", "Агуулах"]],
      right: [["trend", "Эрэлт таамаглал"], ["price", "Динамик үнэ"], ["truck", "Хүргэлт"]]
    }
  ];

  /* ---- elements ---- */
  var elNum = document.getElementById("stg-num");
  var elName = document.getElementById("stg-name");
  var elDesc = document.getElementById("stg-desc");
  var elBar = document.getElementById("stg-bar");
  var elTabs = document.getElementById("stg-tabs");
  var elLeft = document.getElementById("ops-left");
  var elRight = document.getElementById("ops-right");
  var svg = document.getElementById("ops-links");
  var SVGNS = "http://www.w3.org/2000/svg";

  /* ---- tabs ---- */
  IND.forEach(function (ind, i) {
    var b = document.createElement("button");
    b.className = "stage-tab";
    b.setAttribute("aria-selected", i === 0 ? "true" : "false");
    b.innerHTML = '<span class="tdot"></span><span>' + ind.name + "</span>";
    b.addEventListener("click", function () { setIndustry(i, true); });
    elTabs.appendChild(b);
  });
  var tabs = elTabs.querySelectorAll(".stage-tab");

  function nodeHTML(item, idx, right) {
    return '<div class="node swap" style="transition-delay:' + (60 + idx * 70) + 'ms">' +
      '<div class="nic">' + ic(item[0]) + "</div>" +
      '<div class="ntxt"><b>' + item[1] + "</b></div></div>";
  }

  /* ---- geometry + flow dots ---- */
  var edges = [];   // {p0,c1,c2,p1}
  var dots = [];    // {e, t, sp}
  var dotG;

  function pt(el, side) {
    var r = el.getBoundingClientRect(), o = ops.getBoundingClientRect();
    return { x: (side === "r" ? r.right : r.left) - o.left, y: r.top + r.height / 2 - o.top };
  }
  function bez(e, t) {
    var u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
    return {
      x: a * e.p0.x + b * e.c1.x + c * e.c2.x + d * e.p1.x,
      y: a * e.p0.y + b * e.c1.y + c * e.c2.y + d * e.p1.y
    };
  }
  function mkEdge(p0, p1) {
    var dx = (p1.x - p0.x) * 0.45;
    return { p0: p0, p1: p1, c1: { x: p0.x + dx, y: p0.y }, c2: { x: p1.x - dx, y: p1.y } };
  }

  function drawLinks() {
    if (!svg) return;
    var o = ops.getBoundingClientRect();
    svg.setAttribute("width", o.width); svg.setAttribute("height", o.height);
    svg.innerHTML = "";
    edges = [];
    var core = ops.querySelector(".core-card");
    if (!core) return;
    var coreL = pt(core, "l"), coreR = pt(core, "r");
    var lefts = elLeft.querySelectorAll(".node");
    var rights = elRight.querySelectorAll(".node");
    lefts.forEach(function (n) { edges.push(mkEdge(pt(n, "r"), coreL)); });
    rights.forEach(function (n) { edges.push(mkEdge(coreR, pt(n, "l"))); });
    // base paths
    edges.forEach(function (e) {
      var p = document.createElementNS(SVGNS, "path");
      p.setAttribute("d", "M" + e.p0.x + " " + e.p0.y + " C " + e.c1.x + " " + e.c1.y + " " + e.c2.x + " " + e.c2.y + " " + e.p1.x + " " + e.p1.y);
      p.setAttribute("class", "ops-line");
      svg.appendChild(p);
    });
    dotG = document.createElementNS(SVGNS, "g");
    svg.appendChild(dotG);
  }

  var spawnAcc = 0, spawnIdx = 0, last = performance.now();
  function loop(now) {
    var dt = Math.min(now - last, 50); last = now;
    if (!reduced && edges.length) {
      spawnAcc += dt;
      if (spawnAcc > 230) {
        spawnAcc = 0;
        var e = edges[spawnIdx % edges.length]; spawnIdx++;
        var c = document.createElementNS(SVGNS, "circle");
        c.setAttribute("r", "3.2"); c.setAttribute("class", "ops-dot");
        if (dotG) { dotG.appendChild(c); dots.push({ e: e, t: 0, sp: 0.0007 + Math.random() * 0.0004, el: c }); }
      }
    }
    for (var i = dots.length - 1; i >= 0; i--) {
      var d = dots[i];
      d.t += d.sp * dt;
      if (d.t >= 1) { if (d.el.parentNode) d.el.parentNode.removeChild(d.el); dots.splice(i, 1); continue; }
      var te = d.t < 0.5 ? 4 * d.t * d.t * d.t : 1 - Math.pow(-2 * d.t + 2, 3) / 2;
      var p = bez(d.e, te);
      d.el.setAttribute("cx", p.x); d.el.setAttribute("cy", p.y);
      d.el.setAttribute("opacity", d.t < 0.12 ? d.t / 0.12 : d.t > 0.88 ? (1 - d.t) / 0.12 : 1);
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* ---- autoplay ---- */
  var active = 0, timer = null, paused = false;
  function schedule() { clearTimeout(timer); if (paused || reduced) return; timer = setTimeout(function () { setIndustry((active + 1) % IND.length, false); }, 6400); }
  function runBar() {
    if (!elBar) return;
    elBar.style.transition = "none"; elBar.style.width = "0%"; void elBar.offsetWidth;
    if (paused || reduced) { elBar.style.width = "28%"; return; }
    elBar.style.transition = "width 6.2s linear"; elBar.style.width = "100%";
  }

  function setIndustry(i, user) {
    active = i;
    var ind = IND[i];
    elNum.textContent = String(i + 1).padStart(2, "0");
    elName.textContent = ind.name;
    elDesc.textContent = ind.desc;
    elLeft.innerHTML = ind.left.map(function (it, j) { return nodeHTML(it, j, false); }).join("");
    elRight.innerHTML = ind.right.map(function (it, j) { return nodeHTML(it, j, true); }).join("");
    tabs.forEach(function (t, ti) { t.setAttribute("aria-selected", ti === i ? "true" : "false"); });
    // clear current dots
    dots.forEach(function (d) { if (d.el.parentNode) d.el.parentNode.removeChild(d.el); });
    dots = [];
    drawLinks();
    requestAnimationFrame(function () {
      elLeft.querySelectorAll(".node").forEach(function (n) { n.classList.remove("swap"); });
      elRight.querySelectorAll(".node").forEach(function (n) { n.classList.remove("swap"); });
    });
    runBar(); schedule();
  }

  // pause on hover
  [document.querySelector(".opsboard"), elTabs].forEach(function (el) {
    if (!el) return;
    el.addEventListener("mouseenter", function () { paused = true; clearTimeout(timer); runBar(); });
    el.addEventListener("mouseleave", function () { paused = false; runBar(); schedule(); });
  });

  // resize -> recompute geometry
  var rt;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(drawLinks, 160); });

  setIndustry(0, false);
  // recompute after fonts/layout settle
  setTimeout(drawLinks, 400);
  window.addEventListener("load", function () { setTimeout(drawLinks, 100); });
})();
