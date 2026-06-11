# Page Design

## Scope

This document covers `full page` mode only, not components/cards.

## Page Boundary

- `Full page`: defaults to spanning multiple viewport heights
- A page should contain multiple content sections, not just a stretched card

## Page Structure

A full page typically combines multiple sections using `Column`, with `Divider` in between:

```json
{
  "id": "root",
  "component": "Column",
  "children": ["section1", "divider1", "section2", "divider2", "section3"]
}
```

A page should typically have:

- A clear main heading area
- At least `2–3` content sections
- Clear information hierarchy
- A rhythm that allows continuous downward scrolling, not one huge content block

## Page-Only Content

The following content is better suited for pages than cards:

- Long lists
- Long tables
- Long timelines
- Multiple large parallel sections
- Full narrative chains
- Multi-paragraph explanatory text

## Page Layout Guidance

- Pages can have richer sectioning, rhythm, and visual transitions
- Multiple sections are allowed inside a page, but each section should still have clear hierarchy
- Use `Row` + `Column` with `span` for multi-column page layouts
- For dashboard-style pages, use grid layout with `Row` + `Column` containing `Card` wrappers for each panel

## Pre-Output Layout Planning

Before formally outputting `updateComponents`, explicitly write out a layout rationale. Do not jump directly to generating JSON.

This pre-output layout rationale must answer at minimum:

- What main sections will the page have
- What is the visual focal point of the first screen
- How the information rhythm unfolds: hook first, then explain, then expand, then close
- Which relationships suit horizontal spread, which should scroll vertically
- What roles images, charts, and timelines each play

## Explicit Improvement Before Formal Output

After completing the layout rationale, do not directly deliver the first version as formal output. At least one explicit improvement round is required, and it must explain:

- What is not polished enough in the first version
- What the second version intends to strengthen
- Whether the improvement is reflected in layout, visual focal point, rhythm, and information hierarchy

## Page Escalation Reminder

If the user originally wanted only a component/card, but the content clearly requires:

- Multiple main sections
- Continuous vertical scrolling
- Multi-paragraph narrative explanation
- Long lists or long tables

Then explicitly suggest: this is better suited for `page` mode.
