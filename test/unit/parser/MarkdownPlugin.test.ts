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
    const detection = makeMarkdownDetection('# Hello');
    expect(plugin.canHandle(detection)).toBe(true);
  });

  it('should not handle Text detection', () => {
    const plugin = new MarkdownPlugin();
    const detection = makeTextDetection('Hello');
    expect(plugin.canHandle(detection)).toBe(false);
  });

  it('should emit ComponentUpdate from handlePartial', () => {
    const plugin = new MarkdownPlugin();
    const detection = makeMarkdownDetection('# Hello World');
    const result = plugin.handlePartial(detection);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('ComponentUpdate');
    expect(result!.eventType).toBe('UpdateComponents');
    expect(result!.surfaceId).toBe('surface-1');
    expect(result!.componentJson).toContain('# Hello World');
  });

  it('should handle empty partial content', () => {
    const plugin = new MarkdownPlugin();
    const detection = makeMarkdownDetection('');
    const result = plugin.handlePartial(detection);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('ComponentUpdate');
  });

  it('should preserve special characters in content', () => {
    const plugin = new MarkdownPlugin();
    const detection = makeMarkdownDetection('**bold** & <em>italic</em> `code`');
    const result = plugin.handlePartial(detection);
    expect(result).not.toBeNull();
    expect(result!.componentJson).toContain('**bold** & <em>italic</em> `code`');
  });
});
