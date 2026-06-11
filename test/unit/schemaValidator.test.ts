import { describe, it, expect } from 'vitest';
import {
  validateA2UIMessage,
  classifyA2UIEvent,
  createSurfaceSchema,
  updateComponentsSchema,
  updateDataModelSchema,
  appendDataModelSchema,
  deleteSurfaceSchema,
} from '../../src/tools/schemaValidator';

describe('schemaValidator', () => {
  // --- Individual schemas ---

  describe('createSurfaceSchema', () => {
    it('validates a valid createSurface message', () => {
      const result = createSurfaceSchema.safeParse({
        version: 'v0.9',
        createSurface: { surfaceId: 's1', catalogId: 'cat1', theme: { mode: 'dark' } },
      });
      expect(result.success).toBe(true);
    });

    it('rejects message without surfaceId', () => {
      const result = createSurfaceSchema.safeParse({
        version: 'v0.9',
        createSurface: { catalogId: 'cat1' },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateComponentsSchema', () => {
    it('validates a valid updateComponents message', () => {
      const result = updateComponentsSchema.safeParse({
        version: 'v0.9',
        updateComponents: { surfaceId: 's1', components: [{ id: 'c1', component: 'Text' }] },
      });
      expect(result.success).toBe(true);
    });

    it('rejects message without components array', () => {
      const result = updateComponentsSchema.safeParse({
        version: 'v0.9',
        updateComponents: { surfaceId: 's1' },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateDataModelSchema', () => {
    it('validates a valid updateDataModel message', () => {
      const result = updateDataModelSchema.safeParse({
        version: 'v0.9',
        updateDataModel: { surfaceId: 's1', path: '/data', value: 42 },
      });
      expect(result.success).toBe(true);
    });
  });

  describe('appendDataModelSchema', () => {
    it('validates a valid appendDataModel message', () => {
      const result = appendDataModelSchema.safeParse({
        version: 'v0.9',
        appendDataModel: { surfaceId: 's1', path: '/text', value: 'more text' },
      });
      expect(result.success).toBe(true);
    });
  });

  describe('deleteSurfaceSchema', () => {
    it('validates a valid deleteSurface message', () => {
      const result = deleteSurfaceSchema.safeParse({
        version: 'v0.9',
        deleteSurface: { surfaceId: 's1' },
      });
      expect(result.success).toBe(true);
    });
  });

  // --- Unified validation ---

  describe('validateA2UIMessage', () => {
    it('returns valid:true for a createSurface message', () => {
      expect(validateA2UIMessage({
        version: 'v0.9',
        createSurface: { surfaceId: 's1', catalogId: 'cat1' },
      })).toEqual({ valid: true });
    });

    it('returns valid:true for an updateComponents message', () => {
      expect(validateA2UIMessage({
        version: 'v0.9',
        updateComponents: { surfaceId: 's1', components: [{ id: 'c1', component: 'Text' }] },
      })).toEqual({ valid: true });
    });

    it('returns valid:true for an updateDataModel message', () => {
      expect(validateA2UIMessage({
        version: 'v0.9',
        updateDataModel: { surfaceId: 's1', path: '/', value: null },
      })).toEqual({ valid: true });
    });

    it('returns valid:false for unknown message type', () => {
      const result = validateA2UIMessage({ foo: 'bar' });
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it('returns valid:false for null input', () => {
      const result = validateA2UIMessage(null);
      expect(result.valid).toBe(false);
    });

    it('returns valid:false for string input', () => {
      const result = validateA2UIMessage('not json');
      expect(result.valid).toBe(false);
    });
  });

  // --- Version requirement ---

  describe('version requirement', () => {
    it('rejects message without version field', () => {
      const result = validateA2UIMessage({
        createSurface: { surfaceId: 's1', catalogId: 'cat1' },
      });
      expect(result.valid).toBe(false);
    });

    it('rejects message with wrong version', () => {
      const result = validateA2UIMessage({
        version: 'v0.8',
        createSurface: { surfaceId: 's1', catalogId: 'cat1' },
      });
      expect(result.valid).toBe(false);
    });
  });

  // --- Component field ---

  describe('component field', () => {
    it('requires component field in component objects', () => {
      const result = updateComponentsSchema.safeParse({
        version: 'v0.9',
        updateComponents: {
          surfaceId: 's1',
          components: [{ id: 'c1', type: 'Text' }],
        },
      });
      expect(result.success).toBe(false);
    });
  });

  // --- Event classification ---

  describe('classifyA2UIEvent', () => {
    it('classifies createSurface', () => {
      expect(classifyA2UIEvent({ createSurface: {} })).toBe('CreateSurface');
    });

    it('classifies updateComponents', () => {
      expect(classifyA2UIEvent({ updateComponents: {} })).toBe('UpdateComponents');
    });

    it('classifies updateDataModel', () => {
      expect(classifyA2UIEvent({ updateDataModel: {} })).toBe('UpdateDataModel');
    });

    it('classifies appendDataModel', () => {
      expect(classifyA2UIEvent({ appendDataModel: {} })).toBe('AppendDataModel');
    });

    it('classifies deleteSurface', () => {
      expect(classifyA2UIEvent({ deleteSurface: {} })).toBe('DeleteSurface');
    });

    it('returns null for unknown event', () => {
      expect(classifyA2UIEvent({ unknown: {} })).toBeNull();
    });
  });
});
