# GenUI

[English](README.en.md)

A2UI v0.9 兼容的生成式 UI 引擎 —— 通过 Ant Design 6 + ECharts 将流式 A2UI 协议渲染为 React 组件。

## 它做了什么

GenUI 接收 A2UI 协议消息（JSON），将其渲染为实时 React 组件。支持流式输入 —— 边接收 JSON 边更新 UI。

引擎负责：

- **流式解析** —— 累积 LLM 输出的部分 JSON，检测消息边界，发射完整 A2UI 消息
- **数据绑定** —— 基于 `{ "path": "/pointer" }` 语法解析实时数据模型
- **组件渲染** —— 将 A2UI 组件类型映射为 Ant Design / ECharts React 组件
- **Surface 管理** —— 多个独立 UI Surface，各自拥有组件树和数据模型

## 组件目录

10 大类 62 个内置组件：

| 分类 | 组件 |
|---|---|
| 布局 (12) | Row, Column, Card, Tabs, Modal, List, Carousel, Collapse, Space, Splitter, Tooltip, Popover |
| 基础 (6) | Text, Image, Icon, Button, Divider, Web |
| 输入 (14) | TextField, CheckBox, ChoicePicker, Slider, DateTimeInput, Switch, Rate, InputNumber, AutoComplete, Cascader, TreeSelect, Transfer, Upload, ColorPicker |
| 数据 (10) | Table, RichText, Markdown, Avatar, Badge, Statistic, Timeline, Descriptions, Calendar, Tree |
| 反馈 (7) | Alert, Drawer, Progress, Result, Skeleton, Spin, Tag |
| 导航 (6) | Breadcrumb, Steps, Pagination, Dropdown, Anchor, Menu |
| 媒体 (3) | Video, AudioPlayer, Lottie |
| 工具 (3) | QRCode, Watermark, FloatButton |
| 图表 (1) | Chart（ECharts —— 柱状图、折线图、面积图、饼图、环形图、散点图、雷达图、热力图、漏斗图、仪表盘、树图、旭日图、桑基图、关系图、箱线图、K 线图等） |

## 快速开始

### 安装

```bash
npm install @agentskillmania/genui
```

Peer 依赖：`react` >= 18、`react-dom` >= 18。

### 基本用法

```tsx
import { GenUISurface, useGenui } from '@agentskillmania/genui';

function MyApp() {
  const { surfaceManager } = useGenui();

  // 注入 A2UI 消息（来自 LLM 流、API 等）
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
      value: { title: 'Hello GenUI', description: '由 A2UI 协议渲染。' },
    },
  });

  return <GenUISurface surfaceId="demo" surfaceManager={surfaceManager} />;
}
```

### 流式输入

```tsx
import { GenUISurface, useGenui } from '@agentskillmania/genui';

function StreamingDemo() {
  const { surfaceManager } = useGenui();

  // 注入 LLM 原始输出片段 —— 解析器自动检测 JSON 边界并发射完整消息
  async function handleStream(response: Response) {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      surfaceManager.handleChunk(chunk);
    }
  }

  return <GenUISurface surfaceId="my_surface" surfaceManager={surfaceManager} />;
}
```

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

## 架构

```
src/
├── GenuiEngine.ts          # 顶层引擎入口
├── SurfaceManager.ts       # 多 Surface 生命周期管理
├── components/
│   ├── Surface.tsx          # React 组件 —— 渲染 Surface 的组件树
│   ├── registry.ts          # 组件注册表（名称 → 渲染器）
│   ├── types.ts             # 共享组件 Props 接口
│   ├── layout/              # Row, Column, Card, Tabs 等
│   ├── basic/               # Text, Image, Button 等
│   ├── input/               # 表单控件
│   ├── data/                # 数据展示（Table, Statistic 等）
│   ├── feedback/            # Alert, Progress, Tag 等
│   ├── navigation/          # Menu, Steps, Breadcrumb 等
│   ├── media/               # Video, Audio, Lottie
│   ├── chart/               # ECharts 集成
│   └── utility/             # QRCode, Watermark, FloatButton
├── engine/
│   └── SurfaceEngine.ts     # 单 Surface 状态：组件树 + 数据模型 + 绑定解析
├── parser/
│   ├── A2UIStreamParser.ts         # 流 → 完整 A2UI 消息
│   ├── JsonStreamAccumulator.ts    # JSON 边界检测
│   └── plugins/                    # Markdown、纯文本流插件
├── hooks/
│   ├── useGenui.ts                 # 主 Hook —— 创建 Genui + SurfaceManager
│   ├── useSurfaceManager.ts        # 独立 SurfaceManager Hook
│   └── useActionHandler.ts         # Button 动作分发 Hook
├── tools/
│   ├── schemaValidator.ts          # A2UI 消息校验（Zod）
│   └── catalogExport.ts            # 导出组件目录元数据
└── types/
    └── sdk.ts                      # 公共 SDK 类型
```

## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 运行测试
npm test

# 测试覆盖率（90% 阈值）
npm run test:coverage

# 类型检查
npm run lint

# Storybook（组件演示）
npm run storybook
```

## A2UI Skill

`skills/a2ui-generation/` 目录包含用于生成 A2UI JSON 的 AI Skill，提供：

- **SKILL.md** —— 模式选择（DTO 组件、非 DTO 组件、非 DTO 页面）、工作流和校验规则
- **reference/component-catalog.md** —— 62 个组件完整目录及 JSON 示例
- **reference/component-design.md** —— 卡片/页面设计规则、布局安全、等宽分布
- **reference/data-binding.md** —— `{ "path": "..." }` 绑定语法
- **reference/dto-component-mode.md** —— DTO 驱动的组件生成（含 Python Transformer）
- **reference/page-design.md** —— 完整页面设计指南
- **reference/design-review.md** —— 设计质量检查清单
- **reference/review-validation.md** —— A2UI 协议校验规则

## 许可证

MIT
