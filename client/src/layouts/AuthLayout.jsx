import React from 'react';
import Branding from '../components/shared/Branding';
import Login from '../features/auth/pages/Login';

const AuthLayout = () => {
  return (
    <>
      <Login />
      <Branding />
    </>
  );
};

export default AuthLayout;
