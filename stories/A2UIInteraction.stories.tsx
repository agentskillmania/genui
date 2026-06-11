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
      // Root wrapper
      JSON.stringify({
        id: 'root', component: 'Column', children: ['title', 'subtitle', 'q1-card', 'q2-card', 'q3-card', 'q4-card', 'divider', 'submit-row'],
      }),
      // Header
      JSON.stringify({
        id: 'title', component: 'Text',
        text: '🎯 Quick Product Survey', variant: 'h3',
      }),
      JSON.stringify({
        id: 'subtitle', component: 'Text',
        text: 'Help us understand your needs — takes 30 seconds!',
        style: { color: '#666', marginBottom: 16 },
      }),

      // Question 1: Satisfaction
      JSON.stringify({
        id: 'q1-card', component: 'Card', title: '1. How satisfied are you?', style: { marginBottom: 16 }, child: 'satisfaction',
      }),
      JSON.stringify({
        id: 'satisfaction', component: 'Rate',
        count: 5, allowHalf: true, value: 3,
      }),

      // Question 2: Usage frequency
      JSON.stringify({
        id: 'q2-card', component: 'Card', title: '2. How often do you use our product?', style: { marginBottom: 16 }, child: 'frequency',
      }),
      JSON.stringify({
        id: 'frequency', component: 'ChoicePicker',
        options: [
          { value: 'daily', label: '📱 Daily' },
          { value: 'weekly', label: '📅 Weekly' },
          { value: 'monthly', label: '🗓️ Monthly' },
          { value: 'rarely', label: '🤷 Rarely' },
        ],
      }),

      // Question 3: Budget slider
      JSON.stringify({
        id: 'q3-card', component: 'Card', title: '3. Monthly budget for tools ($)', style: { marginBottom: 16 }, child: 'budget',
      }),
      JSON.stringify({
        id: 'budget', component: 'Slider',
        min: 0, max: 500, value: 100,
      }),

      // Question 4: Feature preference
      JSON.stringify({
        id: 'q4-card', component: 'Card', title: '4. Most important feature?', style: { marginBottom: 16 }, child: 'feature',
      }),
      JSON.stringify({
        id: 'feature', component: 'TreeSelect',
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
      JSON.stringify({ id: 'divider', component: 'Divider' }),
      JSON.stringify({
        id: 'submit-row', component: 'Row', justify: 'center', child: 'submit-col',
      }),
      JSON.stringify({
        id: 'submit-col', component: 'Column', span: 24,
        style: { textAlign: 'center' }, child: 'submit-btn',
      }),
      JSON.stringify({
        id: 'submit-btn', component: 'Button',
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
        JSON.stringify({ id: 'root', component: 'Column', children: ['loading'] }),
        JSON.stringify({
          id: 'loading', component: 'Card', style: { textAlign: 'center', padding: 48 }, child: 'spinner',
        }),
        JSON.stringify({
          id: 'spinner', component: 'Spin',
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
        // Root wrapper for results
        JSON.stringify({ id: 'root', component: 'Column', children: ['result-title', 'result-alert', 'stats-row', 'chart-card', 'rec-card', 'footer-divider', 'action-row'] }),
        // Success banner
        JSON.stringify({
          id: 'result-title', component: 'Text',
          text: '✅ Your Personalized Report', variant: 'h3',
        }),
        JSON.stringify({
          id: 'result-alert', component: 'Alert',
          message: 'Based on your survey responses, here are our recommendations.',
          type: 'success', showIcon: true,
          style: { marginBottom: 16 },
        }),

        // Stats row
        JSON.stringify({ id: 'stats-row', component: 'Row', gutter: 16, children: ['stat-col-1', 'stat-col-2', 'stat-col-3'] }),
        JSON.stringify({ id: 'stat-col-1', component: 'Column', span: 8, child: 'stat-1' }),
        JSON.stringify({
          id: 'stat-1', component: 'Statistic',
          title: 'Match Score', value: 94, suffix: '%',
        }),
        JSON.stringify({ id: 'stat-col-2', component: 'Column', span: 8, child: 'stat-2' }),
        JSON.stringify({
          id: 'stat-2', component: 'Statistic',
          title: 'Recommended Plan', value: 'Pro', prefix: '$49/mo',
        }),
        JSON.stringify({ id: 'stat-col-3', component: 'Column', span: 8, child: 'stat-3' }),
        JSON.stringify({
          id: 'stat-3', component: 'Statistic',
          title: 'Est. ROI', value: 340, suffix: '%', precision: 0,
        }),

        // Recommendation chart
        JSON.stringify({
          id: 'chart-card', component: 'Card', title: 'Feature Fit Analysis', style: { marginTop: 24 }, child: 'radar-chart',
        }),
        JSON.stringify({
          id: 'radar-chart', component: 'Chart',
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
          id: 'rec-card', component: 'Card', title: 'Top Recommendations', style: { marginTop: 24 }, child: 'rec-timeline',
        }),
        JSON.stringify({
          id: 'rec-timeline', component: 'Timeline',
          items: [
            { children: 'Enable API Access — fits your integration needs', color: 'green' },
            { children: 'Upgrade to Pro plan — within your budget range', color: 'blue' },
            { children: 'Schedule onboarding call for quick setup', color: 'orange' },
          ],
        }),

        // Actions
        JSON.stringify({ id: 'footer-divider', component: 'Divider' }),
        JSON.stringify({ id: 'action-row', component: 'Row', justify: 'center', child: 'action-col' }),
        JSON.stringify({
          id: 'action-col', component: 'Column', span: 24,
          style: { textAlign: 'center' }, children: ['upgrade-btn', 'retake-btn'],
        }),
        JSON.stringify({
          id: 'upgrade-btn', component: 'Button',
          text: '🚀 Upgrade to Pro', variant: 'primary', size: 'large',
        }),
        JSON.stringify({
          id: 'retake-btn', component: 'Button',
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
      JSON.stringify({ id: 'root', component: 'Column', children: ['result-title', 'result-subtitle', 'success-result'] }),
      JSON.stringify({
        id: 'result-title', component: 'Text',
        text: '🎉 Welcome to Pro!', variant: 'h2',
        style: { textAlign: 'center', marginTop: 48 },
      }),
      JSON.stringify({
        id: 'result-subtitle', component: 'Text',
        text: 'Your account has been upgraded. Check your email for next steps.',
        style: { textAlign: 'center', color: '#666', marginTop: 8 },
      }),
      JSON.stringify({
        id: 'success-result', component: 'Result', status: 'success',
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
