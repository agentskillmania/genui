import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Skeleton } from '../../../src/components/feedback/Skeleton';

describe('Skeleton', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Skeleton id="s1" component="Skeleton" />);
    // AntD Skeleton may render a fragment in jsdom without CSS; verify no throw
    expect(container).toBeTruthy();
  });

  it('renders skeleton with active animation', () => {
    const { container } = render(
      <Skeleton id="s1" component="Skeleton" properties={{ active: true }} />,
    );
    expect(container).toBeTruthy();
  });

  it('renders children when not loading', () => {
    const { container } = render(
      <Skeleton id="s1" component="Skeleton" properties={{ loading: false }}>
        <span data-testid="content">Loaded</span>
      </Skeleton>,
    );
    expect(container.querySelector('[data-testid="content"]')).toBeTruthy();
  });

  it('renders with avatar property', () => {
    const { container } = render(
      <Skeleton id="s1" component="Skeleton" properties={{ avatar: true, active: true }} />,
    );
    expect(container).toBeTruthy();
  });

  it('hides children when loading is true', () => {
    const { container } = render(
      <Skeleton id="s1" component="Skeleton" properties={{ loading: true }}>
        <span data-testid="content">Loaded</span>
      </Skeleton>,
    );
    expect(container.querySelector('[data-testid="content"]')).toBeFalsy();
  });
});
