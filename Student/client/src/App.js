import './App.css';

function App() {
  return (
    <div className="studentHome">
      <header className="head">
        <div className="college-name">Student</div>
        <nav>
          <a href="/">Home</a>
          <a href="/">Contact</a>
          <a href="/">About</a>
        </nav>
      </header>

      <div className="hero-section">
        <div>
          <h1>Course Registration</h1>
        </div>
        <div className="dropdown">
          <button className="dropbtn">Select Semester</button>
          <div className="dropdown-content">
            <a href="/">1st Semester</a>
            <a href="/">2nd Semester</a>
            <a href="/">3rd Semester</a>
            <a href="/">4th Semester</a>
            <a href="/">5th Semester</a>
            <a href="/">6th Semester</a>
            <a href="/">7th Semester</a>
            <a href="/">8th Semester</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
