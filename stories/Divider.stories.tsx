/**
 * Divider component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Divider } from '../src/components/basic/Divider';

const meta: Meta<typeof Divider> = {
  title: 'Basic/Divider',
  component: Divider,
};
export default meta;

type Story = StoryObj<typeof Divider>;

export const HorizontalDivider: Story = {
  name: 'Horizontal Divider',
  args: {
    id: 'divider-1',
    type: 'Divider',
    properties: { dashed: false },
  },
};

export const DashedDivider: Story = {
  name: 'Dashed Divider',
  args: {
    id: 'divider-2',
    type: 'Divider',
    properties: { dashed: true },
  },
};

export const DividerWithText: Story = {
  name: 'Divider with Text',
  args: {
    id: 'divider-3',
    type: 'Divider',
    properties: { type: 'center', plain: true },
    children: 'Section Title',
  },
  render: (args) => (
    <Divider
      id={args.id}
      type={args.type}
      properties={args.properties}
    >
      {args.children}
    </Divider>
  ),
};
