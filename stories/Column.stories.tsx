/**
 * Column component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Column } from '../src/components/layout/Column';
import { Text } from '../src/components/basic/Text';

const meta: Meta<typeof Column> = {
  title: 'Layout/Column',
  component: Column,
};
export default meta;

type ColumnStory = StoryObj<typeof Column>;

export const BasicColumn: ColumnStory = {
  name: 'Basic Column',
  render: () => (
    <Column id="col-10" type="Column" properties={{ span: 12 }}>
      <Text id="t-10" type="Text" properties={{ text: 'First item', variant: 'body' }} />
      <Text id="t-11" type="Text" properties={{ text: 'Second item', variant: 'body' }} />
      <Text id="t-12" type="Text" properties={{ text: 'Third item', variant: 'body' }} />
    </Column>
  ),
};
