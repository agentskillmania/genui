---
name: a2ui-generation
description: |
  Design and generate A2UI updateComponents and updateDataModel payloads for three modes (DTO component, non-DTO component, non-DTO page). Use when asked to create or refine A2UI cards, components, or pages from DTO/JSON/business data, generate Python transformer code for DTO-driven components, iterate on existing A2UI output files by diff, improve UI quality, or validate A2UI rules such as surfaceId, root, path binding, and component-vs-page boundaries.
  Trigger when user mentions "A2UI", "a2ui", "GenUI", "genui", "generate card", "generate page", "UI component", "生成卡片", "生成页面".
---

# A2UI Generation (GenUI)

## What This Skill Does

- Generate or refactor A2UI `updateComponents` and `updateDataModel`
- Output a unified Python transformation entry in `DTO Component` mode
- Iterate on existing files rather than rewriting everything from scratch each round
- Gate quality through design review

## Execution Boundary

- Do not proactively search, read, borrow from, or imitate historical examples, old artifacts, sample pages, sample JSON, sample HTML, or screenshot outputs in the repository unless the user explicitly requests it
- By default, rely only on the user's current input, currently attached files, and this skill's own documentation
- If the user provides a DTO, do not hard-code business facts

## First Principle: User Requirements First

- Global first principle: `User requirements first`
- When a feature explicitly requested by the user conflicts with a skill default rule, prioritize the user requirement
- Do not "pretend to comply with the skill"; explicitly record the conflict and apply a targeted exemption during the validation phase
- Exemptions are scoped only to items the user explicitly requested — never use them as an excuse to disable validation globally
- Choose an appropriate layout style based on the user's requirements and intent; using the same layout style and color scheme across multiple queries is forbidden

## Mode Selection

Before starting, determine:

1. Does the user want a `component/card` or a `full page`?
2. Has the user provided a DTO?

Default to generating a component / card for the user, unless the user explicitly says they want a full page.

Then enter exactly one of the following three modes:

### Mode 1: DTO Component

Applicable when:

- The user has provided a DTO
- The user wants a component / card

Deliverables:

1. Python transformer code
2. `updateComponents` JSON
3. `updateDataModel` JSON

Unified entry function:

```python
def build_component_payload_from_dto(dto: dict) -> tuple[dict, dict]:
    ...
```

### Mode 2: Non-DTO Component

Applicable when:

- The user has not provided a DTO
- The user wants a component / card

Deliverables:

1. `updateComponents` JSON
2. `updateDataModel` JSON

Mandatory order (must not be reversed):

1. Output UI layout (`updateComponents`) first
2. Output data (`updateDataModel`) second

### Mode 3: Non-DTO Page

Applicable when:

- The user has not provided a DTO
- The user wants a full page

Deliverables:

1. `updateComponents` JSON
2. `updateDataModel` JSON

Mandatory order (must not be reversed):

1. Output UI layout (`updateComponents`) first
2. Output data (`updateDataModel`) second

Supplementary rules:

- Only the three modes above are defined by default
- If the user provides a DTO but explicitly wants a full page, do not silently apply one of these modes; ask first whether to design the page as DTO-driven

## Read Only What You Need

Do not read all sub-documents by default. Load only what the current task requires:

| Task type | Required docs | Load on demand |
| --- | --- | --- |
| DTO component | [`reference/dto-component-mode.md`](reference/dto-component-mode.md), [`reference/component-design.md`](reference/component-design.md) | [`reference/component-catalog.md`](reference/component-catalog.md), [`reference/data-binding.md`](reference/data-binding.md), [`reference/design-review.md`](reference/design-review.md) |
| Non-DTO component | [`reference/component-catalog.md`](reference/component-catalog.md), [`reference/component-design.md`](reference/component-design.md) | [`reference/data-binding.md`](reference/data-binding.md), [`reference/design-review.md`](reference/design-review.md) |
| Non-DTO page | [`reference/component-catalog.md`](reference/component-catalog.md), [`reference/page-design.md`](reference/page-design.md) | [`reference/data-binding.md`](reference/data-binding.md), [`reference/review-validation.md`](reference/review-validation.md), [`reference/design-review.md`](reference/design-review.md) |
| Bug fix / review / iterating on existing artifacts | [`reference/review-validation.md`](reference/review-validation.md) | Whichever doc is directly related to the issue |

## Output Persistence

Final artifacts should be written to files by default, and the user should be told the paths explicitly.

Priority order:

1. If the user specifies a directory or filename, save according to that
2. If the user provides an existing artifact directory, prefer saving near that context
3. Otherwise choose a clear, sensible, easy-to-find location

Default file naming:

- `*_components.json`
- `*_datamodel.json`
- `*_transformer.py` or `*_vo.py`

Non-DTO mode write order (mandatory):

1. Generate and save `*_components.json` first
2. Generate and save `*_datamodel.json` second

To save tokens:

- Write the first draft to disk immediately after generation
- If the user continues modifying, iterate on the existing file by default
- Each round of changes should edit the file and work from a diff — do not repaste the entire JSON in the conversation

## Workflow

1. Read user input; confirm mode, data source, interaction requirements, and visual constraints
2. Load only the sub-documents the current task truly needs
3. Before formal output, explicitly list the layout rationale: at minimum describe the main sections, visual focal point, information rhythm, key horizontal relationships, and the role of images
4. Based on that layout rationale, draft an internal first version, then perform at least `1` explicit design improvement before proceeding to formal output
5. Output the first draft formally and write it to disk immediately (non-DTO mode: components before datamodel, mandatory)
6. Perform design quality review following [`reference/design-review.md`](reference/design-review.md); apply improvements directly to the on-disk file
7. After design review improvements, perform a dedicated "protected content abnormal wrapping" check on all horizontal layouts
8. At delivery, clearly state the output file paths; if placeholder links were used, explicitly remind the user to replace them

## Non-Negotiables

- Non-DTO mode must produce UI layout (`updateComponents`) before data (`updateDataModel`)
- Do not output fake buttons; clickable elements must use a real `Button + action`
- Real buttons must have visible label text via the `text` property
- DTO fields must pass a semantic validity check before display; non-empty does not equal informative
- `Component/card` mode must not silently become page-like; do not deliver a near-full-screen large card
- Component mode content should converge first; escalate to page only when convergence fails, and do so explicitly
- When design requires images, do not fabricate non-existent image URLs
- After the first draft, always iterate on the on-disk file; do not regenerate the entire artifact each round
- Before formal output, the layout rationale must be explicitly listed; skipping layout planning and jumping straight to JSON is not allowed
- Before formal output, at least `1` explicit improvement round is required
- **Component allowlist**: Only use component names defined in [`reference/component-catalog.md`](reference/component-catalog.md).
  Do NOT invent, translate, or import names from other UI frameworks.
- **Template components must use relative paths**: all `{"path": "..."}` bindings inside a template component must be relative paths (e.g. `text`, `userName`, `author/name`). Absolute paths such as `/children/xxx` are forbidden.
- **Function call bindings are host-only**: `{"call": "name", "args": {...}}` resolves to a handler registered by the host via `Genui.registerFunction`. The generated A2UI JSON may reference a call name, but the handler implementation is the host's responsibility. See [`reference/data-binding.md`](reference/data-binding.md#function-call-binding).

## Resources

- Sub-document index: [`reference.md`](reference.md)
- Component catalog: [`reference/component-catalog.md`](reference/component-catalog.md)
- Data binding: [`reference/data-binding.md`](reference/data-binding.md)
- DTO mode: [`reference/dto-component-mode.md`](reference/dto-component-mode.md)
- Component design: [`reference/component-design.md`](reference/component-design.md)
- Page design: [`reference/page-design.md`](reference/page-design.md)
- Design review: [`reference/design-review.md`](reference/design-review.md)
- Review & validation: [`reference/review-validation.md`](reference/review-validation.md)
