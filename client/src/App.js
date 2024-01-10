import { React, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import AdminHero from './components/admin/AdminHero';
import Status from './components/admin/Status';
import StudentHero from './components/student/StudentHero';

function App() {
  const [sem, setSem] = useState(0);
  const [adminSession, setAdminSession] = useState(0);
  const toggleAdminSession=()=>{
    (adminSession === 0) ? setAdminSession(1) : setAdminSession(0);
  };

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Login adminSession={adminSession} toggleAdminSession={toggleAdminSession} />}></Route>
          <Route exact path='/adminhero' element={<AdminHero setSem={setSem} />}></Route>
          <Route exact path='/studenthero' element={<StudentHero setSem={setSem} />}></Route>
          <Route exact path='/status' element={<Status sem={sem} adminSession={adminSession} />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;