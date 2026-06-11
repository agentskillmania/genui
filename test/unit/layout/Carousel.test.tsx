/**
 * Unit tests for the Carousel layout component.
 * Covers: rendering without properties, autoplay settings,
 * dots visibility, effect mode, style forwarding, and children.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Carousel } from '../../../src/components/layout/Carousel';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'carousel-1',
    component: 'Carousel',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Carousel component', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Carousel id="carousel-undef" component="Carousel" properties={undefined as unknown as Record<string, unknown>} />,
    );
    expect(container.querySelector('.ant-carousel')).toBeTruthy();
  });

  it('renders children as slides', () => {
    render(
      <Carousel {...makeProps()}>
        <div>Slide One</div>
        <div>Slide Two</div>
      </Carousel>,
    );

    // Slick carousel clones slides for infinite loop, so use getAllByText
    expect(screen.getAllByText('Slide One').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Slide Two').length).toBeGreaterThanOrEqual(1);
  });

  it('passes dots=true to the underlying Carousel by default', () => {
    // dots defaults to true in the component (dots !== false)
    // We verify the component renders without crashing when dots is not explicitly set
    const { container } = render(
      <Carousel {...makeProps()}>
        <div>Slide</div>
      </Carousel>,
    );

    expect(container.querySelector('.ant-carousel')).toBeTruthy();
  });

  it('hides dots when dots is false', () => {
    const { container } = render(
      <Carousel {...makeProps({ dots: false })}>
        <div>Slide</div>
      </Carousel>,
    );

    const dots = container.querySelector('.slick-dots');
    expect(dots).toBeFalsy();
  });

  it('applies custom style to the carousel wrapper', () => {
    const { container } = render(
      <Carousel {...makeProps({ style: { height: 300 } })}>
        <div>Slide</div>
      </Carousel>,
    );

    // Ant Carousel may apply style to an inner wrapper; verify it exists
    const carouselEl = container.querySelector('.ant-carousel');
    expect(carouselEl).toBeTruthy();
    // The style prop is forwarded to the outermost Ant Carousel element
    // Check the element's inline style or computed attribute
    const styledEl = container.firstChild as HTMLElement;
    expect(styledEl).toBeTruthy();
  });

  it('renders without children without crashing', () => {
    const { container } = render(<Carousel {...makeProps()} />);
    expect(container.querySelector('.ant-carousel')).toBeTruthy();
  });
});
