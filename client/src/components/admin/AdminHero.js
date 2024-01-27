import { React, useEffect } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';

function AdminHero(props) {
  useEffect(() => {
    if (localStorage.getItem('token')) {
      props.setLogged(true);
      props.setAdminSession(true);
    }
    //eslint-disable-next-line
  }, []);

  return (
    <div className="home">
      <div className="hero-section">
      <div>
        <h1>Course Registration</h1>
      </div>
      <div className="dropdown">
        <button className="dropbtn">Select Semester</button>
        <div className="dropdown-content">
          <Link to="/status" onClick={()=>{localStorage.setItem('semester', 1)}}>1st Semester</Link>
          <Link to="/status" onClick={()=>{localStorage.setItem('semester', 2)}}>2nd Semester</Link>
          <Link to="/status" onClick={()=>{localStorage.setItem('semester', 3)}}>3rd Semester</Link>
          <Link to="/status" onClick={()=>{localStorage.setItem('semester', 4)}}>4th Semester</Link>
          <Link to="/status" onClick={()=>{localStorage.setItem('semester', 5)}}>5th Semester</Link>
          <Link to="/status" onClick={()=>{localStorage.setItem('semester', 6)}}>6th Semester</Link>
          <Link to="/status" onClick={()=>{localStorage.setItem('semester', 7)}}>7th Semester</Link>
          <Link to="/status" onClick={()=>{localStorage.setItem('semester', 8)}}>8th Semester</Link>
        </div>
      </div>
    </div>
    </div>
  );
}

export default AdminHero;