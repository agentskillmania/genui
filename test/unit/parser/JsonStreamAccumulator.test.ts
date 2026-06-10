import { describe, it, expect } from 'vitest';
import { JsonStreamAccumulator } from '@/parser/JsonStreamAccumulator';

describe('JsonStreamAccumulator', () => {
  describe('append + extractCompleteJson', () => {
    it('should extract a single complete JSON object from one chunk', () => {
      const acc = new JsonStreamAccumulator();
      acc.append('{"key":"value"}');
      const results = acc.extractCompleteJson();
      expect(results).toEqual(['{"key":"value"}']);
    });

    it('should extract multiple JSON objects from one chunk', () => {
      const acc = new JsonStreamAccumulator();
      acc.append('{"a":1}{"b":2}');
      const results = acc.extractCompleteJson();
      expect(results).toEqual(['{"a":1}', '{"b":2}']);
    });

    it('should extract a JSON object split across 2 chunks', () => {
      const acc = new JsonStreamAccumulator();
      acc.append('{"key":');
      expect(acc.extractCompleteJson()).toEqual([]);
      acc.append('"value"}');
      const results = acc.extractCompleteJson();
      expect(results).toEqual(['{"key":"value"}']);
    });

    it('should extract a JSON object split across 5+ chunks', () => {
      const acc = new JsonStreamAccumulator();
      acc.append('{');
      acc.append('"na');
      acc.append('me":');
      acc.append('"Jo');
      acc.append('hn"}');
      const results = acc.extractCompleteJson();
      expect(results).toEqual(['{"name":"John"}']);
    });

    it('should handle nested objects with braces in string values', () => {
      const acc = new JsonStreamAccumulator();
      // Braces inside a string value should not affect depth counting
      acc.append('{"text":"hello {world}","num":1}');
      const results = acc.extractCompleteJson();
      expect(results).toEqual(['{"text":"hello {world}","num":1}']);
    });

    it('should handle escaped quotes in strings', () => {
      const acc = new JsonStreamAccumulator();
      acc.append('{"text":"he said \\"hello\\"","num":1}');
      const results = acc.extractCompleteJson();
      expect(results).toEqual(['{"text":"he said \\"hello\\"","num":1}']);
    });

    it('should handle escaped backslashes before quotes', () => {
      const acc = new JsonStreamAccumulator();
      // \\" means a literal backslash then closing quote
      acc.append('{"text":"path\\\\","num":1}');
      const results = acc.extractCompleteJson();
      expect(results).toEqual(['{"text":"path\\\\","num":1}']);
    });

    it('should return empty array for empty chunks', () => {
      const acc = new JsonStreamAccumulator();
      acc.append('');
      expect(acc.extractCompleteJson()).toEqual([]);
    });

    it('should return empty array when no complete JSON is available', () => {
      const acc = new JsonStreamAccumulator();
      acc.append('{"incomplete":');
      expect(acc.extractCompleteJson()).toEqual([]);
    });

    it('should handle deeply nested JSON', () => {
      const acc = new JsonStreamAccumulator();
      acc.append('{"a":{"b":{"c":{}}}}');
      const results = acc.extractCompleteJson();
      expect(results).toEqual(['{"a":{"b":{"c":{}}}}']);
    });

    it('should extract complete JSON and keep incomplete remainder', () => {
      const acc = new JsonStreamAccumulator();
      acc.append('{"a":1}{"incomplete');
      const results = acc.extractCompleteJson();
      expect(results).toEqual(['{"a":1}']);
      expect(acc.getPending()).toBe('{"incomplete');
    });

    it('should handle whitespace between JSON objects', () => {
      const acc = new JsonStreamAccumulator();
      acc.append('  {"a":1}  {"b":2}  ');
      const results = acc.extractCompleteJson();
      expect(results).toEqual(['{"a":1}', '{"b":2}']);
    });

    it('should handle JSON arrays as top-level values', () => {
      const acc = new JsonStreamAccumulator();
      // The accumulator tracks brace/bracket depth; arrays use brackets
      // Top-level arrays should also be detected
      acc.append('[1,2,3]');
      const results = acc.extractCompleteJson();
      expect(results).toEqual(['[1,2,3]']);
    });

    it('should handle JSON with mixed braces and brackets', () => {
      const acc = new JsonStreamAccumulator();
      acc.append('{"arr":[1,{"x":2}]}');
      const results = acc.extractCompleteJson();
      expect(results).toEqual(['{"arr":[1,{"x":2}]}']);
    });

    it('should handle multiple extractions in sequence', () => {
      const acc = new JsonStreamAccumulator();
      acc.append('{"a":1}');
      expect(acc.extractCompleteJson()).toEqual(['{"a":1}']);
      acc.append('{"b":2}');
      expect(acc.extractCompleteJson()).toEqual(['{"b":2}']);
    });

    it('should handle escaped characters inside strings correctly', () => {
      const acc = new JsonStreamAccumulator();
      // String with tab and newline escapes
      acc.append('{"text":"line1\\nline2\\ttab"}');
      const results = acc.extractCompleteJson();
      expect(results).toEqual(['{"text":"line1\\nline2\\ttab"}']);
    });
  });

  describe('getPending', () => {
    it('should return empty string when buffer is empty', () => {
      const acc = new JsonStreamAccumulator();
      expect(acc.getPending()).toBe('');
    });

    it('should return incomplete buffer tail', () => {
      const acc = new JsonStreamAccumulator();
      acc.append('{"partial":true');
      expect(acc.getPending()).toBe('{"partial":true');
    });

    it('should return empty string after extracting all complete JSON', () => {
      const acc = new JsonStreamAccumulator();
      acc.append('{"a":1}');
      acc.extractCompleteJson();
      expect(acc.getPending()).toBe('');
    });
  });

  describe('reset', () => {
    it('should clear the buffer completely', () => {
      const acc = new JsonStreamAccumulator();
      acc.append('{"some":"data"}');
      acc.reset();
      expect(acc.getPending()).toBe('');
      expect(acc.extractCompleteJson()).toEqual([]);
    });
  });

  describe('top-level strings and whitespace', () => {
    it('should skip top-level strings (not object/array)', () => {
      const acc = new JsonStreamAccumulator();
      // A top-level JSON string should be skipped, not treated as a boundary
      acc.append('"hello world"');
      // No object/array detected, so nothing extracted
      expect(acc.extractCompleteJson()).toEqual([]);
    });

    it('should handle top-level string followed by an object', () => {
      const acc = new JsonStreamAccumulator();
      acc.append('"prefix"{"key":"value"}');
      const results = acc.extractCompleteJson();
      expect(results).toEqual(['{"key":"value"}']);
    });

    it('should handle whitespace-only buffer', () => {
      const acc = new JsonStreamAccumulator();
      acc.append('   ');
      expect(acc.extractCompleteJson()).toEqual([]);
      expect(acc.getPending()).toBe('   ');
    });
  });
});
