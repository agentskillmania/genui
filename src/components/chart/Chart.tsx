/**
 * Chart component — renders data visualizations via ECharts.
 *
 * Supports: bar, line, area, column, scatter, pie, donut, radar,
 * gauge, rose, funnel, heatmap, treemap, wordCloud, bar_grouped.
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
} from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { GenUIComponentProps } from '../types';

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
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

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
  | 'bar_grouped';

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
  } = config;

  const xKey = xField as string | undefined;
  const yKey = yField as string | undefined;
  const angleKey = angleField as string | undefined;
  const colorKey = colorField as string | undefined;

  // Category names from xField for cartesian charts
  const categories = xKey ? data.map((d) => String(d[xKey] ?? '')) : [];

  const baseOption: Partial<echarts.EChartsCoreOption> = {
    tooltip: tooltipVisible ? {} : undefined,
    legend: legendVisible ? {} : undefined,
  };

  if (title) {
    baseOption.title = { text: title as string };
  }

  switch (chartType) {
    case 'bar':
    case 'bar_grouped':
      return {
        ...baseOption,
        xAxis: { type: 'category', data: categories },
        yAxis: { type: 'value' },
        series: buildBarSeries(data, xKey, yKey, colorKey, chartType === 'bar_grouped'),
      };

    case 'column':
      return {
        ...baseOption,
        xAxis: { type: 'value' },
        yAxis: { type: 'category', data: categories },
        series: [{
          type: 'bar',
          data: yKey ? data.map((d) => d[yKey] as number) : [],
        }],
      };

    case 'line':
      return {
        ...baseOption,
        xAxis: { type: 'category', data: categories },
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
        xAxis: { type: 'category', data: categories },
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
          indicator: categories.map((name) => ({ name, max: 100 })),
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
        visualMap: { min: 0, max: 100, calculable: true },
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
        xAxis: { type: 'category', data: categories },
        yAxis: { type: 'value' },
        series: [{
          type: 'bar',
          data: yKey ? data.map((d) => d[yKey] as number) : [],
        }],
      };

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
 *   style     — additional CSS for the container
 */
export const Chart: React.FC<GenUIComponentProps> = ({ properties }) => {
  const {
    chartType = 'bar',
    data = [],
    config = {},
    width = '100%',
    height = 400,
    style,
  } = properties;

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

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
