import React, { useState } from 'react';
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
 */
export const DateTimeInput: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const { value, placeholder, disabled, mode, format, style } = properties ?? {};
  const [localValue, setLocalValue] = useState<Dayjs | null>(
    value ? dayjs(value as string) : null
  );

  const handleChange = (date: Dayjs | null) => {
    setLocalValue(date);
    onSyncState?.({ value: date?.format((format as string) || 'YYYY-MM-DD') });
  };

  const dateFormat = (format as string) || 'YYYY-MM-DD';

  if (mode === 'time') {
    return (
      <TimePicker
        value={localValue}
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
          value={localValue}
          placeholder={placeholder as string}
          disabled={disabled as boolean}
          format={dateFormat}
          style={style as React.CSSProperties}
          onChange={handleChange}
        />
        <TimePicker
          value={localValue}
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
      value={localValue}
      placeholder={placeholder as string}
      disabled={disabled as boolean}
      format={dateFormat}
      style={style as React.CSSProperties}
      onChange={handleChange}
    />
  );
};
