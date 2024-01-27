import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

function Login(props) {
  const navigate = useNavigate();

  const googleSignIn = useGoogleLogin({
    onSuccess: (codeResponse) => getUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  const getUser = async (codeResponse) => {
    const token = codeResponse.access_token;
    if (token) {
      localStorage.setItem('token', token);
      let data = await fetch(`http://127.0.0.1:5000/getuser`, {
        method: "GET",
        headers: {
          "Authorization": token
        }
      });
      if (data.status === 200) {
        data = await data.json();
        const user = data.user;
        localStorage.setItem('user', JSON.stringify(user));
        props.setLogged(true);
        if ('admin' in user) {
          navigate('/adminhero');
          props.setAdminSession(true);
        }
        else {
          navigate('/studenthero');
        }
      }
      else{
        data = await data.json();
        document.getElementById('warn').innerHTML = data.error;
      }
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <h1>Sign in with Google</h1>
        <button type="button" className="login-with-google-btn" onClick={() => googleSignIn()}>
          Sign in with Google
        </button>
        <p id="warn"></p>
      </div>
    </div>
  );
}

export default Login;