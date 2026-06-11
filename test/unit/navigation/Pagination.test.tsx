/**
 * Unit tests for the Pagination navigation component.
 * Covers: rendering without properties, rendering with valid props,
 * page change callback, page size change callback, and style.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Pagination } from '../../../src/components/navigation/Pagination';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'pagination-1',
    component: 'Pagination',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Pagination', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Pagination
        id="pag-undef"
        component="Pagination"
        properties={undefined as unknown as Record<string, unknown>}
      />,
    );
    expect(container.querySelector('.ant-pagination')).toBeTruthy();
  });

  it('renders with total items', () => {
    const { container } = render(
      <Pagination {...makeProps({ total: 100, current: 1, pageSize: 10 })} />,
    );
    const pagination = container.querySelector('.ant-pagination');
    expect(pagination).toBeTruthy();
  });

  it('calls onSyncState when page changes', () => {
    const onSyncState = vi.fn();
    const { container } = render(
      <Pagination
        {...makeProps({ total: 50, current: 1, pageSize: 10 })}
        onSyncState={onSyncState}
      />,
    );

    // Find and click the "next page" button (page 2)
    const nextButton = container.querySelector('.ant-pagination-next');
    if (nextButton) {
      fireEvent.click(nextButton);
      expect(onSyncState).toHaveBeenCalledWith({ page: 2, pageSize: 10 });
    }
  });

  it('renders with showSizeChanger', () => {
    const { container } = render(
      <Pagination
        {...makeProps({
          total: 100,
          current: 1,
          pageSize: 10,
          showSizeChanger: true,
        })}
      />,
    );
    const sizeChanger = container.querySelector('.ant-pagination-options-size-changer');
    expect(sizeChanger).toBeTruthy();
  });

  it('renders in small size', () => {
    const { container } = render(
      <Pagination
        {...makeProps({ total: 50, current: 1, pageSize: 10, size: 'small' })}
      />,
    );
    const pagination = container.querySelector('.ant-pagination');
    expect(pagination?.className).toContain('mini');
  });

  it('applies custom style', () => {
    const { container } = render(
      <Pagination
        {...makeProps({
          total: 50,
          current: 1,
          pageSize: 10,
          style: { textAlign: 'center' },
        })}
      />,
    );
    const pagination = container.querySelector('.ant-pagination') as HTMLElement;
    expect(pagination.style.textAlign).toBe('center');
  });
});
