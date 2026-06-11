import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Upload } from '../src/components/input/Upload';

const meta: Meta<typeof Upload> = {
  title: 'Input/Upload',
  component: Upload,
};
export default meta;
type Story = StoryObj<typeof Upload>;

export const BasicUpload: Story = {
  name: 'Basic Upload',
  args: {
    id: 'up-1',
    type: 'Upload',
    properties: { buttonText: 'Upload File', maxCount: 3 },
  },
};
