import React from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserCardProps {
  users: User[];
}

export function UserCard({ users }: UserCardProps) {
  return (
    <div className="user-card">
      <h2>User List</h2>
      {/* Line 42 - ERROR: Cannot read property 'map' of undefined */}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong>
            <p>{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserCard;
