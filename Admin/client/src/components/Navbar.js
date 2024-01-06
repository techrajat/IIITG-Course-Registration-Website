import React from 'react';
import '../App.css';

function Navbar() {
  return (
    <div>
      <header className="head">
        <div className="college-name">Admin</div>
        <nav>
          <a href="/">Home</a>
          <a href="/">Contact</a>
          <a href="/">About</a>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;