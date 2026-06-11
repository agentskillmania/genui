/**
 * Icon component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../src/components/basic/Icon';

const meta: Meta<typeof Icon> = {
  title: 'Basic/Icon',
  component: Icon,
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const HomeIcon: Story = {
  name: 'Home Icon',
  args: {
    id: 'icon-home',
    component: 'Icon',
    properties: { name: 'HomeOutlined', size: 32, color: '#1677ff' },
  },
};

export const CheckIcon: Story = {
  name: 'Check Circle Icon',
  args: {
    id: 'icon-check',
    component: 'Icon',
    properties: { name: 'CheckCircleOutlined', size: 40, color: '#52c41a' },
  },
};

export const SettingsIcon: Story = {
  name: 'Settings Icon',
  args: {
    id: 'icon-settings',
    component: 'Icon',
    properties: { name: 'SettingOutlined', size: 28 },
  },
};
