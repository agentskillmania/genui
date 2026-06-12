/**
 * Unit tests for the Column layout component.
 * Covers: rendering without properties, span/offset/push/pull/order/flex props,
 * default flex column style, custom style, and children.
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

  it('renders children inside the column', () => {
    render(
      <Column {...makeProps()}>
        <div>Col Content</div>
      </Column>,
    );

    expect(screen.getByText('Col Content')).toBeDefined();
  });

  it('applies default flex column style with gap', () => {
    const { container } = render(
      <Column {...makeProps()}>
        <div>Item</div>
      </Column>,
    );

    const colEl = container.querySelector('.ant-col') as HTMLElement;
    expect(colEl.style.display).toBe('flex');
    expect(colEl.style.flexDirection).toBe('column');
    expect(colEl.style.gap).toBe('12px');
  });

  it('applies span class when span is provided', () => {
    const { container } = render(
      <Column {...makeProps({ span: 8 })}>
        <div>Item</div>
      </Column>,
    );

    const colEl = container.querySelector('.ant-col');
    expect(colEl).toBeTruthy();
    expect(colEl!.className).toContain('ant-col-8');
  });

  it('applies offset class when offset is provided', () => {
    const { container } = render(
      <Column {...makeProps({ span: 6, offset: 2 })}>
        <div>Item</div>
      </Column>,
    );

    const colEl = container.querySelector('.ant-col');
    expect(colEl!.className).toContain('ant-col-offset-2');
  });

  it('moves all user styles to inner wrapper when visual properties present', () => {
    const { container } = render(
      <Column {...makeProps({ style: { backgroundColor: 'green', padding: 12, borderRadius: 8 } })}>
        <span>Item</span>
      </Column>,
    );

    // Col only has base flex styles — no user styles
    const colEl = container.querySelector('.ant-col') as HTMLElement;
    expect(colEl.style.backgroundColor).toBeFalsy();
    expect(colEl.style.padding).toBeFalsy();
    expect(colEl.style.borderRadius).toBeFalsy();
    expect(colEl.style.display).toBe('flex');

    // Inner wrapper holds ALL user styles (first child div = the wrapper)
    const inner = colEl.querySelector('div') as HTMLElement;
    expect(inner.style.backgroundColor).toBe('green');
    expect(inner.style.padding).toBe('12px');
    expect(inner.style.borderRadius).toBe('8px');
    expect(inner.style.display).toBe('flex');
    expect(inner.style.flexDirection).toBe('column');
    expect(inner.style.flexGrow).toBe('1');
  });

  it('applies non-visual styles directly to Col without inner wrapper', () => {
    const { container } = render(
      <Column {...makeProps({ style: { marginTop: 8, padding: 16 } })}>
        <span>Item</span>
      </Column>,
    );

    // No visual properties → no inner wrapper div
    const colEl = container.querySelector('.ant-col') as HTMLElement;
    expect(colEl.querySelector('div')).toBeNull();
    expect(colEl.style.marginTop).toBe('8px');
    expect(colEl.style.padding).toBe('16px');
    expect(colEl.style.display).toBe('flex');
  });

  it('renders multiple children', () => {
    render(
      <Column {...makeProps()}>
        <div>A</div>
        <div>B</div>
        <div>C</div>
      </Column>,
    );

    expect(screen.getByText('A')).toBeDefined();
    expect(screen.getByText('B')).toBeDefined();
    expect(screen.getByText('C')).toBeDefined();
  });
});
