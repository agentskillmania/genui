import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { QRCode } from '../../../src/components/utility/QRCode';

describe('QRCode', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<QRCode id="q1" component="QRCode" />);
    expect(container).toBeTruthy();
  });

  it('renders with value and size', () => {
    const { container } = render(<QRCode id="q1" component="QRCode" properties={{ value: 'https://example.com', size: 128 }} />);
    expect(container).toBeTruthy();
  });

  it('renders with color options', () => {
    const { container } = render(
      <QRCode id="q1" component="QRCode" properties={{ value: 'test', color: '#000000', bgColor: '#ffffff' }} />,
    );
    expect(container).toBeTruthy();
  });
});
