import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../index';
import '@testing-library/jest-dom';

const classPrefix = 'nant-button';

describe('Button Component', () => {
  test('renders with color', () => {
    const { getByText } = render(<Button type="primary">Primary</Button>);
    console.log(getByText);
  });
});
