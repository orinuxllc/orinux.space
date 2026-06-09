/* ============================================================
   ORINUX — interactions: theme, magnetic, cursor, FAQ, form
   ============================================================ */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme toggle ---------- */
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("orinux-theme"); } catch (e) {}
  root.setAttribute("data-theme", saved || "dark");
  var themeBtn = document.querySelector(".theme-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("orinux-theme", next); } catch (e) {}
      window.dispatchEvent(new Event("orinux:accent")); // recolor canvas dots
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (!reduced && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".magnetic").forEach(function (btn) {
      var strength = 0.32;
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + x * strength + "px," + y * strength + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });

    /* ---------- cursor glow ---------- */
    var glow = document.getElementById("cursor-glow");
    if (glow) {
      var gx = 0, gy = 0, cx = 0, cy = 0, vis = false;
      window.addEventListener("mousemove", function (e) {
        gx = e.clientX; gy = e.clientY;
        if (!vis) { glow.style.opacity = "0.6"; vis = true; }
      });
      window.addEventListener("mouseout", function (e) { if (!e.relatedTarget) { glow.style.opacity = "0"; vis = false; } });
      (function raf() {
        cx += (gx - cx) * 0.12; cy += (gy - cy) * 0.12;
        glow.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
        requestAnimationFrame(raf);
      })();
    }
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var open = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (o) {
        if (o !== item) { o.classList.remove("open"); o.querySelector(".faq-a").style.maxHeight = null; }
      });
      if (open) { item.classList.remove("open"); a.style.maxHeight = null; }
      else { item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
    });
  });
  // recompute open FAQ height on language switch
  window.addEventListener("orinux:lang", function () {
    var open = document.querySelector(".faq-item.open .faq-a");
    if (open) open.style.maxHeight = open.scrollHeight + "px";
  });

  /* ---------- demo form validation ---------- */
  var form = document.getElementById("demo-form");
  if (form) {
    var rules = {
      name: function (v) { return v.trim().length >= 2; },
      company: function (v) { return v.trim().length >= 2; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      phone: function (v) { return v.replace(/[^\d]/g, "").length >= 6; }
    };
    function validateField(name) {
      var input = form.querySelector('[name="' + name + '"]');
      if (!input) return true;
      var fld = input.closest(".fld");
      var ok = rules[name](input.value);
      fld.classList.toggle("invalid", !ok);
      return ok;
    }
    Object.keys(rules).forEach(function (name) {
      var input = form.querySelector('[name="' + name + '"]');
      if (input) input.addEventListener("input", function () {
        if (input.closest(".fld").classList.contains("invalid")) validateField(name);
      });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var allOk = true;
      Object.keys(rules).forEach(function (name) { if (!validateField(name)) allOk = false; });
      if (!allOk) {
        var firstBad = form.querySelector(".fld.invalid input");
        if (firstBad) firstBad.focus();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.style.opacity = "0.6"; }
      var payload = {};
      ["name", "company", "email", "phone", "industry", "message"].forEach(function (k) {
        var el = form.querySelector('[name="' + k + '"]');
        if (el) payload[k] = el.value.trim();
      });
      function done() {
        form.style.display = "none";
        var ok = document.getElementById("form-ok");
        if (ok) ok.classList.add("show");
      }
      fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(done)
        .catch(done); // optimistic: still thank the user even if the network fails
    });
  }
})();
