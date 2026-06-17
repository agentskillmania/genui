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
import { Collapse } from './layout/Collapse';
import { Space } from './layout/Space';
import { Splitter } from './layout/Splitter';
import { Tooltip } from './layout/Tooltip';
import { Popover } from './layout/Popover';

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
import { Switch } from './input/Switch';
import { Rate } from './input/Rate';
import { InputNumber } from './input/InputNumber';
import { AutoComplete } from './input/AutoComplete';
import { Cascader } from './input/Cascader';
import { TreeSelect } from './input/TreeSelect';
import { Transfer } from './input/Transfer';
import { Upload } from './input/Upload';
import { ColorPicker } from './input/ColorPicker';

// ===== Media components =====
import { Video } from './media/Video';
import { AudioPlayer } from './media/AudioPlayer';
import { Lottie } from './media/Lottie';

// ===== Data components =====
import { Table } from './data/Table';
import { RichText } from './data/RichText';
import { Markdown } from './data/Markdown';
import { Avatar } from './data/Avatar';
import { Badge } from './data/Badge';
import { Statistic } from './data/Statistic';
import { Timeline } from './data/Timeline';
import { Descriptions } from './data/Descriptions';
import { Calendar } from './data/Calendar';
import { Tree } from './data/Tree';

// ===== Feedback components =====
import { Alert } from './feedback/Alert';
import { Drawer } from './feedback/Drawer';
import { Progress } from './feedback/Progress';
import { Result } from './feedback/Result';
import { Skeleton } from './feedback/Skeleton';
import { Spin } from './feedback/Spin';
import { Tag } from './feedback/Tag';

// ===== Navigation components =====
import { Breadcrumb } from './navigation/Breadcrumb';
import { Steps } from './navigation/Steps';
import { Pagination } from './navigation/Pagination';
import { Dropdown } from './navigation/Dropdown';
import { Anchor } from './navigation/Anchor';
import { Menu } from './navigation/Menu';

// ===== Utility components =====
import { QRCode } from './utility/QRCode';
import { Watermark } from './utility/Watermark';
import { FloatButton } from './utility/FloatButton';

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
registerComponent('Collapse', Collapse);
registerComponent('Space', Space);
registerComponent('Splitter', Splitter);
registerComponent('Tooltip', Tooltip);
registerComponent('Popover', Popover);

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
registerComponent('Switch', Switch);
registerComponent('Rate', Rate);
registerComponent('InputNumber', InputNumber);
registerComponent('AutoComplete', AutoComplete);
registerComponent('Cascader', Cascader);
registerComponent('TreeSelect', TreeSelect);
registerComponent('Transfer', Transfer);
registerComponent('Upload', Upload);
registerComponent('ColorPicker', ColorPicker);

// Media
registerComponent('Video', Video);
registerComponent('AudioPlayer', AudioPlayer);
registerComponent('Lottie', Lottie);

// Data
registerComponent('Table', Table);
registerComponent('RichText', RichText);
registerComponent('Markdown', Markdown);
registerComponent('Avatar', Avatar);
registerComponent('Badge', Badge);
registerComponent('Statistic', Statistic);
registerComponent('Timeline', Timeline);
registerComponent('Descriptions', Descriptions);
registerComponent('Calendar', Calendar);
registerComponent('Tree', Tree);

// Feedback
registerComponent('Alert', Alert);
registerComponent('Drawer', Drawer);
registerComponent('Progress', Progress);
registerComponent('Result', Result);
registerComponent('Skeleton', Skeleton);
registerComponent('Spin', Spin);
registerComponent('Tag', Tag);

// Navigation
registerComponent('Breadcrumb', Breadcrumb);
registerComponent('Steps', Steps);
registerComponent('Pagination', Pagination);
registerComponent('Dropdown', Dropdown);
registerComponent('Anchor', Anchor);
registerComponent('Menu', Menu);

// Utility
registerComponent('QRCode', QRCode);
registerComponent('Watermark', Watermark);
registerComponent('FloatButton', FloatButton);

// Chart
registerComponent('Chart', Chart);

// Side-effect marker to prevent tree-shaking
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__GENUI_COMPONENTS_REGISTERED__ = true;
}

// Re-exports
export { registerComponent, getComponentRenderer, hasComponent, getRegisteredTypes } from './registry';
export type { GenUIComponentProps, ComponentRenderer } from './types';
