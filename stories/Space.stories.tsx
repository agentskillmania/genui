import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Space } from '../src/components/layout/Space';
import { Button } from '../src/components/basic/Button';

const meta: Meta<typeof Space> = {
  title: 'Layout/Space',
  component: Space,
};
export default meta;
type Story = StoryObj<typeof Space>;

export const HorizontalSpace: Story = {
  name: 'Horizontal Space',
  args: {
    id: 'sp-1',
    type: 'Space',
    properties: { size: 16 },
    children: (
      <>
        <Button id="b1" type="Button" properties={{ text: 'A' }} />
        <Button id="b2" type="Button" properties={{ text: 'B' }} />
        <Button id="b3" type="Button" properties={{ text: 'C' }} />
      </>
    ),
  },
};
