import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const response = await axios.get('https://upload-document-back-end.onrender.com/auth/user', {
          headers: {
            'user-email': email,
          },
        });
        setUserData(response.data[0]);
        setProfileName(response.data[0].name);
        setProfileEmail(response.data[0].email);
        setProfilePhone(response.data[0].phone);
        setProfileImage(response.data[0].profileImage);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileUpdate = async () => {
    const formData = new FormData();
    formData.append('name', profileName);
    formData.append('email', profileEmail);
    formData.append('phone', profilePhone);
    if (profileImage instanceof File) {
      formData.append('profileImage', profileImage);
    }
  
    try {
      const email = localStorage.getItem('userEmail');
      const response = await axios.post('https://upload-document-back-end.onrender.com/profile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'user-email': email,
        },
      });
  
      if (response.status === 200) {
        const updatedImageUrl = response.data.profileImageUrl;
        setProfileImage(updatedImageUrl); 
        alert('Profile updated successfully!');
        window.location.href = '/profile-update'; 
      } else {
        console.error('Failed to update profile:', response.statusText);
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };
  

  const handleBackClick = () => {
    navigate('/chat')
  }

  const getProfileImageSrc = () => {
    if (profileImage instanceof File) {
      return URL.createObjectURL(profileImage); 
    }
    return profileImage || '../Images/Ellipse 232.png'; 
  };
  return (
 <div>
     <div className='d-flex'>
    <div className='file_upload_container'>
      <div className='w-525 profile-upload-document'>
        <img className='mobile-menu' src='../Images/mobile-menu.png' />
        <p>UPLOAD DOCUMENT</p>
        <div className='mobile-p-5'>
          <input
            type="file"
     
            style={{ display: 'none' }}
            id="fileInput"
          />
          <div className='hover-upload-document'>
            <img
              src='../Images/uploadfile.png'
              alt="Attachment"
            
            />
            <p className='upload-document'>
              Upload Document
            </p>
          </div>
        </div>
      </div>
      <div className='w-525-bg'></div>
    </div>
    <div className='d-flex-j-c'>
      <div>
        <div className='d-flex mobile-d-flex profile'>
          <img onClick={handleBackClick} src='../Images/back.png' alt="PDF Icon" />
          <p>Profile</p>
        </div>
     
      </div>              
    
    </div>
  </div>
  <div className="search_container profile-conatiner">
  <div className='opportunity-details'>
      <div className='interested-clients-dashboard'>
      <div style={{ width: '100%' }}>
    
      <div className='d-profile-container'>
      
        <div className='profile-image-container'>
          <img
            src={getProfileImageSrc()}
            alt="Profile"
            className='profile-image'
          />
          <label htmlFor="profile-pic-upload" className='edit-icon'>
            <input type="file" id="profile-pic-upload" accept="image/*" onChange={handleImageChange} hidden />
            <img src='../Images/edit.png' alt="Edit" className='edit-icon' />
          </label>
        </div>

        <div className='profile-info'>
          <input
            className='input_w_500'
            type='text'
            placeholder='Name'
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
          />
          <input
            className='input_w_500'
            type='email'
            placeholder='Email'
            value={profileEmail}
            onChange={(e) => setProfileEmail(e.target.value)}
          />
      
        </div>
      </div>
      <div className='search-div-button'>
        <button onClick={handleProfileUpdate}>Update</button>
      </div>
       </div>
    </div>
    </div>
  </div>
 </div>
  )
}

export default Profile
