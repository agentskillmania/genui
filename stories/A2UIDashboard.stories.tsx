/**
 * Story 1: A2UI Dashboard — building a data dashboard step-by-step via protocol.
 *
 * Demonstrates how an AI agent incrementally streams A2UI protocol messages
 * to construct a live analytics dashboard with charts, statistics, and tables.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useRef, useState } from 'react';

import { GenUISurface } from '../src/components/Surface';
import { SurfaceManager } from '../src/SurfaceManager';

// Register all components (side-effect import)
import '../src/components/index';

const meta: Meta<typeof GenUISurface> = {
  title: 'A2UI Stories/Data Dashboard',
  component: GenUISurface,
};
export default meta;

type Story = StoryObj<typeof GenUISurface>;

/**
 * Wrapper that streams A2UI protocol chunks with a delay,
 * simulating how an AI agent progressively builds a dashboard.
 */
const DashboardBuilder: React.FC = () => {
  const managerRef = useRef<SurfaceManager>(new SurfaceManager());
  const [step, setStep] = useState(0);
  const [actionLog, setActionLog] = useState<string[]>([]);

  const steps = [
    // Step 1: Create surface
    () => {
      const m = managerRef.current;
      m.beginTextStream();
      m.receiveTextChunk(
        '{"createSurface":{"surfaceId":"dashboard","catalogId":"genui-antd"}}',
      );
      m.endTextStream();
      setStep(1);
    },
    // Step 2: Add title row + statistic cards
    () => {
      const m = managerRef.current;
      m.getEngine().updateComponents('dashboard', [
        JSON.stringify({ id: 'root', component: 'Column', children: ['title', 'stats-row'] }),
        JSON.stringify({ id: 'title', component: 'Text', text: '📊 Sales Analytics Dashboard', variant: 'h2' }),
        JSON.stringify({ id: 'stats-row', component: 'Row', gutter: 16, children: ['stat-col-1', 'stat-col-2', 'stat-col-3'] }),
        JSON.stringify({
          id: 'stat-col-1', component: 'Column', span: 8, child: 'stat-1',
        }),
        JSON.stringify({
          id: 'stat-1', component: 'Statistic',
          title: 'Total Revenue', value: 128930, prefix: '$', precision: 0,
        }),
        JSON.stringify({
          id: 'stat-col-2', component: 'Column', span: 8, child: 'stat-2',
        }),
        JSON.stringify({
          id: 'stat-2', component: 'Statistic',
          title: 'Orders', value: 2847, suffix: 'orders',
        }),
        JSON.stringify({
          id: 'stat-col-3', component: 'Column', span: 8, child: 'stat-3',
        }),
        JSON.stringify({
          id: 'stat-3', component: 'Statistic',
          title: 'Avg. Order', value: 45.3, prefix: '$', precision: 2,
        }),
      ]);
      setStep(2);
    },
    // Step 3: Add bar chart
    () => {
      const m = managerRef.current;
      m.getEngine().updateComponents('dashboard', [
        JSON.stringify({ id: 'root', component: 'Column', children: ['title', 'stats-row', 'chart-section'] }),
        JSON.stringify({
          id: 'chart-section', component: 'Card', title: 'Monthly Revenue', style: { marginTop: 24 }, child: 'revenue-chart',
        }),
        JSON.stringify({
          id: 'revenue-chart', component: 'Chart',
          chartType: 'bar', height: 350,
          data: [
            { month: 'Jan', revenue: 8200 }, { month: 'Feb', revenue: 9100 },
            { month: 'Mar', revenue: 11500 }, { month: 'Apr', revenue: 10800 },
            { month: 'May', revenue: 13200 }, { month: 'Jun', revenue: 14100 },
            { month: 'Jul', revenue: 12800 }, { month: 'Aug', revenue: 15600 },
            { month: 'Sep', revenue: 14200 }, { month: 'Oct', revenue: 16800 },
            { month: 'Nov', revenue: 18900 }, { month: 'Dec', revenue: 21300 },
          ],
          config: { xField: 'month', yField: 'revenue', title: '2024 Monthly Revenue' },
        }),
      ]);
      setStep(3);
    },
    // Step 4: Add donut + pie side-by-side
    () => {
      const m = managerRef.current;
      m.getEngine().updateComponents('dashboard', [
        JSON.stringify({ id: 'root', component: 'Column', children: ['title', 'stats-row', 'chart-section', 'charts-row'] }),
        JSON.stringify({
          id: 'charts-row', component: 'Row', gutter: 16, style: { marginTop: 24 }, children: ['category-col', 'funnel-col'],
        }),
        JSON.stringify({
          id: 'category-col', component: 'Column', span: 12, child: 'category-card',
        }),
        JSON.stringify({
          id: 'category-card', component: 'Card', title: 'Revenue by Category', child: 'category-chart',
        }),
        JSON.stringify({
          id: 'category-chart', component: 'Chart',
          chartType: 'donut', height: 300,
          data: [
            { category: 'Electronics', revenue: 4500 },
            { category: 'Clothing', revenue: 3200 },
            { category: 'Home & Garden', revenue: 2800 },
            { category: 'Books', revenue: 1500 },
            { category: 'Sports', revenue: 2000 },
          ],
          config: { angleField: 'revenue', colorField: 'category' },
        }),
        JSON.stringify({
          id: 'funnel-col', component: 'Column', span: 12, child: 'funnel-card',
        }),
        JSON.stringify({
          id: 'funnel-card', component: 'Card', title: 'Conversion Funnel', child: 'funnel-chart',
        }),
        JSON.stringify({
          id: 'funnel-chart', component: 'Chart',
          chartType: 'funnel', height: 300,
          data: [
            { stage: 'Visits', count: 10000 },
            { stage: 'Signups', count: 5000 },
            { stage: 'Trials', count: 2500 },
            { stage: 'Purchases', count: 800 },
          ],
          config: { angleField: 'count', colorField: 'stage' },
        }),
      ]);
      setStep(4);
    },
    // Step 5: Add data table
    () => {
      const m = managerRef.current;
      m.getEngine().updateComponents('dashboard', [
        JSON.stringify({ id: 'root', component: 'Column', children: ['title', 'stats-row', 'chart-section', 'charts-row', 'table-card'] }),
        JSON.stringify({
          id: 'table-card', component: 'Card', title: 'Top Products', style: { marginTop: 24 }, child: 'products-table',
        }),
        JSON.stringify({
          id: 'products-table', component: 'Table',
          columns: [
            { title: 'Product', dataIndex: 'product', key: 'product' },
            { title: 'Category', dataIndex: 'category', key: 'category' },
            { title: 'Revenue', dataIndex: 'revenue', key: 'revenue' },
            { title: 'Units', dataIndex: 'units', key: 'units' },
          ],
          dataSource: [
            { key: '1', product: 'MacBook Pro 16"', category: 'Electronics', revenue: '$45,200', units: 120 },
            { key: '2', product: 'AirPods Max', category: 'Electronics', revenue: '$32,100', units: 285 },
            { key: '3', product: 'Winter Jacket', category: 'Clothing', revenue: '$18,600', units: 410 },
            { key: '4', product: 'Smart Garden Kit', category: 'Home & Garden', revenue: '$14,800', units: 190 },
            { key: '5', product: 'Running Shoes', category: 'Sports', revenue: '$12,300', units: 340 },
          ],
        }),
      ]);
      setStep(5);
    },
    // Step 6: Add footer actions
    () => {
      const m = managerRef.current;
      m.getEngine().updateComponents('dashboard', [
        JSON.stringify({ id: 'root', component: 'Column', children: ['title', 'stats-row', 'chart-section', 'charts-row', 'table-card', 'footer-divider', 'footer-row'] }),
        JSON.stringify({
          id: 'footer-divider', component: 'Divider', style: { marginTop: 24 },
        }),
        JSON.stringify({
          id: 'footer-row', component: 'Row', justify: 'center', child: 'footer-col',
        }),
        JSON.stringify({
          id: 'footer-col', component: 'Column', span: 24,
          style: { textAlign: 'center' }, children: ['export-btn', 'refresh-btn'],
        }),
        JSON.stringify({
          id: 'export-btn', component: 'Button',
          text: 'Export Report', variant: 'primary',
        }),
        JSON.stringify({
          id: 'refresh-btn', component: 'Button',
          text: 'Refresh Data', style: { marginLeft: 8 },
        }),
      ]);
      setStep(6);
    },
  ];

  useEffect(() => {
    // Auto-stream steps with delays to simulate AI streaming
    if (step < steps.length) {
      const timer = setTimeout(() => steps[step](), step === 0 ? 300 : 800);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div>
      <div style={{ marginBottom: 16, padding: '8px 16px', background: '#e6f7ff', borderRadius: 4 }}>
        <strong>Protocol Step: {step}/{steps.length}</strong>
        <span style={{ marginLeft: 8, color: '#666' }}>
          {step === 0 && 'Initializing...'}
          {step === 1 && 'Surface created → waiting for components'}
          {step === 2 && 'Statistics cards added'}
          {step === 3 && 'Bar chart added'}
          {step === 4 && 'Donut + Funnel charts added'}
          {step === 5 && 'Data table added'}
          {step === 6 && '✅ Dashboard complete — click buttons to interact'}
        </span>
      </div>
      <GenUISurface
        surfaceManager={managerRef.current}
        width="100%"
        height={800}
        style={{ padding: 24, background: '#fafafa', borderRadius: 8, border: '1px solid #d9d9d9' }}
        onAction={(action) => {
          setActionLog((prev) => [
            ...prev.slice(-4),
            `[Action] component=${action.sourceComponentId} context=${JSON.stringify(action.context)}`,
          ]);
        }}
      />
      {actionLog.length > 0 && (
        <div style={{ marginTop: 8, padding: 8, background: '#fff7e6', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 }}>
          {actionLog.map((log, i) => <div key={i}>{log}</div>)}
        </div>
      )}
    </div>
  );
};

export const BuildDashboard: Story = {
  name: 'Build Dashboard Step-by-Step',
  render: () => <DashboardBuilder />,
};
