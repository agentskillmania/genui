import React from "react";
import { Card as AntCard } from "antd";
import type { GenUIComponentProps } from "../types";

/**
 * Card layout component — bordered content container.
 *
 * Defaults to `variant="outlined"` (border-only, no heavy shadow) for a clean
 * BI-dashboard look. Sets `min-width: 0` on the card so wide children (e.g.
 * ECharts canvas, wide tables) cannot blow out the parent grid column.
 */
export const Card: React.FC<GenUIComponentProps> = ({
  properties,
  children,
}) => {
  const { title, extra, bordered, hoverable, variant, style } =
    properties ?? {};

  // antd 6 deprecated `bordered` in favor of `variant`. Map the legacy
  // bordered:false to variant:"borderless" so the border is actually removed.
  const resolvedVariant =
    (variant as "outlined" | "borderless") ??
    (bordered === false ? "borderless" : "outlined");

  return (
    <AntCard
      title={title as React.ReactNode}
      extra={extra as React.ReactNode}
      variant={resolvedVariant}
      hoverable={hoverable as boolean}
      style={{ minWidth: 0, ...(style as React.CSSProperties) }}
    >
      {children}
    </AntCard>
  );
};
