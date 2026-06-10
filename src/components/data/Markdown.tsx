import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { GenUIComponentProps } from '../types';

/**
 * Markdown data component — renders Markdown text to HTML.
 */
export const Markdown: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { text, style } = properties;

  return (
    <div style={style as React.CSSProperties}>
      <ReactMarkdown>{(text as string) || ''}</ReactMarkdown>
    </div>
  );
};
