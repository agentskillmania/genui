import React, { useState } from 'react';
import { Slider as AntSlider } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Slider input component — single or range numeric slider.
 */
export const Slider: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const { value, min, max, step, disabled, range, style } = properties ?? {};
  const isRange = !!range;
  const [localValue, setLocalValue] = useState<number | [number, number]>(
    isRange ? (value as [number, number] || [0, 100]) : (value as number || 0)
  );

  const handleChange = (newValue: number | [number, number]) => {
    setLocalValue(newValue);
    onSyncState?.({ value: newValue });
  };

  const sliderProps: Record<string, unknown> = {
    min: min as number ?? 0,
    max: max as number ?? 100,
    step: step as number ?? 1,
    disabled: disabled as boolean,
    range: isRange,
    style: style as React.CSSProperties,
    value: localValue,
    onChange: handleChange,
  };

  return <AntSlider {...sliderProps} />;
};
