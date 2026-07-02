import React from 'react';
import { Typography } from 'antd';
import DOMPurify from 'dompurify';
import type { GenUIComponentProps } from '../types';

/**
 * RichText data component — renders HTML content safely.
 *
 * SEC12: content comes from an untrusted producer (LLM output) and is rendered
 * as HTML. It MUST be sanitized via DOMPurify to strip <script>, onerror
 * handlers, and other XSS vectors before being injected into the DOM.
 */
export const RichText: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { content, style } = properties ?? {};

  const sanitized = React.useMemo(() => {
    return DOMPurify.sanitize((content as string) || '');
  }, [content]);

  return (
    <Typography
      style={style as React.CSSProperties}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};
