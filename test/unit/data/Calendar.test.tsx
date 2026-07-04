import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { Calendar as AntCalendar } from "antd";
import { Calendar } from "../../../src/components/data/Calendar";

vi.mock("antd", async (importOriginal) => {
  const actual = await importOriginal<typeof import("antd")>();
  return {
    ...actual,
    Calendar: vi.fn((props: Record<string, unknown>) => {
      // Capture handlers so tests can invoke them directly without driving
      // the full antd Calendar DOM interaction in jsdom.
      (AntCalendarMock as unknown as Record<string, unknown>).__props = props;
      return actual.Calendar(props as never);
    }),
  };
});

const AntCalendarMock = AntCalendar as unknown as {
  __props: Record<string, unknown>;
};

function getProps(): Record<string, unknown> {
  return AntCalendarMock.__props;
}

describe("Calendar", () => {
  it("renders without crashing when properties is undefined", () => {
    const { container } = render(<Calendar id="c1" component="Calendar" />);
    expect(container.querySelector(".ant-picker-calendar")).toBeTruthy();
  });

  it("calls onSyncState via onChange when a date is selected", () => {
    const onSyncState = vi.fn();
    render(<Calendar id="c1" component="Calendar" onSyncState={onSyncState} />);

    const { onChange } = getProps() as {
      onChange: (d: { format: (f: string) => string }) => void;
    };
    onChange({ format: () => "2026-07-15" });
    expect(onSyncState).toHaveBeenCalledWith({ date: "2026-07-15" });
  });

  // ── G3: onPanelChange must NOT write back to dataModel ──
  // Panel changes (month/year navigation) are view-only; treating them as a
  // date selection overwrites the user's chosen date with the panel's
  // anchor date (typically the 1st of the navigated month).
  it("does NOT call onSyncState on panel change (G3)", () => {
    const onSyncState = vi.fn();
    render(<Calendar id="c1" component="Calendar" onSyncState={onSyncState} />);

    const { onPanelChange } = getProps() as {
      onPanelChange: (d: { format: (f: string) => string }, m: string) => void;
    };
    onPanelChange({ format: () => "2026-08-01" }, "month");

    expect(onSyncState).not.toHaveBeenCalled();
  });
});
