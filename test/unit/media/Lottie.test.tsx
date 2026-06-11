/**
 * Unit tests for the Lottie media component.
 * Covers: rendering with undefined properties, loading state, animation data rendering,
 * URL fetching behavior, and dimension props.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Lottie } from '../../../src/components/media/Lottie';

// Mock lottie-react to avoid needing real animation data
vi.mock('lottie-react', () => ({
  default: ({ animationData }: { animationData: unknown }) =>
    React.createElement('div', { 'data-testid': 'lottie', 'data-has-data': !!animationData }),
}));

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'lottie-1',
    component: 'Lottie',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Lottie component', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Lottie id="lottie-0" component="Lottie" properties={undefined as unknown as Record<string, unknown>} />,
    );
    expect(container.innerHTML).not.toBe('');
  });

  it('shows loading state when no animation data or url provided', () => {
    render(<Lottie {...makeProps()} />);
    expect(screen.getByText('Loading animation...')).toBeTruthy();
  });

  it('renders lottie player when animationData is provided', () => {
    const sampleData = { v: '5.0.0', fr: 30, ip: 0, op: 60, layers: [] };
    render(<Lottie {...makeProps({ animationData: sampleData })} />);
    const lottieEl = screen.getByTestId('lottie');
    expect(lottieEl).toBeTruthy();
    expect(lottieEl.getAttribute('data-has-data')).toBe('true');
  });

  it('renders with default dimensions (200x200) when width/height not specified', () => {
    const { container } = render(<Lottie {...makeProps()} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe('200px');
    expect(wrapper.style.height).toBe('200px');
  });

  it('renders with custom width and height', () => {
    const { container } = render(<Lottie {...makeProps({ width: 300, height: 400 })} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe('300px');
    expect(wrapper.style.height).toBe('400px');
  });

  it('fetches animation data from url', async () => {
    const mockData = { v: '5.0.0', fr: 30, ip: 0, op: 60, layers: [] };
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve(mockData),
    } as Response);

    render(<Lottie {...makeProps({ url: 'https://example.com/anim.json' })} />);

    // Initially shows loading
    expect(screen.getByText('Loading animation...')).toBeTruthy();

    // After fetch resolves, the lottie component should render
    await waitFor(() => {
      expect(screen.getByTestId('lottie')).toBeTruthy();
    });

    fetchSpy.mockRestore();
  });

  it('handles fetch failure gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

    const { container } = render(<Lottie {...makeProps({ url: 'https://example.com/bad.json' })} />);

    // Should remain in loading state after fetch failure
    await waitFor(() => {
      expect(screen.getByText('Loading animation...')).toBeTruthy();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    fetchSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});
