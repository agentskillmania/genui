/**
 * Unit tests for the Markdown data component.
 * Covers: rendering with undefined properties, markdown content rendering,
 * and empty text handling.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Markdown } from '../../../src/components/data/Markdown';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'md-1',
    component: 'Markdown',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Markdown component', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Markdown id="md-0" component="Markdown" properties={undefined as unknown as Record<string, unknown>} />,
    );
    expect(container.innerHTML).not.toBe('');
  });

  it('renders plain text content', () => {
    render(<Markdown {...makeProps({ text: 'Hello World' })} />);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  it('renders markdown bold syntax as strong text', () => {
    render(<Markdown {...makeProps({ text: '**bold**' })} />);
    const strong = screen.getByText('bold');
    expect(strong).toBeTruthy();
    expect(strong.tagName.toLowerCase()).toBe('strong');
  });

  it('renders markdown italic syntax as emphasized text', () => {
    render(<Markdown {...makeProps({ text: '*italic*' })} />);
    const em = screen.getByText('italic');
    expect(em).toBeTruthy();
    expect(em.tagName.toLowerCase()).toBe('em');
  });

  it('renders markdown heading syntax', () => {
    render(<Markdown {...makeProps({ text: '# Heading 1' })} />);
    const heading = screen.getByText('Heading 1');
    expect(heading).toBeTruthy();
    expect(heading.tagName.toLowerCase()).toBe('h1');
  });

  it('renders empty content when text is empty string', () => {
    const { container } = render(<Markdown {...makeProps({ text: '' })} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.innerHTML).toBe('');
  });

  it('renders a wrapper div container', () => {
    const { container } = render(<Markdown {...makeProps({ text: 'content' })} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.tagName.toLowerCase()).toBe('div');
  });
});
