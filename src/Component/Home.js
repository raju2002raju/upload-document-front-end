import React from 'react'
import { Link } from 'react-router-dom'


const Home = () => {
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
      <h1 className='w-login'>WELCOME!<br/><span style={{fontSize:'25px'}}>To Upload Document Application</span></h1>
      <div className='forgot-password home-container'>
      <Link to='signup'><button className='btn home-btn'>Sign Up</button></Link>
      <Link to='login'> <button className='btn home-btn'>Sign In</button></Link>
      </div>
      <div className='login-bg-div'>
      <h1 className='w-login'>WELCOME!<br/><span style={{fontSize:'25px'}}>To Upload Document Application</span></h1>
      </div>
      </div>
    </div>
  </div>
  </div>
  )
}

export default Home
