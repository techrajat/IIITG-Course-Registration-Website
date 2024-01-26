import { React, useEffect } from 'react';
import '../../App.css';
import { useNavigate } from 'react-router-dom';

function StudentHero(props) {
  const navigate = useNavigate();

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
      const name = data.user.name;
      document.getElementById('UserName').innerHTML = `Welcome ${name}`;
    }
  }

  useEffect(()=>{
    if(localStorage.getItem('token')){
      props.setLogged(true);
    }
    getName();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="studentRegOptions">
        <div><h1 id="UserName">Name</h1></div>
        <div className="options"><button className="option" onClick={()=>{navigate('/regpage')}}>Course Registration</button></div>
    </div>
  );
}

export default StudentHero;