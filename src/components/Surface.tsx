/**
 * GenUISurface React component.
 * Renders the full A2UI component tree for all active surfaces.
 */

import React, { useEffect, useState, useCallback, memo } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import type { SurfaceManager } from '../SurfaceManager';
import type { SurfaceEvent } from '../engine/types';
import type { AGenUIComponent, ActionEvent } from '../types/sdk';
import { getComponentRenderer } from './registry';

export interface GenUISurfaceProps {
  surfaceManager: SurfaceManager;
  width?: number | string;
  height?: number | string;
  onAction?: (action: ActionEvent) => void;
  onInteractionStatus?: (type: number, content: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

interface SurfaceState {
  surfaceId: string;
  components: AGenUIComponent[];
}

/**
 * Props for a single memoized component node in the rendered tree.
 *
 * `onAction` is keyed by component id so each node receives a stable callback
 * reference — this is what lets React.memo skip re-renders for siblings whose
 * resolved props/children did not change.
 */
interface SurfaceComponentNodeProps {
  surfaceId: string;
  comp: AGenUIComponent;
  /** Snapshot of this node's children (already resolved from the engine). */
  childrenComps: AGenUIComponent[];
  /** Resolved properties (data bindings already substituted). */
  resolvedProperties: Record<string, unknown>;
  childTypes: string[];
  onAction: (action: string, context?: Record<string, unknown>) => void;
  renderChild: (surfaceId: string, comp: AGenUIComponent) => React.ReactNode;
}

/**
 * Memoized renderer for a single component node.
 *
 * Skips re-render when `resolvedProperties`, `childrenComps`, `childTypes`,
 * `comp`, `onAction`, or `renderChild` are referentially unchanged — which is
 * the common case when only one surface's data model changed.
 */
const SurfaceComponentNode = memo<SurfaceComponentNodeProps>(
  ({ comp, childrenComps, resolvedProperties, childTypes, onAction, renderChild, surfaceId }) => {
    const renderer = getComponentRenderer(comp.component);
    if (!renderer) {
      console.warn(`[GenUI] Unknown component type: ${comp.component}`);
      return null;
    }

    return (
      <React.Fragment key={comp.id}>
        {React.createElement(renderer, {
          id: comp.id,
          component: comp.component,
          properties: resolvedProperties,
          children: childrenComps.map((childComp) => renderChild(surfaceId, childComp)),
          childTypes,
          onAction,
        })}
      </React.Fragment>
    );
  },
);
SurfaceComponentNode.displayName = 'SurfaceComponentNode';

export const GenUISurface: React.FC<GenUISurfaceProps> = ({
  surfaceManager,
  width = '100%',
  height = '100%',
  onAction,
  onInteractionStatus: _onInteractionStatus,
  style,
  className,
}) => {
  const [surfaces, setSurfaces] = useState<Map<string, SurfaceState>>(() => {
    // Synchronously snapshot existing surfaces on mount
    const engine = surfaceManager.getEngine();
    const initial = new Map<string, SurfaceState>();
    for (const surfaceId of engine.getSurfaceIds()) {
      const surface = engine.getSurface(surfaceId);
      if (surface) {
        initial.set(surfaceId, {
          surfaceId,
          components: surface.getRootComponents(),
        });
      }
    }
    return initial;
  });

  const handleEvent = useCallback(
    (event: SurfaceEvent) => {
      switch (event.type) {
        case 'createSurface': {
          setSurfaces((prev) => {
            const next = new Map(prev);
            next.set(event.surfaceId, { surfaceId: event.surfaceId, components: [] });
            return next;
          });
          break;
        }
        case 'updateComponents': {
          const engine = surfaceManager.getEngine();
          const surface = engine.getSurface(event.surfaceId);
          if (surface) {
            setSurfaces((prev) => {
              const next = new Map(prev);
              next.set(event.surfaceId, {
                surfaceId: event.surfaceId,
                components: surface.getRootComponents(),
              });
              return next;
            });
          }
          break;
        }
        case 'deleteSurface': {
          setSurfaces((prev) => {
            const next = new Map(prev);
            next.delete(event.surfaceId);
            return next;
          });
          break;
        }
        case 'action':
          onAction?.(event.payload as ActionEvent);
          break;
      }
    },
    [surfaceManager, onAction],
  );

  useEffect(() => {
    const unsubscribe = surfaceManager.getEngine().addListener(handleEvent);
    return () => unsubscribe();
  }, [surfaceManager, handleEvent]);

  const handleComponentAction = useCallback(
    (surfaceId: string, componentId: string, _action: string, context?: Record<string, unknown>) => {
      surfaceManager.submitUIAction({
        surfaceId,
        sourceComponentId: componentId,
        context,
      });
    },
    [surfaceManager],
  );

  const getThemeMode = useCallback(
    (surfaceId: string): 'light' | 'dark' | undefined => {
      const engine = surfaceManager.getEngine();
      const surface = engine.getSurface(surfaceId);
      if (surface) {
        const theme = surface.getTheme();
        return theme?.mode as 'light' | 'dark' | undefined;
      }
      return undefined;
    },
    [surfaceManager],
  );

  // Cache of per-component-id action callbacks. Each node gets a stable
  // callback keyed by its id, so React.memo can skip unchanged siblings.
  const actionCallbackCache = React.useRef<Map<string, (action: string, context?: Record<string, unknown>) => void>>(new Map());

  const getActionCallback = useCallback(
    (surfaceId: string, componentId: string) => {
      const cacheKey = `${surfaceId}:${componentId}`;
      let cb = actionCallbackCache.current.get(cacheKey);
      if (!cb) {
        cb = (action: string, context?: Record<string, unknown>) =>
          handleComponentAction(surfaceId, componentId, action, context);
        actionCallbackCache.current.set(cacheKey, cb);
      }
      return cb;
    },
    [handleComponentAction],
  );

  const renderComponent = useCallback(
    (surfaceId: string, comp: AGenUIComponent): React.ReactNode => {
      const { id, child, children, action, checks, ...properties } = comp;
      const engine = surfaceManager.getEngine();
      const surface = engine.getSurface(surfaceId);
      const childComponents = surface?.getChildren(id) || [];

      // Resolve A2UI v0.9 data bindings in component properties
      const resolvedProps = engine.resolveProperties(
        surfaceId,
        properties,
      ) as Record<string, unknown>;

      const childTypes = childComponents.map((c) => c.component);

      return (
        <SurfaceComponentNode
          key={id}
          surfaceId={surfaceId}
          comp={comp}
          childrenComps={childComponents}
          resolvedProperties={resolvedProps}
          childTypes={childTypes}
          onAction={getActionCallback(surfaceId, id)}
          renderChild={renderComponent}
        />
      );
    },
    [surfaceManager, getActionCallback],
  );

  const containerStyle: React.CSSProperties = {
    width,
    height,
    overflow: 'auto',
    ...style,
  };

  return (
    <div className={`genui-surface ${className || ''}`} style={containerStyle}>
      {Array.from(surfaces.values()).map((surface) => {
        const mode = getThemeMode(surface.surfaceId);
        const antdThemeConfig = mode === 'dark'
          ? { algorithm: antdTheme.darkAlgorithm }
          : undefined;

        return (
          <ConfigProvider key={surface.surfaceId} theme={antdThemeConfig}>
            <div className="genui-surface-instance">
              {surface.components.map((component) => renderComponent(surface.surfaceId, component))}
            </div>
          </ConfigProvider>
        );
      })}
    </div>
  );
};

GenUISurface.displayName = 'GenUISurface';
