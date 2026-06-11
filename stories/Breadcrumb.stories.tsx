/**
 * Breadcrumb component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Breadcrumb } from '../src/components/navigation/Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
};
export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Basic: Story = {
  name: 'Basic Breadcrumb',
  args: {
    id: 'breadcrumb-1',
    component: 'Breadcrumb',
    properties: {
      items: [
        { title: 'Home' },
        { title: 'Products' },
        { title: 'Electronics' },
      ],
    },
  },
};

export const WithSeparator: Story = {
  name: 'Breadcrumb with Custom Separator',
  args: {
    id: 'breadcrumb-2',
    component: 'Breadcrumb',
    properties: {
      items: [
        { title: 'Dashboard' },
        { title: 'Settings' },
        { title: 'Profile' },
      ],
      separator: '/',
    },
  },
};
