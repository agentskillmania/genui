import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Timeline } from '../../../src/components/data/Timeline';

describe('Timeline', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Timeline id="t1" component="Timeline" />);
    expect(container.querySelector('.ant-timeline')).toBeTruthy();
  });

  it('renders timeline with items', () => {
    render(
      <Timeline
        id="t1"
        component="Timeline"
        properties={{ items: [{ children: 'Step 1' }, { children: 'Step 2' }] }}
      />,
    );
    expect(screen.getByText('Step 1')).toBeTruthy();
    expect(screen.getByText('Step 2')).toBeTruthy();
  });
});
