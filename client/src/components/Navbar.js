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
        <div className="college-name">IIITG Course Registration</div>
        <nav>
          <Link to={homeLink}><i className="fa-solid fa-house"></i> Home</Link>
          <Link to="/"><i className="fa-solid fa-phone"></i> Contact</Link>
          {props.logged === true && <div className="dropdown" id="logged">
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <button className="btn btn-dark dropdown-toggle bg-transparent border-0" data-bs-toggle="dropdown" aria-expanded="false" id="username">{name ? name : ""}</button>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li><Link className="dropdown-item" to="/" onClick={logout}>Logout</Link></li>
                </ul>
              </li>
            </ul>
          </div>}
        </nav>
      </header>
    </div>
  );
}

export default Navbar;