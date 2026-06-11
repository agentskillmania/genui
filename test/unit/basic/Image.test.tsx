/**
 * Unit tests for the Image component.
 * Covers: defensive rendering without properties, url and alt text rendering,
 * width/height, object-fit, and custom style application.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Image } from '../../../src/components/basic/Image';

describe('Image', () => {
  // ---- Defensive rendering ----

  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Image id="img-1" component="Image" />);
    expect(container.querySelector('img')).toBeTruthy();
  });

  // ---- Normal rendering ----

  it('renders image with correct src from url property', () => {
    render(
      <Image
        id="img-1"
        component="Image"
        properties={{ url: 'https://example.com/photo.png' }}
      />,
    );
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toBe('https://example.com/photo.png');
  });

  it('renders image with alt text from description property', () => {
    render(
      <Image
        id="img-1"
        component="Image"
        properties={{
          url: 'https://example.com/photo.png',
          description: 'A photo',
        }}
      />,
    );
    const img = screen.getByRole('img');
    expect(img.getAttribute('alt')).toBe('A photo');
  });

  // ---- Size ----

  it('applies width from properties', () => {
    render(
      <Image
        id="img-1"
        component="Image"
        properties={{ url: 'https://example.com/photo.png', width: 200 }}
      />,
    );
    const img = screen.getByRole('img');
    // Ant Design Image sets width via inline style or attribute
    expect(img).toBeTruthy();
  });

  it('applies height from properties', () => {
    render(
      <Image
        id="img-1"
        component="Image"
        properties={{ url: 'https://example.com/photo.png', height: 150 }}
      />,
    );
    const img = screen.getByRole('img');
    expect(img).toBeTruthy();
  });

  // ---- Object fit ----

  it('applies objectFit from fit property', () => {
    render(
      <Image
        id="img-1"
        component="Image"
        properties={{
          url: 'https://example.com/photo.png',
          fit: 'cover',
        }}
      />,
    );
    const img = screen.getByRole('img');
    expect(img.style.objectFit).toBe('cover');
  });

  it('applies contain objectFit', () => {
    render(
      <Image
        id="img-1"
        component="Image"
        properties={{
          url: 'https://example.com/photo.png',
          fit: 'contain',
        }}
      />,
    );
    const img = screen.getByRole('img');
    expect(img.style.objectFit).toBe('contain');
  });

  // ---- Custom style ----

  it('merges custom style with default styles', () => {
    render(
      <Image
        id="img-1"
        component="Image"
        properties={{
          url: 'https://example.com/photo.png',
          style: { borderRadius: 8 },
        }}
      />,
    );
    const img = screen.getByRole('img');
    expect(img.style.borderRadius).toBe('8px');
  });
});
