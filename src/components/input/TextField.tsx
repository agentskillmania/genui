import React from 'react';
import { Input } from 'antd';
import type { GenUIComponentProps } from '../types';

const { TextArea } = Input;

/**
 * TextField input component — single-line or multiline text input.
 *
 * Fully controlled: the value comes from `properties.value` and every edit is
 * reported upstream via `onSyncState({ value })`. The host (data model) owns
 * the state, so external updates to `value` are reflected immediately.
 */
export const TextField: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const {
    value,
    placeholder,
    disabled,
    maxLength,
    variant,
    size,
    style,
  } = properties ?? {};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onSyncState?.({ value: e.target.value });
  };

  const commonProps = {
    value: (value as string) ?? '',
    placeholder: placeholder as string,
    disabled: disabled as boolean,
    maxLength: maxLength as number,
    size: size as 'small' | 'middle' | 'large',
    style: style as React.CSSProperties,
    onChange: handleChange,
  };

  if (variant === 'multiline') {
    return (
      <TextArea
        {...commonProps}
        autoSize={{ minRows: 3, maxRows: 6 }}
      />
    );
  }

  return <Input {...commonProps} />;
};
