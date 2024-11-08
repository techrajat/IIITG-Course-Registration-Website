import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function FeedbackReview(props) {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState({});

  const getFaculty = async(semester) => {
    let data = await fetch(`http://127.0.0.1:5000/getfaculty/${semester}`, {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem('token')
      }
    });
    if (data.status === 200) {
      data = await data.json();
      setFaculty(data.faculty);
    }
  }

  const viewFeedback = (semester, faculty, course) => {
    localStorage.setItem('semester', semester)
    localStorage.setItem('faculty', faculty);
    localStorage.setItem('course', course);
    navigate('/viewfeedback');
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      props.setLogged(true);
      props.setAdminSession(true);
    }
    getFaculty();
    //eslint-disable-next-line
  }, []);

  return (
    <div>
      <div id="faculty-review" className="d-flex justify-content-center">
        <select className="form-select w-50 semselect" onChange={(event) => getFaculty(event.target.value)}>
          <option value="">Select semester</option>
          <option value="1">Semester: I</option>
          <option value="2">Semester: II</option>
          <option value="3">Semester: III</option>
          <option value="4">Semester: IV</option>
          <option value="5">Semester: V</option>
          <option value="6">Semester: VI</option>
          <option value="6">Semester: VII</option>
          <option value="6">Semester: VIII</option>
        </select>
      </div>
      <div className="table-container" id="course-wise-details">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">S. no.</th>
              <th scope="col">Name</th>
              <th scope="col">Course</th>
              <th scope="col">Group</th>
              <th scope="col">Feedback</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {Object.keys(faculty).length !== 0 && faculty.map((element, index) => {
              return <tr key={element.name}>
                <td>{index + 1}</td>
                <td>{element.name}</td>
                <td>{element.course}</td>
                <td>{element.group}</td>
                <td id="viewFeedbackLink" onClick={()=>viewFeedback(element.semester, element.name, element.course)}>View</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FeedbackReview;