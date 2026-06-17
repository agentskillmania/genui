import React from 'react';
import { Checkbox } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * CheckBox input component — boolean or indeterminate toggle.
 *
 * Fully controlled: checked state comes from `properties.checked` and every
 * toggle is reported upstream via `onSyncState({ checked })`.
 */
export const CheckBox: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const { checked, disabled, indeterminate, style } = properties ?? {};

  const handleChange = (e: { target: { checked: boolean } }) => {
    onSyncState?.({ checked: e.target.checked });
  };

  return (
    <Checkbox
      checked={!!checked}
      disabled={disabled as boolean}
      indeterminate={indeterminate as boolean}
      style={style as React.CSSProperties}
      onChange={handleChange}
    />
  );
};
