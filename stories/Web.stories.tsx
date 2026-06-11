/**
 * Web (iframe) component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { Web } from '../src/components/basic/Web';

const meta: Meta<typeof Web> = {
  title: 'Basic/Web',
  component: Web,
};
export default meta;

type Story = StoryObj<typeof Web>;

export const EmbeddedWebPage: Story = {
  name: 'Embedded Web Page',
  args: {
    id: 'web-1',
    type: 'Web',
    properties: {
      url: 'https://example.com',
      width: '100%',
      height: 300,
    },
  },
};
