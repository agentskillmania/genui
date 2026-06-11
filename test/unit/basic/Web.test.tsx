/**
 * Unit tests for the Web component.
 * Covers: defensive rendering without properties, url rendering,
 * width/height attributes, sandbox attribute, and custom style.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Web } from '../../../src/components/basic/Web';

describe('Web', () => {
  // ---- Defensive rendering ----

  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Web id="web-1" component="Web" />);
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeTruthy();
  });

  // ---- Normal rendering ----

  it('renders iframe with correct src from url property', () => {
    const { container } = render(
      <Web
        id="web-1"
        component="Web"
        properties={{ url: 'https://example.com' }}
      />,
    );
    const iframe = container.querySelector('iframe')!;
    expect(iframe.getAttribute('src')).toBe('https://example.com');
  });

  it('renders iframe with title attribute', () => {
    const { container } = render(
      <Web
        id="web-1"
        component="Web"
        properties={{ url: 'https://example.com' }}
      />,
    );
    const iframe = container.querySelector('iframe')!;
    expect(iframe.getAttribute('title')).toBe('Web Content');
  });

  // ---- Sandbox attribute ----

  it('sets sandbox attribute for security', () => {
    const { container } = render(
      <Web
        id="web-1"
        component="Web"
        properties={{ url: 'https://example.com' }}
      />,
    );
    const iframe = container.querySelector('iframe')!;
    expect(iframe.getAttribute('sandbox')).toBe(
      'allow-scripts allow-same-origin allow-popups',
    );
  });

  // ---- Width and height ----

  it('applies width from properties', () => {
    const { container } = render(
      <Web
        id="web-1"
        component="Web"
        properties={{ url: 'https://example.com', width: '100%' }}
      />,
    );
    const iframe = container.querySelector('iframe')!;
    expect(iframe.getAttribute('width')).toBe('100%');
  });

  it('applies height from properties', () => {
    const { container } = render(
      <Web
        id="web-1"
        component="Web"
        properties={{ url: 'https://example.com', height: 500 }}
      />,
    );
    const iframe = container.querySelector('iframe')!;
    expect(iframe.getAttribute('height')).toBe('500');
  });

  // ---- Custom style ----

  it('applies custom style from properties', () => {
    const { container } = render(
      <Web
        id="web-1"
        component="Web"
        properties={{
          url: 'https://example.com',
          style: { borderRadius: '8px' },
        }}
      />,
    );
    const iframe = container.querySelector('iframe')!;
    expect(iframe.style.borderRadius).toBe('8px');
  });

  it('renders iframe without errors when url is empty', () => {
    const { container } = render(
      <Web id="web-1" component="Web" properties={{}} />,
    );
    const iframe = container.querySelector('iframe')!;
    expect(iframe).toBeTruthy();
    expect(iframe.getAttribute('src')).toBeNull();
  });
});
