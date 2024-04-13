import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

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
          props.setAdminSession(true);
          navigate('/adminhero');
        }
        else if('finance' in  user) {
          props.setFinanceSession(true);
          navigate('/financehero');
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

  let subtitle;
  function afterOpenModal() {
    subtitle.style.color = 'rgb(78, 65, 65)';
    subtitle.style.textDecorationLine = 'underline';
  }

  return (
    <div className="login-page">
      <Modal
        isOpen={props.logoutModal}
        onAfterOpen={afterOpenModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Attention"
        id={'custom-modal'}
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Attention</h2>
        <button onClick={()=>{props.setLogoutModal(false)}} id="logoutModalClose"><i className="fa-solid fa-xmark"></i></button>
        <p className="modalMessage">You have been logged out. Please login again.</p>
      </Modal>
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