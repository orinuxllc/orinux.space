/* ============================================================
   ORINUX — admin live-preview sync (loaded only on /preview, inside
   the managed-sites admin's docked <iframe>)

   The admin posts two message types to this window as the editor types:
     { type: "orinux:preview:update", fields: { "<fieldPath>": value, ... } }
     { type: "orinux:preview:focus",  section: "<schemaSectionKey>" }

   "update" patches the DOM directly — no reload, no server round-trip:
     - "i18n.<key>" field paths go through i18n.js's DICT (covers every
       data-i18n UI-copy string site-wide, ~180 keys, for free).
     - any other field path looks for [data-field-path="<path>"] elements
       (opt-in per component — only a few sections carry this marker today,
       see Results.astro's Homepage-quote block for the pattern) and patches
       their data-i18n-json map, <img src>, or plain textContent.
   Fields with no matching DOM hook are silently ignored — list-shaped
   content (pricing/faq/team/…) has no live hook yet and still needs a Save
   to appear, exactly as before this file existed.

   "focus" scrolls the matching [data-field-section="<key>"] wrapper
   (see Page.astro) into view and flashes it — the admin sends this
   whenever the active sidebar section changes.
   ============================================================ */
(function () {
  "use strict";

  function isTrustedOrigin(origin) {
    try {
      var host = new URL(origin).hostname;
      return host === "orinux.space" || host.slice(-13) === ".orinux.space";
    } catch (e) {
      return false;
    }
  }

  function applyFieldUpdate(fieldPath, value) {
    var parts = fieldPath.split(".");
    var sync = window.__ORINUX_PREVIEW_SYNC__;
    if (parts[0] === "i18n" && parts[1]) {
      if (sync) sync.updateI18nKey(parts[1], value);
      return;
    }
    var nodes = document.querySelectorAll('[data-field-path="' + fieldPath.replace(/"/g, '') + '"]');
    nodes.forEach(function (el) {
      if (el.hasAttribute("data-i18n-json")) {
        try { el.setAttribute("data-i18n-json", JSON.stringify(value)); } catch (e) { /* ignore */ }
        var lang = sync ? sync.currentLang() : "mn";
        var v = null;
        if (value && typeof value === "object") {
          v = value[lang] != null ? value[lang] : Object.values(value)[0];
        } else {
          v = value;
        }
        if (v == null) return;
        if (String(v).indexOf("<") !== -1) el.innerHTML = v;
        else el.textContent = v;
      } else if (el.tagName === "IMG") {
        if (typeof value === "string" && value) el.setAttribute("src", value);
      } else if (typeof value === "string") {
        el.textContent = value;
      }
    });
  }

  function focusSection(section) {
    var el = document.querySelector('[data-field-section="' + section.replace(/"/g, '') + '"]');
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("preview-focus-flash");
    setTimeout(function () { el.classList.remove("preview-focus-flash"); }, 1400);
  }

  window.addEventListener("message", function (event) {
    if (!isTrustedOrigin(event.origin)) return;
    var msg = event.data;
    if (!msg || typeof msg !== "object") return;

    if (msg.type === "orinux:preview:update" && msg.fields && typeof msg.fields === "object") {
      Object.keys(msg.fields).forEach(function (fieldPath) {
        applyFieldUpdate(fieldPath, msg.fields[fieldPath]);
      });
    } else if (msg.type === "orinux:preview:focus" && typeof msg.section === "string") {
      focusSection(msg.section);
    }
  });
})();
