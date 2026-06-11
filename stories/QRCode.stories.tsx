import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { QRCode } from '../src/components/utility/QRCode';

const meta: Meta<typeof QRCode> = {
  title: 'Utility/QRCode',
  component: QRCode,
};
export default meta;
type Story = StoryObj<typeof QRCode>;

export const BasicQRCode: Story = {
  name: 'Basic QR Code',
  args: {
    id: 'qr-1',
    component: 'QRCode',
    properties: { value: 'https://example.com', size: 160, color: '#000000' },
  },
};
