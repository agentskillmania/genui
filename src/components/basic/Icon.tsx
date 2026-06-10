import React from 'react';
import * as Icons from '@ant-design/icons';
import type { GenUIComponentProps } from '../types';

/**
 * Icon component — dynamically resolves an Ant Design icon by name.
 */
export const Icon: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { name, size, color, style } = properties;
  const iconName = (name as string) || 'QuestionCircleOutlined';

  // Dynamic icon lookup from @ant-design/icons
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ style?: React.CSSProperties }>>)[iconName];

  if (!IconComponent) {
    console.warn(`[GenUI] Unknown icon: ${iconName}`);
    return null;
  }

  const iconStyle: React.CSSProperties = {
    fontSize: size as number | string,
    color: color as string,
    ...style as React.CSSProperties,
  };

  return <IconComponent style={iconStyle} />;
};
