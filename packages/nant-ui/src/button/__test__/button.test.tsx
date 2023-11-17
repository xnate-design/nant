import '@testing-library/jest-dom';

import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../index';
import { unmountComponentAtNode } from 'react-dom';

const classPrefix = 'nant-button';

// let container = null;
// beforeEach(() => {
//   container = document.createElement('div');
//   document.body.appendChild(container);
// });

// afterEach(() => {
//   unmountComponentAtNode(container);
//   container?.remove();
//   container = null;
// });

describe('Button Component', () => {
  test('renders button', () => {
    render(<Button>btn</Button>);
    expect(screen.getByText('btn')).toBeInTheDocument();
  });

  test('renders with type', () => {
    const { getByText } = render(
      <>
        <Button type="primary">Primary</Button>
        <Button type="info">Info</Button>
        <Button type="warning">Warning</Button>
        <Button type="danger">Danger</Button>
      </>,
    );

    expect(getByText('Primary')).toHaveClass(`${classPrefix}-primary`);
  });
});
