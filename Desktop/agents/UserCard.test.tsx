import React from 'react';
import { render, screen } from '@testing-library/react';
import UserCard from './UserCard';

describe('UserCard Component - Test Failures', () => {
  
  test('UserCard renders with null data', () => {
    // Scenario: API returns null instead of array
    render(<UserCard users={null as any} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  test('API response parser fails on empty array', () => {
    // Scenario: Empty array from API should show "no users" message
    const emptyUsers = [];
    render(<UserCard users={emptyUsers} />);
    expect(screen.getByText(/no users|empty/i)).toBeInTheDocument();
  });

  test('Login button click event not firing', () => {
    // Scenario: Button click doesn't update state
    render(<UserCard users={[{ id: 1, name: 'Alice', email: 'alice@example.com' }]} />);
    const button = screen.getByRole('button', { name: /login/i });
    
    button.click();
    // Expected: State changes, but it's not happening
    expect(screen.getByText(/logged in/i)).toBeInTheDocument(); // ← FAILS
  });
});
