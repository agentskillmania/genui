/**
 * Unit tests for the Web component.
 * Covers: defensive rendering without properties, url rendering,
 * width/height attributes, sandbox attribute, and custom style.
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Web } from '../../../src/components/basic/Web';

describe('Web', () => {
  // ---- Defensive rendering ----

  it('renders nothing when properties is undefined', () => {
    const { container } = render(<Web id="web-1" component="Web" />);
    expect(container.querySelector('iframe')).toBeNull();
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

  it('sets sandbox attribute without allow-same-origin for security', () => {
    const { container } = render(
      <Web
        id="web-1"
        component="Web"
        properties={{ url: 'https://example.com' }}
      />,
    );
    const iframe = container.querySelector('iframe')!;
    const sandbox = iframe.getAttribute('sandbox') ?? '';
    expect(sandbox).toBe('allow-scripts allow-popups');
    // allow-same-origin must NOT be present — combined with allow-scripts it
    // lets the embedded page escape the sandbox and access the parent.
    expect(sandbox).not.toContain('allow-same-origin');
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

  it('renders nothing when url is empty or missing', () => {
    const { container } = render(
      <Web id="web-1" component="Web" properties={{}} />,
    );
    expect(container.querySelector('iframe')).toBeNull();
  });

  // ---- URL validation (security) ----

  it('refuses to render javascript: URLs', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(
      <Web
        id="web-1"
        component="Web"
        properties={{ url: 'javascript:alert(1)' }}
      />,
    );
    expect(container.querySelector('iframe')).toBeNull();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('refuses to render data: URLs', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(
      <Web
        id="web-1"
        component="Web"
        properties={{ url: 'data:text/html,<script>alert(1)</script>' }}
      />,
    );
    expect(container.querySelector('iframe')).toBeNull();
    warn.mockRestore();
  });

  it('renders http: URLs', () => {
    const { container } = render(
      <Web
        id="web-1"
        component="Web"
        properties={{ url: 'http://example.com' }}
      />,
    );
    const iframe = container.querySelector('iframe')!;
    expect(iframe.getAttribute('src')).toBe('http://example.com');
  });
});
