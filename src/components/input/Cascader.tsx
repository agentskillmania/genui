import React from 'react';
import { Cascader as AntCascader } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Cascader input component — hierarchical multi-level selector.
 *
 * Fully controlled: value comes from `properties.value` and every change is
 * reported upstream via `onSyncState({ value })`.
 */
export const Cascader: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const {
    value,
    options,
    placeholder,
    disabled,
    multiple,
    style,
  } = properties ?? {};

  const handleChange = (
    val: (string | number)[] | ((string | number)[])[],
  ) => {
    onSyncState?.({ value: val });
  };

  // antd 6 Cascader 的泛型根据 `multiple` 字面量推断 value 维度（单选一维 /
  // 多选二维），本组件的 multiple 来自运行时数据无法静态推断，故放宽为 any。
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CascaderAny = AntCascader as any;

  return (
    <CascaderAny
      value={value as (string | number)[] | undefined}
      options={(options as React.ComponentProps<typeof AntCascader>['options']) ?? []}
      placeholder={placeholder as string}
      disabled={disabled as boolean}
      multiple={multiple ? true : undefined}
      style={style as React.CSSProperties}
      onChange={handleChange}
    />
  );
};
Cascader.displayName = 'Cascader';
