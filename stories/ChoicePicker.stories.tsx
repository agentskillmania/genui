/**
 * ChoicePicker component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ChoicePicker } from '../src/components/input/ChoicePicker';

const fruitOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Durian', value: 'durian' },
];

const meta: Meta<typeof ChoicePicker> = {
  title: 'Input/ChoicePicker',
  component: ChoicePicker,
};
export default meta;

type ChoicePickerStory = StoryObj<typeof ChoicePicker>;

export const SingleSelect: ChoicePickerStory = {
  name: 'Single Select',
  args: {
    id: 'cp-1',
    component: 'ChoicePicker',
    properties: {
      placeholder: 'Select a fruit',
      options: fruitOptions,
      size: 'middle',
    },
  },
};

export const MultiSelect: ChoicePickerStory = {
  name: 'Multiple Select',
  args: {
    id: 'cp-2',
    component: 'ChoicePicker',
    properties: {
      placeholder: 'Select fruits',
      options: fruitOptions,
      mode: 'multiple',
    },
  },
};

export const PreSelected: ChoicePickerStory = {
  name: 'Pre-selected Value',
  args: {
    id: 'cp-3',
    component: 'ChoicePicker',
    properties: {
      value: 'banana',
      options: fruitOptions,
    },
  },
};
