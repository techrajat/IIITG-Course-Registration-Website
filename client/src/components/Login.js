import { React, useEffect } from 'react';

function Login(props) {
  const toggleReg = () => {
    document.querySelector(".login-form").style.display = "none";
    document.querySelector(".register-form").style.display = "block";
  };

  const toggleLogin = () => {
    document.querySelector(".register-form").style.display = "none";
    document.querySelector(".login-form").style.display = "block";
  };

  useEffect(()=>{
    if(props.adminSession){
      document.querySelector(".login-form .message").style.display = "none";
      document.querySelector(".form-check").style.top = "340px";
    }
    else{
      document.querySelector(".login-form .message").style.display = "block";
      document.querySelector(".form-check").style.top = "368px";
    }
  }, [props.adminSession]);

  return (
    <div className="login-page">
      <div className="form">
        <form className="register-form">
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email address" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm password" />
          <button>create</button>
          <p className="message">Already registered? <span onClick={toggleLogin}>Sign In</span></p>
        </form>
        <form className="login-form">
          <input type="email" placeholder="Email address" />
          <input type="password" placeholder="Password" />
          <button>login</button>
          <p className="message">Not registered? <span onClick={toggleReg}>Create an account</span></p>
        </form>
      </div>
      <div className="form-check form-switch switch-admin">
        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" onClick={props.toggleAdminSession} />
        <label className="form-check-label" for="flexSwitchCheckChecked">Login as admin</label>
      </div>
    </div>
  );
}

export default Login;
