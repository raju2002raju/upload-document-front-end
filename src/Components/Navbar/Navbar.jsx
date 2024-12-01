import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; 
import axios from 'axios';
import { baseUrl } from '../Config';
import { LogOut } from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [setError] = useState();

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${baseUrl}/api/logout`);

      if (response.data.status === 'success') {
        localStorage.clear();
        navigate('/');
      } else {
        setError('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      setError('An error occurred during logout');
    }
  };

  return (
    <nav className="bg-white border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img src='/Images/logo.svg' className='w-full rounded' alt="Logo" />
            </div>
           
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="text-white bg-[#172D41] px-3 py-2 rounded-md text-sm font-medium cursor-pointer flex gap-2 items-center"
            >
              <LogOut/>
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};


