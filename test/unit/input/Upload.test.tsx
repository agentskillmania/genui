import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Upload } from '../../../src/components/input/Upload';

describe('Upload', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Upload id="u1" component="Upload" />);
    expect(container.querySelector('.ant-upload')).toBeTruthy();
  });

  it('renders upload button with custom text', () => {
    render(<Upload id="u1" component="Upload" properties={{ buttonText: 'Attach File' }} />);
    expect(screen.getByText('Attach File')).toBeTruthy();
  });

  it('renders default button text', () => {
    render(<Upload id="u1" component="Upload" />);
    expect(screen.getByText('Upload')).toBeTruthy();
  });

  it('renders with accept and maxCount', () => {
    const { container } = render(
      <Upload id="u1" component="Upload" properties={{ accept: '.png,.jpg', maxCount: 3 }} />,
    );
    expect(container.querySelector('.ant-upload')).toBeTruthy();
  });
});
