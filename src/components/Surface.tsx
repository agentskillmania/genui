/**
 * GenUISurface React component.
 * Renders the full A2UI component tree for all active surfaces.
 */

import React, { useEffect, useState, useCallback, memo } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import type { SurfaceManager } from "../SurfaceManager";
import type { SurfaceEvent } from "../engine/types";
import type { AGenUIComponent, ActionEvent } from "../types/sdk";
import { getComponentRenderer } from "./registry";
import { GenuiError } from "./GenuiError";
import { createErrorComponent } from "../engine/surfaceError";

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
 * Look up a cached callback by `${surfaceId}:${componentId}`, creating and
 * storing it via `factory` on first access. Shared by the action and sync
 * callback caches so React.memo sees stable callback references.
 */
function getOrCreateCallback<T>(
  cache: Map<string, T>,
  surfaceId: string,
  componentId: string,
  factory: () => T,
): T {
  const cacheKey = `${surfaceId}:${componentId}`;
  let cb = cache.get(cacheKey);
  if (!cb) {
    cb = factory();
    cache.set(cacheKey, cb);
  }
  return cb;
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
  /** 上报输入组件的值变化（ChoicePicker/TextField/Slider 等），触发 engine.syncUIToData */
  onSyncState: (change: Record<string, unknown>) => void;
  renderChild: (surfaceId: string, comp: AGenUIComponent) => React.ReactNode;
}

/**
 * Memoized renderer for a single component node.
 *
 * Skips re-render when `resolvedProperties`, `childrenComps`, `childTypes`,
 * `comp`, `onAction`, `onSyncState`, or `renderChild` are referentially unchanged — which is
 * the common case when only one surface's data model changed.
 */
const SurfaceComponentNode = memo<SurfaceComponentNodeProps>(
  ({
    comp,
    childrenComps,
    resolvedProperties,
    childTypes,
    onAction,
    onSyncState,
    renderChild,
    surfaceId,
  }) => {
    const renderer = getComponentRenderer(comp.component);
    if (!renderer) {
      console.warn(`[GenUI] Unknown component type: ${comp.component}`);
      // Never collapse to an empty subtree — render a visible error card
      return (
        <React.Fragment key={comp.id}>
          <GenuiError
            id={`__genui_error__${comp.id}`}
            component="GenuiError"
            properties={{
              message: `Unknown component type: "${comp.component}"`,
              description: `Component "${comp.id}" uses type "${comp.component}", which is not registered in this GenUI build. Check the component catalog allowlist.`,
            }}
          />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment key={comp.id}>
        {React.createElement(renderer, {
          id: comp.id,
          component: comp.component,
          properties: resolvedProperties,
          children: childrenComps.map((childComp) =>
            renderChild(surfaceId, childComp),
          ),
          childTypes,
          onAction,
          onSyncState,
        })}
      </React.Fragment>
    );
  },
);
SurfaceComponentNode.displayName = "SurfaceComponentNode";

export const GenUISurface: React.FC<GenUISurfaceProps> = ({
  surfaceManager,
  width = "100%",
  height = "100%",
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

  // G5: per-component callback caches. Declared early (before handleEvent)
  // so the deleteSurface handler can purge entries when a surface is torn
  // down, preventing unbounded growth across surface create/delete cycles.
  const actionCallbackCache = React.useRef<
    Map<string, (action: string, context?: Record<string, unknown>) => void>
  >(new Map());
  const syncCallbackCache = React.useRef<
    Map<string, (change: Record<string, unknown>) => void>
  >(new Map());

  /** Remove all cached callbacks belonging to a surface (G5 leak fix). */
  const purgeSurfaceCallbacks = useCallback((surfaceId: string) => {
    const prefix = `${surfaceId}:`;
    for (const key of actionCallbackCache.current.keys()) {
      if (key.startsWith(prefix)) actionCallbackCache.current.delete(key);
    }
    for (const key of syncCallbackCache.current.keys()) {
      if (key.startsWith(prefix)) syncCallbackCache.current.delete(key);
    }
  }, []);

  /**
   * Re-snapshot a surface's root components into state. Shared by
   * updateComponents and updateDataModel — both need a fresh component
   * array (and a new object reference) to trigger a re-render.
   */
  const refreshSurfaceComponents = useCallback(
    (surfaceId: string) => {
      const engine = surfaceManager.getEngine();
      const surface = engine.getSurface(surfaceId);
      if (surface) {
        setSurfaces((prev) => {
          const next = new Map(prev);
          next.set(surfaceId, {
            surfaceId,
            components: surface.getRootComponents(),
          });
          return next;
        });
      }
    },
    [surfaceManager],
  );

  const handleEvent = useCallback(
    (event: SurfaceEvent) => {
      switch (event.type) {
        case "createSurface": {
          setSurfaces((prev) => {
            const next = new Map(prev);
            next.set(event.surfaceId, {
              surfaceId: event.surfaceId,
              components: [],
            });
            return next;
          });
          break;
        }
        case "updateComponents": {
          refreshSurfaceComponents(event.surfaceId);
          break;
        }
        case "updateDataModel": {
          // dataModel 变了 → 触发重渲染，让组件重新解析 path 绑定取新值。
          // 组件树结构不变，用新的对象引用触发 setSurfaces 即可。
          refreshSurfaceComponents(event.surfaceId);
          break;
        }
        case "deleteSurface": {
          setSurfaces((prev) => {
            const next = new Map(prev);
            next.delete(event.surfaceId);
            return next;
          });
          // G5: purge per-component callback cache entries for this surface
          // so the refs don't accumulate stale closures across a long session
          // of surface create/delete.
          purgeSurfaceCallbacks(event.surfaceId);
          break;
        }
        case "action":
          onAction?.(event.payload as ActionEvent);
          break;
      }
    },
    [
      surfaceManager,
      onAction,
      purgeSurfaceCallbacks,
      refreshSurfaceComponents,
    ],
  );

  useEffect(() => {
    const unsubscribe = surfaceManager.getEngine().addListener(handleEvent);
    return () => unsubscribe();
  }, [surfaceManager, handleEvent]);

  const handleComponentAction = useCallback(
    (
      surfaceId: string,
      componentId: string,
      action: string,
      context?: Record<string, unknown>,
    ) => {
      surfaceManager.submitUIAction({
        surfaceId,
        sourceComponentId: componentId,
        action,
        context,
      });
    },
    [surfaceManager],
  );

  /** 输入组件值变化 → engine.syncUIToData（触发 syncUIToData 事件，宿主可监听） */
  const handleComponentSync = useCallback(
    (
      surfaceId: string,
      componentId: string,
      change: Record<string, unknown>,
    ) => {
      const engine = surfaceManager.getEngine();
      engine.syncUIToData(surfaceId, componentId, change);
    },
    [surfaceManager],
  );

  const getThemeMode = useCallback(
    (surfaceId: string): "light" | "dark" | undefined => {
      const engine = surfaceManager.getEngine();
      const surface = engine.getSurface(surfaceId);
      if (surface) {
        const theme = surface.getTheme();
        return theme?.mode as "light" | "dark" | undefined;
      }
      return undefined;
    },
    [surfaceManager],
  );

  const getActionCallback = useCallback(
    (surfaceId: string, componentId: string) =>
      getOrCreateCallback(
        actionCallbackCache.current,
        surfaceId,
        componentId,
        () =>
          (action: string, context?: Record<string, unknown>) =>
            handleComponentAction(surfaceId, componentId, action, context),
      ),
    [handleComponentAction],
  );

  const getSyncCallback = useCallback(
    (surfaceId: string, componentId: string) =>
      getOrCreateCallback(
        syncCallbackCache.current,
        surfaceId,
        componentId,
        () =>
          (change: Record<string, unknown>) =>
            handleComponentSync(surfaceId, componentId, change),
      ),
    [handleComponentSync],
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
          onSyncState={getSyncCallback(surfaceId, id)}
          renderChild={renderComponent}
        />
      );
    },
    [surfaceManager, getActionCallback, getSyncCallback],
  );

  /**
   * A surface exists but `getRootComponents()` is empty. Distinguish
   * "stream has not delivered any components yet" (waiting placeholder)
   * from "components arrived but none has id 'root'" (hard error card).
   */
  const renderSurfaceBody = useCallback(
    (surfaceId: string, components: AGenUIComponent[]): React.ReactNode => {
      if (components.length > 0) {
        return components.map((component) => renderComponent(surfaceId, component));
      }

      const surfaceState = surfaceManager.getEngine().getSurface(surfaceId);
      if (surfaceState?.hasReceivedComponents()) {
        const ids = surfaceState.getComponentIds();
        const errorComp = createErrorComponent(
          `__genui_error__root_${surfaceId}`,
          'No root component found on this surface',
          `A2UI requires exactly one component with id "root" per surface. Received ${ids.length} component(s) [${ids
            .slice(0, 8)
            .map((id) => `"${id}"`)
            .join(', ')}${ids.length > 8 ? ', …' : ''}] but none has id "root". Rename the tree entry component id to "root".`,
        );
        return (
          <GenuiError
            id={errorComp.id}
            component={errorComp.component}
            properties={{
              message: errorComp.message,
              description: errorComp.description,
              severity: errorComp.severity,
            }}
          />
        );
      }

      return (
        <div
          style={{
            border: '1px dashed #d9d9d9',
            borderRadius: 8,
            padding: '16px 24px',
            color: '#999',
            fontSize: 13,
          }}
        >
          Waiting for A2UI data… If you expected content here, make sure a
          createSurface message is sent for surface &quot;{surfaceId}&quot;
          before updateComponents/updateDataModel — updates for unknown
          surfaces are dropped.
        </div>
      );
    },
    [renderComponent, surfaceManager],
  );

  const containerStyle: React.CSSProperties = {
    width,
    height,
    overflow: "auto",
    ...style,
  };

  return (
    <div className={`genui-surface ${className || ""}`} style={containerStyle}>
      {surfaces.size === 0 ? (
        <div
          style={{
            border: '1px dashed #d9d9d9',
            borderRadius: 8,
            padding: '16px 24px',
            color: '#999',
            fontSize: 13,
          }}
        >
          No A2UI surface yet. Send a createSurface message, then
          updateComponents / updateDataModel — updates targeting a surface that
          was never created are dropped by the engine.
        </div>
      ) : (
        Array.from(surfaces.values()).map((surface) => {
          const mode = getThemeMode(surface.surfaceId);
          const antdThemeConfig = {
            algorithm: [
              antdTheme.compactAlgorithm,
              ...(mode === "dark" ? [antdTheme.darkAlgorithm] : []),
            ],
          };

          return (
            <ConfigProvider key={surface.surfaceId} theme={antdThemeConfig}>
              <div className="genui-surface-instance">
                {renderSurfaceBody(surface.surfaceId, surface.components)}
              </div>
            </ConfigProvider>
          );
        })
      )}
    </div>
  );
};

GenUISurface.displayName = "GenUISurface";
