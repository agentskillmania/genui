/**
 * GenUISurface React component.
 * Renders the full A2UI component tree for all active surfaces.
 */

import React, { useEffect, useState, useCallback } from 'react';
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

/** @deprecated Use GenUISurfaceProps */
export type AGenUISurfaceProps = GenUISurfaceProps;

interface SurfaceState {
  surfaceId: string;
  components: AGenUIComponent[];
}

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

  const renderComponent = useCallback(
    (surfaceId: string, comp: AGenUIComponent): React.ReactNode => {
      const renderer = getComponentRenderer(comp.component);
      if (!renderer) {
        console.warn(`[GenUI] Unknown component type: ${comp.component}`);
        return null;
      }

      const { id, component, child, children, action, checks, ...properties } = comp;
      const engine = surfaceManager.getEngine();
      const surface = engine.getSurface(surfaceId);
      const childComponents = surface?.getChildren(id) || [];

      // Resolve ${...} data bindings in component properties before rendering
      const resolvedProps = engine.resolveProperties(
        surfaceId,
        properties,
      ) as Record<string, unknown>;

      return (
        <React.Fragment key={id}>
          {React.createElement(renderer, {
            id,
            component,
            properties: resolvedProps,
            children: childComponents.map((childComp) => renderComponent(surfaceId, childComp)),
            onAction: (_action, context) => handleComponentAction(surfaceId, id, _action, context),
          })}
        </React.Fragment>
      );
    },
    [surfaceManager, handleComponentAction],
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

/** @deprecated Use GenUISurface */
export const AGenUISurface = GenUISurface;
