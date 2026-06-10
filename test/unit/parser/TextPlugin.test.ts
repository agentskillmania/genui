import { describe, it, expect } from 'vitest';
import { TextPlugin } from '@/parser/plugins/TextPlugin';
import type { StreamingDetection } from '@/types/sdk';

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

describe('TextPlugin', () => {
  it('should handle Text detection', () => {
    const plugin = new TextPlugin();
    const detection = makeTextDetection('Hello');
    expect(plugin.canHandle(detection)).toBe(true);
  });

  it('should not handle Markdown detection', () => {
    const plugin = new TextPlugin();
    const detection = makeMarkdownDetection('# Hello');
    expect(plugin.canHandle(detection)).toBe(false);
  });

  it('should emit ComponentUpdate from handlePartial', () => {
    const plugin = new TextPlugin();
    const detection = makeTextDetection('Hello World');
    const result = plugin.handlePartial(detection);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('ComponentUpdate');
    expect(result!.eventType).toBe('UpdateComponents');
    expect(result!.surfaceId).toBe('surface-1');
    expect(result!.componentJson).toContain('Hello World');
  });

  it('should preserve special characters in content exactly', () => {
    const plugin = new TextPlugin();
    const content = 'Price: $100 & <em>html</em> — em-dash';
    const detection = makeTextDetection(content);
    const result = plugin.handlePartial(detection);
    expect(result).not.toBeNull();
    // componentJson is JSON-encoded, so the content appears as-is in the JSON string
    expect(result!.componentJson).toContain(content);
    // Verify the parsed object preserves content exactly
    const parsed = JSON.parse(result!.componentJson!);
    expect(parsed.text).toBe(content);
  });

  it('should handle empty partial content', () => {
    const plugin = new TextPlugin();
    const detection = makeTextDetection('');
    const result = plugin.handlePartial(detection);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('ComponentUpdate');
  });
});
