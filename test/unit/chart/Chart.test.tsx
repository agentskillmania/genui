/**
 * Unit tests for the ECharts-based Chart component.
 *
 * Tests cover: render without crash, ECharts instance lifecycle,
 * correct option generation for each chart type, option updates on
 * prop changes, cleanup on unmount, and graceful handling of empty data.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import React from "react";

// ---------- Mock registry ----------
// vi.hoisted() runs before vi.mock factories, so the registry is
// available inside the mock factory.
const mockRegistry = vi.hoisted(() => ({
  setOption: vi.fn(),
  resize: vi.fn(),
  dispose: vi.fn(),
  init: vi.fn(),
  use: vi.fn(),
}));

// ---------- ECharts mock ----------

vi.mock("echarts/core", () => {
  const fakeInstance = {
    setOption: (...args: unknown[]) => mockRegistry.setOption(...args),
    resize: (...args: unknown[]) => mockRegistry.resize(...args),
    dispose: (...args: unknown[]) => mockRegistry.dispose(...args),
    on: vi.fn(),
    off: vi.fn(),
  };

  return {
    __esModule: true,
    init: (...args: unknown[]) => {
      mockRegistry.init(...args);
      return fakeInstance;
    },
    use: (...args: unknown[]) => mockRegistry.use(...args),
  };
});

vi.mock("echarts/charts", () => ({
  __esModule: true,
  BarChart: {},
  LineChart: {},
  PieChart: {},
  ScatterChart: {},
  RadarChart: {},
  FunnelChart: {},
  HeatmapChart: {},
  TreemapChart: {},
  GaugeChart: {},
  SankeyChart: {},
  BoxplotChart: {},
  CandlestickChart: {},
  SunburstChart: {},
  ThemeRiverChart: {},
  GraphChart: {},
  ParallelChart: {},
  PictorialBarChart: {},
  EffectScatterChart: {},
}));

vi.mock("echarts/components", () => ({
  __esModule: true,
  GridComponent: {},
  TooltipComponent: {},
  LegendComponent: {},
  TitleComponent: {},
  VisualMapComponent: {},
  ParallelComponent: {},
  SingleAxisComponent: {},
}));

vi.mock("echarts/renderers", () => ({
  __esModule: true,
  CanvasRenderer: {},
}));

// Must come AFTER vi.mock
import { Chart, buildEChartsOption } from "../../../src/components/chart/Chart";

// ---------- helpers ----------

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: "chart-1",
    component: "Chart",
    properties: {
      chartType: "bar",
      data: [
        { name: "A", value: 10 },
        { name: "B", value: 20 },
      ],
      config: { xField: "name", yField: "value" },
      width: "100%",
      height: 400,
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe("Chart component", () => {
  beforeEach(() => {
    mockRegistry.setOption.mockClear();
    mockRegistry.resize.mockClear();
    mockRegistry.dispose.mockClear();
    mockRegistry.init.mockClear();
  });

  it("renders a container div without crashing", () => {
    const { container } = render(<Chart {...makeProps()} />);
    const div = container.querySelector("div");
    expect(div).toBeTruthy();
  });

  it("initializes an ECharts instance on mount", () => {
    render(<Chart {...makeProps()} />);
    expect(mockRegistry.init).toHaveBeenCalledTimes(1);
  });

  it("calls setOption with correct bar series type", () => {
    render(<Chart {...makeProps()} />);

    expect(mockRegistry.setOption).toHaveBeenCalled();
    const option = mockRegistry.setOption.mock.calls[0][0];
    expect(option.series[0].type).toBe("bar");
  });

  it("calls setOption with correct line series type", () => {
    render(<Chart {...makeProps({ chartType: "line" })} />);

    expect(mockRegistry.setOption).toHaveBeenCalled();
    const option = mockRegistry.setOption.mock.calls[0][0];
    expect(option.series[0].type).toBe("line");
  });

  it("calls setOption for pie chart using angleField and colorField", () => {
    render(
      <Chart
        {...makeProps({
          chartType: "pie",
          config: { angleField: "value", colorField: "name" },
        })}
      />,
    );

    expect(mockRegistry.setOption).toHaveBeenCalled();
    const option = mockRegistry.setOption.mock.calls[0][0];
    expect(option.series[0].type).toBe("pie");
    expect(option.series[0].data).toEqual([
      { name: "A", value: 10 },
      { name: "B", value: 20 },
    ]);
  });

  it("calls setOption for donut chart with inner radius", () => {
    render(
      <Chart
        {...makeProps({
          chartType: "donut",
          config: { angleField: "value", colorField: "name" },
        })}
      />,
    );

    expect(mockRegistry.setOption).toHaveBeenCalled();
    const option = mockRegistry.setOption.mock.calls[0][0];
    expect(option.series[0].type).toBe("pie");
    expect(option.series[0].radius).toEqual(["40%", "70%"]);
  });

  it("renders area chart with areaStyle", () => {
    render(<Chart {...makeProps({ chartType: "area" })} />);

    expect(mockRegistry.setOption).toHaveBeenCalled();
    const option = mockRegistry.setOption.mock.calls[0][0];
    expect(option.series[0].type).toBe("line");
    expect(option.series[0].areaStyle).toBeDefined();
  });

  it("disposes chart on unmount", () => {
    const { unmount } = render(<Chart {...makeProps()} />);

    expect(mockRegistry.dispose).not.toHaveBeenCalled();
    unmount();
    expect(mockRegistry.dispose).toHaveBeenCalledTimes(1);
  });

  it("handles chartType change by calling setOption again", () => {
    const { rerender } = render(<Chart {...makeProps({ chartType: "bar" })} />);
    mockRegistry.setOption.mockClear();

    // Re-render with a different chart type
    rerender(<Chart {...makeProps({ chartType: "scatter" })} />);

    expect(mockRegistry.setOption).toHaveBeenCalled();
    const option = mockRegistry.setOption.mock.calls[0][0];
    expect(option.series[0].type).toBe("scatter");
  });

  it("handles empty data gracefully", () => {
    render(<Chart {...makeProps({ data: [] })} />);

    expect(mockRegistry.setOption).toHaveBeenCalled();
    const option = mockRegistry.setOption.mock.calls[0][0];
    expect(option.series[0].data).toEqual([]);
  });

  // ---- Negative paths ----

  describe("negative paths", () => {
    it("should handle missing config gracefully", () => {
      render(
        <Chart
          id="c"
          component="Chart"
          properties={{ chartType: "bar", data: [{ a: 1 }] }}
        />,
      );

      // Should call setOption even without config — defaults to empty config
      expect(mockRegistry.setOption).toHaveBeenCalled();
    });

    it("should handle undefined chartType by defaulting to bar", () => {
      render(
        <Chart
          id="c"
          component="Chart"
          properties={{ data: [{ a: 1 }], config: {} }}
        />,
      );

      expect(mockRegistry.setOption).toHaveBeenCalled();
      const option = mockRegistry.setOption.mock.calls[0][0];
      expect(option.series[0].type).toBe("bar");
    });

    it("should handle undefined data by defaulting to empty", () => {
      render(
        <Chart
          id="c"
          component="Chart"
          properties={{ chartType: "bar", config: {} }}
        />,
      );

      expect(mockRegistry.setOption).toHaveBeenCalled();
      const option = mockRegistry.setOption.mock.calls[0][0];
      expect(option.series[0].data).toEqual([]);
    });

    it("should handle undefined properties by defaulting to empty", () => {
      render(<Chart id="c" component="Chart" />);

      expect(mockRegistry.setOption).toHaveBeenCalled();
      const option = mockRegistry.setOption.mock.calls[0][0];
      // chartType defaults to 'bar', data to [], config to {}
      expect(option.series[0].type).toBe("bar");
    });

    it("should handle empty string chartType (falls back via ||)", () => {
      render(<Chart id="c" component="Chart" properties={{ chartType: "" }} />);

      expect(mockRegistry.setOption).toHaveBeenCalled();
      const option = mockRegistry.setOption.mock.calls[0][0];
      // '' || 'bar' → 'bar'
      expect(option.series[0].type).toBe("bar");
    });

    it("should handle null data (falls back via ||)", () => {
      render(
        <Chart
          id="c"
          component="Chart"
          properties={{ chartType: "bar", data: null as unknown as unknown[] }}
        />,
      );

      expect(mockRegistry.setOption).toHaveBeenCalled();
      const option = mockRegistry.setOption.mock.calls[0][0];
      // null || [] → []
      expect(option.series[0].data).toEqual([]);
    });

    it("should handle null config (falls back via ||)", () => {
      render(
        <Chart
          id="c"
          component="Chart"
          properties={{
            chartType: "bar",
            data: [],
            config: null as unknown as Record<string, unknown>,
          }}
        />,
      );

      expect(mockRegistry.setOption).toHaveBeenCalled();
      // null || {} → {} — should not throw
    });

    it("should handle resize event", () => {
      render(<Chart {...makeProps()} />);
      expect(mockRegistry.resize).not.toHaveBeenCalled();

      // Simulate window resize
      act(() => {
        window.dispatchEvent(new Event("resize"));
      });

      expect(mockRegistry.resize).toHaveBeenCalled();
    });

    it("should remove resize listener on unmount", () => {
      const { unmount } = render(<Chart {...makeProps()} />);
      unmount();
      mockRegistry.resize.mockClear();

      act(() => {
        window.dispatchEvent(new Event("resize"));
      });

      expect(mockRegistry.resize).not.toHaveBeenCalled();
    });
  });
});

// ---------- buildEChartsOption unit tests ----------

describe("buildEChartsOption", () => {
  const sampleData = [
    { category: "X", amount: 5 },
    { category: "Y", amount: 15 },
  ];

  it("maps bar chart correctly", () => {
    const option = buildEChartsOption("bar", sampleData, {
      xField: "category",
      yField: "amount",
    });
    expect(option.series[0].type).toBe("bar");
    expect(option.series[0].data).toEqual([5, 15]);
    expect((option.xAxis as Record<string, unknown>).data).toEqual(["X", "Y"]);
  });

  it("maps column chart with horizontal axes", () => {
    const option = buildEChartsOption("column", sampleData, {
      xField: "category",
      yField: "amount",
    });
    expect(option.series[0].type).toBe("bar");
    expect((option.yAxis as Record<string, unknown>).type).toBe("category");
    expect((option.xAxis as Record<string, unknown>).type).toBe("value");
  });

  it("maps line chart with smooth flag", () => {
    const option = buildEChartsOption("line", sampleData, {
      xField: "category",
      yField: "amount",
      smooth: true,
    });
    expect(option.series[0].type).toBe("line");
    expect(option.series[0].smooth).toBe(true);
  });

  it("maps area chart with areaStyle", () => {
    const option = buildEChartsOption("area", sampleData, {
      xField: "category",
      yField: "amount",
    });
    expect(option.series[0].type).toBe("line");
    expect(option.series[0].areaStyle).toBeDefined();
  });

  it("maps scatter chart with coordinate pairs", () => {
    const option = buildEChartsOption("scatter", sampleData, {
      xField: "amount",
      yField: "amount",
    });
    expect(option.series[0].type).toBe("scatter");
    expect(option.series[0].data).toEqual([
      [5, 5],
      [15, 15],
    ]);
  });

  it("maps radar chart with indicators", () => {
    const option = buildEChartsOption("radar", sampleData, {
      xField: "category",
      yField: "amount",
    });
    expect(option.series[0].type).toBe("radar");
    expect(option.radar).toBeDefined();
  });

  it("maps gauge chart with first data value", () => {
    const option = buildEChartsOption("gauge", sampleData, {
      yField: "amount",
    });
    expect(option.series[0].type).toBe("gauge");
    expect(option.series[0].data[0].value).toBe(5);
  });

  it("maps funnel chart", () => {
    const option = buildEChartsOption("funnel", sampleData, {
      angleField: "amount",
      colorField: "category",
    });
    expect(option.series[0].type).toBe("funnel");
    expect(option.series[0].data).toEqual([
      { name: "X", value: 5 },
      { name: "Y", value: 15 },
    ]);
  });

  it("maps heatmap chart with visualMap", () => {
    const option = buildEChartsOption("heatmap", sampleData, {
      xField: "category",
      yField: "amount",
      colorField: "category",
    });
    expect(option.series[0].type).toBe("heatmap");
    expect(option.visualMap).toBeDefined();
  });

  it("maps treemap chart", () => {
    const option = buildEChartsOption("treemap", sampleData, {
      angleField: "amount",
      colorField: "category",
    });
    expect(option.series[0].type).toBe("treemap");
  });

  it("maps wordCloud as bar fallback", () => {
    const option = buildEChartsOption("wordCloud", sampleData, {
      xField: "category",
      yField: "amount",
    });
    expect(option.series[0].type).toBe("bar");
  });

  it("maps rose chart with roseType area", () => {
    const option = buildEChartsOption("rose", sampleData, {
      angleField: "amount",
      colorField: "category",
    });
    expect(option.series[0].type).toBe("pie");
    expect(option.series[0].roseType).toBe("area");
  });

  it("maps bar_grouped with colorField producing multiple series", () => {
    const groupedData = [
      { month: "Jan", product: "A", sales: 10 },
      { month: "Jan", product: "B", sales: 20 },
      { month: "Feb", product: "A", sales: 15 },
      { month: "Feb", product: "B", sales: 25 },
    ];
    const option = buildEChartsOption("bar_grouped", groupedData, {
      xField: "month",
      yField: "sales",
      colorField: "product",
    });
    expect(option.series.length).toBe(2);
    expect(option.series[0].type).toBe("bar");
    expect(option.series[1].type).toBe("bar");
  });

  it("includes title when provided in config", () => {
    const option = buildEChartsOption("bar", sampleData, {
      xField: "category",
      yField: "amount",
      title: "Sales",
    });
    expect(option.title).toEqual({ text: "Sales" });
  });

  it("omits tooltip when tooltipVisible is false", () => {
    const option = buildEChartsOption("bar", sampleData, {
      xField: "category",
      yField: "amount",
      tooltipVisible: false,
    });
    expect(option.tooltip).toBeUndefined();
  });

  // ---- buildEChartsOption negative paths ----

  describe("negative paths", () => {
    it("should handle empty data array", () => {
      const option = buildEChartsOption("bar", [], {
        xField: "name",
        yField: "value",
      });
      expect(option.series[0].data).toEqual([]);
      expect((option.xAxis as Record<string, unknown>).data).toEqual([]);
    });

    it("should handle missing field keys gracefully", () => {
      const option = buildEChartsOption("bar", sampleData, {});
      // Without xField/yField, categories should be empty and data should be empty
      expect((option.xAxis as Record<string, unknown>).data).toEqual([]);
      expect(option.series[0].data).toEqual([]);
    });

    it("should return base option for unknown chart type", () => {
      // Cast to any to test with an unknown chart type string
      const option = buildEChartsOption("unknown" as "bar", sampleData, {
        xField: "category",
        yField: "amount",
      });
      // Default case returns baseOption with no series
      expect(option.series).toBeUndefined();
    });

    it("should handle pie chart without angleField", () => {
      const option = buildEChartsOption("pie", sampleData, {
        colorField: "category",
      });
      expect(option.series[0].data).toEqual([]);
    });

    it("should handle scatter chart without field keys", () => {
      const option = buildEChartsOption("scatter", sampleData, {});
      // Without xField/yField, values default to 0
      expect(option.series[0].data).toEqual([
        [0, 0],
        [0, 0],
      ]);
    });

    it("should handle gauge chart with empty data", () => {
      const option = buildEChartsOption("gauge", [], { yField: "amount" });
      // No data → gauge tries data[0][yField] which is undefined
      expect(option.series[0].data).toEqual([{ value: undefined, name: "" }]);
    });

    it("should handle gauge chart with gaugeLabel", () => {
      const option = buildEChartsOption("gauge", sampleData, {
        yField: "amount",
        gaugeLabel: "Speed",
      });
      expect(option.series[0].data[0].name).toBe("Speed");
    });

    it("should handle gauge chart without yField", () => {
      const option = buildEChartsOption("gauge", sampleData, {});
      // Falls to the else branch: [{ value: 0 }]
      expect(option.series[0].data).toEqual([{ value: 0 }]);
    });

    it("should omit legend when legendVisible is false", () => {
      const option = buildEChartsOption("bar", sampleData, {
        xField: "category",
        yField: "amount",
        legendVisible: false,
      });
      expect(option.legend).toBeUndefined();
    });

    it("should handle pie chart without colorField (name defaults to empty)", () => {
      const option = buildEChartsOption("pie", sampleData, {
        angleField: "amount",
      });
      expect(option.series[0].data).toEqual([
        { name: "", value: 5 },
        { name: "", value: 15 },
      ]);
    });

    it("should handle donut chart without angleField", () => {
      const option = buildEChartsOption("donut", sampleData, {
        colorField: "category",
      });
      expect(option.series[0].data).toEqual([]);
    });

    it("should handle donut chart without colorField", () => {
      const option = buildEChartsOption("donut", sampleData, {
        angleField: "amount",
      });
      expect(option.series[0].data[0].name).toBe("");
    });

    it("should handle rose chart without angleField", () => {
      const option = buildEChartsOption("rose", sampleData, {});
      expect(option.series[0].data).toEqual([]);
    });

    it("should handle funnel chart without angleField", () => {
      const option = buildEChartsOption("funnel", sampleData, {});
      expect(option.series[0].data).toEqual([]);
    });

    it("should handle funnel chart without colorField", () => {
      const option = buildEChartsOption("funnel", sampleData, {
        angleField: "amount",
      });
      expect(option.series[0].data[0].name).toBe("");
    });

    it("should handle treemap chart without angleField", () => {
      const option = buildEChartsOption("treemap", sampleData, {});
      expect(option.series[0].data).toEqual([]);
    });

    it("should handle treemap chart without colorField", () => {
      const option = buildEChartsOption("treemap", sampleData, {
        angleField: "amount",
      });
      expect(option.series[0].data[0].name).toBe("");
    });

    it("should handle heatmap chart without xField", () => {
      const option = buildEChartsOption("heatmap", sampleData, {
        yField: "amount",
        colorField: "category",
      });
      // Without xKey, categories is empty, so xAxis data is []
      expect((option.xAxis as Record<string, unknown>).data).toEqual([]);
    });

    it("should handle heatmap chart without colorField", () => {
      const option = buildEChartsOption("heatmap", sampleData, {
        xField: "category",
        yField: "amount",
      });
      expect((option.yAxis as Record<string, unknown>).data).toEqual([]);
    });

    it("should handle heatmap chart without yField", () => {
      const option = buildEChartsOption("heatmap", sampleData, {
        xField: "category",
        colorField: "category",
      });
      const seriesData = option.series[0].data as number[][];
      // Without yKey, third element defaults to 0
      expect(seriesData[0][2]).toBe(0);
    });

    it("should handle bar_grouped without colorField (falls back to single series)", () => {
      const option = buildEChartsOption("bar_grouped", sampleData, {
        xField: "category",
        yField: "amount",
      });
      // Without colorField, buildBarSeries returns single series
      expect(option.series.length).toBe(1);
    });

    it("should handle bar_grouped without yField (falls back to single series)", () => {
      const option = buildEChartsOption("bar_grouped", sampleData, {
        xField: "category",
        colorField: "category",
      });
      // Without yKey, buildBarSeries returns single series with empty data
      expect(option.series.length).toBe(1);
      expect(option.series[0].data).toEqual([]);
    });

    it("should handle plain bar with empty data and no yKey", () => {
      const option = buildEChartsOption("bar", [], {});
      expect(option.series[0].data).toEqual([]);
    });

    it("should handle line chart without yField", () => {
      const option = buildEChartsOption("line", sampleData, {
        xField: "category",
      });
      expect(option.series[0].data).toEqual([]);
    });

    it("should handle area chart without yField", () => {
      const option = buildEChartsOption("area", sampleData, {
        xField: "category",
      });
      expect(option.series[0].data).toEqual([]);
    });

    it("should handle column chart without yField", () => {
      const option = buildEChartsOption("column", sampleData, {
        xField: "category",
      });
      expect(option.series[0].data).toEqual([]);
    });

    it("should handle radar chart without yField", () => {
      const option = buildEChartsOption("radar", sampleData, {
        xField: "category",
      });
      expect(option.series[0].data[0].value).toEqual([]);
    });

    it("should handle wordCloud without yField", () => {
      const option = buildEChartsOption("wordCloud", sampleData, {
        xField: "category",
      });
      expect(option.series[0].data).toEqual([]);
    });

    it("should handle scatter chart data values that are null/undefined", () => {
      const dataWithNulls = [{ x: null, y: undefined }];
      const option = buildEChartsOption("scatter", dataWithNulls, {
        xField: "x",
        yField: "y",
      });
      // xKey exists but value is null → 0 via as number, yKey exists but undefined → 0
      expect(option.series[0].data).toEqual([[null, undefined]]);
    });

    it("should handle pie chart with null colorField values (?? branch)", () => {
      const dataWithNullColor = [
        { name: null, value: 10 },
        { name: undefined, value: 20 },
      ];
      const option = buildEChartsOption("pie", dataWithNullColor, {
        angleField: "value",
        colorField: "name",
      });
      // colorKey exists but d[colorKey] is null/undefined → ?? '' kicks in
      expect(option.series[0].data).toEqual([
        { name: "", value: 10 },
        { name: "", value: 20 },
      ]);
    });

    it("should handle donut chart with null colorField values", () => {
      const dataWithNullColor = [{ name: null, value: 10 }];
      const option = buildEChartsOption("donut", dataWithNullColor, {
        angleField: "value",
        colorField: "name",
      });
      expect(option.series[0].data[0].name).toBe("");
    });

    it("should handle funnel chart with null colorField values", () => {
      const dataWithNullColor = [{ name: null, value: 10 }];
      const option = buildEChartsOption("funnel", dataWithNullColor, {
        angleField: "value",
        colorField: "name",
      });
      expect(option.series[0].data[0].name).toBe("");
    });

    it("should handle treemap chart with null colorField values", () => {
      const dataWithNullColor = [{ name: null, value: 10 }];
      const option = buildEChartsOption("treemap", dataWithNullColor, {
        angleField: "value",
        colorField: "name",
      });
      expect(option.series[0].data[0].name).toBe("");
    });

    it("should handle rose chart with null colorField values", () => {
      const dataWithNullColor = [{ name: null, value: 10 }];
      const option = buildEChartsOption("rose", dataWithNullColor, {
        angleField: "value",
        colorField: "name",
      });
      expect(option.series[0].data[0].name).toBe("");
    });

    it("should handle rose chart with angleField but without colorField", () => {
      const option = buildEChartsOption("rose", sampleData, {
        angleField: "amount",
      });
      // colorKey is undefined → name defaults to ''
      expect(option.series[0].data).toEqual([
        { name: "", value: 5 },
        { name: "", value: 15 },
      ]);
    });

    it("should handle heatmap chart with null xField values", () => {
      const dataWithNulls = [{ cat: null, val: 5, color: "A" }];
      const option = buildEChartsOption("heatmap", dataWithNulls, {
        xField: "cat",
        yField: "val",
        colorField: "color",
      });
      const seriesData = option.series[0].data as unknown[][];
      expect(seriesData[0][0]).toBe("");
    });

    it("should handle heatmap chart with null colorField values", () => {
      const dataWithNulls = [{ cat: "X", val: 5, color: null }];
      const option = buildEChartsOption("heatmap", dataWithNulls, {
        xField: "cat",
        yField: "val",
        colorField: "color",
      });
      const seriesData = option.series[0].data as unknown[][];
      expect(seriesData[0][1]).toBe("");
    });

    it("should handle buildBarSeries grouped path with all fields present", () => {
      // This exercises the inner loop at line 332-337
      const groupedData = [
        { month: "Jan", product: "A", sales: 10 },
        { month: "Jan", product: "B", sales: 20 },
        { month: "Feb", product: "A", sales: 15 },
        { month: "Feb", product: "B", sales: 25 },
      ];
      const option = buildEChartsOption("bar_grouped", groupedData, {
        xField: "month",
        yField: "sales",
        colorField: "product",
      });
      // Two groups: A and B
      expect(option.series.length).toBe(2);
      // Series names should be the group names
      const names = option.series.map((s: Record<string, unknown>) => s.name);
      expect(names).toContain("A");
      expect(names).toContain("B");
    });

    it("should handle buildBarSeries grouped with null colorField values", () => {
      const dataWithNulls = [{ month: "Jan", product: null, sales: 10 }];
      const option = buildEChartsOption("bar_grouped", dataWithNulls, {
        xField: "month",
        yField: "sales",
        colorField: "product",
      });
      // null → String(null ?? '') = 'null' → one group
      expect(option.series.length).toBe(1);
    });

    it("should handle buildBarSeries grouped without xField", () => {
      const data = [
        { product: "A", sales: 10 },
        { product: "B", sales: 20 },
      ];
      const option = buildEChartsOption("bar_grouped", data, {
        yField: "sales",
        colorField: "product",
      });
      expect(option.series.length).toBe(2);
    });

    it("should handle buildBarSeries grouped with null xField values", () => {
      const dataWithNullX = [
        { month: null, product: "A", sales: 10 },
        { month: null, product: "B", sales: 20 },
      ];
      const option = buildEChartsOption("bar_grouped", dataWithNullX, {
        xField: "month",
        yField: "sales",
        colorField: "product",
      });
      // null xField values → String(null ?? '') = 'null'
      expect(option.series.length).toBe(2);
    });

    it("should handle scatter chart with null xField values in categories", () => {
      const dataWithNull = [{ cat: null, val: 5 }];
      const option = buildEChartsOption("bar", dataWithNull, {
        xField: "cat",
        yField: "val",
      });
      // d[cat] ?? '' → ''
      expect((option.xAxis as Record<string, unknown>).data).toEqual([""]);
    });
  });

  // ---------- New chart type tests ----------

  describe("sankey chart", () => {
    it("maps sankey chart with nodes and links", () => {
      const option = buildEChartsOption("sankey", [], {
        nodes: [{ name: "a" }, { name: "b" }],
        links: [{ source: "a", target: "b", value: 10 }],
      });
      expect(option.series[0].type).toBe("sankey");
      expect(option.series[0].data).toEqual([{ name: "a" }, { name: "b" }]);
      expect(option.series[0].links).toEqual([
        { source: "a", target: "b", value: 10 },
      ]);
    });

    it("handles sankey without nodes or links", () => {
      const option = buildEChartsOption("sankey", [], {});
      expect(option.series[0].data).toEqual([]);
      expect(option.series[0].links).toEqual([]);
    });
  });

  describe("boxplot chart", () => {
    it("maps boxplot chart with category axis", () => {
      const boxData = [
        { name: "A", values: [1, 2, 3, 4, 5] },
        { name: "B", values: [2, 3, 4, 5, 6] },
      ];
      const option = buildEChartsOption("boxplot", boxData, {
        xField: "name",
        yField: "values",
      });
      expect(option.series[0].type).toBe("boxplot");
      expect((option.xAxis as Record<string, unknown>).type).toBe("category");
    });

    it("handles boxplot without yField", () => {
      const option = buildEChartsOption("boxplot", sampleData, {
        xField: "category",
      });
      expect(option.series[0].data).toEqual([]);
    });
  });

  describe("candlestick chart", () => {
    it("maps candlestick chart with category axis", () => {
      const stockData = [
        { date: "Mon", ohlc: [232, 235, 230, 234] },
        { date: "Tue", ohlc: [234, 238, 232, 236] },
      ];
      const option = buildEChartsOption("candlestick", stockData, {
        xField: "date",
        yField: "ohlc",
      });
      expect(option.series[0].type).toBe("candlestick");
      expect((option.xAxis as Record<string, unknown>).data).toEqual([
        "Mon",
        "Tue",
      ]);
    });

    it("handles candlestick without yField", () => {
      const option = buildEChartsOption("candlestick", sampleData, {
        xField: "category",
      });
      expect(option.series[0].data).toEqual([]);
    });
  });

  describe("sunburst chart", () => {
    it("maps sunburst chart with nodes", () => {
      const nodes = [
        { name: "A", value: 10, children: [{ name: "A1", value: 5 }] },
        { name: "B", value: 20 },
      ];
      const option = buildEChartsOption("sunburst", [], { nodes });
      expect(option.series[0].type).toBe("sunburst");
      expect(option.series[0].data).toEqual(nodes);
    });

    it("handles sunburst without nodes", () => {
      const option = buildEChartsOption("sunburst", [], {});
      expect(option.series[0].data).toEqual([]);
    });
  });

  describe("themeRiver chart", () => {
    it("maps themeRiver chart with x, y, color fields", () => {
      const option = buildEChartsOption("themeRiver", sampleData, {
        xField: "category",
        yField: "amount",
        colorField: "category",
      });
      expect(option.series[0].type).toBe("themeRiver");
      expect(option.series[0].data[0]).toEqual(["X", 5, "X"]);
      expect((option as any).singleAxis).toBeDefined();
      expect((option as any).singleAxis.type).toBe("time");
    });

    it("handles themeRiver without field keys", () => {
      const option = buildEChartsOption("themeRiver", sampleData, {});
      // Without keys, xKey/yKey/colorKey are undefined → defaults apply
      expect(option.series[0].data[0]).toEqual(["", 0, ""]);
    });
  });

  describe("graph chart", () => {
    it("maps graph chart with nodes and links", () => {
      const nodes = [
        { name: "A", value: 10 },
        { name: "B", value: 20 },
      ];
      const links = [{ source: "A", target: "B", value: 5 }];
      const option = buildEChartsOption("graph", [], { nodes, links });
      expect(option.series[0].type).toBe("graph");
      expect(option.series[0].data).toEqual(nodes);
      expect(option.series[0].links).toEqual(links);
    });

    it("handles graph without nodes or links", () => {
      const option = buildEChartsOption("graph", [], {});
      expect(option.series[0].data).toEqual([]);
      expect(option.series[0].links).toEqual([]);
    });

    it("uses force layout by default", () => {
      const option = buildEChartsOption("graph", [], { nodes: [], links: [] });
      expect(option.series[0].layout).toBe("force");
    });

    it("respects custom layout config", () => {
      const option = buildEChartsOption("graph", [], {
        nodes: [],
        links: [],
        layout: "circular",
      });
      expect(option.series[0].layout).toBe("circular");
    });
  });

  describe("parallel chart", () => {
    it("maps parallel chart with dimensions", () => {
      const dims = [
        { dim: 0, key: "a" },
        { dim: 1, key: "b" },
      ];
      const option = buildEChartsOption("parallel", sampleData, {
        dimensions: dims,
      });
      expect(option.series[0].type).toBe("parallel");
      expect(option.parallelAxis).toEqual(dims);
    });

    it("handles parallel without dimensions", () => {
      const option = buildEChartsOption("parallel", sampleData, {});
      expect(option.parallelAxis).toEqual([]);
    });
  });

  describe("pictorialBar chart", () => {
    it("maps pictorialBar chart with category axis", () => {
      const option = buildEChartsOption("pictorialBar", sampleData, {
        xField: "category",
        yField: "amount",
      });
      expect(option.series[0].type).toBe("pictorialBar");
      expect(option.series[0].data).toEqual([5, 15]);
    });

    it("handles pictorialBar without yField", () => {
      const option = buildEChartsOption("pictorialBar", sampleData, {
        xField: "category",
      });
      expect(option.series[0].data).toEqual([]);
    });

    it("uses custom symbolSize when provided", () => {
      const option = buildEChartsOption("pictorialBar", sampleData, {
        xField: "category",
        yField: "amount",
        symbolSize: [30, 30],
      });
      expect(option.series[0].symbolSize).toEqual([30, 30]);
    });
  });

  describe("effectScatter chart", () => {
    it("maps effectScatter chart with coordinate pairs", () => {
      const option = buildEChartsOption("effectScatter", sampleData, {
        xField: "amount",
        yField: "amount",
      });
      expect(option.series[0].type).toBe("effectScatter");
      expect(option.series[0].data).toEqual([
        [5, 5],
        [15, 15],
      ]);
    });

    it("handles effectScatter without field keys", () => {
      const option = buildEChartsOption("effectScatter", sampleData, {});
      expect(option.series[0].data).toEqual([
        [0, 0],
        [0, 0],
      ]);
    });
  });
});
