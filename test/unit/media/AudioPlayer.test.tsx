/**
 * Unit tests for the AudioPlayer media component.
 * Covers: rendering with undefined properties, audio source, autoplay/controls/loop/muted attributes.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { AudioPlayer } from '../../../src/components/media/AudioPlayer';

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'audio-1',
    component: 'AudioPlayer',
    properties: {
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('AudioPlayer component', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(
      <AudioPlayer id="audio-0" component="AudioPlayer" properties={undefined as unknown as Record<string, unknown>} />,
    );
    expect(container.innerHTML).not.toBe('');
  });

  it('renders an audio element', () => {
    const { container } = render(<AudioPlayer {...makeProps()} />);
    const audio = container.querySelector('audio');
    expect(audio).toBeTruthy();
  });

  it('sets the src attribute from url property', () => {
    const { container } = render(<AudioPlayer {...makeProps({ url: 'https://example.com/audio.mp3' })} />);
    const audio = container.querySelector('audio') as HTMLAudioElement;
    expect(audio.getAttribute('src')).toBe('https://example.com/audio.mp3');
  });

  it('shows controls by default', () => {
    const { container } = render(<AudioPlayer {...makeProps()} />);
    const audio = container.querySelector('audio') as HTMLAudioElement;
    expect(audio.hasAttribute('controls')).toBe(true);
  });

  it('hides controls when controls is false', () => {
    const { container } = render(<AudioPlayer {...makeProps({ controls: false })} />);
    const audio = container.querySelector('audio') as HTMLAudioElement;
    expect(audio.hasAttribute('controls')).toBe(false);
  });

  it('sets autoplay when autoplay is true', () => {
    const { container } = render(<AudioPlayer {...makeProps({ autoplay: true })} />);
    const audio = container.querySelector('audio') as HTMLAudioElement;
    expect(audio.hasAttribute('autoplay')).toBe(true);
  });

  it('sets loop when loop is true', () => {
    const { container } = render(<AudioPlayer {...makeProps({ loop: true })} />);
    const audio = container.querySelector('audio') as HTMLAudioElement;
    expect(audio.hasAttribute('loop')).toBe(true);
  });

  it('sets muted property when muted is true', () => {
    const { container } = render(<AudioPlayer {...makeProps({ muted: true })} />);
    const audio = container.querySelector('audio') as HTMLAudioElement;
    // jsdom renders muted as a DOM property, not an HTML attribute
    expect(audio.muted).toBe(true);
  });
});
