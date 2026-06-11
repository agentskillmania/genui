import React from 'react';
import { QRCode as AntQRCode } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * QRCode component — renders a QR code image from a string value.
 */
export const QRCode: React.FC<GenUIComponentProps> = ({ properties }) => {
  const { value, size, color, bgColor, style } = properties ?? {};

  return (
    <AntQRCode
      value={value as string}
      size={size as number}
      color={color as string}
      bgColor={bgColor as string}
      style={style as React.CSSProperties}
    />
  );
};
QRCode.displayName = 'QRCode';
