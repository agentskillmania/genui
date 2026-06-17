/**
 * Markdown component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Markdown } from '../src/components/data/Markdown';

const meta: Meta<typeof Markdown> = {
  title: 'Data/Markdown',
  component: Markdown,
};
export default meta;

type MarkdownStory = StoryObj<typeof Markdown>;

export const BasicMarkdown: MarkdownStory = {
  name: 'Basic Markdown',
  args: {
    id: 'md-1',
    component: 'Markdown',
    properties: {
      content: [
        '# GenUI Markdown',
        '',
        'This is a **markdown** component that renders _formatted_ text.',
        '',
        '## Features',
        '',
        '- Bullet list item 1',
        '- Bullet list item 2',
        '- Bullet list item 3',
        '',
        '> Blockquote: Lorem ipsum dolor sit amet.',
        '',
        'Inline `code` and a [link](https://example.com).',
      ].join('\n'),
    },
  },
};

export const CodeBlock: MarkdownStory = {
  name: 'Markdown with Code Block',
  args: {
    id: 'md-2',
    component: 'Markdown',
    properties: {
      content: [
        '### Example Code',
        '',
        '```javascript',
        'const greeting = "Hello, World!";',
        'console.log(greeting);',
        '```',
      ].join('\n'),
    },
  },
};
