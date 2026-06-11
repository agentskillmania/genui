/**
 * AudioPlayer component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { AudioPlayer } from '../src/components/media/AudioPlayer';

const meta: Meta<typeof AudioPlayer> = {
  title: 'Media/AudioPlayer',
  component: AudioPlayer,
};
export default meta;

type AudioStory = StoryObj<typeof AudioPlayer>;

export const BasicAudio: AudioStory = {
  name: 'Basic Audio Player',
  args: {
    id: 'audio-1',
    component: 'AudioPlayer',
    properties: {
      url: 'https://www.w3schools.com/html/horse.mp3',
      controls: true,
    },
  },
};
