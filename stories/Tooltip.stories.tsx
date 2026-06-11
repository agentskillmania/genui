import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Tooltip } from '../src/components/layout/Tooltip';
import { Button } from '../src/components/basic/Button';

const meta: Meta<typeof Tooltip> = {
  title: 'Layout/Tooltip',
  component: Tooltip,
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const HoverTooltip: Story = {
  name: 'Hover Tooltip',
  args: {
    id: 'tip-1',
    component: 'Tooltip',
    properties: { title: 'This is a tooltip', placement: 'top' },
    children: <Button id="b1" type="Button" properties={{ text: 'Hover me' }} />,
  },
};
