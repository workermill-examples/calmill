/**
 * CalMill Embed Script
 * Lightweight vanilla JS loader for inline and popup booking widgets.
 *
 * Inline usage:
 *   <div data-calmill-embed="username/slug" data-calmill-theme="light"></div>
 *   <script src="https://calmill.workermill.com/embed/calmill-embed.js" async></script>
 *
 * Popup usage:
 *   <button data-calmill-popup="username/slug">Book a Meeting</button>
 *   <script src="https://calmill.workermill.com/embed/calmill-embed.js" async></script>
 */
(function () {
  "use strict";

  // Derive the CalMill base URL from the script's own src attribute.
  // Falls back to the canonical production URL.
  var scriptEl = document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName("script");
      return scripts[scripts.length - 1];
    })();

  var CALMILL_URL = (function () {
    if (scriptEl && scriptEl.src) {
      var url = new URL(scriptEl.src);
      return url.origin;
    }
    return "https://calmill.workermill.com";
  })();

  // ─── HELPERS ───────────────────────────────────────────────────────────────

  /**
   * Build an embed iframe URL from a "username/slug" string and optional params.
   * @param {string} handle  "username/slug"
   * @param {Object} [opts]
   * @param {string} [opts.theme]
   * @param {string} [opts.timezone]
   * @param {string} [opts.hideEventDetails]
   * @returns {string}
   */
  function buildEmbedUrl(handle, opts) {
    var parts = (handle || "").split("/");
    var username = parts[0];
    var slug = parts[1];
    if (!username || !slug) return null;

    var url = CALMILL_URL + "/embed/" + encodeURIComponent(username) + "/" + encodeURIComponent(slug);
    var params = [];
    if (opts && opts.theme) params.push("theme=" + encodeURIComponent(opts.theme));
    if (opts && opts.timezone) params.push("timezone=" + encodeURIComponent(opts.timezone));
    if (opts && opts.hideEventDetails === "true") params.push("hideEventDetails=true");
    if (params.length) url += "?" + params.join("&");
    return url;
  }

  /**
   * Create and style a booking iframe element.
   * @param {string} src  Full embed URL
   * @param {string} title  Accessible title for the iframe
   * @returns {HTMLIFrameElement}
   */
  function createIframe(src, title) {
    var iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = title || "CalMill Booking";
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("allow", "clipboard-write");
    iframe.style.cssText = [
      "width: 100%",
      "border: none",
      "border-radius: 8px",
      "min-height: 500px",
      "display: block",
      "transition: height 0.15s ease",
    ].join("; ");
    return iframe;
  }

  // ─── INLINE EMBEDS ─────────────────────────────────────────────────────────

  /**
   * Find all [data-calmill-embed] divs and replace them with booking iframes.
   */
  function initInlineEmbeds() {
    var containers = document.querySelectorAll("[data-calmill-embed]");
    for (var i = 0; i < containers.length; i++) {
      var container = containers[i];
      var handle = container.getAttribute("data-calmill-embed");
      if (!handle) continue;

      // Skip if already initialized
      if (container.getAttribute("data-calmill-initialized")) continue;
      container.setAttribute("data-calmill-initialized", "1");

      var opts = {
        theme: container.getAttribute("data-calmill-theme") || "light",
        timezone: container.getAttribute("data-calmill-timezone") || "",
        hideEventDetails: container.getAttribute("data-calmill-hide-event-details") || "",
      };

      var embedUrl = buildEmbedUrl(handle, opts);
      if (!embedUrl) continue;

      var iframe = createIframe(embedUrl, "CalMill Booking — " + handle);
      // Store handle on iframe so resize handler can match it
      iframe.setAttribute("data-calmill-handle", handle);

      container.innerHTML = "";
      container.appendChild(iframe);
    }
  }

  // ─── POPUP EMBEDS ──────────────────────────────────────────────────────────

  /**
   * Find all [data-calmill-popup] elements and attach click handlers.
   */
  function initPopupEmbeds() {
    var triggers = document.querySelectorAll("[data-calmill-popup]");
    for (var i = 0; i < triggers.length; i++) {
      var trigger = triggers[i];
      var handle = trigger.getAttribute("data-calmill-popup");
      if (!handle) continue;

      // Skip if already initialized
      if (trigger.getAttribute("data-calmill-initialized")) continue;
      trigger.setAttribute("data-calmill-initialized", "1");

      // Capture opts from data attributes at bind time
      (function (el, h) {
        el.addEventListener("click", function (e) {
          e.preventDefault();
          var opts = {
            theme: el.getAttribute("data-calmill-theme") || "light",
            timezone: el.getAttribute("data-calmill-timezone") || "",
            hideEventDetails: el.getAttribute("data-calmill-hide-event-details") || "",
          };
          openPopup(h, opts);
        });
      })(trigger, handle);
    }
  }

  // ─── POPUP OVERLAY ─────────────────────────────────────────────────────────

  var activeOverlay = null;

  /**
   * Open a full-screen booking popup overlay.
   * @param {string} handle  "username/slug"
   * @param {Object} opts
   */
  function openPopup(handle, opts) {
    if (activeOverlay) return; // Already open

    var embedUrl = buildEmbedUrl(handle, opts);
    if (!embedUrl) return;

    // Prevent body scroll
    var originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // ── Backdrop ──────────────────────────────────────────────────────────
    var backdrop = document.createElement("div");
    backdrop.style.cssText = [
      "position: fixed",
      "inset: 0",
      "z-index: 2147483647",
      "display: flex",
      "align-items: center",
      "justify-content: center",
      "background: rgba(0, 0, 0, 0.5)",
      "padding: 16px",
      "box-sizing: border-box",
      "opacity: 0",
      "transition: opacity 0.2s ease",
    ].join("; ");
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-label", "CalMill Booking");

    // ── Container (white card) ────────────────────────────────────────────
    var container = document.createElement("div");
    container.style.cssText = [
      "position: relative",
      "width: 100%",
      "max-width: 900px",
      "max-height: calc(100vh - 32px)",
      "overflow-y: auto",
      "background: white",
      "border-radius: 12px",
      "box-shadow: 0 25px 50px rgba(0,0,0,0.25)",
      "transform: scale(0.95)",
      "transition: transform 0.2s ease",
    ].join("; ");

    // ── Close button ──────────────────────────────────────────────────────
    var closeBtn = document.createElement("button");
    closeBtn.setAttribute("type", "button");
    closeBtn.setAttribute("aria-label", "Close booking dialog");
    closeBtn.style.cssText = [
      "position: absolute",
      "top: 12px",
      "right: 12px",
      "z-index: 1",
      "width: 32px",
      "height: 32px",
      "display: flex",
      "align-items: center",
      "justify-content: center",
      "background: rgba(0,0,0,0.08)",
      "border: none",
      "border-radius: 50%",
      "cursor: pointer",
      "font-size: 18px",
      "line-height: 1",
      "color: #374151",
      "transition: background 0.15s",
    ].join("; ");
    closeBtn.textContent = "\u00D7"; // ×
    closeBtn.addEventListener("mouseenter", function () {
      closeBtn.style.background = "rgba(0,0,0,0.15)";
    });
    closeBtn.addEventListener("mouseleave", function () {
      closeBtn.style.background = "rgba(0,0,0,0.08)";
    });

    // ── Iframe ────────────────────────────────────────────────────────────
    var iframe = createIframe(embedUrl, "CalMill Booking — " + handle);
    iframe.style.borderRadius = "12px";
    iframe.setAttribute("data-calmill-handle", handle);

    // ── Assemble ──────────────────────────────────────────────────────────
    container.appendChild(closeBtn);
    container.appendChild(iframe);
    backdrop.appendChild(container);
    document.body.appendChild(backdrop);
    activeOverlay = backdrop;

    // Animate in
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        backdrop.style.opacity = "1";
        container.style.transform = "scale(1)";
      });
    });

    // Focus trap — focus the close button on open
    closeBtn.focus();

    // ── Close handlers ────────────────────────────────────────────────────

    function closePopup() {
      if (!activeOverlay) return;
      backdrop.style.opacity = "0";
      container.style.transform = "scale(0.95)";
      setTimeout(function () {
        if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
        document.body.style.overflow = originalOverflow;
        activeOverlay = null;
      }, 200);
    }

    closeBtn.addEventListener("click", closePopup);

    // Click outside the container closes the popup
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) closePopup();
    });

    // Escape key closes the popup
    function handleKeyDown(e) {
      if (e.key === "Escape" || e.keyCode === 27) {
        closePopup();
        document.removeEventListener("keydown", handleKeyDown);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
  }

  // ─── POSTMESSAGE: RESIZE ───────────────────────────────────────────────────

  /**
   * Listen for resize messages from embedded iframes and update their height.
   * Also listens for calmill:booked messages from the embed page.
   */
  window.addEventListener("message", function (e) {
    if (!e.data || typeof e.data !== "object") return;

    var type = e.data.type;

    if (type === "calmill:resize") {
      var height = e.data.height;
      if (!height || typeof height !== "number") return;

      // Find the iframe that sent this message (match by contentWindow)
      var iframes = document.querySelectorAll("iframe[data-calmill-handle]");
      for (var i = 0; i < iframes.length; i++) {
        if (iframes[i].contentWindow === e.source) {
          iframes[i].style.height = height + "px";
          break;
        }
      }

      // Also handle resize for the popup iframe if it's open
      if (activeOverlay) {
        var popupIframe = activeOverlay.querySelector("iframe[data-calmill-handle]");
        if (popupIframe && popupIframe.contentWindow === e.source) {
          popupIframe.style.height = height + "px";
        }
      }
    }

    if (type === "calmill:booked") {
      // Dispatch a custom DOM event so host pages can react to booking completion
      var booking = e.data.booking || {};
      var event = new CustomEvent("calmill:booked", {
        bubbles: true,
        detail: booking,
      });
      document.dispatchEvent(event);
    }
  });

  // ─── INIT ──────────────────────────────────────────────────────────────────

  /**
   * Initialize all embed widgets on the page.
   * Safe to call multiple times — elements are marked as initialized.
   */
  function init() {
    initInlineEmbeds();
    initPopupEmbeds();
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose the API for dynamic initialization (e.g., SPAs)
  window.CalMill = window.CalMill || {};
  window.CalMill.init = init;
  window.CalMill.openPopup = openPopup;
})();
