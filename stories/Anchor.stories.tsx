/**
 * Anchor component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Anchor } from '../src/components/navigation/Anchor';

const meta: Meta<typeof Anchor> = {
  title: 'Navigation/Anchor',
  component: Anchor,
};
export default meta;

type Story = StoryObj<typeof Anchor>;

export const Basic: Story = {
  name: 'Basic Anchor',
  args: {
    id: 'anchor-1',
    component: 'Anchor',
    properties: {
      items: [
        { key: '1', href: '#introduction', title: 'Introduction' },
        { key: '2', href: '#features', title: 'Features' },
        { key: '3', href: '#api', title: 'API Reference' },
      ],
    },
  },
};

export const WithNestedItems: Story = {
  name: 'Anchor with Nested Items',
  args: {
    id: 'anchor-2',
    component: 'Anchor',
    properties: {
      items: [
        {
          key: '1',
          href: '#getting-started',
          title: 'Getting Started',
          children: [
            { key: '1a', href: '#installation', title: 'Installation' },
            { key: '1b', href: '#configuration', title: 'Configuration' },
          ],
        },
        { key: '2', href: '#advanced', title: 'Advanced' },
      ],
    },
  },
};
