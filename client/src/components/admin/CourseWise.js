import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function CourseWise(props) {
    const navigate = useNavigate();
    const [course, setCourse] = useState({});
    const [mandatoryCourseStudents, setMandatoryCourseStudents] = useState({});
    const [students, setStudents] = useState({});

    const getCourse = async () => {
        let data = await fetch("http://127.0.0.1:5000/getcourse", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": localStorage.getItem('token')
            },
            body: `semester=${encodeURIComponent(parseInt(localStorage.getItem('semester')) + 1)}&branch=${encodeURIComponent(localStorage.getItem('branch'))}`
        });
        if (data.status === 200) {
            data = await data.json();
            setCourse(data.course);
        }
        else if(data.status === 401) {
            props.logout();
            props.setLogoutModal(true);
            navigate("/");
        }
    };

    const getRegisteredStudents = async () => {
        let data = await fetch("http://127.0.0.1:5000/registered", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": localStorage.getItem('token')
            },
            body: `semester=${encodeURIComponent(localStorage.getItem('semester'))}&branch=${encodeURIComponent(localStorage.getItem('branch'))}`
        });
        if (data.status === 200) {
            data = await data.json();
            data = data.result;
            setMandatoryCourseStudents(data);
        }
        else if(data.status === 401) {
            props.logout();
            props.setLogoutModal(true);
            navigate("/");
        }
    };

    const getStudentsInElective = async (elective) => {
        if(elective === "mandatory") {
            setStudents(mandatoryCourseStudents);
            return;
        }
        let data = await fetch("http://127.0.0.1:5000/elective/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": localStorage.getItem('token')
            },
            body: `semester=${encodeURIComponent(localStorage.getItem('semester'))}&elective=${encodeURIComponent(elective)}`
        });
        if (data.status === 200) {
            data = await data.json();
            data = data.result;
            setStudents(data);
        }
        else if(data.status === 401) {
            props.logout();
            props.setLogoutModal(true);
            navigate("/");
        }
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            props.setLogged(true);
            props.setAdminSession(true);
        }
        getCourse();
        getRegisteredStudents();
        //eslint-disable-next-line
    }, []);

    return (
        <div id="course-wise">
            <div id="select-course">
                <select className="form-select w-50" onChange={(event) => getStudentsInElective(event.target.value)}>
                <option className="mandatory-courses" value="">Select course</option>
                    {Object.keys(course).length !== 0 && course.courses !== null && course.courses.map((element, index) => {
                        return <option className="mandatory-courses" key={index} value="mandatory">{element.code} ({element.name})</option>
                    })}
                    {Object.keys(course).length !== 0 && course.electives !== null && course.electives.map((element, index) => {
                        return element.map((ele, ind) => {
                            return <option className="elective-courses" key={ind} value={`${ele.code}:${ele.name}`}>{ele.code} ({ele.name})</option>
                        })
                    })}
                </select>
            </div>
            <div className="table-container" id="course-wise-details">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">S. no.</th>
                            <th scope="col">Roll no.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Branch</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {Object.keys(students).length !== 0 && students.map((element, index) => {
                            return <tr key={element.roll_number}>
                                <td>{index + 1}</td>
                                <td>{element.roll_number}</td>
                                <td>{element.name}</td>
                                <td>{element.branch}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            <div id="courseWiseBackBtn"><button onClick={() => { navigate('/status') }}>Go Back</button></div>
        </div>
    );
}

export default CourseWise;