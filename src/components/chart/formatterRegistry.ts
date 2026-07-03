/**
 * Chart tooltip formatter registry.
 *
 * ECharts `tooltip.formatter` accepts a function, but JSON DSL cannot encode
 * functions. Consumers register named formatter presets (e.g. `"money"`,
 * `"percent"`) via `registerFormatter`, then reference them by name in the DSL:
 *
 *   { "component": "Chart", "config": { "tooltip": { "formatter": "money" } } }
 *
 * `buildEChartsOption` resolves the name to the real function at render time.
 */

/** ECharts tooltip formatter signature (loosely typed to stay JSON-agnostic). */
export type EChartsFormatter = (params: unknown) => string;

const registry = new Map<string, EChartsFormatter>();

/**
 * Register a named tooltip formatter preset.
 * Later registrations under the same name overwrite earlier ones.
 */
export function registerFormatter(name: string, fn: EChartsFormatter): void {
  registry.set(name, fn);
}

/**
 * Retrieve a registered formatter by name.
 * Returns `undefined` if the name is not registered (callers should fall back
 * to a sensible default rather than throwing).
 */
export function getFormatter(name: string): EChartsFormatter | undefined {
  return registry.get(name);
}

/** Check whether a formatter name has been registered. */
export function hasFormatter(name: string): boolean {
  return registry.has(name);
}

/** Return all registered formatter names (useful for debugging / catalog export). */
export function getRegisteredFormatters(): string[] {
  return Array.from(registry.keys());
}

// ===== Built-in presets (business-agnostic) =====
// Business-specific formatters (e.g. "万元") are registered by consumers,
// not baked into the library.

registerFormatter('percent', (p) => {
  const value = extractValue(p);
  return `${value}%`;
});

registerFormatter('thousands', (p) => {
  const value = extractValue(p);
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString() : String(value);
});

/**
 * Pull a numeric value out of an ECharts tooltip params payload.
 * Handles both single-series (`params.value`) and multi-series axis tooltips
 * (`params` is an array, use the first entry).
 */
function extractValue(p: unknown): unknown {
  if (Array.isArray(p)) {
    return extractValue(p[0]);
  }
  if (p && typeof p === 'object' && 'value' in p) {
    const value = (p as { value: unknown }).value;
    // Scatter/heatmap value is an array — take the last element (the y/value).
    return Array.isArray(value) ? value[value.length - 1] : value;
  }
  return p;
}
