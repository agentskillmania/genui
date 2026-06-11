/**
 * Unit tests for the Video media component.
 * Covers: rendering with undefined properties, video source, autoplay/controls/loop/muted,
 * width/height, and playsInline attribute.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Video } from '../../../src/components/media/Video';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'video-1',
    component: 'Video',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Video component', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <Video id="video-0" component="Video" properties={undefined as unknown as Record<string, unknown>} />,
    );
    expect(container.innerHTML).not.toBe('');
  });

  it('renders a video element', () => {
    const { container } = render(<Video {...makeProps()} />);
    const video = container.querySelector('video');
    expect(video).toBeTruthy();
  });

  it('sets the src attribute from url property', () => {
    const { container } = render(<Video {...makeProps({ url: 'https://example.com/video.mp4' })} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.getAttribute('src')).toBe('https://example.com/video.mp4');
  });

  it('shows controls by default', () => {
    const { container } = render(<Video {...makeProps()} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.hasAttribute('controls')).toBe(true);
  });

  it('hides controls when controls is false', () => {
    const { container } = render(<Video {...makeProps({ controls: false })} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.hasAttribute('controls')).toBe(false);
  });

  it('sets autoplay when autoplay is true', () => {
    const { container } = render(<Video {...makeProps({ autoplay: true })} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.hasAttribute('autoplay')).toBe(true);
  });

  it('sets loop when loop is true', () => {
    const { container } = render(<Video {...makeProps({ loop: true })} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.hasAttribute('loop')).toBe(true);
  });

  it('sets muted property when muted is true', () => {
    const { container } = render(<Video {...makeProps({ muted: true })} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    // jsdom renders muted as a DOM property, not an HTML attribute
    expect(video.muted).toBe(true);
  });

  it('sets width and height attributes', () => {
    const { container } = render(<Video {...makeProps({ width: 640, height: 480 })} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.getAttribute('width')).toBe('640');
    expect(video.getAttribute('height')).toBe('480');
  });

  it('includes playsInline attribute', () => {
    const { container } = render(<Video {...makeProps()} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.hasAttribute('playsinline')).toBe(true);
  });
});
