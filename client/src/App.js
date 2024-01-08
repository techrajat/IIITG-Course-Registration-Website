import { React, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Status from './components/admin/Status';

function App() {
  const [sem, setSem] = useState(0);

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Hero setSem={setSem} />}></Route>
          <Route exact path='/status' element={<Status sem={sem} />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;