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

// ---------------------------------------------------------------------------
// Sankey Chart
// ---------------------------------------------------------------------------

export const SankeyChart: ChartStory = {
  name: 'Sankey Chart',
  args: {
    id: 'chart-sankey',
    type: 'Chart',
    properties: {
      chartType: 'sankey',
      data: [],
      config: {
        title: 'Energy Flow',
        nodes: [
          { name: 'Coal' },
          { name: 'Gas' },
          { name: 'Electricity' },
          { name: 'Heating' },
          { name: 'Cooling' },
        ],
        links: [
          { source: 'Coal', target: 'Electricity', value: 100 },
          { source: 'Gas', target: 'Heating', value: 80 },
          { source: 'Electricity', target: 'Heating', value: 40 },
          { source: 'Electricity', target: 'Cooling', value: 60 },
        ],
      },
      height: 400,
    },
  },
};

// ---------------------------------------------------------------------------
// Candlestick Chart
// ---------------------------------------------------------------------------

export const CandlestickChart: ChartStory = {
  name: 'Candlestick Chart',
  args: {
    id: 'chart-candlestick',
    type: 'Chart',
    properties: {
      chartType: 'candlestick',
      data: [
        { date: 'Mon', ohlc: [2320.26, 2326.38, 2313.04, 2323.48] },
        { date: 'Tue', ohlc: [2316.37, 2325.50, 2309.53, 2321.32] },
        { date: 'Wed', ohlc: [2321.32, 2334.12, 2314.78, 2326.42] },
        { date: 'Thu', ohlc: [2326.42, 2331.39, 2319.71, 2329.39] },
        { date: 'Fri', ohlc: [2329.39, 2336.27, 2325.24, 2334.06] },
      ],
      config: {
        xField: 'date',
        yField: 'ohlc',
        title: 'Stock Price (Candlestick)',
      },
      height: 400,
    },
  },
};

// ---------------------------------------------------------------------------
// Sunburst Chart
// ---------------------------------------------------------------------------

export const SunburstChart: ChartStory = {
  name: 'Sunburst Chart',
  args: {
    id: 'chart-sunburst',
    type: 'Chart',
    properties: {
      chartType: 'sunburst',
      data: [],
      config: {
        title: 'Budget Allocation',
        nodes: [
          {
            name: 'Engineering',
            value: 40,
            children: [
              { name: 'Frontend', value: 20 },
              { name: 'Backend', value: 15 },
              { name: 'DevOps', value: 5 },
            ],
          },
          {
            name: 'Marketing',
            value: 30,
            children: [
              { name: 'Digital', value: 18 },
              { name: 'Events', value: 12 },
            ],
          },
          {
            name: 'Operations',
            value: 30,
            children: [
              { name: 'HR', value: 15 },
              { name: 'Finance', value: 15 },
            ],
          },
        ],
      },
      height: 400,
    },
  },
};

// ---------------------------------------------------------------------------
// ThemeRiver Chart
// ---------------------------------------------------------------------------

export const ThemeRiverChart: ChartStory = {
  name: 'ThemeRiver Chart',
  args: {
    id: 'chart-themeriver',
    type: 'Chart',
    properties: {
      chartType: 'themeRiver',
      data: [
        { date: '2024-01', value: 120, theme: 'React' },
        { date: '2024-01', value: 80, theme: 'Vue' },
        { date: '2024-02', value: 150, theme: 'React' },
        { date: '2024-02', value: 95, theme: 'Vue' },
        { date: '2024-03', value: 180, theme: 'React' },
        { date: '2024-03', value: 110, theme: 'Vue' },
      ],
      config: {
        xField: 'date',
        yField: 'value',
        colorField: 'theme',
        title: 'Framework Popularity Over Time',
      },
      height: 400,
    },
  },
};

// ---------------------------------------------------------------------------
// Graph Chart
// ---------------------------------------------------------------------------

export const GraphChart: ChartStory = {
  name: 'Graph Chart',
  args: {
    id: 'chart-graph',
    type: 'Chart',
    properties: {
      chartType: 'graph',
      data: [],
      config: {
        title: 'Network Topology',
        layout: 'force',
        nodes: [
          { name: 'Server A', value: 10 },
          { name: 'Server B', value: 8 },
          { name: 'Client 1', value: 3 },
          { name: 'Client 2', value: 3 },
          { name: 'Database', value: 12 },
        ],
        links: [
          { source: 'Server A', target: 'Server B', value: 5 },
          { source: 'Server A', target: 'Client 1', value: 3 },
          { source: 'Server B', target: 'Client 2', value: 3 },
          { source: 'Server B', target: 'Database', value: 8 },
        ],
      },
      height: 400,
    },
  },
};

// ---------------------------------------------------------------------------
// Parallel Chart
// ---------------------------------------------------------------------------

export const ParallelChart: ChartStory = {
  name: 'Parallel Chart',
  args: {
    id: 'chart-parallel',
    type: 'Chart',
    properties: {
      chartType: 'parallel',
      data: [
        { power: 180, weight: 1500, speed: 220, price: 25000 },
        { power: 120, weight: 1200, speed: 180, price: 18000 },
        { power: 250, weight: 1800, speed: 260, price: 45000 },
      ],
      config: {
        title: 'Car Specifications',
        dimensions: [
          { dim: 0, type: 'value', key: 'power' },
          { dim: 1, type: 'value', key: 'weight' },
          { dim: 2, type: 'value', key: 'speed' },
          { dim: 3, type: 'value', key: 'price' },
        ],
      },
      height: 400,
    },
  },
};

// ---------------------------------------------------------------------------
// PictorialBar Chart
// ---------------------------------------------------------------------------

export const PictorialBarChart: ChartStory = {
  name: 'PictorialBar Chart',
  args: {
    id: 'chart-pictorialbar',
    type: 'Chart',
    properties: {
      chartType: 'pictorialBar',
      data: [
        { label: 'A', value: 80 },
        { label: 'B', value: 60 },
        { label: 'C', value: 90 },
      ],
      config: {
        xField: 'label',
        yField: 'value',
        title: 'Score by Category',
      },
      height: 400,
    },
  },
};

// ---------------------------------------------------------------------------
// EffectScatter Chart
// ---------------------------------------------------------------------------

export const EffectScatterChart: ChartStory = {
  name: 'EffectScatter Chart',
  args: {
    id: 'chart-effectscatter',
    type: 'Chart',
    properties: {
      chartType: 'effectScatter',
      data: [
        { lng: 116.4, lat: 39.9 },
        { lng: 121.5, lat: 31.2 },
        { lng: 113.3, lat: 23.1 },
        { lng: 114.1, lat: 22.5 },
      ],
      config: {
        xField: 'lng',
        yField: 'lat',
        title: 'City Locations',
      },
      height: 400,
    },
  },
};
