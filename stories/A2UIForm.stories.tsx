/**
 * Story 2: A2UI Form — building a complex form step-by-step via protocol.
 *
 * Demonstrates how an AI agent constructs a multi-section form with
 * various input types, validation feedback, and a submit flow.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useRef, useState } from 'react';

import { GenUISurface } from '../src/components/Surface';
import { SurfaceManager } from '../src/SurfaceManager';

// Register all components (side-effect import)
import '../src/components/index';

const meta: Meta<typeof GenUISurface> = {
  title: 'A2UI Stories/Complex Form',
  component: GenUISurface,
};
export default meta;

type Story = StoryObj<typeof GenUISurface>;

const FormBuilder: React.FC = () => {
  const managerRef = useRef<SurfaceManager>(new SurfaceManager());
  const [step, setStep] = useState(0);
  const [lastSync, setLastSync] = useState<string>('');

  const steps = [
    // Step 1: Create surface
    () => {
      const m = managerRef.current;
      m.beginTextStream();
      m.receiveTextChunk(
        '{"createSurface":{"surfaceId":"form","catalogId":"genui-antd"}}',
      );
      m.endTextStream();
      setStep(1);
    },
    // Step 2: Title + personal info section
    () => {
      const m = managerRef.current;
      m.getEngine().updateComponents('form', [
        JSON.stringify({ id: 'title', type: 'Text', text: '📝 Create Account', variant: 'h2' }),
        JSON.stringify({
          id: 'info-alert', type: 'Alert',
          message: 'Fields marked with * are required', type: 'info', showIcon: true,
          style: { marginBottom: 16 },
        }),
        JSON.stringify({
          id: 'personal-card', type: 'Card', title: 'Personal Information', style: { marginBottom: 16 },
        }),
        JSON.stringify({
          id: 'name-row', type: 'Row', parentId: 'personal-card', gutter: 16,
        }),
        JSON.stringify({
          id: 'fname-col', type: 'Column', parentId: 'name-row', span: 12,
        }),
        JSON.stringify({
          id: 'first-name', type: 'TextField', parentId: 'fname-col',
          label: 'First Name *', placeholder: 'John',
        }),
        JSON.stringify({
          id: 'lname-col', type: 'Column', parentId: 'name-row', span: 12,
        }),
        JSON.stringify({
          id: 'last-name', type: 'TextField', parentId: 'lname-col',
          label: 'Last Name *', placeholder: 'Doe',
        }),
        JSON.stringify({
          id: 'email', type: 'TextField', parentId: 'personal-card',
          label: 'Email *', placeholder: 'john@example.com',
          style: { marginTop: 16 },
        }),
      ]);
      setStep(2);
    },
    // Step 3: Preferences section (checkbox, switch, rate, color picker)
    () => {
      const m = managerRef.current;
      m.getEngine().updateComponents('form', [
        JSON.stringify({
          id: 'prefs-card', type: 'Card', title: 'Preferences', style: { marginBottom: 16 },
        }),
        JSON.stringify({
          id: 'role-label', type: 'Text', parentId: 'prefs-card',
          text: 'Select your role:', style: { marginBottom: 8 },
        }),
        JSON.stringify({
          id: 'role-picker', type: 'ChoicePicker', parentId: 'prefs-card',
          options: [
            { value: 'developer', label: 'Developer' },
            { value: 'designer', label: 'Designer' },
            { value: 'pm', label: 'Product Manager' },
            { value: 'qa', label: 'QA Engineer' },
          ],
          style: { marginBottom: 16 },
        }),
        JSON.stringify({
          id: 'exp-label', type: 'Text', parentId: 'prefs-card',
          text: 'Experience Level:', style: { marginBottom: 8 },
        }),
        JSON.stringify({
          id: 'experience', type: 'Rate', parentId: 'prefs-card',
          count: 5, allowHalf: true, value: 3,
          style: { marginBottom: 16 },
        }),
        JSON.stringify({
          id: 'theme-row', type: 'Row', parentId: 'prefs-card', gutter: 16,
        }),
        JSON.stringify({
          id: 'theme-col', type: 'Column', parentId: 'theme-row', span: 12,
        }),
        JSON.stringify({
          id: 'dark-mode', type: 'Switch', parentId: 'theme-col',
        }),
        JSON.stringify({
          id: 'dark-label', type: 'Text', parentId: 'theme-col',
          text: 'Enable Dark Mode',
        }),
        JSON.stringify({
          id: 'notif-col', type: 'Column', parentId: 'theme-row', span: 12,
        }),
        JSON.stringify({
          id: 'notifications', type: 'Switch', parentId: 'notif-col',
        }),
        JSON.stringify({
          id: 'notif-label', type: 'Text', parentId: 'notif-col',
          text: 'Email Notifications',
        }),
        JSON.stringify({
          id: 'fav-color-label', type: 'Text', parentId: 'prefs-card',
          text: 'Favorite Color:', style: { marginTop: 16, marginBottom: 8 },
        }),
        JSON.stringify({
          id: 'fav-color', type: 'ColorPicker', parentId: 'prefs-card',
          value: '#1677ff', showText: true,
        }),
      ]);
      setStep(3);
    },
    // Step 4: Team selection (tree select + cascader) + slider
    () => {
      const m = managerRef.current;
      m.getEngine().updateComponents('form', [
        JSON.stringify({
          id: 'team-card', type: 'Card', title: 'Team & Location', style: { marginBottom: 16 },
        }),
        JSON.stringify({
          id: 'dept-label', type: 'Text', parentId: 'team-card',
          text: 'Department:', style: { marginBottom: 8 },
        }),
        JSON.stringify({
          id: 'department', type: 'Cascader', parentId: 'team-card',
          placeholder: 'Select department',
          options: [
            {
              value: 'engineering', label: 'Engineering',
              children: [
                { value: 'frontend', label: 'Frontend' },
                { value: 'backend', label: 'Backend' },
                { value: 'infra', label: 'Infrastructure' },
              ],
            },
            {
              value: 'product', label: 'Product',
              children: [
                { value: 'design', label: 'Design' },
                { value: 'research', label: 'Research' },
              ],
            },
          ],
          style: { marginBottom: 16, width: '100%' },
        }),
        JSON.stringify({
          id: 'team-label', type: 'Text', parentId: 'team-card',
          text: 'Select Teams:', style: { marginBottom: 8 },
        }),
        JSON.stringify({
          id: 'team-tree', type: 'TreeSelect', parentId: 'team-card',
          multiple: true, showSearch: true,
          treeData: [
            {
              value: 'team-alpha', title: 'Team Alpha',
              children: [
                { value: 'alpha-1', title: 'Alpha-1 (Web)' },
                { value: 'alpha-2', title: 'Alpha-2 (Mobile)' },
              ],
            },
            {
              value: 'team-beta', title: 'Team Beta',
              children: [
                { value: 'beta-1', title: 'Beta-1 (API)' },
                { value: 'beta-2', title: 'Beta-2 (Data)' },
              ],
            },
          ],
          placeholder: 'Choose your teams',
          style: { marginBottom: 16, width: '100%' },
        }),
        JSON.stringify({
          id: 'commute-label', type: 'Text', parentId: 'team-card',
          text: 'Commute Distance (km):',
        }),
        JSON.stringify({
          id: 'commute', type: 'Slider', parentId: 'team-card',
          min: 0, max: 100, value: 15,
        }),
      ]);
      setStep(4);
    },
    // Step 5: Submit + reset
    () => {
      const m = managerRef.current;
      m.getEngine().updateComponents('form', [
        JSON.stringify({
          id: 'footer-divider', type: 'Divider',
        }),
        JSON.stringify({
          id: 'action-row', type: 'Row', justify: 'center',
        }),
        JSON.stringify({
          id: 'action-col', type: 'Column', parentId: 'action-row', span: 24,
          style: { textAlign: 'center' },
        }),
        JSON.stringify({
          id: 'submit-btn', type: 'Button', parentId: 'action-col',
          text: 'Create Account', variant: 'primary', size: 'large',
        }),
        JSON.stringify({
          id: 'reset-btn', type: 'Button', parentId: 'action-col',
          text: 'Reset', style: { marginLeft: 12 },
        }),
      ]);
      setStep(5);
    },
  ];

  useEffect(() => {
    if (step < steps.length) {
      const timer = setTimeout(() => steps[step](), step === 0 ? 300 : 800);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div>
      <div style={{ marginBottom: 16, padding: '8px 16px', background: '#f6ffed', borderRadius: 4 }}>
        <strong>Protocol Step: {step}/{steps.length}</strong>
        <span style={{ marginLeft: 8, color: '#666' }}>
          {step === 0 && 'Initializing...'}
          {step === 1 && 'Surface created'}
          {step === 2 && 'Personal info fields added'}
          {step === 3 && 'Preferences (role, rate, switch, color) added'}
          {step === 4 && 'Team selection (cascader, tree, slider) added'}
          {step === 5 && '✅ Form complete — fill in and submit!'}
        </span>
      </div>
      <GenUISurface
        surfaceManager={managerRef.current}
        width="100%"
        height={900}
        style={{ padding: 24, background: '#fafafa', borderRadius: 8, border: '1px solid #d9d9d9' }}
        onAction={(action) => {
          setLastSync(`[Action] ${action.sourceComponentId} → ${JSON.stringify(action.context)}`);
        }}
      />
      {lastSync && (
        <div style={{ marginTop: 8, padding: 8, background: '#fff7e6', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 }}>
          {lastSync}
        </div>
      )}
    </div>
  );
};

export const BuildForm: Story = {
  name: 'Build Complex Form Step-by-Step',
  render: () => <FormBuilder />,
};
