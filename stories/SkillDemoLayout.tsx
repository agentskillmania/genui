/**
 * Shared layout for Skill Demo stories.
 * Left panel: formatted JSON source data.
 * Right panel: live A2UI rendering via GenUISurface.
 */
import React, { useEffect, useRef, useState } from 'react';

import { GenUISurface } from '../src/components/Surface';
import { SurfaceManager } from '../src/SurfaceManager';

import '../src/components/index';

/** A single demo's data pair: component tree + data model. */
export interface SkillDemoData {
  /** The updateComponents envelope. */
  components: {
    version: string;
    updateComponents: {
      surfaceId: string;
      components: unknown[];
    };
  };
  /** The updateDataModel envelope. */
  dataModel: {
    version: string;
    updateDataModel: {
      surfaceId: string;
      path: string;
      value: unknown;
    };
  };
}

interface SkillDemoLayoutProps {
  demo: SkillDemoData;
  /** Optional description shown below the title. */
  description?: string;
  /** Surface width for the renderer (default 480). */
  surfaceWidth?: number | string;
  /** Surface height for the renderer (default 'auto'). */
  surfaceHeight?: number | string;
}

/** Format JSON with 2-space indent. */
function formatJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

export const SkillDemoLayout: React.FC<SkillDemoLayoutProps> = ({
  demo,
  description,
  surfaceWidth = 480,
  surfaceHeight = 'auto',
}) => {
  const managerRef = useRef<SurfaceManager>(new SurfaceManager());
  const [activeTab, setActiveTab] = useState<'components' | 'data'>('components');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const m = managerRef.current;
    const { surfaceId } = demo.components.updateComponents;
    m.getEngine().createSurface(surfaceId, 'genui-antd', {});
    m.getEngine().updateComponents(
      surfaceId,
      demo.components.updateComponents.components.map((c: unknown) => JSON.stringify(c)),
    );
    m.getEngine().updateDataModel(
      surfaceId,
      demo.dataModel.updateDataModel.path,
      demo.dataModel.updateDataModel.value,
    );
  }, [demo]);

  const handleCopy = () => {
    const text = activeTab === 'components'
      ? formatJson(demo.components)
      : formatJson(demo.dataModel);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const jsonContent = activeTab === 'components'
    ? formatJson(demo.components)
    : formatJson(demo.dataModel);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {description && (
        <div style={{ color: '#666', fontSize: 13, lineHeight: 1.5 }}>{description}</div>
      )}
      <div style={{ display: 'flex', gap: 16, minHeight: 400 }}>
        {/* Left panel: JSON source */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: '#1e1e2e',
          borderRadius: 8,
          overflow: 'hidden',
          fontSize: 12,
          fontFamily: "'SF Mono', 'Fira Code', 'JetBrains Mono', monospace",
        }}>
          {/* Tab bar */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #333',
            background: '#181825',
          }}>
            <button
              onClick={() => setActiveTab('components')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: activeTab === 'components' ? '#1e1e2e' : 'transparent',
                color: activeTab === 'components' ? '#89b4fa' : '#6c7086',
                cursor: 'pointer',
                fontSize: 12,
                fontFamily: 'inherit',
                borderBottom: activeTab === 'components' ? '2px solid #89b4fa' : '2px solid transparent',
              }}
            >
              Components
            </button>
            <button
              onClick={() => setActiveTab('data')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: activeTab === 'data' ? '#1e1e2e' : 'transparent',
                color: activeTab === 'data' ? '#89b4fa' : '#6c7086',
                cursor: 'pointer',
                fontSize: 12,
                fontFamily: 'inherit',
                borderBottom: activeTab === 'data' ? '2px solid #89b4fa' : '2px solid transparent',
              }}
            >
              Data Model
            </button>
            <div style={{ flex: 1 }} />
            <button
              onClick={handleCopy}
              style={{
                padding: '4px 12px',
                margin: '6px 8px',
                border: '1px solid #333',
                borderRadius: 4,
                background: 'transparent',
                color: '#6c7086',
                cursor: 'pointer',
                fontSize: 11,
                fontFamily: 'inherit',
              }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          {/* JSON content */}
          <pre style={{
            margin: 0,
            padding: 16,
            overflow: 'auto',
            color: '#cdd6f4',
            lineHeight: 1.6,
            flex: 1,
          }}>
            {jsonContent}
          </pre>
        </div>

        {/* Right panel: live A2UI rendering */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: 24,
          background: '#fafafa',
          borderRadius: 8,
          border: '1px solid #f0f0f0',
        }}>
          <GenUISurface
            surfaceManager={managerRef.current}
            width={surfaceWidth}
            height={surfaceHeight}
            style={{ background: '#fff', borderRadius: 8 }}
          />
        </div>
      </div>
    </div>
  );
};
