import React from 'react';
import { Row as AntRow, Col } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Row layout component — horizontal flex container via Ant Design Row.
 *
 * Two layout modes:
 *
 * 1. Grid mode (default, `equalWidth` falsy): Ant Design Row + Col grid.
 *    Children that are not `Column` are auto-wrapped in `Col flex="0 1 auto"`
 *    (natural content width, no grow) so they sit left-aligned at their own
 *    width. Use `gutter` for horizontal spacing.
 *    For precise widths, wrap children in `Column` with `span`/`flex`.
 *
 * 2. Equal-width mode (`equalWidth: true`): CSS grid with
 *    `repeat(auto-fit, minmax(200px, 1fr))` so every child takes an equal
 *    share and wraps responsively. Ideal for KPI card rows and any row where
 *    children must be the same width. Use `gap` for spacing in this mode
 *    (also honoured in grid mode as a flex fallback).
 *
 * `gap` is honoured in both modes (flex `gap` in grid mode, CSS grid `gap`
 * in equal-width mode).
 */
export const Row: React.FC<GenUIComponentProps> = ({ properties, children, childTypes }) => {
  const { justify, align, gutter, wrap, gap, equalWidth, style } = properties ?? {};

  const childArray = React.Children.toArray(children);

  // Equal-width mode: CSS grid, every child an equal column.
  if (equalWidth) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: (gap as number) ?? (gutter as number) ?? 0,
          ...(style as React.CSSProperties),
        }}
      >
        {children}
      </div>
    );
  }

  // Grid mode: Ant Design Row + auto-wrapped Cols.
  // Non-Column children get flex="0 1 auto" so they keep their natural width
  // (no grow) and can shrink if space is tight. Do NOT use "auto" — Antd maps
  // that to `flex: 1 1 auto` which makes children grow and split the row evenly.
  const wrappedChildren = childArray.map((child, index) => {
    const type = childTypes?.[index];
    if (type === 'Column') return child;
    return <Col key={`auto-col-${index}`} flex="0 1 auto">{child}</Col>;
  });

  return (
    <AntRow
      justify={justify as React.ComponentProps<typeof AntRow>['justify']}
      align={align as React.ComponentProps<typeof AntRow>['align']}
      gutter={gutter as number | [number, number]}
      wrap={wrap as boolean}
      style={{ gap: gap as number, ...(style as React.CSSProperties) }}
    >
      {wrappedChildren}
    </AntRow>
  );
};
