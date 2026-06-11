/**
 * Unit tests for the Divider component.
 * Covers: defensive rendering without properties, default divider,
 * orientation, dashed style, plain text, and children rendering.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Divider } from '../../../src/components/basic/Divider';

describe('Divider', () => {
  // ---- Defensive rendering ----

  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Divider id="div-1" component="Divider" />);
    expect(container.querySelector('.ant-divider')).toBeTruthy();
  });

  // ---- Normal rendering ----

  it('renders a horizontal divider by default', () => {
    const { container } = render(
      <Divider id="div-1" component="Divider" properties={{}} />,
    );
    const divider = container.querySelector('.ant-divider');
    expect(divider).toBeTruthy();
    expect(divider!.className).toContain('ant-divider-horizontal');
  });

  it('renders a vertical divider when orientation is vertical', () => {
    const { container } = render(
      <Divider
        id="div-1"
        component="Divider"
        properties={{ orientation: 'vertical' }}
      />,
    );
    const divider = container.querySelector('.ant-divider');
    expect(divider).toBeTruthy();
    expect(divider!.className).toContain('ant-divider-vertical');
  });

  // ---- Dashed ----

  it('renders dashed style when dashed is true', () => {
    const { container } = render(
      <Divider
        id="div-1"
        component="Divider"
        properties={{ dashed: true }}
      />,
    );
    const divider = container.querySelector('.ant-divider');
    expect(divider).toBeTruthy();
    expect(divider!.className).toContain('ant-divider-dashed');
  });

  // ---- Plain ----

  it('renders plain style when plain is true', () => {
    const { container } = render(
      <Divider
        id="div-1"
        component="Divider"
        properties={{ plain: true }}
      />,
    );
    const divider = container.querySelector('.ant-divider');
    expect(divider).toBeTruthy();
    expect(divider!.className).toContain('ant-divider-plain');
  });

  // ---- Title placement ----

  it('renders with titlePlacement left when children are present', () => {
    const { container } = render(
      <Divider id="div-1" component="Divider" properties={{ type: 'left' }}>
        <span>Section</span>
      </Divider>,
    );
    const divider = container.querySelector('.ant-divider');
    expect(divider).toBeTruthy();
    // Ant Design 6 maps "left" to RTL-aware "start" class
    expect(divider!.className).toMatch(/ant-divider-with-text-(left|start)/);
  });

  it('renders with titlePlacement right when children are present', () => {
    const { container } = render(
      <Divider id="div-1" component="Divider" properties={{ type: 'right' }}>
        <span>Section</span>
      </Divider>,
    );
    const divider = container.querySelector('.ant-divider');
    expect(divider).toBeTruthy();
    // Ant Design 6 maps "right" to RTL-aware "end" class
    expect(divider!.className).toMatch(/ant-divider-with-text-(right|end)/);
  });

  it('renders with titlePlacement center when children are present', () => {
    const { container } = render(
      <Divider id="div-1" component="Divider" properties={{ type: 'center' }}>
        <span>Section</span>
      </Divider>,
    );
    const divider = container.querySelector('.ant-divider');
    expect(divider).toBeTruthy();
    expect(divider!.className).toContain('ant-divider-with-text');
  });

  // ---- Children ----

  it('renders children inside the divider', () => {
    const { container } = render(
      <Divider id="div-1" component="Divider" properties={{}}>
        <span data-testid="child">Section</span>
      </Divider>,
    );
    expect(screen.getByTestId('child')).toBeTruthy();
    expect(screen.getByText('Section')).toBeTruthy();
    expect(container.querySelector('.ant-divider-with-text')).toBeTruthy();
  });

  // ---- Custom style ----

  it('applies custom style', () => {
    const { container } = render(
      <Divider
        id="div-1"
        component="Divider"
        properties={{ style: { margin: '16px 0' } }}
      />,
    );
    const divider = container.querySelector('.ant-divider') as HTMLElement;
    // Browser normalizes shorthand margin values (e.g., "16px 0" becomes "16px 0px")
    expect(divider.style.margin).toContain('16px');
  });
});
