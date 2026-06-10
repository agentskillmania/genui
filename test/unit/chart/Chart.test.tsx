/**
 * Unit tests for the ECharts-based Chart component.
 *
 * Tests cover: render without crash, ECharts instance lifecycle,
 * correct option generation for each chart type, option updates on
 * prop changes, cleanup on unmount, and graceful handling of empty data.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

// Mock echarts sub-modules — they export chart/component/renderer classes
// that get passed to echarts.use(). We mock them as empty objects since
// only echarts/core's init/use/setOption matter for tests.
vi.mock('echarts/charts', () => ({}));
vi.mock('echarts/components', () => ({}));
vi.mock('echarts/renderers', () => ({ CanvasRenderer: {} }));

// Mock echarts/core — factory must be self-contained (vi.mock is hoisted).
// Chart.tsx uses `import * as echarts from 'echarts/core'` so `use` and `init`
// must be named exports (not just on `default`).
vi.mock('echarts/core', () => {
  const fakeSetOption = vi.fn();
  const fakeResize = vi.fn();
  const fakeDispose = vi.fn();
  const fakeInit = vi.fn();
  const fakeUse = vi.fn();

  const fakeInstance = {
    setOption: fakeSetOption,
    resize: fakeResize,
    dispose: fakeDispose,
  };

  fakeInit.mockReturnValue(fakeInstance);

  return {
    __esModule: true,
    init: fakeInit,
    use: fakeUse,
    // Exported for test access via require()
    _mockSetOption: fakeSetOption,
    _mockResize: fakeResize,
    _mockDispose: fakeDispose,
    _mockInit: fakeInit,
  };
});

// Must come AFTER vi.mock
import { Chart, buildEChartsOption } from '../../../src/components/chart/Chart';

// ---------- helpers ----------

/** Access the mock functions from the echarts/core mock */
function getMocks() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const core = require('echarts/core') as {
    init: ReturnType<typeof vi.fn>;
    use: ReturnType<typeof vi.fn>;
    _mockSetOption: ReturnType<typeof vi.fn>;
    _mockResize: ReturnType<typeof vi.fn>;
    _mockDispose: ReturnType<typeof vi.fn>;
  };
  return {
    init: core.init,
    setOption: core._mockSetOption,
    resize: core._mockResize,
    dispose: core._mockDispose,
  };
}

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'chart-1',
    type: 'Chart',
    properties: {
      chartType: 'bar',
      data: [
        { name: 'A', value: 10 },
        { name: 'B', value: 20 },
      ],
      config: { xField: 'name', yField: 'value' },
      width: '100%',
      height: 400,
      ...overrides,
    },
  };
}

// ---------- tests ----------

describe('Chart component', () => {
  beforeEach(() => {
    const { setOption, dispose, resize } = getMocks();
    setOption.mockClear();
    dispose.mockClear();
    resize.mockClear();
  });

  it('renders a container div without crashing', () => {
    const { container } = render(<Chart {...makeProps()} />);
    const div = container.querySelector('div');
    expect(div).toBeTruthy();
  });

  it('initializes an ECharts instance on mount', () => {
    const { init } = getMocks();
    render(<Chart {...makeProps()} />);
    expect(init).toHaveBeenCalledTimes(1);
  });

  it('calls setOption with correct bar series type', () => {
    const { setOption } = getMocks();
    render(<Chart {...makeProps()} />);

    expect(setOption).toHaveBeenCalled();
    const option = setOption.mock.calls[0][0];
    expect(option.series[0].type).toBe('bar');
  });

  it('calls setOption with correct line series type', () => {
    const { setOption } = getMocks();
    render(<Chart {...makeProps({ chartType: 'line' })} />);

    expect(setOption).toHaveBeenCalled();
    const option = setOption.mock.calls[0][0];
    expect(option.series[0].type).toBe('line');
  });

  it('calls setOption for pie chart using angleField and colorField', () => {
    const { setOption } = getMocks();
    render(
      <Chart
        {...makeProps({
          chartType: 'pie',
          config: { angleField: 'value', colorField: 'name' },
        })}
      />,
    );

    expect(setOption).toHaveBeenCalled();
    const option = setOption.mock.calls[0][0];
    expect(option.series[0].type).toBe('pie');
    expect(option.series[0].data).toEqual([
      { name: 'A', value: 10 },
      { name: 'B', value: 20 },
    ]);
  });

  it('calls setOption for donut chart with inner radius', () => {
    const { setOption } = getMocks();
    render(
      <Chart
        {...makeProps({
          chartType: 'donut',
          config: { angleField: 'value', colorField: 'name' },
        })}
      />,
    );

    expect(setOption).toHaveBeenCalled();
    const option = setOption.mock.calls[0][0];
    expect(option.series[0].type).toBe('pie');
    expect(option.series[0].radius).toEqual(['40%', '70%']);
  });

  it('renders area chart with areaStyle', () => {
    const { setOption } = getMocks();
    render(<Chart {...makeProps({ chartType: 'area' })} />);

    expect(setOption).toHaveBeenCalled();
    const option = setOption.mock.calls[0][0];
    expect(option.series[0].type).toBe('line');
    expect(option.series[0].areaStyle).toBeDefined();
  });

  it('disposes chart on unmount', () => {
    const { dispose } = getMocks();
    const { unmount } = render(<Chart {...makeProps()} />);

    expect(dispose).not.toHaveBeenCalled();
    unmount();
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it('handles chartType change by calling setOption again', () => {
    const { setOption } = getMocks();
    const { rerender } = render(<Chart {...makeProps({ chartType: 'bar' })} />);
    setOption.mockClear();

    // Re-render with a different chart type
    rerender(<Chart {...makeProps({ chartType: 'scatter' })} />);

    expect(setOption).toHaveBeenCalled();
    const option = setOption.mock.calls[0][0];
    expect(option.series[0].type).toBe('scatter');
  });

  it('handles empty data gracefully', () => {
    const { setOption } = getMocks();
    render(<Chart {...makeProps({ data: [] })} />);

    expect(setOption).toHaveBeenCalled();
    const option = setOption.mock.calls[0][0];
    // Should not throw, series data should be empty
    expect(option.series[0].data).toEqual([]);
  });
});

// ---------- buildEChartsOption unit tests ----------

describe('buildEChartsOption', () => {
  const sampleData = [
    { category: 'X', amount: 5 },
    { category: 'Y', amount: 15 },
  ];

  it('maps bar chart correctly', () => {
    const option = buildEChartsOption('bar', sampleData, { xField: 'category', yField: 'amount' });
    expect(option.series[0].type).toBe('bar');
    expect(option.series[0].data).toEqual([5, 15]);
    expect((option.xAxis as Record<string, unknown>).data).toEqual(['X', 'Y']);
  });

  it('maps column chart with horizontal axes', () => {
    const option = buildEChartsOption('column', sampleData, { xField: 'category', yField: 'amount' });
    expect(option.series[0].type).toBe('bar');
    expect((option.yAxis as Record<string, unknown>).type).toBe('category');
    expect((option.xAxis as Record<string, unknown>).type).toBe('value');
  });

  it('maps line chart with smooth flag', () => {
    const option = buildEChartsOption('line', sampleData, { xField: 'category', yField: 'amount', smooth: true });
    expect(option.series[0].type).toBe('line');
    expect(option.series[0].smooth).toBe(true);
  });

  it('maps area chart with areaStyle', () => {
    const option = buildEChartsOption('area', sampleData, { xField: 'category', yField: 'amount' });
    expect(option.series[0].type).toBe('line');
    expect(option.series[0].areaStyle).toBeDefined();
  });

  it('maps scatter chart with coordinate pairs', () => {
    const option = buildEChartsOption('scatter', sampleData, { xField: 'amount', yField: 'amount' });
    expect(option.series[0].type).toBe('scatter');
    expect(option.series[0].data).toEqual([[5, 5], [15, 15]]);
  });

  it('maps radar chart with indicators', () => {
    const option = buildEChartsOption('radar', sampleData, { xField: 'category', yField: 'amount' });
    expect(option.series[0].type).toBe('radar');
    expect(option.radar).toBeDefined();
  });

  it('maps gauge chart with first data value', () => {
    const option = buildEChartsOption('gauge', sampleData, { yField: 'amount' });
    expect(option.series[0].type).toBe('gauge');
    expect(option.series[0].data[0].value).toBe(5);
  });

  it('maps funnel chart', () => {
    const option = buildEChartsOption('funnel', sampleData, { angleField: 'amount', colorField: 'category' });
    expect(option.series[0].type).toBe('funnel');
    expect(option.series[0].data).toEqual([
      { name: 'X', value: 5 },
      { name: 'Y', value: 15 },
    ]);
  });

  it('maps heatmap chart with visualMap', () => {
    const option = buildEChartsOption('heatmap', sampleData, { xField: 'category', yField: 'amount', colorField: 'category' });
    expect(option.series[0].type).toBe('heatmap');
    expect(option.visualMap).toBeDefined();
  });

  it('maps treemap chart', () => {
    const option = buildEChartsOption('treemap', sampleData, { angleField: 'amount', colorField: 'category' });
    expect(option.series[0].type).toBe('treemap');
  });

  it('maps wordCloud as bar fallback', () => {
    const option = buildEChartsOption('wordCloud', sampleData, { xField: 'category', yField: 'amount' });
    expect(option.series[0].type).toBe('bar');
  });

  it('maps rose chart with roseType area', () => {
    const option = buildEChartsOption('rose', sampleData, { angleField: 'amount', colorField: 'category' });
    expect(option.series[0].type).toBe('pie');
    expect(option.series[0].roseType).toBe('area');
  });

  it('maps bar_grouped with colorField producing multiple series', () => {
    const groupedData = [
      { month: 'Jan', product: 'A', sales: 10 },
      { month: 'Jan', product: 'B', sales: 20 },
      { month: 'Feb', product: 'A', sales: 15 },
      { month: 'Feb', product: 'B', sales: 25 },
    ];
    const option = buildEChartsOption('bar_grouped', groupedData, { xField: 'month', yField: 'sales', colorField: 'product' });
    expect(option.series.length).toBe(2);
    expect(option.series[0].type).toBe('bar');
    expect(option.series[1].type).toBe('bar');
  });

  it('includes title when provided in config', () => {
    const option = buildEChartsOption('bar', sampleData, { xField: 'category', yField: 'amount', title: 'Sales' });
    expect(option.title).toEqual({ text: 'Sales' });
  });

  it('omits tooltip when tooltipVisible is false', () => {
    const option = buildEChartsOption('bar', sampleData, { xField: 'category', yField: 'amount', tooltipVisible: false });
    expect(option.tooltip).toBeUndefined();
  });
});
