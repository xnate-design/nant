import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../index';

const classPrefix = 'nant-button';

describe('Button Component', () => {
  test('renders with color', () => {
    const { getByText } = render(
      <>
        <Button type="primary">Primary</Button>
        <Button type="success">Success</Button>
        <Button type="danger">Danger</Button>
        <Button type="warning">Warning</Button>
      </>,
    );
    expect(getByText('Primary').closest('button')).toHaveClass(`${classPrefix}-primary`);
    expect(getByText('Success').closest('button')).toHaveClass(`${classPrefix}-success`);
    expect(getByText('Danger').closest('button')).toHaveClass(`${classPrefix}-danger`);
    expect(getByText('Warning').closest('button')).toHaveClass(`${classPrefix}-warning`);
  });
});
