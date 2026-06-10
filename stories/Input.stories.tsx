/**
 * Input component stories — TextField, CheckBox, ChoicePicker, Slider, DateTimeInput.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { TextField } from '../src/components/input/TextField';
import { CheckBox } from '../src/components/input/CheckBox';
import { ChoicePicker } from '../src/components/input/ChoicePicker';
import { Slider } from '../src/components/input/Slider';
import { DateTimeInput } from '../src/components/input/DateTimeInput';

// ---------------------------------------------------------------------------
// TextField
// ---------------------------------------------------------------------------

const textFieldMeta: Meta<typeof TextField> = {
  title: 'Input/TextField',
  component: TextField,
  argTypes: {
    id: { control: 'text' },
  },
};
export default textFieldMeta;

type TextFieldStory = StoryObj<typeof TextField>;

export const SingleLine: TextFieldStory = {
  name: 'Single-line Text Field',
  args: {
    id: 'tf-1',
    type: 'TextField',
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
    type: 'TextField',
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
    type: 'TextField',
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
    type: 'TextField',
    properties: {
      value: 'Cannot edit this',
      disabled: true,
    },
  },
};

// ---------------------------------------------------------------------------
// CheckBox
// ---------------------------------------------------------------------------

const checkBoxMeta: Meta<typeof CheckBox> = {
  title: 'Input/CheckBox',
  component: CheckBox,
};
export { checkBoxMeta as CheckBoxMeta };

type CheckBoxStory = StoryObj<typeof CheckBox>;

export const Unchecked: CheckBoxStory = {
  name: 'Unchecked',
  args: {
    id: 'cb-1',
    type: 'CheckBox',
    properties: { checked: false },
  },
};

export const Checked: CheckBoxStory = {
  name: 'Checked',
  args: {
    id: 'cb-2',
    type: 'CheckBox',
    properties: { checked: true },
  },
};

export const Indeterminate: CheckBoxStory = {
  name: 'Indeterminate',
  args: {
    id: 'cb-3',
    type: 'CheckBox',
    properties: { indeterminate: true },
  },
};

export const DisabledCheckBox: CheckBoxStory = {
  name: 'Disabled',
  args: {
    id: 'cb-4',
    type: 'CheckBox',
    properties: { checked: true, disabled: true },
  },
};

// ---------------------------------------------------------------------------
// ChoicePicker
// ---------------------------------------------------------------------------

const choicePickerMeta: Meta<typeof ChoicePicker> = {
  title: 'Input/ChoicePicker',
  component: ChoicePicker,
};
export { choicePickerMeta as ChoicePickerMeta };

type ChoicePickerStory = StoryObj<typeof ChoicePicker>;

const fruitOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Durian', value: 'durian' },
];

export const SingleSelect: ChoicePickerStory = {
  name: 'Single Select',
  args: {
    id: 'cp-1',
    type: 'ChoicePicker',
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
    type: 'ChoicePicker',
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
    type: 'ChoicePicker',
    properties: {
      value: 'banana',
      options: fruitOptions,
    },
  },
};

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------

const sliderMeta: Meta<typeof Slider> = {
  title: 'Input/Slider',
  component: Slider,
};
export { sliderMeta as SliderMeta };

type SliderStory = StoryObj<typeof Slider>;

export const BasicSlider: SliderStory = {
  name: 'Basic Slider',
  args: {
    id: 'slider-1',
    type: 'Slider',
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
    type: 'Slider',
    properties: {
      min: 0,
      max: 100,
      range: true,
      value: [20, 80],
    },
  },
};

// ---------------------------------------------------------------------------
// DateTimeInput
// ---------------------------------------------------------------------------

const dateTimeMeta: Meta<typeof DateTimeInput> = {
  title: 'Input/DateTimeInput',
  component: DateTimeInput,
};
export { dateTimeMeta as DateTimeInputMeta };

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
