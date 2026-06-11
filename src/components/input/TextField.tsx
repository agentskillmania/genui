import React, { useState } from 'react';
import { Input } from 'antd';
import type { GenUIComponentProps } from '../types';

const { TextArea } = Input;

/**
 * TextField input component — single-line or multiline text input.
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

  const [localValue, setLocalValue] = useState(value as string || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onSyncState?.({ value: newValue });
  };

  const commonProps = {
    placeholder: placeholder as string,
    disabled: disabled as boolean,
    maxLength: maxLength as number,
    size: size as 'small' | 'middle' | 'large',
    style: style as React.CSSProperties,
  };

  if (variant === 'multiline') {
    return (
      <TextArea
        {...commonProps}
        value={localValue}
        onChange={handleChange}
        autoSize={{ minRows: 3, maxRows: 6 }}
      />
    );
  }

  return (
    <Input
      {...commonProps}
      value={localValue}
      onChange={handleChange}
    />
  );
};
