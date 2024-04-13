import { React, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import AdminHero from './components/admin/AdminHero';
import Status from './components/admin/Status';
import CourseWise from './components/admin/CourseWise';
import FinanceHero from './components/finance/FinanceHero';
import VerifyPayments from './components/finance/VerifyPayments';
import VerifiedPayments from './components/finance/VerifiedPayments';
import StudentHero from './components/student/StudentHero';
import Electives from './components/student/Electives';
import RegPage from './components/student/RegPage';
import Payment from './components/student/Payment';
import Receipt from './components/student/Receipt';
import UploadReceipt from './components/student/UploadReceipt';
import ChangeElectives from './components/student/ChangeElectives';

function App() {
  const [logged, setLogged] = useState(false);
  const [adminSession, setAdminSession] = useState(false);
  const [financeSession, setFinanceSession] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  const logout = () => {
    setLogged(false);
    setAdminSession(false);
    setFinanceSession(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('semester');
    localStorage.removeItem('branch');
  }

  return (
    <div>
      <Router>
        <Navbar logged={logged} setLogged={setLogged} adminSession={adminSession} setAdminSession={setAdminSession} financeSession={financeSession} setFinanceSession={setFinanceSession} logout={logout} setLogoutModal={setLogoutModal} />
        <Routes>
          <Route exact path='/' element={<Login setLogged={setLogged} setAdminSession={setAdminSession} setFinanceSession={setFinanceSession} logout={logout} logoutModal={logoutModal} setLogoutModal={setLogoutModal} />}></Route>
          <Route exact path='/adminhero' element={<AdminHero setLogged={setLogged} setAdminSession={setAdminSession} logout={logout} setLogoutModal={setLogoutModal} />}></Route>
          <Route exact path='/status' element={<Status setLogged={setLogged} setAdminSession={setAdminSession} logout={logout} setLogoutModal={setLogoutModal} />}></Route>
          <Route exact path='/coursewise' element={<CourseWise setLogged={setLogged} setAdminSession={setAdminSession} logout={logout} setLogoutModal={setLogoutModal} />}></Route>
          <Route exact path='/financehero' element={<FinanceHero setLogged={setLogged} setFinanceSession={setFinanceSession} logout={logout} setLogoutModal={setLogoutModal} />}></Route>
          <Route exact path='/verifypayments' element={<VerifyPayments setLogged={setLogged} setFinanceSession={setFinanceSession} logout={logout} setLogoutModal={setLogoutModal} />}></Route>
          <Route exact path='/verified' element={<VerifiedPayments setLogged={setLogged} setFinanceSession={setFinanceSession} logout={logout} setLogoutModal={setLogoutModal} />}></Route>
          <Route exact path='/studenthero' element={<StudentHero setLogged={setLogged} logout={logout} setLogoutModal={setLogoutModal} />}></Route>
          <Route exact path='/electives' element={<Electives setLogged={setLogged} logout={logout} setLogoutModal={setLogoutModal} />}></Route>
          <Route exact path='/regpage' element={<RegPage setLogged={setLogged} logout={logout} setLogoutModal={setLogoutModal} />}></Route>
          <Route exact path='/payment' element={<Payment setLogged={setLogged} logout={logout} setLogoutModal={setLogoutModal} />}></Route>
          <Route exact path='/receipt' element={<Receipt setLogged={setLogged} logout={logout} setLogoutModal={setLogoutModal} />}></Route>
          <Route exact path='/uploadreceipt' element={<UploadReceipt setLogged={setLogged} logout={logout} setLogoutModal={setLogoutModal} />}></Route>
          <Route exact path='/changeelectives' element={<ChangeElectives setLogged={setLogged} logout={logout} setLogoutModal={setLogoutModal} />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;