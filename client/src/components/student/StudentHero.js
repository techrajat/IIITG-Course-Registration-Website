import React from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';

function StudentHero(props) {
  return (
    <div className="home">
      <div className="hero-section">
      <div>
        <h1>Course Registration</h1>
      </div>
      <div className="dropdown">
        <button className="dropbtn">Select Semester</button>
        <div className="dropdown-content">
          <Link to="/status" onClick={()=>{props.setSem(1)}}>1st Semester</Link>
          <Link to="/status" onClick={()=>{props.setSem(2)}}>2nd Semester</Link>
          <Link to="/status" onClick={()=>{props.setSem(3)}}>3rd Semester</Link>
          <Link to="/status" onClick={()=>{props.setSem(4)}}>4th Semester</Link>
          <Link to="/status" onClick={()=>{props.setSem(5)}}>5th Semester</Link>
          <Link to="/status" onClick={()=>{props.setSem(6)}}>6th Semester</Link>
          <Link to="/status" onClick={()=>{props.setSem(7)}}>7th Semester</Link>
          <Link to="/status" onClick={()=>{props.setSem(8)}}>8th Semester</Link>
        </div>
      </div>
    </div>
    </div>
  );
}

export default StudentHero;