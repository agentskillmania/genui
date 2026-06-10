/**
 * Parser-internal types for the A2UI stream parser.
 * These types are used during the parsing pipeline only.
 */

import type { StreamingDetection, ParseResult } from '../types/sdk';

/** Internal event classification map for A2UI protocol keys */
export const EVENT_TYPE_MAP: Record<string, ParseResult['eventType']> = {
  createSurface: 'CreateSurface',
  updateComponents: 'UpdateComponents',
  updateDataModel: 'UpdateDataModel',
  appendDataModel: 'AppendDataModel',
  deleteSurface: 'DeleteSurface',
};

/** Re-export SDK types for parser-internal convenience */
export type { StreamingDetection, ParseResult };
