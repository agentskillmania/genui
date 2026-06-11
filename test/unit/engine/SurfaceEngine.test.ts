/**
 * Unit tests for SurfaceEngine and SurfaceState.
 * Covers surface lifecycle, component tree, data model, events, sizing, and edge cases.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SurfaceEngine } from '../../../src/engine/SurfaceEngine';
import type { SurfaceEvent, SurfaceEventListener } from '../../../src/engine/types';

// ---------- helpers ----------

/** Collect emitted events into an array and return a typed accessor */
function captureEvents(engine: SurfaceEngine) {
  const events: SurfaceEvent[] = [];
  const listener: SurfaceEventListener = (e) => events.push(e);
  engine.addListener(listener);
  return {
    events,
    listener,
    /** Remove the capture listener */
    unsubscribe() {
      engine.removeListener(listener);
    },
  };
}

/** Shorthand to create a surface and return the capture helper */
function setup(engine: SurfaceEngine, surfaceId = 's1') {
  const cap = captureEvents(engine);
  engine.createSurface(surfaceId, 'catalog-1', { primary: '#000' });
  cap.events.length = 0; // clear the createSurface event
  return cap;
}

// ---------- Surface lifecycle ----------

describe('SurfaceEngine – surface lifecycle', () => {
  it('createSurface creates and stores surface', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'catalog-1', { primary: '#000' });
    const surface = engine.getSurface('s1');
    expect(surface).toBeDefined();
    expect(surface!.getTheme()).toEqual({ primary: '#000' });
  });

  it('createSurface emits createSurface event', () => {
    const engine = new SurfaceEngine();
    const cap = captureEvents(engine);
    engine.createSurface('s1', 'catalog-1', {});
    expect(cap.events).toHaveLength(1);
    expect(cap.events[0].type).toBe('createSurface');
    expect(cap.events[0].surfaceId).toBe('s1');
  });

  it('deleteSurface removes surface', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'catalog-1', {});
    engine.deleteSurface('s1');
    expect(engine.getSurface('s1')).toBeUndefined();
  });

  it('deleteSurface emits deleteSurface event', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'catalog-1', {});
    const cap = captureEvents(engine);
    engine.deleteSurface('s1');
    expect(cap.events).toHaveLength(1);
    expect(cap.events[0].type).toBe('deleteSurface');
    expect(cap.events[0].surfaceId).toBe('s1');
  });

  it('getSurfaceIds returns all IDs', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    engine.createSurface('s2', 'c2', {});
    expect(engine.getSurfaceIds()).toEqual(['s1', 's2']);
  });

  it('getSurface returns undefined for unknown ID', () => {
    const engine = new SurfaceEngine();
    expect(engine.getSurface('nope')).toBeUndefined();
  });
});

// ---------- Component tree ----------

describe('SurfaceEngine – component tree', () => {
  it('updateComponents parses JSON and stores', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const json = [
      JSON.stringify({ id: 'root', component: 'Container', children: ['c1', 'c2'] }),
      JSON.stringify({ id: 'c1', component: 'Text', text: 'hello' }),
      JSON.stringify({ id: 'c2', component: 'Button', label: 'ok' }),
    ];
    engine.updateComponents('s1', json);
    const surface = engine.getSurface('s1')!;
    const roots = surface.getRootComponents();
    expect(roots).toHaveLength(1);
    expect(roots[0].id).toBe('root');
    // Children are resolved via the adjacency list
    const children = surface.getChildren('root');
    expect(children).toHaveLength(2);
    expect(children[0].id).toBe('c1');
    expect(children[1].id).toBe('c2');
  });

  it('updateComponents emits updateComponents event with payload', () => {
    const engine = new SurfaceEngine();
    const cap = setup(engine);
    const json = [JSON.stringify({ id: 'c1', component: 'Text' })];
    engine.updateComponents('s1', json);
    expect(cap.events).toHaveLength(1);
    expect(cap.events[0].type).toBe('updateComponents');
    expect(cap.events[0].surfaceId).toBe('s1');
  });

  it('updateComponent does incremental update', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const json = [JSON.stringify({ id: 'root', component: 'Text', text: 'v1' })];
    engine.updateComponents('s1', json);
    // incremental update
    engine.updateComponent('s1', JSON.stringify({ id: 'root', component: 'Text', text: 'v2' }));
    const surface = engine.getSurface('s1')!;
    const roots = surface.getRootComponents();
    expect(roots).toHaveLength(1);
    expect(roots[0].text).toBe('v2');
  });

  it('getRootComponents returns the component with id="root"', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const json = [
      JSON.stringify({ id: 'root', component: 'Container', children: ['child1', 'child2'] }),
      JSON.stringify({ id: 'child1', component: 'Text' }),
      JSON.stringify({ id: 'child2', component: 'Button' }),
    ];
    engine.updateComponents('s1', json);
    const surface = engine.getSurface('s1')!;
    const roots = surface.getRootComponents();
    expect(roots).toHaveLength(1);
    expect(roots[0].id).toBe('root');
  });

  it('getChildren resolves children from parent children field', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const json = [
      JSON.stringify({ id: 'root', component: 'Container', children: ['child1', 'child2'] }),
      JSON.stringify({ id: 'child1', component: 'Text' }),
      JSON.stringify({ id: 'child2', component: 'Button' }),
    ];
    engine.updateComponents('s1', json);
    const surface = engine.getSurface('s1')!;
    const children = surface.getChildren('root');
    expect(children).toHaveLength(2);
    expect(children.map((c: Record<string, unknown>) => c.id)).toEqual(['child1', 'child2']);
  });

  it('malformed component JSON is ignored', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const json = [
      'not-valid-json',
      JSON.stringify({ id: 'root', component: 'Text' }),
    ];
    engine.updateComponents('s1', json);
    const surface = engine.getSurface('s1')!;
    const roots = surface.getRootComponents();
    expect(roots).toHaveLength(1);
    expect(roots[0].id).toBe('root');
  });

  it('component without ID is skipped', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const json = [
      JSON.stringify({ component: 'Text', text: 'no-id' }),
      JSON.stringify({ id: 'root', component: 'Text' }),
    ];
    engine.updateComponents('s1', json);
    const surface = engine.getSurface('s1')!;
    const roots = surface.getRootComponents();
    expect(roots).toHaveLength(1);
    expect(roots[0].id).toBe('root');
  });
});

// ---------- Data model ----------

describe('SurfaceEngine – data model', () => {
  it('updateDataModel sets value at path', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const surface = engine.getSurface('s1')!;
    surface.updateDataModel('/user/name', 'Alice');
    expect(surface.resolveProperties({ path: '/user/name' })).toBe('Alice');
  });

  it('updateDataModel with "/" replaces entire model', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const surface = engine.getSurface('s1')!;
    surface.updateDataModel('/', { foo: 'bar' });
    expect(surface.resolveProperties({ path: '/foo' })).toBe('bar');
  });

  it('updateDataModel creates intermediate objects', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const surface = engine.getSurface('s1')!;
    surface.updateDataModel('/a/b/c', 'deep');
    expect(surface.resolveProperties({ path: '/a/b/c' })).toBe('deep');
  });

  it('appendDataModel appends string to existing', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const surface = engine.getSurface('s1')!;
    surface.updateDataModel('/text', 'hello');
    surface.appendDataModel('/text', ' world');
    expect(surface.resolveProperties({ path: '/text' })).toBe('hello world');
  });

  it('appendDataModel sets value if not existing', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const surface = engine.getSurface('s1')!;
    surface.appendDataModel('/text', 'first');
    expect(surface.resolveProperties({ path: '/text' })).toBe('first');
  });

  it('resolveProperties resolves { path } for array index access', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const surface = engine.getSurface('s1')!;
    surface.updateDataModel('/items/0/name', 'alpha');
    expect(surface.resolveProperties({ path: '/items/0/name' })).toBe('alpha');
  });

  it('resolveProperties returns plain string unchanged', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const surface = engine.getSurface('s1')!;
    expect(surface.resolveProperties('plain text')).toBe('plain text');
  });

  it('resolveProperties returns undefined for missing path', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const surface = engine.getSurface('s1')!;
    expect(surface.resolveProperties({ path: '/does/not/exist' })).toBeUndefined();
  });
});

// ---------- Events ----------

describe('SurfaceEngine – events', () => {
  it('addListener receives events', () => {
    const engine = new SurfaceEngine();
    const cap = captureEvents(engine);
    engine.createSurface('s1', 'c1', {});
    engine.deleteSurface('s1');
    expect(cap.events).toHaveLength(2);
    expect(cap.events[0].type).toBe('createSurface');
    expect(cap.events[1].type).toBe('deleteSurface');
  });

  it('addListener returns unsubscribe function', () => {
    const engine = new SurfaceEngine();
    const events: SurfaceEvent[] = [];
    const unsubscribe = engine.addListener((e) => events.push(e));
    engine.createSurface('s1', 'c1', {});
    unsubscribe();
    engine.createSurface('s2', 'c2', {});
    // Only first event received
    expect(events).toHaveLength(1);
    expect(events[0].surfaceId).toBe('s1');
  });

  it('removeListener stops receiving events', () => {
    const engine = new SurfaceEngine();
    const events: SurfaceEvent[] = [];
    const listener: SurfaceEventListener = (e) => events.push(e);
    engine.addListener(listener);
    engine.createSurface('s1', 'c1', {});
    engine.removeListener(listener);
    engine.createSurface('s2', 'c2', {});
    expect(events).toHaveLength(1);
  });

  it('listener errors are caught and do not break other listeners', () => {
    const engine = new SurfaceEngine();
    const goodEvents: SurfaceEvent[] = [];
    const badListener: SurfaceEventListener = () => {
      throw new Error('boom');
    };
    engine.addListener(badListener);
    engine.addListener((e) => goodEvents.push(e));
    // Should not throw, and good listener still works
    engine.createSurface('s1', 'c1', {});
    expect(goodEvents).toHaveLength(1);
  });
});

// ---------- Sizing ----------

describe('SurfaceEngine – sizing', () => {
  it('onSurfaceSizeChanged stores and retrieves size', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    engine.onSurfaceSizeChanged('s1', { width: 400, height: 600 });
    expect(engine.getSurfaceSize('s1')).toEqual({ width: 400, height: 600 });
  });

  it('getSurfaceSize returns undefined for unknown surface', () => {
    const engine = new SurfaceEngine();
    expect(engine.getSurfaceSize('nope')).toBeUndefined();
  });

  it('setSurfaceSizeProvider sets fallback provider', () => {
    const engine = new SurfaceEngine();
    const provider = (id: string) => (id === 's1' ? { width: 100, height: 200 } : null);
    engine.setSurfaceSizeProvider(provider);
    expect(engine.getSurfaceSizeProvider()).toBe(provider);
    // Provider is used when no cached size exists
    expect(engine.getSurfaceSize('s1')).toEqual({ width: 100, height: 200 });
  });

  it('cached size takes priority over provider', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const provider = () => ({ width: 100, height: 200 } as const);
    engine.setSurfaceSizeProvider(provider);
    // Cache a different size
    engine.onSurfaceSizeChanged('s1', { width: 300, height: 500 });
    expect(engine.getSurfaceSize('s1')).toEqual({ width: 300, height: 500 });
  });

  it('onSurfaceSizeChanged emits surfaceSizeChanged event', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const cap = captureEvents(engine);
    engine.onSurfaceSizeChanged('s1', { width: 400, height: 600 });
    const sizeEvent = cap.events.find((e) => e.type === 'surfaceSizeChanged');
    expect(sizeEvent).toBeDefined();
    expect(sizeEvent!.surfaceId).toBe('s1');
    expect(sizeEvent!.payload).toEqual({ width: 400, height: 600 });
  });
});

// ---------- Theme ----------

describe('SurfaceEngine – theme', () => {
  it('getTheme returns surface theme', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', { primary: '#fff', secondary: '#000' });
    const surface = engine.getSurface('s1')!;
    expect(surface.getTheme()).toEqual({ primary: '#fff', secondary: '#000' });
  });
});

// ---------- Edge cases ----------

describe('SurfaceEngine – edge cases', () => {
  it('operations on non-existent surface are no-ops', () => {
    const engine = new SurfaceEngine();
    const cap = captureEvents(engine);
    // These should not throw
    engine.updateComponents('nope', [JSON.stringify({ id: 'c1', component: 'Text' })]);
    engine.updateComponent('nope', JSON.stringify({ id: 'c1', component: 'Text' }));
    engine.updateDataModel('nope', '/path', 'val');
    engine.appendDataModel('nope', '/path', 'val');
    engine.deleteSurface('nope');
    engine.submitAction('nope', 'c1');
    engine.syncUIToData('nope', 'c1', {});
    // Only the deleteSurface might emit, but it shouldn't for unknown surface
    expect(cap.events).toHaveLength(0);
  });

  it('empty component array is handled', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    engine.updateComponents('s1', []);
    const surface = engine.getSurface('s1')!;
    expect(surface.getRootComponents()).toHaveLength(0);
  });

  it('submitAction emits action event with componentId and context', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const cap = captureEvents(engine);
    engine.submitAction('s1', 'btn1', { extra: true });
    expect(cap.events).toHaveLength(1);
    expect(cap.events[0].type).toBe('action');
    expect(cap.events[0].surfaceId).toBe('s1');
    expect(cap.events[0].payload).toEqual({
      surfaceId: 's1',
      sourceComponentId: 'btn1',
      context: { extra: true },
    });
  });

  it('syncUIToData emits syncUIToData event', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const cap = captureEvents(engine);
    engine.syncUIToData('s1', 'input1', { value: 'typed' });
    expect(cap.events).toHaveLength(1);
    expect(cap.events[0].type).toBe('syncUIToData');
    expect(cap.events[0].surfaceId).toBe('s1');
    expect(cap.events[0].payload).toEqual({
      surfaceId: 's1',
      componentId: 'input1',
      change: { value: 'typed' },
    });
  });
});

// ---------- resolveProperties ----------

describe('SurfaceEngine – resolveProperties', () => {
  it('returns plain string unchanged', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    expect(engine.resolveProperties('s1', 'Hello')).toBe('Hello');
  });

  it('returns number unchanged', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    expect(engine.resolveProperties('s1', 42)).toBe(42);
  });

  it('returns null unchanged', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    expect(engine.resolveProperties('s1', null)).toBeNull();
  });

  it('returns boolean unchanged', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    expect(engine.resolveProperties('s1', true)).toBe(true);
  });

  it('returns value unchanged for unknown surface', () => {
    const engine = new SurfaceEngine();
    const input = { text: 'hello' };
    expect(engine.resolveProperties('nonexistent', input)).toBe(input);
  });

  // ---- A2UI v0.9 { "path": "..." } object binding ----

  it('resolves a { path } object binding to data model value', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    engine.updateDataModel('s1', '/user', { name: 'Dave' });
    expect(engine.resolveProperties('s1', { path: '/user/name' })).toBe('Dave');
  });

  it('resolves { path } binding inside a flat object', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    engine.updateDataModel('s1', '/data', { count: 42 });
    const result = engine.resolveProperties('s1', {
      text: { path: '/data/count' },
      label: 'Static',
    });
    expect(result).toEqual({ text: 42, label: 'Static' });
  });

  it('resolves { path } binding inside nested objects', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    engine.updateDataModel('s1', '/data', { userId: 'u1' });
    const result = engine.resolveProperties('s1', {
      action: {
        event: {
          name: 'click',
          context: { userId: { path: '/data/userId' } },
        },
      },
    });
    expect(result).toEqual({
      action: { event: { name: 'click', context: { userId: 'u1' } } },
    });
  });

  it('resolves { path } binding inside arrays', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    engine.updateDataModel('s1', '/tags', ['React', 'Vue']);
    const result = engine.resolveProperties('s1', {
      items: [{ path: '/tags/0' }, { path: '/tags/1' }, 'Svelte'],
    });
    expect(result).toEqual({ items: ['React', 'Vue', 'Svelte'] });
  });

  it('returns undefined for unresolved { path } binding', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    expect(engine.resolveProperties('s1', { path: '/missing' })).toBeUndefined();
  });

  it('does not treat regular objects with non-string path as binding', () => {
    const engine = new SurfaceEngine();
    engine.createSurface('s1', 'c1', {});
    const input = { path: 123, other: 'value' };
    expect(engine.resolveProperties('s1', input)).toEqual({ path: 123, other: 'value' });
  });
});
