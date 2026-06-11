import React, { useState, useEffect } from 'react';
import { Switch as AntSwitch } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Switch input component — boolean toggle.
 * Wraps Ant Design Switch with local state synchronization.
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
  const [localChecked, setLocalChecked] = useState(!!checked);

  useEffect(() => {
    setLocalChecked(!!checked);
  }, [checked]);

  const handleChange = (val: boolean) => {
    setLocalChecked(val);
    onSyncState?.({ checked: val });
  };

  return (
    <AntSwitch
      checked={localChecked}
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
