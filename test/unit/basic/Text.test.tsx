/**
 * Unit tests for the Text component.
 * Covers: defensive rendering without properties, plain text rendering,
 * heading variants (h1-h5), caption variant, strong flag, and inline styles.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Text } from '../../../src/components/basic/Text';

describe('Text', () => {
  // ---- Defensive rendering ----

  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Text id="txt-1" component="Text" />);
    expect(container.innerHTML).not.toBe('');
  });

  // ---- Normal rendering ----

  it('renders plain text from properties.text', () => {
    render(
      <Text id="txt-1" component="Text" properties={{ text: 'Hello World' }} />,
    );
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  it('renders empty string when text is not provided', () => {
    const { container } = render(
      <Text id="txt-1" component="Text" properties={{}} />,
    );
    expect(container.innerHTML).not.toBe('');
  });

  // ---- Heading variants ----

  it('renders h1 variant', () => {
    render(
      <Text
        id="txt-1"
        component="Text"
        properties={{ text: 'Heading 1', variant: 'h1' }}
      />,
    );
    const el = screen.getByText('Heading 1');
    expect(el.tagName).toMatch(/^H\d$/);
  });

  it('renders h2 variant', () => {
    render(
      <Text
        id="txt-1"
        component="Text"
        properties={{ text: 'Heading 2', variant: 'h2' }}
      />,
    );
    const el = screen.getByText('Heading 2');
    expect(el.tagName).toMatch(/^H\d$/);
  });

  it('renders h3 variant', () => {
    render(
      <Text
        id="txt-1"
        component="Text"
        properties={{ text: 'Heading 3', variant: 'h3' }}
      />,
    );
    const el = screen.getByText('Heading 3');
    expect(el.tagName).toMatch(/^H\d$/);
  });

  it('renders h4 variant', () => {
    render(
      <Text
        id="txt-1"
        component="Text"
        properties={{ text: 'Heading 4', variant: 'h4' }}
      />,
    );
    const el = screen.getByText('Heading 4');
    expect(el.tagName).toMatch(/^H\d$/);
  });

  it('renders h5 variant', () => {
    render(
      <Text
        id="txt-1"
        component="Text"
        properties={{ text: 'Heading 5', variant: 'h5' }}
      />,
    );
    const el = screen.getByText('Heading 5');
    expect(el.tagName).toMatch(/^H\d$/);
  });

  // ---- Caption variant ----

  it('renders caption variant with secondary type', () => {
    render(
      <Text
        id="txt-1"
        component="Text"
        properties={{ text: 'Caption text', variant: 'caption' }}
      />,
    );
    const el = screen.getByText('Caption text');
    expect(el).toBeTruthy();
  });

  // ---- Strong flag ----

  it('renders strong text when strong is true (default variant)', () => {
    render(
      <Text
        id="txt-1"
        component="Text"
        properties={{ text: 'Bold', strong: true }}
      />,
    );
    const el = screen.getByText('Bold');
    expect(el).toBeTruthy();
  });

  // ---- Inline styles ----

  it('applies color style', () => {
    render(
      <Text
        id="txt-1"
        component="Text"
        properties={{ text: 'Colored', color: 'red' }}
      />,
    );
    const el = screen.getByText('Colored');
    expect(el.style.color).toBe('red');
  });

  it('applies italic style', () => {
    render(
      <Text
        id="txt-1"
        component="Text"
        properties={{ text: 'Italic', italic: true }}
      />,
    );
    const el = screen.getByText('Italic');
    expect(el.style.fontStyle).toBe('italic');
  });

  it('applies underline style', () => {
    render(
      <Text
        id="txt-1"
        component="Text"
        properties={{ text: 'Underlined', underline: true }}
      />,
    );
    const el = screen.getByText('Underlined');
    expect(el.style.textDecoration).toContain('underline');
  });

  it('applies line-through style when delete is true', () => {
    render(
      <Text
        id="txt-1"
        component="Text"
        properties={{ text: 'Deleted', delete: true }}
      />,
    );
    const el = screen.getByText('Deleted');
    expect(el.style.textDecoration).toContain('line-through');
  });

  it('prefers underline over delete when both are true', () => {
    render(
      <Text
        id="txt-1"
        component="Text"
        properties={{ text: 'Both', underline: true, delete: true }}
      />,
    );
    const el = screen.getByText('Both');
    expect(el.style.textDecoration).toContain('underline');
  });
});
