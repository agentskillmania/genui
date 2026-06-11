# Component Catalog (GenUI — 62 Components)

## Platform

GenUI renders on web via React + Ant Design 6 + ECharts. Components use standard CSS `style` objects (no restricted `styles` property). All standard CSS properties are available.

## Protocol Shape

A2UI v0.9 separates structure from data:

- `updateComponents`: component tree, layout, styles, binding paths
- `updateDataModel`: data content corresponding to binding paths
- Dynamic content is bound via `{"path": "..."}`

Minimal structure:

```json
{
  "version": "v0.9",
  "updateComponents": {
    "surfaceId": "sample_surface",
    "components": [
      { "id": "root", "component": "Column", "children": ["title"] },
      { "id": "title", "component": "Text", "text": { "path": "/page/title" }, "variant": "h2" }
    ]
  }
}
```

```json
{
  "version": "v0.9",
  "updateDataModel": {
    "surfaceId": "sample_surface",
    "path": "/page",
    "value": {
      "title": "Hello GenUI"
    }
  }
}
```

---

## Layout Components (12)

### `Column`

Vertical layout container (Ant Design `Col` with `flexDirection: column`).

```json
{"id": "col1", "component": "Column", "children": ["child1", "child2"], "span": 8, "offset": 0, "flex": "auto", "style": {}}
```

Properties: `span` (1–24 grid), `offset`, `push`, `pull`, `order`, `flex`, `style`

### `Row`

Horizontal layout container (Ant Design `Row`).

```json
{"id": "row1", "component": "Row", "children": ["child1", "child2"], "justify": "start", "align": "top", "gutter": 16, "wrap": true, "style": {}}
```

Properties: `justify` (`start|end|center|spaceAround|spaceBetween|spaceEvenly`), `align` (`top|middle|bottom|stretch`), `gutter` (number or `[horizontal, vertical]`), `wrap`, `style`

### `List`

List container with header/footer support.

```json
{"id": "list1", "component": "List", "children": ["item1", "item2"], "header": "My List", "footer": "End", "bordered": true, "split": true, "size": "default", "style": {}}
```

Template binding:
```json
{"id": "list1", "component": "List", "children": {"path": "/data/items", "componentId": "item_template"}}
```

Properties: `header`, `footer`, `bordered`, `split`, `size` (`small|default|large`), `style`

### `Card`

Bordered content container (Ant Design `Card`).

```json
{"id": "card1", "component": "Card", "children": ["body1"], "title": "Card Title", "extra": "More", "bordered": true, "hoverable": false, "style": {}}
```

Properties: `title`, `extra`, `bordered`, `hoverable`, `style`

### `Tabs`

Tab navigation (Ant Design `Tabs`).

```json
{"id": "tabs1", "component": "Tabs", "children": ["panel1", "panel2"], "tabTitles": ["Tab A", "Tab B"], "defaultActiveKey": "0", "centered": false, "size": "default", "tabType": "line", "tabPosition": "top", "style": {}}
```

Properties: `tabTitles` (string array, one per child panel), `defaultActiveKey`, `centered`, `size`, `tabType` (`line|card`), `tabPosition` (`top|bottom|left|right`), `style`

### `Modal`

Dialog overlay (Ant Design `Modal`).

```json
{"id": "modal1", "component": "Modal", "children": ["body1"], "title": "Dialog", "open": true, "width": 520, "centered": false, "closable": true, "maskClosable": true, "footer": null, "style": {}}
```

Properties: `title`, `open`, `width`, `centered`, `closable`, `maskClosable`, `footer`, `style`

### `Carousel`

Image/content carousel (Ant Design `Carousel`).

```json
{"id": "car1", "component": "Carousel", "children": ["slide1", "slide2"], "autoplay": true, "autoplaySpeed": 3000, "dots": true, "effect": "scrollx", "style": {}}
```

Properties: `autoplay`, `autoplaySpeed`, `dots`, `effect` (`scrollx|fade`), `style`

### `Collapse`

Collapsible panels (Ant Design `Collapse`).

```json
{"id": "col1", "component": "Collapse", "children": ["panel1", "panel2"], "items": [{"key": "1", "label": "Section A"}, {"key": "2", "label": "Section B"}], "accordion": false, "bordered": true, "ghost": false, "style": {}}
```

Properties: `items` (array of `{key, label}`), `accordion`, `bordered`, `ghost`, `activeKey`, `style`

### `Space`

Uniform spacing between children (Ant Design `Space`).

```json
{"id": "sp1", "component": "Space", "children": ["a", "b"], "direction": "horizontal", "size": "small", "align": "center", "wrap": false, "style": {}}
```

Properties: `direction` (`horizontal|vertical`), `size` (`small|middle|large` or number), `align`, `wrap`, `style`

### `Splitter`

Resizable split panels (Ant Design `Splitter`).

```json
{"id": "sp1", "component": "Splitter", "children": ["left", "right"], "layout": "horizontal", "style": {}}
```

Properties: `layout` (`horizontal|vertical`), `style`

### `Tooltip`

Hover tooltip wrapper (Ant Design `Tooltip`).

```json
{"id": "tip1", "component": "Tooltip", "children": ["target1"], "title": "Tooltip text", "placement": "top", "color": "#1677ff", "trigger": "hover", "style": {}}
```

Properties: `title`, `placement`, `color`, `trigger` (`hover|click|focus`), `style`

### `Popover`

Click/hover popup with rich content (Ant Design `Popover`).

```json
{"id": "pop1", "component": "Popover", "children": ["target1"], "title": "Popover Title", "content": "Popover body text", "placement": "top", "trigger": "click", "style": {}}
```

Properties: `title`, `content`, `placement`, `trigger`, `style`

---

## Basic Components (6)

### `Text`

Plain or heading text (Ant Design `Typography`).

```json
{"id": "t1", "component": "Text", "text": {"path": "/data/title"}, "variant": "h2", "color": "#333", "strong": true, "italic": false, "underline": false, "style": {}}
```

Properties: `text` (string or path binding), `variant` (`h1|h2|h3|h4|h5|body|caption`), `color`, `strong`, `italic`, `underline`, `delete`, `style`

### `Image`

Image display (Ant Design `Image`).

```json
{"id": "img1", "component": "Image", "url": {"path": "/data/imgUrl"}, "description": "Alt text", "fit": "cover", "width": 300, "height": 200, "style": {}}
```

Properties: `url`, `description`, `fit` (`contain|cover|fill|none|scale-down`), `width`, `height`, `style`

### `Icon`

Icon display (Ant Design Icons).

```json
{"id": "icon1", "component": "Icon", "name": "SearchOutlined", "size": 24, "color": "#1677ff", "style": {}}
```

Properties: `name` (Ant Design icon name, e.g. `SearchOutlined`, `UserOutlined`, `SettingOutlined`), `size`, `color`, `style`

### `Button`

Clickable button with action support (Ant Design `Button`).

```json
{"id": "btn1", "component": "Button", "text": "Submit", "variant": "primary", "size": "middle", "danger": false, "disabled": false, "loading": false, "action": {"event": {"name": "submit", "context": {"formId": "form1"}}}, "style": {}}
```

Properties: `text` (label string), `variant` (`primary|default|dashed|link|text`), `size` (`small|middle|large`), `danger`, `disabled`, `loading`, `action`, `style`

### `Divider`

Separator line (Ant Design `Divider`).

```json
{"id": "div1", "component": "Divider", "orientation": "center", "type": "horizontal", "dashed": false, "plain": false, "style": {}}
```

Properties: `orientation` (`left|center|right`), `type` (`horizontal|vertical`), `dashed`, `plain`, `style`

### `Web`

Embedded web view via iframe.

```json
{"id": "web1", "component": "Web", "url": "https://example.com", "width": "100%", "height": 400, "style": {}}
```

Properties: `url`, `width`, `height`, `style`

---

## Input Components (14)

### `TextField`

Text input (Ant Design `Input` / `Input.TextArea`).

```json
{"id": "tf1", "component": "TextField", "value": {"path": "/data/name"}, "placeholder": "Enter name", "disabled": false, "maxLength": 100, "variant": "shortText", "size": "middle", "style": {}}
```

Properties: `value`, `placeholder`, `disabled`, `maxLength`, `variant` (`shortText|longText`), `size`, `style`

### `CheckBox`

Checkbox input (Ant Design `Checkbox`).

```json
{"id": "cb1", "component": "CheckBox", "checked": {"path": "/data/agreed"}, "disabled": false, "indeterminate": false, "style": {}}
```

Properties: `checked`, `disabled`, `indeterminate`, `style`

### `ChoicePicker`

Dropdown / radio / checkbox group (Ant Design `Select`).

```json
{"id": "cp1", "component": "ChoicePicker", "value": {"path": "/data/choice"}, "options": [{"label": "A", "value": "a"}, {"label": "B", "value": "b"}], "placeholder": "Select...", "disabled": false, "mode": "single", "size": "middle", "style": {}}
```

Properties: `value`, `options` (array of `{label, value}`), `placeholder`, `disabled`, `mode` (`single|multiple`), `size`, `style`

### `Slider`

Range slider (Ant Design `Slider`).

```json
{"id": "sl1", "component": "Slider", "value": {"path": "/data/volume"}, "min": 0, "max": 100, "step": 1, "disabled": false, "range": false, "style": {}}
```

Properties: `value`, `min`, `max`, `step`, `disabled`, `range`, `style`

### `DateTimeInput`

Date/time picker (Ant Design `DatePicker`).

```json
{"id": "dt1", "component": "DateTimeInput", "value": {"path": "/data/date"}, "placeholder": "Select date", "disabled": false, "mode": "date", "format": "YYYY-MM-DD", "style": {}}
```

Properties: `value`, `placeholder`, `disabled`, `mode` (`date|time|datetime|month|year`), `format`, `style`

### `Switch`

Toggle switch (Ant Design `Switch`).

```json
{"id": "sw1", "component": "Switch", "checked": {"path": "/data/enabled"}, "disabled": false, "style": {}}
```

Properties: `checked`, `disabled`, `style`

### `Rate`

Star rating (Ant Design `Rate`).

```json
{"id": "rt1", "component": "Rate", "value": {"path": "/data/rating"}, "count": 5, "allowHalf": true, "disabled": false, "style": {}}
```

Properties: `value`, `count`, `allowHalf`, `disabled`, `style`

### `InputNumber`

Numeric input (Ant Design `InputNumber`).

```json
{"id": "in1", "component": "InputNumber", "value": {"path": "/data/quantity"}, "min": 0, "max": 999, "step": 1, "disabled": false, "style": {}}
```

Properties: `value`, `min`, `max`, `step`, `disabled`, `style`

### `AutoComplete`

Autocomplete text input (Ant Design `AutoComplete`).

```json
{"id": "ac1", "component": "AutoComplete", "value": {"path": "/data/search"}, "options": [{"value": "apple"}, {"value": "banana"}], "placeholder": "Search...", "style": {}}
```

Properties: `value`, `options`, `placeholder`, `style`

### `Cascader`

Multi-level dropdown (Ant Design `Cascader`).

```json
{"id": "cas1", "component": "Cascader", "value": {"path": "/data/region"}, "options": [{"value": "zhejiang", "label": "Zhejiang", "children": [{"value": "hangzhou", "label": "Hangzhou"}]}], "placeholder": "Select region", "style": {}}
```

Properties: `value`, `options` (nested `{value, label, children}`), `placeholder`, `style`

### `TreeSelect`

Tree-structured dropdown (Ant Design `TreeSelect`).

```json
{"id": "ts1", "component": "TreeSelect", "value": {"path": "/data/dept"}, "treeData": [{"value": "eng", "title": "Engineering", "children": [{"value": "fe", "title": "Frontend"}]}], "placeholder": "Select department", "multiple": false, "showSearch": true, "style": {}}
```

Properties: `value`, `treeData` (nested `{value, title, children}`), `placeholder`, `multiple`, `showSearch`, `style`

### `Transfer`

Dual-list transfer (Ant Design `Transfer`).

```json
{"id": "tr1", "component": "Transfer", "dataSource": {"path": "/data/items"}, "targetKeys": {"path": "/data/selected"}, "titles": ["Available", "Selected"], "style": {}}
```

Properties: `dataSource`, `targetKeys`, `titles`, `style`

### `Upload`

File upload (Ant Design `Upload`).

```json
{"id": "up1", "component": "Upload", "accept": ".jpg,.png", "maxCount": 3, "multiple": false, "listType": "text", "buttonText": "Upload", "disabled": false, "style": {}}
```

Properties: `accept`, `maxCount`, `multiple`, `listType` (`text|picture|picture-card`), `buttonText`, `disabled`, `style`

### `ColorPicker`

Color picker (Ant Design `ColorPicker`).

```json
{"id": "cp1", "component": "ColorPicker", "value": "#1677ff", "disabled": false, "showText": true, "size": "middle", "allowClear": false, "style": {}}
```

Properties: `value`, `disabled`, `showText`, `size`, `allowClear`, `style`

---

## Data Components (9)

### `Table`

Data table with pagination (Ant Design `Table`).

```json
{"id": "tb1", "component": "Table", "columns": [{"title": "Name", "dataIndex": "name", "key": "name"}], "dataSource": {"path": "/data/rows"}, "bordered": true, "size": "middle", "pagination": true, "style": {}}
```

Properties: `columns` (array of `{title, dataIndex, key, ...}`), `dataSource`, `bordered`, `size` (`small|middle|large`), `pagination`, `style`

### `RichText`

HTML content renderer (via `dangerouslySetInnerHTML`).

```json
{"id": "rt1", "component": "RichText", "text": {"path": "/data/html"}, "style": {}}
```

Properties: `text` (HTML string), `style`

### `Markdown`

Markdown renderer (react-markdown).

```json
{"id": "md1", "component": "Markdown", "text": {"path": "/data/md"}, "style": {}}
```

Properties: `text` (Markdown string), `style`

### `Avatar`

User avatar (Ant Design `Avatar`).

```json
{"id": "av1", "component": "Avatar", "src": {"path": "/data/avatarUrl"}, "alt": "User", "size": "default", "shape": "circle", "icon": "UserOutlined", "style": {}}
```

Properties: `src`, `alt`, `size` (`small|default|large` or number), `shape` (`circle|square`), `icon`, `style`

### `Badge`

Status badge / count indicator (Ant Design `Badge`).

```json
{"id": "bdg1", "component": "Badge", "count": 5, "dot": false, "status": "processing", "color": "#1677ff", "text": "New", "overflow": 99, "style": {}}
```

Properties: `count`, `dot`, `status` (`success|processing|error|default|warning`), `color`, `text`, `overflow`, `style`

### `Statistic`

Key metric display (Ant Design `Statistic`).

```json
{"id": "stat1", "component": "Statistic", "title": "Revenue", "value": {"path": "/data/revenue"}, "prefix": "$", "suffix": "USD", "precision": 2, "style": {}}
```

Properties: `title`, `value`, `prefix`, `suffix`, `precision`, `valueStyle`, `style`

### `Timeline`

Vertical timeline (Ant Design `Timeline`).

```json
{"id": "tl1", "component": "Timeline", "items": [{"children": "Event A", "color": "green"}, {"children": "Event B", "color": "blue"}], "mode": "left", "style": {}}
```

Properties: `items` (array of `{children, color?, dot?}`), `mode` (`left|right|alternate`), `style`

### `Descriptions`

Key-value description list (Ant Design `Descriptions`).

```json
{"id": "desc1", "component": "Descriptions", "title": "Details", "items": [{"key": "name", "label": "Name", "children": "Alice"}], "bordered": false, "column": 2, "size": "default", "style": {}}
```

Properties: `title`, `items` (array of `{key, label, children}`), `bordered`, `column`, `size`, `style`

### `Calendar`

Date calendar (Ant Design `Calendar`).

```json
{"id": "cal1", "component": "Calendar", "value": {"path": "/data/selectedDate"}, "fullscreen": true, "mode": "month", "style": {}}
```

Properties: `value`, `fullscreen`, `mode` (`month|year`), `style`

### `Tree`

Tree view (Ant Design `Tree`).

```json
{"id": "tree1", "component": "Tree", "treeData": [{"key": "1", "title": "Root", "children": [{"key": "2", "title": "Child"}]}, "style": {}}
```

Properties: `treeData` (nested `{key, title, children}`), `style`

---

## Feedback Components (7)

### `Alert`

Status alert banner (Ant Design `Alert`).

```json
{"id": "al1", "component": "Alert", "message": "Success", "description": "Operation completed", "type": "success", "closable": true, "showIcon": true, "banner": false, "style": {}}
```

Properties: `message`, `description`, `type` (`success|info|warning|error`), `closable`, `showIcon`, `banner`, `style`

### `Drawer`

Slide-in panel (Ant Design `Drawer`).

```json
{"id": "dr1", "component": "Drawer", "children": ["body1"], "title": "Details", "open": true, "placement": "right", "width": 400, "closable": true, "maskClosable": true, "style": {}}
```

Properties: `title`, `open`, `placement` (`top|right|bottom|left`), `width`, `closable`, `maskClosable`, `style`

### `Progress`

Progress bar (Ant Design `Progress`).

```json
{"id": "pr1", "component": "Progress", "percent": 75, "type": "line", "status": "active", "strokeColor": "#1677ff", "trailColor": "#f0f0f0", "style": {}}
```

Properties: `percent`, `type` (`line|circle|dashboard`), `status` (`success|exception|normal|active`), `strokeColor`, `trailColor`, `style`

### `Result`

Operation result page (Ant Design `Result`).

```json
{"id": "res1", "component": "Result", "status": "success", "title": "Submitted", "subTitle": "Your request has been processed", "style": {}}
```

Properties: `status` (`success|error|info|warning|404|403|500`), `title`, `subTitle`, `icon`, `style`

### `Skeleton`

Loading placeholder (Ant Design `Skeleton`).

```json
{"id": "sk1", "component": "Skeleton", "active": true, "loading": true, "avatar": false, "paragraph": true, "title": true, "round": false, "style": {}}
```

Properties: `active`, `loading`, `avatar`, `paragraph`, `title`, `round`, `style`

### `Spin`

Spinner overlay (Ant Design `Spin`).

```json
{"id": "sp1", "component": "Spin", "children": ["content1"], "spinning": true, "size": "default", "tip": "Loading...", "delay": 0, "style": {}}
```

Properties: `spinning`, `size` (`small|default|large`), `tip`, `delay`, `style`

### `Tag`

Colored tag / label (Ant Design `Tag`).

```json
{"id": "tag1", "component": "Tag", "text": "Active", "color": "green", "closable": false, "bordered": true, "style": {}}
```

Properties: `text`, `color` (preset name or hex), `closable`, `bordered`, `style`

---

## Navigation Components (6)

### `Breadcrumb`

Navigation breadcrumb (Ant Design `Breadcrumb`).

```json
{"id": "bc1", "component": "Breadcrumb", "items": [{"title": "Home", "href": "/"}, {"title": "Products"}], "separator": "/", "style": {}}
```

Properties: `items` (array of `{title, href?}`), `separator`, `style`

### `Steps`

Step indicator (Ant Design `Steps`).

```json
{"id": "st1", "component": "Steps", "current": 1, "direction": "horizontal", "size": "default", "status": "process", "items": [{"title": "Step 1"}, {"title": "Step 2"}], "style": {}}
```

Properties: `current`, `direction` (`horizontal|vertical`), `size`, `status` (`wait|process|finish|error`), `items` (array of `{title, description?, icon?}`), `style`

### `Pagination`

Page navigation (Ant Design `Pagination`).

```json
{"id": "pg1", "component": "Pagination", "current": 1, "pageSize": 10, "total": 100, "style": {}}
```

Properties: `current`, `pageSize`, `total`, `style`

### `Dropdown`

Dropdown menu trigger (Ant Design `Dropdown`).

```json
{"id": "dd1", "component": "Dropdown", "label": "Actions", "items": [{"key": "1", "label": "Edit"}, {"key": "2", "label": "Delete"}], "trigger": ["click"], "placement": "bottomLeft", "style": {}}
```

Properties: `label`, `items` (array of `{key, label, icon?, disabled?}`), `trigger`, `placement`, `style`

### `Anchor`

Anchor navigation (Ant Design `Anchor`).

```json
{"id": "anc1", "component": "Anchor", "items": [{"key": "1", "href": "#section1", "title": "Section 1"}], "offsetTop": 0, "affix": true, "style": {}}
```

Properties: `items` (array of `{key, href, title, children?}`), `offsetTop`, `affix`, `style`

### `Menu`

Navigation menu (Ant Design `Menu`).

```json
{"id": "menu1", "component": "Menu", "items": [{"key": "1", "label": "Home"}, {"key": "2", "label": "About"}], "mode": "horizontal", "selectedKeys": ["1"], "theme": "light", "style": {}}
```

Properties: `items` (nested `{key, label, icon?, children?}`), `mode` (`horizontal|vertical|inline`), `selectedKeys`, `theme` (`light|dark`), `style`

---

## Media Components (3)

### `Video`

HTML5 video player.

```json
{"id": "v1", "component": "Video", "url": {"path": "/data/videoUrl"}, "width": "100%", "height": 360, "autoplay": false, "controls": true, "loop": false, "muted": false, "style": {}}
```

Properties: `url`, `width`, `height`, `autoplay`, `controls`, `loop`, `muted`, `style`

### `AudioPlayer`

HTML5 audio player.

```json
{"id": "a1", "component": "AudioPlayer", "url": {"path": "/data/audioUrl"}, "autoplay": false, "controls": true, "loop": false, "muted": false, "style": {}}
```

Properties: `url`, `autoplay`, `controls`, `loop`, `muted`, `style`

### `Lottie`

Lottie animation player.

```json
{"id": "l1", "component": "Lottie", "url": {"path": "/data/lottieUrl"}, "loop": true, "autoplay": true, "width": 200, "height": 200, "style": {}}
```

Properties: `url`, `animationData` (inline JSON), `loop`, `autoplay`, `width`, `height`, `style`

---

## Utility Components (3)

### `QRCode`

QR code generator (Ant Design `QRCode`).

```json
{"id": "qr1", "component": "QRCode", "value": "https://example.com", "size": 160, "color": "#000", "bgColor": "#fff", "style": {}}
```

Properties: `value`, `size`, `color`, `bgColor`, `style`

### `Watermark`

Watermark overlay (Ant Design `Watermark`).

```json
{"id": "wm1", "component": "Watermark", "children": ["content1"], "content": "CONFIDENTIAL", "fontColor": "rgba(0,0,0,0.15)", "fontSize": 16, "gap": [100, 100], "rotate": -22, "style": {}}
```

Properties: `content`, `fontColor`, `fontSize`, `gap`, `rotate`, `style`

### `FloatButton`

Floating action button (Ant Design `FloatButton`).

```json
{"id": "fb1", "component": "FloatButton", "icon": "UpOutlined", "type": "default", "tooltip": "Back to top", "shape": "circle", "style": {}}
```

Properties: `icon`, `type` (`default|primary`), `tooltip`, `shape` (`circle|square`), `style`

---

## Chart Component (1)

### `Chart`

Unified chart component powered by ECharts.

```json
{"id": "chart1", "component": "Chart", "chartType": "bar", "data": {"path": "/data/chartData"}, "config": {"xField": "month", "yField": "revenue", "title": "Monthly Revenue"}, "height": 400, "width": "100%", "style": {}}
```

`chartType` enum: `"bar" | "line" | "area" | "pie" | "donut" | "scatter" | "radar" | "heatmap" | "funnel" | "gauge" | "treemap" | "sunburst" | "sankey" | "graph" | "boxplot" | "candlestick" | "effectScatter" | "lines" | "themeRiver" | "bar_grouped"`

`data` structure (common):
```json
[
  {"month": "Jan", "revenue": 8200},
  {"month": "Feb", "revenue": 9100}
]
```

`config` common properties: `xField`, `yField`, `title`, `colorField`, `angleField`, `seriesField`

Properties: `chartType`, `data`, `config`, `height`, `width`, `style`

---

## Style System

GenUI components accept a standard CSS `style` object. Unlike mobile platforms, all standard CSS properties are available:

```json
"style": {
  "width": "100%",
  "maxWidth": 1200,
  "padding": 24,
  "margin": "0 auto",
  "backgroundColor": "#f5f5f5",
  "borderRadius": 8,
  "boxShadow": "0 2px 8px rgba(0, 0, 0, 0.1)",
  "display": "flex",
  "gap": 16,
  "color": "#333"
}
```

CSS properties use camelCase (`backgroundColor` not `background-color`). Values support all standard CSS units (`px`, `%`, `em`, `rem`, `vh`, `vw`, etc.).

## Common Wrong Names

| Wrong name | Correct component |
|---|---|
| "Container" / "Box" / "Wrapper" | `Card` (bordered) or `Column` with padding |
| "Stack" / "VStack" / "HStack" | `Column` (vertical) or `Row` (horizontal) |
| "Spacer" | margin / padding on adjacent components |
| "BarChart" / "LineChart" / "DonutChart" | `Chart` with `chartType` |
| "Accordion" | `Collapse` |
| "Input" | `TextField` |
| "Select" / "Dropdown" | `ChoicePicker` |
| "DatePicker" | `DateTimeInput` |
| "Spinner" | `Spin` |
| "ProgressBar" | `Progress` |
