/**
 * A2UIStreamParser — main parser for the A2UI streaming protocol.
 *
 * Receives raw text chunks from an LLM/agent stream, accumulates them,
 * detects complete JSON message boundaries, and emits ParseResult events.
 * Also detects streaming content (Markdown/Text) in incomplete JSON
 * for incremental rendering.
 */

import { JsonStreamAccumulator } from './JsonStreamAccumulator';
import { StreamDetector } from './StreamDetector';
import { MarkdownPlugin } from './plugins/MarkdownPlugin';
import { TextPlugin } from './plugins/TextPlugin';
import type { IStreamPlugin } from './plugins/IStreamPlugin';
import type { ParseResult } from '../types/sdk';
import { EVENT_TYPE_MAP } from './types';

export class A2UIStreamParser {
  private accumulator = new JsonStreamAccumulator();
  private detector = new StreamDetector();
  private plugins: IStreamPlugin[] = [];

  constructor() {
    this.plugins = [new MarkdownPlugin(), new TextPlugin()];
  }

  /**
   * Reset the parser state for a new stream.
   */
  begin(): void {
    this.accumulator.reset();
  }

  /**
   * Process a raw text chunk from the stream.
   *
   * Algorithm:
   * 1. Append chunk to accumulator
   * 2. Extract complete JSON objects and classify into events
   * 3. Detect streaming content in the pending buffer tail
   * 4. Return all results
   *
   * @param data - Raw text chunk from the stream
   * @returns Array of ParseResult events
   */
  receiveChunk(data: string): ParseResult[] {
    const results: ParseResult[] = [];

    this.accumulator.append(data);

    // Step 2: Extract and parse complete JSON objects
    const completeJsons = this.accumulator.extractCompleteJson();
    for (const jsonStr of completeJsons) {
      const parsed = this.parseJson(jsonStr);
      if (parsed !== null) {
        results.push(parsed);
      }
    }

    // Step 3: Detect streaming content in pending buffer
    const pending = this.accumulator.getPending();
    if (pending.length > 0) {
      const detection = this.detector.detectStreamingContent(pending);
      if (detection) {
        for (const plugin of this.plugins) {
          if (plugin.canHandle(detection)) {
            const partialResult = plugin.handlePartial(detection);
            if (partialResult) {
              results.push(partialResult);
            }
            break;
          }
        }
      }
    }

    return results;
  }

  /**
   * Finalize the stream. Resets internal state.
   */
  end(): void {
    this.accumulator.reset();
  }

  /**
   * Dispose of the parser. No-op (replaces WASM cleanup in the original design).
   */
  dispose(): void {
    // No-op — was WASM cleanup in original design
  }

  /**
   * Parse a complete JSON string and classify it into a ParseResult.
   */
  private parseJson(jsonStr: string): ParseResult | null {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      // Malformed JSON — silently ignore
      return null;
    }

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return null;
    }

    // Classify event type based on top-level keys
    for (const [key, eventType] of Object.entries(EVENT_TYPE_MAP)) {
      if (key in parsed) {
        const payload = parsed[key] as Record<string, unknown>;
        return {
          type: 'NormalEvent',
          eventType,
          eventJson: jsonStr,
          surfaceId: typeof payload.surfaceId === 'string' ? payload.surfaceId : undefined,
          version: typeof payload.version === 'string' ? payload.version : undefined,
        };
      }
    }

    // Unknown event type
    return {
      type: 'NormalEvent',
      eventType: 'Unknown',
      eventJson: jsonStr,
    };
  }
}
