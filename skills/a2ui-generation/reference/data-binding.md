# Data Binding

## Core Rules

- `updateComponents` contains only structure, not concrete business values
- Dynamic values always use binding paths
- All binding paths use `/` as the separator, never dot notation

## Absolute Path Binding

Example:

```json
{"id": "t1", "component": "Text", "text": {"path": "/page/title"}}
```

```json
{"updateDataModel": {"path": "/page", "value": {"title": "Hello World"}}}
```

Rules:

- Absolute paths must use `/` as the separator, e.g. `/page/title`
- Do not write `/page.title`
- Nested fields also use `/`, e.g. `/fuelCard/labels/availableLiters`

## Dynamic Template Binding

Both `List` and `Column` can drive child components from data. Template components use relative paths internally.

```json
{"id": "list1", "component": "List", "children": {"path": "/data/items", "componentId": "item_tpl"}}
{"id": "item_tpl", "component": "Text", "text": {"path": "name"}}
```

```json
{"updateDataModel": {"path": "/data/items", "value": [{"name": "Item A"}, {"name": "Item B"}]}}
```

Relative path rules:

- Simple field: `name`
- Nested field: `labels/availableLiters`
- Do not write `labels.availableLiters`

## Advanced Component List Binding

For protocol-level compatibility understanding: list-type attributes in advanced components typically use a string path directly, and element field mapping uses relative paths:

```json
{"component": "<advanced_component>", "items": "/cg/items", "itemTitle": {"path": "title"}}
```

Common list-type attribute names:

- `items`
- `cards`
- `contents`
- `segments`
- `tips`
- `tags`

## updateDataModel Shape

Standard structure:

```json
{
  "version": "v0.9",
  "updateDataModel": {
    "surfaceId": "sample_surface",
    "path": "/root_path",
    "value": {}
  }
}
```

Rules:

- `path` must start with `/`
- `path` must not use dot notation
- `value` must be semantically consistent with `path`

## Function Call Binding

Beyond path bindings, any property value can invoke a registered function and
bind to its return value using the `{"call": ..., "args": ...}` shape:

```json
{"id": "t1", "component": "Text", "text": {"call": "formatPrice", "args": {"amount": 99.5}}}
```

Rules:

- `call` must be a name registered via `Genui.registerFunction(name, handler)`
  on the host before the surface renders it
- Only **synchronous** handlers are supported in binding resolution — the
  handler receives `args` and returns a value directly. Async handlers
  (those accepting a callback) emit a `console.warn` and resolve to `undefined`
- `args` itself is resolved recursively, so it may contain path bindings:

```json
{"text": {"call": "upper", "args": {"input": {"path": "/user/name"}}}}
```

- If no resolver is configured or the handler is missing, the binding resolves
  to `undefined` and a warning is logged — it never throws
- Function call bindings are an advanced/host-integration feature; the A2UI
  JSON stays fully declarative, the host owns the handler implementations

## Binding Reminders

- Design the component tree first, then map data — do not hard-code values into components
- List templates prefer relative paths — do not write array element fields as absolute paths
- Any occurrence of `/foo.bar` or `labels.availableLiters`-style paths is an error
