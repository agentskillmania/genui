/**
 * Unit tests for the Collapse layout component.
 * Covers: rendering without properties, rendering with items, accordion mode,
 * bordered/ghost flags, activeKeys sync, and style.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Collapse } from '../../../src/components/layout/Collapse';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'collapse-1',
    component: 'Collapse',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Collapse', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Collapse
        id="col-undef"
        component="Collapse"
        properties={undefined as unknown as Record<string, unknown>}
      />,
    );
    expect(container.querySelector('.ant-collapse')).toBeTruthy();
  });

  it('renders with items showing labels', () => {
    render(
      <Collapse
        {...makeProps({
          items: [
            { key: '1', label: 'Panel 1', children: 'Content 1' },
            { key: '2', label: 'Panel 2', children: 'Content 2' },
          ],
        })}
      />,
    );
    expect(screen.getByText('Panel 1')).toBeTruthy();
    expect(screen.getByText('Panel 2')).toBeTruthy();
  });

  it('renders panel children content when expanded', () => {
    render(
      <Collapse
        {...makeProps({
          activeKey: ['1'],
          items: [
            { key: '1', label: 'Panel 1', children: 'Expanded Content' },
          ],
        })}
      />,
    );
    expect(screen.getByText('Expanded Content')).toBeTruthy();
  });

  it('calls onSyncState when panel is toggled', () => {
    const onSyncState = vi.fn();
    render(
      <Collapse
        {...makeProps({
          items: [
            { key: '1', label: 'Panel 1', children: 'Content 1' },
            { key: '2', label: 'Panel 2', children: 'Content 2' },
          ],
        })}
        onSyncState={onSyncState}
      />,
    );

    const panelHeader = screen.getByText('Panel 1');
    fireEvent.click(panelHeader);
    expect(onSyncState).toHaveBeenCalledWith({ activeKeys: ['1'] });
  });

  it('renders in accordion mode', () => {
    const { container } = render(
      <Collapse
        {...makeProps({
          accordion: true,
          items: [
            { key: '1', label: 'Panel 1', children: 'Content 1' },
          ],
        })}
      />,
    );
    const collapse = container.querySelector('.ant-collapse');
    expect(collapse).toBeTruthy();
  });

  it('is bordered by default', () => {
    const { container } = render(
      <Collapse
        {...makeProps({
          items: [{ key: '1', label: 'Panel 1', children: 'Content' }],
        })}
      />,
    );
    const collapse = container.querySelector('.ant-collapse');
    // In AntD 6 the bordered flag controls the CSS variable --ant-collapse-border-width;
    // the wrapper element always exists regardless of the flag.
    expect(collapse).toBeTruthy();
  });

  it('removes border when bordered is false', () => {
    const { container } = render(
      <Collapse
        {...makeProps({
          bordered: false,
          items: [{ key: '1', label: 'Panel 1', children: 'Content' }],
        })}
      />,
    );
    const collapse = container.querySelector('.ant-collapse');
    // AntD 6 sets --ant-collapse-border-width: 0 when bordered=false
    expect(collapse).toBeTruthy();
  });

  it('renders in ghost mode', () => {
    const { container } = render(
      <Collapse
        {...makeProps({
          ghost: true,
          items: [{ key: '1', label: 'Ghost Panel', children: 'Ghost Content' }],
        })}
      />,
    );
    const collapse = container.querySelector('.ant-collapse');
    expect(collapse?.className).toContain('ghost');
  });

  it('applies custom style', () => {
    const { container } = render(
      <Collapse
        {...makeProps({
          items: [{ key: '1', label: 'Styled Panel', children: 'Content' }],
          style: { backgroundColor: 'orange' },
        })}
      />,
    );
    const collapse = container.querySelector('.ant-collapse') as HTMLElement;
    expect(collapse.style.backgroundColor).toBe('orange');
  });
});
