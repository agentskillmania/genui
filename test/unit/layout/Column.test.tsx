/**
 * Unit tests for the Column layout component.
 * Covers: rendering without properties, span/offset props, always-present
 * inner wrapper, style placement, and children.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Column } from '../../../src/components/layout/Column';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'col-1',
    component: 'Column',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Column component', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Column id="col-undef" component="Column" properties={undefined as unknown as Record<string, unknown>} />,
    );
    expect(container.querySelector('.ant-col')).toBeTruthy();
  });

  it('renders children inside the inner wrapper', () => {
    render(
      <Column {...makeProps()}>
        <span>Col Content</span>
      </Column>,
    );

    expect(screen.getByText('Col Content')).toBeDefined();
  });

  it('always renders inner wrapper div with flex column layout', () => {
    const { container } = render(
      <Column {...makeProps()}>
        <span>Item</span>
      </Column>,
    );

    const colEl = container.querySelector('.ant-col') as HTMLElement;
    // Col has flex for height-fill behavior
    expect(colEl.style.display).toBe('flex');
    expect(colEl.style.flexDirection).toBe('column');

    // Inner div has the layout gap and flex:1
    const inner = colEl.querySelector('div') as HTMLElement;
    expect(inner).toBeTruthy();
    expect(inner.style.display).toBe('flex');
    expect(inner.style.flexDirection).toBe('column');
    expect(inner.style.gap).toBe('12px');
    expect(inner.style.flexGrow).toBe('1');
  });

  it('applies span class when span is provided', () => {
    const { container } = render(
      <Column {...makeProps({ span: 8 })}>
        <span>Item</span>
      </Column>,
    );

    const colEl = container.querySelector('.ant-col');
    expect(colEl).toBeTruthy();
    expect(colEl!.className).toContain('ant-col-8');
  });

  it('applies offset class when offset is provided', () => {
    const { container } = render(
      <Column {...makeProps({ span: 6, offset: 2 })}>
        <span>Item</span>
      </Column>,
    );

    const colEl = container.querySelector('.ant-col');
    expect(colEl!.className).toContain('ant-col-offset-2');
  });

  it('places all user styles on inner wrapper, not on Col', () => {
    const { container } = render(
      <Column {...makeProps({ style: { backgroundColor: 'green', padding: 12, borderRadius: 8, marginTop: 16 } })}>
        <span>Item</span>
      </Column>,
    );

    // Col only has grid positioning — no user styles
    const colEl = container.querySelector('.ant-col') as HTMLElement;
    expect(colEl.style.backgroundColor).toBeFalsy();
    expect(colEl.style.padding).toBeFalsy();
    expect(colEl.style.marginTop).toBeFalsy();

    // Inner wrapper has ALL user styles
    const inner = colEl.querySelector('div') as HTMLElement;
    expect(inner.style.backgroundColor).toBe('green');
    expect(inner.style.padding).toBe('12px');
    expect(inner.style.borderRadius).toBe('8px');
    expect(inner.style.marginTop).toBe('16px');
  });

  it('renders multiple children inside the inner wrapper', () => {
    const { container } = render(
      <Column {...makeProps()}>
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </Column>,
    );

    expect(screen.getByText('A')).toBeDefined();
    expect(screen.getByText('B')).toBeDefined();
    expect(screen.getByText('C')).toBeDefined();

    // All children are inside the single inner wrapper
    const inner = container.querySelector('.ant-col > div') as HTMLElement;
    expect(inner.children.length).toBe(3);
  });

  it('keeps Col gutter-friendly when background is set', () => {
    const { container } = render(
      <Column {...makeProps({ span: 8, style: { backgroundColor: '#e6f7ff', padding: 12 } })}>
        <span>Stat</span>
      </Column>,
    );

    const colEl = container.querySelector('.ant-col') as HTMLElement;
    // Col has NO background → gutter padding stays transparent
    expect(colEl.style.backgroundColor).toBeFalsy();
    // Background is on inner wrapper
    const inner = colEl.querySelector('div') as HTMLElement;
    expect(inner.style.backgroundColor).toBe('rgb(230, 247, 255)');
  });
});
