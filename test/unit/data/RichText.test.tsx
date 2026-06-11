/**
 * Unit tests for the RichText data component.
 * Covers: rendering with undefined properties, HTML content rendering,
 * empty text handling, and wrapper element type.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { RichText } from '../../../src/components/data/RichText';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'rt-1',
    component: 'RichText',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('RichText component', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <RichText id="rt-0" component="RichText" properties={undefined as unknown as Record<string, unknown>} />,
    );
    expect(container.innerHTML).not.toBe('');
  });

  it('renders HTML content via dangerouslySetInnerHTML', () => {
    const html = '<p>Hello <strong>World</strong></p>';
    const { container } = render(<RichText {...makeProps({ text: html })} />);
    // The HTML should be rendered as real DOM elements
    const strongEl = container.querySelector('strong');
    expect(strongEl).toBeTruthy();
    expect(strongEl?.textContent).toBe('World');
  });

  it('renders plain text content', () => {
    render(<RichText {...makeProps({ text: 'Just text' })} />);
    expect(screen.getByText('Just text')).toBeTruthy();
  });

  it('renders empty content when text is empty string', () => {
    const { container } = render(<RichText {...makeProps({ text: '' })} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.innerHTML).toBe('');
  });

  it('renders complex HTML with nested elements', () => {
    const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
    const { container } = render(<RichText {...makeProps({ text: html })} />);
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(2);
  });

  it('renders within a Typography element', () => {
    const { container } = render(<RichText {...makeProps({ text: 'test' })} />);
    const wrapper = container.firstChild as HTMLElement;
    // Ant Design Typography renders an article element
    expect(wrapper.tagName.toLowerCase()).toBe('article');
  });
});
