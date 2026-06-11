/**
 * Unit tests for the Popover layout component.
 * Covers: rendering without properties, rendering with title/content, placement,
 * trigger, and children.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Popover } from '../../../src/components/layout/Popover';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'popover-1',
    component: 'Popover',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Popover', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Popover
        id="pop-undef"
        component="Popover"
        properties={undefined as unknown as Record<string, unknown>}
      />,
    );
    // Renders fallback span when no children
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  it('renders children content', () => {
    render(
      <Popover {...makeProps({ title: 'Info', content: 'Details' })}>
        <span data-testid="target">Click target</span>
      </Popover>,
    );
    expect(screen.getByTestId('target')).toBeTruthy();
  });

  it('renders with title and content properties', () => {
    const { container } = render(
      <Popover
        {...makeProps({
          title: 'Popover Title',
          content: 'Popover Content',
        })}
      >
        <span>Trigger</span>
      </Popover>,
    );
    expect(screen.getByText('Trigger')).toBeTruthy();
  });

  it('renders with placement property', () => {
    const { container } = render(
      <Popover
        {...makeProps({
          title: 'Right popover',
          placement: 'right',
        })}
      >
        <span>Target</span>
      </Popover>,
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with trigger property', () => {
    const { container } = render(
      <Popover
        {...makeProps({
          title: 'Hover popover',
          trigger: 'hover',
        })}
      >
        <span>Target</span>
      </Popover>,
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('applies custom style', () => {
    const { container } = render(
      <Popover
        {...makeProps({
          title: 'Styled',
          style: { width: 200 },
        })}
      >
        <span>Target</span>
      </Popover>,
    );
    expect(container.firstChild).toBeTruthy();
  });
});
