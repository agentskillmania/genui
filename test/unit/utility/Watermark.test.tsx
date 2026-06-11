import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Watermark } from '../../../src/components/utility/Watermark';

describe('Watermark', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Watermark id="w1" component="Watermark"><div>Content</div></Watermark>);
    expect(container).toBeTruthy();
  });

  it('renders with content string', () => {
    const { container } = render(
      <Watermark id="w1" component="Watermark" properties={{ content: 'DRAFT' }}>
        <div>Protected</div>
      </Watermark>,
    );
    expect(container).toBeTruthy();
  });

  it('renders with font options', () => {
    const { container } = render(
      <Watermark id="w1" component="Watermark" properties={{ content: 'CONFIDENTIAL', fontColor: 'rgba(0,0,0,0.1)', fontSize: 16 }}>
        <div>Secret</div>
      </Watermark>,
    );
    expect(container).toBeTruthy();
  });
});
