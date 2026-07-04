import React, { useState, useEffect } from "react";
import LottieReact from "lottie-react";
import type { GenUIComponentProps } from "../types";

/**
 * Lottie media component — renders a Lottie animation from URL or inline data.
 */
export const Lottie: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { url, animationData, loop, autoplay, width, height, style } =
    properties ?? {};
  const [fetchedData, setFetchedData] = useState<unknown>(null);

  useEffect(() => {
    if (!url || typeof url !== "string") return;

    // G4: AbortController guards against two hazards:
    //   1. unmount → the fetch is aborted so it won't setState on a gone component
    //   2. url change → the previous request is aborted so a slow old response
    //      can't overwrite the new one (race protection)
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (!controller.signal.aborted) setFetchedData(data);
      })
      .catch((err) => {
        // AbortError is expected on unmount/url-change — not a real failure.
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("[GenUI] Lottie fetch failed:", err);
      });

    return () => controller.abort();
  }, [url]);

  const data = animationData || fetchedData;

  if (!data) {
    return (
      <div
        style={{
          width: (width as number | string) || 200,
          height: (height as number | string) || 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
          ...(style as React.CSSProperties),
        }}
      >
        Loading animation...
      </div>
    );
  }

  return (
    <div
      style={{
        width: (width as number | string) || 200,
        height: (height as number | string) || 200,
        ...(style as React.CSSProperties),
      }}
    >
      <LottieReact
        animationData={data}
        loop={loop !== false}
        autoplay={autoplay !== false}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};
