import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div>
      <header className="head">
        <div className="college-name">Admin</div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/">Contact</Link>
          <Link to="/">About</Link>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;