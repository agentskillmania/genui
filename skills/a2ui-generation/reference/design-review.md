# Design Quality Review

## Purpose

After the first draft is written, perform this structured design review on the on-disk output. The goal is to elevate the UI from "correct but bland" to "polished and visually compelling" by auditing four dimensions: color palette, layout structure, decorative detail, and theme appropriateness.

## How to Use

1. Read the generated `*_components.json` file
2. Walk through each audit dimension below
3. For every issue found, record:
   - **Component**: which component id is affected
   - **Problem**: what specifically is wrong
   - **Fix**: the concrete style change to apply
4. Apply all fixes to the on-disk file via diff edits

## Dimension 1: Color Palette Audit

Check these in order:

- **Generic grey-blue trap**: Is the entire card using only `#333` / `#666` / `#999` text + `#1677ff` accent? If so, the palette has no personality — redesign with domain-appropriate colors
- **Single accent syndrome**: Count how many distinct accent colors are used. If there is only 1, related elements cannot be visually distinguished — add 2–3 coordinated accent colors
- **Hero impact**: Is the hero number / key metric using a visually striking color that contrasts sharply with surrounding text?
- **Text contrast**: Check `color` values against their container `backgroundColor`. Dark text on dark background or light text on light background is a critical error
- **Color layer depth**: Count distinct background colors. If there is only 1 (usually white), there is no depth — add at least one tinted background layer

## Dimension 2: Layout Structure Audit

- **Focal point existence**: Can you immediately identify the single most important element? If everything is the same size, enlarge the hero element or give it a distinctive background
- **Pure vertical stacking**: If the tree is only `Column > Column > Column > Text`, there is zero spatial tension. Convert horizontal-suited content to `Row`
- **Visual grouping**: Are related items visually grouped? Add a container with a tinted `backgroundColor` or consistent `gap`
- **Rhythm**: Is there alternation between dense areas and breathing space? Vary section gaps: larger between major sections, smaller within sections
- **Component expressiveness**: Is any section using only `Text` where `Chart`, `Table`, `Descriptions`, `Statistic`, or `Timeline` would better match the data?
- **Grid usage**: For dashboard-style layouts, use `Row` + `Column` with `span` for responsive grid. Do not stack everything vertically

## Dimension 3: Decorative Detail Audit

- **Border-radius uniformity**: Use larger radius for hero/highlight containers and smaller radius for tags and secondary elements
- **Surface layers**: Does the card use any `backgroundColor` other than white? If not, add at least one tinted container around a key section
- **Box shadow**: Key containers benefit from subtle shadow: `boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'`. If nothing has shadow, the card feels flat
- **Padding adequacy**: Check inner containers for padding. Minimum recommended: 16px for small containers, 20–28px for main containers
- **Color layer count**: A polished card should have at least 3 color layers: (1) card background, (2) section background, (3) accent colors

## Dimension 4: Theme Appropriateness Audit

Match the color temperature and mood to the content domain:

| Domain | Color direction | Avoid |
|--------|----------------|-------|
| Food / lifestyle | Warm tones: orange, amber, coral | Cold blue, clinical grey |
| Tech / digital | Cool tones: blue, indigo, cyan | Warm earthy tones |
| Nature / travel | Organic tones: green, teal, warm gold | Neon, synthetic colors |
| Finance / business | Stable tones: navy, slate, warm gold accents | Playful bright colors |
| Health / fitness | Energetic tones: green, orange, teal | Dark muted palettes |
| Education / knowledge | Calm tones: deep blue, sage green | Aggressive neon |

## Review Output Template

After completing all 4 dimensions, summarize findings as:

```
Design Review Results:
[1] {component_id}: {problem} → {fix}
[2] {component_id}: {problem} → {fix}
...
Issues found: {N}
```

If 0 issues found: `Design review passed — no improvements needed.`

## Pre-Output Design Checklist

Before generating formal output, evaluate the layout plan:

### 1. Visual Focal Point
- Is there exactly one clear visual anchor?
- Are there no more than 1 element competing for primary attention?

### 2. Information Hierarchy
- Are primary / secondary / tertiary layers differentiated by font size and weight?
- Does secondary information use a lighter color or lower opacity?

### 3. Color Tension
- Is the primary palette color applied to at least one key element?
- Are all accent colors drawn from the same palette?
- Are there no more than 2 distinct hue families?

### 4. Whitespace Rhythm
- Is spacing between major sections strictly larger than spacing within sections?
- Is the card shell padded sufficiently (≥ 24px) so shadows are not clipped?

### 5. Horizontal Tension
- Is there at least one meaningful left-right relationship?
- If all content is vertical stacking, is there a reason no horizontal relationship exists?

### 6. Decoration Level
- Does the card shell use a subtle shadow?
- Does the card use at least one tinted background section?
- Are border radii consistent (outer ≥ inner)?

### 7. Expressiveness Level
- Is any section using plain `Text` where richer components would fit better?
- If numerical comparisons exist, is `Chart` used rather than text lists?
- If the data is tabular, is `Table` used rather than simulated rows of `Text`?

### Fix Priority Order

1. **Visual Focal Point** — no focal point = user doesn't know where to look
2. **Information Hierarchy** — hierarchy confusion = information cannot be scanned
3. **Color Tension** — no accent = visually flat
4. **Decoration Level** — no decoration = lacks refinement
5. **Expressiveness Level** — plain text where richer components fit = wasted capability
6. **Whitespace Rhythm** — uniform spacing = no breathing room
7. **Horizontal Tension** — all vertical = lacks spatial tension
