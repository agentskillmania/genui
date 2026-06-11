import { describe, it, expect, beforeEach } from 'vitest';
import { Genui } from '@/GenuiEngine';

describe('GenuiEngine', () => {
  beforeEach(() => {
    // Re-initialize before each test for clean state.
    // The engine is a singleton — initialize resets it.
    Genui.initialize();
  });

  // ---- initialize ----

  describe('initialize', () => {
    it('should set initialized flag to true', () => {
      expect(Genui.isInitialized()).toBe(true);
    });

    it('should return void (synchronous, not async)', () => {
      const result = Genui.initialize();
      expect(result).toBeUndefined();
    });

    it('should accept optional config with themeConfig', () => {
      Genui.initialize({ themeConfig: { primaryColor: '#1890ff' } });
      // Verify it doesn't throw and isInitialized is still true
      expect(Genui.isInitialized()).toBe(true);
    });

    it('should accept optional config with designTokenConfig', () => {
      expect(() => {
        Genui.initialize({ designTokenConfig: { borderRadius: 4 } });
      }).not.toThrow();
      expect(Genui.isInitialized()).toBe(true);
    });
  });

  // ---- isInitialized ----

  describe('isInitialized', () => {
    it('should return true after initialization', () => {
      expect(Genui.isInitialized()).toBe(true);
    });
  });

  // ---- registerFunction ----

  describe('registerFunction', () => {
    it('should store a function handler and return true', () => {
      const handler = (params: Record<string, unknown>) => params;
      expect(Genui.registerFunction('testFn', handler)).toBe(true);
      expect(Genui.getFunction('testFn')).toBe(handler);
    });

    it('should overwrite existing handler on re-registration', () => {
      const handler1 = () => 'v1';
      const handler2 = () => 'v2';
      Genui.registerFunction('overwritten', handler1);
      Genui.registerFunction('overwritten', handler2);
      expect(Genui.getFunction('overwritten')).toBe(handler2);
    });
  });

  // ---- unregisterFunction ----

  describe('unregisterFunction', () => {
    it('should remove a registered handler and return true', () => {
      const handler = () => 'gone';
      Genui.registerFunction('toRemove', handler);
      expect(Genui.unregisterFunction('toRemove')).toBe(true);
      expect(Genui.getFunction('toRemove')).toBeUndefined();
    });

    it('should return true when unregistering a non-existent function', () => {
      expect(Genui.unregisterFunction('nonExistent')).toBe(true);
    });
  });

  // ---- getFunction ----

  describe('getFunction', () => {
    it('should retrieve a registered handler by name', () => {
      const handler = (p: Record<string, unknown>) => p;
      Genui.registerFunction('getFn', handler);
      expect(Genui.getFunction('getFn')).toBe(handler);
    });

    it('should return undefined for unregistered function', () => {
      expect(Genui.getFunction('noSuchFn')).toBeUndefined();
    });
  });

  // ---- setDayNightMode ----

  describe('setDayNightMode', () => {
    it('should accept light mode without error', () => {
      Genui.setDayNightMode('light');
      // Verify the engine still functions after mode change
      expect(Genui.isInitialized()).toBe(true);
    });

    it('should accept dark mode without error', () => {
      Genui.setDayNightMode('dark');
      expect(Genui.isInitialized()).toBe(true);
    });

    it('should override previous mode when called again', () => {
      Genui.setDayNightMode('light');
      Genui.setDayNightMode('dark');
      // Engine should still be functional
      expect(Genui.isInitialized()).toBe(true);
    });
  });

  // ---- getEngineVersion ----

  describe('getEngineVersion', () => {
    it('should return the exact semver version string', () => {
      const version = Genui.getEngineVersion();
      expect(version).toBe('0.1.0');
    });

    it('should always return the same version on repeated calls', () => {
      expect(Genui.getEngineVersion()).toBe(Genui.getEngineVersion());
    });
  });

  // ---- Negative paths ----

  describe('negative paths', () => {
    it('should return undefined for getFunction with empty string name', () => {
      expect(Genui.getFunction('')).toBeUndefined();
    });

    it('should allow registering a function with empty string name', () => {
      const handler = () => 'empty';
      expect(Genui.registerFunction('', handler)).toBe(true);
      expect(Genui.getFunction('')).toBe(handler);
    });

    it('should allow unregistering a function with empty string name', () => {
      Genui.registerFunction('', () => 'x');
      expect(Genui.unregisterFunction('')).toBe(true);
      expect(Genui.getFunction('')).toBeUndefined();
    });

    it('should not affect other functions when unregistering a different name', () => {
      const handler = () => 'kept';
      Genui.registerFunction('keep', handler);
      Genui.unregisterFunction('remove');
      expect(Genui.getFunction('keep')).toBe(handler);
    });

    it('should handle registerFunction with a handler that returns various types', () => {
      const nullHandler = () => null;
      const undefinedHandler = () => undefined;
      const asyncHandler = async () => 'result';

      Genui.registerFunction('nullFn', nullHandler);
      Genui.registerFunction('undefinedFn', undefinedHandler);
      Genui.registerFunction('asyncFn', asyncHandler as () => unknown);

      expect(Genui.getFunction('nullFn')).toBe(nullHandler);
      expect(Genui.getFunction('undefinedFn')).toBe(undefinedHandler);
      expect(Genui.getFunction('asyncFn')).toBe(asyncHandler as () => unknown);
    });
  });
});
