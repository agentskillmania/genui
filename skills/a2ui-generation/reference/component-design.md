# Component Design

## Scope

This document covers `component/card` mode only, not full pages.

## Height Boundary

- `Component/card`: defaults to fitting within a single viewport without scrolling
- A card is a summary-type container, not a miniaturized page

Do not expand using a page-level structure and then try to compress the height afterward.

## Card Content Budget

In card mode, defaults should be:

- Only one core conclusion area or primary visual focal point
- Only one group of the most critical supporting info
- Only one primary CTA or main status action area
- Typically no more than `2–3` main sections

Content that should not be placed in a card by default:

- Long lists
- Long tables
- Long timelines
- Long explanatory text
- Multiple large parallel sections
- Full page-level narrative chains

## Card Escalation Rule

Treat any of the following as exceeding the card budget:

- Even after compression, the card fills or nearly fills the full viewport
- More than `3` main sections are needed to convey the information
- The primary information requires continuous vertical scrolling to be fully seen

The correct response is:

1. Converge to a summary-type card
2. If convergence still does not hold, escalate to a page
3. Do not silently deliver a page-sized large card and call it a "component"

## Web Layout Safety

GenUI renders in web browsers. Design for typical desktop widths (1024px+).

General principles:

- Use `Row` + `Column` with `span` for responsive grid layouts (24-column grid)
- Use `gutter` for consistent column spacing
- For fixed-width sidebars, use explicit `span` values; for fluid layouts, omit `span` or use `flex`
- Content that naturally suits horizontal browsing can use wider layouts without overflow risk
- Use `style.maxWidth` to constrain overly wide content on large screens

## Protected Column Readability

A protected column must not just be "visible" — it must maintain minimum readable form.

Rules:

- Do not give a protected column an excessively narrow fixed width that causes its internal text to wrap unnecessarily
- First ensure core numbers, main status, and key phrases are displayed completely before compressing other columns

For short phrases:

- Short phrase captions should by default remain as complete word groups
- If a column cannot hold both the core number and the phrase, prioritize reallocating column widths

## CTA Width Policy

A `CTA` button is a protected column — do not default to a narrow fixed width just for alignment.

Default strategy:

- Buttons prefer natural content width
- Short CTA text should naturally stretch the button width via content
- Only consider a fixed width when the visual system explicitly requires equal-width button groups

## Multi-Column Text Budget

When adopting a multi-column layout, do not let all columns compete for width without limits.

Assign a role to each column first:

- Protected column: core numbers, main status, primary button, key visuals, avatars/thumbnails, core badges
- Compressible column: descriptive text, supporting descriptions, secondary labels

Handling principles:

- Protected columns take priority for complete visibility
- Compressible columns absorb shrinkage first
- Use CSS `overflow: 'hidden'` with `textOverflow: 'ellipsis'` and `whiteSpace: 'nowrap'` for truncation
- Truncation should occur on weak information — do not truncate main titles, core status, or key CTAs first

## Component Expressiveness Hierarchy

When data can be represented by multiple component types, prefer the one with higher expressiveness over plain `Text`.

| Tier | Components | When to use |
|---|---|---|
| Tier 1 — Visual | `Chart`, `Image`, `Carousel`, `Video`, `Lottie` | Numerical comparison → Chart; visual content → Image/Carousel; animation → Lottie |
| Tier 2 — Structured | `Card`, `RichText`, `Table`, `Markdown`, `Descriptions`, `Timeline` | Formatted emphasis → RichText; tabular data → Table; rich text blocks → Markdown |
| Tier 3 — Basic | `Text`, `Icon`, `Image`, `Divider`, `Button`, `Tag`, `Badge`, `Statistic` | Single labels, icons, separators, metrics, tags |

Rules:

- During layout planning, check: "Is any section using Tier 3 where Tier 1–2 would better serve the data?"
- Do not upgrade when data does not support it — a single number does not need a Chart
- `Chart` requires explicit `height` property

## Chart Height Specification

Chart has no intrinsic height; provide explicit `height`.

| `chartType` | Recommended height | Rationale |
|---|---|---|
| `donut` / `pie` | 300–400 | Compact, roughly square |
| `bar` / `line` / `area` | 350–500 | Needs vertical space for bars/lines + axis labels |
| `radar` / `scatter` | 350–450 | Needs space for axes |
| `funnel` | 300–400 | Compact vertical flow |

In card mode, prefer the lower end. In page mode, use the upper end.

## Card Shell Guidance

- A single card defaults to one main card shell
- Use lightweight sectioning inside the main card — no card-within-card
- If `Card` is already used as the main shell, its immediate children must not add a full visual shell (background + border-radius + shadow)
- `root` handles layout only — do not assign card styling to it

## Missing Data Behavior

For missing fields in DTO component mode, the default behavior should be "structural pruning", not "style hiding":

- Missing text field: omit the corresponding text component
- Missing image field: omit the corresponding image component and its wrapper
- Missing entire info group: omit the entire section

The goal is for the final structure to be naturally compact — not held together by empty values or hidden styles.
