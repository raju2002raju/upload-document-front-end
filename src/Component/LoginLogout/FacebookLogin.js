import React, { useEffect, useState } from 'react';

const FacebookAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Load the Facebook SDK asynchronously
    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : '1256985205736903', // Replace with your Facebook App ID
        cookie     : true,
        xfbml      : true,
        version    : 'v12.0'
      });
      
      window.FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          setIsLoggedIn(true);
          fetchUserData();
        }
      });
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  const handleLogin = () => {
    window.FB.login(function(response) {
      if (response.authResponse) {
        setIsLoggedIn(true);
        fetchUserData();
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {scope: 'public_profile,email'});
  };

  const handleLogout = () => {
    window.FB.logout(function(response) {
      setIsLoggedIn(false);
      setUserData(null);
    });
  };

  const fetchUserData = () => {
    window.FB.api('/me', {fields: 'name,email'}, function(response) {
      setUserData(response);
    });
  };

  return (
    <div>
      {!isLoggedIn ? (
        <button onClick={handleLogin} className='facebook-login'> <img src='../Images/facebook_ic.png' /> Sign In with Facebook</button>
      ) : (
        <div >
          <button onClick={handleLogout}>Logout</button>
          {userData && (
            <div>
              <p>Welcome, {userData.name}!</p> 
              <p>Email: {userData.email}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FacebookAuth;