import React from 'react';
import { Switch as AntSwitch } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Switch input component — boolean toggle.
 *
 * Fully controlled: checked state comes from `properties.checked` and every
 * toggle is reported upstream via `onSyncState({ checked })`.
 */
export const Switch: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const {
    checked,
    disabled,
    loading,
    size,
    checkedChildren,
    unCheckedChildren,
    style,
  } = properties ?? {};

  const handleChange = (val: boolean) => {
    onSyncState?.({ checked: val });
  };

  return (
    <AntSwitch
      checked={!!checked}
      disabled={disabled as boolean}
      loading={loading as boolean}
      size={size as 'small' | 'default'}
      checkedChildren={checkedChildren as React.ReactNode}
      unCheckedChildren={unCheckedChildren as React.ReactNode}
      style={style as React.CSSProperties}
      onChange={handleChange}
    />
  );
};
Switch.displayName = 'Switch';
