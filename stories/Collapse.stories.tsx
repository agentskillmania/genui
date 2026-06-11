import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Collapse } from '../src/components/layout/Collapse';

const meta: Meta<typeof Collapse> = {
  title: 'Layout/Collapse',
  component: Collapse,
};
export default meta;
type Story = StoryObj<typeof Collapse>;

export const Accordion: Story = {
  name: 'Accordion',
  args: {
    id: 'col-1',
    type: 'Collapse',
    properties: {
      items: [
        { key: '1', label: 'Section A', children: 'Content for section A' },
        { key: '2', label: 'Section B', children: 'Content for section B' },
      ],
      accordion: true,
    },
  },
};
