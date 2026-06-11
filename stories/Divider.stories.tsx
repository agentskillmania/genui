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
    component: 'Divider',
    properties: { dashed: false },
  },
};

export const DashedDivider: Story = {
  name: 'Dashed Divider',
  args: {
    id: 'divider-2',
    component: 'Divider',
    properties: { dashed: true },
  },
};

export const DividerWithText: Story = {
  name: 'Divider with Text',
  args: {
    id: 'divider-3',
    component: 'Divider',
    properties: { component: 'center', plain: true },
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
