/**
 * GenUI — A2UI v0.9 compatible generative UI engine.
 * Renders streaming A2UI protocol as React components via Ant Design 6 + ECharts.
 *
 * @packageDocumentation
 */

// ===== Core engine =====
export { Genui } from './GenuiEngine';
export { SurfaceManager } from './SurfaceManager';

// ===== React component =====
export { GenUISurface } from './components/Surface';
/** @deprecated Use GenUISurface */
export { GenUISurface as AGenUISurface } from './components/Surface';

// ===== React hooks =====
export { useGenui } from './hooks/useGenui';
/** @deprecated Use useGenui */
export { useGenui as useAGenUI } from './hooks/useGenui';
export { useSurfaceManager } from './hooks/useSurfaceManager';
export { useActionHandler } from './hooks/useActionHandler';

// ===== Component registry =====
export {
  registerComponent,
  getComponentRenderer,
  hasComponent,
  getRegisteredTypes,
} from './components/registry';

// ===== Tools =====
export { validateA2UIMessage, classifyA2UIEvent, componentSchema, A2UI_VERSION } from './tools/schemaValidator';
export { exportCatalog } from './tools/catalogExport';

// ===== Types =====
export type {
  GenuiConfig,
  AGenUIConfig,
  AGenUIComponent,
  AGenUISurfaceState,
  ActionEvent,
  SyncUIToDataEvent,
  ParseResult,
  FunctionHandler,
  LayoutBridge,
  SurfaceSize,
  SurfaceSizeProvider,
  StreamingDetection,
} from './types/sdk';

export type {
  GenUIComponentProps,
  AGenUIComponentProps,
  ComponentRenderer,
} from './components/types';

export type { GenUISurfaceProps } from './components/Surface';

export type { SurfaceEvent, SurfaceEventListener } from './engine/types';

export type { A2UICatalog, CatalogEntry } from './tools/catalogExport';

// ===== Component registration (side-effect import — not tree-shakeable) =====
import './components/index';
