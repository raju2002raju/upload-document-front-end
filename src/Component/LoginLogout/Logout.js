import React from 'react';
import { googleLogout } from '@react-oauth/google';

const LogoutButton = () => {
  const onLogoutSuccess = () => {
    console.log('Logout Successful!');
  };

  const handleLogout = () => {
    googleLogout();
    onLogoutSuccess();
  };

  return (
    <div>
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
