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
      if (!props.adminSession) {
        setHomeLink("/studenthero");
      }
      else {
        setHomeLink("/adminhero");
      }
    }
    //eslint-disable-next-line
  }, [props.logged]);

  const logout = () => {
    setHomeLink("/");
    props.setLogged(false);
    props.setAdminSession(0);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    googleLogout();
    navigate("/");
  }

  return (
    <div>
      <header className="head">
        <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
          <div className="college-name">IIITG Course Registration</div>
          <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to={homeLink}><i className="fa-solid fa-house"></i> Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/"><i className="fa-solid fa-phone"></i> Contact</Link>
                </li>
                {props.logged === true && <li className="nav-item dropdown" id="logged">
                  <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {name ? name : ""}
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/" onClick={logout}>Logout</Link></li>
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