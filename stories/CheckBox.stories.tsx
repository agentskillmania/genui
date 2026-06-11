/**
 * CheckBox component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { CheckBox } from '../src/components/input/CheckBox';

const meta: Meta<typeof CheckBox> = {
  title: 'Input/CheckBox',
  component: CheckBox,
};
export default meta;

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
