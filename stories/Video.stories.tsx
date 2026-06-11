/**
 * Video component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Video } from '../src/components/media/Video';

const meta: Meta<typeof Video> = {
  title: 'Media/Video',
  component: Video,
  argTypes: {
    id: { control: 'text' },
  },
};
export default meta;

type VideoStory = StoryObj<typeof Video>;

export const Html5Video: VideoStory = {
  name: 'HTML5 Video Player',
  args: {
    id: 'video-1',
    component: 'Video',
    properties: {
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      width: '100%',
      height: 300,
      controls: true,
    },
  },
};

export const MutedAutoplayVideo: VideoStory = {
  name: 'Muted Autoplay Video',
  args: {
    id: 'video-2',
    component: 'Video',
    properties: {
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      width: '100%',
      height: 300,
      autoplay: true,
      muted: true,
      controls: true,
      loop: true,
    },
  },
};
