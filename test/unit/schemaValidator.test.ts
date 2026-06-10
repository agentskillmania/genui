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
        createSurface: { surfaceId: 's1', catalogId: 'cat1', theme: { mode: 'dark' } },
      });
      expect(result.success).toBe(true);
    });

    it('rejects message without surfaceId', () => {
      const result = createSurfaceSchema.safeParse({
        createSurface: { catalogId: 'cat1' },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateComponentsSchema', () => {
    it('validates a valid updateComponents message', () => {
      const result = updateComponentsSchema.safeParse({
        updateComponents: { surfaceId: 's1', components: [{ id: 'c1', type: 'Text' }] },
      });
      expect(result.success).toBe(true);
    });

    it('rejects message without components array', () => {
      const result = updateComponentsSchema.safeParse({
        updateComponents: { surfaceId: 's1' },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateDataModelSchema', () => {
    it('validates a valid updateDataModel message', () => {
      const result = updateDataModelSchema.safeParse({
        updateDataModel: { surfaceId: 's1', path: '/data', value: 42 },
      });
      expect(result.success).toBe(true);
    });
  });

  describe('appendDataModelSchema', () => {
    it('validates a valid appendDataModel message', () => {
      const result = appendDataModelSchema.safeParse({
        appendDataModel: { surfaceId: 's1', path: '/text', value: 'more text' },
      });
      expect(result.success).toBe(true);
    });
  });

  describe('deleteSurfaceSchema', () => {
    it('validates a valid deleteSurface message', () => {
      const result = deleteSurfaceSchema.safeParse({
        deleteSurface: { surfaceId: 's1' },
      });
      expect(result.success).toBe(true);
    });
  });

  // --- Unified validation ---

  describe('validateA2UIMessage', () => {
    it('returns valid:true for a createSurface message', () => {
      expect(validateA2UIMessage({
        createSurface: { surfaceId: 's1' },
      })).toEqual({ valid: true });
    });

    it('returns valid:true for an updateComponents message', () => {
      expect(validateA2UIMessage({
        updateComponents: { surfaceId: 's1', components: [] },
      })).toEqual({ valid: true });
    });

    it('returns valid:true for an updateDataModel message', () => {
      expect(validateA2UIMessage({
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
