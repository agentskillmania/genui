/**
 * SurfaceEngine — manages the state of all A2UI surfaces.
 *
 * Each surface owns a component tree (flat map with adjacency-list relationships
 * per A2UI v0.9: parents reference children via `child`/`children` fields),
 * a data model (JSON object with JSON Pointer-based get/set/append per RFC 6901),
 * theme configuration, and data binding resolution via A2UI v0.9 path objects
 * (`{ "path": "/pointer" }` per the official specification).
 *
 * This is a pure TypeScript engine with no React or DOM dependencies.
 */

import type {
  AGenUIComponent,
  ActionEvent,
  SyncUIToDataEvent,
  SurfaceSize,
  SurfaceSizeProvider,
  FunctionHandler,
} from '../types/sdk';
import type { SurfaceEvent, SurfaceEventListener } from './types';

/**
 * Resolver that looks up a registered function handler by name.
 * Injected into SurfaceState so it can resolve `{ call, args }` bindings
 * without depending on the Genui facade directly.
 */
export type FunctionResolver = (name: string) => FunctionHandler | undefined;

// ---------------------------------------------------------------------------
// Internal helpers: path-based access on nested objects
// ---------------------------------------------------------------------------

/**
 * Decode a single JSON Pointer (RFC 6901) reference token.
 *
 * Per RFC 6901, `~1` decodes to `/` and `~0` decodes to `~`.
 * Decode order MUST be `~1`-first then `~0`: otherwise `~01` (which
 * represents the literal string `~1`) would be mangled into `/`.
 */
function decodePointerSegment(segment: string): string {
  return segment.replace(/~1/g, '/').replace(/~0/g, '~');
}

/** Split a JSON Pointer string into decoded reference-token segments. */
function splitPointer(path: string, isAbsolute: boolean): string[] {
  const raw = isAbsolute
    ? path.split('/').filter((s) => s.length > 0)
    : path.split('/');
  return raw.map(decodePointerSegment);
}

/**
 * Walk `obj` along `segments` and return the leaf value.
 * Returns `undefined` if any intermediate segment is missing or not an object.
 */
function getByPath(obj: unknown, segments: string[]): unknown {
  let current: unknown = obj;
  for (const seg of segments) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[seg];
  }
  return current;
}

/**
 * Walk `obj` along `segments`, creating intermediate plain objects as needed,
 * and set the leaf to `value`.
 */
function setByPath(obj: Record<string, unknown>, segments: string[], value: unknown): void {
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i];
    const next = current[seg];
    // Reuse existing object if possible, otherwise create one
    if (next === null || next === undefined || typeof next !== 'object') {
      current[seg] = {};
    }
    current = current[seg] as Record<string, unknown>;
  }
  current[segments[segments.length - 1]] = value;
}

// ---------------------------------------------------------------------------
// SurfaceState — internal state container for a single surface
// ---------------------------------------------------------------------------

/** Internal state for a single surface */
export class SurfaceState {
  /** Flat map: component id -> component object */
  private components = new Map<string, AGenUIComponent>();
  /** The JSON data model for data binding */
  private dataModel: Record<string, unknown> = {};
  /** Theme configuration */
  private readonly themeConfig: Record<string, string>;
  /** Optional function resolver for `{ call, args }` data bindings */
  private readonly functionResolver?: FunctionResolver;

  /**
   * @param surfaceId   - Unique surface identifier
   * @param catalogId   - Catalog identifier for component lookup
   * @param theme       - Theme configuration key-value pairs
   * @param functionResolver - Optional resolver for FunctionCall bindings
   */
  constructor(
    public readonly surfaceId: string,
    public readonly catalogId: string,
    theme: Record<string, string>,
    functionResolver?: FunctionResolver,
  ) {
    this.themeConfig = { ...theme };
    this.functionResolver = functionResolver;
  }

  // ---- Component tree ----

  /**
   * Bulk-replace the component tree from an array of JSON strings.
   * Malformed JSON entries and components without an `id` field are silently skipped.
   * Components use the A2UI v0.9 adjacency-list model (parent references children).
   */
  updateComponents(componentsJson: string[]): void {
    for (const json of componentsJson) {
      try {
        const parsed: unknown = JSON.parse(json);
        if (
          parsed !== null &&
          typeof parsed === 'object' &&
          'id' in (parsed as Record<string, unknown>)
        ) {
          const comp = parsed as AGenUIComponent;
          this.components.set(comp.id, comp);
        }
      } catch {
        // Ignore malformed JSON — the caller may be streaming partial data
      }
    }
  }

  /**
   * Incrementally update (or insert) a single component.
   */
  updateComponent(componentJson: string): void {
    try {
      const parsed: unknown = JSON.parse(componentJson);
      if (
        parsed !== null &&
        typeof parsed === 'object' &&
        'id' in (parsed as Record<string, unknown>)
      ) {
        const comp = parsed as AGenUIComponent;
        this.components.set(comp.id, comp);
      }
    } catch {
      // Ignore malformed JSON
    }
  }

  /**
   * Returns the component with `id === "root"`, or an empty array if absent.
   * A2UI v0.9 requires exactly one root component per surface.
   */
  getRootComponents(): AGenUIComponent[] {
    const root = this.components.get('root');
    return root ? [root] : [];
  }

  /**
   * Resolve the children of a parent component using its `child` or `children` field.
   * A2UI v0.9 uses an adjacency-list model where parents reference children by ID.
   */
  getChildren(parentId: string): AGenUIComponent[] {
    const parent = this.components.get(parentId);
    if (!parent) return [];

    // Single child reference (Card, Button, Modal)
    if (parent.child) {
      const childComp = this.components.get(parent.child);
      return childComp ? [childComp] : [];
    }

    // Multiple children references
    if (parent.children) {
      if (Array.isArray(parent.children)) {
        const resolved: AGenUIComponent[] = [];
        for (const childId of parent.children) {
          const childComp = this.components.get(childId);
          if (childComp) resolved.push(childComp);
        }
        return resolved;
      }
      // Template binding — not yet supported for rendering
      return [];
    }

    return [];
  }

  // ---- Data model ----

  /**
   * Set a value at a JSON Pointer path in the data model.
   * Intermediate objects are created automatically.
   * Using '/' or '' as the path replaces the entire data model.
   */
  updateDataModel(path: string, value: unknown): void {
    if (path === '/' || path === '') {
      this.dataModel = value as Record<string, unknown>;
      return;
    }
    // JSON Pointer (RFC 6901): /user/name — split + decode ~0/~1 escapes
    const segments = splitPointer(path, true);
    setByPath(this.dataModel, segments, value);
  }

  /**
   * Append a string value at the given JSON Pointer path.
   * If the path does not exist yet, the value is set directly (no append).
   */
  appendDataModel(path: string, value: string): void {
    const segments = splitPointer(path, true);
    const existing = getByPath(this.dataModel, segments);
    if (typeof existing === 'string') {
      setByPath(this.dataModel, segments, existing + value);
    } else {
      setByPath(this.dataModel, segments, value);
    }
  }

  /**
   * Recursively resolve all A2UI v0.9 data binding expressions in a value.
   *
   * Recognizes `{ "path": "/user/name" }` objects per the official A2UI v0.9
   * specification and resolves them to the corresponding data model value.
   *
   * Plain objects (without a `path` key) and arrays are walked recursively.
   * All other types (string, number, boolean, null) are returned as-is.
   */
  resolveProperties(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.resolveProperties(item));
    }
    if (value !== null && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      // A2UI v0.9 path binding: { "path": "/pointer" }
      if ('path' in obj && typeof obj.path === 'string') {
        const path = obj.path as string;
        // Absolute pointers use RFC 6901 (~0/~1 escapes); relative dotted
        // paths (legacy) are split as-is without decoding.
        const segments = path.startsWith('/')
          ? splitPointer(path, true)
          : path.split('.');
        return getByPath(this.dataModel, segments);
      }
      // A2UI v0.9 function call binding: { "call": "name", "args": {...} }
      if ('call' in obj && typeof obj.call === 'string') {
        return this.resolveFunctionCall(obj.call, obj.args as Record<string, unknown> | undefined);
      }
      // Regular object — walk recursively
      const resolved: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(obj)) {
        resolved[key] = this.resolveProperties(val);
      }
      return resolved;
    }
    return value;
  }

  /**
   * Resolve a `{ call, args }` FunctionCall binding synchronously.
   *
   * Looks up the handler via the injected function resolver and invokes it
   * with the (recursively resolved) args. Async handlers (those accepting a
   * callback parameter) are not supported in this synchronous resolution
   * pass — the handler is expected to return a value directly. If the handler
   * appears async, a warning is emitted and `undefined` is returned.
   */
  private resolveFunctionCall(name: string, args: Record<string, unknown> | undefined): unknown {
    if (!this.functionResolver) {
      console.warn(`[GenUI] FunctionCall binding "${name}" cannot be resolved: no function resolver registered`);
      return undefined;
    }
    const handler = this.functionResolver(name);
    if (!handler) {
      console.warn(`[GenUI] FunctionCall binding "${name}" cannot be resolved: no handler registered`);
      return undefined;
    }
    const resolvedArgs = args ? (this.resolveProperties(args) as Record<string, unknown>) : {};
    // FunctionHandler is either SyncFunctionHandler (returns value) or
    // AsyncFunctionHandler (takes a callback). Sync resolution only supports
    // the former. Async handlers have arity >= 2 (params, callback); we treat
    // handler.length < 2 as sync. Async handlers emit a warning.
    if (handler.length >= 2) {
      console.warn(`[GenUI] Async function handler "${name}" is not supported in synchronous resolveProperties; returning undefined`);
      return undefined;
    }
    return (handler as (params: Record<string, unknown>) => unknown)(resolvedArgs);
  }

  // ---- Theme ----

  /** Returns a shallow copy of the theme configuration. */
  getTheme(): Record<string, string> {
    return { ...this.themeConfig };
  }
}

// ---------------------------------------------------------------------------
// SurfaceEngine — public facade
// ---------------------------------------------------------------------------

/**
 * Central engine that manages all surfaces, emits lifecycle events,
 * and coordinates between the data model and component trees.
 */
export class SurfaceEngine {
  private surfaces = new Map<string, SurfaceState>();
  private listeners = new Set<SurfaceEventListener>();
  private cachedSizes = new Map<string, SurfaceSize>();
  private sizeProvider: SurfaceSizeProvider | null = null;
  private functionResolver: FunctionResolver | null = null;

  /**
   * Set the function resolver used to evaluate `{ call, args }` bindings.
   * Applied to all subsequently created surfaces.
   */
  setFunctionResolver(resolver: FunctionResolver | null): void {
    this.functionResolver = resolver;
  }

  // ---- Surface lifecycle ----

  /**
   * Create a new surface and emit a `createSurface` event.
   * If a surface with the same id already exists it is replaced.
   */
  createSurface(
    surfaceId: string,
    catalogId: string,
    theme: Record<string, string>,
  ): void {
    const state = new SurfaceState(surfaceId, catalogId, theme, this.functionResolver ?? undefined);
    this.surfaces.set(surfaceId, state);
    this.emit({ type: 'createSurface', surfaceId });
  }

  /**
   * Delete a surface and emit a `deleteSurface` event.
   * No-op if the surface does not exist.
   */
  deleteSurface(surfaceId: string): void {
    if (!this.surfaces.has(surfaceId)) return;
    this.surfaces.delete(surfaceId);
    this.cachedSizes.delete(surfaceId);
    this.emit({ type: 'deleteSurface', surfaceId });
  }

  /**
   * Return the internal SurfaceState for direct access, or undefined.
   */
  getSurface(surfaceId: string): SurfaceState | undefined {
    return this.surfaces.get(surfaceId);
  }

  /** Return all registered surface IDs. */
  getSurfaceIds(): string[] {
    return Array.from(this.surfaces.keys());
  }

  // ---- Component updates (delegated to SurfaceState) ----

  /**
   * Bulk-update components for a surface.
   * No-op if the surface does not exist.
   */
  updateComponents(surfaceId: string, componentsJson: string[]): void {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return;
    surface.updateComponents(componentsJson);
    this.emit({ type: 'updateComponents', surfaceId, payload: componentsJson });
  }

  /**
   * Incrementally update a single component for a surface.
   * No-op if the surface does not exist.
   */
  updateComponent(surfaceId: string, componentJson: string): void {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return;
    surface.updateComponent(componentJson);
    this.emit({ type: 'updateComponents', surfaceId });
  }

  // ---- Data binding resolution ----

  /**
   * Recursively resolve all A2UI v0.9 `{ "path": "..." }` binding expressions
   * in a value using the data model of the specified surface.
   * Returns the value unchanged if the surface does not exist.
   */
  resolveProperties(surfaceId: string, value: unknown): unknown {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return value;
    return surface.resolveProperties(value);
  }

  // ---- Data model passthrough ----

  /**
   * Set a value in a surface's data model.
   * No-op if the surface does not exist.
   */
  updateDataModel(surfaceId: string, path: string, value: unknown): void {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return;
    surface.updateDataModel(path, value);
    // emit 事件，让 GenUISurface 触发重渲染，绑定 path 的组件才会取到新值
    this.emit({ type: 'updateDataModel', surfaceId, payload: { path, value } });
  }

  /**
   * Append a string value in a surface's data model.
   * No-op if the surface does not exist.
   */
  appendDataModel(surfaceId: string, path: string, value: string): void {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return;
    surface.appendDataModel(path, value);
  }

  // ---- Action & sync ----

  /**
   * Emit an `action` event for a user interaction on a component.
   * The `action` name (e.g. "drilldownCity") lets the host route different
   * interactions. No-op if the surface does not exist.
   */
  submitAction(
    surfaceId: string,
    componentId: string,
    action: string,
    context?: Record<string, unknown>,
  ): void {
    if (!this.surfaces.has(surfaceId)) return;
    const payload: ActionEvent = {
      surfaceId,
      sourceComponentId: componentId,
      action,
      context,
    };
    this.emit({ type: 'action', surfaceId, payload });
  }

  /**
   * Emit a `syncUIToData` event for a form-like value change.
   * No-op if the surface does not exist.
   */
  syncUIToData(
    surfaceId: string,
    componentId: string,
    change: Record<string, unknown>,
  ): void {
    if (!this.surfaces.has(surfaceId)) return;
    const payload: SyncUIToDataEvent = {
      surfaceId,
      componentId,
      change,
    };
    this.emit({ type: 'syncUIToData', surfaceId, payload });
  }

  // ---- Event bus ----

  /**
   * Register an event listener. Returns an unsubscribe function.
   */
  addListener(listener: SurfaceEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Remove a previously registered listener.
   */
  removeListener(listener: SurfaceEventListener): void {
    this.listeners.delete(listener);
  }

  /**
   * Emit an event to all registered listeners.
   * Errors in individual listeners are caught so they don't break others.
   */
  private emit(event: SurfaceEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch {
        // Swallow errors to keep the event bus robust
      }
    }
  }

  // ---- Sizing ----

  /**
   * Register a fallback provider that can supply sizes for surfaces
   * that don't have a cached value yet.
   */
  setSurfaceSizeProvider(provider: SurfaceSizeProvider): void {
    this.sizeProvider = provider;
  }

  /** Return the currently registered size provider, or null. */
  getSurfaceSizeProvider(): SurfaceSizeProvider | null {
    return this.sizeProvider;
  }

  /**
   * Cache a surface size and emit a `surfaceSizeChanged` event.
   */
  onSurfaceSizeChanged(surfaceId: string, size: SurfaceSize): void {
    this.cachedSizes.set(surfaceId, size);
    this.emit({ type: 'surfaceSizeChanged', surfaceId, payload: size });
  }

  /**
   * Return the cached size for a surface.
   * Falls back to the size provider if no cached value exists.
   * Returns undefined if neither is available.
   */
  getSurfaceSize(surfaceId: string): SurfaceSize | undefined {
    const cached = this.cachedSizes.get(surfaceId);
    if (cached) return cached;
    if (this.sizeProvider) {
      const provided = this.sizeProvider(surfaceId);
      if (provided) return provided;
    }
    return undefined;
  }
}
