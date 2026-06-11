import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Alert } from '../../../src/components/feedback/Alert';

describe('Alert', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Alert id="a1" component="Alert" />);
    expect(container.querySelector('.ant-alert')).toBeTruthy();
  });

  it('renders alert message', () => {
    render(<Alert id="a1" component="Alert" properties={{ message: 'Test Alert' }} />);
    expect(screen.getByText('Test Alert')).toBeTruthy();
  });

  it('renders different types', () => {
    const { container } = render(
      <Alert id="a1" component="Alert" properties={{ message: 'Test', type: 'error' }} />,
    );
    expect(container.querySelector('.ant-alert-error')).toBeTruthy();
  });
});
