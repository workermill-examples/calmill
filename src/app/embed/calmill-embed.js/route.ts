import { NextResponse } from "next/server";

export const dynamic = 'force-static';

// Vanilla JS embed script - should be under 3KB when minified
const embedScript = `
(function() {
  'use strict';

  const CALMILL_EMBED = {
    iframes: new Map(),

    init: function() {
      // Initialize inline embeds
      document.addEventListener('DOMContentLoaded', () => {
        this.initInlineEmbeds();
        this.initPopupEmbeds();
      });

      // If DOM already loaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.initInlineEmbeds();
          this.initPopupEmbeds();
        });
      } else {
        this.initInlineEmbeds();
        this.initPopupEmbeds();
      }

      // Listen for postMessages from iframes
      window.addEventListener('message', (event) => {
        this.handleMessage(event);
      });
    },

    initInlineEmbeds: function() {
      const embeds = document.querySelectorAll('[data-calmill-embed]');
      embeds.forEach(embed => {
        const path = embed.getAttribute('data-calmill-embed');
        if (path && !embed.hasAttribute('data-calmill-processed')) {
          this.createInlineEmbed(embed, path);
          embed.setAttribute('data-calmill-processed', 'true');
        }
      });
    },

    initPopupEmbeds: function() {
      const buttons = document.querySelectorAll('[data-calmill-popup]');
      buttons.forEach(button => {
        const path = button.getAttribute('data-calmill-popup');
        if (path && !button.hasAttribute('data-calmill-processed')) {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            this.openPopup(path);
          });
          button.setAttribute('data-calmill-processed', 'true');
        }
      });
    },

    createInlineEmbed: function(container, path) {
      const baseUrl = this.getBaseUrl();
      const iframe = document.createElement('iframe');
      const iframeId = 'calmill-' + Math.random().toString(36).substr(2, 9);

      iframe.id = iframeId;
      iframe.src = baseUrl + '/embed/' + path;
      iframe.width = '100%';
      iframe.style.border = 'none';
      iframe.style.display = 'block';
      iframe.style.minHeight = '500px';
      iframe.style.background = 'transparent';
      iframe.allow = 'clipboard-write';
      iframe.loading = 'lazy';

      // Store reference
      this.iframes.set(iframeId, {
        iframe: iframe,
        container: container,
        type: 'inline'
      });

      container.innerHTML = '';
      container.appendChild(iframe);

      return iframe;
    },

    openPopup: function(path) {
      const baseUrl = this.getBaseUrl();
      const popup = window.open('', 'calmill-popup', 'width=800,height=700,scrollbars=yes,resizable=yes');

      if (popup) {
        popup.document.write(\`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>CalMill Booking</title>
            <style>
              body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
              .loading { display: flex; align-items: center; justify-content: center; height: 100vh; }
              .spinner { width: 24px; height: 24px; border: 2px solid #e5e5e5; border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
              @keyframes spin { to { transform: rotate(360deg); } }
            </style>
          </head>
          <body>
            <div class="loading">
              <div class="spinner"></div>
            </div>
            <script>
              window.addEventListener('message', function(event) {
                if (event.data && event.data.type === 'calmill:booking') {
                  // Close popup on successful booking
                  setTimeout(() => window.close(), 2000);
                }
              });
            </script>
          </body>
          </html>
        \`);
        popup.document.close();

        // Create iframe in popup
        const iframe = popup.document.createElement('iframe');
        iframe.src = baseUrl + '/embed/' + path;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = 'none';
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.allow = 'clipboard-write';

        popup.document.body.innerHTML = '';
        popup.document.body.appendChild(iframe);

        // Store reference
        const iframeId = 'popup-' + Math.random().toString(36).substr(2, 9);
        this.iframes.set(iframeId, {
          iframe: iframe,
          popup: popup,
          type: 'popup'
        });
      }
    },

    handleMessage: function(event) {
      if (!event.data || typeof event.data !== 'object') return;

      const { type, data } = event.data;

      if (type === 'calmill:resize') {
        this.handleResize(event.source, data);
      } else if (type === 'calmill:booking') {
        this.handleBooking(event.source, data);
      }
    },

    handleResize: function(source, data) {
      this.iframes.forEach((embed) => {
        if (embed.iframe.contentWindow === source) {
          if (embed.type === 'inline' && data.height) {
            embed.iframe.style.height = data.height + 'px';
          }
        }
      });
    },

    handleBooking: function(source, data) {
      // Dispatch custom event for booking completion
      const event = new CustomEvent('calmillBooking', {
        detail: data
      });
      document.dispatchEvent(event);

      // For popup embeds, the popup will close itself
      this.iframes.forEach((embed) => {
        if (embed.iframe.contentWindow === source && embed.type === 'popup' && embed.popup) {
          setTimeout(() => {
            if (!embed.popup.closed) {
              embed.popup.close();
            }
          }, 2000);
        }
      });
    },

    getBaseUrl: function() {
      // Try to detect from script tag first
      const scripts = document.querySelectorAll('script[src]');
      for (let script of scripts) {
        const src = script.getAttribute('src');
        if (src && src.includes('calmill-embed.js')) {
          const url = new URL(src, window.location.href);
          return url.protocol + '//' + url.host;
        }
      }

      // Fallback to production URL
      return 'https://calmill.workermill.com';
    }
  };

  // Initialize when script loads
  CALMILL_EMBED.init();

  // Expose API for manual initialization
  window.CalMill = {
    embed: function(selector, path) {
      const container = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

      if (container) {
        return CALMILL_EMBED.createInlineEmbed(container, path);
      }
    },

    popup: function(path) {
      CALMILL_EMBED.openPopup(path);
    }
  };
})();
`;

export async function GET() {
  return new NextResponse(embedScript.trim(), {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}