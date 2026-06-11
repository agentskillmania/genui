import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Tag } from '../../../src/components/feedback/Tag';

describe('Tag', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Tag id="t1" component="Tag" />);
    expect(container.querySelector('.ant-tag')).toBeTruthy();
  });

  it('renders tag text', () => {
    render(<Tag id="t1" component="Tag" properties={{ text: 'Label' }} />);
    expect(screen.getByText('Label')).toBeTruthy();
  });

  it('renders colored tag', () => {
    const { container } = render(
      <Tag id="t1" component="Tag" properties={{ text: 'Blue', color: 'blue' }} />,
    );
    expect(container.querySelector('.ant-tag-blue')).toBeTruthy();
  });
});
