/**
 * List component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { List } from '../src/components/layout/List';
import { Text } from '../src/components/basic/Text';

const meta: Meta<typeof List> = {
  title: 'Layout/List',
  component: List,
};
export default meta;

type ListStory = StoryObj<typeof List>;

export const BasicList: ListStory = {
  name: 'Basic List',
  render: () => (
    <List
      id="list-1"
      type="List"
      properties={{ header: 'Fruits', bordered: true, size: 'default' }}
    >
      <Text id="li-1" type="Text" properties={{ text: 'Apple' }} />
      <Text id="li-2" type="Text" properties={{ text: 'Banana' }} />
      <Text id="li-3" type="Text" properties={{ text: 'Cherry' }} />
    </List>
  ),
};

export const BorderedListWithFooter: ListStory = {
  name: 'Bordered List with Footer',
  render: () => (
    <List
      id="list-2"
      type="List"
      properties={{
        header: 'Tasks',
        footer: '3 items total',
        bordered: true,
        split: true,
        size: 'small',
      }}
    >
      <Text id="li-4" type="Text" properties={{ text: 'Write documentation' }} />
      <Text id="li-5" type="Text" properties={{ text: 'Fix bug #42' }} />
      <Text id="li-6" type="Text" properties={{ text: 'Release v2.0' }} />
    </List>
  ),
};
