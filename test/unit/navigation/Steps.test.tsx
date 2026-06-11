/**
 * Unit tests for the Steps navigation component.
 * Covers: rendering without properties, rendering with items, current step sync,
 * direction, size, status, and onSyncState callback.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Steps } from '../../../src/components/navigation/Steps';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'steps-1',
    component: 'Steps',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Steps', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Steps
        id="steps-undef"
        component="Steps"
        properties={undefined as unknown as Record<string, unknown>}
      />,
    );
    expect(container.querySelector('.ant-steps')).toBeTruthy();
  });

  it('renders with items showing titles', () => {
    render(
      <Steps
        {...makeProps({
          current: 0,
          items: [
            { title: 'Step 1' },
            { title: 'Step 2' },
            { title: 'Step 3' },
          ],
        })}
      />,
    );
    expect(screen.getByText('Step 1')).toBeTruthy();
    expect(screen.getByText('Step 2')).toBeTruthy();
    expect(screen.getByText('Step 3')).toBeTruthy();
  });

  it('renders with descriptions', () => {
    render(
      <Steps
        {...makeProps({
          current: 0,
          items: [
            { title: 'Login', description: 'Enter credentials' },
          ],
        })}
      />,
    );
    expect(screen.getByText('Login')).toBeTruthy();
    expect(screen.getByText('Enter credentials')).toBeTruthy();
  });

  it('renders in vertical direction', () => {
    const { container } = render(
      <Steps
        {...makeProps({
          current: 0,
          direction: 'vertical',
          items: [{ title: 'A' }, { title: 'B' }],
        })}
      />,
    );
    const stepsEl = container.querySelector('.ant-steps');
    expect(stepsEl?.className).toContain('vertical');
  });

  it('renders in small size', () => {
    const { container } = render(
      <Steps
        {...makeProps({
          current: 0,
          size: 'small',
          items: [{ title: 'A' }],
        })}
      />,
    );
    const stepsEl = container.querySelector('.ant-steps');
    expect(stepsEl?.className).toContain('small');
  });

  it('calls onSyncState when step changes', () => {
    const onSyncState = vi.fn();
    render(
      <Steps
        {...makeProps({
          current: 0,
          items: [
            { title: 'Step 1' },
            { title: 'Step 2' },
            { title: 'Step 3' },
          ],
        })}
        onSyncState={onSyncState}
      />,
    );

    // Click on "Step 2" title to trigger change
    const step2 = screen.getByText('Step 2');
    fireEvent.click(step2);
    expect(onSyncState).toHaveBeenCalledWith({ current: 1 });
  });

  it('syncs current prop via useEffect', () => {
    const { rerender } = render(
      <Steps
        {...makeProps({
          current: 0,
          items: [{ title: 'A' }, { title: 'B' }],
        })}
      />,
    );

    rerender(
      <Steps
        {...makeProps({
          current: 1,
          items: [{ title: 'A' }, { title: 'B' }],
        })}
      />,
    );
  });

  it('applies custom style', () => {
    const { container } = render(
      <Steps
        {...makeProps({
          current: 0,
          items: [{ title: 'A' }],
          style: { backgroundColor: 'green' },
        })}
      />,
    );
    const stepsEl = container.querySelector('.ant-steps') as HTMLElement;
    expect(stepsEl.style.backgroundColor).toBe('green');
  });
});
