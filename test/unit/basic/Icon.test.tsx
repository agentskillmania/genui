/**
 * Unit tests for the Icon component.
 * Covers: defensive rendering without properties, default icon fallback,
 * named icon rendering, size and color styles, and unknown icon handling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Icon } from '../../../src/components/basic/Icon';

describe('Icon', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  // ---- Defensive rendering ----

  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Icon id="icon-1" component="Icon" />);
    // Default icon is QuestionCircleOutlined, should render an SVG
    expect(container.querySelector('svg')).toBeTruthy();
  });

  // ---- Default fallback ----

  it('renders QuestionCircleOutlined when name is not provided', () => {
    const { container } = render(
      <Icon id="icon-1" component="Icon" properties={{}} />,
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  // ---- Named icon rendering ----

  it('renders a known icon by name', () => {
    const { container } = render(
      <Icon
        id="icon-1"
        component="Icon"
        properties={{ name: 'HomeOutlined' }}
      />,
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders SearchOutlined icon', () => {
    const { container } = render(
      <Icon
        id="icon-1"
        component="Icon"
        properties={{ name: 'SearchOutlined' }}
      />,
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  // ---- Unknown icon ----

  it('returns null and warns for an unknown icon name', () => {
    const { container } = render(
      <Icon
        id="icon-1"
        component="Icon"
        properties={{ name: 'NonExistentIcon' }}
      />,
    );
    expect(container.innerHTML).toBe('');
    expect(console.warn).toHaveBeenCalledWith(
      '[GenUI] Unknown icon: NonExistentIcon',
    );
  });

  // ---- Style application ----

  it('applies fontSize from size property', () => {
    const { container } = render(
      <Icon
        id="icon-1"
        component="Icon"
        properties={{ name: 'HomeOutlined', size: 24 }}
      />,
    );
    // Ant Design icons may wrap SVG in a span; style lands on the wrapper
    const wrapper = container.querySelector('span') || container.querySelector('svg')!;
    expect(wrapper.style.fontSize).toBe('24px');
  });

  it('applies color from color property', () => {
    const { container } = render(
      <Icon
        id="icon-1"
        component="Icon"
        properties={{ name: 'HomeOutlined', color: 'blue' }}
      />,
    );
    const wrapper = container.querySelector('span') || container.querySelector('svg')!;
    expect(wrapper.style.color).toBe('blue');
  });

  it('applies custom style object', () => {
    const { container } = render(
      <Icon
        id="icon-1"
        component="Icon"
        properties={{
          name: 'HomeOutlined',
          style: { marginTop: 8 },
        }}
      />,
    );
    const wrapper = container.querySelector('span') || container.querySelector('svg')!;
    expect(wrapper.style.marginTop).toBe('8px');
  });
});
