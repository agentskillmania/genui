# Review Validation

## Purpose

This document unifies the review and validation process after a first draft, with the goal of:

1. Removing prose-like stacking; improving layout and visual quality
2. Ensuring readability and usability
3. Ensuring protocol compliance

## End-to-End Flow

After the first draft is written to disk, execute the following flow by default:

1. Read the on-disk file (review based on file, do not start a new draft)
2. Perform design quality review following [`reference/design-review.md`](reference/design-review.md)
3. Apply improvements directly to the on-disk file
4. After improvements, re-verify the output

## Round Checklist (Every Round)

Check the following universal items every round:

- Has the mode been clearly identified: `DTO Component` / `Non-DTO Component` / `Non-DTO Page`
- Can all data paths be found in the `dataModel`
- Are all component names in the allowlist (see [`reference/component-catalog.md`](reference/component-catalog.md)); no hallucinated names
- Do lists use template capability rather than hard-coded repeated components
- Is the layout clearly distinct from plain text stacking
- Are atomic component capabilities being fully used to express hierarchy and emphasis
- Was the layout rationale explicitly stated before formal output
- Was at least `1` explicit design improvement completed before formal output
- Are buttons visible and readable (text contrasts sufficiently with background)
- Do images come from user materials or genuinely verifiable sources (no fabricated URLs)
- For full pages: is there obvious collage-style color palette jumping?

## Mode-Specific Checks

### For `Component/Card` (DTO + Non-DTO)

- Is height within a single viewport, avoiding page-sized large cards
- Are main sections converged to `2–3` or fewer; is primary info focused enough
- Is there a double card shell: `Card` outer shell exists, and inner layer adds another full visual shell
- In multi-column rows, are "protected columns" distinguished from "compressible columns"
- Do sections that should be left-right opposed actually anchor both sides
- Are short CTA text, rating values, times, prices being squeezed into fragments by narrow containers

### For `DTO Component` Only

- Is the Python entry fixed as `build_component_payload_from_dto`
- Do `*_components.json` and `*_datamodel.json` come directly from running Python
- Are `required` and `optional` fields clearly distinguished
- When a field is missing, is it handled via "omitting the component/section" rather than leaving an empty shell
- Are low-information-value fields filtered or downgraded
- Is Python compatible with more DTOs of the same type, not just tailored to one sample

## Protected Content Wrap Review

For any horizontal layout, perform a "protected content abnormal wrapping" review:

1. List the protected content in the current section:
   - CTA label text
   - Status words / short badges
   - Rating values / prices / times
   - Short descriptions next to icons
2. Verify each item:
   - Is it in a narrow fixed-width container
   - Could wrapping cause single-character hanging or punctuation on its own line
   - Does the protected column break first, before weak information compresses
3. If the answer is "yes", fix:
   - Widen the protected column
   - Lower the priority of weak information or move it to the next line
   - Change to a better left-right structure

## User Requirement First

When a user's explicit requirement conflicts with the default specification:

1. Satisfy the user's explicit requirement first
2. Document the conflict and exemption
3. Keep all other checks enabled
