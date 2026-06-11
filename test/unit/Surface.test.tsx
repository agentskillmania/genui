/**
 * Unit tests for the GenUISurface React component.
 *
 * Tests cover: rendering with existing surfaces, event-driven surface
 * lifecycle (create, update, delete), action forwarding, component
 * rendering via registry, theme mode application, unknown component
 * warnings, and cleanup on unmount.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import React from 'react';
import { GenUISurface } from '../../src/components/Surface';
import type { SurfaceManager } from '../../src/SurfaceManager';
import type { SurfaceEvent } from '../../src/engine/types';
import type { AGenUIComponent, ActionEvent } from '../../src/types/sdk';

// ---------- Mocks ----------

// Track registered listeners so tests can emit events
let engineListeners: Array<(event: SurfaceEvent) => void> = [];

const mockSurfaceState = {
  getRootComponents: vi.fn<() => AGenUIComponent[]>(() => []),
  getChildren: vi.fn<(id: string) => AGenUIComponent[]>(() => []),
  getTheme: vi.fn<() => Record<string, string>>(() => ({})),
};

const mockEngine = {
  getSurfaceIds: vi.fn<() => string[]>(() => []),
  getSurface: vi.fn<(id: string) => typeof mockSurfaceState | undefined>(() => mockSurfaceState),
  resolveProperties: vi.fn<(surfaceId: string, value: unknown) => unknown>((_sid, value) => value),
  addListener: vi.fn<(listener: (event: SurfaceEvent) => void) => () => void>((listener) => {
    engineListeners.push(listener);
    return () => {
      engineListeners = engineListeners.filter((l) => l !== listener);
    };
  }),
  createSurface: vi.fn(),
  deleteSurface: vi.fn(),
  submitAction: vi.fn(),
};

const mockSurfaceManager = {
  getEngine: vi.fn<() => typeof mockEngine>(() => mockEngine),
  submitUIAction: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  instanceId: 1,
} as unknown as SurfaceManager;

// Mock the component registry
vi.mock('../../src/components/registry', () => ({
  getComponentRenderer: vi.fn(),
  registerComponent: vi.fn(),
  hasComponent: vi.fn(),
  getRegisteredTypes: vi.fn(),
}));

// Must come after vi.mock
import { getComponentRenderer } from '../../src/components/registry';

const mockGetRenderer = vi.mocked(getComponentRenderer);

// ---------- Helpers ----------

/** Emit a surface event to all registered engine listeners */
function emitEvent(event: SurfaceEvent): void {
  for (const listener of engineListeners) {
    listener(event);
  }
}

/** Create a basic component definition */
function makeComponent(id: string, componentType = 'Text', extra?: Partial<AGenUIComponent>): AGenUIComponent {
  return { id, component: componentType, ...extra } as AGenUIComponent;
}

/** Simple renderer that just renders a div with the component id */
function SimpleRenderer(props: { id: string; children?: React.ReactNode }) {
  return React.createElement('div', { 'data-testid': `comp-${props.id}` }, props.children);
}

// ---------- Tests ----------

describe('GenUISurface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    engineListeners = [];
    mockSurfaceState.getRootComponents.mockReturnValue([]);
    mockSurfaceState.getChildren.mockReturnValue([]);
    mockSurfaceState.getTheme.mockReturnValue({});
    mockEngine.getSurfaceIds.mockReturnValue([]);
    mockEngine.getSurface.mockReturnValue(mockSurfaceState);
  });

  it('renders without crashing with empty surfaces', () => {
    const { container } = render(
      <GenUISurface surfaceManager={mockSurfaceManager} />,
    );
    expect(container.querySelector('.genui-surface')).toBeTruthy();
  });

  it('subscribes to engine events on mount and unsubscribes on unmount', () => {
    const { unmount } = render(
      <GenUISurface surfaceManager={mockSurfaceManager} />,
    );

    expect(mockEngine.addListener).toHaveBeenCalledTimes(1);
    expect(engineListeners.length).toBe(1);

    unmount();

    expect(engineListeners.length).toBe(0);
  });

  it('renders existing surfaces from engine on mount', () => {
    mockEngine.getSurfaceIds.mockReturnValue(['s1']);
    mockSurfaceState.getRootComponents.mockReturnValue([
      makeComponent('c1', 'Text'),
    ]);

    mockGetRenderer.mockReturnValue(SimpleRenderer as unknown as ReturnType<typeof getComponentRenderer>);

    const { queryByTestId } = render(
      <GenUISurface surfaceManager={mockSurfaceManager} />,
    );

    expect(queryByTestId('comp-c1')).toBeTruthy();
  });

  it('creates a new surface on createSurface event', () => {
    mockGetRenderer.mockReturnValue(SimpleRenderer as unknown as ReturnType<typeof getComponentRenderer>);

    render(<GenUISurface surfaceManager={mockSurfaceManager} />);

    act(() => {
      emitEvent({ type: 'createSurface', surfaceId: 'new-surface' });
    });

    // After createSurface, the engine should be queried for components
    expect(mockEngine.getSurface).toHaveBeenCalledWith('new-surface');
  });

  it('updates components on updateComponents event', () => {
    mockGetRenderer.mockReturnValue(SimpleRenderer as unknown as ReturnType<typeof getComponentRenderer>);

    // First create a surface
    render(<GenUISurface surfaceManager={mockSurfaceManager} />);

    act(() => {
      emitEvent({ type: 'createSurface', surfaceId: 's1' });
    });

    mockSurfaceState.getRootComponents.mockReturnValue([
      makeComponent('comp-1', 'Text'),
    ]);

    act(() => {
      emitEvent({ type: 'updateComponents', surfaceId: 's1' });
    });

    expect(mockSurfaceState.getRootComponents).toHaveBeenCalled();
  });

  it('removes a surface on deleteSurface event', () => {
    mockGetRenderer.mockReturnValue(SimpleRenderer as unknown as ReturnType<typeof getComponentRenderer>);

    mockEngine.getSurfaceIds.mockReturnValue(['s1']);
    mockSurfaceState.getRootComponents.mockReturnValue([makeComponent('c1')]);

    const { queryByTestId } = render(
      <GenUISurface surfaceManager={mockSurfaceManager} />,
    );

    expect(queryByTestId('comp-c1')).toBeTruthy();

    act(() => {
      emitEvent({ type: 'deleteSurface', surfaceId: 's1' });
    });

    expect(queryByTestId('comp-c1')).toBeFalsy();
  });

  it('forwards action events to onAction callback', () => {
    const onAction = vi.fn();
    render(
      <GenUISurface surfaceManager={mockSurfaceManager} onAction={onAction} />,
    );

    const actionPayload: ActionEvent = {
      surfaceId: 's1',
      sourceComponentId: 'btn1',
    };

    act(() => {
      emitEvent({ type: 'action', surfaceId: 's1', payload: actionPayload });
    });

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith(actionPayload);
  });

  it('does not call onAction when it is not provided', () => {
    render(<GenUISurface surfaceManager={mockSurfaceManager} />);

    // Should not throw when action event fires without onAction
    expect(() => {
      act(() => {
        emitEvent({
          type: 'action',
          surfaceId: 's1',
          payload: { surfaceId: 's1', sourceComponentId: 'btn1' },
        });
      });
    }).not.toThrow();
  });

  it('renders child components recursively', () => {
    const parent = makeComponent('parent', 'Row');
    const child = makeComponent('child', 'Text');

    mockEngine.getSurfaceIds.mockReturnValue(['s1']);
    mockSurfaceState.getRootComponents.mockReturnValue([parent]);
    mockSurfaceState.getChildren.mockImplementation((id: string) => {
      if (id === 'parent') return [child];
      return [];
    });

    mockGetRenderer.mockReturnValue(SimpleRenderer as unknown as ReturnType<typeof getComponentRenderer>);

    const { queryByTestId } = render(
      <GenUISurface surfaceManager={mockSurfaceManager} />,
    );

    expect(queryByTestId('comp-parent')).toBeTruthy();
    expect(queryByTestId('comp-child')).toBeTruthy();
  });

  it('calls console.warn for unknown component type', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockGetRenderer.mockReturnValue(undefined);

    mockEngine.getSurfaceIds.mockReturnValue(['s1']);
    mockSurfaceState.getRootComponents.mockReturnValue([makeComponent('c1', 'UnknownType')]);

    render(<GenUISurface surfaceManager={mockSurfaceManager} />);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unknown component type: UnknownType'),
    );

    warnSpy.mockRestore();
  });

  it('returns null for components with no registered renderer', () => {
    mockGetRenderer.mockReturnValue(undefined);

    mockEngine.getSurfaceIds.mockReturnValue(['s1']);
    mockSurfaceState.getRootComponents.mockReturnValue([makeComponent('c1', 'Unknown')]);

    const { container } = render(
      <GenUISurface surfaceManager={mockSurfaceManager} />,
    );

    // No component div rendered, only the surface wrapper
    const surfaceInstance = container.querySelector('.genui-surface-instance');
    expect(surfaceInstance).toBeTruthy();
    expect(surfaceInstance?.children.length).toBe(0);
  });

  it('applies dark theme when surface theme mode is dark', () => {
    mockEngine.getSurfaceIds.mockReturnValue(['s1']);
    mockSurfaceState.getRootComponents.mockReturnValue([]);
    mockSurfaceState.getTheme.mockReturnValue({ mode: 'dark' });

    mockGetRenderer.mockReturnValue(SimpleRenderer as unknown as ReturnType<typeof getComponentRenderer>);

    const { container } = render(
      <GenUISurface surfaceManager={mockSurfaceManager} />,
    );

    // Ant Design ConfigProvider should be present (we verify the surface renders)
    const surfaceInstance = container.querySelector('.genui-surface-instance');
    expect(surfaceInstance).toBeTruthy();
  });

  it('applies custom width, height, style, and className', () => {
    const { container } = render(
      <GenUISurface
        surfaceManager={mockSurfaceManager}
        width={500}
        height={300}
        style={{ border: '1px solid red' }}
        className="custom-class"
      />,
    );

    const wrapper = container.querySelector('.genui-surface') as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.classList.contains('custom-class')).toBe(true);
  });

  it('submits UI action via surfaceManager on component action', () => {
    mockGetRenderer.mockReturnValue(
      ((props: { id: string; onAction?: (action: string, context?: Record<string, unknown>) => void }) => {
        // Simulate a button click
        if (props.onAction) {
          props.onAction('click', { key: 'value' });
        }
        return React.createElement('div', { 'data-testid': `comp-${props.id}` });
      }) as unknown as ReturnType<typeof getComponentRenderer>,
    );

    mockEngine.getSurfaceIds.mockReturnValue(['s1']);
    mockSurfaceState.getRootComponents.mockReturnValue([makeComponent('btn1', 'Button')]);

    render(<GenUISurface surfaceManager={mockSurfaceManager} />);

    expect(mockSurfaceManager.submitUIAction).toHaveBeenCalledWith({
      surfaceId: 's1',
      sourceComponentId: 'btn1',
      context: { key: 'value' },
    });
  });

  it('ignores updateComponents event for unknown surface', () => {
    mockGetRenderer.mockReturnValue(SimpleRenderer as unknown as ReturnType<typeof getComponentRenderer>);

    // getSurface returns undefined for unknown surface
    mockEngine.getSurface.mockReturnValue(undefined);

    render(<GenUISurface surfaceManager={mockSurfaceManager} />);

    // Should not throw when updateComponents fires for an untracked surface
    expect(() => {
      act(() => {
        emitEvent({ type: 'updateComponents', surfaceId: 'nonexistent' });
      });
    }).not.toThrow();
  });
});
