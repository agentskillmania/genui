import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Splitter } from '../src/components/layout/Splitter';

const meta: Meta<typeof Splitter> = {
  title: 'Layout/Splitter',
  component: Splitter,
};
export default meta;
type Story = StoryObj<typeof Splitter>;

export const HorizontalSplit: Story = {
  name: 'Horizontal Split',
  args: {
    id: 'split-1',
    type: 'Splitter',
    properties: { layout: 'horizontal' },
    children: (
      <>
        <div style={{ padding: 16, background: '#f0f0f0' }}>Panel A</div>
        <div style={{ padding: 16, background: '#e6f7ff' }}>Panel B</div>
      </>
    ),
  },
};
