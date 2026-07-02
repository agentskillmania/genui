# GenUI

[中文](README.md)

**Feed it JSON. Get React UI.**

GenUI is a generative UI engine: it takes A2UI protocol messages (JSON) and renders them as live React components. Supports streaming — feed JSON as it arrives, the UI updates in real time.

---

## What You Can Build

| Scenario | What it means |
|----------|---------------|
| **LLM-generated UI** | AI outputs JSON → GenUI renders tables, charts, forms, and interactive components. Your AI app generates *interfaces*, not just text |
| **Server-driven UI** | Backend describes the UI in JSON → frontend renders dynamically. No app store review needed |
| **Configurable dashboards** | JSON describes layout, charts, and data bindings. Swap layouts without redeploying |
| **Multi-surface apps** | Run multiple independent UIs (each with its own component tree and data model) on the same page |

---

## Core Concepts

Three things to understand:

**Message** — JSON you send to the engine. Tells it what to render ("create a button", "update data", "delete a surface").

**Surface** — An independent UI space with its own component tree and data model. One page can have many surfaces.

**SurfaceManager** — Your bridge to the engine. All messages and stream data go through it.

---

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
  useGenui();
  const { surfaceManager } = useSurfaceManager();

  if (!surfaceManager) return null;

  // Send a message — tell the engine what to render
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

  // Send another message — bind data model
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

### Streaming — render as you receive

```tsx
import { GenUISurface, useSurfaceManager } from '@agentskillmania/genui';

function StreamingDemo() {
  const { surfaceManager } = useSurfaceManager();

  async function handleStream(response: Response) {
    if (!surfaceManager) return;
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      surfaceManager.handleChunk(chunk); // auto-detects JSON boundaries, renders incrementally
    }
  }

  return surfaceManager ? <GenUISurface surfaceManager={surfaceManager} /> : null;
}
```

---

## API Reference

| Method | What it does |
|--------|--------------|
| `handleMessage(msg)` | Send a complete A2UI message (JSON object or string) |
| `handleChunk(chunk)` | Feed raw text chunks — auto-detects JSON boundaries and renders incrementally |
| `submitUIAction(action)` | Submit a user interaction event (button click, row click, etc.) |
| `submitUIDataModel(syncMsg)` | Submit a form field change sync event |
| `on(event, handler)` | Subscribe to surface events (action, syncUIToData, etc.) |
| `registerComponent(type, renderer)` | Register a custom component renderer |
| `Genui.registerFunction(name, handler)` | Register a host function invocable via `{call, args}` in JSON |

---

## Going Further

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

### Register Host Functions (invoked by `{ call, args }` in JSON)

```tsx
Genui.registerFunction('queryWeather', (args) => {
  return `It's 28°C and clear in ${args.city}.`;
});

// Your message can then reference it:
// { "component": "Text", "text": { "call": "queryWeather", "args": { "city": "Beijing" } } }
```

### Handle User Interactions

```tsx
const handleAction = (action) => {
  console.log(action.action, action.sourceComponentId, action.context);
  // → "drilldownCity" "cityBtn" { cityId: "123" }
};

// The component message declares an action:
// { "id": "cityBtn", "component": "Button", "text": "Details", "action": { "event": { "name": "drilldownCity" } } }
```

---

## Built-in Components (62)

| Category | Components |
|----------|------------|
| **Layout** (12) | Row, Column, Card, Tabs, Modal, List, Carousel, Collapse, Space, Splitter, Tooltip, Popover |
| **Basic** (6) | Text, Image, Icon, Button, Divider, Web |
| **Input** (14) | TextField, CheckBox, ChoicePicker, Slider, DateTimeInput, Switch, Rate, InputNumber, AutoComplete, Cascader, TreeSelect, Transfer, Upload, ColorPicker |
| **Data** (10) | Table, RichText, Markdown, Avatar, Badge, Statistic, Timeline, Descriptions, Calendar, Tree |
| **Feedback** (7) | Alert, Drawer, Progress, Result, Skeleton, Spin, Tag |
| **Navigation** (6) | Breadcrumb, Steps, Pagination, Dropdown, Anchor, Menu |
| **Media** (3) | Video, AudioPlayer, Lottie |
| **Utility** (3) | QRCode, Watermark, FloatButton |
| **Chart** (1) | Chart (ECharts — bar, line, area, pie, donut, scatter, radar, heatmap, funnel, gauge, treemap, sunburst, sankey, graph, boxplot, candlestick, etc.) |

---

## Development

```bash
npm install        # Install dependencies
npm run build      # Build
npm test           # Run tests
npm run test:coverage  # Coverage (90% threshold)
npm run lint       # Type check
npm run storybook  # Component demos
```

---

## AI Skill Context

The `skills/a2ui-generation/` directory contains prompts for AI models (LLMs). When you want an AI to generate A2UI JSON, feed these files as context. They include the component catalog, data binding syntax, design rules, and validation schemas. Human developers don't need to read this.

---

## License

MIT
