import { React, useState, useEffect } from 'react';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

function Navbar(props) {
  const navigate = useNavigate();

  const [homeLink, setHomeLink] = useState("/");
  const [name, setName] = useState("");

  useEffect(() => {
    if (props.logged) {
      let user = localStorage.getItem('user');
      user = JSON.parse(user)
      setName(user.name);
      if (props.adminSession) {
        setHomeLink("/adminhero");
      }
      else if(props.financeSession) {
        setHomeLink("/financehero");
      }
      else {
        setHomeLink("/studenthero");
      }
    }
    //eslint-disable-next-line
  }, [props.logged]);

  const log_out = () => {
    googleLogout();
    props.logout();
    props.setLogoutModal(true);
    navigate("/");
  }

  return (
    <div>
      <header className="head">
        <nav className="navbar navbar-expand-lg bg-dark fixed-top" data-bs-theme="dark">
          <div className="college-name">IIITG Course Registration</div>
          <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {props.logged === true && <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to={homeLink}><i className="fa-solid fa-house"></i> Home</Link>
                </li>}
                {props.logged === true && props.adminSession === false && props.financeSession === false  && <li className="nav-item">
                  <Link className="nav-link" to="/electives"><i className="fa-solid fa-book"></i> Select Electives</Link>
                </li>}
                {props.logged === true && props.adminSession === false && props.financeSession === false  && <li className="nav-item">
                  <Link className="nav-link" to="/feedback"><i className="fa-solid fa-comment"></i> Feedback</Link>
                </li>}
                {props.logged === true && <li className="nav-item dropdown" id="logged">
                  <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="fa-solid fa-user"></i> {name ? name : ""}
                  </a>
                  <ul className="dropdown-menu">
                    <li id="logoutBtn" className="dropdown-item" onClick={log_out}>Logout</li>
                  </ul>
                </li>}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;