/**
 * A2UI v0.9 message schema validation using Zod.
 * Validates incoming A2UI protocol messages against the v0.9 spec.
 * @see https://a2ui.org/specification/v0.9-a2ui/
 */

import { z } from 'zod';

/** A2UI protocol version — must be present in every message */
export const A2UI_VERSION = 'v0.9' as const;

/** Schema for a surface creation message */
export const createSurfaceSchema = z.object({
  version: z.literal(A2UI_VERSION),
  createSurface: z.object({
    surfaceId: z.string().min(1),
    catalogId: z.string().min(1),
    theme: z.record(z.string(), z.unknown()).optional(),
    sendDataModel: z.boolean().optional(),
  }),
});

/** Schema for a component within an updateComponents message */
export const componentSchema = z.object({
  id: z.string().min(1),
  component: z.string().min(1),
  child: z.string().optional(),
  children: z.union([
    z.array(z.string()),
    z.object({ path: z.string(), componentId: z.string() }),
  ]).optional(),
  action: z.unknown().optional(),
}).passthrough();

/** Schema for a component update message */
export const updateComponentsSchema = z.object({
  version: z.literal(A2UI_VERSION),
  updateComponents: z.object({
    surfaceId: z.string().min(1),
    components: z.array(componentSchema),
  }),
});

/** Schema for a data model update message */
export const updateDataModelSchema = z.object({
  version: z.literal(A2UI_VERSION),
  updateDataModel: z.object({
    surfaceId: z.string().min(1),
    path: z.string().optional(),
    value: z.unknown().optional(),
  }),
});

/** Schema for a data model append message (GenUI extension) */
export const appendDataModelSchema = z.object({
  version: z.literal(A2UI_VERSION),
  appendDataModel: z.object({
    surfaceId: z.string().min(1),
    path: z.string(),
    value: z.unknown(),
  }),
});

/** Schema for a surface deletion message */
export const deleteSurfaceSchema = z.object({
  version: z.literal(A2UI_VERSION),
  deleteSurface: z.object({
    surfaceId: z.string().min(1),
  }),
});

/** Union of all A2UI v0.9 message schemas */
export const a2uiMessageSchema = z.union([
  createSurfaceSchema,
  updateComponentsSchema,
  updateDataModelSchema,
  appendDataModelSchema,
  deleteSurfaceSchema,
]);

/** Validate an A2UI message against known schemas */
export function validateA2UIMessage(json: unknown): { valid: boolean; errors?: string[] } {
  const result = a2uiMessageSchema.safeParse(json);
  if (result.success) {
    return { valid: true };
  }

  const errors = result.error.issues.map(
    (issue) => `${issue.path.join('.')}: ${issue.message}`
  );
  return { valid: false, errors };
}

/** Classify the event type of a valid A2UI message */
export function classifyA2UIEvent(json: Record<string, unknown>): string | null {
  if ('createSurface' in json) return 'CreateSurface';
  if ('updateComponents' in json) return 'UpdateComponents';
  if ('updateDataModel' in json) return 'UpdateDataModel';
  if ('appendDataModel' in json) return 'AppendDataModel';
  if ('deleteSurface' in json) return 'DeleteSurface';
  return null;
}
