/**
 * Unit tests for the Tooltip layout component.
 * Covers: rendering without properties, rendering with title, placement, and children.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Tooltip } from '../../../src/components/layout/Tooltip';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'tooltip-1',
    component: 'Tooltip',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Tooltip', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Tooltip
        id="tip-undef"
        component="Tooltip"
        properties={undefined as unknown as Record<string, unknown>}
      />,
    );
    // Renders fallback span when no children
    expect(screen.getByText('Hover me')).toBeTruthy();
  });

  it('renders children content', () => {
    render(
      <Tooltip {...makeProps({ title: 'Tooltip text' })}>
        <span data-testid="target">Hover target</span>
      </Tooltip>,
    );
    expect(screen.getByTestId('target')).toBeTruthy();
  });

  it('renders with title property', () => {
    render(
      <Tooltip {...makeProps({ title: 'Helpful info' })}>
        <span>Target</span>
      </Tooltip>,
    );
    expect(screen.getByText('Target')).toBeTruthy();
  });

  it('renders with placement property', () => {
    const { container } = render(
      <Tooltip
        {...makeProps({
          title: 'Top tooltip',
          placement: 'top',
        })}
      >
        <span>Target</span>
      </Tooltip>,
    );
    // Tooltip wrapper exists
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with color property', () => {
    const { container } = render(
      <Tooltip
        {...makeProps({
          title: 'Colored',
          color: 'blue',
        })}
      >
        <span>Target</span>
      </Tooltip>,
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with trigger property', () => {
    const { container } = render(
      <Tooltip
        {...makeProps({
          title: 'Click tooltip',
          trigger: 'click',
        })}
      >
        <span>Target</span>
      </Tooltip>,
    );
    expect(container.firstChild).toBeTruthy();
  });
});
