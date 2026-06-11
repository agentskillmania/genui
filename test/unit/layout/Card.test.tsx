/**
 * Unit tests for the Card layout component.
 * Covers: rendering without properties, title/extra rendering,
 * bordered/hoverable flags, style forwarding, and children.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Card } from '../../../src/components/layout/Card';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'card-1',
    component: 'Card',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Card component', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Card id="card-undef" component="Card" properties={undefined as unknown as Record<string, unknown>} />,
    );
    expect(container.querySelector('.ant-card')).toBeTruthy();
  });

  it('renders children inside the card body', () => {
    render(
      <Card {...makeProps()}>
        <div>Hello Card</div>
      </Card>,
    );

    expect(screen.getByText('Hello Card')).toBeDefined();
  });

  it('renders title when provided', () => {
    render(
      <Card {...makeProps({ title: 'My Title' })}>
        <div>Content</div>
      </Card>,
    );

    expect(screen.getByText('My Title')).toBeDefined();
  });

  it('renders extra content in the header', () => {
    render(
      <Card {...makeProps({ extra: 'Extra Info' })}>
        <div>Content</div>
      </Card>,
    );

    expect(screen.getByText('Extra Info')).toBeDefined();
  });

  it('is bordered by default', () => {
    const { container } = render(
      <Card {...makeProps()}>
        <div>Content</div>
      </Card>,
    );

    const cardEl = container.querySelector('.ant-card');
    expect(cardEl).toBeTruthy();
    expect(cardEl!.className).toContain('ant-card-bordered');
  });

  it('removes border when bordered is false', () => {
    const { container } = render(
      <Card {...makeProps({ bordered: false })}>
        <div>Content</div>
      </Card>,
    );

    const cardEl = container.querySelector('.ant-card');
    expect(cardEl).toBeTruthy();
    expect(cardEl!.className).not.toContain('ant-card-bordered');
  });

  it('applies custom style', () => {
    const { container } = render(
      <Card {...makeProps({ style: { backgroundColor: 'blue' } })}>
        <div>Content</div>
      </Card>,
    );

    const cardEl = container.querySelector('.ant-card') as HTMLElement;
    expect(cardEl.style.backgroundColor).toBe('blue');
  });

  it('renders multiple children', () => {
    render(
      <Card {...makeProps()}>
        <div>Child A</div>
        <div>Child B</div>
      </Card>,
    );

    expect(screen.getByText('Child A')).toBeDefined();
    expect(screen.getByText('Child B')).toBeDefined();
  });
});
