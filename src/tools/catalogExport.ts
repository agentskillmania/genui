/**
 * Catalog export utility.
 * Exports the registered component set as an A2UI v0.9 compliant JSON Schema catalog,
 * which can be used with the A2UI Agent SDK for prompt generation.
 *
 * @see https://a2ui.org/specification/v0.9-a2ui/ — A2UI v0.9 specification
 */

import { getRegisteredTypes } from '../components/registry';

/** A2UI v0.9 JSON Schema catalog structure */
export interface A2UICatalog {
  /** JSON Schema draft identifier */
  $schema: string;
  /** Unique identifier for this catalog document */
  $id: string;
  /** Human-readable catalog title */
  title: string;
  /** Human-readable catalog description */
  description: string;
  /** Canonical catalog URI derived from name and version */
  catalogId: string;
  /** JSON Schema definitions for each component, keyed by component name */
  components: Record<string, unknown>;
  /** JSON Schema definitions for each function, keyed by function name */
  functions: Record<string, unknown>;
  /** Theme schema definition */
  theme: Record<string, unknown>;
  /** Shared type definitions */
  $defs: {
    anyComponent: Record<string, unknown>;
    anyFunction: Record<string, unknown>;
  };
}

/** Descriptions for built-in GenUI components */
const BUILTIN_DESCRIPTIONS: Record<string, { description: string; properties?: Record<string, string> }> = {
  // Layout
  Row: { description: 'Horizontal flexbox layout container', properties: { gap: 'Spacing between children', alignItems: 'Vertical alignment', justifyContent: 'Horizontal alignment' } },
  Column: { description: 'Vertical flexbox layout container', properties: { gap: 'Spacing between children', alignItems: 'Horizontal alignment', justifyContent: 'Vertical alignment' } },
  List: { description: 'Vertical list of items', properties: { items: 'Array of {key, children} objects', header: 'List header content', footer: 'List footer content' } },
  Card: { description: 'Container card with title and content area', properties: { title: 'Card title', extra: 'Extra content in header' } },
  Tabs: { description: 'Tabbed interface with multiple panels', properties: { items: 'Array of {key, label, children} objects' } },
  Modal: { description: 'Modal dialog overlay', properties: { title: 'Modal title', open: 'Whether modal is visible' } },
  Carousel: { description: 'Horizontal scrolling carousel of content cards', properties: { autoplay: 'Auto-scroll enabled', autoplaySpeed: 'Interval in ms' } },
  Collapse: { description: 'Accordion with collapsible panels', properties: { items: 'Array of {key, label, children}', activeKey: 'Active panel keys', accordion: 'Only one panel open at a time' } },
  Space: { description: 'Uniform spacing between children', properties: { direction: 'horizontal or vertical', size: 'Spacing size', wrap: 'Allow wrapping' } },
  Splitter: { description: 'Resizable split panel layout', properties: { layout: 'horizontal or vertical' } },
  Tooltip: { description: 'Hover tooltip wrapper', properties: { title: 'Tooltip text', placement: 'Position (top, bottom, left, right)' } },
  Popover: { description: 'Click/hover popup content wrapper', properties: { title: 'Popover title', content: 'Popover body content', trigger: 'hover or click' } },

  // Basic
  Text: { description: 'Typography text with variant support (h1-h5, caption)', properties: { text: 'Text content', variant: 'Text variant (h1, h2, h3, h4, h5, caption)' } },
  Image: { description: 'Image display', properties: { src: 'Image URL', alt: 'Alt text' } },
  Icon: { description: 'Ant Design icon', properties: { name: 'Icon name' } },
  Button: { description: 'Clickable button', properties: { text: 'Button text', variant: 'primary, default, dashed, text, link', danger: 'Danger style', disabled: 'Disabled state' } },
  Divider: { description: 'Visual divider line' },
  Web: { description: 'Embedded web content via iframe', properties: { url: 'URL to embed' } },

  // Input
  TextField: { description: 'Text input field (single or multiline)', properties: { label: 'Field label', placeholder: 'Placeholder text', multiline: 'Enable multiline input' } },
  CheckBox: { description: 'Checkbox input', properties: { label: 'Checkbox label', checked: 'Checked state' } },
  ChoicePicker: { description: 'Single or multiple choice selector', properties: { options: 'Array of option objects', multiple: 'Allow multiple selection' } },
  Slider: { description: 'Range slider input', properties: { min: 'Minimum value', max: 'Maximum value', value: 'Current value' } },
  DateTimeInput: { description: 'Date and time picker', properties: { label: 'Field label', mode: 'date, time, or datetime' } },
  Switch: { description: 'Boolean toggle switch', properties: { checked: 'Checked state', disabled: 'Disabled state', loading: 'Show loading spinner' } },
  Rate: { description: 'Star rating input', properties: { value: 'Current rating', count: 'Number of stars', allowHalf: 'Allow half-star selection' } },
  InputNumber: { description: 'Numeric input with step controls', properties: { value: 'Current value', min: 'Minimum', max: 'Maximum', step: 'Step size' } },
  AutoComplete: { description: 'Text input with autocomplete suggestions', properties: { value: 'Current value', options: 'Array of {value, label} suggestions' } },
  Cascader: { description: 'Multi-level cascading selector', properties: { value: 'Selected value path', options: 'Tree of {value, label, children}' } },
  TreeSelect: { description: 'Tree-structured dropdown selector', properties: { value: 'Selected value', treeData: 'Tree of {value, title, children}', multiple: 'Allow multiple selection' } },
  Transfer: { description: 'Dual-list transfer box', properties: { dataSource: 'Array of {key, title}', targetKeys: 'Keys in target list', showSearch: 'Enable search' } },
  Upload: { description: 'File upload dropzone', properties: { accept: 'Accepted file types', maxCount: 'Max files', multiple: 'Allow multiple files' } },
  ColorPicker: { description: 'Color picker input', properties: { value: 'Current color hex', showText: 'Show color value text' } },

  // Data
  Table: { description: 'Data table with columns', properties: { columns: 'Column definitions', dataSource: 'Row data array' } },
  RichText: { description: 'Rich text content display', properties: { content: 'Rich text content' } },
  Markdown: { description: 'Markdown content renderer', properties: { content: 'Markdown text content' } },
  Avatar: { description: 'User avatar image or icon', properties: { src: 'Image URL', size: 'Size in pixels', shape: 'circle or square' } },
  Badge: { description: 'Status badge or dot indicator', properties: { count: 'Badge count number', dot: 'Show as dot', status: 'success, error, warning, processing, default' } },
  Statistic: { description: 'Statistic number display', properties: { title: 'Label', value: 'Numeric value', prefix: 'Prefix text', suffix: 'Suffix text', precision: 'Decimal places' } },
  Timeline: { description: 'Vertical timeline of events', properties: { items: 'Array of {color, children, label}', mode: 'left, right, alternate' } },
  Descriptions: { description: 'Key-value description list', properties: { title: 'Section title', items: 'Array of {label, children}', bordered: 'Show borders', column: 'Columns per row' } },
  Calendar: { description: 'Monthly calendar view', properties: { value: 'Selected date (ISO string)', fullscreen: 'Full-screen mode' } },
  Tree: { description: 'Hierarchical tree view', properties: { treeData: 'Tree of {key, title, children}', checkable: 'Show checkboxes', selectable: 'Allow selection' } },

  // Feedback
  Alert: { description: 'Alert banner with type and optional close', properties: { message: 'Alert message', type: 'success, info, warning, error', closable: 'Show close button', showIcon: 'Show type icon' } },
  Drawer: { description: 'Slide-in panel overlay', properties: { title: 'Drawer title', open: 'Visibility', placement: 'right, left, top, bottom', width: 'Panel width' } },
  Progress: { description: 'Progress bar or circle', properties: { percent: 'Progress percentage', type: 'line, circle, dashboard', status: 'success, exception, active' } },
  Result: { description: 'Status result page', properties: { status: 'success, error, info, warning, 404, 403, 500', title: 'Result title', subTitle: 'Result subtitle' } },
  Skeleton: { description: 'Loading placeholder', properties: { active: 'Animate skeleton', loading: 'Show skeleton', avatar: 'Show avatar placeholder' } },
  Spin: { description: 'Loading spinner', properties: { spinning: 'Show spinner', size: 'small, default, large', tip: 'Loading text' } },
  Tag: { description: 'Colored tag label', properties: { text: 'Tag content', color: 'Tag color', closable: 'Show close button' } },

  // Navigation
  Breadcrumb: { description: 'Breadcrumb navigation trail', properties: { items: 'Array of {title, href}', separator: 'Separator character' } },
  Steps: { description: 'Step-by-step progress indicator', properties: { current: 'Current step index', items: 'Array of {title, description}', direction: 'horizontal or vertical' } },
  Pagination: { description: 'Page navigation control', properties: { current: 'Current page', total: 'Total items', pageSize: 'Items per page' } },
  Dropdown: { description: 'Dropdown menu triggered by button', properties: { label: 'Button text', items: 'Array of {key, label}', trigger: 'click or hover' } },
  Anchor: { description: 'In-page anchor navigation', properties: { items: 'Array of {key, href, title}', offsetTop: 'Scroll offset' } },
  Menu: { description: 'Navigation menu', properties: { items: 'Array of {key, label, children}', mode: 'horizontal or vertical', selectedKeys: 'Active item keys' } },

  // Utility
  QRCode: { description: 'QR code generator', properties: { value: 'QR code content string', size: 'Image size', color: 'Foreground color' } },
  Watermark: { description: 'Watermark overlay', properties: { content: 'Watermark text', fontColor: 'Text color', gap: 'Spacing between watermarks' } },
  FloatButton: { description: 'Floating action button', properties: { icon: 'Button icon', tooltip: 'Tooltip text', type: 'default or primary' } },

  // Chart
  Chart: { description: 'Interactive chart (bar, line, area, column, scatter, pie, donut, radar, gauge, rose, funnel, heatmap, treemap, sankey, boxplot, candlestick, sunburst, themeRiver, graph, parallel, pictorialBar, effectScatter)', properties: { chartType: 'Chart type string', data: 'Chart data array', config: 'Chart config: field mappings (xField, yField, angleField, colorField) + display overrides. Display: colors (palette string[]), grid ({left,right,top,bottom}), legendPosition (top|bottom|{top,left}), tooltip ({trigger:axis|item, template, formatter}), axisLabel ({rotate, unit}), visualMap ({min,max,colors} for heatmap), indicatorMax (number[] for radar). combo adds: series (ComboSeriesSpec[]), yAxes (ComboYAxisSpec[]). tooltip.formatter references a name registered via registerFormatter (built-in: percent, thousands; business presets like "万元" registered by host).' } },

  // Media
  Video: { description: 'Video player', properties: { url: 'Video URL', controls: 'Show controls' } },
  AudioPlayer: { description: 'Audio player', properties: { url: 'Audio URL', controls: 'Show controls' } },
  Lottie: { description: 'Lottie animation player', properties: { url: 'Animation JSON URL', loop: 'Loop animation', autoplay: 'Auto-play' } },
};

/**
 * Build a JSON Schema object for a single component from its description entry.
 *
 * @param name - Component type identifier
 * @param entry - Description and optional property map
 * @returns A JSON Schema definition for the component
 */
function buildComponentSchema(name: string, entry: { description: string; properties?: Record<string, string> }): Record<string, unknown> {
  const properties: Record<string, unknown> = {
    component: { const: name },
  };

  if (entry.properties) {
    for (const [key, desc] of Object.entries(entry.properties)) {
      properties[key] = { type: 'string', description: desc };
    }
  }

  const required = ['component'];

  return {
    type: 'object',
    description: entry.description,
    properties,
    required,
  };
}

/**
 * Build the `functions` section of the catalog with standard A2UI function schemas.
 *
 * @returns Function schema map keyed by function name
 */
function buildFunctions(): Record<string, unknown> {
  return {
    required: {
      type: 'object',
      description: 'Marks a field as required',
      properties: {
        field: { type: 'string', description: 'Field name to require' },
      },
      required: ['field'],
    },
    email: {
      type: 'object',
      description: 'Validates that a field contains an email address',
      properties: {
        field: { type: 'string', description: 'Field name to validate' },
      },
      required: ['field'],
    },
    formatString: {
      type: 'object',
      description: 'Formats a string value using a template',
      properties: {
        template: { type: 'string', description: 'Format template string' },
        value: { type: 'string', description: 'Value to format' },
      },
      required: ['template', 'value'],
    },
    openUrl: {
      type: 'object',
      description: 'Opens a URL in the browser',
      properties: {
        url: { type: 'string', description: 'URL to open', format: 'uri' },
      },
      required: ['url'],
    },
  };
}

/**
 * Build the `theme` section of the catalog with standard A2UI theme schemas.
 *
 * @returns Theme schema definition
 */
function buildTheme(): Record<string, unknown> {
  return {
    type: 'object',
    description: 'Theme configuration for the catalog',
    properties: {
      primaryColor: {
        type: 'string',
        description: 'Primary brand color as hex code',
        pattern: '^#[0-9a-fA-F]{6}$',
      },
    },
  };
}

/**
 * Export the currently registered components as an A2UI v0.9 compliant JSON Schema catalog.
 *
 * The output follows the A2UI v0.9 specification format with `$schema`, `catalogId`,
 * `components`, `functions`, `theme`, and `$defs` sections.
 *
 * @param name - Catalog name, used in title and catalogId (default: 'genui-antd')
 * @param version - Catalog version, used in catalogId (default: '0.1.0')
 * @returns A fully compliant A2UI v0.9 catalog object
 */
export function exportCatalog(name = 'genui-antd', version = '0.1.0'): A2UICatalog {
  const types = getRegisteredTypes();
  const catalogId = `https://genui.dev/catalogs/${name}/${version}`;

  // Build component schemas keyed by component name
  const components: Record<string, unknown> = {};
  for (const type of types) {
    const builtin = BUILTIN_DESCRIPTIONS[type];
    const description = builtin?.description ?? `Custom component: ${type}`;
    const properties = builtin?.properties;
    components[type] = buildComponentSchema(type, { description, properties });
  }

  // BUG3 fix: $ref must point to where component schemas actually live.
  // Components are under `#/components/${type}` (the root-level `components`
  // key built above), NOT `#/$defs/componentSchemas/${type}` which never
  // existed — all refs were dangling, making the entire schema invalid.
  const anyComponentRefs = types.map((type) => ({ $ref: `#/components/${type}` }));

  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: catalogId,
    title: name,
    description: `A2UI v0.9 component catalog: ${name} v${version}`,
    catalogId,
    components,
    functions: buildFunctions(),
    theme: buildTheme(),
    $defs: {
      anyComponent: {
        oneOf: anyComponentRefs,
        discriminator: { propertyName: 'component' },
      },
      anyFunction: {
        oneOf: [
          { $ref: '#/functions/required' },
          { $ref: '#/functions/email' },
          { $ref: '#/functions/formatString' },
          { $ref: '#/functions/openUrl' },
        ],
      },
    },
  };
}
