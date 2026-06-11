/**
 * Unit tests for the Button component.
 * Covers: defensive rendering without properties, rendering with valid props,
 * variant mapping, danger state, disabled state, loading state, and click handling.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Button } from '../../../src/components/basic/Button';

describe('Button', () => {
  // ---- Defensive rendering ----

  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Button id="btn-1" component="Button" />);
    expect(container.querySelector('button')).toBeTruthy();
  });

  // ---- Normal rendering ----

  it('renders button text from properties.text', () => {
    render(
      <Button
        id="btn-1"
        component="Button"
        properties={{ text: 'Click Me' }}
      />,
    );
    expect(screen.getByText('Click Me')).toBeTruthy();
  });

  it('renders children alongside text', () => {
    render(
      <Button id="btn-1" component="Button" properties={{ text: 'Btn' }}>
        <span data-testid="child">extra</span>
      </Button>,
    );
    expect(screen.getByText('Btn')).toBeTruthy();
    expect(screen.getByTestId('child')).toBeTruthy();
  });

  // ---- Variant ----

  it('applies primary variant', () => {
    render(
      <Button
        id="btn-1"
        component="Button"
        properties={{ text: 'Primary', variant: 'primary' }}
      />,
    );
    const btn = screen.getByText('Primary').closest('button')!;
    expect(btn.className).toContain('ant-btn-primary');
  });

  it('applies dashed variant', () => {
    render(
      <Button
        id="btn-1"
        component="Button"
        properties={{ text: 'Dashed', variant: 'dashed' }}
      />,
    );
    const btn = screen.getByText('Dashed').closest('button')!;
    expect(btn.className).toContain('ant-btn-dashed');
  });

  // ---- Danger ----

  it('applies danger style when danger is true', () => {
    render(
      <Button
        id="btn-1"
        component="Button"
        properties={{ text: 'Delete', variant: 'primary', danger: true }}
      />,
    );
    const btn = screen.getByText('Delete').closest('button')!;
    expect(btn.className).toContain('ant-btn-dangerous');
  });

  // ---- Disabled ----

  it('disables the button when disabled is true', () => {
    render(
      <Button
        id="btn-1"
        component="Button"
        properties={{ text: 'Disabled', disabled: true }}
      />,
    );
    const btn = screen.getByText('Disabled').closest('button')!;
    expect(btn.disabled).toBe(true);
  });

  // ---- Click handling ----

  it('calls onAction with "click" when clicked', () => {
    const onAction = vi.fn();
    render(
      <Button
        id="btn-1"
        component="Button"
        properties={{ text: 'Click' }}
        onAction={onAction}
      />,
    );
    fireEvent.click(screen.getByText('Click'));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith('click');
  });

  it('does not call onAction when disabled', () => {
    const onAction = vi.fn();
    render(
      <Button
        id="btn-1"
        component="Button"
        properties={{ text: 'Nope', disabled: true }}
        onAction={onAction}
      />,
    );
    fireEvent.click(screen.getByText('Nope'));
    expect(onAction).not.toHaveBeenCalled();
  });
});
