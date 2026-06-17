import React from 'react';
import { Steps as AntSteps } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Steps component — step-by-step progress indicator with change callback.
 *
 * Fully controlled: current step comes from `properties.current` and every
 * change is reported upstream via `onSyncState({ current })`.
 */
export const Steps: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const { current, direction, size, status, items, style } = properties ?? {};

  const handleChange = (val: number) => {
    onSyncState?.({ current: val });
  };

  return (
    <AntSteps
      current={(current as number) ?? 0}
      direction={direction as 'horizontal' | 'vertical'}
      size={size as 'default' | 'small'}
      status={status as 'wait' | 'process' | 'finish' | 'error'}
      items={
        (items as Array<{ title: string; description?: string; icon?: string }>) ?? []
      }
      style={style as React.CSSProperties}
      onChange={handleChange}
    />
  );
};
Steps.displayName = 'Steps';
