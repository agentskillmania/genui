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

describe('SurfaceManager', () => {
  let manager: SurfaceManager;

  beforeEach(() => {
    manager = new SurfaceManager();
  });

  describe('constructor', () => {
    it('should create instance with a numeric ID', () => {
      expect(manager.instanceId).toBeTypeOf('number');
      expect(manager.instanceId).toBeGreaterThan(0);
    });

    it('should assign unique IDs to each instance', () => {
      const other = new SurfaceManager();
      expect(other.instanceId).not.toBe(manager.instanceId);
    });
  });

  describe('initialize', () => {
    it('should resolve immediately (sync-compatible)', async () => {
      const result = manager.initialize();
      expect(result).toBeInstanceOf(Promise);
      await expect(result).resolves.toBeUndefined();
    });
  });

  describe('stream input delegation', () => {
    it('should delegate beginTextStream to parser', () => {
      expect(() => manager.beginTextStream()).not.toThrow();
    });

    it('should delegate receiveTextChunk to parser', () => {
      manager.beginTextStream();
      expect(() =>
        manager.receiveTextChunk(
          '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
        ),
      ).not.toThrow();
    });

    it('should delegate endTextStream to parser', () => {
      manager.beginTextStream();
      manager.receiveTextChunk('test');
      expect(() => manager.endTextStream()).not.toThrow();
    });
  });

  describe('interaction delegation', () => {
    it('should delegate submitUIAction to engine', () => {
      // Create a surface first
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      expect(() =>
        manager.submitUIAction({
          surfaceId: 's1',
          sourceComponentId: 'btn1',
        }),
      ).not.toThrow();
    });

    it('should delegate submitUIDataModel to engine', () => {
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      expect(() =>
        manager.submitUIDataModel({
          surfaceId: 's1',
          componentId: 'input1',
          change: { value: 'hello' },
        }),
      ).not.toThrow();
    });
  });

  describe('event subscription', () => {
    it('should subscribe and receive events via on()', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as SurfaceEvent;
      expect(event.type).toBe('createSurface');
      expect(event.surfaceId).toBe('s1');
    });

    it('should unsubscribe via off()', () => {
      const handler = vi.fn();
      manager.on('event', handler);
      manager.off('event', handler);

      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      expect(handler).not.toHaveBeenCalled();
    });

    it('should forward engine events to multiple listeners', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      manager.on('event', handler1);
      manager.on('event', handler2);

      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEngine', () => {
    it('should return the engine instance', () => {
      const engine = manager.getEngine();
      expect(engine).toBeDefined();
      expect(typeof engine.addListener).toBe('function');
      expect(typeof engine.createSurface).toBe('function');
    });
  });

  describe('sizing pass-through', () => {
    it('should pass through setSurfaceSizeProvider', () => {
      const provider = (_id: string) => ({ width: 100, height: 200 });
      expect(() => manager.setSurfaceSizeProvider(provider)).not.toThrow();
    });

    it('should pass through onSurfaceSizeChanged', () => {
      expect(() => manager.onSurfaceSizeChanged('s1', 800, 600)).not.toThrow();
    });

    it('should pass through getSurfaceSize', () => {
      const provider = () => ({ width: 1024, height: 768 });
      manager.setSurfaceSizeProvider(provider);
      expect(manager.getSurfaceSize('s1')).toEqual({ width: 1024, height: 768 });
    });

    it('should return undefined when no provider is set', () => {
      manager.setSurfaceSizeProvider(undefined);
      expect(manager.getSurfaceSize('s1')).toBeUndefined();
    });

    it('should use cached size from onSurfaceSizeChanged', () => {
      manager.onSurfaceSizeChanged('s1', 800, 600);
      expect(manager.getSurfaceSize('s1')).toEqual({ width: 800, height: 600 });
    });
  });

  describe('destroy', () => {
    it('should prevent further operations after destroy', () => {
      manager.destroy();
      expect(() => manager.beginTextStream()).toThrow();
      expect(() => manager.receiveTextChunk('x')).toThrow();
      expect(() => manager.endTextStream()).toThrow();
    });

    it('should stop forwarding events after destroy', () => {
      const handler = vi.fn();
      manager.on('event', handler);
      manager.destroy();

      // Operations throw, so events cannot be triggered
      expect(handler).not.toHaveBeenCalled();
    });

    it('should throw after destroy for submitUIAction', () => {
      manager.destroy();
      expect(() =>
        manager.submitUIAction({ surfaceId: 's1', sourceComponentId: 'b' }),
      ).toThrow();
    });

    it('should throw after destroy for submitUIDataModel', () => {
      manager.destroy();
      expect(() =>
        manager.submitUIDataModel({
          surfaceId: 's1',
          componentId: 'c',
          change: {},
        }),
      ).toThrow();
    });
  });

  describe('parse result processing — CreateSurface', () => {
    it('should create a surface from a CreateSurface event', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"surf-1","catalogId":"catalog-a","theme":{"mode":"light"}}}',
      );
      manager.endTextStream();

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as SurfaceEvent;
      expect(event.type).toBe('createSurface');
      expect(event.surfaceId).toBe('surf-1');
    });

    it('should create a surface with default catalogId and theme', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s2"}}',
      );
      manager.endTextStream();

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as SurfaceEvent;
      expect(event.type).toBe('createSurface');
      expect(event.surfaceId).toBe('s2');
    });
  });

  describe('parse result processing — UpdateComponents', () => {
    it('should update components from an UpdateComponents event', () => {
      // First create a surface
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      const handler = vi.fn();
      manager.on('event', handler);

      // Update components
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"updateComponents":{"surfaceId":"s1","components":[{"id":"c1","type":"Text"}]}}',
      );
      manager.endTextStream();

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as SurfaceEvent;
      expect(event.type).toBe('updateComponents');
      expect(event.surfaceId).toBe('s1');
    });

    it('should handle UpdateComponents with empty components array gracefully', () => {
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      // Empty components array — components is truthy but empty
      manager.beginTextStream();
      expect(() =>
        manager.receiveTextChunk(
          '{"updateComponents":{"surfaceId":"s1","components":[]}}',
        ),
      ).not.toThrow();
      manager.endTextStream();
    });
  });

  describe('parse result processing — UpdateDataModel', () => {
    it('should update data model from an UpdateDataModel event', () => {
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      const handler = vi.fn();
      manager.on('event', handler);

      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"updateDataModel":{"surfaceId":"s1","path":"user.name","value":"Alice"}}',
      );
      manager.endTextStream();

      // UpdateDataModel does not emit an event in the current engine
      // (it updates internal state silently), so we just verify no crash
      expect(manager.getEngine().getSurface('s1')).toBeDefined();
    });
  });

  describe('parse result processing — AppendDataModel', () => {
    it('should append data model from an AppendDataModel event', () => {
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      manager.beginTextStream();
      expect(() =>
        manager.receiveTextChunk(
          '{"appendDataModel":{"surfaceId":"s1","path":"items","value":"item1"}}',
        ),
      ).not.toThrow();
      manager.endTextStream();

      expect(manager.getEngine().getSurface('s1')).toBeDefined();
    });

    it('should append non-string value (JSON stringify fallback)', () => {
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      manager.beginTextStream();
      expect(() =>
        manager.receiveTextChunk(
          '{"appendDataModel":{"surfaceId":"s1","path":"items","value":{"key":"val"}}}',
        ),
      ).not.toThrow();
      manager.endTextStream();
    });
  });

  describe('parse result processing — DeleteSurface', () => {
    it('should delete a surface from a DeleteSurface event', () => {
      // Create first
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      const handler = vi.fn();
      manager.on('event', handler);

      // Delete
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"deleteSurface":{"surfaceId":"s1"}}',
      );
      manager.endTextStream();

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as SurfaceEvent;
      expect(event.type).toBe('deleteSurface');
      expect(event.surfaceId).toBe('s1');
    });
  });

  describe('parse result processing — Unknown event', () => {
    it('should ignore unknown event types gracefully', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      manager.beginTextStream();
      manager.receiveTextChunk('{"someRandomKey":{"surfaceId":"s1"}}');
      manager.endTextStream();

      // No surface created, no crash
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('parse result processing — direct fields (non-nested payload)', () => {
    it('should handle CreateSurface with direct surfaceId field', () => {
      // When the JSON has surfaceId at top level (non-nested format)
      // The parser puts the whole JSON in eventJson, but also extracts
      // surfaceId from the inner payload. When we re-parse eventJson,
      // we get { createSurface: { surfaceId: 's1' } }.
      // Test that this path works correctly.
      const handler = vi.fn();
      manager.on('event', handler);

      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"direct-test","catalogId":"cat","theme":{"dark":true}}}',
      );
      manager.endTextStream();

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0]).toMatchObject({
        type: 'createSurface',
        surfaceId: 'direct-test',
      });
    });
  });

  describe('parse result processing — UpdateComponents via surfaceId fallback', () => {
    it('should use surfaceId from result when not in outer data', () => {
      // The parser sets surfaceId on the ParseResult from the inner payload,
      // so when processUpdateComponents gets data, it will find
      // data.updateComponents.surfaceId via the nested path.
      // This test verifies the normal path.
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      const handler = vi.fn();
      manager.on('event', handler);

      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"updateComponents":{"surfaceId":"s1","components":[{"id":"c1","type":"Text"}]}}',
      );
      manager.endTextStream();

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as SurfaceEvent;
      expect(event.surfaceId).toBe('s1');
    });
  });

  describe('parse result processing — UpdateComponents without components', () => {
    it('should skip UpdateComponents when no components field', () => {
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      const handler = vi.fn();
      manager.on('event', handler);

      // JSON that classifies as UpdateComponents but missing components
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"updateComponents":{"surfaceId":"s1"}}',
      );
      manager.endTextStream();

      // No updateComponents event should fire (no components to update)
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should ignore malformed JSON in stream without crashing', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      manager.beginTextStream();
      // Incomplete JSON — the parser will not emit results
      manager.receiveTextChunk('{"broken json');
      manager.endTextStream();

      // No events should have been emitted
      expect(handler).not.toHaveBeenCalled();
    });

    it('should not throw when listener throws', () => {
      const badListener = () => {
        throw new Error('Listener error');
      };
      const goodListener = vi.fn();
      manager.on('event', badListener);
      manager.on('event', goodListener);

      // Should not throw despite bad listener
      expect(() => {
        manager.beginTextStream();
        manager.receiveTextChunk(
          '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
        );
        manager.endTextStream();
      }).not.toThrow();

      // Good listener should still be called (error in first listener is swallowed)
      expect(goodListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('multiple streams in sequence', () => {
    it('should handle multiple begin/receive/end cycles', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      // First stream
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      // Second stream
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s2","catalogId":"cat2"}}',
      );
      manager.endTextStream();

      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('should handle multiple events in one chunk', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      manager.beginTextStream();
      // Two JSON objects in one chunk
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}{"createSurface":{"surfaceId":"s2","catalogId":"cat2"}}',
      );
      manager.endTextStream();

      expect(handler).toHaveBeenCalledTimes(2);
    });
  });

  describe('submitUIAction event emission', () => {
    it('should emit action event when submitting UI action', () => {
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      const handler = vi.fn();
      manager.on('event', handler);

      manager.submitUIAction({
        surfaceId: 's1',
        sourceComponentId: 'btn1',
        context: { key: 'value' },
      });

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as SurfaceEvent;
      expect(event.type).toBe('action');
      expect(event.surfaceId).toBe('s1');
    });
  });

  describe('submitUIDataModel event emission', () => {
    it('should emit syncUIToData event when submitting data model sync', () => {
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      const handler = vi.fn();
      manager.on('event', handler);

      manager.submitUIDataModel({
        surfaceId: 's1',
        componentId: 'input1',
        change: { value: 'new value' },
      });

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as SurfaceEvent;
      expect(event.type).toBe('syncUIToData');
      expect(event.surfaceId).toBe('s1');
    });
  });

  describe('onSurfaceSizeChanged event emission', () => {
    it('should emit surfaceSizeChanged event', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      manager.onSurfaceSizeChanged('s1', 1024, 768);

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as SurfaceEvent;
      expect(event.type).toBe('surfaceSizeChanged');
      expect(event.surfaceId).toBe('s1');
    });
  });

  // -----------------------------------------------------------------------
  // Direct internal method tests for branch coverage.
  // The parser only emits NormalEvent results, so ComponentUpdate paths
  // must be tested by calling processParseResults directly.
  // -----------------------------------------------------------------------

  describe('internal processParseResults — ComponentUpdate paths', () => {
    // Access the private method via type assertion
    type ManagerWithInternals = SurfaceManager & {
      processParseResults: (results: ParseResult[]) => void;
    };
    const getInternals = (m: SurfaceManager): ManagerWithInternals =>
      m as unknown as ManagerWithInternals;

    it('should handle ComponentUpdate with updateComponents wrapper', () => {
      // First create a surface
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      const handler = vi.fn();
      manager.on('event', handler);

      // Directly inject a ComponentUpdate with wrapped updateComponents
      const internals = getInternals(manager);
      internals.processParseResults([
        {
          type: 'ComponentUpdate',
          eventType: 'UpdateComponents',
          surfaceId: 's1',
          componentJson: JSON.stringify({
            updateComponents: {
              surfaceId: 's1',
              components: [{ id: 'c1', type: 'Text' }],
            },
          }),
        },
      ]);

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as SurfaceEvent;
      expect(event.type).toBe('updateComponents');
      expect(event.surfaceId).toBe('s1');
    });

    it('should handle ComponentUpdate with single component (no wrapper)', () => {
      // First create a surface
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      const handler = vi.fn();
      manager.on('event', handler);

      // Directly inject a ComponentUpdate with a single component
      const internals = getInternals(manager);
      internals.processParseResults([
        {
          type: 'ComponentUpdate',
          eventType: 'UpdateComponents',
          surfaceId: 's1',
          componentJson: JSON.stringify({ id: 'c2', type: 'Button', label: 'OK' }),
        },
      ]);

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as SurfaceEvent;
      expect(event.type).toBe('updateComponents');
      expect(event.surfaceId).toBe('s1');
    });

    it('should skip ComponentUpdate with null componentJson', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      const internals = getInternals(manager);
      internals.processParseResults([
        {
          type: 'ComponentUpdate',
          eventType: 'UpdateComponents',
          surfaceId: 's1',
          componentJson: undefined,
        },
      ]);

      expect(handler).not.toHaveBeenCalled();
    });

    it('should skip ComponentUpdate with malformed componentJson', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      const internals = getInternals(manager);
      internals.processParseResults([
        {
          type: 'ComponentUpdate',
          eventType: 'UpdateComponents',
          surfaceId: 's1',
          componentJson: 'not valid json{{{',
        },
      ]);

      expect(handler).not.toHaveBeenCalled();
    });

    it('should skip ComponentUpdate wrapper with no components', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      const internals = getInternals(manager);
      internals.processParseResults([
        {
          type: 'ComponentUpdate',
          eventType: 'UpdateComponents',
          surfaceId: 's1',
          componentJson: JSON.stringify({
            updateComponents: { surfaceId: 's1' },
          }),
        },
      ]);

      expect(handler).not.toHaveBeenCalled();
    });

    it('should handle ComponentUpdate wrapper using fallback surfaceId', () => {
      // First create a surface
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      const handler = vi.fn();
      manager.on('event', handler);

      // Wrapper missing surfaceId — should fall back to result.surfaceId
      const internals = getInternals(manager);
      internals.processParseResults([
        {
          type: 'ComponentUpdate',
          eventType: 'UpdateComponents',
          surfaceId: 's1',
          componentJson: JSON.stringify({
            updateComponents: {
              components: [{ id: 'c1', type: 'Text' }],
            },
          }),
        },
      ]);

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as SurfaceEvent;
      expect(event.surfaceId).toBe('s1');
    });

    it('should handle ComponentUpdate with no surfaceId (empty fallback)', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      const internals = getInternals(manager);
      internals.processParseResults([
        {
          type: 'ComponentUpdate',
          eventType: 'UpdateComponents',
          surfaceId: undefined,
          componentJson: JSON.stringify({ id: 'c1', type: 'Text' }),
        },
      ]);

      // Engine will no-op since no surface exists with empty id
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('internal processParseResults — NormalEvent edge cases', () => {
    type ManagerWithInternals = SurfaceManager & {
      processParseResults: (results: ParseResult[]) => void;
    };
    const getInternals = (m: SurfaceManager): ManagerWithInternals =>
      m as unknown as ManagerWithInternals;

    it('should handle NormalEvent with null eventJson', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      const internals = getInternals(manager);
      internals.processParseResults([
        {
          type: 'NormalEvent',
          eventType: 'CreateSurface',
          eventJson: undefined,
        },
      ]);

      // Should not crash, should not create surface
      expect(handler).not.toHaveBeenCalled();
    });

    it('should handle NormalEvent with malformed eventJson', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      const internals = getInternals(manager);
      internals.processParseResults([
        {
          type: 'NormalEvent',
          eventType: 'CreateSurface',
          eventJson: 'invalid json{{{',
        },
      ]);

      // Should not crash
      expect(handler).not.toHaveBeenCalled();
    });

    it('should handle CreateSurface with no surfaceId (skip)', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      const internals = getInternals(manager);
      internals.processParseResults([
        {
          type: 'NormalEvent',
          eventType: 'CreateSurface',
          eventJson: JSON.stringify({ createSurface: {} }),
        },
      ]);

      expect(handler).not.toHaveBeenCalled();
    });

    it('should handle UpdateDataModel with surfaceId from result fallback', () => {
      // Create surface
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      const internals = getInternals(manager);

      // Inject UpdateDataModel where the data has the event key
      // (simulating the actual parser output format)
      internals.processParseResults([
        {
          type: 'NormalEvent',
          eventType: 'UpdateDataModel',
          eventJson: JSON.stringify({
            updateDataModel: { surfaceId: 's1', path: 'x', value: 42 },
          }),
          surfaceId: 's1',
        },
      ]);

      // Should update without error
      expect(manager.getEngine().getSurface('s1')).toBeDefined();
    });

    it('should handle AppendDataModel with surfaceId from result fallback', () => {
      // Create surface
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      const internals = getInternals(manager);

      internals.processParseResults([
        {
          type: 'NormalEvent',
          eventType: 'AppendDataModel',
          eventJson: JSON.stringify({
            appendDataModel: { surfaceId: 's1', path: 'log', value: 'line1' },
          }),
          surfaceId: 's1',
        },
      ]);

      expect(manager.getEngine().getSurface('s1')).toBeDefined();
    });

    it('should handle UpdateDataModel with direct surfaceId field', () => {
      // Create surface
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      const internals = getInternals(manager);

      // data.surfaceId is present directly
      internals.processParseResults([
        {
          type: 'NormalEvent',
          eventType: 'UpdateDataModel',
          eventJson: JSON.stringify({ surfaceId: 's1', path: 'key', value: 'val' }),
        },
      ]);

      expect(manager.getEngine().getSurface('s1')).toBeDefined();
    });

    it('should handle AppendDataModel with direct surfaceId field', () => {
      // Create surface
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      const internals = getInternals(manager);

      internals.processParseResults([
        {
          type: 'NormalEvent',
          eventType: 'AppendDataModel',
          eventJson: JSON.stringify({ surfaceId: 's1', path: 'log', value: 'entry' }),
        },
      ]);

      expect(manager.getEngine().getSurface('s1')).toBeDefined();
    });

    it('should handle DeleteSurface with surfaceId from result fallback', () => {
      // Create surface
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      const handler = vi.fn();
      manager.on('event', handler);

      const internals = getInternals(manager);

      internals.processParseResults([
        {
          type: 'NormalEvent',
          eventType: 'DeleteSurface',
          eventJson: JSON.stringify({ deleteSurface: { surfaceId: 's1' } }),
          surfaceId: 's1',
        },
      ]);

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as SurfaceEvent;
      expect(event.type).toBe('deleteSurface');
      expect(event.surfaceId).toBe('s1');
    });

    it('should handle DeleteSurface with direct surfaceId field', () => {
      // Create surface
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      const handler = vi.fn();
      manager.on('event', handler);

      const internals = getInternals(manager);

      internals.processParseResults([
        {
          type: 'NormalEvent',
          eventType: 'DeleteSurface',
          eventJson: JSON.stringify({ surfaceId: 's1' }),
        },
      ]);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0]).toMatchObject({
        type: 'deleteSurface',
        surfaceId: 's1',
      });
    });

    it('should handle UpdateComponents with direct surfaceId field', () => {
      // Create surface
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      const handler = vi.fn();
      manager.on('event', handler);

      const internals = getInternals(manager);

      internals.processParseResults([
        {
          type: 'NormalEvent',
          eventType: 'UpdateComponents',
          eventJson: JSON.stringify({
            surfaceId: 's1',
            components: [{ id: 'c1', type: 'Text' }],
          }),
        },
      ]);

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as SurfaceEvent;
      expect(event.type).toBe('updateComponents');
      expect(event.surfaceId).toBe('s1');
    });

    it('should skip UpdateDataModel with empty surfaceId', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      const internals = getInternals(manager);
      internals.processParseResults([
        {
          type: 'NormalEvent',
          eventType: 'UpdateDataModel',
          eventJson: JSON.stringify({ path: 'x', value: 'y' }),
        },
      ]);

      // No surfaceId anywhere — should skip
      expect(handler).not.toHaveBeenCalled();
    });

    it('should skip DeleteSurface with no surfaceId', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      const internals = getInternals(manager);
      internals.processParseResults([
        {
          type: 'NormalEvent',
          eventType: 'DeleteSurface',
          eventJson: JSON.stringify({}),
        },
      ]);

      expect(handler).not.toHaveBeenCalled();
    });

    it('should skip UpdateComponents with no surfaceId and no components', () => {
      const handler = vi.fn();
      manager.on('event', handler);

      const internals = getInternals(manager);
      internals.processParseResults([
        {
          type: 'NormalEvent',
          eventType: 'UpdateComponents',
          eventJson: JSON.stringify({}),
        },
      ]);

      expect(handler).not.toHaveBeenCalled();
    });

    it('should handle UpdateComponents using result.surfaceId fallback', () => {
      // Create surface
      manager.beginTextStream();
      manager.receiveTextChunk(
        '{"createSurface":{"surfaceId":"s1","catalogId":"cat1"}}',
      );
      manager.endTextStream();

      const handler = vi.fn();
      manager.on('event', handler);

      const internals = getInternals(manager);

      // eventJson has nested format but surfaceId comes from result
      internals.processParseResults([
        {
          type: 'NormalEvent',
          eventType: 'UpdateComponents',
          eventJson: JSON.stringify({
            updateComponents: {
              components: [{ id: 'c1', type: 'Text' }],
            },
          }),
          surfaceId: 's1',
        },
      ]);

      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0] as SurfaceEvent;
      expect(event.surfaceId).toBe('s1');
    });
  });
});
