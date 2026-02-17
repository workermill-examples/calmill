import * as React from "react";

/**
 * Embed layout — minimal shell for iframe-embedded booking pages.
 *
 * Key differences from the public layout:
 * - No header, footer, or navigation
 * - Transparent background so host pages can style the container
 * - No max-width constraint — the iframe determines sizing
 */
export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-transparent min-h-screen">
      {children}
    </div>
  );
}
