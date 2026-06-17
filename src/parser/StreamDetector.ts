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
   *
   * Uses a regex that recognizes backslash escapes (e.g. `\"`) so that string
   * values containing escaped quotes are captured in full instead of being
   * truncated at the first `\"`.
   */
  private extractFieldValue(json: string, fieldName: string): string | null {
    // Match: "field"<ws>:<ws>"<value with escaped chars>"
    // Group 1 captures the raw (still-escaped) JSON string body.
    const regex = new RegExp(`"${fieldName}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, 's');
    const match = regex.exec(json);
    return match ? this.unescapeJsonString(match[1]) : null;
  }

  /**
   * Unescape a raw JSON string body (the text between the surrounding quotes)
   * into its real character sequence. Handles `\"`, `\\`, `\/`, `\n`, `\t`,
   * `\r`, `\b`, `\f` and `\uXXXX`.
   *
   * Implementation wraps the body in quotes and parses via JSON.parse, which
   * is the cheapest correct approach. Falls back to the raw input on failure
   * (e.g. truncated escape at buffer tail).
   */
  private unescapeJsonString(raw: string): string {
    try {
      return JSON.parse(`"${raw}"`) as string;
    } catch {
      return raw;
    }
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
    let partial = pendingJson.substring(lastMatchIndex);

    // If the partial content ends with a closing quote (complete value),
    // check if it's truly the end or if there's more structure
    let closed = false;
    if (partial.endsWith('"')) {
      // The string value is actually complete — not streaming
      // But we still return the content minus the closing quote for
      // partial rendering scenarios where the overall JSON is incomplete
      partial = partial.slice(0, -1);
      closed = true;
    }

    // Unescape JSON string escapes (\n, \", \\, \t, ...) so the rendered
    // partial content matches what the final value will look like.
    // For still-streaming (unclosed) values, a trailing lone backslash is
    // dropped because the escape sequence is incomplete.
    return this.unescapePartialJsonString(partial, closed);
  }

  /**
   * Unescape the body of a (possibly still-streaming) JSON string.
   *
   * Unlike {@link unescapeJsonString}, this handles values whose closing
   * quote has not arrived yet: a trailing lone `\` (start of an incomplete
   * escape) is stripped instead of throwing.
   */
  private unescapePartialJsonString(raw: string, closed: boolean): string {
    if (closed) {
      // Full closed value — safe to round-trip through JSON.parse.
      try {
        return JSON.parse(`"${raw}"`) as string;
      } catch {
        // fall through to manual unescape
      }
    }
    // Manual unescape that tolerates a trailing incomplete escape.
    let out = '';
    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i];
      if (ch === '\\' && i + 1 < raw.length) {
        const next = raw[++i];
        switch (next) {
          case '"': out += '"'; break;
          case '\\': out += '\\'; break;
          case '/': out += '/'; break;
          case 'n': out += '\n'; break;
          case 't': out += '\t'; break;
          case 'r': out += '\r'; break;
          case 'b': out += '\b'; break;
          case 'f': out += '\f'; break;
          case 'u': {
            const hex = raw.slice(i + 1, i + 5);
            if (/^[0-9a-fA-F]{4}$/.test(hex)) {
              out += String.fromCharCode(parseInt(hex, 16));
              i += 4;
            } else {
              out += next;
            }
            break;
          }
          default: out += next;
        }
      } else if (ch === '\\') {
        // trailing lone backslash — incomplete escape, drop it
      } else {
        out += ch;
      }
    }
    return out;
  }
}
