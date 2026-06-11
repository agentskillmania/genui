/**
 * Card component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Card } from '../src/components/layout/Card';
import { Text } from '../src/components/basic/Text';

const meta: Meta<typeof Card> = {
  title: 'Layout/Card',
  component: Card,
};
export default meta;

type CardStory = StoryObj<typeof Card>;

export const BasicCard: CardStory = {
  name: 'Basic Card',
  render: () => (
    <Card
      id="card-1"
      type="Card"
      properties={{ title: 'User Profile', bordered: true }}
    >
      <Text id="ct-1" type="Text" properties={{ text: 'John Doe — Software Engineer' }} />
    </Card>
  ),
};

export const HoverableCard: CardStory = {
  name: 'Hoverable Card',
  render: () => (
    <Card
      id="card-2"
      type="Card"
      properties={{
        title: 'Statistics',
        extra: 'More',
        hoverable: true,
        bordered: true,
        style: { width: 300 },
      }}
    >
      <Text id="ct-2" type="Text" properties={{ text: 'Active users: 1,234' }} />
    </Card>
  ),
};
