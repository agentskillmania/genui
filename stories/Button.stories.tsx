/**
 * Button component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/components/basic/Button';

const meta: Meta<typeof Button> = {
  title: 'Basic/Button',
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const PrimaryButton: Story = {
  name: 'Primary Button',
  args: {
    id: 'btn-primary',
    component: 'Button',
    properties: { text: 'Primary Action', variant: 'primary' },
  },
};

export const DefaultButton: Story = {
  name: 'Default Button',
  args: {
    id: 'btn-default',
    component: 'Button',
    properties: { text: 'Default Action', variant: 'default' },
  },
};

export const DashedButton: Story = {
  name: 'Dashed Button',
  args: {
    id: 'btn-dashed',
    component: 'Button',
    properties: { text: 'Dashed Border', variant: 'dashed' },
  },
};

export const DangerButton: Story = {
  name: 'Danger Button',
  args: {
    id: 'btn-danger',
    component: 'Button',
    properties: { text: 'Delete', variant: 'primary', danger: true },
  },
};

export const LoadingButton: Story = {
  name: 'Loading Button',
  args: {
    id: 'btn-loading',
    component: 'Button',
    properties: { text: 'Submitting...', variant: 'primary', loading: true },
  },
};
