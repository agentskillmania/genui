/**
 * Text component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '../src/components/basic/Text';

const meta: Meta<typeof Text> = {
  title: 'Basic/Text',
  component: Text,
  argTypes: {
    id: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Heading1: Story = {
  name: 'H1 Heading',
  args: {
    id: 'text-h1',
    type: 'Text',
    properties: { text: 'Heading Level 1', variant: 'h1' },
  },
};

export const Heading2: Story = {
  name: 'H2 Heading',
  args: {
    id: 'text-h2',
    type: 'Text',
    properties: { text: 'Heading Level 2', variant: 'h2' },
  },
};

export const Heading3: Story = {
  name: 'H3 Heading',
  args: {
    id: 'text-h3',
    type: 'Text',
    properties: { text: 'Heading Level 3', variant: 'h3' },
  },
};

export const BodyText: Story = {
  name: 'Body Text',
  args: {
    id: 'text-body',
    type: 'Text',
    properties: { text: 'This is a standard body text paragraph.' },
  },
};

export const StrongText: Story = {
  name: 'Strong Text',
  args: {
    id: 'text-strong',
    type: 'Text',
    properties: { text: 'Bold emphasis text', strong: true },
  },
};

export const CaptionText: Story = {
  name: 'Caption Text',
  args: {
    id: 'text-caption',
    type: 'Text',
    properties: { text: 'Secondary caption text', variant: 'caption' },
  },
};

export const ColoredText: Story = {
  name: 'Colored Text',
  args: {
    id: 'text-colored',
    type: 'Text',
    properties: { text: 'Custom colored text', color: '#1677ff' },
  },
};
