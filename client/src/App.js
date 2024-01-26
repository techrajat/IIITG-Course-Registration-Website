import { React, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import AdminHero from './components/admin/AdminHero';
import Status from './components/admin/Status';
import StudentHero from './components/student/StudentHero';
import RegPage from './components/student/RegPage';
import Payment from './components/student/Payment';
import Receipt from './components/student/Receipt';

function App() {
  const [sem, setSem] = useState(0);
  const [adminSession, setAdminSession] = useState(0);
  const toggleAdminSession=()=>{
    (adminSession === 0) ? setAdminSession(1) : setAdminSession(0);
  };
  const [logged, setLogged] = useState(false);

  return (
    <div>
      <Router>
        <Navbar logged={logged} setLogged={setLogged} adminSession={adminSession} setAdminSession={setAdminSession} />
        <Routes>
          <Route exact path='/' element={<Login adminSession={adminSession} toggleAdminSession={toggleAdminSession} setLogged={setLogged} />}></Route>
          <Route exact path='/adminhero' element={<AdminHero setSem={setSem} />}></Route>
          <Route exact path='/status' element={<Status sem={sem} adminSession={adminSession} />}></Route>
          <Route exact path='/studenthero' element={<StudentHero setLogged={setLogged} adminSession={adminSession} />}></Route>
          <Route exact path='/regpage' element={<RegPage setLogged={setLogged} adminSession={adminSession} />}></Route>
          <Route exact path='/payment' element={<Payment setLogged={setLogged} adminSession={adminSession} />}></Route>
          <Route exact path='/receipt' element={<Receipt setLogged={setLogged} adminSession={adminSession} />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;