/**
 * Story 3: A2UI Interaction Loop — the core value of A2UI.
 *
 * Demonstrates the complete feedback loop:
 *   1. AI creates a survey form
 *   2. User fills in data (onSyncState events)
 *   3. User clicks Submit (onAction event)
 *   4. AI "thinks" and responds with personalized results
 *   5. New components replace the form
 *
 * This is what makes A2UI unique: the UI is not static — it's a living
 * conversation between the AI agent and the user through interactive components.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useRef, useState, useCallback } from 'react';

import { GenUISurface } from '../src/components/Surface';
import { SurfaceManager } from '../src/SurfaceManager';
import type { ActionEvent } from '../src/types/sdk';

// Register all components (side-effect import)
import '../src/components/index';

const meta: Meta<typeof GenUISurface> = {
  title: 'A2UI Stories/Interaction Loop',
  component: GenUISurface,
};
export default meta;

type Story = StoryObj<typeof GenUISurface>;

// Simulated "AI agent" that responds to user actions
class SimulatedAgent {
  private manager: SurfaceManager;
  private onLog: (msg: string) => void;

  constructor(manager: SurfaceManager, onLog: (msg: string) => void) {
    this.manager = manager;
    this.onLog = onLog;
  }

  /** Build the initial survey form */
  buildSurvey(): void {
    const m = this.manager;
    m.getEngine().createSurface('interaction', 'genui-antd', {});

    m.getEngine().updateComponents('interaction', [
      // Header
      JSON.stringify({
        id: 'title', type: 'Text',
        text: '🎯 Quick Product Survey', variant: 'h3',
      }),
      JSON.stringify({
        id: 'subtitle', type: 'Text',
        text: 'Help us understand your needs — takes 30 seconds!',
        style: { color: '#666', marginBottom: 16 },
      }),

      // Question 1: Satisfaction
      JSON.stringify({
        id: 'q1-card', type: 'Card', title: '1. How satisfied are you?', style: { marginBottom: 16 },
      }),
      JSON.stringify({
        id: 'satisfaction', type: 'Rate', parentId: 'q1-card',
        count: 5, allowHalf: true, value: 3,
      }),

      // Question 2: Usage frequency
      JSON.stringify({
        id: 'q2-card', type: 'Card', title: '2. How often do you use our product?', style: { marginBottom: 16 },
      }),
      JSON.stringify({
        id: 'frequency', type: 'ChoicePicker', parentId: 'q2-card',
        options: [
          { value: 'daily', label: '📱 Daily' },
          { value: 'weekly', label: '📅 Weekly' },
          { value: 'monthly', label: '🗓️ Monthly' },
          { value: 'rarely', label: '🤷 Rarely' },
        ],
      }),

      // Question 3: Budget slider
      JSON.stringify({
        id: 'q3-card', type: 'Card', title: '3. Monthly budget for tools ($)', style: { marginBottom: 16 },
      }),
      JSON.stringify({
        id: 'budget', type: 'Slider', parentId: 'q3-card',
        min: 0, max: 500, value: 100,
      }),

      // Question 4: Feature preference
      JSON.stringify({
        id: 'q4-card', type: 'Card', title: '4. Most important feature?', style: { marginBottom: 16 },
      }),
      JSON.stringify({
        id: 'feature', type: 'TreeSelect', parentId: 'q4-card',
        placeholder: 'Pick one...',
        treeData: [
          {
            value: 'performance', title: '⚡ Performance',
            children: [
              { value: 'speed', title: 'Speed' },
              { value: 'reliability', title: 'Reliability' },
            ],
          },
          {
            value: 'ux', title: '🎨 User Experience',
            children: [
              { value: 'design', title: 'Design' },
              { value: 'ease', title: 'Ease of Use' },
            ],
          },
          {
            value: 'integration', title: '🔗 Integration',
            children: [
              { value: 'api', title: 'API Access' },
              { value: 'plugins', title: 'Plugins' },
            ],
          },
        ],
      }),

      // Submit button
      JSON.stringify({ id: 'divider', type: 'Divider' }),
      JSON.stringify({
        id: 'submit-row', type: 'Row', justify: 'center',
      }),
      JSON.stringify({
        id: 'submit-col', type: 'Column', parentId: 'submit-row', span: 24,
        style: { textAlign: 'center' },
      }),
      JSON.stringify({
        id: 'submit-btn', type: 'Button', parentId: 'submit-col',
        text: 'Submit Survey →', variant: 'primary', size: 'large',
      }),
    ]);
    this.onLog('Agent: Built survey form with 4 questions');
  }

  /** Simulate AI "thinking" and responding with personalized results */
  handleSubmission(_action: ActionEvent): void {
    this.onLog('Agent: Received submit action — analyzing responses...');

    // Phase 1: Show loading
    setTimeout(() => {
      const m = this.manager;
      // Clear old components and show "thinking" state
      m.getEngine().updateComponents('interaction', [
        JSON.stringify({
          id: 'loading', type: 'Card', style: { textAlign: 'center', padding: 48 },
        }),
        JSON.stringify({
          id: 'spinner', type: 'Spin', parentId: 'loading',
          spinning: true, tip: 'AI is analyzing your responses...',
          size: 'large',
        }),
      ]);
      this.onLog('Agent: Analyzing user responses...');
    }, 300);

    // Phase 2: Show personalized results
    setTimeout(() => {
      const m = this.manager;

      m.getEngine().updateComponents('interaction', [
        // Success banner
        JSON.stringify({
          id: 'result-title', type: 'Text',
          text: '✅ Your Personalized Report', variant: 'h3',
        }),
        JSON.stringify({
          id: 'result-alert', type: 'Alert',
          message: 'Based on your survey responses, here are our recommendations.',
          type: 'success', showIcon: true,
          style: { marginBottom: 16 },
        }),

        // Stats row
        JSON.stringify({ id: 'stats-row', type: 'Row', gutter: 16 }),
        JSON.stringify({ id: 'stat-col-1', type: 'Column', parentId: 'stats-row', span: 8 }),
        JSON.stringify({
          id: 'stat-1', type: 'Statistic', parentId: 'stat-col-1',
          title: 'Match Score', value: 94, suffix: '%',
        }),
        JSON.stringify({ id: 'stat-col-2', type: 'Column', parentId: 'stats-row', span: 8 }),
        JSON.stringify({
          id: 'stat-2', type: 'Statistic', parentId: 'stat-col-2',
          title: 'Recommended Plan', value: 'Pro', prefix: '$49/mo',
        }),
        JSON.stringify({ id: 'stat-col-3', type: 'Column', parentId: 'stats-row', span: 8 }),
        JSON.stringify({
          id: 'stat-3', type: 'Statistic', parentId: 'stat-col-3',
          title: 'Est. ROI', value: 340, suffix: '%', precision: 0,
        }),

        // Recommendation chart
        JSON.stringify({
          id: 'chart-card', type: 'Card', title: 'Feature Fit Analysis', style: { marginTop: 24 },
        }),
        JSON.stringify({
          id: 'radar-chart', type: 'Chart', parentId: 'chart-card',
          chartType: 'radar', height: 350,
          data: [
            { dimension: 'Performance', value: 92 },
            { dimension: 'UX', value: 78 },
            { dimension: 'Integration', value: 85 },
            { dimension: 'Value', value: 88 },
            { dimension: 'Support', value: 95 },
          ],
          config: { xField: 'dimension', yField: 'value', title: 'How well our Pro plan matches your needs' },
        }),

        // Recommendations
        JSON.stringify({
          id: 'rec-card', type: 'Card', title: 'Top Recommendations', style: { marginTop: 24 },
        }),
        JSON.stringify({
          id: 'rec-timeline', type: 'Timeline', parentId: 'rec-card',
          items: [
            { children: 'Enable API Access — fits your integration needs', color: 'green' },
            { children: 'Upgrade to Pro plan — within your budget range', color: 'blue' },
            { children: 'Schedule onboarding call for quick setup', color: 'orange' },
          ],
        }),

        // Actions
        JSON.stringify({ id: 'footer-divider', type: 'Divider' }),
        JSON.stringify({ id: 'action-row', type: 'Row', justify: 'center' }),
        JSON.stringify({
          id: 'action-col', type: 'Column', parentId: 'action-row', span: 24,
          style: { textAlign: 'center' },
        }),
        JSON.stringify({
          id: 'upgrade-btn', type: 'Button', parentId: 'action-col',
          text: '🚀 Upgrade to Pro', variant: 'primary', size: 'large',
        }),
        JSON.stringify({
          id: 'retake-btn', type: 'Button', parentId: 'action-col',
          text: 'Retake Survey', style: { marginLeft: 12 },
        }),
      ]);
      this.onLog('Agent: Generated personalized recommendations based on survey data');
    }, 2000);
  }

  /** Handle "Retake Survey" — rebuilds the form */
  handleRetake(_action: ActionEvent): void {
    this.onLog('Agent: User wants to retake — rebuilding survey...');
    const m = this.manager;
    m.getEngine().deleteSurface('interaction');

    setTimeout(() => {
      this.buildSurvey();
    }, 200);
  }

  /** Handle "Upgrade" action */
  handleUpgrade(_action: ActionEvent): void {
    this.onLog('Agent: User chose upgrade! Redirecting to checkout...');

    const m = this.manager;
    m.getEngine().updateComponents('interaction', [
      JSON.stringify({
        id: 'result-title', type: 'Text',
        text: '🎉 Welcome to Pro!', variant: 'h2',
        style: { textAlign: 'center', marginTop: 48 },
      }),
      JSON.stringify({
        id: 'result-subtitle', type: 'Text',
        text: 'Your account has been upgraded. Check your email for next steps.',
        style: { textAlign: 'center', color: '#666', marginTop: 8 },
      }),
      JSON.stringify({
        id: 'success-result', type: 'Result', status: 'success',
        title: 'Upgrade Complete',
        subTitle: 'You now have access to all Pro features',
        style: { marginTop: 24 },
      }),
    ]);
  }
}

const InteractionLoop: React.FC = () => {
  const managerRef = useRef<SurfaceManager>(new SurfaceManager());
  const agentRef = useRef<SimulatedAgent | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} — ${msg}`].slice(-10));
  }, []);

  if (!agentRef.current) {
    agentRef.current = new SimulatedAgent(managerRef.current, addLog);
  }

  useEffect(() => {
    agentRef.current!.buildSurvey();
  }, []);

  const handleAction = useCallback((action: ActionEvent) => {
    const agent = agentRef.current!;
    const componentId = action.sourceComponentId;

    if (componentId === 'submit-btn') {
      agent.handleSubmission(action);
    } else if (componentId === 'retake-btn') {
      agent.handleRetake(action);
    } else if (componentId === 'upgrade-btn') {
      agent.handleUpgrade(action);
    } else {
      addLog(`Event: ${componentId} → ${JSON.stringify(action.context)}`);
    }
  }, [addLog]);

  return (
    <div>
      <div style={{ marginBottom: 16, padding: '8px 16px', background: '#f9f0ff', borderRadius: 4 }}>
        <strong>A2UI Interaction Loop</strong>
        <span style={{ marginLeft: 8, color: '#666' }}>
          AI builds form → User fills data → Submit → AI responds with results
        </span>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 3 }}>
          <GenUISurface
            surfaceManager={managerRef.current}
            width="100%"
            height={700}
            style={{ padding: 24, background: '#fafafa', borderRadius: 8, border: '1px solid #d9d9d9' }}
            onAction={handleAction}
          />
        </div>

        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{
            padding: 12, background: '#1a1a2e', borderRadius: 8, color: '#0f0',
            fontFamily: 'monospace', fontSize: 11, height: 700, overflowY: 'auto',
          }}>
            <div style={{ color: '#aaa', marginBottom: 8 }}>📡 Event Log</div>
            {logs.map((log, i) => (
              <div key={i} style={{ marginBottom: 4, lineHeight: 1.4 }}>{log}</div>
            ))}
            {logs.length === 0 && (
              <div style={{ color: '#666' }}>Waiting for interactions...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FullInteractionLoop: Story = {
  name: 'Complete Interaction Loop',
  render: () => <InteractionLoop />,
};
