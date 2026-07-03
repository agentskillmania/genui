import { describe, it, expect, beforeAll } from 'vitest';
import { exportCatalog } from '../../src/tools/catalogExport';
import { registerComponent, getRegisteredTypes } from '../../src/components/registry';
import React from 'react';

// Register a few components manually to test catalog export
// (avoid importing components/index which triggers lottie-web canvas errors)
beforeAll(() => {
  registerComponent('Text', () => React.createElement('div'));
  registerComponent('Button', () => React.createElement('button'));
  registerComponent('Chart', () => React.createElement('div'));
});

describe('catalogExport (A2UI v0.9)', () => {
  it('output has $schema field with JSON Schema draft URI', () => {
    const catalog = exportCatalog();
    expect(catalog.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
  });

  it('output has catalogId with https:// prefix', () => {
    const catalog = exportCatalog();
    expect(catalog.catalogId).toMatch(/^https:\/\//);
  });

  it('output has $id matching catalogId', () => {
    const catalog = exportCatalog();
    expect(catalog.$id).toBe(catalog.catalogId);
  });

  it('output has components object keyed by component name (not array)', () => {
    const catalog = exportCatalog();
    expect(typeof catalog.components).toBe('object');
    expect(Array.isArray(catalog.components)).toBe(false);
    expect(catalog.components).toHaveProperty('Text');
    expect(catalog.components).toHaveProperty('Button');
    expect(catalog.components).toHaveProperty('Chart');
  });

  it('each component schema has type=object and a const discriminator', () => {
    const catalog = exportCatalog();
    const textSchema = catalog.components['Text'] as Record<string, unknown>;
    expect(textSchema.type).toBe('object');
    expect(textSchema.properties).toBeDefined();
    const props = textSchema.properties as Record<string, unknown>;
    expect((props['component'] as Record<string, unknown>).const).toBe('Text');
  });

  it('output has functions section with standard A2UI functions', () => {
    const catalog = exportCatalog();
    expect(catalog.functions).toBeDefined();
    expect(typeof catalog.functions).toBe('object');
    expect(catalog.functions).toHaveProperty('required');
    expect(catalog.functions).toHaveProperty('email');
    expect(catalog.functions).toHaveProperty('formatString');
    expect(catalog.functions).toHaveProperty('openUrl');
  });

  it('output has theme schema with primaryColor', () => {
    const catalog = exportCatalog();
    expect(catalog.theme).toBeDefined();
    const theme = catalog.theme as Record<string, unknown>;
    expect(theme.type).toBe('object');
    const themeProps = theme.properties as Record<string, unknown>;
    expect(themeProps['primaryColor']).toBeDefined();
    const primaryColor = themeProps['primaryColor'] as Record<string, unknown>;
    expect(primaryColor.pattern).toBe('^#[0-9a-fA-F]{6}$');
  });

  it('output has $defs with anyComponent using oneOf and discriminator', () => {
    const catalog = exportCatalog();
    expect(catalog.$defs).toBeDefined();
    expect(catalog.$defs.anyComponent).toBeDefined();
    const anyComp = catalog.$defs.anyComponent as Record<string, unknown>;
    expect(Array.isArray(anyComp.oneOf)).toBe(true);
    expect(anyComp.discriminator).toEqual({ propertyName: 'component' });
  });

  it('output has $defs with anyFunction', () => {
    const catalog = exportCatalog();
    const anyFunc = catalog.$defs.anyFunction as Record<string, unknown>;
    expect(Array.isArray(anyFunc.oneOf)).toBe(true);
    expect(anyFunc.oneOf.length).toBeGreaterThanOrEqual(4);
  });

  it('all registered components are included in components map', () => {
    const registered = getRegisteredTypes();
    const catalog = exportCatalog();
    for (const type of registered) {
      expect(catalog.components).toHaveProperty(type);
    }
  });

  it('each registered component has a non-empty description', () => {
    const catalog = exportCatalog();
    for (const [, schema] of Object.entries(catalog.components)) {
      const comp = schema as Record<string, unknown>;
      expect(typeof comp.description).toBe('string');
      expect((comp.description as string).length).toBeGreaterThan(0);
    }
  });

  it('includes built-in descriptions for known types', () => {
    const catalog = exportCatalog();
    const text = catalog.components['Text'] as Record<string, unknown>;
    expect(text.description).toContain('Typography');

    const chart = catalog.components['Chart'] as Record<string, unknown>;
    expect(chart.description).toContain('chart');
  });

  it('includes property schemas for components that define them', () => {
    const catalog = exportCatalog();
    const text = catalog.components['Text'] as Record<string, unknown>;
    const props = text.properties as Record<string, unknown>;
    expect(props['text']).toBeDefined();
    expect(props['variant']).toBeDefined();
  });

  // ---- Negative / edge-case paths ----

  describe('negative paths', () => {
    it('should produce valid catalog even with empty name', () => {
      const catalog = exportCatalog('', '0.0.0');
      expect(catalog.title).toBe('');
      expect(catalog.catalogId).toBe('https://genui.dev/catalogs//0.0.0');
      expect(typeof catalog.components).toBe('object');
    });

    it('should use fallback description for types not in BUILTIN_DESCRIPTIONS', () => {
      // Register a component type that has no BUILTIN_DESCRIPTIONS entry
      registerComponent('CustomWidget', () => React.createElement('div'));
      const catalog = exportCatalog();
      const widget = catalog.components['CustomWidget'] as Record<string, unknown>;
      expect(widget).toBeDefined();
      expect(widget.description).toBe('Custom component: CustomWidget');
    });

    it('every component must have a non-empty description', () => {
      const catalog = exportCatalog();
      for (const [, schema] of Object.entries(catalog.components)) {
        const comp = schema as Record<string, unknown>;
        expect((comp.description as string).length).toBeGreaterThan(0);
      }
    });
  });

  // ---- Custom name/version ----

  describe('custom name and version', () => {
    it('accepts custom name and version and reflects them in catalogId', () => {
      const catalog = exportCatalog('my-catalog', '2.0.0');
      expect(catalog.title).toBe('my-catalog');
      expect(catalog.catalogId).toBe('https://genui.dev/catalogs/my-catalog/2.0.0');
      expect(catalog.$id).toBe('https://genui.dev/catalogs/my-catalog/2.0.0');
      expect(catalog.description).toContain('my-catalog');
      expect(catalog.description).toContain('2.0.0');
    });
  });

  // ---- BUG3: $ref must point to real definitions ----

  describe('BUG3: anyComponent $ref resolves to actual definitions', () => {
    it('every $ref in anyComponent.oneOf points to a component that exists', () => {
      const catalog = exportCatalog();
      const anyComp = catalog.$defs.anyComponent as Record<string, unknown>;
      const refs = anyComp.oneOf as Array<{ $ref: string }>;

      for (const ref of refs) {
        // Resolve the JSON pointer: #/components/Text → catalog.components.Text
        const pointer = ref.$ref.replace(/^#\//, '');
        const parts = pointer.split('/');
        let target: unknown = catalog;
        for (const part of parts) {
          target = (target as Record<string, unknown>)[part];
        }
        expect(target).toBeDefined();
      }
    });

    it('$ref does NOT point to non-existent componentSchemas', () => {
      const catalog = exportCatalog();
      const anyComp = catalog.$defs.anyComponent as Record<string, unknown>;
      const refs = anyComp.oneOf as Array<{ $ref: string }>;
      for (const ref of refs) {
        expect(ref.$ref).not.toContain('componentSchemas');
      }
    });
  });
});
