import { describe, it, expect } from 'vitest';
import { MarkdownPlugin } from '@/parser/plugins/MarkdownPlugin';
import type { StreamingDetection } from '@/types/sdk';

/** Helper to create a Markdown StreamingDetection */
function makeMarkdownDetection(partialContent: string): StreamingDetection {
  return {
    componentType: 'Markdown',
    surfaceId: 'surface-1',
    componentId: 'comp-1',
    fieldPath: 'content',
    partialContent,
  };
}

/** Helper to create a Text StreamingDetection */
function makeTextDetection(partialContent: string): StreamingDetection {
  return {
    componentType: 'Text',
    surfaceId: 'surface-1',
    componentId: 'comp-1',
    fieldPath: 'text',
    partialContent,
  };
}

describe('MarkdownPlugin', () => {
  it('should handle Markdown detection', () => {
    const plugin = new MarkdownPlugin();
    expect(plugin.canHandle(makeMarkdownDetection('# Hello'))).toBe(true);
  });

  it('should not handle Text detection', () => {
    const plugin = new MarkdownPlugin();
    expect(plugin.canHandle(makeTextDetection('Hello'))).toBe(false);
  });

  it('should emit ComponentUpdate with correct structure from handlePartial', () => {
    const plugin = new MarkdownPlugin();
    const detection = makeMarkdownDetection('# Hello World');
    const result = plugin.handlePartial(detection);

    expect(result!.type).toBe('ComponentUpdate');
    expect(result!.eventType).toBe('UpdateComponents');
    expect(result!.surfaceId).toBe('surface-1');

    // Parse componentJson and verify exact structure
    const parsed = JSON.parse(result!.componentJson!);
    expect(parsed).toEqual({
      id: 'comp-1',
      component: 'Markdown',
      content: '# Hello World',
    });
  });

  it('should handle empty partial content with valid structure', () => {
    const plugin = new MarkdownPlugin();
    const result = plugin.handlePartial(makeMarkdownDetection(''));

    expect(result!.type).toBe('ComponentUpdate');
    const parsed = JSON.parse(result!.componentJson!);
    expect(parsed.content).toBe('');
    expect(parsed.component).toBe('Markdown');
  });

  it('should preserve special characters in content exactly', () => {
    const plugin = new MarkdownPlugin();
    const content = '**bold** & <em>italic</em> `code`';
    const result = plugin.handlePartial(makeMarkdownDetection(content));

    const parsed = JSON.parse(result!.componentJson!);
    expect(parsed.content).toBe(content);
  });

  // ---- Negative paths ----

  describe('negative paths', () => {
    it('should not handle detection with componentType different from Markdown', () => {
      const plugin = new MarkdownPlugin();
      const detection: StreamingDetection = {
        componentType: 'Button',
        surfaceId: 's1',
        componentId: 'c1',
        fieldPath: 'label',
        partialContent: 'click',
      };
      expect(plugin.canHandle(detection)).toBe(false);
    });

    it('should produce valid JSON even with content containing quotes', () => {
      const plugin = new MarkdownPlugin();
      const content = 'He said "hello" to her';
      const result = plugin.handlePartial(makeMarkdownDetection(content));

      // componentJson must be parseable JSON
      const parsed = JSON.parse(result!.componentJson!);
      expect(parsed.content).toBe(content);
    });

    it('should produce valid JSON even with content containing newlines', () => {
      const plugin = new MarkdownPlugin();
      const content = 'line1\nline2\nline3';
      const result = plugin.handlePartial(makeMarkdownDetection(content));

      const parsed = JSON.parse(result!.componentJson!);
      expect(parsed.content).toBe(content);
    });
  });
});
