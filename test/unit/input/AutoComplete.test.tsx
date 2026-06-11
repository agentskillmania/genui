import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { AutoComplete } from '../../../src/components/input/AutoComplete';

describe('AutoComplete', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<AutoComplete id="a1" component="AutoComplete" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with options', () => {
    const { container } = render(
      <AutoComplete id="a1" component="AutoComplete" properties={{ options: [{ value: 'apple' }, { value: 'banana' }] }} />,
    );
    expect(container.querySelector('input')).toBeTruthy();
  });

  it('renders with placeholder', () => {
    render(
      <AutoComplete id="a1" component="AutoComplete" properties={{ placeholder: 'Search...' }} />,
    );
    // Verify component renders without crash
    const input = document.querySelector('input');
    expect(input).toBeTruthy();
  });
});
