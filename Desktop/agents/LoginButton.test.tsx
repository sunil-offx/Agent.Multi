import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginButton from './LoginButton';

describe('LoginButton Performance Tests', () => {
  
  test('renders 100 action buttons in < 100ms', () => {
    const startTime = performance.now();
    render(<LoginButton />);
    const endTime = performance.now();
    
    expect(screen.getAllByRole('button').length).toBe(101); // 1 login + 100 actions
    const renderTime = endTime - startTime;
    
    console.log(`Render time: ${renderTime}ms`);
    expect(renderTime).toBeLessThan(100); // ← FAILS: Takes 800ms+
  });

  test('login button click updates state without full re-render', () => {
    const { rerender } = render(<LoginButton />);
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    const initialRenderCount = jest.fn();
    
    loginButton.click();
    rerender(<LoginButton />);
    
    // Performance regression: Component re-renders 100+ children unnecessarily
    expect(initialRenderCount).toHaveBeenCalledTimes(1); // ← FAILS: Called 100+ times
  });
});
