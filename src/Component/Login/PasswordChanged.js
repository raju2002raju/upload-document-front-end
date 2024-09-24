import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PasswordChanged = () => {


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
      <div className='loginSignup'>
    <div className='password-changed'>
      <img  src='../Images/Successmark.png' />
      <h1>Password Changed!</h1>
      <h4>Your password has been changed successfully.</h4>
        <div className="back-to-login-container">
          <Link to='/login' className="back-to-login-link">
            Back to Login
          </Link>
        </div>
    </div>
  </div>
</div>  
      <div className='login-bg-div'>
      <h1 className='w-login'>OTP!<br/><span>Verification</span></h1>
      </div>
      </div>
    </div>
  </div>
  </div>
  );
};




export default PasswordChanged
