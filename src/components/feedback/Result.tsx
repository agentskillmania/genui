import React from 'react';
import { Result as AntResult } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Result component — displays a success/error/info/warning result page.
 */
export const Result: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { status, title, subTitle, icon, style } = properties ?? {};

  return (
    <AntResult
      status={status as 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500'}
      title={title as React.ReactNode}
      subTitle={subTitle as React.ReactNode}
      icon={icon as React.ReactNode}
      style={style as React.CSSProperties}
    />
  );
};
Result.displayName = 'Result';
