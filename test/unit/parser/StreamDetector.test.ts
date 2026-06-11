import { describe, it, expect } from 'vitest';
import { StreamDetector } from '@/parser/StreamDetector';

describe('StreamDetector', () => {
  describe('detectStreamingContent', () => {
    it('should return null for empty string', () => {
      const detector = new StreamDetector();
      expect(detector.detectStreamingContent('')).toBeNull();
    });

    it('should return null for very short strings', () => {
      const detector = new StreamDetector();
      expect(detector.detectStreamingContent('{}')).toBeNull();
    });

    it('should return null when no surfaceId is present', () => {
      const detector = new StreamDetector();
      expect(
        detector.detectStreamingContent('{"type":"Markdown","content":"hello'),
      ).toBeNull();
    });

    it('should return null when no recognized component type is present', () => {
      const detector = new StreamDetector();
      expect(
        detector.detectStreamingContent('{"surfaceId":"s1","type":"Button","label":"cli'),
      ).toBeNull();
    });

    it('should detect Markdown with "type" key and extract all fields', () => {
      const detector = new StreamDetector();
      const result = detector.detectStreamingContent(
        '{"surfaceId":"s1","components":[{"id":"c1","type":"Markdown","content":"# Hello',
      );
      expect(result).not.toBeNull();
      expect(result!.componentType).toBe('Markdown');
      expect(result!.surfaceId).toBe('s1');
      expect(result!.componentId).toBe('c1');
      expect(result!.fieldPath).toBe('content');
      // Exact partial content, not just "contains"
      expect(result!.partialContent).toBe('# Hello');
    });

    it('should detect Markdown with "component" key', () => {
      const detector = new StreamDetector();
      const result = detector.detectStreamingContent(
        '{"surfaceId":"s2","component":"Markdown","content":"## Sub',
      );
      expect(result).not.toBeNull();
      expect(result!.componentType).toBe('Markdown');
      expect(result!.fieldPath).toBe('content');
      expect(result!.partialContent).toBe('## Sub');
    });

    it('should detect Text with "type" key and extract partial text', () => {
      const detector = new StreamDetector();
      const result = detector.detectStreamingContent(
        '{"surfaceId":"s1","components":[{"id":"c2","type":"Text","text":"Loading...',
      );
      expect(result).not.toBeNull();
      expect(result!.componentType).toBe('Text');
      expect(result!.fieldPath).toBe('text');
      expect(result!.partialContent).toBe('Loading...');
    });

    it('should detect Text with "component" key', () => {
      const detector = new StreamDetector();
      const result = detector.detectStreamingContent(
        '{"surfaceId":"s3","component":"Text","text":"Typing...',
      );
      expect(result).not.toBeNull();
      expect(result!.componentType).toBe('Text');
      expect(result!.partialContent).toBe('Typing...');
    });

    it('should extract content without trailing quote when string is complete', () => {
      const detector = new StreamDetector();
      const result = detector.detectStreamingContent(
        '{"surfaceId":"s1","type":"Markdown","content":"complete text"',
      );
      expect(result).not.toBeNull();
      expect(result!.partialContent).toBe('complete text');
    });

    it('should return null when field path is not found in the buffer', () => {
      const detector = new StreamDetector();
      const result = detector.detectStreamingContent(
        '{"surfaceId":"s1","type":"Markdown","other":"value',
      );
      expect(result).toBeNull();
    });

    it('should use "unknown" as componentId when id field is not present', () => {
      const detector = new StreamDetector();
      const result = detector.detectStreamingContent(
        '{"surfaceId":"s1","type":"Markdown","content":"partial',
      );
      expect(result).not.toBeNull();
      expect(result!.componentId).toBe('unknown');
    });

    it('should use the last occurrence when field path appears multiple times', () => {
      const detector = new StreamDetector();
      const result = detector.detectStreamingContent(
        '{"surfaceId":"s1","type":"Markdown","content":"first","content":"second',
      );
      expect(result).not.toBeNull();
      expect(result!.partialContent).toBe('second');
    });
  });

  // ---- Negative paths ----

  describe('negative paths', () => {
    it('should return null for whitespace-only string', () => {
      const detector = new StreamDetector();
      expect(detector.detectStreamingContent('     ')).toBeNull();
    });

    it('should return null for string with only surfaceId and no type or component', () => {
      const detector = new StreamDetector();
      expect(
        detector.detectStreamingContent('{"surfaceId":"s1","other":"value"}'),
      ).toBeNull();
    });

    it('should return null for input exactly at minimum length boundary', () => {
      const detector = new StreamDetector();
      // Length 9 — just under the 10-char minimum
      expect(detector.detectStreamingContent('123456789')).toBeNull();
      // Length 10 — at the boundary but invalid content
      expect(detector.detectStreamingContent('1234567890')).toBeNull();
    });
  });
});
