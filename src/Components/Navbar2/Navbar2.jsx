import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; 
import axios from 'axios';
import { baseUrl } from '../Config';

export const Navbar2 = () => {
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
    <nav >
      <div className="flex justify-center mb-3">
        <div className="flex justify-between h-16 items-center">        
            <div className=" flex flex-col gap-3">
              <Link 
                to="/" 
                className={`text-sm font-medium cursor-pointer border p-3 bg-white flex gap-2 items-center text-[#344054] rounded-lg ${location.pathname === '/' ? 'bg-blue-500' : 'text-[#344054]'}`}
              >
                <img src='./Images/generate_document_icon.svg'/>
                GENERATE DOCUMENT
              </Link>
              <Link 
                to="/my-documents" 
                className={`text-sm font-medium cursor-pointer  border p-3 bg-white flex gap-2 items-center text-[#344054] rounded-lg ${location.pathname === '/my-documents' ? 'text-blue-600' : 'text-[#344054]'}`}
                title='My Documents'
              >
                <img  src='./Images/my_document_icon.svg'/>
                MY DOCUMENTS
              </Link>
            </div>
       
      
        </div>
      </div>
    </nav>
  );
};


