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
        detector.detectStreamingContent('{"type":"Markdown","content":"hello')
      ).toBeNull();
    });

    it('should return null when no recognized component type is present', () => {
      const detector = new StreamDetector();
      expect(
        detector.detectStreamingContent('{"surfaceId":"s1","type":"Button","label":"cli')
      ).toBeNull();
    });

    it('should detect Markdown with "type" key and incomplete content', () => {
      const detector = new StreamDetector();
      const result = detector.detectStreamingContent(
        '{"surfaceId":"s1","components":[{"id":"c1","type":"Markdown","content":"# Hello'
      );
      expect(result).not.toBeNull();
      expect(result!.componentType).toBe('Markdown');
      expect(result!.surfaceId).toBe('s1');
      expect(result!.componentId).toBe('c1');
      expect(result!.fieldPath).toBe('content');
      expect(result!.partialContent).toContain('# Hello');
    });

    it('should detect Markdown with "component" key', () => {
      const detector = new StreamDetector();
      const result = detector.detectStreamingContent(
        '{"surfaceId":"s2","component":"Markdown","content":"## Sub'
      );
      expect(result).not.toBeNull();
      expect(result!.componentType).toBe('Markdown');
      expect(result!.fieldPath).toBe('content');
    });

    it('should detect Text with "type" key and incomplete text', () => {
      const detector = new StreamDetector();
      const result = detector.detectStreamingContent(
        '{"surfaceId":"s1","components":[{"id":"c2","type":"Text","text":"Loading...'
      );
      expect(result).not.toBeNull();
      expect(result!.componentType).toBe('Text');
      expect(result!.fieldPath).toBe('text');
      expect(result!.partialContent).toContain('Loading...');
    });

    it('should detect Text with "component" key', () => {
      const detector = new StreamDetector();
      const result = detector.detectStreamingContent(
        '{"surfaceId":"s3","component":"Text","text":"Typing...'
      );
      expect(result).not.toBeNull();
      expect(result!.componentType).toBe('Text');
    });

    it('should handle content whose string value ends with a closing quote', () => {
      const detector = new StreamDetector();
      // The content value ends with a closing quote — the partial extraction
      // returns content minus the trailing quote
      const result = detector.detectStreamingContent(
        '{"surfaceId":"s1","type":"Markdown","content":"complete text"'

      );
      expect(result).not.toBeNull();
      expect(result!.partialContent).toBe('complete text');
    });

    it('should return null when field path is not found in the buffer', () => {
      const detector = new StreamDetector();
      // Markdown type detected, but no "content" field in the buffer
      const result = detector.detectStreamingContent(
        '{"surfaceId":"s1","type":"Markdown","other":"value'
      );
      expect(result).toBeNull();
    });

    it('should use "unknown" as componentId when id field is not present', () => {
      const detector = new StreamDetector();
      const result = detector.detectStreamingContent(
        '{"surfaceId":"s1","type":"Markdown","content":"partial'
      );
      expect(result).not.toBeNull();
      expect(result!.componentId).toBe('unknown');
    });

    it('should handle content with multiple occurrences of the field path', () => {
      const detector = new StreamDetector();
      // The last occurrence of "content":" should be used for partial extraction
      const result = detector.detectStreamingContent(
        '{"surfaceId":"s1","type":"Markdown","content":"first","content":"second'
      );
      expect(result).not.toBeNull();
      expect(result!.partialContent).toContain('second');
    });
  });
});
