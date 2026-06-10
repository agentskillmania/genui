/**
 * Chart component stories — multiple ECharts chart types.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Chart } from '../src/components/chart/Chart';

const chartMeta: Meta<typeof Chart> = {
  title: 'Chart/Chart',
  component: Chart,
  argTypes: {
    id: { control: 'text' },
  },
};
export default chartMeta;

type ChartStory = StoryObj<typeof Chart>;

// Shared sales data for cartesian charts
const salesData = [
  { month: 'Jan', sales: 120 },
  { month: 'Feb', sales: 200 },
  { month: 'Mar', sales: 150 },
  { month: 'Apr', sales: 320 },
  { month: 'May', sales: 280 },
  { month: 'Jun', sales: 350 },
];

// Shared pie/donut data
const categoryData = [
  { category: 'Electronics', revenue: 4500 },
  { category: 'Clothing', revenue: 3200 },
  { category: 'Food', revenue: 2800 },
  { category: 'Books', revenue: 1500 },
  { category: 'Sports', revenue: 2000 },
];

// Scatter data
const scatterData = [
  { x: 10, y: 20 },
  { x: 25, y: 45 },
  { x: 40, y: 30 },
  { x: 55, y: 70 },
  { x: 70, y: 55 },
  { x: 85, y: 90 },
];

// ---------------------------------------------------------------------------
// Bar Chart
// ---------------------------------------------------------------------------

export const BarChart: ChartStory = {
  name: 'Bar Chart',
  args: {
    id: 'chart-bar',
    type: 'Chart',
    properties: {
      chartType: 'bar',
      data: salesData,
      config: {
        xField: 'month',
        yField: 'sales',
        title: 'Monthly Sales (Bar)',
      },
      height: 400,
    },
  },
};

// ---------------------------------------------------------------------------
// Line Chart
// ---------------------------------------------------------------------------

export const LineChart: ChartStory = {
  name: 'Line Chart',
  args: {
    id: 'chart-line',
    type: 'Chart',
    properties: {
      chartType: 'line',
      data: salesData,
      config: {
        xField: 'month',
        yField: 'sales',
        title: 'Monthly Sales (Line)',
        smooth: true,
      },
      height: 400,
    },
  },
};

// ---------------------------------------------------------------------------
// Pie Chart
// ---------------------------------------------------------------------------

export const PieChart: ChartStory = {
  name: 'Pie Chart',
  args: {
    id: 'chart-pie',
    type: 'Chart',
    properties: {
      chartType: 'pie',
      data: categoryData,
      config: {
        angleField: 'revenue',
        colorField: 'category',
        title: 'Revenue by Category',
      },
      height: 400,
    },
  },
};

// ---------------------------------------------------------------------------
// Donut Chart
// ---------------------------------------------------------------------------

export const DonutChart: ChartStory = {
  name: 'Donut Chart',
  args: {
    id: 'chart-donut',
    type: 'Chart',
    properties: {
      chartType: 'donut',
      data: categoryData,
      config: {
        angleField: 'revenue',
        colorField: 'category',
        title: 'Revenue by Category (Donut)',
      },
      height: 400,
    },
  },
};

// ---------------------------------------------------------------------------
// Scatter Chart
// ---------------------------------------------------------------------------

export const ScatterChart: ChartStory = {
  name: 'Scatter Chart',
  args: {
    id: 'chart-scatter',
    type: 'Chart',
    properties: {
      chartType: 'scatter',
      data: scatterData,
      config: {
        xField: 'x',
        yField: 'y',
        title: 'Scatter Distribution',
      },
      height: 400,
    },
  },
};

// ---------------------------------------------------------------------------
// Area Chart
// ---------------------------------------------------------------------------

export const AreaChart: ChartStory = {
  name: 'Area Chart',
  args: {
    id: 'chart-area',
    type: 'Chart',
    properties: {
      chartType: 'area',
      data: salesData,
      config: {
        xField: 'month',
        yField: 'sales',
        title: 'Monthly Sales (Area)',
        smooth: true,
      },
      height: 400,
    },
  },
};

// ---------------------------------------------------------------------------
// Rose Chart
// ---------------------------------------------------------------------------

export const RoseChart: ChartStory = {
  name: 'Rose Chart',
  args: {
    id: 'chart-rose',
    type: 'Chart',
    properties: {
      chartType: 'rose',
      data: categoryData,
      config: {
        angleField: 'revenue',
        colorField: 'category',
        title: 'Revenue Rose Chart',
      },
      height: 400,
    },
  },
};

// ---------------------------------------------------------------------------
// Funnel Chart
// ---------------------------------------------------------------------------

export const FunnelChart: ChartStory = {
  name: 'Funnel Chart',
  args: {
    id: 'chart-funnel',
    type: 'Chart',
    properties: {
      chartType: 'funnel',
      data: [
        { stage: 'Visits', count: 10000 },
        { stage: 'Signups', count: 5000 },
        { stage: 'Trials', count: 2500 },
        { stage: 'Purchases', count: 800 },
      ],
      config: {
        angleField: 'count',
        colorField: 'stage',
        title: 'Conversion Funnel',
      },
      height: 400,
    },
  },
};

// ---------------------------------------------------------------------------
// Radar Chart
// ---------------------------------------------------------------------------

export const RadarChart: ChartStory = {
  name: 'Radar Chart',
  args: {
    id: 'chart-radar',
    type: 'Chart',
    properties: {
      chartType: 'radar',
      data: [
        { dimension: 'Speed', value: 85 },
        { dimension: 'Reliability', value: 90 },
        { dimension: 'Comfort', value: 78 },
        { dimension: 'Safety', value: 92 },
        { dimension: 'Efficiency', value: 70 },
      ],
      config: {
        xField: 'dimension',
        yField: 'value',
        title: 'Vehicle Assessment',
      },
      height: 400,
    },
  },
};

// ---------------------------------------------------------------------------
// Gauge Chart
// ---------------------------------------------------------------------------

export const GaugeChart: ChartStory = {
  name: 'Gauge Chart',
  args: {
    id: 'chart-gauge',
    type: 'Chart',
    properties: {
      chartType: 'gauge',
      data: [{ metric: 'CPU', usage: 72 }],
      config: {
        yField: 'usage',
        gaugeLabel: 'CPU Usage',
        title: 'System Health',
      },
      height: 400,
    },
  },
};
