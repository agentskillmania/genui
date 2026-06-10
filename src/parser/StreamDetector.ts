/**
 * StreamDetector — detects streaming content patterns in incomplete JSON
 * buffer tails. Identifies Markdown and Text components whose content
 * fields are still being streamed, and extracts partial content for
 * incremental rendering.
 */

import type { StreamingDetection } from '../types/sdk';

export class StreamDetector {
  /**
   * Analyze the pending (incomplete) JSON buffer for streaming content patterns.
   *
   * Detects:
   * - `"type":"Markdown"` (or `"component":"Markdown"`) with incomplete content field
   * - `"type":"Text"` (or `"component":"Text"`) with incomplete text field
   * - Extracts the partial string value from the last unclosed quote
   *
   * @param pendingJson - The incomplete JSON buffer tail
   * @returns StreamingDetection if a streaming pattern is found, null otherwise
   */
  detectStreamingContent(pendingJson: string): StreamingDetection | null {
    if (!pendingJson || pendingJson.length < 10) {
      return null;
    }

    // Try to extract surfaceId from the pending buffer
    const surfaceId = this.extractFieldValue(pendingJson, 'surfaceId');
    if (!surfaceId) {
      return null;
    }

    // Detect component type and extract component-level info
    const componentInfo = this.detectComponent(pendingJson);
    if (!componentInfo) {
      return null;
    }

    // Extract partial content from the last unclosed string value
    const partialContent = this.extractPartialContent(pendingJson, componentInfo.fieldPath);
    if (partialContent === null) {
      return null;
    }

    return {
      componentType: componentInfo.componentType,
      surfaceId,
      componentId: componentInfo.componentId,
      fieldPath: componentInfo.fieldPath,
      partialContent,
    };
  }

  /**
   * Extract a top-level string field value from the pending JSON.
   */
  private extractFieldValue(json: string, fieldName: string): string | null {
    const regex = new RegExp(`"${fieldName}"\\s*:\\s*"([^"]*)"`, 's');
    const match = regex.exec(json);
    return match ? match[1] : null;
  }

  /**
   * Detect a streaming component (Markdown or Text) in the pending buffer.
   */
  private detectComponent(pendingJson: string): {
    componentType: string;
    componentId: string;
    fieldPath: string;
  } | null {
    // Match either "type":"Markdown" or "component":"Markdown"
    const typePatterns: Array<{ pattern: RegExp; componentType: string; fieldPath: string }> = [
      {
        pattern: /"type"\s*:\s*"Markdown"/s,
        componentType: 'Markdown',
        fieldPath: 'content',
      },
      {
        pattern: /"component"\s*:\s*"Markdown"/s,
        componentType: 'Markdown',
        fieldPath: 'content',
      },
      {
        pattern: /"type"\s*:\s*"Text"/s,
        componentType: 'Text',
        fieldPath: 'text',
      },
      {
        pattern: /"component"\s*:\s*"Text"/s,
        componentType: 'Text',
        fieldPath: 'text',
      },
    ];

    for (const { pattern, componentType, fieldPath } of typePatterns) {
      if (pattern.test(pendingJson)) {
        // Extract component ID
        const componentId = this.extractFieldValue(pendingJson, 'id') ?? 'unknown';
        return { componentType, componentId, fieldPath };
      }
    }

    return null;
  }

  /**
   * Extract partial content from the last unclosed string value
   * associated with the given field path.
   */
  private extractPartialContent(pendingJson: string, fieldPath: string): string | null {
    // Find the last occurrence of "fieldPath":" and extract content after it
    // The content runs until the end of the buffer (unclosed string)
    const fieldRegex = new RegExp(`"${fieldPath}"\\s*:\\s*"`, 'g');
    let lastMatchIndex = -1;
    let match: RegExpExecArray | null;

    while ((match = fieldRegex.exec(pendingJson)) !== null) {
      lastMatchIndex = match.index + match[0].length;
    }

    if (lastMatchIndex === -1) {
      return null;
    }

    // Extract everything after the opening quote until end of buffer
    // This is the partial content being streamed
    const partial = pendingJson.substring(lastMatchIndex);

    // If the partial content ends with a closing quote (complete value),
    // check if it's truly the end or if there's more structure
    if (partial.endsWith('"')) {
      // The string value is actually complete — not streaming
      // But we still return the content minus the closing quote for
      // partial rendering scenarios where the overall JSON is incomplete
      return partial.slice(0, -1);
    }

    return partial;
  }
}
