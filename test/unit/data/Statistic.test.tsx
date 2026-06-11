import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Statistic } from '../../../src/components/data/Statistic';

describe('Statistic', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Statistic id="s1" component="Statistic" />);
    expect(container.querySelector('.ant-statistic')).toBeTruthy();
  });

  it('renders statistic with title and value', () => {
    render(
      <Statistic id="s1" component="Statistic" properties={{ title: 'Revenue', value: 12345 }} />,
    );
    expect(screen.getByText('Revenue')).toBeTruthy();
  });
});
