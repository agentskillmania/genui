/**
 * TextPlugin — handles streaming Text content detection.
 * Emits ComponentUpdate ParseResults with partial text content
 * for incremental rendering.
 */

import type { StreamingDetection, ParseResult } from '../../types/sdk';
import type { IStreamPlugin } from './IStreamPlugin';

export class TextPlugin implements IStreamPlugin {
  /**
   * Returns true when the detection is for a Text component.
   */
  canHandle(detection: StreamingDetection): boolean {
    return detection.componentType === 'Text';
  }

  /**
   * Produce a ComponentUpdate ParseResult with the partial text content.
   */
  handlePartial(detection: StreamingDetection): ParseResult | null {
    return {
      type: 'ComponentUpdate',
      eventType: 'UpdateComponents',
      surfaceId: detection.surfaceId,
      componentJson: JSON.stringify({
        id: detection.componentId,
        type: 'Text',
        text: detection.partialContent,
      }),
    };
  }
}
