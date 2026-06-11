/**
 * Image component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { Image } from '../src/components/basic/Image';

const meta: Meta<typeof Image> = {
  title: 'Basic/Image',
  component: Image,
};
export default meta;

type Story = StoryObj<typeof Image>;

export const PlaceholderImage: Story = {
  name: 'Placeholder Image',
  args: {
    id: 'img-1',
    type: 'Image',
    properties: {
      url: 'https://placehold.co/400x250/1677ff/ffffff?text=GenUI',
      description: 'Placeholder image',
      width: 400,
      height: 250,
      fit: 'cover',
    },
  },
};
