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

Both `List` and `Column` can drive child components from data. The engine expands the template for each data item — components themselves do not need to handle the expansion. Template components use relative paths internally.

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

Engine behavior:

- The surface re-expands templates on every render, so a later `updateDataModel` on the bound path updates the instances automatically — no `updateComponents` resend needed
- Absolute pointers inside a template (e.g. `/page/title`) resolve against the surface dataModel, but the skill convention forbids them inside templates — keep template bindings relative to the item
- `item_tpl` must exist as a component id in the same `updateComponents` payload; it may itself have `children` (the whole subtree is cloned per item with per-instance ids)
- Broken bindings never render as blank space: path missing from the dataModel or not an array, or an unknown `componentId`, produce a visible error card; an empty array produces an empty list
- Controlled inputs inside templates report changes via `syncUIToData` with the per-instance component id; automatic write-back to the originating array item is not supported — prefer read-only components inside templates

## Structured Array Property Binding

Path binding is recursive: arrays are traversed, `{"path": ...}` is resolved, and plain objects walk each field. So **any structured array property** — not just `value`/`text` — can take a binding path. This is how dynamic candidate lists (options / treeData / items) stay data-driven instead of being hard-coded into the component tree.

When candidate values come from a data source (DB query result, host-computed list, filter-dependent cascade) rather than a fixed design-time enum, bind the candidate-list property to a path and let the host refresh it via `updateDataModel`. The component re-renders automatically — no tree rebuild needed.

```json
{"id": "cp1", "component": "ChoicePicker", "mode": "multiple",
 "options": {"path": "/filters/deptOptions"},
 "value": {"path": "/filters/dept"}}
```

```json
{"updateDataModel": {"path": "/filters", "value": {"deptOptions": [{"label": "销售", "value": "销售"}, {"label": "研发", "value": "研发"}], "dept": []}}}
```

Candidate-list attributes that commonly use this pattern:

- `options` — `ChoicePicker`, `AutoComplete`, `Cascader` (array of `{label, value}` or nested)
- `treeData` — `TreeSelect` (nested `{value, title, children}`)
- `items` / `cards` / `contents` — advanced list components

Rule of thumb: if a list of options is known at design time, use a literal array; if it depends on data, bind it with `{"path": ...}` and drive it through `updateDataModel`.

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

## Action Events (Board → Host)

`updateDataModel` flows **host → board** (data in). Actions flow the opposite way, **board → host** (user intent out): when the user clicks a row, a chart series, a menu item, or a button, the board emits an action event that the host listens to and handles (e.g. open a drilldown, switch module, export).

Declaring an action trigger is component-specific:

| Component | Property | Fires on | Context |
|-----------|----------|----------|---------|
| Table | `rowClickAction` | row click | `{record}` — the full row object |
| Chart | `clickAction` | series click (bar/slice/point) | `{name, value, seriesName, dataIndex}` |
| Menu | `select` (built-in) | item select | `{key}` |
| Button / FloatButton | `click` (built-in) | press | — |

The host receives `{action, sourceComponentId, context}` and routes by `action` name. **One action name can be shared across multiple triggers** — e.g. a Table row and two Charts can all declare `clickAction: "drilldown"`; the host opens the same drilldown using whichever context field is present.

```json
// Two triggers, one action name — host opens the same drilldown
{"id": "summaryTable", "component": "Table", "rowClickAction": "drilldown", "columns": [...], "dataSource": {"path": "/rows"}}
{"id": "cityChart", "component": "Chart", "chartType": "bar", "clickAction": "drilldown", "config": {"xField": "city", "yField": "trips"}}
```

Host handler (read `action` to route; read `context` for the clicked target):

```ts
sm.on('action', (event) => {
  const { action, context } = event.payload;
  if (action === 'drilldown') {
    const key = context?.record?.position ?? context?.name;  // table gives record, chart gives name
    openDrilldown(key);
  }
});
```

Action names are **convention, not enum** — invent clear verbs (`drilldown`, `exportCSV`, `switchToDepartment`). The board only declares them; the host owns the behaviour.

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
