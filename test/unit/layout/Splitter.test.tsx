/**
 * Unit tests for the Splitter layout component.
 * Covers: rendering without properties, rendering with layout, style, and children.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Splitter } from '../../../src/components/layout/Splitter';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'splitter-1',
    component: 'Splitter',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Splitter', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Splitter
        id="split-undef"
        component="Splitter"
        properties={undefined as unknown as Record<string, unknown>}
      />,
    );
    expect(container.querySelector('.ant-splitter')).toBeTruthy();
  });

  it('renders with horizontal layout by default', () => {
    const { container } = render(
      <Splitter {...makeProps()} />,
    );
    const splitter = container.querySelector('.ant-splitter');
    expect(splitter).toBeTruthy();
  });

  it('renders with vertical layout', () => {
    const { container } = render(
      <Splitter {...makeProps({ layout: 'vertical' })} />,
    );
    const splitter = container.querySelector('.ant-splitter');
    expect(splitter).toBeTruthy();
  });

  it('applies custom style', () => {
    const { container } = render(
      <Splitter
        {...makeProps({ style: { height: 400 } })}
      />,
    );
    const splitter = container.querySelector('.ant-splitter') as HTMLElement;
    expect(splitter.style.height).toBe('400px');
  });

  it('renders children inside the splitter', () => {
    const { container } = render(
      <Splitter {...makeProps()}>
        <div data-testid="child-a">Panel A</div>
        <div data-testid="child-b">Panel B</div>
      </Splitter>,
    );
    expect(container.querySelector('[data-testid="child-a"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="child-b"]')).toBeTruthy();
  });
});
