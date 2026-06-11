import React, { useState, useEffect } from 'react';
import { Calendar as AntCalendar } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { GenUIComponentProps } from '../types';

/** Calendar component — monthly calendar view with date selection. */
export const Calendar: React.FC<GenUIComponentProps> = ({ properties, onSyncState }) => {
  const { value, fullscreen, mode, style } = properties ?? {};
  const [localValue, setLocalValue] = useState<Dayjs>(
    value ? dayjs(value as string) : dayjs(),
  );

  useEffect(() => {
    if (value) setLocalValue(dayjs(value as string));
  }, [value]);

  const handleChange = (date: Dayjs) => {
    setLocalValue(date);
    onSyncState?.({ date: date.format('YYYY-MM-DD') });
  };

  const handlePanelChange = (date: Dayjs, info: { mode: string }) => {
    setLocalValue(date);
  };

  return (
    <AntCalendar
      value={localValue}
      fullscreen={fullscreen !== false}
      mode={mode as 'month' | 'year'}
      style={style as React.CSSProperties}
      onChange={handleChange}
      onPanelChange={handlePanelChange}
    />
  );
};
Calendar.displayName = 'Calendar';
