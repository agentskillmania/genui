/**
 * Chart component — renders data visualizations via ECharts.
 *
 * Supports: bar, line, area, column, scatter, pie, donut, radar,
 * gauge, rose, funnel, heatmap, treemap, wordCloud, bar_grouped,
 * sankey, boxplot, candlestick, sunburst, themeRiver, graph,
 * parallel, pictorialBar, effectScatter.
 *
 * Uses tree-shakable ECharts imports for minimal bundle size.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import * as echarts from 'echarts/core';
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  FunnelChart,
  HeatmapChart,
  TreemapChart,
  GaugeChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  SunburstChart,
  ThemeRiverChart,
  GraphChart,
  ParallelChart,
  PictorialBarChart,
  EffectScatterChart,
} from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  ParallelComponent,
  SingleAxisComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { GenUIComponentProps } from '../types';
import { getFormatter } from './formatterRegistry';

// ===== Config field type helpers =====

/** Chart color palette override. */
type ColorsConfig = string[];

/** Grid (chart canvas) margins. */
interface GridConfig {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

/** Legend placement. Either a preset position string or an explicit offset object. */
type LegendPositionConfig = 'top' | 'bottom' | { top?: number; bottom?: number; left?: string };

/** Tooltip config: trigger + either a string template or a registered formatter name. */
interface TooltipConfig {
  trigger?: 'item' | 'axis';
  /** ECharts string template, e.g. "{b}: {c}". */
  template?: string;
  /** Name of a formatter registered via `registerFormatter`. */
  formatter?: string;
}

/** Axis label config: rotation + unit suffix. */
interface AxisLabelConfig {
  /** Label rotation in degrees (e.g. 20 for department names). */
  rotate?: number;
  /** Unit suffix appended to each tick label, e.g. "万". */
  unit?: string;
}

/** visualMap config for heatmap: range + optional color stops. */
interface VisualMapConfig {
  min?: number;
  max?: number;
  /** Color gradient stops, e.g. ["#e0f2fe", "#0c4a6e"]. */
  colors?: string[];
}

// ===== Resolver helpers (pure functions, no mutation) =====

/** Build the ECharts `tooltip` object from config, resolving formatter by name. */
function resolveTooltip(tooltipConfig: TooltipConfig | undefined): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (tooltipConfig?.trigger) {
    result.trigger = tooltipConfig.trigger;
  }
  if (tooltipConfig?.template) {
    result.formatter = tooltipConfig.template;
  } else if (tooltipConfig?.formatter) {
    // Look up a registered formatter by name; fall back to nothing if unregistered
    // (ECharts will then use its default formatter).
    const fn = getFormatter(tooltipConfig.formatter);
    if (fn) {
      result.formatter = fn;
    }
  }
  return result;
}

/** Build the ECharts `legend` object from a position config. */
function resolveLegend(position: LegendPositionConfig | undefined): Record<string, unknown> {
  if (!position) return {};
  if (position === 'top') return { top: 0 };
  if (position === 'bottom') return { bottom: 0 };
  // Explicit offset object
  return { ...position };
}

/** Build the ECharts `grid` object from a margins config. */
function resolveGrid(grid: GridConfig | undefined): Record<string, unknown> | undefined {
  if (!grid) return undefined;
  const result: Record<string, unknown> = {};
  if (grid.left !== undefined) result.left = grid.left;
  if (grid.right !== undefined) result.right = grid.right;
  if (grid.top !== undefined) result.top = grid.top;
  if (grid.bottom !== undefined) result.bottom = grid.bottom;
  result.containLabel = true;
  return result;
}

/** Build the ECharts axisLabel object from config (applied to category axes). */
function resolveAxisLabel(axisLabel: AxisLabelConfig | undefined): Record<string, unknown> | undefined {
  if (!axisLabel) return undefined;
  const result: Record<string, unknown> = {};
  if (axisLabel.rotate !== undefined) result.rotate = axisLabel.rotate;
  if (axisLabel.unit) {
    result.formatter = `{value}${axisLabel.unit}`;
  }
  return result;
}

// Register only the ECharts modules we use (tree-shaking friendly)
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  FunnelChart,
  HeatmapChart,
  TreemapChart,
  GaugeChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  SunburstChart,
  ThemeRiverChart,
  GraphChart,
  ParallelChart,
  PictorialBarChart,
  EffectScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  ParallelComponent,
  SingleAxisComponent,
  CanvasRenderer,
]);

/** One series definition for the `combo` chart type (multi-series / dual-axis). */
export interface ComboSeriesSpec {
  /** ECharts series type: `bar` | `line` | `area`(=line+areaStyle) | `scatter` */
  type: 'bar' | 'line' | 'area' | 'scatter';
  /** Series display name (legend / tooltip). */
  name?: string;
  /** Data field whose values feed this series. Maps each row to `row[field]`. */
  field: string;
  /** Which Y axis this series binds to. `0` = left, `1` = right (dual-axis). Default `0`. */
  yAxisIndex?: number;
  /** Smooth the line (line/area only). */
  smooth?: boolean;
  /** Show value labels on bars/lines. */
  labelVisible?: boolean;
  /** Fixed series color (CSS hex). Omit to use ECharts default palette. */
  color?: string;
}

/** Y-axis definition for the `combo` chart type. */
export interface ComboYAxisSpec {
  /** Axis display name (e.g. "费用(万元)"). */
  name?: string;
  /** Axis position. `left` (default) or `right`. */
  position?: 'left' | 'right';
  /** Fixed display unit suffix appended to axis tick labels, e.g. "%". */
  unit?: string;
}

/** Supported chart type strings from the A2UI protocol */
export type ChartType =
  | 'bar'
  | 'line'
  | 'area'
  | 'column'
  | 'scatter'
  | 'pie'
  | 'donut'
  | 'radar'
  | 'gauge'
  | 'rose'
  | 'funnel'
  | 'heatmap'
  | 'treemap'
  | 'wordCloud'
  | 'bar_grouped'
  | 'sankey'
  | 'boxplot'
  | 'candlestick'
  | 'sunburst'
  | 'themeRiver'
  | 'graph'
  | 'parallel'
  | 'pictorialBar'
  | 'effectScatter'
  | 'combo';

/**
 * Map A2UI chart config fields to an ECharts option object.
 *
 * A2UI convention uses xField / yField / angleField / colorField to
 * reference data keys.  This function normalises those into ECharts
 * series + axis definitions.
 */
export function buildEChartsOption(
  chartType: ChartType,
  data: Record<string, unknown>[],
  config: Record<string, unknown>,
): echarts.EChartsCoreOption {
  const {
    xField,
    yField,
    angleField,
    colorField,
    title,
    smooth,
    stack,
    legendVisible = true,
    tooltipVisible = true,
    // ===== Display & formatting overrides =====
    colors,
    grid,
    legendPosition,
    tooltip,
    axisLabel,
    visualMap,
    indicatorMax,
  } = config;

  const xKey = xField as string | undefined;
  const yKey = yField as string | undefined;
  const angleKey = angleField as string | undefined;
  const colorKey = colorField as string | undefined;

  // Category names from xField for cartesian charts
  const categories = xKey ? data.map((d) => String(d[xKey] ?? '')) : [];

  // Shared axisLabel config (applied to category axes of cartesian charts)
  const resolvedAxisLabel = resolveAxisLabel(axisLabel as AxisLabelConfig | undefined);
  const categoryAxisData = { type: 'category' as const, data: categories, axisLabel: resolvedAxisLabel };
  const categoryAxisY = { type: 'category' as const, data: categories, axisLabel: resolvedAxisLabel };
  const valueAxisWithUnit = (unit?: string) => ({
    type: 'value' as const,
    axisLabel: unit ? { formatter: `{value}${unit}` } : undefined,
  });

  const baseOption: Partial<echarts.EChartsCoreOption> = {
    ...(colors ? { color: colors as ColorsConfig } : {}),
    tooltip: tooltipVisible ? resolveTooltip(tooltip as TooltipConfig | undefined) : undefined,
    legend: legendVisible ? resolveLegend(legendPosition as LegendPositionConfig | undefined) : undefined,
    grid: resolveGrid(grid as GridConfig | undefined),
  };

  if (title) {
    baseOption.title = { text: title as string };
  }

  switch (chartType) {
    case 'bar':
    case 'bar_grouped':
      return {
        ...baseOption,
        xAxis: categoryAxisData,
        yAxis: { type: 'value' },
        series: buildBarSeries(data, xKey, yKey, colorKey, chartType === 'bar_grouped'),
      };

    case 'column':
      return {
        ...baseOption,
        xAxis: { type: 'value' },
        yAxis: categoryAxisY,
        series: [{
          type: 'bar',
          data: yKey ? data.map((d) => d[yKey] as number) : [],
        }],
      };

    case 'line':
      return {
        ...baseOption,
        xAxis: categoryAxisData,
        yAxis: { type: 'value' },
        series: [{
          type: 'line',
          data: yKey ? data.map((d) => d[yKey] as number) : [],
          smooth: smooth as boolean,
        }],
      };

    case 'area':
      return {
        ...baseOption,
        xAxis: categoryAxisData,
        yAxis: { type: 'value' },
        series: [{
          type: 'line',
          data: yKey ? data.map((d) => d[yKey] as number) : [],
          areaStyle: {},
          smooth: smooth as boolean,
        }],
      };

    case 'scatter':
      return {
        ...baseOption,
        xAxis: { type: 'value' },
        yAxis: { type: 'value' },
        series: [{
          type: 'scatter',
          data: data.map((d) => [
            xKey ? (d[xKey] as number) : 0,
            yKey ? (d[yKey] as number) : 0,
          ]),
        }],
      };

    case 'pie':
      return {
        ...baseOption,
        series: [{
          type: 'pie',
          data: angleKey
            ? data.map((d) => ({
                name: colorKey ? String(d[colorKey] ?? '') : '',
                value: d[angleKey] as number,
              }))
            : [],
        }],
      };

    case 'donut':
      return {
        ...baseOption,
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          data: angleKey
            ? data.map((d) => ({
                name: colorKey ? String(d[colorKey] ?? '') : '',
                value: d[angleKey] as number,
              }))
            : [],
        }],
      };

    case 'rose':
      return {
        ...baseOption,
        series: [{
          type: 'pie',
          roseType: 'area',
          data: angleKey
            ? data.map((d) => ({
                name: colorKey ? String(d[colorKey] ?? '') : '',
                value: d[angleKey] as number,
              }))
            : [],
        }],
      };

    case 'radar':
      return {
        ...baseOption,
        radar: {
          indicator: categories.map((name, i) => ({
            name,
            max: (indicatorMax as number[] | undefined)?.[i] ?? 100,
          })),
        },
        series: [{
          type: 'radar',
          data: [{
            value: yKey ? data.map((d) => d[yKey] as number) : [],
          }],
        }],
      };

    case 'gauge':
      return {
        ...baseOption,
        series: [{
          type: 'gauge',
          data: yKey
            ? [{ value: data[0]?.[yKey] as number, name: (config.gaugeLabel as string) || '' }]
            : [{ value: 0 }],
        }],
      };

    case 'funnel':
      return {
        ...baseOption,
        series: [{
          type: 'funnel',
          data: angleKey
            ? data.map((d) => ({
                name: colorKey ? String(d[colorKey] ?? '') : '',
                value: d[angleKey] as number,
              }))
            : [],
        }],
      };

    case 'heatmap':
      return {
        ...baseOption,
        xAxis: { type: 'category', data: categories },
        yAxis: { type: 'category', data: colorKey ? [...new Set(data.map((d) => String(d[colorKey] ?? '')))] : [] },
        visualMap: (visualMap as VisualMapConfig | undefined)
          ? {
              min: (visualMap as VisualMapConfig).min ?? 0,
              max: (visualMap as VisualMapConfig).max ?? 100,
              calculable: true,
              ...((visualMap as VisualMapConfig).colors
                ? { inRange: { color: (visualMap as VisualMapConfig).colors } }
                : {}),
            }
          : { min: 0, max: 100, calculable: true },
        series: [{
          type: 'heatmap',
          data: data.map((d) => [
            xKey ? String(d[xKey] ?? '') : '',
            colorKey ? String(d[colorKey] ?? '') : '',
            yKey ? (d[yKey] as number) : 0,
          ]),
        }],
      };

    case 'treemap':
      return {
        ...baseOption,
        series: [{
          type: 'treemap',
          data: angleKey
            ? data.map((d) => ({
                name: colorKey ? String(d[colorKey] ?? '') : '',
                value: d[angleKey] as number,
              }))
            : [],
        }],
      };

    case 'wordCloud':
      // wordCloud requires the echarts-wordcloud extension.
      // Render a bar-chart placeholder when the extension is not registered.
      return {
        ...baseOption,
        xAxis: categoryAxisData,
        yAxis: { type: 'value' },
        series: [{
          type: 'bar',
          data: yKey ? data.map((d) => d[yKey] as number) : [],
        }],
      };

    case 'sankey':
      return {
        ...baseOption,
        series: [{
          type: 'sankey',
          layout: 'none',
          emphasis: { focus: 'adjacency' },
          data: (config.nodes as { name: string }[]) || [],
          links: (config.links as { source: string; target: string; value: number }[]) || [],
        }],
      };

    case 'boxplot':
      return {
        ...baseOption,
        xAxis: categoryAxisData,
        yAxis: { type: 'value' },
        series: [{
          type: 'boxplot',
          data: yKey ? data.map((d) => d[yKey] as number[]) : [],
        }],
      };

    case 'candlestick':
      return {
        ...baseOption,
        xAxis: categoryAxisData,
        yAxis: { type: 'value' },
        series: [{
          type: 'candlestick',
          data: yKey ? data.map((d) => d[yKey] as number[]) : [],
        }],
      };

    case 'sunburst':
      return {
        ...baseOption,
        series: [{
          type: 'sunburst',
          data: (config.nodes as Record<string, unknown>[]) || [],
          radius: ['15%', '80%'],
        }],
      };

    case 'themeRiver':
      return {
        ...baseOption,
        singleAxis: {
          type: 'time',
        },
        series: [{
          type: 'themeRiver',
          data: data.map((d) => [
            xKey ? String(d[xKey] ?? '') : '',
            yKey ? (d[yKey] as number) : 0,
            colorKey ? String(d[colorKey] ?? '') : '',
          ]),
        }],
      };

    case 'graph':
      return {
        ...baseOption,
        series: [{
          type: 'graph',
          layout: (config.layout as string) || 'force',
          roam: true,
          data: (config.nodes as { name: string; value?: number }[]) || [],
          links: (config.links as { source: string; target: string; value?: number }[]) || [],
          emphasis: { focus: 'adjacency' },
        }],
      };

    case 'parallel':
      return {
        ...baseOption,
        parallelAxis: (config.dimensions as { dim: number; type?: string; data?: string[] }[]) || [],
        series: [{
          type: 'parallel',
          data: data.map((d) =>
            (config.dimensions as { dim: number; key: string }[])?.map((dim) => d[dim.key] as number) || []
          ),
        }],
      };

    case 'pictorialBar':
      return {
        ...baseOption,
        xAxis: categoryAxisData,
        yAxis: { type: 'value' },
        series: [{
          type: 'pictorialBar',
          data: yKey ? data.map((d) => d[yKey] as number) : [],
          symbolSize: (config.symbolSize as number[] | number) ?? [20, 20],
        }],
      };

    case 'effectScatter':
      return {
        ...baseOption,
        xAxis: { type: 'value' },
        yAxis: { type: 'value' },
        series: [{
          type: 'effectScatter',
          rippleEffect: { brushType: 'stroke' },
          data: data.map((d) => [
            xKey ? (d[xKey] as number) : 0,
            yKey ? (d[yKey] as number) : 0,
          ]),
        }],
      };

    case 'combo': {
      // Multi-series / dual-axis combo chart (e.g. bar + line on two Y axes).
      //   config.xField   — shared category field (X axis)
      //   config.yAxes    — ComboYAxisSpec[] (default: single value axis)
      //   config.series   — ComboSeriesSpec[] (one entry per rendered series)
      const seriesSpecs = (config.series as ComboSeriesSpec[]) || [];
      const yAxesRaw = (config.yAxes as ComboYAxisSpec[]) || [];

      const yAxisList = yAxesRaw.length
        ? yAxesRaw.map((y) => ({
            type: 'value' as const,
            name: y.name,
            position: y.position ?? 'left',
            axisLabel: y.unit ? { formatter: `{value}${y.unit}` } : undefined,
          }))
        : [{ type: 'value' as const }];

      const series = seriesSpecs.map((s) => {
        const isLine = s.type === 'line' || s.type === 'area';
        const base: Record<string, unknown> = {
          type: isLine ? 'line' : s.type,
          name: s.name,
          yAxisIndex: s.yAxisIndex ?? 0,
          data: data.map((d) => d[s.field] as number),
          itemStyle: s.color ? { color: s.color } : undefined,
          lineStyle: s.color && isLine ? { color: s.color } : undefined,
        };
        if (isLine) {
          base.smooth = s.smooth;
          if (s.type === 'area') base.areaStyle = s.color ? { color: s.color, opacity: 0.15 } : {};
        }
        if (s.labelVisible) {
          base.label = { show: true, position: s.type === 'bar' ? 'top' : undefined };
        }
        return base;
      });

      return {
        ...baseOption,
        xAxis: categoryAxisData,
        yAxis: yAxisList,
        series,
      };
    }

    default:
      return baseOption;
  }
}

/**
 * Build bar series — single series for plain bar, multiple grouped series
 * when a colorField is present and bar_grouped is requested.
 */
function buildBarSeries(
  data: Record<string, unknown>[],
  xKey: string | undefined,
  yKey: string | undefined,
  colorKey: string | undefined,
  grouped: boolean,
): Record<string, unknown>[] {
  if (!grouped || !colorKey || !yKey) {
    return [{
      type: 'bar',
      data: yKey ? data.map((d) => d[yKey] as number) : [],
      stack: undefined,
    }];
  }

  // Group by colorKey, produce one series per group
  const groups = new Map<string, { name: string; values: number[] }>();
  for (const row of data) {
    const group = String(row[colorKey] ?? '');
    if (!groups.has(group)) {
      groups.set(group, { name: group, values: [] });
    }
  }

  // Build aligned values per x category
  const categories = xKey ? data.map((d) => String(d[xKey] ?? '')) : [];
  for (const [group, entry] of groups) {
    for (const row of data) {
      if (String(row[colorKey] ?? '') === group) {
        entry.values.push(row[yKey] as number);
      }
    }
  }

  return Array.from(groups.values()).map((entry) => ({
    type: 'bar' as const,
    name: entry.name,
    data: entry.values,
  }));
}

/**
 * Chart component — renders ECharts inside a sized container div.
 *
 * Properties:
 *   chartType — one of the ChartType strings
 *   data      — array of row objects
 *   config    — field mappings (xField, yField, angleField, colorField) and display options
 *   width     — container width (default 100%)
 *   height    — container height (default 400px)
 *   clickAction — action name fired when a series item is clicked
 *   style     — additional CSS for the container
 */
export const Chart: React.FC<GenUIComponentProps> = ({ properties, onAction }) => {
  const {
    chartType = 'bar',
    data = [],
    config = {},
    width = '100%',
    height = 400,
    clickAction,
    style,
  } = properties ?? {};

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  // Keep the latest onAction/clickAction in refs so the click handler (bound
  // once at init) always invokes the current callback without re-binding.
  const onActionRef = useRef(onAction);
  const clickActionRef = useRef(clickAction);
  onActionRef.current = onAction;
  clickActionRef.current = clickAction;

  const getOption = useCallback(() => {
    return buildEChartsOption(
      (chartType as ChartType) || 'bar',
      (data as Record<string, unknown>[]) || [],
      (config as Record<string, unknown>) || {},
    );
  }, [chartType, data, config]);

  // Initialize ECharts instance
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = echarts.init(containerRef.current);
    chartRef.current = chart;
    chart.setOption(getOption());

    // Series click → onAction(clickAction, { name, value, seriesName, dataIndex })
    chart.on('click', (params) => {
      const action = clickActionRef.current as string | undefined;
      const handler = onActionRef.current;
      if (action && handler && params) {
        handler(action, {
          name: params.name,
          value: params.value,
          seriesName: params.seriesName,
          seriesIndex: params.seriesIndex,
          dataIndex: params.dataIndex,
        });
      }
    });

    return () => {
      chart.dispose();
      chartRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update option when inputs change
  useEffect(() => {
    chartRef.current?.setOption(getOption(), true);
  }, [getOption]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      chartRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const containerStyle: React.CSSProperties = {
    width: width as string | number,
    height: height as string | number,
    ...style as React.CSSProperties,
  };

  return <div ref={containerRef} style={containerStyle} />;
};

Chart.displayName = 'Chart';
