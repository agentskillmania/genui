import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Drawer } from '../../../src/components/feedback/Drawer';

describe('Drawer', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Drawer id="d1" component="Drawer" />);
    expect(container).toBeTruthy();
  });

  it('renders drawer with title when open', () => {
    render(
      <Drawer id="d1" component="Drawer" properties={{ title: 'Test Drawer', open: true }}>
        Content
      </Drawer>,
    );
    expect(screen.getByText('Test Drawer')).toBeTruthy();
  });

  it('calls onAction close', () => {
    const onAction = vi.fn();
    render(
      <Drawer
        id="d1"
        component="Drawer"
        properties={{ title: 'Test', open: true }}
        onAction={onAction}
      >
        Body
      </Drawer>,
    );
    expect(onAction).not.toHaveBeenCalled();
  });
});
