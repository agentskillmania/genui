/**
 * GenUISurface story — full surface rendering via SurfaceManager.
 *
 * Creates a SurfaceManager, feeds it a complete A2UI card via the
 * streaming API, then renders with GenUISurface.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useRef } from 'react';

import { GenUISurface } from '../src/components/Surface';
import { SurfaceManager } from '../src/SurfaceManager';
import type { GenUISurfaceProps } from '../src/components/Surface';

// Register all components (side-effect import)
import '../src/components/index';

const meta: Meta<typeof GenUISurface> = {
  title: 'Surface/GenUISurface',
  component: GenUISurface,
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
  },
};
export default meta;

type SurfaceStory = StoryObj<typeof GenUISurface>;

/**
 * Helper: build a SurfaceManager pre-loaded with a surface and components.
 */
function createPopulatedManager(): SurfaceManager {
  const manager = new SurfaceManager();

  // Create a surface
  manager.getEngine().createSurface('story-surface', 'default', {});

  // Add a Card with a title row and a list of items
  manager.getEngine().updateComponents('story-surface', [
    JSON.stringify({
      id: 'card-root',
      type: 'Card',
      title: 'User Dashboard',
      bordered: true,
      style: { maxWidth: 600, margin: '0 auto' },
    }),
    JSON.stringify({
      id: 'header-row',
      type: 'Row',
      parentId: 'card-root',
    }),
    JSON.stringify({
      id: 'header-col',
      type: 'Column',
      parentId: 'header-row',
      span: 24,
    }),
    JSON.stringify({
      id: 'welcome-text',
      type: 'Text',
      parentId: 'header-col',
      text: 'Welcome back, Alice!',
      variant: 'h3',
    }),
    JSON.stringify({
      id: 'stats-row',
      type: 'Row',
      parentId: 'card-root',
      gutter: 16,
    }),
    JSON.stringify({
      id: 'stat-col-1',
      type: 'Column',
      parentId: 'stats-row',
      span: 8,
    }),
    JSON.stringify({
      id: 'stat-text-1',
      type: 'Text',
      parentId: 'stat-col-1',
      text: 'Tasks: 12',
      strong: true,
    }),
    JSON.stringify({
      id: 'stat-col-2',
      type: 'Column',
      parentId: 'stats-row',
      span: 8,
    }),
    JSON.stringify({
      id: 'stat-text-2',
      type: 'Text',
      parentId: 'stat-col-2',
      text: 'Completed: 8',
      strong: true,
    }),
    JSON.stringify({
      id: 'stat-col-3',
      type: 'Column',
      parentId: 'stats-row',
      span: 8,
    }),
    JSON.stringify({
      id: 'stat-text-3',
      type: 'Text',
      parentId: 'stat-col-3',
      text: 'Pending: 4',
      strong: true,
    }),
    JSON.stringify({
      id: 'divider',
      type: 'Divider',
      parentId: 'card-root',
    }),
    JSON.stringify({
      id: 'action-row',
      type: 'Row',
      parentId: 'card-root',
      justify: 'center',
    }),
    JSON.stringify({
      id: 'action-col',
      type: 'Column',
      parentId: 'action-row',
      span: 24,
      style: { textAlign: 'center' },
    }),
    JSON.stringify({
      id: 'action-btn',
      type: 'Button',
      parentId: 'action-col',
      text: 'View All Tasks',
      variant: 'primary',
    }),
  ]);

  return manager;
}

/**
 * Wrapper component that creates the manager and renders GenUISurface.
 */
const SurfaceDemo: React.FC<Partial<GenUISurfaceProps>> = (props) => {
  const managerRef = useRef<SurfaceManager | null>(null);

  if (!managerRef.current) {
    managerRef.current = createPopulatedManager();
  }

  return (
    <GenUISurface
      surfaceManager={managerRef.current}
      width={props.width ?? '100%'}
      height={props.height ?? 500}
      style={{ padding: 24, background: '#f5f5f5', borderRadius: 8 }}
      onAction={(action) => {
        // eslint-disable-next-line no-console
        console.log('[GenUISurface Story] Action:', action);
      }}
    />
  );
};

export const DashboardCard: SurfaceStory = {
  name: 'Dashboard Card Surface',
  render: (args) => <SurfaceDemo width={args.width} height={args.height} />,
  args: {
    width: '100%',
    height: 500,
  },
};
