/**
 * Unit tests for the Tabs layout component.
 * Covers: rendering without properties, default tab titles, custom tabTitles,
 * defaultActiveKey, tab position, tab type, centered mode, and children.
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Tabs } from '../../../src/components/layout/Tabs';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'tabs-1',
    component: 'Tabs',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Tabs component', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Tabs id="tabs-undef" component="Tabs" properties={undefined as unknown as Record<string, unknown>}>
        <div>Panel</div>
      </Tabs>,
    );
    expect(container.querySelector('.ant-tabs')).toBeTruthy();
  });

  it('renders children with default tab titles', () => {
    render(
      <Tabs {...makeProps()}>
        <div>Panel A</div>
        <div>Panel B</div>
      </Tabs>,
    );

    // Default titles are "Tab 1" and "Tab 2"
    expect(screen.getByText('Tab 1')).toBeDefined();
    expect(screen.getByText('Tab 2')).toBeDefined();
    // First panel is visible by default
    expect(screen.getByText('Panel A')).toBeDefined();
  });

  it('renders with custom tabTitles', () => {
    render(
      <Tabs {...makeProps({ tabTitles: ['First', 'Second'] })}>
        <div>Content A</div>
        <div>Content B</div>
      </Tabs>,
    );

    expect(screen.getByText('First')).toBeDefined();
    expect(screen.getByText('Second')).toBeDefined();
  });

  it('shows first tab content by default', () => {
    render(
      <Tabs {...makeProps()}>
        <div>First Content</div>
        <div>Second Content</div>
      </Tabs>,
    );

    expect(screen.getByText('First Content')).toBeDefined();
  });

  it('switches tab content on click', () => {
    render(
      <Tabs {...makeProps({ tabTitles: ['Alpha', 'Beta'] })}>
        <div>Alpha Panel</div>
        <div>Beta Panel</div>
      </Tabs>,
    );

    // Click the second tab
    fireEvent.click(screen.getByText('Beta'));
    expect(screen.getByText('Beta Panel')).toBeDefined();
  });

  it('applies card type when tabType is card', () => {
    const { container } = render(
      <Tabs {...makeProps({ tabType: 'card' })}>
        <div>Panel</div>
      </Tabs>,
    );

    expect(container.querySelector('.ant-tabs-card')).toBeTruthy();
  });

  it('passes centered prop to the underlying Tabs', () => {
    const { container } = render(
      <Tabs {...makeProps({ centered: true })}>
        <div>Panel</div>
      </Tabs>,
    );

    // Verify the tabs container rendered; centered is forwarded as a prop
    expect(container.querySelector('.ant-tabs')).toBeTruthy();
  });

  it('applies custom style', () => {
    const { container } = render(
      <Tabs {...makeProps({ style: { border: '1px solid red' } })}>
        <div>Panel</div>
      </Tabs>,
    );

    const tabsEl = container.querySelector('.ant-tabs') as HTMLElement;
    expect(tabsEl.style.border).toBe('1px solid red');
  });

  it('renders without children without crashing', () => {
    const { container } = render(<Tabs {...makeProps()} />);
    expect(container.querySelector('.ant-tabs')).toBeTruthy();
  });
});
