import { React, useEffect } from 'react';
import '../../App.css';
import { useNavigate } from 'react-router-dom';

function StudentHero(props) {
  const navigate = useNavigate();

  const getPayStatus = async () => {
    let data = await fetch("http://127.0.0.1:5000/paystatus", {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem('token')
      },
    });
    if (data.status === 200) {
      document.getElementById('courseRegBtn').style.display = 'none';
      document.getElementById('allotted').style.display = 'block';
      document.getElementById('payStatus').style.display = 'block';
    }
    if (data.status === 400) {
      document.getElementById('courseRegBtn').style.display = 'none';
      document.getElementById('underVerification').style.display = 'block';
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      props.setLogged(true);
    }
    let user = localStorage.getItem('user');
    user = JSON.parse(user)
    const name = user.name;
    document.getElementById('UserName').innerHTML = `Welcome ${name}`;
    getPayStatus();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="studentRegOptions">
      <div><h1 id="UserName">Welcome</h1></div>
      <div className="options" id="courseRegBtn"><button className="option" onClick={() => { navigate('/regpage') }}>Course Registration</button></div>
      <div className="options" id="payStatus" style={{ display: "none" }}><button className="option" onClick={() => { navigate('/receipt') }}>View Payment Receipt</button></div>
      <div className="options" id="allotted" style={{ display: "none" }}><button className="option">View Allotted Courses</button></div>
      <div className="options" id="underVerification" style={{ display: "none" }}>Payment status under verification...</div>
    </div>
  );
}

export default StudentHero;