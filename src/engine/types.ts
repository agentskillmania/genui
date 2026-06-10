/**
 * SurfaceEngine event system types.
 * Internal event bus for surface lifecycle and interaction events.
 */

/** Listener callback for surface events */
export type SurfaceEventListener = (event: SurfaceEvent) => void;

/** Event emitted by the SurfaceEngine event bus */
export interface SurfaceEvent {
  type:
    | 'createSurface'
    | 'updateComponents'
    | 'deleteSurface'
    | 'action'
    | 'syncUIToData'
    | 'interactionStatus'
    | 'surfaceSizeChanged';
  surfaceId: string;
  payload?: unknown;
}
