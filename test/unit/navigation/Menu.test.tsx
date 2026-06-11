/**
 * Unit tests for the Menu navigation component.
 * Covers: rendering without properties, rendering with items, selection callback,
 * mode, theme, selectedKeys, and style.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Menu } from '../../../src/components/navigation/Menu';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'menu-1',
    component: 'Menu',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Menu', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Menu
        id="menu-undef"
        component="Menu"
        properties={undefined as unknown as Record<string, unknown>}
      />,
    );
    expect(container.querySelector('.ant-menu')).toBeTruthy();
  });

  it('renders menu items with labels', () => {
    render(
      <Menu
        {...makeProps({
          items: [
            { key: 'home', label: 'Home' },
            { key: 'about', label: 'About' },
            { key: 'contact', label: 'Contact' },
          ],
        })}
      />,
    );
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('About')).toBeTruthy();
    expect(screen.getByText('Contact')).toBeTruthy();
  });

  it('calls onAction with "select" and key when menu item is selected', () => {
    const onAction = vi.fn();
    render(
      <Menu
        {...makeProps({
          items: [
            { key: 'home', label: 'Home' },
            { key: 'settings', label: 'Settings' },
          ],
        })}
        onAction={onAction}
      />,
    );

    const settingsItem = screen.getByText('Settings');
    fireEvent.click(settingsItem);
    expect(onAction).toHaveBeenCalledWith('select', { key: 'settings' });
  });

  it('renders in horizontal mode', () => {
    const { container } = render(
      <Menu
        {...makeProps({
          mode: 'horizontal',
          items: [{ key: 'a', label: 'Item A' }],
        })}
      />,
    );
    const menu = container.querySelector('.ant-menu');
    expect(menu?.className).toContain('horizontal');
  });

  it('renders in dark theme', () => {
    const { container } = render(
      <Menu
        {...makeProps({
          theme: 'dark',
          items: [{ key: 'a', label: 'Item A' }],
        })}
      />,
    );
    const menu = container.querySelector('.ant-menu');
    expect(menu?.className).toContain('dark');
  });

  it('renders with selectedKeys highlighted', () => {
    const { container } = render(
      <Menu
        {...makeProps({
          selectedKeys: ['home'],
          items: [
            { key: 'home', label: 'Home' },
            { key: 'about', label: 'About' },
          ],
        })}
      />,
    );
    const homeItem = screen.getByText('Home').closest('.ant-menu-item');
    expect(homeItem?.className).toContain('selected');
  });

  it('renders items with nested children (submenus)', () => {
    render(
      <Menu
        {...makeProps({
          items: [
            {
              key: 'products',
              label: 'Products',
              children: [
                { key: 'electronics', label: 'Electronics' },
                { key: 'clothing', label: 'Clothing' },
              ],
            },
          ],
        })}
      />,
    );
    expect(screen.getByText('Products')).toBeTruthy();
  });

  it('applies custom style', () => {
    const { container } = render(
      <Menu
        {...makeProps({
          items: [{ key: 'a', label: 'A' }],
          style: { backgroundColor: 'gray' },
        })}
      />,
    );
    const menu = container.querySelector('.ant-menu') as HTMLElement;
    expect(menu.style.backgroundColor).toBe('gray');
  });
});
