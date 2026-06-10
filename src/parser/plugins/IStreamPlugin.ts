/**
 * Interface for stream content plugins.
 * Each plugin handles a specific component type (e.g. Markdown, Text)
 * during streaming content detection.
 */

import type { StreamingDetection, ParseResult } from '../../types/sdk';

export interface IStreamPlugin {
  /**
   * Determine if this plugin can handle the given streaming detection.
   * @param detection - The detected streaming content pattern
   */
  canHandle(detection: StreamingDetection): boolean;

  /**
   * Handle a partial streaming content detection and produce a ParseResult.
   * @param detection - The detected streaming content pattern
   * @returns A ParseResult representing the partial update, or null if not applicable
   */
  handlePartial(detection: StreamingDetection): ParseResult | null;
}
