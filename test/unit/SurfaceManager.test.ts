import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SurfaceManager } from '@/SurfaceManager';
import type { SurfaceEvent } from '@/engine/types';
import type { ParseResult } from '@/types/sdk';

/**
 * The A2UI stream parser uses a wire format where events are keyed by
 * their type name, e.g. { createSurface: { surfaceId, ... } }.
 * The parser's EVENT_TYPE_MAP classifies them and the SurfaceManager
 * receives the full JSON in eventJson, which it re-parses to extract
 * the nested payload.
 */

// ---------- helpers ----------

/** Feed a single complete JSON event through a fresh stream cycle */
function feedEvent(manager: SurfaceManager, json: string): void {
  manager.beginTextStream();
  manager.receiveTextChunk(json);
  manager.endTextStream();
}

/** Feed multiple JSON events in one stream cycle */
function feedEvents(manager: SurfaceManager, ...jsons: string[]): void {
  manager.beginTextStream();
  for (const json of jsons) {
    manager.receiveTextChunk(json);
  }
  manager.endTextStream();
}

/** Capture events from the manager and return a typed accessor */
function captureEvents(manager: SurfaceManager) {
  const events: SurfaceEvent[] = [];
  const handler = (e: SurfaceEvent) => events.push(e);
  manager.on('event', handler);
  return {
    events,
    /** Find the first event matching a type */
    find(type: SurfaceEvent['type']): SurfaceEvent | undefined {
      return events.find((e) => e.type === type);
    },
    /** Filter events by type */
    filter(type: SurfaceEvent['type']): SurfaceEvent[] {
      return events.filter((e) => e.type === type);
    },
  };
}

// Reusable JSON payloads
const CREATE_SURFACE = (id = 's1', catalog = 'cat1') =>
  JSON.stringify({ version: 'v0.9', createSurface: { surfaceId: id, catalogId: catalog } });

const DELETE_SURFACE = (id = 's1') =>
  JSON.stringify({ version: 'v0.9', deleteSurface: { surfaceId: id } });

const UPDATE_COMPONENTS = (id = 's1', components: Record<string, unknown>[] = [{ id: 'c1', component: 'Text', text: 'hello' }]) =>
  JSON.stringify({ version: 'v0.9', updateComponents: { surfaceId: id, components } });

const UPDATE_DATA_MODEL = (id = 's1', path = '/user/name', value: unknown = 'Alice') =>
  JSON.stringify({ version: 'v0.9', updateDataModel: { surfaceId: id, path, value } });

const APPEND_DATA_MODEL = (id = 's1', path = '/log', value: string = 'entry') =>
  JSON.stringify({ version: 'v0.9', appendDataModel: { surfaceId: id, path, value } });

// ---------- Tests ----------

describe('SurfaceManager', () => {
  let manager: SurfaceManager;

  beforeEach(() => {
    manager = new SurfaceManager();
  });

  // ---- Constructor ----

  describe('constructor', () => {
    it('should create instance with a numeric ID greater than zero', () => {
      expect(manager.instanceId).toBeTypeOf('number');
      expect(manager.instanceId).toBeGreaterThan(0);
    });

    it('should assign unique IDs to each instance', () => {
      const other = new SurfaceManager();
      expect(other.instanceId).not.toBe(manager.instanceId);
    });

    it('should expose a working engine via getEngine', () => {
      const engine = manager.getEngine();
      // Engine should be functional — create a surface and verify it's stored
      engine.createSurface('test-s', 'cat', {});
      expect(engine.getSurfaceIds()).toEqual(['test-s']);
    });
  });

  // ---- Initialize ----

  describe('initialize', () => {
    it('should resolve immediately with undefined (sync-compatible)', async () => {
      const result = manager.initialize();
      expect(result).toBeInstanceOf(Promise);
      await expect(result).resolves.toBeUndefined();
    });
  });

  // ---- Stream input ----

  describe('stream input — CreateSurface', () => {
    it('should emit createSurface event when receiving a CreateSurface JSON', () => {
      const cap = captureEvents(manager);
      feedEvent(manager, CREATE_SURFACE('surf-1'));

      const event = cap.find('createSurface');
      expect(event).toBeDefined();
      expect(event!.surfaceId).toBe('surf-1');
    });

    it('should store the surface in the engine with correct catalogId', () => {
      feedEvent(manager, CREATE_SURFACE('s1', 'my-catalog'));

      const surface = manager.getEngine().getSurface('s1');
      expect(surface).toBeDefined();
      expect(surface!.catalogId).toBe('my-catalog');
    });

    it('should store the surface with default catalogId and theme when omitted', () => {
      feedEvent(manager, JSON.stringify({ version: 'v0.9', createSurface: { surfaceId: 's2' } }));

      const surface = manager.getEngine().getSurface('s2');
      expect(surface).toBeDefined();
      expect(surface!.catalogId).toBe('');
      expect(surface!.getTheme()).toEqual({});
    });

    it('should store theme configuration from the event', () => {
      feedEvent(
        manager,
        JSON.stringify({
          version: 'v0.9',
          createSurface: {
            surfaceId: 's3',
            catalogId: 'cat',
            theme: { mode: 'dark', primary: '#000' },
          },
        }),
      );

      const surface = manager.getEngine().getSurface('s3');
      expect(surface!.getTheme()).toEqual({ mode: 'dark', primary: '#000' });
    });
  });

  // ---- Stream input — UpdateComponents ----

  describe('stream input — UpdateComponents', () => {
    it('should emit updateComponents event and store components in the engine', () => {
      feedEvent(manager, CREATE_SURFACE('s1'));

      const cap = captureEvents(manager);
      feedEvent(
        manager,
        UPDATE_COMPONENTS('s1', [
          { id: 'root', component: 'Column', children: ['c1', 'c2'] },
          { id: 'c1', component: 'Text', text: 'hello' },
          { id: 'c2', component: 'Button', label: 'OK' },
        ]),
      );

      const event = cap.find('updateComponents');
      expect(event).toBeDefined();
      expect(event!.surfaceId).toBe('s1');

      // Verify components are stored in the engine
      const surface = manager.getEngine().getSurface('s1')!;
      const roots = surface.getRootComponents();
      expect(roots).toHaveLength(1);
      expect(roots[0].id).toBe('root');
      const children = surface.getChildren('root');
      expect(children).toHaveLength(2);
      expect(children[0].id).toBe('c1');
      expect(children[0].text).toBe('hello');
      expect(children[1].id).toBe('c2');
      expect(children[1].label).toBe('OK');
    });

    it('should handle empty components array without error', () => {
      feedEvent(manager, CREATE_SURFACE('s1'));

      const cap = captureEvents(manager);
      feedEvent(manager, UPDATE_COMPONENTS('s1', []));

      // Empty components is still a valid update
      const event = cap.find('updateComponents');
      expect(event).toBeDefined();
    });

    it('should skip UpdateComponents when no components field is present', () => {
      feedEvent(manager, CREATE_SURFACE('s1'));

      const cap = captureEvents(manager);
      feedEvent(manager, JSON.stringify({ version: 'v0.9', updateComponents: { surfaceId: 's1' } }));

      // No components to update — engine should not emit
      expect(cap.find('updateComponents')).toBeUndefined();
    });

    it('should ignore UpdateComponents for a non-existent surface', () => {
      const cap = captureEvents(manager);
      feedEvent(
        manager,
        UPDATE_COMPONENTS('no-such-surface', [{ id: 'c1', component: 'Text' }]),
      );

      // Engine no-ops for unknown surface
      expect(cap.events).toHaveLength(0);
    });
  });

  // ---- Stream input — UpdateDataModel ----

  describe('stream input — UpdateDataModel', () => {
    it('should write the value into the surface data model', () => {
      feedEvent(manager, CREATE_SURFACE('s1'));
      feedEvent(manager, UPDATE_DATA_MODEL('s1', '/user/name', 'Alice'));

      const surface = manager.getEngine().getSurface('s1')!;
      expect(surface.resolveProperties({ path: '/user/name' })).toBe('Alice');
    });

    it('should update nested paths correctly', () => {
      feedEvent(manager, CREATE_SURFACE('s1'));
      feedEvent(manager, UPDATE_DATA_MODEL('s1', '/a/b/c', 'deep'));

      const surface = manager.getEngine().getSurface('s1')!;
      expect(surface.resolveProperties({ path: '/a/b/c' })).toBe('deep');
    });

    it('should handle non-string values (numbers, objects)', () => {
      feedEvent(manager, CREATE_SURFACE('s1'));
      feedEvent(manager, UPDATE_DATA_MODEL('s1', '/count', 42));

      const surface = manager.getEngine().getSurface('s1')!;
      expect(surface.resolveProperties({ path: '/count' })).toBe(42);
    });

    it('should ignore UpdateDataModel for a non-existent surface', () => {
      // No surface created — this should be a silent no-op
      const cap = captureEvents(manager);
      feedEvent(manager, UPDATE_DATA_MODEL('nope', '/key', 'val'));

      expect(cap.events).toHaveLength(0);
    });
  });

  // ---- Stream input — AppendDataModel ----

  describe('stream input — AppendDataModel', () => {
    it('should append string value to existing path', () => {
      feedEvent(manager, CREATE_SURFACE('s1'));
      feedEvent(manager, UPDATE_DATA_MODEL('s1', '/log', 'line1'));
      feedEvent(manager, APPEND_DATA_MODEL('s1', '/log', 'line2'));

      const surface = manager.getEngine().getSurface('s1')!;
      expect(surface.resolveProperties({ path: '/log' })).toBe('line1line2');
    });

    it('should set value directly when path does not exist yet', () => {
      feedEvent(manager, CREATE_SURFACE('s1'));
      feedEvent(manager, APPEND_DATA_MODEL('s1', '/fresh', 'initial'));

      const surface = manager.getEngine().getSurface('s1')!;
      expect(surface.resolveProperties({ path: '/fresh' })).toBe('initial');
    });

    it('should JSON-stringify non-string values', () => {
      feedEvent(manager, CREATE_SURFACE('s1'));
      feedEvent(
        manager,
        JSON.stringify({
          version: 'v0.9',
          appendDataModel: { surfaceId: 's1', path: '/items', value: { key: 'val' } },
        }),
      );

      const surface = manager.getEngine().getSurface('s1')!;
      // Non-string value gets JSON.stringify'd then appended
      expect(surface.resolveProperties({ path: '/items' })).toBe('{"key":"val"}');
    });

    it('should ignore AppendDataModel for a non-existent surface', () => {
      const cap = captureEvents(manager);
      feedEvent(manager, APPEND_DATA_MODEL('nope'));

      expect(cap.events).toHaveLength(0);
    });
  });

  // ---- Stream input — DeleteSurface ----

  describe('stream input — DeleteSurface', () => {
    it('should emit deleteSurface event and remove the surface from the engine', () => {
      feedEvent(manager, CREATE_SURFACE('s1'));

      const cap = captureEvents(manager);
      feedEvent(manager, DELETE_SURFACE('s1'));

      const event = cap.find('deleteSurface');
      expect(event).toBeDefined();
      expect(event!.surfaceId).toBe('s1');
      expect(manager.getEngine().getSurface('s1')).toBeUndefined();
    });

    it('should not emit when deleting a non-existent surface', () => {
      const cap = captureEvents(manager);
      feedEvent(manager, DELETE_SURFACE('nope'));

      expect(cap.events).toHaveLength(0);
    });
  });

  // ---- Unknown events ----

  describe('stream input — unknown events', () => {
    it('should ignore unknown event types without crashing', () => {
      const cap = captureEvents(manager);
      feedEvent(manager, JSON.stringify({ version: 'v0.9', someRandomKey: { surfaceId: 's1' } }));

      expect(cap.events).toHaveLength(0);
      expect(manager.getEngine().getSurfaceIds()).toEqual([]);
    });
  });

  // ---- Malformed input ----

  describe('stream input — malformed input', () => {
    it('should ignore malformed JSON in stream without emitting events', () => {
      const cap = captureEvents(manager);

      manager.beginTextStream();
      manager.receiveTextChunk('{"broken json');
      manager.endTextStream();

      expect(cap.events).toHaveLength(0);
    });

    it('should handle a mixture of valid and invalid data gracefully', () => {
      const cap = captureEvents(manager);

      manager.beginTextStream();
      manager.receiveTextChunk(CREATE_SURFACE('s1'));
      manager.receiveTextChunk('not-json');
      manager.receiveTextChunk(UPDATE_COMPONENTS('s1'));
      manager.endTextStream();

      // Valid events should still be processed
      expect(cap.find('createSurface')).toBeDefined();
      expect(cap.find('updateComponents')).toBeDefined();
    });
  });

  // ---- Event subscription ----

  describe('event subscription', () => {
    it('should subscribe and receive events via on()', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      feedEvent(manager, CREATE_SURFACE('s1'));

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as SurfaceEvent;
      expect(event.type).toBe('createSurface');
      expect(event.surfaceId).toBe('s1');
    });

    it('should unsubscribe via off()', () => {
      const handler = vi.fn();
      manager.on('event', handler);
      manager.off('event', handler);

      feedEvent(manager, CREATE_SURFACE('s1'));

      expect(handler).not.toHaveBeenCalled();
    });

    it('should forward engine events to multiple listeners', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      manager.on('event', handler1);
      manager.on('event', handler2);

      feedEvent(manager, CREATE_SURFACE('s1'));

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should not break when a listener throws — other listeners still receive events', () => {
      const badListener = () => {
        throw new Error('Listener error');
      };
      const goodListener = vi.fn();
      manager.on('event', badListener);
      manager.on('event', goodListener);

      expect(() => {
        feedEvent(manager, CREATE_SURFACE('s1'));
      }).not.toThrow();

      expect(goodListener).toHaveBeenCalledTimes(1);
    });
  });

  // ---- Interaction delegation ----

  describe('submitUIAction', () => {
    it('should emit action event with correct surfaceId and componentId', () => {
      feedEvent(manager, CREATE_SURFACE('s1'));

      const cap = captureEvents(manager);
      manager.submitUIAction({
        surfaceId: 's1',
        sourceComponentId: 'btn1',
        context: { key: 'value' },
      });

      const event = cap.find('action');
      expect(event).toBeDefined();
      expect(event!.surfaceId).toBe('s1');
      expect(event!.payload).toEqual({
        surfaceId: 's1',
        sourceComponentId: 'btn1',
        context: { key: 'value' },
      });
    });
  });

  describe('submitUIDataModel', () => {
    it('should emit syncUIToData event with correct payload', () => {
      feedEvent(manager, CREATE_SURFACE('s1'));

      const cap = captureEvents(manager);
      manager.submitUIDataModel({
        surfaceId: 's1',
        componentId: 'input1',
        change: { value: 'new value' },
      });

      const event = cap.find('syncUIToData');
      expect(event).toBeDefined();
      expect(event!.surfaceId).toBe('s1');
      expect(event!.payload).toEqual({
        surfaceId: 's1',
        componentId: 'input1',
        change: { value: 'new value' },
      });
    });
  });

  // ---- Sizing pass-through ----

  describe('sizing pass-through', () => {
    it('should cache size from onSurfaceSizeChanged and return it from getSurfaceSize', () => {
      manager.onSurfaceSizeChanged('s1', 800, 600);
      expect(manager.getSurfaceSize('s1')).toEqual({ width: 800, height: 600 });
    });

    it('should use provider when no cached size exists', () => {
      manager.setSurfaceSizeProvider(() => ({ width: 1024, height: 768 }));
      expect(manager.getSurfaceSize('s1')).toEqual({ width: 1024, height: 768 });
    });

    it('should prefer cached size over provider', () => {
      manager.setSurfaceSizeProvider(() => ({ width: 100, height: 200 }));
      manager.onSurfaceSizeChanged('s1', 800, 600);
      expect(manager.getSurfaceSize('s1')).toEqual({ width: 800, height: 600 });
    });

    it('should return undefined when no provider or cache', () => {
      manager.setSurfaceSizeProvider(undefined);
      expect(manager.getSurfaceSize('s1')).toBeUndefined();
    });

    it('should emit surfaceSizeChanged event when size changes', () => {
      const cap = captureEvents(manager);
      manager.onSurfaceSizeChanged('s1', 1024, 768);

      const event = cap.find('surfaceSizeChanged');
      expect(event).toBeDefined();
      expect(event!.surfaceId).toBe('s1');
      expect(event!.payload).toEqual({ width: 1024, height: 768 });
    });
  });

  // ---- Destroy ----

  describe('destroy', () => {
    it('should prevent stream operations after destroy', () => {
      manager.destroy();
      expect(() => manager.beginTextStream()).toThrow('SurfaceManager has been disposed');
      expect(() => manager.receiveTextChunk('x')).toThrow('SurfaceManager has been disposed');
      expect(() => manager.endTextStream()).toThrow('SurfaceManager has been disposed');
    });

    it('should prevent interaction operations after destroy', () => {
      manager.destroy();
      expect(() =>
        manager.submitUIAction({ surfaceId: 's1', sourceComponentId: 'b' }),
      ).toThrow('SurfaceManager has been disposed');
      expect(() =>
        manager.submitUIDataModel({ surfaceId: 's1', componentId: 'c', change: {} }),
      ).toThrow('SurfaceManager has been disposed');
    });
  });

  // ---- Multiple streams / multiple events ----

  describe('multiple streams in sequence', () => {
    it('should handle multiple begin/receive/end cycles', () => {
      const cap = captureEvents(manager);

      feedEvent(manager, CREATE_SURFACE('s1'));
      feedEvent(manager, CREATE_SURFACE('s2'));

      expect(cap.filter('createSurface')).toHaveLength(2);
      expect(cap.events[0].surfaceId).toBe('s1');
      expect(cap.events[1].surfaceId).toBe('s2');
    });

    it('should handle multiple events in one chunk', () => {
      const cap = captureEvents(manager);

      manager.beginTextStream();
      manager.receiveTextChunk(CREATE_SURFACE('s1') + CREATE_SURFACE('s2'));
      manager.endTextStream();

      expect(cap.filter('createSurface')).toHaveLength(2);
    });
  });

  // ---- ComponentUpdate via streaming plugins ----
  // These tests exercise the ComponentUpdate path through the public API
  // by sending partial Markdown/Text JSON that triggers streaming detection.

  describe('ComponentUpdate via streaming detection', () => {
    it('should process streaming Markdown content as ComponentUpdate', () => {
      feedEvent(manager, CREATE_SURFACE('s1'));

      const cap = captureEvents(manager);

      // Send partial Markdown — triggers streaming ComponentUpdate
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"version":"v0.9","updateComponents":{"surfaceId":"s1","components":[{"id":"c1","component":"Markdown","content":"# Hel',
      );

      // Should have received at least one ComponentUpdate
      const streamingEvent = cap.find('updateComponents');
      expect(streamingEvent).toBeDefined();
      expect(streamingEvent!.surfaceId).toBe('s1');

      // Complete the JSON
      manager.receiveTextChunk('lo"}]}}');
      manager.endTextStream();

      // Should have another updateComponents event from the complete JSON
      expect(cap.filter('updateComponents').length).toBeGreaterThanOrEqual(2);
    });

    it('should process streaming Text content as ComponentUpdate', () => {
      feedEvent(manager, CREATE_SURFACE('s1'));

      const cap = captureEvents(manager);

      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"version":"v0.9","updateComponents":{"surfaceId":"s1","components":[{"id":"c1","component":"Text","text":"Loading...',
      );

      const streamingEvent = cap.find('updateComponents');
      expect(streamingEvent).toBeDefined();
      expect(streamingEvent!.surfaceId).toBe('s1');

      manager.endTextStream();
    });
  });

  // ---- Direct surfaceId resolution paths ----
  // These test the different ways SurfaceManager resolves surfaceId from JSON.
  // All use the public stream API — no private method access.

  describe('surfaceId resolution — nested vs direct format', () => {
    it('should handle CreateSurface with nested payload format', () => {
      feedEvent(
        manager,
        JSON.stringify({
          version: 'v0.9',
          createSurface: { surfaceId: 'nested-s', catalogId: 'cat', theme: { dark: true } },
        }),
      );

      const surface = manager.getEngine().getSurface('nested-s');
      expect(surface).toBeDefined();
      expect(surface!.catalogId).toBe('cat');
      expect(surface!.getTheme()).toEqual({ dark: true });
    });

    it('should handle UpdateDataModel with nested payload (event-key format)', () => {
      feedEvent(manager, CREATE_SURFACE('s1'));

      // The actual wire format: { updateDataModel: { surfaceId, path, value } }
      feedEvent(
        manager,
        JSON.stringify({ version: 'v0.9', updateDataModel: { surfaceId: 's1', path: '/x', value: 42 } }),
      );

      expect(manager.getEngine().getSurface('s1')!.resolveProperties({ path: '/x' })).toBe(42);
    });

    it('should handle AppendDataModel with nested payload format', () => {
      feedEvent(manager, CREATE_SURFACE('s1'));
      feedEvent(
        manager,
        JSON.stringify({ version: 'v0.9', appendDataModel: { surfaceId: 's1', path: '/log', value: 'line1' } }),
      );

      expect(manager.getEngine().getSurface('s1')!.resolveProperties({ path: '/log' })).toBe('line1');
    });

    it('should handle UpdateComponents with nested payload format', () => {
      feedEvent(manager, CREATE_SURFACE('s1'));

      feedEvent(
        manager,
        JSON.stringify({
          version: 'v0.9',
          updateComponents: {
            surfaceId: 's1',
            components: [
              { id: 'root', component: 'Column', children: ['c1'] },
              { id: 'c1', component: 'Text', text: 'via-nested' },
            ],
          },
        }),
      );

      const surface = manager.getEngine().getSurface('s1')!;
      expect(surface.getRootComponents()).toHaveLength(1);
      expect(surface.getRootComponents()[0].id).toBe('root');
      const children = surface.getChildren('root');
      expect(children).toHaveLength(1);
      expect(children[0].text).toBe('via-nested');
    });

    it('should skip CreateSurface when no surfaceId is present', () => {
      feedEvent(manager, JSON.stringify({ version: 'v0.9', createSurface: {} }));

      expect(manager.getEngine().getSurfaceIds()).toEqual([]);
    });

    it('should skip UpdateDataModel when no surfaceId is present anywhere', () => {
      const cap = captureEvents(manager);
      feedEvent(manager, JSON.stringify({ version: 'v0.9', updateDataModel: { path: '/x', value: 'y' } }));

      expect(cap.events).toHaveLength(0);
    });

    it('should skip UpdateComponents when no surfaceId and no components', () => {
      const cap = captureEvents(manager);
      feedEvent(manager, JSON.stringify({ version: 'v0.9', updateComponents: {} }));

      expect(cap.events).toHaveLength(0);
    });

    it('should skip DeleteSurface when no surfaceId is present', () => {
      const cap = captureEvents(manager);
      feedEvent(manager, JSON.stringify({ version: 'v0.9', deleteSurface: {} }));

      expect(cap.events).toHaveLength(0);
    });
  });

  // handleMessage / handleChunk —— README 示例使用的便捷入口，
  // 与 receiveTextStream 系列走同一条解析路径。
  describe('handleMessage / handleChunk aliases', () => {
    it('handleMessage accepts a complete A2UI object and routes it like a stream chunk', () => {
      const cap = captureEvents(manager);

      manager.handleMessage({
        version: 'v0.9',
        createSurface: { surfaceId: 's1', catalogId: 'cat1' },
      });

      const event = cap.find('createSurface');
      expect(event).toBeDefined();
      expect(event?.surfaceId).toBe('s1');
    });

    it('handleMessage also accepts a JSON string', () => {
      const cap = captureEvents(manager);

      manager.handleMessage(CREATE_SURFACE('s2', 'cat2'));

      const event = cap.find('createSurface');
      expect(event).toBeDefined();
      expect(event?.surfaceId).toBe('s2');
    });

    it('handleChunk feeds raw stream text through the parser (alias for receiveTextChunk)', () => {
      const cap = captureEvents(manager);

      manager.handleChunk(CREATE_SURFACE('s3'));

      const event = cap.find('createSurface');
      expect(event).toBeDefined();
      expect(event?.surfaceId).toBe('s3');
    });

    it('handleMessage processes UpdateComponents end-to-end', () => {
      const cap = captureEvents(manager);

      // surface must exist before UpdateComponents will emit
      manager.handleMessage({
        version: 'v0.9',
        createSurface: { surfaceId: 's4', catalogId: 'cat1' },
      });
      manager.handleMessage({
        version: 'v0.9',
        updateComponents: {
          surfaceId: 's4',
          components: [{ id: 'c1', component: 'Text', text: 'hello' }],
        },
      });

      const event = cap.find('updateComponents');
      expect(event).toBeDefined();
      expect(event?.surfaceId).toBe('s4');
    });

    it('should throw if handleMessage called after dispose', () => {
      manager.destroy();
      expect(() => manager.handleMessage({ version: 'v0.9' })).toThrow('disposed');
      expect(() => manager.handleChunk('{}')).toThrow('disposed');
    });
  });
});
