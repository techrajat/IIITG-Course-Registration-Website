import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

function Electives(props) {
  const navigate = useNavigate();

  const [course, setCourse] = useState({});
  const [load, setLoad] = useState(true);
  const [selectedElectives, setSelectedElectives] = useState([]);

  const checkSelectedElectives = async () => {
    let data = await fetch("http://127.0.0.1:5000/viewselectedelectives", {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem('token')
      },
    });
    if (data.status === 200) {
      data = await data.json();
      const selectedElectives = data.electives;
      if (selectedElectives !== null) {
        setSelectedElectives(selectedElectives);
        if(document.getElementById('selected-electives'))
          document.getElementById('selected-electives').style.display = 'block';
        if(document.getElementById('electivesForm'))
          document.getElementById('electivesForm').style.display = 'none';
      }
      else {
        getCourse();
      }
    }
  }

  const getCourse = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    let data1 = await fetch("http://127.0.0.1:5000/getcourse", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('token')
      },
      body: `semester=${encodeURIComponent(user.semester + 1)}&branch=${encodeURIComponent(user.branch)}`
    });
    let data2 = await fetch("http://127.0.0.1:5000/getcourse", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('token')
      },
      body: `semester=${encodeURIComponent(user.semester + 1)}&branch=${encodeURIComponent("All")}`
    });
    if (data1.status === 200 && data2.status === 200) {
      data1 = await data1.json();
      data2 = await data2.json();
      let data = data1.course;
      if (data2.course.courses !== null) {
        data.courses = data.courses.concat(data2.course.courses);
      }
      if (data2.course.electives !== null) {
        data.electives = data.electives.concat(data2.course.electives);
      }
      setCourse(data);
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
    checkSelectedElectives();
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

  const submitElectivesForm = async (event) => {
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
      const selectElective = await fetch(`http://127.0.0.1:5000/selectelectives`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": localStorage.getItem('token')
        },
        body: `selectedElectives=${encodeURIComponent(JSON.stringify(electives))}`
      });
      if (selectElective.status === 200) {
        navigate('/studenthero');
      }
    }
    else {
      document.getElementById('sameElectiveWarn').style.display = 'block';
    }
  };

  return (
    <div className="electives-container">
      <div id="selected-electives">
        <h4 className="text-center mb-4">Electives already selected !!</h4>
        {selectedElectives !== null && selectedElectives.map((element, index) => {
          return <div key={index}>
            <label><b>Elective/Project {index + 1}</b></label>
            {element.map((ele, ind) => {
              return <div className="my-3" key={ind}>
                <p className="my-1">{ind+1}. {ele.code}: {ele.name}</p>
              </div>
            })}
          </div>
        })}
      </div>
      <form id="electivesForm" onSubmit={submitElectivesForm}>
        <div style={{ 'textAlign': 'center' }}><ClipLoader loading={load} size={20} /></div>
        <div id="elective-preference">
          {Object.keys(course).length !== 0 && course.electives !== null && course.electives.map((element, index) => {
            return <div className="elective" key={index}>
              <label htmlFor="course"><span>*</span> Select preference order for elective/project {index + 1}:</label>
              {element.map((ele, ind) => {
                return <select id={`select${index}${ind}`} className="selectedElectives" name="course" key={ind} required>
                  <option value="">Preference {ind + 1}</option>
                  {element.map((e, i) => {
                    return <option key={i} value={`${e.code}::${e.name}`}>{e.code} ({e.name})</option>
                  })}
                </select>
              })}
            </div>
          })}
          <div style={{ 'textAlign': 'center' }}><input type="submit" value="Select Electives" /></div>
        </div>
        <div id="sameElectiveWarn" style={{ display: 'none' }}><p>You cannot choose the same elective multiple times.</p></div>
      </form>
    </div>
  );
}

export default Electives;