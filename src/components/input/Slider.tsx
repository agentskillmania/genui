import React from 'react';
import { Slider as AntSlider } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Slider input component — single or range numeric slider.
 *
 * Fully controlled: value comes from `properties.value` and every change is
 * reported upstream via `onSyncState({ value })`.
 */
export const Slider: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const { value, min, max, step, disabled, range, style } = properties ?? {};
  const isRange = !!range;

  const handleChange = (newValue: number | [number, number]) => {
    onSyncState?.({ value: newValue });
  };

  const sliderProps: Record<string, unknown> = {
    min: min as number ?? 0,
    max: max as number ?? 100,
    step: step as number ?? 1,
    disabled: disabled as boolean,
    range: isRange,
    style: style as React.CSSProperties,
    value: isRange ? (value as [number, number] ?? [0, 100]) : (value as number ?? 0),
    onChange: handleChange,
  };

  return <AntSlider {...sliderProps} />;
};
