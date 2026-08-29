/**
 * Integration test: template list binding rendered end-to-end.
 *
 * Exercises the full path an agent-produced A2UI payload takes:
 * SurfaceManager.handleMessage → stream parser → SurfaceEngine template
 * expansion → GenUISurface render with the real component registry.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { SurfaceManager } from '../../../src/SurfaceManager';
import { GenUISurface } from '../../../src/components/Surface';
import { registerComponent } from '../../../src/components/registry';
import { Text } from '../../../src/components/basic/Text';
import { Column } from '../../../src/components/layout/Column';
import { List } from '../../../src/components/layout/List';
import { GenuiError } from '../../../src/components/GenuiError';

// Register only the real renderers this test exercises — importing the full
// components/index entry pulls lottie-web, which cannot load under jsdom
registerComponent('Text', Text);
registerComponent('Column', Column);
registerComponent('List', List);
registerComponent('GenuiError', GenuiError);

describe('A2UI template list binding — end to end', () => {
  it('renders one item per array element via the real parser + engine + registry', () => {
    const manager = new SurfaceManager();

    const messages = [
      '{"version":"v0.9","createSurface":{"surfaceId":"task_list"}}',
      '{"version":"v0.9","updateComponents":{"surfaceId":"task_list","components":[' +
        '{"id":"root","component":"Column","children":["title","task_list"]},' +
        '{"id":"title","component":"Text","text":{"path":"/page/title"},"variant":"h2"},' +
        '{"id":"task_list","component":"List","children":{"path":"/tasks","componentId":"task_tpl"}},' +
        '{"id":"task_tpl","component":"Text","text":{"path":"name"}}' +
        ']}}',
      '{"version":"v0.9","updateDataModel":{"surfaceId":"task_list","path":"/page","value":{"title":"Tasks"}}}',
      '{"version":"v0.9","updateDataModel":{"surfaceId":"task_list","path":"/tasks","value":[{"name":"Buy milk"},{"name":"Walk dog"}]}}',
    ];

    for (const msg of messages) {
      manager.handleMessage(msg);
    }

    const { container } = render(
      <GenUISurface surfaceManager={manager} />,
    );

    const text = container.textContent ?? '';
    expect(text).toContain('Tasks');
    expect(text).toContain('Buy milk');
    expect(text).toContain('Walk dog');
    // No error cards for a healthy payload
    expect(container.querySelector('.ant-alert-error')).toBeNull();
  });

  it('renders a visible error card when the template path is missing from the dataModel', () => {
    const manager = new SurfaceManager();

    manager.handleMessage({ version: 'v0.9', createSurface: { surfaceId: 'broken' } });
    manager.handleMessage({
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'broken',
        components: [
          { id: 'root', component: 'List', children: { path: '/nope', componentId: 'tpl' } },
          { id: 'tpl', component: 'Text', text: { path: 'name' } },
        ],
      },
    });

    const { container } = render(<GenUISurface surfaceManager={manager} />);

    expect(container.querySelector('.ant-alert-error')).toBeTruthy();
    expect(container.textContent).toContain('/nope');
  });

  it('renders a no-root error card when no component has id "root"', () => {
    const manager = new SurfaceManager();

    manager.handleMessage({ version: 'v0.9', createSurface: { surfaceId: 'rootless' } });
    manager.handleMessage({
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'rootless',
        components: [{ id: 'card1', component: 'Text', text: 'hello' }],
      },
    });

    const { container } = render(<GenUISurface surfaceManager={manager} />);

    expect(container.querySelector('.ant-alert-error')).toBeTruthy();
    expect(container.textContent).toContain('No root component found');
  });
});
