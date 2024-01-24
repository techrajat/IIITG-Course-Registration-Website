import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RegPage(props) {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [course, setCourse] = useState({});

  const getCourse = async () => {
    const details = JSON.parse(localStorage.getItem('details'));
    let data = await fetch("http://127.0.0.1:5000/getcourse", {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('token'),
        "Admin": props.adminSession
      },
      body: `sem=${encodeURIComponent(details.semester + 1)}&branch=${encodeURIComponent(details.branch)}`
    });
    if (data.status === 200) {
      data = await data.json();
      setCourse(data.course);
    }
  };

  useEffect(()=>{
    setUser(JSON.parse(localStorage.getItem('details')));
    getCourse();
    //eslint-disable-next-line
  }, []);

  const payment=(event)=>{
    event.preventDefault();
    navigate('/payment');
  };

  return (
      <div className="reg-form-container">
          <form id="regForm" onSubmit={payment}>
              <label htmlFor="name"><span>*</span> Name:</label>
              <input type="text" id="name" name="name" value={(user.name) ? user.name : ""} disabled />
              <label htmlFor="email"><span>*</span> Email:</label>
              <input type="email" id="email" name="email" value={(user.email) ? user.email : ""} disabled />
              <label htmlFor="roll"><span>*</span> Roll no:</label>
              <input type="text" id="roll" name="roll"  value={(user.roll_number) ? user.roll_number : ""} disabled />
              <label htmlFor="sem"><span>*</span> Registering for semester:</label>
              <input type="text" id="sem" name="sem" value={!isNaN(user.semester) ? user.semester + 1 : ''} disabled />
              <label htmlFor="course"><span>*</span> Mandatory Courses:</label>
              {Object.keys(course).length !== 0 && course.courses.map((element, index)=>{
                return <div className="form-check" key={index}>
                <input className="form-check-input" type="checkbox" value={element.code} checked onChange={()=>{}} />
                <label className="form-check-label">
                  {element.code} ({element.name})
                </label>
              </div>
              })}
              {Object.keys(course).length !== 0 && course.electives.map((element, index)=>{
                return <div className="elective" key={index}>
                  <label htmlFor="course"><span>*</span> Select elective/project:</label>
                  <select id="course" name="course" required>
                    <option value="">Select an option</option>
                    {element.map((e, i)=>{
                      return <option key={i} value={e.code}>{e.code} ({e.name})</option>
                    })}
                  </select>
                </div>
              })}
              <input type="submit" value="Make Payment" />
          </form>
      </div>
  );
}

export default RegPage;