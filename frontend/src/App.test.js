import { render, screen } from '@testing-library/react';
import App from './App';

// Mock axios to prevent network calls during tests
jest.mock('axios');

test('renders payment orchestrator title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Payment Orchestrator/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders create payment form', () => {
  render(<App />);
  const createButton = screen.getByText(/Create Payment/i);
  expect(createButton).toBeInTheDocument();
});