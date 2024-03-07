import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

function RegPage(props) {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [course, setCourse] = useState({});
  const [load, setLoad] = useState(true);

  const getCourse = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    let data = await fetch("http://127.0.0.1:5000/getcourse", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('token')
      },
      body: `semester=${encodeURIComponent(user.semester + 1)}&branch=${encodeURIComponent(user.branch)}`
    });
    if (data.status === 200) {
      data = await data.json();
      setCourse(data.course);
      setLoad(false);
      if (document.getElementById('elective-preference')) {
        document.getElementById('elective-preference').style.display = 'block';
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      props.setLogged(true);
    }
    setUser(JSON.parse(localStorage.getItem('user')));
    getCourse();
    //eslint-disable-next-line
  }, []);

  const validateForm = () => {
    const selectedElectives = document.querySelectorAll('.selectedElectives');
    let obj = {};
    for (let element of selectedElectives) {
      if (obj.hasOwnProperty(element.value)) {
        return false;
      }
      obj[element.value] = 1;
    }
    return true;
  };

  const submitRegForm = (event) => {
    event.preventDefault();
    const selectedElectives = document.querySelectorAll('.selectedElectives');
    let electives = [];
    let index = 0;
    course.electives.forEach((element) => {
      let order = [];
      element.forEach((e, i) => {
        let item = selectedElectives[index].value.split('::');
        order.push({ "preference_order": i + 1, "code": item[0], "name": item[1] });
        index++;
      });
      electives.push(order);
    });
    if (validateForm()) {
      localStorage.setItem('selectedElectives', JSON.stringify(electives));
      navigate('/payment');
    }
    else {
      document.getElementById('sameElectiveWarn').style.display = 'block';
    }
  };

  return (
    <div className="reg-form-container">
      <form id="regForm" onSubmit={submitRegForm}>
        <label htmlFor="name"><span>*</span> Name:</label>
        <input type="text" id="name" name="name" value={(user.name) ? user.name : ""} disabled />
        <label htmlFor="email"><span>*</span> Email:</label>
        <input type="email" id="email" name="email" value={(user.email) ? user.email : ""} disabled />
        <label htmlFor="roll"><span>*</span> Roll no:</label>
        <input type="text" id="roll" name="roll" value={(user.roll_number) ? user.roll_number : ""} disabled />
        <label htmlFor="sem"><span>*</span> Registering for semester:</label>
        <input type="text" id="sem" name="sem" value={!isNaN(user.semester) ? user.semester + 1 : ''} disabled />
        <label htmlFor="course"><span>*</span> Mandatory Courses:</label>
        {Object.keys(course).length !== 0 && course.courses.map((element, index) => {
          return <div className="form-check" key={index}>
            <input className="form-check-input" type="checkbox" value={element.code} checked onChange={() => { }} />
            <label className="form-check-label">
              {element.code} ({element.name})
            </label>
          </div>
        })}
        <div style={{ 'textAlign': 'center' }}><ClipLoader loading={load} size={20} /></div>
        <div id="elective-preference">
          {Object.keys(course).length !== 0 && course.electives.map((element, index) => {
            return <div className="elective" key={index}>
              <label htmlFor="course"><span>*</span> Select preference order for elective/project {index + 1}:</label>
              {element.map((ele, ind) => {
                return <select id={`select${index}${ind}`} className="selectedElectives" name="course" key={ind} required>
                  <option value="">Select an option</option>
                  {element.map((e, i) => {
                    return <option key={i} value={`${e.code}::${e.name}`}>{e.code} ({e.name})</option>
                  })}
                </select>
              })}
            </div>
          })}
          <div style={{ 'textAlign': 'center' }}><input type="submit" value="Register and Pay" /></div>
        </div>
        <div id="sameElectiveWarn" style={{ display: 'none' }}><p>You cannot choose the same elective multiple times.</p></div>
      </form>
    </div>
  );
}

export default RegPage;