import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { GoogleOAuthProvider } from "@react-oauth/google";
import FacebookLoginComponent from "../LoginLogout/FacebookLogin";
import LoginButton from "../LoginLogout/Login";
import './Login.css';

const Login = () => {
  const clientId = '799149964193-3m34unf2976di4du1omj7g02v27g1164.apps.googleusercontent.com';
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const baseUrl  = 'https://upload-document-back-end.onrender.com';

  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseUrl}/auth/login`, {  
        email,
        password
      });

      if (response.status === 200) { 
        if (response.data.status === "exist") {
          localStorage.setItem('userEmail', email); 
          navigate("/chat", { state: { user: response.data.user } });
        } else if (response.data.status === "notexist") {
          alert("User not found or incorrect password");
        }
      } else {
        alert("Password incorrect. Please try again.");
      }
    } catch (error) {
      alert("User not found or incorrect password");
      console.error('Error during login:', error);
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
         <div className='login-container'>
         <h1>SIGN IN</h1>
          {/* <hr  className='hr-tag'/> */}
          <form onSubmit={submit}>
              <div className='email-pass-container'>
              <div className='email_container input-icons'>
                <img src='/Images/email.png' className="icon" style={{ width: '20px' }} alt="Email Icon" />
                <input 
                  className='input-field'
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder='Enter Your Email'
                />
              </div>
              <div className='password_container input-icons'>
                <img src='./Images/password.png' className="icon" style={{ width: '20px' }} alt="Password Icon" />
                <div className="password-field">
                  <input 
                    className='input-field'
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    placeholder='Enter Your Password'
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="show-password-btn"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </button>
                </div>
              </div>
              </div>
              <div className='Forget_Remember'>
                <div className='check'>
                  <input 
                    type='checkbox'
                  />
                  <p style={{ fontSize: '15px' }}>Remember Me</p>
                </div>
                <div>
                  <Link className='resetPassword' to='/reset_password' style={{ color: 'red' }}>Forgot Password?</Link>
                </div>
              </div>
              <div className='login-btn'>
                <button type="submit">SIGN In</button>
              </div>
            </form>
            <div className="g-f-signup-button">
              <GoogleOAuthProvider clientId={clientId}>
                <LoginButton />
              </GoogleOAuthProvider>
              <FacebookLoginComponent />
            </div>
            <div className="already-div"> 
            <p className="already-d-g">Don't have an account? <Link style={{ textDecoration: 'none', color: 'rebeccapurple' }} to='/signup'>Register Now</Link></p>
          </div>
         </div>
        <div className='login-bg-div'>
        <h1 className='w-login'>WELCOME BACK!<br/><span>Glad to see you, Again!</span></h1>
        </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;