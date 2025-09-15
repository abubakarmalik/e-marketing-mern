import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../..//auth/authSlice';

const Dashboard = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.name}!</h2>
        </div>
      ) : (
        <p>Please log in to see your dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;
