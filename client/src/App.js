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
import UploadReceipt from './components/student/UploadReceipt';

function App() {
  const [adminSession, setAdminSession] = useState(false);
  const [logged, setLogged] = useState(false);

  return (
    <div>
      <Router>
        <Navbar logged={logged} setLogged={setLogged} adminSession={adminSession} setAdminSession={setAdminSession} />
        <Routes>
          <Route exact path='/' element={<Login setLogged={setLogged} setAdminSession={setAdminSession} />}></Route>
          <Route exact path='/adminhero' element={<AdminHero setLogged={setLogged} setAdminSession={setAdminSession} />}></Route>
          <Route exact path='/status' element={<Status setLogged={setLogged} setAdminSession={setAdminSession} />}></Route>
          <Route exact path='/studenthero' element={<StudentHero setLogged={setLogged} />}></Route>
          <Route exact path='/regpage' element={<RegPage setLogged={setLogged} />}></Route>
          <Route exact path='/payment' element={<Payment setLogged={setLogged} />}></Route>
          <Route exact path='/receipt' element={<Receipt setLogged={setLogged} />}></Route>
          <Route exact path='/uploadreceipt' element={<UploadReceipt setLogged={setLogged} />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;