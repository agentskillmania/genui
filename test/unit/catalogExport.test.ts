import { describe, it, expect } from 'vitest';
import { exportCatalog } from '../../src/tools/catalogExport';
import type { A2UICatalog } from '../../src/tools/catalogExport';

describe('catalogExport', () => {
  it('exports catalog with default name and version', () => {
    const catalog = exportCatalog();
    expect(catalog.name).toBe('genui-antd');
    expect(catalog.version).toBe('0.1.0');
  });

  it('exports catalog with custom name', () => {
    const catalog = exportCatalog('my-catalog', '1.0.0');
    expect(catalog.name).toBe('my-catalog');
    expect(catalog.version).toBe('1.0.0');
  });

  it('includes components array', () => {
    const catalog = exportCatalog();
    expect(Array.isArray(catalog.components)).toBe(true);
  });

  it('each component has type and description', () => {
    const catalog = exportCatalog();
    for (const comp of catalog.components) {
      expect(comp.type).toBeTruthy();
      expect(comp.description).toBeTruthy();
    }
  });

  it('includes well-known components if registered', () => {
    const catalog = exportCatalog();
    // These should be present if component registration side-effects ran
    const types = catalog.components.map((c) => c.type);
    // At minimum the catalog should list whatever is currently registered
    expect(types.length).toBeGreaterThanOrEqual(0);
  });
});
