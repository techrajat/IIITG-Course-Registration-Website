import { React, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login(props) {
  const navigate = useNavigate();

  const toggleReg = () => {
    document.querySelector(".login-form").style.display = "none";
    document.querySelector(".register-form").style.display = "block";
    document.querySelector(".switch-admin").style.display = "none";
    document.getElementById("warn").style.display = "none";
    document.getElementById("logWarn").style.display = "none";
  };

  const toggleLogin = () => {
    document.querySelector(".register-form").style.display = "none";
    document.querySelector(".login-form").style.display = "block";
    document.querySelector(".switch-admin").style.display = "block";
    document.getElementById("warn").style.display = "none";
    document.getElementById("logWarn").style.display = "none";
  };

  useEffect(() => {
    if (props.adminSession) {
      document.querySelector(".login-form .message").style.display = "none";
      document.querySelector(".form-check").style.top = "340px";
    }
    else {
      document.querySelector(".login-form .message").style.display = "block";
      document.querySelector(".form-check").style.top = "368px";
    }
  }, [props.adminSession]);

  const register = async (event) => {
    event.preventDefault();
    if(document.getElementById('password').value !== document.getElementById('cnfPass').value){
      document.getElementById("warn").style.display = "block";
      document.getElementById('warn').innerHTML = "Passwords do not match.";
      return;
    }
    let data = await fetch("http://127.0.0.1:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `name=${document.getElementById('name').value}&email=${document.getElementById('email').value}&password=${document.getElementById('password').value}`
    });
    if (data.status !== 200) {
      data = await data.json();
      data = data.error;
      document.getElementById("warn").style.display = "block";
      document.getElementById("warn").innerHTML = data;
    }
    else {
      document.getElementById("warn").style.display = "none";
      toggleLogin();
    }
  };

  const login = async (event) => {
    event.preventDefault();
    let data = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `email=${document.getElementById('logEmail').value}&password=${document.getElementById('logPass').value}&admin=${encodeURIComponent(props.adminSession)}`
    });
    if (data.status !== 200) {
      data = await data.json();
      data = data.error;
      document.getElementById("logWarn").style.display = "block";
      document.getElementById("logWarn").innerHTML = data;
    }
    else {
      document.getElementById("logWarn").style.display = "none";
      localStorage.setItem('token', data['token']);
      if(props.adminSession)
        navigate('/adminhero');
      else
        navigate('/studenthero');
    }
  };

  return (
    <div className="login-page">
      <div className="form">
        <form className="register-form" onSubmit={register}>
          <input type="text" id="name" placeholder="Name" required />
          <input type="email" id="email" placeholder="Email address" required />
          <input type="password" id="password" placeholder="Password" required />
          <input type="password" id="cnfPass" placeholder="Confirm password" required />
          <button>CREATE</button>
          <p className="message">Already registered? <span onClick={toggleLogin}>Sign In</span></p>
        </form>
        <form className="login-form" onSubmit={login}>
          <input type="email" placeholder="Email address" id="logEmail" required />
          <input type="password" placeholder="Password" id="logPass" required />
          <button>LOGIN</button>
          <p className="message">Not registered? <span onClick={toggleReg}>Create an account</span></p>
        </form>
      </div>
      <div className="form-check form-switch switch-admin">
        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" onClick={props.toggleAdminSession} />
        <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Login as admin</label>
      </div>
      <div id="warn"></div>
      <div id="logWarn"></div>
    </div>
  );
}

export default Login;
