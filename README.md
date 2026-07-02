# GenUI

[English](README.en.md)

**输入 JSON，输出 React UI。**

GenUI 是一个生成式 UI 引擎：它接收 A2UI 协议消息（JSON），将其渲染为实时 React 组件。支持流式输入 —— 你可以一边接收 JSON 一边更新 UI。

---

## 它能干什么

| 场景 | 描述 |
|------|------|
| **LLM 生成 UI** | AI 输出 JSON → GenUI 渲染为表格、图表、表单等交互组件。你的 AI 应用可以"生成界面"而不是只输出文本 |
| **服务端驱动 UI** | 后端下发组件描述 → 前端动态渲染，无需客户端发版 |
| **配置化仪表盘** | JSON 描述布局、图表、数据绑定，一键切换 |
| **多 Surface 管理** | 同一个页面可以运行多个独立的"微前端"（组件树 + 数据模型），彼此隔离 |

---

## 核心概念

只要理解 3 个东西就能用起来：

**消息** — 你发给引擎的 JSON。告诉引擎"创建一个按钮"、"更新数据"、"删除一个 Surface"。

**Surface** — 一个独立 UI 空间，有自己的组件树和数据模型。一个页面可以有多个 Surface。

**SurfaceManager** — 你与引擎之间的通信闸口。所有消息、流式数据都通过它收发。

---

## 快速开始

### 安装

```bash
npm install @agentskillmania/genui
```

Peer 依赖：`react` ^18 || ^19、`react-dom` ^18 || ^19。

### 使用

```tsx
import { GenUISurface, useGenui, useSurfaceManager } from '@agentskillmania/genui';

function MyApp() {
  useGenui();
  const { surfaceManager } = useSurfaceManager();

  if (!surfaceManager) return null;

  // 发送一条消息 —— 告诉引擎你要渲染什么
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

  // 再发一条消息 —— 绑定数据
  surfaceManager.handleMessage({
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'demo',
      path: '/',
      value: { title: 'Hello GenUI', description: '由 A2UI 协议渲染。' },
    },
  });

  return <GenUISurface surfaceManager={surfaceManager} />;
}
```

### 流式输入 —— 一边接收一边渲染

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
      surfaceManager.handleChunk(chunk); // 自动检测 JSON 边界，边接收边渲染
    }
  }

  return surfaceManager ? <GenUISurface surfaceManager={surfaceManager} /> : null;
}
```

---

## API 速览

| 方法 | 作用 |
|------|------|
| `handleMessage(msg)` | 发送一条完整的 A2UI 消息（JSON 对象或字符串）|
| `handleChunk(chunk)` | 输入流式文本片段，自动检测 JSON 边界并渲染 |
| `submitUIAction(action)` | 提交用户交互事件（如按钮点击、行点击）|
| `submitUIDataModel(syncMsg)` | 提交表单变更同步事件 |
| `on(event, handler)` | 订阅 Surface 事件（action、syncUIToData 等）|
| `registerComponent(type, renderer)` | 注册自定义组件 |
| `Genui.registerFunction(name, handler)` | 注册可被 `{call, args}` 调用的函数 |

---

## 你可以做的事情

### 自定义组件

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

### 注册宿主函数（被 JSON 中的 `{ call, args }` 调用）

```tsx
Genui.registerFunction('queryWeather', (args) => {
  return `今日${args.city}气温 28°C，晴。`;
});

// 然后消息中可以这样引用：
// { "component": "Text", "text": { "call": "queryWeather", "args": { "city": "北京" } } }
```

### 处理用户交互

```tsx
const handleAction = (action) => {
  console.log(action.action, action.sourceComponentId, action.context);
  // → "drilldownCity" "cityBtn" { cityId: "123" }
};

// 组件消息中声明 action：
// { "id": "cityBtn", "component": "Button", "text": "查看详情", "action": { "event": { "name": "drilldownCity" } } }
```

---

## 支持的组件（62 个）

| 分类 | 组件 |
|------|------|
| **布局** (12) | Row, Column, Card, Tabs, Modal, List, Carousel, Collapse, Space, Splitter, Tooltip, Popover |
| **基础** (6) | Text, Image, Icon, Button, Divider, Web |
| **输入** (14) | TextField, CheckBox, ChoicePicker, Slider, DateTimeInput, Switch, Rate, InputNumber, AutoComplete, Cascader, TreeSelect, Transfer, Upload, ColorPicker |
| **数据** (10) | Table, RichText, Markdown, Avatar, Badge, Statistic, Timeline, Descriptions, Calendar, Tree |
| **反馈** (7) | Alert, Drawer, Progress, Result, Skeleton, Spin, Tag |
| **导航** (6) | Breadcrumb, Steps, Pagination, Dropdown, Anchor, Menu |
| **媒体** (3) | Video, AudioPlayer, Lottie |
| **工具** (3) | QRCode, Watermark, FloatButton |
| **图表** (1) | Chart（ECharts —— 柱状图、折线图、面积图、饼图、环形图、散点图、雷达图、热力图、漏斗图、仪表盘、树图、旭日图、桑基图、关系图、箱线图、K 线图等）|

---

## 开发

```bash
npm install        # 安装依赖
npm run build      # 构建
npm test           # 运行测试
npm run test:coverage  # 测试覆盖率（90% 阈值）
npm run lint       # 类型检查
npm run storybook  # 组件演示
```

---

## 给 AI 的 Skill 上下文

`skills/a2ui-generation/` 目录是为 AI 模型（LLM）准备的提示词（prompt），当你想让 AI 生成 A2UI JSON 时，把这些文件作为上下文喂给 AI。包含组件目录、绑定语法、设计规则等参考。人类开发者不需要读它。

---

## 许可证

MIT
