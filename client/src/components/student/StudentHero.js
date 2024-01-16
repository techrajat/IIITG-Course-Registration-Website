import { React, useEffect } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';

function StudentHero() {
  const getName=async()=>{
    let data = await fetch("http://127.0.0.1:5000/getuser", {
      method: "GET",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('token')
      },
    });
    if(data.status === 200){
      data = await data.json();
      const name = data.name;
      document.getElementById('UserName').innerHTML = `Welcome ${name}`;
    }
  }

  useEffect(()=>{
    getName();
  }, []);

  return (
    <div className="studentRegOptions">
        <div><h1 id="UserName">Name</h1></div>
        <div className="options"><Link to="/regpage" className="option">Course Registration</Link></div>
    </div>
  );
}

export default StudentHero;