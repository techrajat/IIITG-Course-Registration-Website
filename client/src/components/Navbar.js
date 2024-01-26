import { React, useState, useEffect } from 'react';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';

function Navbar(props) {
  const navigate = useNavigate();

  const [homeLink, setHomeLink] = useState("/");
  const [name, setName] = useState("");

  const getUser = async () => {
    let data = await fetch("http://127.0.0.1:5000/getuser", {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem('token'),
        "Admin": props.adminSession
      },
    });
    if (data.status === 200) {
      data = await data.json();
      localStorage.setItem("details", JSON.stringify(data.user));
      setName(data.user.name);
    }
  }

  useEffect(() => {
    if (props.logged) {
      getUser();
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
    localStorage.removeItem('order_id');
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