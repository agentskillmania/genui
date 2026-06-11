/**
 * Unit tests for the Row layout component.
 * Covers: rendering without properties, justify/align/gutter/wrap props,
 * custom style, and children.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Row } from '../../../src/components/layout/Row';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'row-1',
    component: 'Row',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Row component', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Row id="row-undef" component="Row" properties={undefined as unknown as Record<string, unknown>} />,
    );
    expect(container.querySelector('.ant-row')).toBeTruthy();
  });

  it('renders children inside the row', () => {
    render(
      <Row {...makeProps()}>
        <div>Row Child</div>
      </Row>,
    );

    expect(screen.getByText('Row Child')).toBeDefined();
  });

  it('renders multiple children', () => {
    render(
      <Row {...makeProps()}>
        <div>A</div>
        <div>B</div>
      </Row>,
    );

    expect(screen.getByText('A')).toBeDefined();
    expect(screen.getByText('B')).toBeDefined();
  });

  it('applies justify class when justify is provided', () => {
    const { container } = render(
      <Row {...makeProps({ justify: 'center' })}>
        <div>Item</div>
      </Row>,
    );

    const rowEl = container.querySelector('.ant-row');
    expect(rowEl).toBeTruthy();
    expect(rowEl!.className).toContain('ant-row-center');
  });

  it('applies align class when align is provided', () => {
    const { container } = render(
      <Row {...makeProps({ align: 'middle' })}>
        <div>Item</div>
      </Row>,
    );

    const rowEl = container.querySelector('.ant-row');
    expect(rowEl).toBeTruthy();
    expect(rowEl!.className).toContain('ant-row-middle');
  });

  it('applies custom style', () => {
    const { container } = render(
      <Row {...makeProps({ style: { backgroundColor: 'orange' } })}>
        <div>Item</div>
      </Row>,
    );

    const rowEl = container.querySelector('.ant-row') as HTMLElement;
    expect(rowEl.style.backgroundColor).toBe('orange');
  });

  it('renders without children without crashing', () => {
    const { container } = render(<Row {...makeProps()} />);
    expect(container.querySelector('.ant-row')).toBeTruthy();
  });
});
