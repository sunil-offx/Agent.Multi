import React, { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface LoginState {
  isLoggedIn: boolean;
  user: User | null;
}

export function LoginButton() {
  const [loginState, setLoginState] = useState<LoginState>({
    isLoggedIn: false,
    user: null
  });

  // Performance issue: N+1 rendering + missing dependencies
  const handleClick = () => {
    // This creates a new handler every render, causing child re-renders
    const userData = { id: 1, name: 'John', email: 'john@example.com' };
    setLoginState({
      isLoggedIn: true,
      user: userData
    });
  };

  // Bug 1: Missing dependency array - handleClick recreated on every render
  // This causes 100+ children to re-render unnecessarily
  const memoizedHandlers = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    handler: () => handleClick()  // ← Creates 100 new functions per render
  }));

  return (
    <div className="login-container">
      <button onClick={handleClick}>
        {loginState.isLoggedIn ? `Welcome ${loginState.user?.name}` : 'Login'}
      </button>
      
      {/* Performance issue: No keys, forces full list re-render */}
      <ul>
        {memoizedHandlers.map((item) => (
          // ↓ Missing key prop
          <li>
            <button onClick={item.handler}>Action {item.id}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LoginButton;
