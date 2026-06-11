/**
 * Row component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Row } from '../src/components/layout/Row';
import { Column } from '../src/components/layout/Column';
import { Text } from '../src/components/basic/Text';

const meta: Meta<typeof Row> = {
  title: 'Layout/Row',
  component: Row,
  argTypes: {
    id: { control: 'text' },
  },
};
export default meta;

type RowStory = StoryObj<typeof Row>;

export const BasicRow: RowStory = {
  name: 'Basic Row',
  render: () => (
    <Row
      id="row-1"
      type="Row"
      properties={{ gutter: [16, 16], justify: 'space-between', align: 'middle' }}
    >
      <Column id="col-1" type="Column" properties={{ span: 8 }}>
        <Text id="t-1" type="Text" properties={{ text: 'Column A', variant: 'body' }} />
      </Column>
      <Column id="col-2" type="Column" properties={{ span: 8 }}>
        <Text id="t-2" type="Text" properties={{ text: 'Column B', variant: 'body' }} />
      </Column>
      <Column id="col-3" type="Column" properties={{ span: 8 }}>
        <Text id="t-3" type="Text" properties={{ text: 'Column C', variant: 'body' }} />
      </Column>
    </Row>
  ),
};

export const CenteredRow: RowStory = {
  name: 'Centered Row',
  render: () => (
    <Row
      id="row-2"
      type="Row"
      properties={{ justify: 'center', align: 'middle', gutter: 24 }}
    >
      <Column id="col-4" type="Column" properties={{ span: 6 }}>
        <Text id="t-4" type="Text" properties={{ text: 'Left', variant: 'body' }} />
      </Column>
      <Column id="col-5" type="Column" properties={{ span: 6 }}>
        <Text id="t-5" type="Text" properties={{ text: 'Right', variant: 'body' }} />
      </Column>
    </Row>
  ),
};
