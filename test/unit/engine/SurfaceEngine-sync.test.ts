/**
 * BUG1: syncUIToData must write to the data model, closing the controlled-input loop.
 *
 * The flow should be:
 *   user types → component calls onSyncState({ value: "new" })
 *   → engine.syncUIToData(surfaceId, componentId, { value: "new" })
 *   → engine writes "new" to the data model at the path bound to `value`
 *   → engine emits updateDataModel → Surface re-renders → component shows "new"
 *
 * BUG: syncUIToData only emits an event, never writes the data model.
 * The event is also not handled by Surface's handleEvent switch.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SurfaceEngine } from '../../../src/engine/SurfaceEngine.js';
import type { SurfaceEvent } from '../../../src/engine/types.js';

describe('BUG1: syncUIToData writes to data model (controlled input loop)', () => {
  let engine: SurfaceEngine;
  const surfaceId = 'test-surface';
  const catalogId = 'default';

  beforeEach(() => {
    engine = new SurfaceEngine();
    engine.createSurface(surfaceId, catalogId, {});
  });

  it('writes the synced value to the data model at the bound path', () => {
    // Set up a component whose `value` property is bound via { path: "/form/name" }
    engine.updateComponents(surfaceId, [
      JSON.stringify({
        id: 'name-field',
        component: 'TextField',
        value: { path: '/form/name' },
      }),
    ]);
    // Initialize the data model
    engine.updateDataModel(surfaceId, '/', { form: { name: 'initial' } });

    // Simulate user typing: component calls syncUIToData with the new value
    engine.syncUIToData(surfaceId, 'name-field', { value: 'typed by user' });

    // The data model at /form/name should now be 'typed by user'
    const resolved = engine.resolveProperties(surfaceId, { path: '/form/name' });
    expect(resolved).toBe('typed by user');
  });

  it('emits updateDataModel event after sync (so Surface re-renders)', () => {
    const events: SurfaceEvent[] = [];
    engine.addListener((e) => events.push(e));

    engine.updateComponents(surfaceId, [
      JSON.stringify({
        id: 'field',
        component: 'TextField',
        value: { path: '/data/value' },
      }),
    ]);
    engine.updateDataModel(surfaceId, '/', { data: { value: 'old' } });

    events.length = 0; // clear setup events

    engine.syncUIToData(surfaceId, 'field', { value: 'new' });

    // Must emit an event that triggers Surface re-render
    const reRenderEvent = events.find(
      (e) => e.type === 'updateDataModel' || e.type === 'updateComponents',
    );
    expect(reRenderEvent).toBeDefined();
  });

  it('handles multiple bindings (value + checked) on the same component', () => {
    engine.updateComponents(surfaceId, [
      JSON.stringify({
        id: 'switch',
        component: 'Switch',
        checked: { path: '/settings/enabled' },
        label: 'Enable feature',
      }),
    ]);
    engine.updateDataModel(surfaceId, '/', { settings: { enabled: false } });

    engine.syncUIToData(surfaceId, 'switch', { checked: true });

    const resolved = engine.resolveProperties(surfaceId, { path: '/settings/enabled' });
    expect(resolved).toBe(true);
  });

  it('ignores sync keys that have no path binding (non-bound property)', () => {
    engine.updateComponents(surfaceId, [
      JSON.stringify({
        id: 'btn',
        component: 'Button',
        text: 'Click me', // no path binding — plain string
      }),
    ]);
    engine.updateDataModel(surfaceId, '/', {});

    // syncUIToData with a key that has no binding should not crash
    engine.syncUIToData(surfaceId, 'btn', { text: 'New text' });

    // Data model should remain empty (no path to write to)
    // — this is fine; the host can still listen to the syncUIToData event.
  });

  it('no-op for unknown surface (does not throw)', () => {
    expect(() => {
      engine.syncUIToData('nonexistent', 'comp', { value: 'x' });
    }).not.toThrow();
  });
});
