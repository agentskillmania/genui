/**
 * MarkdownPlugin — handles streaming Markdown content detection.
 * Emits ComponentUpdate ParseResults with partial Markdown content
 * for incremental rendering.
 */

import type { StreamingDetection, ParseResult } from '../../types/sdk';
import type { IStreamPlugin } from './IStreamPlugin';

export class MarkdownPlugin implements IStreamPlugin {
  /**
   * Returns true when the detection is for a Markdown component.
   */
  canHandle(detection: StreamingDetection): boolean {
    return detection.componentType === 'Markdown';
  }

  /**
   * Produce a ComponentUpdate ParseResult with the partial Markdown content.
   */
  handlePartial(detection: StreamingDetection): ParseResult | null {
    return {
      type: 'ComponentUpdate',
      eventType: 'UpdateComponents',
      surfaceId: detection.surfaceId,
      componentJson: JSON.stringify({
        id: detection.componentId,
        type: 'Markdown',
        content: detection.partialContent,
      }),
    };
  }
}
