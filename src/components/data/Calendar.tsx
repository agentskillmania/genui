import React from "react";
import { Calendar as AntCalendar } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { GenUIComponentProps } from "../types";

/**
 * Calendar component — monthly calendar view with date selection.
 *
 * Fully controlled: value comes from `properties.value` and every change is
 * reported upstream via `onSyncState({ date })`.
 */
export const Calendar: React.FC<GenUIComponentProps> = ({
  properties,
  onSyncState,
}) => {
  const { value, fullscreen, mode, style } = properties ?? {};

  const handleChange = (date: Dayjs) => {
    onSyncState?.({ date: date.format("YYYY-MM-DD") });
  };

  const handlePanelChange = (_date: Dayjs, _mode: "year" | "month") => {
    // G3: panel navigation (month/year switch) is a view-only operation.
    // Do NOT write the panel anchor date back to the data model — that would
    // overwrite the user's selected date with the 1st of the navigated month.
  };

  return (
    <AntCalendar
      value={value ? dayjs(value as string) : dayjs()}
      fullscreen={fullscreen !== false}
      mode={mode as "month" | "year"}
      style={style as React.CSSProperties}
      onChange={handleChange}
      onPanelChange={handlePanelChange}
    />
  );
};
Calendar.displayName = "Calendar";
