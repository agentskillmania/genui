/**
 * A2UI message schema validation using Zod.
 * Validates incoming A2UI protocol messages to catch malformed LLM output early.
 */

import { z } from 'zod';

/** Schema for a surface creation message */
export const createSurfaceSchema = z.object({
  createSurface: z.object({
    surfaceId: z.string().min(1),
    catalogId: z.string().optional(),
    theme: z.record(z.string(), z.unknown()).optional(),
  }),
});

/** Schema for a component update message */
export const updateComponentsSchema = z.object({
  updateComponents: z.object({
    surfaceId: z.string().min(1),
    components: z.array(z.unknown()),
  }),
});

/** Schema for a data model update message */
export const updateDataModelSchema = z.object({
  updateDataModel: z.object({
    surfaceId: z.string().min(1),
    path: z.string(),
    value: z.unknown(),
  }),
});

/** Schema for a data model append message */
export const appendDataModelSchema = z.object({
  appendDataModel: z.object({
    surfaceId: z.string().min(1),
    path: z.string(),
    value: z.unknown(),
  }),
});

/** Schema for a surface deletion message */
export const deleteSurfaceSchema = z.object({
  deleteSurface: z.object({
    surfaceId: z.string().min(1),
  }),
});

/** Union of all A2UI message schemas */
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
