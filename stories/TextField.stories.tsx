/**
 * TextField component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { TextField } from '../src/components/input/TextField';

const meta: Meta<typeof TextField> = {
  title: 'Input/TextField',
  component: TextField,
  argTypes: {
    id: { control: 'text' },
  },
};
export default meta;

type TextFieldStory = StoryObj<typeof TextField>;

export const SingleLine: TextFieldStory = {
  name: 'Single-line Text Field',
  args: {
    id: 'tf-1',
    component: 'TextField',
    properties: {
      placeholder: 'Enter your name...',
      size: 'middle',
    },
  },
};

export const WithValue: TextFieldStory = {
  name: 'Text Field with Value',
  args: {
    id: 'tf-2',
    component: 'TextField',
    properties: {
      value: 'Pre-filled value',
      size: 'middle',
    },
  },
};

export const Multiline: TextFieldStory = {
  name: 'Multiline Text Field',
  args: {
    id: 'tf-3',
    component: 'TextField',
    properties: {
      placeholder: 'Enter a long description...',
      variant: 'multiline',
    },
  },
};

export const DisabledField: TextFieldStory = {
  name: 'Disabled Text Field',
  args: {
    id: 'tf-4',
    component: 'TextField',
    properties: {
      value: 'Cannot edit this',
      disabled: true,
    },
  },
};
