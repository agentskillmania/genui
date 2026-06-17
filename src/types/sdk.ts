/**
 * GenUI SDK type definitions.
 * Fully compliant with A2UI v0.9 specification.
 * @see https://a2ui.org/specification/v0.9-a2ui/
 */

// ===== A2UI v0.9 Common Types =====

/** ComponentId — unique string reference within a surface */
export type ComponentId = string;

/** ChildList — matches A2UI v0.9 ChildList definition */
export type ChildList =
  | ComponentId[]
  | { path: string; componentId: ComponentId };

/** Action — matches A2UI v0.9 Action definition */
export interface Action {
  event?: {
    name: string;
    context?: Record<string, unknown>;
  };
  functionCall?: {
    call: string;
    args: Record<string, unknown>;
  };
}

/** Data binding — literal value or JSON Pointer path */
export interface DataBinding {
  path: string;
}

/** Function call — client-side registered function */
export interface FunctionCall {
  call: string;
  args: Record<string, unknown>;
  returnType?: string;
}

/** DynamicString — literal string, path binding, or function call */
export type DynamicString = string | DataBinding | FunctionCall;

/** DynamicNumber — literal number, path binding, or function call */
export type DynamicNumber = number | DataBinding | FunctionCall;

/** DynamicBoolean — literal boolean, path binding, or function call */
export type DynamicBoolean = boolean | DataBinding | FunctionCall;

/** DynamicStringList — literal string array, path binding, or function call */
export type DynamicStringList = string[] | DataBinding | FunctionCall;

/** DynamicValue — any dynamic value */
export type DynamicValue = unknown | DataBinding | FunctionCall;

/** Check definition for input validation */
export interface CheckDefinition {
  condition?: FunctionCall;
  call?: string;
  args?: Record<string, unknown>;
  message?: string;
}

// ===== Component types =====

/**
 * An A2UI component in the component tree.
 * Uses adjacency-list model: parents reference children by ID.
 * Compliant with A2UI v0.9 `anyComponent` schema.
 */
export interface AGenUIComponent {
  /** Unique component instance ID within the surface */
  id: ComponentId;
  /** Component type name (e.g. "Text", "Button", "Column") — was "type" */
  component: string;
  /** Single child reference (Card, Button, Modal trigger/content) */
  child?: ComponentId;
  /** Multiple children reference or template binding (Row, Column, List) */
  children?: ChildList;
  /** Action definition for interactive components */
  action?: Action;
  /** Validation checks for input components */
  checks?: CheckDefinition[];
  /** Component-specific properties */
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
