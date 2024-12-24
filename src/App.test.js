import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Kitchen Canvas title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Kitchen Canvas/i);
  expect(titleElement).toBeInTheDocument();
});

test('displays error for empty ingredient input', () => {
  render(<App />);
  const submitButton = screen.getByText(/Search/i);
  fireEvent.click(submitButton);
  const errorMessage = screen.getByText(/Please enter at least one ingredient/i);
  expect(errorMessage).toBeInTheDocument();
});

test('displays error when no recipes match', () => {
  render(<App />);
  const ingredientInput = screen.getByPlaceholderText(/Ingredients/i);
  fireEvent.change(ingredientInput, { target: { value: 'nonexistentingredient' } });
  const submitButton = screen.getByText(/Search/i);
  fireEvent.click(submitButton);
  const errorMessage = screen.getByText(/No recipes found/i);
  expect(errorMessage).toBeInTheDocument();
});
