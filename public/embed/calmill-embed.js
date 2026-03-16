/**
 * CalMill Embed Script
 * Enables embeddable booking widgets for websites
 */
(function () {
  "use strict";

  // Prevent multiple loads
  if (window.CalMill) {
    return;
  }

  const CalMill = {
    version: "1.0.0",

    /**
     * Initialize inline embed widget
     * @param {string} selector - CSS selector for container element
     * @param {string} embedPath - Path to booking page (username/event-slug)
     */
    embed: function (selector, embedPath) {
      const container = document.querySelector(selector);
      if (!container) {
        console.warn("CalMill: Container not found:", selector);
        return;
      }

      const baseUrl = this.getBaseUrl();
      const embedUrl = `${baseUrl}/embed/${embedPath}`;

      // Create iframe
      const iframe = document.createElement("iframe");
      iframe.src = embedUrl;
      iframe.width = "100%";
      iframe.height = container.style.height || "600px";
      iframe.frameBorder = "0";
      iframe.style.border = "none";
      iframe.style.borderRadius = container.style.borderRadius || "8px";
      iframe.title = "CalMill Booking Widget";

      // Clear container and add iframe
      container.innerHTML = "";
      container.appendChild(iframe);

      // Listen for resize messages from iframe
      this.setupMessageListener(iframe);
    },

    /**
     * Open booking popup
     * @param {string} embedPath - Path to booking page (username/event-slug)
     */
    popup: function (embedPath) {
      const baseUrl = this.getBaseUrl();
      const embedUrl = `${baseUrl}/embed/${embedPath}`;

      const popup = window.open(
        embedUrl,
        "calmill-booking",
        "width=800,height=700,scrollbars=yes,resizable=yes",
      );

      if (!popup) {
        console.warn(
          "CalMill: Popup blocked. Please allow popups for this site.",
        );
        return;
      }

      // Listen for booking completion messages
      this.setupPopupListener(popup);
    },

    /**
     * Get base URL for CalMill instance
     */
    getBaseUrl: function () {
      // Use the script's origin as base URL
      const scripts = document.getElementsByTagName("script");
      for (let script of scripts) {
        if (script.src && script.src.includes("calmill-embed.js")) {
          const url = new URL(script.src);
          return url.origin;
        }
      }
      // Fallback to current origin
      return window.location.origin;
    },

    /**
     * Setup message listener for iframe communication
     */
    setupMessageListener: function (iframe) {
      window.addEventListener("message", function (event) {
        // Verify origin for security
        const baseUrl = CalMill.getBaseUrl();
        if (event.origin !== baseUrl) {
          return;
        }

        const data = event.data;

        // Handle resize messages
        if (data.type === "calmill-resize" && data.height) {
          iframe.style.height = data.height + "px";
        }

        // Handle booking completion
        if (data.type === "calmill-booking") {
          // Dispatch custom event
          const bookingEvent = new CustomEvent("calmillBooking", {
            detail: data.booking,
          });
          document.dispatchEvent(bookingEvent);
        }
      });
    },

    /**
     * Setup popup listener for booking completion
     */
    setupPopupListener: function (popup) {
      window.addEventListener("message", function (event) {
        // Verify origin for security
        const baseUrl = CalMill.getBaseUrl();
        if (event.origin !== baseUrl) {
          return;
        }

        const data = event.data;

        // Handle booking completion in popup
        if (data.type === "calmill-booking") {
          // Close popup
          popup.close();

          // Dispatch custom event
          const bookingEvent = new CustomEvent("calmillBooking", {
            detail: data.booking,
          });
          document.dispatchEvent(bookingEvent);
        }
      });
    },
  };

  // Make CalMill globally available
  window.CalMill = CalMill;

  // Auto-initialize data attributes
  document.addEventListener("DOMContentLoaded", function () {
    CalMill.autoInit();
  });

  // Auto-init function for data attributes
  CalMill.autoInit = function () {
    // Initialize inline embeds
    const inlineEmbeds = document.querySelectorAll("[data-calmill-embed]");
    inlineEmbeds.forEach(function (element) {
      const embedPath = element.getAttribute("data-calmill-embed");
      if (embedPath) {
        element.style.position = "relative";
        CalMill.embed(element, embedPath);
      }
    });

    // Initialize popup buttons
    const popupButtons = document.querySelectorAll("[data-calmill-popup]");
    popupButtons.forEach(function (button) {
      const embedPath = button.getAttribute("data-calmill-popup");
      if (embedPath) {
        button.addEventListener("click", function () {
          CalMill.popup(embedPath);
        });
      }
    });
  };

  // Initialize if DOM is already ready
  if (document.readyState === "loading") {
    // DOM is still loading
  } else {
    // DOM is ready
    CalMill.autoInit();
  }
})();
