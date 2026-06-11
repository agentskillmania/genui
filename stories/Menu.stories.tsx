/**
 * Menu component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Menu } from '../src/components/navigation/Menu';

const meta: Meta<typeof Menu> = {
  title: 'Navigation/Menu',
  component: Menu,
};
export default meta;

type Story = StoryObj<typeof Menu>;

export const Basic: Story = {
  name: 'Basic Menu',
  args: {
    id: 'menu-1',
    component: 'Menu',
    properties: {
      mode: 'vertical',
      selectedKeys: ['home'],
      items: [
        { key: 'home', label: 'Home' },
        { key: 'about', label: 'About' },
        { key: 'contact', label: 'Contact' },
      ],
    },
  },
};

export const HorizontalMenu: Story = {
  name: 'Horizontal Menu',
  args: {
    id: 'menu-2',
    component: 'Menu',
    properties: {
      mode: 'horizontal',
      selectedKeys: ['dashboard'],
      items: [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'analytics', label: 'Analytics' },
        { key: 'settings', label: 'Settings' },
      ],
    },
  },
};

export const DarkMenu: Story = {
  name: 'Dark Theme Menu',
  args: {
    id: 'menu-3',
    component: 'Menu',
    properties: {
      mode: 'vertical',
      theme: 'dark',
      selectedKeys: ['users'],
      items: [
        { key: 'users', label: 'Users' },
        { key: 'roles', label: 'Roles' },
        { key: 'permissions', label: 'Permissions' },
      ],
    },
  },
};

export const WithSubmenus: Story = {
  name: 'Menu with Submenus',
  args: {
    id: 'menu-4',
    component: 'Menu',
    properties: {
      mode: 'vertical',
      items: [
        { key: 'home', label: 'Home' },
        {
          key: 'products',
          label: 'Products',
          children: [
            { key: 'electronics', label: 'Electronics' },
            { key: 'clothing', label: 'Clothing' },
          ],
        },
        { key: 'contact', label: 'Contact' },
      ],
    },
  },
};
