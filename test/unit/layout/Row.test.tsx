/**
 * Unit tests for the Row layout component.
 * Covers: rendering without properties, justify/align/gutter/wrap props,
 * custom style, children, and auto Col wrapping for non-Column children.
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

  // ---- Auto Col wrapping ----

  it('wraps non-Column children in Col automatically', () => {
    const { container } = render(
      <Row {...makeProps()} childTypes={['Statistic', 'Statistic', 'Statistic']}>
        <div>Stat A</div>
        <div>Stat B</div>
        <div>Stat C</div>
      </Row>,
    );

    const cols = container.querySelectorAll('.ant-col');
    expect(cols).toHaveLength(3);
    expect(screen.getByText('Stat A')).toBeDefined();
  });

  it('does not wrap Column children in extra Col', () => {
    const { container } = render(
      <Row {...makeProps()} childTypes={['Column', 'Column']}>
        <div className="mock-col">Left</div>
        <div className="mock-col">Right</div>
      </Row>,
    );

    // No auto-wrapping Col added — children pass through as-is
    const cols = container.querySelectorAll('.ant-col');
    expect(cols).toHaveLength(0);
  });

  it('wraps only non-Column children in a mixed set', () => {
    const { container } = render(
      <Row {...makeProps()} childTypes={['Column', 'Tag', 'Tag']}>
        <div className="mock-col">Col Child</div>
        <div>Tag A</div>
        <div>Tag B</div>
      </Row>,
    );

    // Only the two Tag children get wrapped; Column child passes through
    const cols = container.querySelectorAll('.ant-col');
    expect(cols).toHaveLength(2);
    expect(cols[0].textContent).toBe('Tag A');
    expect(cols[1].textContent).toBe('Tag B');
  });

  it('wraps all children when childTypes is not provided', () => {
    const { container } = render(
      <Row {...makeProps()}>
        <div>A</div>
        <div>B</div>
      </Row>,
    );

    // No childTypes — treat all as non-Column
    const cols = container.querySelectorAll('.ant-col');
    expect(cols).toHaveLength(2);
  });
});
