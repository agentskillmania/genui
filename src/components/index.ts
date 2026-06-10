/**
 * Component registration entry point.
 * Imports and registers all GenUI component type → renderer mappings.
 * This module has side effects (auto-registration) and should not be tree-shaken.
 */

import { registerComponent } from './registry';

// ===== Layout components =====
import { Row } from './layout/Row';
import { Column } from './layout/Column';
import { List } from './layout/List';
import { Card } from './layout/Card';
import { Tabs } from './layout/Tabs';
import { Modal } from './layout/Modal';
import { Carousel } from './layout/Carousel';

// ===== Basic components =====
import { Text } from './basic/Text';
import { Image } from './basic/Image';
import { Icon } from './basic/Icon';
import { Button } from './basic/Button';
import { Divider } from './basic/Divider';
import { Web } from './basic/Web';

// ===== Input components =====
import { TextField } from './input/TextField';
import { CheckBox } from './input/CheckBox';
import { ChoicePicker } from './input/ChoicePicker';
import { Slider } from './input/Slider';
import { DateTimeInput } from './input/DateTimeInput';

// ===== Media components =====
import { Video } from './media/Video';
import { AudioPlayer } from './media/AudioPlayer';
import { Lottie } from './media/Lottie';

// ===== Data components =====
import { Table } from './data/Table';
import { RichText } from './data/RichText';
import { Markdown } from './data/Markdown';

// ===== Chart component =====
import { Chart } from './chart/Chart';

// ===== Register all components (side-effect on module load) =====
// Layout
registerComponent('Row', Row);
registerComponent('Column', Column);
registerComponent('List', List);
registerComponent('Card', Card);
registerComponent('Tabs', Tabs);
registerComponent('Modal', Modal);
registerComponent('Carousel', Carousel);

// Basic
registerComponent('Text', Text);
registerComponent('Image', Image);
registerComponent('Icon', Icon);
registerComponent('Button', Button);
registerComponent('Divider', Divider);
registerComponent('Web', Web);

// Input
registerComponent('TextField', TextField);
registerComponent('CheckBox', CheckBox);
registerComponent('ChoicePicker', ChoicePicker);
registerComponent('Slider', Slider);
registerComponent('DateTimeInput', DateTimeInput);

// Media
registerComponent('Video', Video);
registerComponent('AudioPlayer', AudioPlayer);
registerComponent('Lottie', Lottie);

// Data
registerComponent('Table', Table);
registerComponent('RichText', RichText);
registerComponent('Markdown', Markdown);

// Chart
registerComponent('Chart', Chart);

// Side-effect marker to prevent tree-shaking
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__GENUI_COMPONENTS_REGISTERED__ = true;
}

// Re-exports
export { registerComponent, getComponentRenderer, hasComponent, getRegisteredTypes } from './registry';
export type { GenUIComponentProps, AGenUIComponentProps, ComponentRenderer } from './types';
