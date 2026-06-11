import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Result } from '../../../src/components/feedback/Result';

describe('Result', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Result id="r1" component="Result" />);
    expect(container.querySelector('.ant-result')).toBeTruthy();
  });

  it('renders result with title and status', () => {
    render(<Result id="r1" component="Result" properties={{ title: 'Success', status: 'success' }} />);
    expect(screen.getByText('Success')).toBeTruthy();
  });
});
