/**
 * Catalog export utility.
 * Exports the registered component set as an A2UI catalog JSON,
 * which can be used with the A2UI Agent SDK for prompt generation.
 */

import { getRegisteredTypes } from '../components/registry';

/** A2UI catalog entry describing a single component */
export interface CatalogEntry {
  /** Component type identifier (e.g. "Text", "Chart", "Row") */
  type: string;
  /** Human-readable description for the LLM */
  description: string;
  /** JSON schema of the component's properties (simplified) */
  properties?: Record<string, string>;
}

/** A2UI catalog JSON structure */
export interface A2UICatalog {
  /** Catalog name */
  name: string;
  /** Catalog version */
  version: string;
  /** List of available components */
  components: CatalogEntry[];
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
  Carousel: { description: 'Horizontal scrolling carousel of content cards', properties: { items: 'Array of content objects' } },
  // Basic
  Text: { description: 'Typography text with variant support (h1-h5, caption)', properties: { text: 'Text content', variant: 'Text variant (h1, h2, h3, h4, h5, caption)' } },
  Image: { description: 'Image display', properties: { src: 'Image URL', alt: 'Alt text' } },
  Icon: { description: 'Ant Design icon', properties: { name: 'Icon name' } },
  Button: { description: 'Clickable button', properties: { label: 'Button text', variant: 'primary, default, dashed, text, link' } },
  Divider: { description: 'Visual divider line' },
  Web: { description: 'Embedded web content via iframe', properties: { url: 'URL to embed' } },
  // Input
  TextField: { description: 'Text input field (single or multiline)', properties: { label: 'Field label', placeholder: 'Placeholder text', multiline: 'Enable multiline input' } },
  CheckBox: { description: 'Checkbox input', properties: { label: 'Checkbox label', checked: 'Checked state' } },
  ChoicePicker: { description: 'Single or multiple choice selector', properties: { options: 'Array of option objects', multiple: 'Allow multiple selection' } },
  Slider: { description: 'Range slider input', properties: { min: 'Minimum value', max: 'Maximum value', value: 'Current value' } },
  DateTimeInput: { description: 'Date and time picker', properties: { label: 'Field label', mode: 'date, time, or datetime' } },
  // Data
  Table: { description: 'Data table with columns', properties: { columns: 'Column definitions', dataSource: 'Row data array' } },
  RichText: { description: 'Rich text content display', properties: { content: 'Rich text content' } },
  Markdown: { description: 'Markdown content renderer', properties: { content: 'Markdown text content' } },
  // Chart
  Chart: { description: 'Interactive chart (bar, line, area, pie, radar, etc.)', properties: { chartType: 'Chart type (bar, line, area, column, scatter, pie, donut, radar, gauge, rose, funnel, heatmap, treemap)', data: 'Chart data array', config: 'Chart configuration (xField, yField, angleField, colorField)' } },
  // Media
  Video: { description: 'Video player', properties: { src: 'Video URL' } },
  AudioPlayer: { description: 'Audio player', properties: { src: 'Audio URL' } },
  Lottie: { description: 'Lottie animation player', properties: { animationData: 'Animation JSON data', path: 'Animation URL' } },
};

/**
 * Export the currently registered components as an A2UI catalog JSON.
 * This can be used with the A2UI Agent SDK to generate appropriate prompts.
 */
export function exportCatalog(name = 'genui-antd', version = '0.1.0'): A2UICatalog {
  const types = getRegisteredTypes();

  const components: CatalogEntry[] = types.map((type) => {
    const builtin = BUILTIN_DESCRIPTIONS[type];
    return {
      type,
      description: builtin?.description ?? `Custom component: ${type}`,
      properties: builtin?.properties,
    };
  });

  return { name, version, components };
}
