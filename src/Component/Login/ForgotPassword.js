import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://upload-document-back-end.onrender.com/api/forgot-password", {
        email
      });

      setMessage(response.data.message);
      if (response.data.success) {
        // Redirect to OTP verification page with email in state
        navigate('/verify-otp', { state: { email } });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className='main-container'>
        <div className='d-flex m-d-flex'>
    <div className='file_upload_container'>
      <div className='w-525 profile-upload-document'>  
        <p>UPLOAD DOCUMENT</p>
        <div className='mobile-p-5'>
         
          <div className='hover-upload-document'>
           
            <p className='upload-document'>
              Upload Document
            </p>
          </div>
        </div>
      </div>
      <div className='w-525-bg'></div>
    </div>
  
  </div>
      <div>
      <div>
        <img className='background-image' src='./Images/Vector 1 (1).png' alt="Background" />
      </div>
      <div className="container">
        <div className="file-upload-div">
        <div className='forgot-password'>
      <div >
        <div className='reset'>
          <h2>Forgot Password</h2>
          <p>Enter your email and we'll send you a code to reset your password</p>
          <form onSubmit={handleSubmit}>
            <div className='email_container input-icons'>
              <img src='/Images/email.png' className="icon" style={{ width: '20px' }} alt="Email icon" />
              <input
                className="input-field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder='Enter your email'
              />
            </div>
            <div className='login-btn'>
              <button type="submit">Send Code</button>
            </div>
            <div className='link_login'>
              <div>
                <Link to='/login' className="back-to-login-link">
                  {/* <img className="back-to-login-img" src='../Images/back.png' alt="" /> */}
                  Back to Login
                </Link>
              </div>
            </div>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
        <div className='login-bg-div'>
        <h1 className='w-login'>Forgot!<br/><span>Password</span></h1>
        </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ForgotPassword;
