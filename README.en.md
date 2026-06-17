# GenUI

[中文](README.md)

A2UI v0.9 compatible generative UI engine — renders streaming A2UI protocol as React components via Ant Design 6 + ECharts.

## What It Does

GenUI takes A2UI protocol messages (JSON) and renders them as live React components. It supports streaming input — feed partial JSON as it arrives, and the UI updates in real time.

The engine handles:

- **Stream parsing** — accumulate partial JSON from LLM output, detect message boundaries, emit complete A2UI messages
- **Data binding** — resolve `{ "path": "/pointer" }` bindings against a live data model, or invoke host-registered functions via `{ "call": "...", "args": {...} }`
- **Component rendering** — map A2UI component types to Ant Design / ECharts React components
- **Surface management** — multiple independent UI surfaces, each with its own component tree and data model

## Component Catalog

62 built-in components across 10 categories:

| Category | Components |
|---|---|
| Layout (12) | Row, Column, Card, Tabs, Modal, List, Carousel, Collapse, Space, Splitter, Tooltip, Popover |
| Basic (6) | Text, Image, Icon, Button, Divider, Web |
| Input (14) | TextField, CheckBox, ChoicePicker, Slider, DateTimeInput, Switch, Rate, InputNumber, AutoComplete, Cascader, TreeSelect, Transfer, Upload, ColorPicker |
| Data (10) | Table, RichText, Markdown, Avatar, Badge, Statistic, Timeline, Descriptions, Calendar, Tree |
| Feedback (7) | Alert, Drawer, Progress, Result, Skeleton, Spin, Tag |
| Navigation (6) | Breadcrumb, Steps, Pagination, Dropdown, Anchor, Menu |
| Media (3) | Video, AudioPlayer, Lottie |
| Utility (3) | QRCode, Watermark, FloatButton |
| Chart (1) | Chart (ECharts — bar, line, area, pie, donut, scatter, radar, heatmap, funnel, gauge, treemap, sunburst, sankey, graph, boxplot, candlestick, etc.) |

## Quick Start

### Install

```bash
npm install @agentskillmania/genui
```

Peer dependencies: `react` ^18 || ^19, `react-dom` ^18 || ^19.

### Basic Usage

```tsx
import { GenUISurface, useGenui, useSurfaceManager } from '@agentskillmania/genui';

function MyApp() {
  // useGenui initializes the engine, useSurfaceManager creates and manages the SurfaceManager
  useGenui();
  const { surfaceManager } = useSurfaceManager();

  if (!surfaceManager) return null;

  // Feed A2UI messages (from LLM stream, API, etc.)
  surfaceManager.handleMessage({
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'demo',
      components: [
        { id: 'root', component: 'Card', children: ['title', 'body'], bordered: true },
        { id: 'title', component: 'Text', text: { path: '/title' }, variant: 'h3' },
        { id: 'body', component: 'Text', text: { path: '/description' }, variant: 'body' },
      ],
    },
  });

  surfaceManager.handleMessage({
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'demo',
      path: '/',
      value: { title: 'Hello GenUI', description: 'Rendered from A2UI protocol.' },
    },
  });

  return <GenUISurface surfaceManager={surfaceManager} />;
}
```

### Streaming

```tsx
import { GenUISurface, useSurfaceManager } from '@agentskillmania/genui';

function StreamingDemo() {
  const { surfaceManager } = useSurfaceManager();

  // Feed raw LLM output chunks — the parser handles JSON detection and message boundaries
  async function handleStream(response: Response) {
    if (!surfaceManager) return;
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      surfaceManager.handleChunk(chunk); // parser accumulates and emits complete messages
    }
  }

  return surfaceManager ? <GenUISurface surfaceManager={surfaceManager} /> : null;
}
```

### Custom Components

```tsx
import { registerComponent } from '@agentskillmania/genui';
import type { ComponentRenderer } from '@agentskillmania/genui';

const MyWidget: ComponentRenderer = ({ properties, children }) => (
  <div style={properties?.style}>
    <h3>{properties?.title}</h3>
    {children}
  </div>
);

registerComponent('MyWidget', MyWidget);
```

## Architecture

```
src/
├── GenuiEngine.ts          # Top-level engine entry point
├── SurfaceManager.ts       # Multi-surface lifecycle management
├── components/
│   ├── Surface.tsx          # React component — renders a surface's component tree
│   ├── registry.ts          # Component registry (name → renderer)
│   ├── types.ts             # Shared component props interface
│   ├── layout/              # Row, Column, Card, Tabs, etc.
│   ├── basic/               # Text, Image, Button, etc.
│   ├── input/               # Form controls
│   ├── data/                # Data display (Table, Statistic, etc.)
│   ├── feedback/            # Alert, Progress, Tag, etc.
│   ├── navigation/          # Menu, Steps, Breadcrumb, etc.
│   ├── media/               # Video, Audio, Lottie
│   ├── chart/               # ECharts integration
│   └── utility/             # QRCode, Watermark, FloatButton
├── engine/
│   └── SurfaceEngine.ts     # Per-surface state: component tree + data model + binding resolution
├── parser/
│   ├── A2UIStreamParser.ts         # Stream → complete A2UI messages
│   ├── JsonStreamAccumulator.ts    # JSON boundary detection
│   └── plugins/                    # Markdown, plain text stream plugins
├── hooks/
│   ├── useGenui.ts                 # Main hook — creates Genui + SurfaceManager
│   ├── useSurfaceManager.ts        # Standalone SurfaceManager hook
│   └── useActionHandler.ts         # Button action dispatch hook
├── tools/
│   ├── schemaValidator.ts          # A2UI message validation (Zod)
│   └── catalogExport.ts            # Export component catalog metadata
└── types/
    └── sdk.ts                      # Public SDK types
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage (90% threshold)
npm run test:coverage

# Type check
npm run lint

# Storybook (component demos)
npm run storybook
```

## A2UI Skill

The `skills/a2ui-generation/` directory contains an AI skill for generating A2UI JSON. It provides:

- **SKILL.md** — Mode selection (DTO component, non-DTO component, non-DTO page), workflow, and validation rules
- **reference/component-catalog.md** — Full catalog of 62 components with JSON examples
- **reference/component-design.md** — Card/page design rules, layout safety, equal distribution
- **reference/data-binding.md** — `{ "path": "..." }` binding syntax
- **reference/dto-component-mode.md** — DTO-driven component generation with Python transformers
- **reference/page-design.md** — Full page design guidelines
- **reference/design-review.md** — Quality checklist
- **reference/review-validation.md** — A2UI protocol validation rules

## License

MIT
