/**
 * SurfaceManager — orchestrates the A2UI stream parser and surface engine.
 *
 * This is the main entry point for consuming A2UI protocol streams.
 * It creates a parser (A2UIStreamParser) and engine (SurfaceEngine) in its
 * constructor (no async init), then delegates stream input to the parser,
 * processes parse results, and forwards events from the engine.
 */

import { A2UIStreamParser } from './parser/A2UIStreamParser';
import { SurfaceEngine } from './engine/SurfaceEngine';
import type {
  ParseResult,
  ActionEvent,
  SyncUIToDataEvent,
  SurfaceSize,
  SurfaceSizeProvider,
} from './types/sdk';
import type { SurfaceEvent } from './engine/types';

/** Auto-incrementing ID for each SurfaceManager instance */
let nextInstanceId = 1;

export class SurfaceManager {
  readonly instanceId: number;
  private parser: A2UIStreamParser;
  private engine: SurfaceEngine;
  private eventListeners = new Set<(event: SurfaceEvent) => void>();
  private disposed = false;

  constructor() {
    this.instanceId = nextInstanceId++;
    this.parser = new A2UIStreamParser();
    this.engine = new SurfaceEngine();

    // Forward engine events to external listeners
    this.engine.addListener((event) => {
      for (const listener of this.eventListeners) {
        try {
          listener(event);
        } catch {
          // Swallow listener errors to avoid breaking the pipeline
        }
      }
    });
  }

  /**
   * Initialize the surface manager.
   * Returns a resolved promise immediately — kept for API compatibility.
   */
  async initialize(): Promise<void> {
    // No-op: sync construction only
  }

  // ---------------------------------------------------------------------------
  // Stream input — delegate to parser
  // ---------------------------------------------------------------------------

  /**
   * Begin a new text stream session.
   * Resets the parser for a fresh stream of A2UI protocol text.
   */
  beginTextStream(): void {
    this.ensureNotDisposed();
    this.parser.begin();
  }

  /**
   * Feed a text chunk into the parser.
   * Returns the parse results and also processes them internally
   * (routes to the engine).
   */
  receiveTextChunk(data: string): void {
    this.ensureNotDisposed();
    const results = this.parser.receiveChunk(data);
    if (results.length > 0) {
      this.processParseResults(results);
    }
  }

  /**
   * End the current text stream session.
   * Resets the parser internal state.
   */
  endTextStream(): void {
    this.ensureNotDisposed();
    this.parser.end();
  }

  /**
   * Handle a single complete A2UI message object.
   *
   * This is a convenience entry point for non-streaming input: instead of
   * feeding raw text chunks, the caller passes a fully-formed A2UI message
   * (e.g. `{ version, updateComponents: {...} }`). The message is serialized
   * and run through the parser so it follows the exact same processing path
   * as streamed input.
   *
   * Accepts either a JSON string or an already-parsed object.
   */
  handleMessage(message: string | Record<string, unknown>): void {
    this.ensureNotDisposed();
    const json = typeof message === 'string' ? message : JSON.stringify(message);
    const results = this.parser.receiveChunk(json);
    if (results.length > 0) {
      this.processParseResults(results);
    }
  }

  /**
   * Feed a raw text chunk from an LLM stream into the parser.
   *
   * Alias for {@link receiveTextChunk}. The parser auto-detects JSON
   * boundaries and emits complete messages as they arrive.
   */
  handleChunk(chunk: string): void {
    this.receiveTextChunk(chunk);
  }

  // ---------------------------------------------------------------------------
  // Interaction — delegate to engine
  // ---------------------------------------------------------------------------

  /**
   * Submit a user action event (e.g. button click) to the engine.
   */
  submitUIAction(action: ActionEvent): void {
    this.ensureNotDisposed();
    this.engine.submitAction(action.surfaceId, action.sourceComponentId, action.action, action.context);
  }

  /**
   * Submit a UI-to-data sync event (e.g. form field change) to the engine.
   */
  submitUIDataModel(syncMsg: SyncUIToDataEvent): void {
    this.ensureNotDisposed();
    this.engine.syncUIToData(syncMsg.surfaceId, syncMsg.componentId, syncMsg.change);
  }

  // ---------------------------------------------------------------------------
  // Event subscription
  // ---------------------------------------------------------------------------

  /**
   * Subscribe to surface events.
   * The event parameter name is kept for API compatibility but all events
   * are forwarded regardless of the event name.
   */
  on(_event: string, handler: (event: SurfaceEvent) => void): void {
    this.eventListeners.add(handler);
  }

  /**
   * Unsubscribe from surface events.
   */
  off(_event: string, handler: (event: SurfaceEvent) => void): void {
    this.eventListeners.delete(handler);
  }

  // ---------------------------------------------------------------------------
  // Engine access
  // ---------------------------------------------------------------------------

  /**
   * Get the underlying SurfaceEngine instance.
   */
  getEngine(): SurfaceEngine {
    return this.engine;
  }

  /**
   * Set the function resolver used to evaluate `{ call, args }` data bindings
   * during property resolution. Applied to all subsequently created surfaces.
   * Pass null/undefined to clear.
   */
  setFunctionResolver(resolver: ((name: string) => unknown) | null): void {
    this.engine.setFunctionResolver(resolver as Parameters<typeof this.engine.setFunctionResolver>[0]);
  }

  // ---------------------------------------------------------------------------
  // Sizing pass-through
  // ---------------------------------------------------------------------------

  /**
   * Set the surface size provider.
   * The provider is called to resolve surface dimensions on demand.
   * Pass undefined to clear the provider.
   */
  setSurfaceSizeProvider(provider: SurfaceSizeProvider | undefined): void {
    if (provider) {
      this.engine.setSurfaceSizeProvider(provider);
    }
  }

  /**
   * Notify the engine that a surface's size has changed.
   */
  onSurfaceSizeChanged(surfaceId: string, width: number, height: number): void {
    this.engine.onSurfaceSizeChanged(surfaceId, { width, height });
  }

  /**
   * Get the current size of a surface by ID.
   */
  getSurfaceSize(surfaceId: string): SurfaceSize | undefined {
    return this.engine.getSurfaceSize(surfaceId);
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Destroy the surface manager.
   * After calling destroy, all subsequent operations will throw.
   */
  destroy(): void {
    this.disposed = true;
    this.eventListeners.clear();
  }

  // ---------------------------------------------------------------------------
  // Internal parse result processing
  // ---------------------------------------------------------------------------

  /**
   * Process an array of parse results from the parser.
   * Routes each result to the appropriate handler based on type and eventType.
   */
  private processParseResults(results: ParseResult[]): void {
    for (const result of results) {
      if (result.type === 'ComponentUpdate') {
        this.processComponentUpdate(result);
      } else {
        this.processNormalEvent(result);
      }
    }
  }

  /**
   * Process a NormalEvent parse result.
   * Dispatches based on eventType to the correct engine method.
   */
  private processNormalEvent(result: ParseResult): void {
    switch (result.eventType) {
      case 'CreateSurface': {
        const data = this.parseEventJson(result.eventJson);
        if (!data) break;
        this.processCreateSurface(data);
        break;
      }
      case 'UpdateDataModel': {
        const data = this.parseEventJson(result.eventJson);
        if (!data) break;
        this.processUpdateDataModel(data, result);
        break;
      }
      case 'AppendDataModel': {
        const data = this.parseEventJson(result.eventJson);
        if (!data) break;
        this.processAppendDataModel(data, result);
        break;
      }
      case 'UpdateComponents': {
        const data = this.parseEventJson(result.eventJson);
        if (!data) break;
        this.processUpdateComponents(data, result);
        break;
      }
      case 'DeleteSurface': {
        const data = this.parseEventJson(result.eventJson);
        if (!data) break;
        this.processDeleteSurface(data, result);
        break;
      }
      default:
        // Unknown event type — ignore
        break;
    }
  }

  /**
   * Handle CreateSurface: extract surfaceId, catalogId, theme from payload.
   * The parser's EVENT_TYPE_MAP wraps the event under a top-level key
   * (e.g. { createSurface: { surfaceId, catalogId, theme } }).
   * The eventJson contains the full original JSON string.
   */
  private processCreateSurface(data: Record<string, unknown>): void {
    // Try direct fields first
    let surfaceId = data.surfaceId as string | undefined;
    let catalogId = data.catalogId as string | undefined;
    let theme = data.theme as Record<string, string> | undefined;

    // Check if the payload is nested under the event key
    if (!surfaceId && data.createSurface) {
      const inner = data.createSurface as Record<string, unknown>;
      surfaceId = inner.surfaceId as string | undefined;
      catalogId = inner.catalogId as string | undefined;
      theme = inner.theme as Record<string, string> | undefined;
    }

    if (!surfaceId) return;
    this.engine.createSurface(surfaceId, catalogId ?? '', theme ?? {});
  }

  /**
   * Handle UpdateDataModel: extract surfaceId, path, value.
   */
  private processUpdateDataModel(
    data: Record<string, unknown>,
    result: ParseResult,
  ): void {
    let surfaceId = data.surfaceId as string | undefined;
    let path = data.path as string | undefined;
    let value: unknown = data.value;

    if (!surfaceId && data.updateDataModel) {
      const inner = data.updateDataModel as Record<string, unknown>;
      surfaceId = inner.surfaceId as string | undefined;
      path = inner.path as string | undefined;
      value = inner.value;
    }

    surfaceId = surfaceId ?? result.surfaceId ?? '';
    if (!surfaceId) return;
    this.engine.updateDataModel(surfaceId, path ?? '', value);
  }

  /**
   * Handle AppendDataModel: extract surfaceId, path, value.
   */
  private processAppendDataModel(
    data: Record<string, unknown>,
    result: ParseResult,
  ): void {
    let surfaceId = data.surfaceId as string | undefined;
    let path = data.path as string | undefined;
    let value = data.value as unknown;

    if (!surfaceId && data.appendDataModel) {
      const inner = data.appendDataModel as Record<string, unknown>;
      surfaceId = inner.surfaceId as string | undefined;
      path = inner.path as string | undefined;
      value = inner.value;
    }

    surfaceId = surfaceId ?? result.surfaceId ?? '';
    if (!surfaceId) return;
    // Engine expects string value for append
    this.engine.appendDataModel(surfaceId, path ?? '', typeof value === 'string' ? value : JSON.stringify(value));
  }

  /**
   * Handle UpdateComponents: extract surfaceId and components array.
   */
  private processUpdateComponents(
    data: Record<string, unknown>,
    result: ParseResult,
  ): void {
    let surfaceId = data.surfaceId as string | undefined;
    let components = data.components as unknown[] | undefined;

    if (!surfaceId && data.updateComponents) {
      const inner = data.updateComponents as Record<string, unknown>;
      surfaceId = inner.surfaceId as string | undefined;
      components = inner.components as unknown[] | undefined;
    }

    surfaceId = surfaceId ?? result.surfaceId ?? '';
    if (!surfaceId || !components) return;

    // Engine expects string[] for updateComponents
    const componentsJson = components.map((c) => JSON.stringify(c));
    this.engine.updateComponents(surfaceId, componentsJson);
  }

  /**
   * Handle DeleteSurface: extract surfaceId.
   */
  private processDeleteSurface(
    data: Record<string, unknown>,
    result: ParseResult,
  ): void {
    let surfaceId = data.surfaceId as string | undefined;

    if (!surfaceId && data.deleteSurface) {
      const inner = data.deleteSurface as Record<string, unknown>;
      surfaceId = inner.surfaceId as string | undefined;
    }

    surfaceId = surfaceId ?? result.surfaceId ?? '';
    if (!surfaceId) return;
    this.engine.deleteSurface(surfaceId);
  }

  /**
   * Process a ComponentUpdate parse result.
   * If the update contains a wrapper with updateComponents, re-route as a
   * normal UpdateComponents event. Otherwise, treat it as a single component update.
   */
  private processComponentUpdate(result: ParseResult): void {
    const componentJson = this.parseEventJson(result.componentJson);
    if (!componentJson) return;

    const surfaceId = result.surfaceId ?? '';

    // Check if this is a wrapped updateComponents event
    if ('updateComponents' in componentJson) {
      const wrapper = componentJson.updateComponents as Record<string, unknown>;
      const sid = (wrapper?.surfaceId as string) ?? surfaceId;
      const components = wrapper?.components as unknown[];
      if (components) {
        const componentsJson = components.map((c) => JSON.stringify(c));
        this.engine.updateComponents(sid, componentsJson);
      }
    } else {
      // Single component update
      this.engine.updateComponent(surfaceId, JSON.stringify(componentJson));
    }
  }

  /**
   * Safely parse eventJson string into an object.
   * Returns null on parse failure.
   */
  private parseEventJson(json: string | undefined): Record<string, unknown> | null {
    if (!json) return null;
    try {
      return JSON.parse(json) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  /**
   * Guard: throw if the manager has been disposed.
   */
  private ensureNotDisposed(): void {
    if (this.disposed) {
      throw new Error('SurfaceManager has been disposed');
    }
  }
}
