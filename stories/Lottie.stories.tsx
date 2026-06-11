/**
 * Lottie component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Lottie } from '../src/components/media/Lottie';

const meta: Meta<typeof Lottie> = {
  title: 'Media/Lottie',
  component: Lottie,
};
export default meta;

type LottieStory = StoryObj<typeof Lottie>;

export const LoadingAnimation: LottieStory = {
  name: 'Lottie Loading Animation',
  args: {
    id: 'lottie-1',
    component: 'Lottie',
    properties: {
      url: 'https://assets2.lottiefiles.com/packages/lf20_UJNc2t.json',
      width: 200,
      height: 200,
      loop: true,
      autoplay: true,
    },
  },
};
