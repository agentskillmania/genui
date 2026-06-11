/**
 * Tabs component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Tabs } from '../src/components/layout/Tabs';
import { Text } from '../src/components/basic/Text';

const meta: Meta<typeof Tabs> = {
  title: 'Layout/Tabs',
  component: Tabs,
};
export default meta;

type TabsStory = StoryObj<typeof Tabs>;

export const BasicTabs: TabsStory = {
  name: 'Basic Tabs',
  render: () => (
    <Tabs
      id="tabs-1"
      type="Tabs"
      properties={{
        tabTitles: ['Overview', 'Details', 'Settings'],
        defaultActiveKey: '0',
      }}
    >
      <Text id="tab-c1" type="Text" properties={{ text: 'Overview content goes here.' }} />
      <Text id="tab-c2" type="Text" properties={{ text: 'Details content goes here.' }} />
      <Text id="tab-c3" type="Text" properties={{ text: 'Settings content goes here.' }} />
    </Tabs>
  ),
};

export const CardStyleTabs: TabsStory = {
  name: 'Card Style Tabs',
  render: () => (
    <Tabs
      id="tabs-2"
      type="Tabs"
      properties={{
        tabTitles: ['Tab A', 'Tab B'],
        tabType: 'card',
        centered: true,
        size: 'large',
      }}
    >
      <Text id="tab-c4" type="Text" properties={{ text: 'Content A' }} />
      <Text id="tab-c5" type="Text" properties={{ text: 'Content B' }} />
    </Tabs>
  ),
};
