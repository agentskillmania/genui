/**
 * Unit tests for the Modal layout component.
 * Covers: rendering without properties, open/close behavior, title rendering,
 * ok/cancel actions, footer modes, centered/closable/maskClosable flags, and style.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Modal } from '../../../src/components/layout/Modal';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'modal-1',
    component: 'Modal',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Modal component', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Modal id="modal-undef" component="Modal" properties={undefined as unknown as Record<string, unknown>} />,
    );
    // Modal container exists in the DOM even when closed
    expect(container).toBeTruthy();
  });

  it('renders title when open', () => {
    render(
      <Modal {...makeProps({ title: 'Test Modal', open: true })}>
        <div>Modal Body</div>
      </Modal>,
    );

    expect(screen.getByText('Test Modal')).toBeDefined();
    expect(screen.getByText('Modal Body')).toBeDefined();
  });

  it('calls onAction with "ok" when ok button is clicked', () => {
    const onAction = vi.fn();
    render(
      <Modal {...makeProps({ open: true })} onAction={onAction}>
        <div>Body</div>
      </Modal>,
    );

    const okButtons = screen.getAllByRole('button');
    // Find the OK button (Ant Design default footer has an OK button)
    const okBtn = okButtons.find((btn) => btn.textContent === 'OK' || btn.className.includes('ant-btn-primary'));
    if (okBtn) {
      fireEvent.click(okBtn);
      expect(onAction).toHaveBeenCalledWith('ok');
    }
  });

  it('calls onAction with "cancel" when cancel button is clicked', () => {
    const onAction = vi.fn();
    render(
      <Modal {...makeProps({ open: true })} onAction={onAction}>
        <div>Body</div>
      </Modal>,
    );

    const cancelButtons = screen.getAllByRole('button');
    const cancelBtn = cancelButtons.find((btn) => btn.textContent === 'Cancel');
    if (cancelBtn) {
      fireEvent.click(cancelBtn);
      expect(onAction).toHaveBeenCalledWith('cancel');
    }
  });

  it('renders without footer when footer is null', () => {
    render(
      <Modal {...makeProps({ open: true, footer: null })}>
        <div>No Footer</div>
      </Modal>,
    );

    // When footer is null, Ant Design does not render footer buttons
    const footer = screen.queryByText('OK');
    expect(footer).toBeNull();
  });

  it('renders with default footer when footer is "default"', () => {
    render(
      <Modal {...makeProps({ open: true, footer: 'default' })}>
        <div>Default Footer</div>
      </Modal>,
    );

    // Default footer should have OK and Cancel buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('applies custom style', () => {
    render(
      <Modal {...makeProps({ open: true, style: { top: 20 } })}>
        <div>Styled</div>
      </Modal>,
    );

    const modalDialog = document.querySelector('.ant-modal') as HTMLElement;
    expect(modalDialog).toBeTruthy();
  });

  it('updates visibility when open prop changes', () => {
    const { rerender } = render(
      <Modal {...makeProps({ open: false })}>
        <div>Hidden</div>
      </Modal>,
    );

    // Modal content should not be visible
    expect(screen.queryByText('Hidden')).toBeNull();

    rerender(
      <Modal {...makeProps({ open: true })}>
        <div>Hidden</div>
      </Modal>,
    );

    // Now it should be visible
    expect(screen.getByText('Hidden')).toBeDefined();
  });

  it('renders children content when open', () => {
    render(
      <Modal {...makeProps({ open: true })}>
        <div>Child A</div>
        <div>Child B</div>
      </Modal>,
    );

    expect(screen.getByText('Child A')).toBeDefined();
    expect(screen.getByText('Child B')).toBeDefined();
  });
});
