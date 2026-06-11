/**
 * Unit tests for the Breadcrumb navigation component.
 * Covers: rendering without properties, rendering with items, separator, and style.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Breadcrumb } from '../../../src/components/navigation/Breadcrumb';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'breadcrumb-1',
    component: 'Breadcrumb',
    properties: { ...overrides },
  };
}

// ---------- tests ----------

describe('Breadcrumb', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Breadcrumb
        id="bc-undef"
        component="Breadcrumb"
        properties={undefined as unknown as Record<string, unknown>}
      />,
    );
    expect(container.querySelector('.ant-breadcrumb')).toBeTruthy();
  });

  it('renders with empty items', () => {
    const { container } = render(
      <Breadcrumb {...makeProps({ items: [] })} />,
    );
    expect(container.querySelector('.ant-breadcrumb')).toBeTruthy();
  });

  it('renders items with titles', () => {
    render(
      <Breadcrumb
        {...makeProps({
          items: [
            { title: 'Home' },
            { title: 'Products' },
            { title: 'Details' },
          ],
        })}
      />,
    );
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Products')).toBeTruthy();
    expect(screen.getByText('Details')).toBeTruthy();
  });

  it('renders with custom separator', () => {
    const { container } = render(
      <Breadcrumb
        {...makeProps({
          items: [{ title: 'A' }, { title: 'B' }],
          separator: '/',
        })}
      />,
    );
    const breadcrumb = container.querySelector('.ant-breadcrumb');
    expect(breadcrumb).toBeTruthy();
  });

  it('applies custom style', () => {
    const { container } = render(
      <Breadcrumb
        {...makeProps({
          items: [{ title: 'Test' }],
          style: { backgroundColor: 'red' },
        })}
      />,
    );
    const el = container.querySelector('.ant-breadcrumb') as HTMLElement;
    expect(el.style.backgroundColor).toBe('red');
  });
});
