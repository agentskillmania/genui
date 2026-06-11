import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FloatButton } from '../src/components/utility/FloatButton';

const meta: Meta<typeof FloatButton> = {
  title: 'Utility/FloatButton',
  component: FloatButton,
};
export default meta;
type Story = StoryObj<typeof FloatButton>;

export const BasicFloatButton: Story = {
  name: 'Basic Float Button',
  args: {
    id: 'fb-1',
    component: 'FloatButton',
    properties: { tooltip: 'Back to top', type: 'primary' },
  },
};
