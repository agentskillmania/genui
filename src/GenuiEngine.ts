/**
 * GenuiEngine — lightweight singleton engine for the GenUI runtime.
 * No WASM, no async init. Replaces the old AGenUI singleton.
 *
 * Manages global engine state: theme config, function handlers, and initialization.
 */

import type { GenuiConfig, FunctionHandler } from './types/sdk';

/** Engine version following semver */
const ENGINE_VERSION = '0.1.0';

/**
 * Core engine class. Not exported directly — use the Genui singleton facade.
 */
class GenuiEngineCore {
  private initialized = false;
  private themeConfig: Record<string, unknown> | null = null;
  private functions = new Map<string, FunctionHandler>();

  /**
   * Initialize the engine with optional configuration.
   * Synchronous — no async init required.
   */
  initialize(config?: GenuiConfig): void {
    this.initialized = true;
    if (config?.themeConfig) {
      this.themeConfig = config.themeConfig;
    }
  }

  /**
   * Check whether the engine has been initialized.
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Set the day/night mode for theme rendering.
   */
  setDayNightMode(mode: 'light' | 'dark'): void {
    this.themeConfig = { ...this.themeConfig, mode };
  }

  /**
   * Register a named function handler.
   * Returns true on success.
   */
  registerFunction(name: string, handler: FunctionHandler): boolean {
    this.functions.set(name, handler);
    return true;
  }

  /**
   * Unregister a named function handler.
   * Returns true on success (even if the function was not registered).
   */
  unregisterFunction(name: string): boolean {
    this.functions.delete(name);
    return true;
  }

  /**
   * Retrieve a registered function handler by name.
   * Returns undefined if not found.
   */
  getFunction(name: string): FunctionHandler | undefined {
    return this.functions.get(name);
  }

  /**
   * Get the engine version string.
   */
  getEngineVersion(): string {
    return ENGINE_VERSION;
  }
}

/** Singleton engine instance */
const engine = new GenuiEngineCore();

/**
 * Public facade for the GenUI engine.
 * All methods delegate to the internal singleton.
 */
export const Genui = {
  initialize: (config?: GenuiConfig): void => engine.initialize(config),
  isInitialized: (): boolean => engine.isInitialized(),
  setDayNightMode: (mode: 'light' | 'dark'): void => engine.setDayNightMode(mode),
  registerFunction: (name: string, handler: FunctionHandler): boolean =>
    engine.registerFunction(name, handler),
  unregisterFunction: (name: string): boolean => engine.unregisterFunction(name),
  getFunction: (name: string): FunctionHandler | undefined => engine.getFunction(name),
  getEngineVersion: (): string => engine.getEngineVersion(),
};
