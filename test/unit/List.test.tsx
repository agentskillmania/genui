/**
 * Unit tests for the List layout component.
 * Covers: flexShrink:0 container wrapper, rendering children as list items,
 * prop forwarding, header/footer rendering, and edge cases.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { List } from '../../src/components/layout/List';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'list-1',
    component: 'List',
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

    expect(screen.getByText('Alpha')).toBeDefined();
    expect(screen.getByText('Beta')).toBeDefined();
  });

  it('applies user style alongside flexShrink:0', () => {
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

    expect(screen.getByText('My List')).toBeDefined();
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

    expect(screen.getByText('End of list')).toBeDefined();
  });

  // ---- Negative paths ----

  describe('negative paths', () => {
    it('renders without children without crashing', () => {
      const { container } = render(<List {...makeProps()} />);
      expect(container.firstChild).toBeTruthy();
      // Container exists even with no children
      const wrapperDiv = container.firstChild as HTMLElement;
      expect(wrapperDiv.style.flexShrink).toBe('0');
    });

    it('renders without properties without crashing', () => {
      // properties is required by type, but runtime defense (?? {}) handles undefined gracefully
      const { container } = render(<List id="empty" component="List" properties={{}} />);
      expect(container.firstChild).toBeTruthy();
    });

    it('renders empty string header without crashing', () => {
      // Empty header — component should render but not show a header section
      const { container } = render(
        <List {...makeProps({ header: '' })}>
          <div>Item</div>
        </List>,
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('renders empty string footer without crashing', () => {
      const { container } = render(
        <List {...makeProps({ footer: '' })}>
          <div>Item</div>
        </List>,
      );
      expect(container.firstChild).toBeTruthy();
    });
  });
});
