import React from 'react';
import { DatePicker, TimePicker, Space } from 'antd';
import type { GenUIComponentProps } from '../types';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);

/**
 * DateTimeInput component — date, time, or datetime picker.
 *
 * Fully controlled: value comes from `properties.value` and every change is
 * reported upstream via `onSyncState({ value })`.
 */
export const DateTimeInput: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const { value, placeholder, disabled, mode, format, style } = properties ?? {};

  const handleChange = (date: Dayjs | null) => {
    onSyncState?.({ value: date?.format((format as string) || 'YYYY-MM-DD') });
  };

  const dateFormat = (format as string) || 'YYYY-MM-DD';
  const dayjsValue = value ? dayjs(value as string) : null;

  if (mode === 'time') {
    return (
      <TimePicker
        value={dayjsValue}
        placeholder={placeholder as string}
        disabled={disabled as boolean}
        format={dateFormat}
        style={style as React.CSSProperties}
        onChange={handleChange}
      />
    );
  }

  if (mode === 'datetime') {
    return (
      <Space>
        <DatePicker
          value={dayjsValue}
          placeholder={placeholder as string}
          disabled={disabled as boolean}
          format={dateFormat}
          style={style as React.CSSProperties}
          onChange={handleChange}
        />
        <TimePicker
          value={dayjsValue}
          disabled={disabled as boolean}
          format="HH:mm:ss"
          style={style as React.CSSProperties}
          onChange={handleChange}
        />
      </Space>
    );
  }

  return (
    <DatePicker
      value={dayjsValue}
      placeholder={placeholder as string}
      disabled={disabled as boolean}
      format={dateFormat}
      style={style as React.CSSProperties}
      onChange={handleChange}
    />
  );
};
