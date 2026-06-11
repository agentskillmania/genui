import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Descriptions } from '../../../src/components/data/Descriptions';

describe('Descriptions', () => {
  it('renders without crashing when properties is undefined', () => {
    const { container } = render(<Descriptions id="d1" component="Descriptions" />);
    expect(container.querySelector('.ant-descriptions')).toBeTruthy();
  });

  it('renders descriptions with title and items', () => {
    render(
      <Descriptions
        id="d1"
        component="Descriptions"
        properties={{ title: 'Details', items: [{ label: 'Name', children: 'Alice' }] }}
      />,
    );
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Alice')).toBeTruthy();
  });
});
