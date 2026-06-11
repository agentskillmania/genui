/**
 * Dropdown component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Dropdown } from '../src/components/navigation/Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Navigation/Dropdown',
  component: Dropdown,
};
export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Basic: Story = {
  name: 'Basic Dropdown',
  args: {
    id: 'dropdown-1',
    component: 'Dropdown',
    properties: {
      label: 'Actions',
      trigger: 'click',
      items: [
        { key: 'edit', label: 'Edit' },
        { key: 'copy', label: 'Copy' },
        { key: 'delete', label: 'Delete', disabled: true },
      ],
    },
  },
};

export const WithPlacement: Story = {
  name: 'Dropdown with Placement',
  args: {
    id: 'dropdown-2',
    component: 'Dropdown',
    properties: {
      label: 'Options',
      trigger: 'click',
      placement: 'bottomRight',
      items: [
        { key: 'view', label: 'View Details' },
        { key: 'export', label: 'Export' },
        { key: 'share', label: 'Share' },
      ],
    },
  },
};
