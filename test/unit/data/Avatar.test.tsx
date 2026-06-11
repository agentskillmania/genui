import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Avatar } from '../../../src/components/data/Avatar';

describe('Avatar', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Avatar id="a1" component="Avatar" />);
    expect(container.querySelector('.ant-avatar')).toBeTruthy();
  });

  it('renders with image source', () => {
    const { container } = render(
      <Avatar id="a1" component="Avatar" properties={{ src: 'https://example.com/img.png' }} />,
    );
    expect(container.querySelector('.ant-avatar')).toBeTruthy();
  });

  it('renders with shape and size', () => {
    const { container } = render(
      <Avatar id="a1" component="Avatar" properties={{ size: 64, shape: 'square' }} />,
    );
    expect(container.querySelector('.ant-avatar-square')).toBeTruthy();
  });
});
