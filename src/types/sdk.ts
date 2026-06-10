/**
 * GenUI SDK type definitions.
 * A2UI v0.9 compatible — these types mirror the A2UI protocol schema.
 */

// ===== Component types =====

/** An A2UI component in the component tree */
export interface AGenUIComponent {
  id: string;
  type: string;
  [key: string]: unknown;
}

/** State of a single A2UI surface */
export interface AGenUISurfaceState {
  surfaceId: string;
  catalogId?: string;
  theme?: Record<string, string>;
  components: AGenUIComponent[];
  dataModel?: unknown;
}

// ===== Event types =====

/** Action triggered by user interaction with a component */
export interface ActionEvent {
  surfaceId: string;
  sourceComponentId: string;
  context?: Record<string, unknown>;
}

/** UI-to-data sync event for form-like components */
export interface SyncUIToDataEvent {
  surfaceId: string;
  componentId: string;
  change: Record<string, unknown>;
}

// ===== Stream parsing results =====

/** Result of parsing an A2UI stream chunk */
export interface ParseResult {
  type: 'NormalEvent' | 'ComponentUpdate';
  eventType: 'Unknown' | 'CreateSurface' | 'UpdateComponents' | 'UpdateDataModel' | 'AppendDataModel' | 'DeleteSurface';
  eventJson?: string;
  componentJson?: string;
  surfaceId?: string;
  version?: string;
}

// ===== SDK configuration =====

/** GenUI engine configuration */
export interface GenuiConfig {
  themeConfig?: Record<string, unknown>;
  designTokenConfig?: Record<string, unknown>;
  componentStyles?: Record<string, unknown>;
}

/** @deprecated Use GenuiConfig */
export type AGenUIConfig = GenuiConfig;

// ===== Function handlers =====

export type SyncFunctionHandler = (params: Record<string, unknown>) => unknown;
export type AsyncFunctionHandler = (
  params: Record<string, unknown>,
  callback: (result: unknown, error?: string) => void
) => void;
export type FunctionHandler = SyncFunctionHandler | AsyncFunctionHandler;

// ===== Layout bridge =====

export interface LayoutBridge {
  getDeviceWidth(): number;
  getDeviceHeight(): number;
  getDeviceDensity(): number;
}

// ===== Surface sizing =====

export interface SurfaceSize {
  width: number;
  height: number;
}

export type SurfaceSizeProvider = (surfaceId: string) => SurfaceSize | null;

// ===== Streaming detection (parser-internal) =====

/** Result of detecting streaming content in incomplete JSON */
export interface StreamingDetection {
  /** Component type being streamed (e.g. "Markdown", "Text") */
  componentType: string;
  /** Surface ID from the incomplete JSON */
  surfaceId: string;
  /** Component ID from the incomplete JSON */
  componentId: string;
  /** The field being streamed (e.g. "content", "text") */
  fieldPath: string;
  /** Partial content extracted from the incomplete string value */
  partialContent: string;
}
