import { render, screen } from '@testing-library/react';
import App from './App';

test('renders cursor usage analytics', () => {
  render(<App />);
  const titleElement = screen.getByText(/Cursor Usage Analytics/i);
  expect(titleElement).toBeInTheDocument();
});
