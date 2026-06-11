import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Watermark } from '../src/components/utility/Watermark';

const meta: Meta<typeof Watermark> = {
  title: 'Utility/Watermark',
  component: Watermark,
};
export default meta;
type Story = StoryObj<typeof Watermark>;

export const DraftWatermark: Story = {
  name: 'Draft Watermark',
  args: {
    id: 'wm-1',
    component: 'Watermark',
    properties: { content: 'DRAFT', fontColor: 'rgba(0,0,0,0.1)', fontSize: 16 },
    children: <div style={{ height: 300 }}>Protected content area</div>,
  },
};
