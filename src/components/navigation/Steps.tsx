import React, { useState, useEffect } from 'react';
import { Steps as AntSteps } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Steps component — step-by-step progress indicator with change callback.
 * Syncs the current step index back to the host via onSyncState.
 */
export const Steps: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const { current, direction, size, status, items, style } = properties ?? {};
  const [localCurrent, setLocalCurrent] = useState((current as number) ?? 0);

  useEffect(() => {
    setLocalCurrent((current as number) ?? 0);
  }, [current]);

  const handleChange = (val: number) => {
    setLocalCurrent(val);
    onSyncState?.({ current: val });
  };

  return (
    <AntSteps
      current={localCurrent}
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
