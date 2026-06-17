import React from 'react';
import type { GenUIComponentProps } from '../types';

/**
 * Web component — embeds an external URL in a sandboxed iframe.
 *
 * Security: the URL source comes from the data model (ultimately from an LLM
 * or other untrusted producer), so only http(s) URLs are rendered. Dangerous
 * schemes like `javascript:` and `data:` are rejected. The iframe sandbox
 * enables scripts and popups but intentionally omits `allow-same-origin` —
 * combining it with `allow-scripts` would let the embedded page escape the
 * sandbox and access the parent document.
 */
export const Web: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { url, width, height, style } = properties ?? {};
  const urlString = url as string | undefined;

  // Validate the URL scheme before rendering. Only http/https are allowed.
  let safeUrl: string | null = null;
  if (urlString) {
    try {
      const parsed = new URL(urlString);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        safeUrl = urlString;
      } else {
        console.warn(
          `[GenUI:Web] Refusing to render iframe with disallowed protocol "${parsed.protocol}". Only http: and https: are allowed.`,
        );
      }
    } catch {
      console.warn(`[GenUI:Web] Refusing to render iframe with invalid URL: ${urlString}`);
    }
  }

  if (!safeUrl) {
    return null;
  }

  return (
    <iframe
      src={safeUrl}
      width={width as string | number}
      height={height as string | number}
      style={{
        border: 'none',
        ...style as React.CSSProperties,
      }}
      sandbox="allow-scripts allow-popups"
      title="Web Content"
    />
  );
};
