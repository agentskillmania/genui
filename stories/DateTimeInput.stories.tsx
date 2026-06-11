/**
 * DateTimeInput component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { DateTimeInput } from '../src/components/input/DateTimeInput';

const meta: Meta<typeof DateTimeInput> = {
  title: 'Input/DateTimeInput',
  component: DateTimeInput,
};
export default meta;

type DateTimeStory = StoryObj<typeof DateTimeInput>;

export const DatePickerStory: DateTimeStory = {
  name: 'Date Picker',
  args: {
    id: 'dt-1',
    type: 'DateTimeInput',
    properties: {
      placeholder: 'Select a date',
      format: 'YYYY-MM-DD',
    },
  },
};

export const TimePickerStory: DateTimeStory = {
  name: 'Time Picker',
  args: {
    id: 'dt-2',
    type: 'DateTimeInput',
    properties: {
      placeholder: 'Select time',
      mode: 'time',
      format: 'HH:mm:ss',
    },
  },
};

export const DateTimePickerStory: DateTimeStory = {
  name: 'Date-Time Picker',
  args: {
    id: 'dt-3',
    type: 'DateTimeInput',
    properties: {
      placeholder: 'Select date & time',
      mode: 'datetime',
      format: 'YYYY-MM-DD HH:mm',
    },
  },
};
