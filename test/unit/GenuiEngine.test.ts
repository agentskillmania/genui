import { describe, it, expect, beforeEach } from 'vitest';
import { Genui } from '@/GenuiEngine';

describe('GenuiEngine', () => {
  beforeEach(() => {
    // Re-initialize before each test for clean state
    // The engine is a singleton, so tests share state — but initialize resets it
  });

  describe('initialize', () => {
    it('should set initialized flag', () => {
      Genui.initialize();
      expect(Genui.isInitialized()).toBe(true);
    });

    it('should be synchronous (not async)', () => {
      // If initialize returns a Promise, this check ensures it's resolved sync
      const result = Genui.initialize();
      // Should not be a thenable — it returns void
      expect(result).toBeUndefined();
    });

    it('should accept optional config', () => {
      expect(() => {
        Genui.initialize({
          themeConfig: { primaryColor: '#1890ff' },
        });
      }).not.toThrow();
    });
  });

  describe('isInitialized', () => {
    it('should return true after initialization', () => {
      Genui.initialize();
      expect(Genui.isInitialized()).toBe(true);
    });
  });

  describe('registerFunction', () => {
    beforeEach(() => {
      Genui.initialize();
    });

    it('should store a function handler', () => {
      const handler = (params: Record<string, unknown>) => params;
      const result = Genui.registerFunction('testFn', handler);
      expect(result).toBe(true);
      expect(Genui.getFunction('testFn')).toBe(handler);
    });

    it('should return true when registration succeeds', () => {
      const result = Genui.registerFunction('newFn', () => 'ok');
      expect(result).toBe(true);
    });

    it('should overwrite existing handler on re-registration', () => {
      const handler1 = () => 'v1';
      const handler2 = () => 'v2';
      Genui.registerFunction('overwritten', handler1);
      Genui.registerFunction('overwritten', handler2);
      expect(Genui.getFunction('overwritten')).toBe(handler2);
    });
  });

  describe('unregisterFunction', () => {
    beforeEach(() => {
      Genui.initialize();
    });

    it('should remove a registered handler', () => {
      Genui.registerFunction('toRemove', () => 'gone');
      const result = Genui.unregisterFunction('toRemove');
      expect(result).toBe(true);
      expect(Genui.getFunction('toRemove')).toBeUndefined();
    });

    it('should return true for non-existent function', () => {
      const result = Genui.unregisterFunction('nonExistent');
      expect(result).toBe(true);
    });
  });

  describe('getFunction', () => {
    beforeEach(() => {
      Genui.initialize();
    });

    it('should retrieve a registered handler', () => {
      const handler = (p: Record<string, unknown>) => p;
      Genui.registerFunction('getFn', handler);
      expect(Genui.getFunction('getFn')).toBe(handler);
    });

    it('should return undefined for unregistered function', () => {
      expect(Genui.getFunction('noSuchFn')).toBeUndefined();
    });
  });

  describe('setDayNightMode', () => {
    it('should not crash when called', () => {
      expect(() => {
        Genui.setDayNightMode('light');
      }).not.toThrow();
      expect(() => {
        Genui.setDayNightMode('dark');
      }).not.toThrow();
    });
  });

  describe('getEngineVersion', () => {
    it('should return a version string', () => {
      const version = Genui.getEngineVersion();
      expect(typeof version).toBe('string');
      expect(version.length).toBeGreaterThan(0);
    });
  });
});
