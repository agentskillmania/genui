/**
 * Data component stories — Table, Markdown, RichText.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Table } from '../src/components/data/Table';
import { Markdown } from '../src/components/data/Markdown';
import { RichText } from '../src/components/data/RichText';

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

const tableMeta: Meta<typeof Table> = {
  title: 'Data/Table',
  component: Table,
  argTypes: {
    id: { control: 'text' },
  },
};
export default tableMeta;

type TableStory = StoryObj<typeof Table>;

const tableColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
];

const tableData = [
  { id: '1', name: 'Alice', age: 28, role: 'Engineer' },
  { id: '2', name: 'Bob', age: 34, role: 'Designer' },
  { id: '3', name: 'Carol', age: 42, role: 'Manager' },
  { id: '4', name: 'Dave', age: 25, role: 'Engineer' },
];

export const BasicTable: TableStory = {
  name: 'Basic Table',
  args: {
    id: 'table-1',
    type: 'Table',
    properties: {
      columns: tableColumns,
      dataSource: tableData,
      bordered: true,
      size: 'middle',
    },
  },
};

export const CompactTable: TableStory = {
  name: 'Compact Table',
  args: {
    id: 'table-2',
    type: 'Table',
    properties: {
      columns: tableColumns,
      dataSource: tableData,
      bordered: false,
      size: 'small',
    },
  },
};

export const NoPaginationTable: TableStory = {
  name: 'Table without Pagination',
  args: {
    id: 'table-3',
    type: 'Table',
    properties: {
      columns: tableColumns,
      dataSource: tableData,
      pagination: false,
      size: 'middle',
    },
  },
};

// ---------------------------------------------------------------------------
// Markdown
// ---------------------------------------------------------------------------

const markdownMeta: Meta<typeof Markdown> = {
  title: 'Data/Markdown',
  component: Markdown,
};
export { markdownMeta as MarkdownMeta };

type MarkdownStory = StoryObj<typeof Markdown>;

export const BasicMarkdown: MarkdownStory = {
  name: 'Basic Markdown',
  args: {
    id: 'md-1',
    type: 'Markdown',
    properties: {
      text: [
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
    type: 'Markdown',
    properties: {
      text: [
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

// ---------------------------------------------------------------------------
// RichText
// ---------------------------------------------------------------------------

const richTextMeta: Meta<typeof RichText> = {
  title: 'Data/RichText',
  component: RichText,
};
export { richTextMeta as RichTextMeta };

type RichTextStory = StoryObj<typeof RichText>;

export const FormattedRichText: RichTextStory = {
  name: 'Formatted Rich Text',
  args: {
    id: 'rt-1',
    type: 'RichText',
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
