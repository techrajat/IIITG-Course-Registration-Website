import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Feedback(props) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState({});
  const [course, setCourse] = useState(null);
  const [faculty, setFaculty] = useState(null);

  const getCourse = async () => {
    let data = await fetch("http://127.0.0.1:5000/feedbackdetails", {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem('token')
      }
    });
    if (data.status === 200) {
      data = await data.json();
      setCourses(data.courses);
      const firstCourse = Object.entries(data.courses)[0];
      const [course, faculty] = firstCourse;
      setCourse(course);
      setFaculty(faculty);
    }
    else {
      props.logout();
      props.setLogoutModal(true);
      navigate("/");
    }
  };

  const toggleCourses = (course, faculty, id) => {
    setCourse(course);
    setFaculty(faculty);
    const radioButtons = document.querySelectorAll('.radio-input');
    radioButtons.forEach((input) => {
      input.checked = false;
    });
    const textareas = document.querySelectorAll('.textarea-input');
    textareas.forEach((textarea) => {
      textarea.value = '';
    });
    if (course.includes("Lab")) {
      document.getElementById('labFeedback').style.display = 'block';
      document.getElementById('theoryFeedback').style.display = 'none';
    }
    else {
      document.getElementById('theoryFeedback').style.display = 'block';
      document.getElementById('labFeedback').style.display = 'none';
    }
    document.querySelectorAll('.course-item').forEach(element => {
      element.removeAttribute('style');
    });
    document.getElementById(id).style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
  }

  const submitFeedback = async (event) => {
    event.preventDefault();
    const feedback = {};
    const questions = document.querySelectorAll('.question');
    questions.forEach(questionElement => {
      const label = questionElement.querySelector('.label-text');
      const name = questionElement.querySelector('input[type="radio"]').name;
      const selectedOption = questionElement.querySelector(`input[name="${name}"]:checked`);
      if (selectedOption) {
        feedback[label.textContent] = selectedOption.value;
      }
    });
    const comments = document.getElementById('comments').value;
    if (comments) {
      feedback['additional_comments'] = comments;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    const submit = await fetch(`http://127.0.0.1:5000/submitfeedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('token')
      },
      body: `course=${encodeURIComponent(course)}&faculty=${encodeURIComponent(faculty)}&semester=${encodeURIComponent(user.semester)}&feedback=${encodeURIComponent(JSON.stringify(feedback))}`
    });
    if (submit.status === 200) {
      document.getElementById(`${course}-tick`).style.display = 'block';
    }
  };
  useEffect(() => {
    if (localStorage.getItem('token')) {
      props.setLogged(true);
    }
    getCourse();
    //eslint-disable-next-line
  }, []);

  return (
    <div id="studentFeedback">
      <div className="course-list" id="courseList">
        <h2 className="course-list-title">Courses</h2>
        {Object.entries(courses).map(([course, faculty], index) => {
          const style = index === 0 ? { backgroundColor: 'rgba(255, 0, 0, 0.1)' } : {};
          return <div id={`course-${index}`} className="course-item" onClick={() => { toggleCourses(course, faculty, `course-${index}`) }} key={course} style={style}>{course} <i id={`${course}-tick`} className="tick fa-solid fa-check"></i></div>
        })}
      </div>
      <div className="container">
        <h1 className="title">Course Feedback Form</h1>
        <h5>Faculty: <b>{faculty}</b></h5>
        <form id="feedbackForm">
          <section id="theoryFeedback" className="section">
            <div className="question">
              <label className="label-text">The course content met my expectations.</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="course_content" value="strongly_disagree" />Strongly Disagree</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="course_content" value="disagree" />Disagree</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="course_content" value="agree" />Agree</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="course_content" value="strongly_agree" />Strongly Agree</label>
            </div>

            <div className="question">
              <label className="label-text">I am satisfied with the course materials and resources provided.</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="course_materials" value="strongly_disagree" />Strongly Disagree</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="course_materials" value="disagree" />Disagree</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="course_materials" value="agree" />Agree</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="course_materials" value="strongly_agree" />Strongly Agree</label>
            </div>

            <div className="question">
              <label className="label-text">The course effectively helped me achieve my learning objectives.</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="learning" value="strongly_disagree" />Strongly Disagree</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="learning" value="disagree" />Disagree</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="learning" value="agree" />Agree</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="learning" value="strongly_agree" />Strongly Agree</label>
            </div>

            <div className="question">
              <label className="label-text">The instructor's teaching was effective and engaging.</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="instructor_teaching"
                value="strongly_disagree" />Strongly Disagree</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="instructor_teaching"
                value="disagree" />Disagree</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="instructor_teaching" value="agree" />Agree</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="instructor_teaching"
                value="strongly_agree" />Strongly Agree</label>
            </div>
          </section>

          <section id="labFeedback" className="section">
            <div className="question">
              <label className="label-text">The lab sessions were helpful and informative.</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="lab_sessions" value="strongly_disagree" />Strongly Disagree</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="lab_sessions" value="disagree" />Disagree</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="lab_sessions" value="agree" />Agree</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="lab_sessions" value="strongly_agree" />Strongly Agree</label>
            </div>

            <div className="question">
              <label className="label-text">The TA's assistance was beneficial and effective.</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="ta_assistance" value="strongly_disagree" />Strongly Disagree</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="ta_assistance" value="disagree" />Disagree</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="ta_assistance" value="agree" />Agree</label>
              <label className="feedbackOptions"><input className="radio-input" type="radio" name="ta_assistance" value="strongly_agree" />Strongly Agree</label>
            </div>
          </section>

          <label className="label-text">Additional Comments/Suggestions:</label>
          <textarea className="textarea-input" id="comments" name="comments" placeholder="Your suggestions..."></textarea>

          <button className="submit-button" onClick={submitFeedback}>Submit Feedback</button>
        </form>
      </div>
    </div>
  );
}

export default Feedback;