/**
 * Unit tests for the List layout component.
 * Covers: flexShrink:0 container wrapper, rendering children as list items,
 * prop forwarding, and edge cases.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { List } from '../../src/components/layout/List';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'list-1',
    type: 'List',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('List component', () => {
  it('renders a container div with flexShrink:0', () => {
    const { container } = render(
      <List {...makeProps()}>
        <div>Item 1</div>
      </List>,
    );

    const wrapperDiv = container.firstChild as HTMLElement;
    expect(wrapperDiv).toBeTruthy();
    expect(wrapperDiv.style.flexShrink).toBe('0');
  });

  it('renders children as list items', () => {
    render(
      <List {...makeProps()}>
        <div>Alpha</div>
        <div>Beta</div>
      </List>,
    );

    expect(screen.getByText('Alpha')).toBeTruthy();
    expect(screen.getByText('Beta')).toBeTruthy();
  });

  it('applies user style to the wrapper container', () => {
    const { container } = render(
      <List
        {...makeProps({
          style: { backgroundColor: 'red' },
        })}
      >
        <div>X</div>
      </List>,
    );

    const wrapperDiv = container.firstChild as HTMLElement;
    expect(wrapperDiv.style.backgroundColor).toBe('red');
    // flexShrink:0 should still be present alongside user styles
    expect(wrapperDiv.style.flexShrink).toBe('0');
  });

  it('renders header when provided', () => {
    render(
      <List
        {...makeProps({
          header: 'My List',
        })}
      >
        <div>Item</div>
      </List>,
    );

    expect(screen.getByText('My List')).toBeTruthy();
  });

  it('renders without children without crashing', () => {
    const { container } = render(<List {...makeProps()} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders footer when provided', () => {
    render(
      <List
        {...makeProps({
          footer: 'End of list',
        })}
      >
        <div>Item</div>
      </List>,
    );

    expect(screen.getByText('End of list')).toBeTruthy();
  });
});
