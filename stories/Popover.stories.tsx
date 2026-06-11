import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Popover } from '../src/components/layout/Popover';
import { Button } from '../src/components/basic/Button';

const meta: Meta<typeof Popover> = {
  title: 'Layout/Popover',
  component: Popover,
};
export default meta;
type Story = StoryObj<typeof Popover>;

export const ClickPopover: Story = {
  name: 'Click Popover',
  args: {
    id: 'pop-1',
    component: 'Popover',
    properties: { title: 'Details', content: 'More information here', trigger: 'click' },
    children: <Button id="b1" type="Button" properties={{ text: 'Click me' }} />,
  },
};
