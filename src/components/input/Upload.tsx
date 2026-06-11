import React from 'react';
import { Upload as AntUpload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { GenUIComponentProps } from '../types';

/** Upload component — file upload button or drag zone. */
export const Upload: React.FC<GenUIComponentProps> = ({ properties, onAction }) => {
  const { accept, maxCount, multiple, listType, buttonText, style, disabled } = properties ?? {};

  const handleChange = (info: any) => {
    if (info.file.status === 'done' || info.file.status === 'uploading') {
      onAction?.('upload', { file: info.file.name, status: info.file.status });
    }
  };

  return (
    <AntUpload
      accept={accept as string}
      maxCount={maxCount as number}
      multiple={multiple as boolean}
      listType={(listType as 'text' | 'picture' | 'picture-card') ?? 'text'}
      disabled={disabled as boolean}
      style={style as React.CSSProperties}
      onChange={handleChange}
    >
      <Button icon={<UploadOutlined />}>{(buttonText as string) || 'Upload'}</Button>
    </AntUpload>
  );
};
Upload.displayName = 'Upload';
