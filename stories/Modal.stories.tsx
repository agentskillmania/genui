/**
 * Modal component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Modal } from '../src/components/layout/Modal';
import { Text } from '../src/components/basic/Text';

const meta: Meta<typeof Modal> = {
  title: 'Layout/Modal',
  component: Modal,
};
export default meta;

type ModalStory = StoryObj<typeof Modal>;

export const OpenModal: ModalStory = {
  name: 'Open Modal',
  render: () => (
    <Modal
      id="modal-1"
      type="Modal"
      properties={{
        title: 'Confirm Action',
        open: true,
        width: 520,
        centered: true,
      }}
    >
      <Text
        id="modal-body"
        type="Text"
        properties={{ text: 'Are you sure you want to proceed with this action?' }}
      />
    </Modal>
  ),
};
