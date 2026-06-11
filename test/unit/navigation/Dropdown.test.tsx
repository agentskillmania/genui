/**
 * Unit tests for the Dropdown navigation component.
 * Covers: rendering without properties, rendering with items, selection callback,
 * trigger modes, and style.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Dropdown } from '../../../src/components/navigation/Dropdown';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'dropdown-1',
    component: 'Dropdown',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Dropdown', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Dropdown
        id="dd-undef"
        component="Dropdown"
        properties={undefined as unknown as Record<string, unknown>}
      />,
    );
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('renders with default label "Menu" when no label provided', () => {
    render(<Dropdown {...makeProps()} />);
    expect(screen.getByText('Menu')).toBeTruthy();
  });

  it('renders with custom label', () => {
    render(<Dropdown {...makeProps({ label: 'Actions' })} />);
    expect(screen.getByText('Actions')).toBeTruthy();
  });

  it('renders dropdown button with items', () => {
    render(
      <Dropdown
        {...makeProps({
          label: 'Options',
          items: [
            { key: 'edit', label: 'Edit' },
            { key: 'delete', label: 'Delete' },
          ],
        })}
      />,
    );
    expect(screen.getByText('Options')).toBeTruthy();
  });

  it('calls onAction with "select" and key when menu item is clicked', () => {
    const onAction = vi.fn();
    render(
      <Dropdown
        {...makeProps({
          label: 'Actions',
          trigger: 'click',
          items: [
            { key: 'edit', label: 'Edit' },
            { key: 'delete', label: 'Delete' },
          ],
        })}
        onAction={onAction}
      />,
    );

    // Open the dropdown by clicking the button
    const button = screen.getByText('Actions');
    fireEvent.click(button);

    // Find the menu item and click it
    const editItem = screen.getByText('Edit');
    fireEvent.click(editItem);
    expect(onAction).toHaveBeenCalledWith('select', { key: 'edit' });
  });

  it('applies custom style to the trigger button', () => {
    const { container } = render(
      <Dropdown
        {...makeProps({
          label: 'Styled',
          style: { backgroundColor: 'blue' },
        })}
      />,
    );
    const button = container.querySelector('button') as HTMLElement;
    expect(button.style.backgroundColor).toBe('blue');
  });
});
