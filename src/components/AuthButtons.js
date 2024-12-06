import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthButtons = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <div className="flex items-center space-x-4">
      {!isAuthenticated && (
        <button
          onClick={() => loginWithRedirect()}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Log In
        </button>
      )}
      {isAuthenticated && (
        <>
          <span className="text-gray-700">Hello, {user.name}</span>
          <button
            onClick={() =>
              logout({ returnTo: window.location.origin })
            }
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Log Out
          </button>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
