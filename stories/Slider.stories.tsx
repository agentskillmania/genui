/**
 * Slider component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Slider } from '../src/components/input/Slider';

const meta: Meta<typeof Slider> = {
  title: 'Input/Slider',
  component: Slider,
};
export default meta;

type SliderStory = StoryObj<typeof Slider>;

export const BasicSlider: SliderStory = {
  name: 'Basic Slider',
  args: {
    id: 'slider-1',
    component: 'Slider',
    properties: {
      min: 0,
      max: 100,
      step: 1,
      value: 30,
    },
  },
};

export const RangeSlider: SliderStory = {
  name: 'Range Slider',
  args: {
    id: 'slider-2',
    component: 'Slider',
    properties: {
      min: 0,
      max: 100,
      range: true,
      value: [20, 80],
    },
  },
};
