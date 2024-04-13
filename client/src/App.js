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

  return (
    <div>
      <Router>
        <Navbar logged={logged} setLogged={setLogged} adminSession={adminSession} setAdminSession={setAdminSession} financeSession={financeSession} setFinanceSession={setFinanceSession} />
        <Routes>
          <Route exact path='/' element={<Login setLogged={setLogged} setAdminSession={setAdminSession} setFinanceSession={setFinanceSession} />}></Route>
          <Route exact path='/adminhero' element={<AdminHero setLogged={setLogged} setAdminSession={setAdminSession} />}></Route>
          <Route exact path='/status' element={<Status setLogged={setLogged} setAdminSession={setAdminSession} />}></Route>
          <Route exact path='/coursewise' element={<CourseWise setLogged={setLogged} setAdminSession={setAdminSession} />}></Route>
          <Route exact path='/financehero' element={<FinanceHero setLogged={setLogged} setFinanceSession={setFinanceSession} />}></Route>
          <Route exact path='/verifypayments' element={<VerifyPayments setLogged={setLogged} setFinanceSession={setFinanceSession} />}></Route>
          <Route exact path='/verified' element={<VerifiedPayments setLogged={setLogged} setFinanceSession={setFinanceSession} />}></Route>
          <Route exact path='/studenthero' element={<StudentHero setLogged={setLogged} />}></Route>
          <Route exact path='/electives' element={<Electives setLogged={setLogged} />}></Route>
          <Route exact path='/regpage' element={<RegPage setLogged={setLogged} />}></Route>
          <Route exact path='/payment' element={<Payment setLogged={setLogged} />}></Route>
          <Route exact path='/receipt' element={<Receipt setLogged={setLogged} />}></Route>
          <Route exact path='/uploadreceipt' element={<UploadReceipt setLogged={setLogged} />}></Route>
          <Route exact path='/changeelectives' element={<ChangeElectives setLogged={setLogged} />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;