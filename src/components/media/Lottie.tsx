import React, { useState, useEffect } from 'react';
import LottieReact from 'lottie-react';
import type { GenUIComponentProps } from '../types';

/**
 * Lottie media component — renders a Lottie animation from URL or inline data.
 */
export const Lottie: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { url, animationData, loop, autoplay, width, height, style } = properties ?? {};
  const [fetchedData, setFetchedData] = useState<unknown>(null);

  useEffect(() => {
    if (url && typeof url === 'string') {
      fetch(url)
        .then((res) => res.json())
        .then((data) => setFetchedData(data))
        .catch((err) => console.error('[GenUI] Lottie fetch failed:', err));
    }
  }, [url]);

  const data = animationData || fetchedData;

  if (!data) {
    return (
      <div
        style={{
          width: (width as number | string) || 200,
          height: (height as number | string) || 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          ...style as React.CSSProperties,
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
        ...style as React.CSSProperties,
      }}
    >
      <LottieReact
        animationData={data}
        loop={loop !== false}
        autoplay={autoplay !== false}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
