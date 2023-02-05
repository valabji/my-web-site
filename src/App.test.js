import { render, screen } from '@testing-library/react';
import App from './App';

test('renders valabji name', () => {
  render(<App />);
  const linkElement = screen.getByText(/My name is abdalrahman Valabji/i);
  expect(linkElement).toBeInTheDocument();
});
