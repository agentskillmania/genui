/**
 * Layout component stories — Row, Column, List, Card, Tabs, Modal, Carousel.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Row } from '../src/components/layout/Row';
import { Column } from '../src/components/layout/Column';
import { List } from '../src/components/layout/List';
import { Card } from '../src/components/layout/Card';
import { Tabs } from '../src/components/layout/Tabs';
import { Modal } from '../src/components/layout/Modal';
import { Carousel } from '../src/components/layout/Carousel';
import { Text } from '../src/components/basic/Text';

// ---------------------------------------------------------------------------
// Row
// ---------------------------------------------------------------------------

const rowMeta: Meta<typeof Row> = {
  title: 'Layout/Row',
  component: Row,
  argTypes: {
    id: { control: 'text' },
  },
};
export default rowMeta;

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

// ---------------------------------------------------------------------------
// Column
// ---------------------------------------------------------------------------

const columnMeta: Meta<typeof Column> = {
  title: 'Layout/Column',
  component: Column,
};
export { columnMeta as ColumnMeta };

// Re-export rowMeta as default; individual stories use named exports grouped by title.
// Storybook gathers all named exports from this file under their respective titles.

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

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

const listMeta: Meta<typeof List> = {
  title: 'Layout/List',
  component: List,
};
export { listMeta as ListMeta };

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

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

const cardMeta: Meta<typeof Card> = {
  title: 'Layout/Card',
  component: Card,
};
export { cardMeta as CardMeta };

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

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

const tabsMeta: Meta<typeof Tabs> = {
  title: 'Layout/Tabs',
  component: Tabs,
};
export { tabsMeta as TabsMeta };

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

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

const modalMeta: Meta<typeof Modal> = {
  title: 'Layout/Modal',
  component: Modal,
};
export { modalMeta as ModalMeta };

type ModalStory = StoryObj<typeof Modal>;

export const OpenModal: ModalStory = {
  name: 'Open Modal',
  render: () => (
    <Modal
      id="modal-1"
      type="Modal"
      properties={{
        title: 'Confirm Action',
        open: true,
        width: 520,
        centered: true,
      }}
    >
      <Text
        id="modal-body"
        type="Text"
        properties={{ text: 'Are you sure you want to proceed with this action?' }}
      />
    </Modal>
  ),
};

// ---------------------------------------------------------------------------
// Carousel
// ---------------------------------------------------------------------------

const carouselMeta: Meta<typeof Carousel> = {
  title: 'Layout/Carousel',
  component: Carousel,
};
export { carouselMeta as CarouselMeta };

type CarouselStory = StoryObj<typeof Carousel>;

export const AutoPlayCarousel: CarouselStory = {
  name: 'Auto-play Carousel',
  render: () => (
    <Carousel
      id="carousel-1"
      type="Carousel"
      properties={{
        autoplay: true,
        autoplaySpeed: 3000,
        effect: 'scrollx',
      }}
    >
      <div style={{ background: '#364d79', padding: 40, textAlign: 'center', color: '#fff' }}>
        <Text id="sl-1" type="Text" properties={{ text: 'Slide 1', variant: 'h2', color: '#fff' }} />
      </div>
      <div style={{ background: '#00b96b', padding: 40, textAlign: 'center', color: '#fff' }}>
        <Text id="sl-2" type="Text" properties={{ text: 'Slide 2', variant: 'h2', color: '#fff' }} />
      </div>
      <div style={{ background: '#ff7a45', padding: 40, textAlign: 'center', color: '#fff' }}>
        <Text id="sl-3" type="Text" properties={{ text: 'Slide 3', variant: 'h2', color: '#fff' }} />
      </div>
    </Carousel>
  ),
};
