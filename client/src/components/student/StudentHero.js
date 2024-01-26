import { React, useEffect } from 'react';
import '../../App.css';
import { useNavigate } from 'react-router-dom';

function StudentHero(props) {
  const navigate = useNavigate();

  const getUser = async () => {
    let data = await fetch("http://127.0.0.1:5000/getuser", {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem('token'),
        "Admin": props.adminSession
      },
    });
    if (data.status === 200) {
      data = await data.json();
      const name = data.user.name;
      document.getElementById('UserName').innerHTML = `Welcome ${name}`;
    }
  }

  const getPayStatus = async () => {
    let data = await fetch("http://127.0.0.1:5000/paystatus", {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem('token'),
        "Admin": props.adminSession
      },
    });
    if (data.status === 200) {
      document.getElementById('courseRegBtn').style.display = 'none';
      document.getElementById('allotted').style.display = 'block';
      document.getElementById('payStatus').style.display = 'block';
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      props.setLogged(true);
    }
    getUser();
    getPayStatus();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="studentRegOptions">
      <div><h1 id="UserName">Name</h1></div>
      <div className="options" id="courseRegBtn"><button className="option" onClick={() => { navigate('/regpage') }}>Course Registration</button></div>
      <div className="options" id="payStatus" style={{ display: "none" }}><button className="option" onClick={() => { navigate('/receipt') }}>View Payment Receipt</button></div>
      <div className="options" id="allotted" style={{ display: "none" }}><button className="option">View Allotted Courses</button></div>
    </div>
  );
}

export default StudentHero;