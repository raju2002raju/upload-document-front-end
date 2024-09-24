import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const LoginButtonGoogle = () => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try {
        console.log('Token Response:', tokenResponse);

        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            'Authorization': `Bearer ${tokenResponse.access_token}`
          }
        });
        
        const userInfo = await userInfoResponse.json();
        console.log('User Info:', userInfo);

        localStorage.setItem('userEmail', userInfo.email);
        const payload = {
          name: userInfo.name,
          email: userInfo.email,
          profileImage: userInfo.picture 
        };

        const signupResponse = await fetch('https://upload-document-back-end.onrender.com/auth/login-with-google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await signupResponse.json();
        if (result.success) {
          localStorage.setItem('user', JSON.stringify(userInfo));
          navigate('/dashboard');
        } else {
          console.error('Signup failed:', result.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    onError: errorResponse => console.error('Login Failed:', errorResponse),
  });

  return (
    <div>
      <button onClick={() => login()} className='google-login'>
        <img src='./Images/google_ic.png' alt="Google Icon" />
        Continue  with Google
      </button>
    </div>
  );
};

export default LoginButtonGoogle;
