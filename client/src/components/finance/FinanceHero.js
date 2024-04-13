import { React, useEffect } from 'react';
import '../../App.css';
import { useNavigate } from 'react-router-dom';

function FinanceHero(props) {
  const navigate = useNavigate();
  
  const saveDetails = (event) => {
    event.preventDefault();
    const semester = document.getElementById('semester').value;
    localStorage.setItem('semester', semester);
    navigate('/verifypayments');
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      props.setLogged(true);
      props.setFinanceSession(true);
    }
    //eslint-disable-next-line
  }, []);

  return (
    <div className="home">
      <div><h1>Payment Verification</h1></div>
      <form onSubmit={saveDetails}>
        <select id="semester" className="form-select adminHeroSelect" aria-label="Default select example" required>
          <option value="">Select semester</option>
          <option value="1">1st Semester</option>
          <option value="2">2nd Semester</option>
          <option value="3">3rd Semester</option>
          <option value="4">4th Semester</option>
          <option value="5">5th Semester</option>
          <option value="6">6th Semester</option>
          <option value="7">7th Semester</option>
          <option value="8">8th Semester</option>
        </select>
        <button type="submit" className="btn btn-primary my-2">Proceed</button>
      </form>
    </div>
  );
}

export default FinanceHero;