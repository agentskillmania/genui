import { describe, it, expect } from 'vitest';
import { A2UIStreamParser } from '@/parser/A2UIStreamParser';

describe('A2UIStreamParser', () => {
  describe('event classification', () => {
    it('should classify createSurface event', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        JSON.stringify({ createSurface: { surfaceId: 's1' } })
      );
      expect(results).toHaveLength(1);
      expect(results[0].type).toBe('NormalEvent');
      expect(results[0].eventType).toBe('CreateSurface');
      expect(results[0].surfaceId).toBe('s1');
    });

    it('should classify updateComponents event', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        JSON.stringify({ updateComponents: { surfaceId: 's1', components: [] } })
      );
      expect(results).toHaveLength(1);
      expect(results[0].type).toBe('NormalEvent');
      expect(results[0].eventType).toBe('UpdateComponents');
      expect(results[0].surfaceId).toBe('s1');
    });

    it('should classify updateDataModel event', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        JSON.stringify({ updateDataModel: { surfaceId: 's1', data: {} } })
      );
      expect(results).toHaveLength(1);
      expect(results[0].type).toBe('NormalEvent');
      expect(results[0].eventType).toBe('UpdateDataModel');
    });

    it('should classify appendDataModel event', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        JSON.stringify({ appendDataModel: { surfaceId: 's1', data: [] } })
      );
      expect(results).toHaveLength(1);
      expect(results[0].type).toBe('NormalEvent');
      expect(results[0].eventType).toBe('AppendDataModel');
    });

    it('should classify deleteSurface event', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        JSON.stringify({ deleteSurface: { surfaceId: 's1' } })
      );
      expect(results).toHaveLength(1);
      expect(results[0].type).toBe('NormalEvent');
      expect(results[0].eventType).toBe('DeleteSurface');
      expect(results[0].surfaceId).toBe('s1');
    });

    it('should classify unknown event type as Unknown', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        JSON.stringify({ unknownCommand: { foo: 'bar' } })
      );
      expect(results).toHaveLength(1);
      expect(results[0].type).toBe('NormalEvent');
      expect(results[0].eventType).toBe('Unknown');
    });
  });

  describe('lifecycle', () => {
    it('should reset state on begin()', () => {
      const parser = new A2UIStreamParser();
      parser.receiveChunk('{"createSurface":{"surfaceId":"s1"}}');
      parser.begin();
      // After begin, buffer should be cleared — sending a partial should yield no results
      const results = parser.receiveChunk('{"partial":');
      expect(results).toEqual([]);
    });

    it('should reset state on end()', () => {
      const parser = new A2UIStreamParser();
      parser.receiveChunk('{"a":1}');
      parser.end();
      // After end, buffer should be cleared
      const results = parser.receiveChunk('{"incomplete":');
      expect(results).toEqual([]);
    });

    it('should have dispose as a no-op', () => {
      const parser = new A2UIStreamParser();
      // Should not throw
      expect(() => parser.dispose()).not.toThrow();
    });
  });

  describe('streaming detection', () => {
    it('should detect streaming Markdown content and emit ComponentUpdate', () => {
      const parser = new A2UIStreamParser();
      // Partial JSON with Markdown component — the content field value is incomplete
      const chunk = '{"updateComponents":{"surfaceId":"s1","components":[{"id":"c1","type":"Markdown","content":"# Hello';
      const results = parser.receiveChunk(chunk);
      // Should detect streaming Markdown and emit a ComponentUpdate
      expect(results.length).toBeGreaterThanOrEqual(1);
      const streamingResult = results.find((r) => r.type === 'ComponentUpdate');
      expect(streamingResult).toBeDefined();
      expect(streamingResult!.eventType).toBe('UpdateComponents');
      expect(streamingResult!.surfaceId).toBe('s1');
    });

    it('should detect streaming Text content and emit ComponentUpdate', () => {
      const parser = new A2UIStreamParser();
      const chunk = '{"updateComponents":{"surfaceId":"s1","components":[{"id":"c1","type":"Text","text":"Loading...';
      const results = parser.receiveChunk(chunk);
      expect(results.length).toBeGreaterThanOrEqual(1);
      const streamingResult = results.find((r) => r.type === 'ComponentUpdate');
      expect(streamingResult).toBeDefined();
      expect(streamingResult!.eventType).toBe('UpdateComponents');
    });

    it('should handle full streaming scenario: partial then complete', () => {
      const parser = new A2UIStreamParser();
      // First chunk: partial JSON
      const results1 = parser.receiveChunk(
        '{"updateComponents":{"surfaceId":"s1","components":[{"id":"c1","type":"Markdown","content":"# Hel'
      );
      // Should get a streaming ComponentUpdate
      expect(results1.some((r) => r.type === 'ComponentUpdate')).toBe(true);

      // Second chunk completes the JSON
      const results2 = parser.receiveChunk('lo"}]}}');
      // Should get the final NormalEvent for the complete JSON
      expect(results2.some((r) => r.type === 'NormalEvent')).toBe(true);
    });
  });

  describe('multiple events', () => {
    it('should parse multiple events from one chunk', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        '{"createSurface":{"surfaceId":"s1"}}{"updateComponents":{"surfaceId":"s1","components":[]}}'
      );
      expect(results).toHaveLength(2);
      expect(results[0].eventType).toBe('CreateSurface');
      expect(results[1].eventType).toBe('UpdateComponents');
    });
  });

  describe('edge cases', () => {
    it('should return empty results for empty chunk', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk('');
      expect(results).toEqual([]);
    });

    it('should ignore malformed JSON', () => {
      const parser = new A2UIStreamParser();
      // Send something that looks like complete JSON but isn't valid
      // The accumulator uses brace-depth counting; a single matched brace pair
      // with invalid content will be extracted, then JSON.parse will fail silently.
      // We verify it doesn't crash.
      const results = parser.receiveChunk('{not valid json}');
      // Should return empty or an Unknown result — either way, no crash
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle version field in parsed JSON', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        JSON.stringify({ createSurface: { surfaceId: 's1', version: '0.9' } })
      );
      expect(results[0].version).toBe('0.9');
    });

    it('should preserve eventJson for normal events', () => {
      const parser = new A2UIStreamParser();
      const json = JSON.stringify({ createSurface: { surfaceId: 's1' } });
      const results = parser.receiveChunk(json);
      expect(results[0].eventJson).toBeDefined();
    });

    it('should ignore a top-level JSON array', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk('[1,2,3]');
      // Arrays are not valid A2UI events — should be ignored
      expect(results).toEqual([]);
    });

    it('should ignore a top-level JSON primitive', () => {
      const parser = new A2UIStreamParser();
      // "42" is valid JSON but not an object — should be skipped
      const results = parser.receiveChunk('42');
      expect(results).toEqual([]);
    });

    it('should handle event with non-string surfaceId', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        JSON.stringify({ createSurface: { surfaceId: 123 } })
      );
      expect(results).toHaveLength(1);
      expect(results[0].surfaceId).toBeUndefined();
    });

    it('should handle event with non-string version', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        JSON.stringify({ createSurface: { surfaceId: 's1', version: 42 } })
      );
      expect(results).toHaveLength(1);
      expect(results[0].version).toBeUndefined();
    });
  });
});
