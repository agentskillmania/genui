import { describe, it, expect } from 'vitest';
import { A2UIStreamParser } from '@/parser/A2UIStreamParser';

describe('A2UIStreamParser', () => {
  describe('event classification', () => {
    it('should classify createSurface event', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        JSON.stringify({ createSurface: { surfaceId: 's1' } }),
      );
      expect(results).toHaveLength(1);
      expect(results[0].type).toBe('NormalEvent');
      expect(results[0].eventType).toBe('CreateSurface');
      expect(results[0].surfaceId).toBe('s1');
    });

    it('should classify updateComponents event', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        JSON.stringify({ updateComponents: { surfaceId: 's1', components: [] } }),
      );
      expect(results).toHaveLength(1);
      expect(results[0].type).toBe('NormalEvent');
      expect(results[0].eventType).toBe('UpdateComponents');
      expect(results[0].surfaceId).toBe('s1');
    });

    it('should classify updateDataModel event', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        JSON.stringify({ updateDataModel: { surfaceId: 's1', data: {} } }),
      );
      expect(results).toHaveLength(1);
      expect(results[0].type).toBe('NormalEvent');
      expect(results[0].eventType).toBe('UpdateDataModel');
    });

    it('should classify appendDataModel event', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        JSON.stringify({ appendDataModel: { surfaceId: 's1', data: [] } }),
      );
      expect(results).toHaveLength(1);
      expect(results[0].type).toBe('NormalEvent');
      expect(results[0].eventType).toBe('AppendDataModel');
    });

    it('should classify deleteSurface event', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        JSON.stringify({ deleteSurface: { surfaceId: 's1' } }),
      );
      expect(results).toHaveLength(1);
      expect(results[0].type).toBe('NormalEvent');
      expect(results[0].eventType).toBe('DeleteSurface');
      expect(results[0].surfaceId).toBe('s1');
    });

    it('should classify unknown event type as Unknown', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        JSON.stringify({ unknownCommand: { foo: 'bar' } }),
      );
      expect(results).toHaveLength(1);
      expect(results[0].type).toBe('NormalEvent');
      expect(results[0].eventType).toBe('Unknown');
    });
  });

  describe('lifecycle', () => {
    it('should reset buffer on begin()', () => {
      const parser = new A2UIStreamParser();
      parser.receiveChunk('{"createSurface":{"surfaceId":"s1"}}');
      parser.begin();
      // After begin, buffer is cleared — a partial JSON yields no results
      const results = parser.receiveChunk('{"partial":');
      expect(results).toEqual([]);
    });

    it('should reset buffer on end()', () => {
      const parser = new A2UIStreamParser();
      parser.receiveChunk('{"a":1}');
      parser.end();
      // After end, buffer is cleared
      const results = parser.receiveChunk('{"incomplete":');
      expect(results).toEqual([]);
    });

    it('dispose should return void without error', () => {
      const parser = new A2UIStreamParser();
      // Dispose is a no-op — verify it returns undefined (void)
      const result = parser.dispose();
      expect(result).toBeUndefined();
    });
  });

  describe('streaming detection', () => {
    it('should detect streaming Markdown content and emit ComponentUpdate', () => {
      const parser = new A2UIStreamParser();
      const chunk =
        '{"updateComponents":{"surfaceId":"s1","components":[{"id":"c1","type":"Markdown","content":"# Hello';
      const results = parser.receiveChunk(chunk);

      const streamingResult = results.find((r) => r.type === 'ComponentUpdate');
      expect(streamingResult).toBeDefined();
      expect(streamingResult!.eventType).toBe('UpdateComponents');
      expect(streamingResult!.surfaceId).toBe('s1');
      // Verify the componentJson contains the partial Markdown content
      const parsed = JSON.parse(streamingResult!.componentJson!);
      expect(parsed.component).toBe('Markdown');
      expect(parsed.content).toBe('# Hello');
    });

    it('should detect streaming Text content and emit ComponentUpdate', () => {
      const parser = new A2UIStreamParser();
      const chunk =
        '{"updateComponents":{"surfaceId":"s1","components":[{"id":"c1","type":"Text","text":"Loading...';
      const results = parser.receiveChunk(chunk);

      const streamingResult = results.find((r) => r.type === 'ComponentUpdate');
      expect(streamingResult).toBeDefined();
      expect(streamingResult!.eventType).toBe('UpdateComponents');
      expect(streamingResult!.surfaceId).toBe('s1');
      const parsed = JSON.parse(streamingResult!.componentJson!);
      expect(parsed.component).toBe('Text');
      expect(parsed.text).toBe('Loading...');
    });

    it('should handle full streaming scenario: partial then complete', () => {
      const parser = new A2UIStreamParser();
      // First chunk: partial JSON with streaming Markdown
      const results1 = parser.receiveChunk(
        '{"updateComponents":{"surfaceId":"s1","components":[{"id":"c1","type":"Markdown","content":"# Hel',
      );

      const streamingEvents = results1.filter((r) => r.type === 'ComponentUpdate');
      expect(streamingEvents).toHaveLength(1);

      // Second chunk completes the JSON
      const results2 = parser.receiveChunk('lo"}]}}');

      const normalEvents = results2.filter((r) => r.type === 'NormalEvent');
      expect(normalEvents).toHaveLength(1);
      expect(normalEvents[0].eventType).toBe('UpdateComponents');
      expect(normalEvents[0].surfaceId).toBe('s1');
    });
  });

  describe('multiple events', () => {
    it('should parse multiple events from one chunk', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        '{"createSurface":{"surfaceId":"s1"}}{"updateComponents":{"surfaceId":"s1","components":[]}}',
      );
      expect(results).toHaveLength(2);
      expect(results[0].eventType).toBe('CreateSurface');
      expect(results[1].eventType).toBe('UpdateComponents');
    });
  });

  describe('edge cases', () => {
    it('should return empty array for empty chunk', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk('');
      expect(results).toEqual([]);
    });

    it('should silently ignore malformed JSON', () => {
      const parser = new A2UIStreamParser();
      // Brace-matched but invalid content — JSON.parse will fail silently
      const results = parser.receiveChunk('{not valid json}');
      // Should return empty (malformed JSON is swallowed) or Unknown
      expect(results.every((r) => r.eventType === 'Unknown')).toBe(true);
    });

    it('should extract version field from parsed JSON', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        JSON.stringify({ createSurface: { surfaceId: 's1', version: '0.9' } }),
      );
      expect(results[0].version).toBe('0.9');
    });

    it('should include raw eventJson string for normal events', () => {
      const parser = new A2UIStreamParser();
      const json = JSON.stringify({ createSurface: { surfaceId: 's1' } });
      const results = parser.receiveChunk(json);
      expect(results[0].eventJson).toBe(json);
    });

    it('should ignore a top-level JSON array', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk('[1,2,3]');
      // Arrays are not valid A2UI events — ignored
      expect(results).toEqual([]);
    });

    it('should ignore a top-level JSON primitive', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk('42');
      expect(results).toEqual([]);
    });

    it('should handle event with non-string surfaceId (set to undefined)', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        JSON.stringify({ createSurface: { surfaceId: 123 } }),
      );
      expect(results).toHaveLength(1);
      expect(results[0].surfaceId).toBeUndefined();
    });

    it('should handle event with non-string version (set to undefined)', () => {
      const parser = new A2UIStreamParser();
      const results = parser.receiveChunk(
        JSON.stringify({ createSurface: { surfaceId: 's1', version: 42 } }),
      );
      expect(results).toHaveLength(1);
      expect(results[0].version).toBeUndefined();
    });
  });
});
