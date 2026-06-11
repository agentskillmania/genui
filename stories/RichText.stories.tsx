/**
 * RichText component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { RichText } from '../src/components/data/RichText';

const meta: Meta<typeof RichText> = {
  title: 'Data/RichText',
  component: RichText,
};
export default meta;

type RichTextStory = StoryObj<typeof RichText>;

export const FormattedRichText: RichTextStory = {
  name: 'Formatted Rich Text',
  args: {
    id: 'rt-1',
    component: 'RichText',
    properties: {
      text: [
        '<h2>Rich Text Content</h2>',
        '<p>This is a <strong>bold</strong> and <em>italic</em> paragraph.</p>',
        '<ul>',
        '  <li>Item one</li>',
        '  <li>Item two</li>',
        '</ul>',
        '<p style="color: #1677ff;">Styled paragraph in blue.</p>',
      ].join('\n'),
    },
  },
};
