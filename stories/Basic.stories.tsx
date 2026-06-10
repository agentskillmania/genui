/**
 * Basic component stories — Text, Button, Icon, Image, Divider, Web.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Text } from '../src/components/basic/Text';
import { Button } from '../src/components/basic/Button';
import { Icon } from '../src/components/basic/Icon';
import { Image } from '../src/components/basic/Image';
import { Divider } from '../src/components/basic/Divider';
import { Web } from '../src/components/basic/Web';

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

const textMeta: Meta<typeof Text> = {
  title: 'Basic/Text',
  component: Text,
  argTypes: {
    id: { control: 'text' },
  },
};
export default textMeta;

type TextStory = StoryObj<typeof Text>;

export const Heading1: TextStory = {
  name: 'H1 Heading',
  args: {
    id: 'text-h1',
    type: 'Text',
    properties: { text: 'Heading Level 1', variant: 'h1' },
  },
};

export const Heading2: TextStory = {
  name: 'H2 Heading',
  args: {
    id: 'text-h2',
    type: 'Text',
    properties: { text: 'Heading Level 2', variant: 'h2' },
  },
};

export const Heading3: TextStory = {
  name: 'H3 Heading',
  args: {
    id: 'text-h3',
    type: 'Text',
    properties: { text: 'Heading Level 3', variant: 'h3' },
  },
};

export const BodyText: TextStory = {
  name: 'Body Text',
  args: {
    id: 'text-body',
    type: 'Text',
    properties: { text: 'This is a standard body text paragraph.' },
  },
};

export const StrongText: TextStory = {
  name: 'Strong Text',
  args: {
    id: 'text-strong',
    type: 'Text',
    properties: { text: 'Bold emphasis text', strong: true },
  },
};

export const CaptionText: TextStory = {
  name: 'Caption Text',
  args: {
    id: 'text-caption',
    type: 'Text',
    properties: { text: 'Secondary caption text', variant: 'caption' },
  },
};

export const ColoredText: TextStory = {
  name: 'Colored Text',
  args: {
    id: 'text-colored',
    type: 'Text',
    properties: { text: 'Custom colored text', color: '#1677ff' },
  },
};

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

const buttonMeta: Meta<typeof Button> = {
  title: 'Basic/Button',
  component: Button,
};
export { buttonMeta as ButtonMeta };

type ButtonStory = StoryObj<typeof Button>;

export const PrimaryButton: ButtonStory = {
  name: 'Primary Button',
  args: {
    id: 'btn-primary',
    type: 'Button',
    properties: { text: 'Primary Action', variant: 'primary' },
  },
};

export const DefaultButton: ButtonStory = {
  name: 'Default Button',
  args: {
    id: 'btn-default',
    type: 'Button',
    properties: { text: 'Default Action', variant: 'default' },
  },
};

export const DashedButton: ButtonStory = {
  name: 'Dashed Button',
  args: {
    id: 'btn-dashed',
    type: 'Button',
    properties: { text: 'Dashed Border', variant: 'dashed' },
  },
};

export const DangerButton: ButtonStory = {
  name: 'Danger Button',
  args: {
    id: 'btn-danger',
    type: 'Button',
    properties: { text: 'Delete', variant: 'primary', danger: true },
  },
};

export const LoadingButton: ButtonStory = {
  name: 'Loading Button',
  args: {
    id: 'btn-loading',
    type: 'Button',
    properties: { text: 'Submitting...', variant: 'primary', loading: true },
  },
};

// ---------------------------------------------------------------------------
// Icon
// ---------------------------------------------------------------------------

const iconMeta: Meta<typeof Icon> = {
  title: 'Basic/Icon',
  component: Icon,
};
export { iconMeta as IconMeta };

type IconStory = StoryObj<typeof Icon>;

export const HomeIcon: IconStory = {
  name: 'Home Icon',
  args: {
    id: 'icon-home',
    type: 'Icon',
    properties: { name: 'HomeOutlined', size: 32, color: '#1677ff' },
  },
};

export const CheckIcon: IconStory = {
  name: 'Check Circle Icon',
  args: {
    id: 'icon-check',
    type: 'Icon',
    properties: { name: 'CheckCircleOutlined', size: 40, color: '#52c41a' },
  },
};

export const SettingsIcon: IconStory = {
  name: 'Settings Icon',
  args: {
    id: 'icon-settings',
    type: 'Icon',
    properties: { name: 'SettingOutlined', size: 28 },
  },
};

// ---------------------------------------------------------------------------
// Image
// ---------------------------------------------------------------------------

const imageMeta: Meta<typeof Image> = {
  title: 'Basic/Image',
  component: Image,
};
export { imageMeta as ImageMeta };

type ImageStory = StoryObj<typeof Image>;

export const PlaceholderImage: ImageStory = {
  name: 'Placeholder Image',
  args: {
    id: 'img-1',
    type: 'Image',
    properties: {
      url: 'https://placehold.co/400x250/1677ff/ffffff?text=GenUI',
      description: 'Placeholder image',
      width: 400,
      height: 250,
      fit: 'cover',
    },
  },
};

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------

const dividerMeta: Meta<typeof Divider> = {
  title: 'Basic/Divider',
  component: Divider,
};
export { dividerMeta as DividerMeta };

type DividerStory = StoryObj<typeof Divider>;

export const HorizontalDivider: DividerStory = {
  name: 'Horizontal Divider',
  args: {
    id: 'divider-1',
    type: 'Divider',
    properties: { dashed: false },
  },
};

export const DashedDivider: DividerStory = {
  name: 'Dashed Divider',
  args: {
    id: 'divider-2',
    type: 'Divider',
    properties: { dashed: true },
  },
};

export const DividerWithText: DividerStory = {
  name: 'Divider with Text',
  args: {
    id: 'divider-3',
    type: 'Divider',
    properties: { type: 'center', plain: true },
    children: 'Section Title',
  },
  render: (args) => (
    <Divider
      id={args.id}
      type={args.type}
      properties={args.properties}
    >
      {args.children}
    </Divider>
  ),
};

// ---------------------------------------------------------------------------
// Web (iframe)
// ---------------------------------------------------------------------------

const webMeta: Meta<typeof Web> = {
  title: 'Basic/Web',
  component: Web,
};
export { webMeta as WebMeta };

type WebStory = StoryObj<typeof Web>;

export const EmbeddedWebPage: WebStory = {
  name: 'Embedded Web Page',
  args: {
    id: 'web-1',
    type: 'Web',
    properties: {
      url: 'https://example.com',
      width: '100%',
      height: 300,
    },
  },
};
