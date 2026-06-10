/**
 * Media component stories — Video, AudioPlayer, Lottie.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Video } from '../src/components/media/Video';
import { AudioPlayer } from '../src/components/media/AudioPlayer';
import { Lottie } from '../src/components/media/Lottie';

// ---------------------------------------------------------------------------
// Video
// ---------------------------------------------------------------------------

const videoMeta: Meta<typeof Video> = {
  title: 'Media/Video',
  component: Video,
  argTypes: {
    id: { control: 'text' },
  },
};
export default videoMeta;

type VideoStory = StoryObj<typeof Video>;

export const Html5Video: VideoStory = {
  name: 'HTML5 Video Player',
  args: {
    id: 'video-1',
    type: 'Video',
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
    type: 'Video',
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

// ---------------------------------------------------------------------------
// AudioPlayer
// ---------------------------------------------------------------------------

const audioMeta: Meta<typeof AudioPlayer> = {
  title: 'Media/AudioPlayer',
  component: AudioPlayer,
};
export { audioMeta as AudioPlayerMeta };

type AudioStory = StoryObj<typeof AudioPlayer>;

export const BasicAudio: AudioStory = {
  name: 'Basic Audio Player',
  args: {
    id: 'audio-1',
    type: 'AudioPlayer',
    properties: {
      url: 'https://www.w3schools.com/html/horse.mp3',
      controls: true,
    },
  },
};

// ---------------------------------------------------------------------------
// Lottie
// ---------------------------------------------------------------------------

const lottieMeta: Meta<typeof Lottie> = {
  title: 'Media/Lottie',
  component: Lottie,
};
export { lottieMeta as LottieMeta };

type LottieStory = StoryObj<typeof Lottie>;

export const LoadingAnimation: LottieStory = {
  name: 'Lottie Loading Animation',
  args: {
    id: 'lottie-1',
    type: 'Lottie',
    properties: {
      url: 'https://assets2.lottiefiles.com/packages/lf20_UJNc2t.json',
      width: 200,
      height: 200,
      loop: true,
      autoplay: true,
    },
  },
};
