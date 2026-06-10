/**
 * Component registry.
 * Maps GenUI component type strings to React component renderers.
 */

import type { ComponentRenderer } from './types';

const registry = new Map<string, ComponentRenderer>();

/**
 * Register a component renderer for a given type.
 */
export function registerComponent(type: string, renderer: ComponentRenderer): void {
  registry.set(type, renderer);
}

/**
 * Retrieve the renderer for a registered component type.
 */
export function getComponentRenderer(type: string): ComponentRenderer | undefined {
  return registry.get(type);
}

/**
 * Check whether a component type has been registered.
 */
export function hasComponent(type: string): boolean {
  return registry.has(type);
}

/**
 * Return all registered component type strings.
 */
export function getRegisteredTypes(): string[] {
  return Array.from(registry.keys());
}
