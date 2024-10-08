import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

function RegPage(props) {
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [course, setCourse] = useState({});
    const [additionalCourse, setAdditionalCourse] = useState([]);
    const [reason, setReason] = useState(null);
    const [load, setLoad] = useState(true);

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
        let data3 = await fetch("http://127.0.0.1:5000/additionalcourses", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": localStorage.getItem('token')
            },
            body: `semester=${encodeURIComponent(user.semester)}`
        });
        if (data1.status === 200 && data2.status === 200 && data3.status === 200) {
            data1 = await data1.json();
            data2 = await data2.json();
            data3 = await data3.json();
            let data = data1.course;
            if (data2.course.courses !== null) {
                data.courses = data.courses.concat(data2.course.courses);
            }
            if (data2.course.electives !== null) {
                data.electives = data.electives.concat(data2.course.electives);
            }
            if (data3.course.course !== null) {
                setAdditionalCourse(data3.course.course);
                setReason(data3.course.reason);
            }
            setCourse(data);
            setLoad(false);
            if (document.getElementById('submitRegForm')) {
                document.getElementById('submitRegForm').style.display = 'block';
            }
        }
        else if (data1.status === 401 || data2.status === 401) {
            props.logout();
            props.setLogoutModal(true);
            navigate("/");
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

    const handleTooltip = () => {
        if (document.getElementById('tooltip').style.display === 'block') {
            document.getElementById('tooltip').style.display = 'none';
        }
        else {
            document.getElementById('tooltip').style.display = 'block';
        }
    }

    return (
        <div className="reg-form-container">
            <form id="regForm">
                <label htmlFor="name" className="regLabel"><span>*</span> Name:</label>
                <input type="text" id="name" name="name" value={(user.name) ? user.name : ""} disabled />
                <label htmlFor="email" className="regLabel"><span>*</span> Email:</label>
                <input type="email" id="email" name="email" value={(user.email) ? user.email : ""} disabled />
                <label htmlFor="roll" className="regLabel"><span>*</span> Roll no:</label>
                <input type="text" id="roll" name="roll" value={(user.roll_number) ? user.roll_number : ""} disabled />
                <label htmlFor="sem" className="regLabel"><span>*</span> Registering for semester:</label>
                <input type="text" id="sem" name="sem" value={!isNaN(user.semester) ? user.semester + 1 : ''} disabled />
                <label htmlFor="course" className="regLabel"><span>*</span> Mandatory Courses:</label>
                <div style={{ 'textAlign': 'center' }}><ClipLoader loading={load} size={20} /></div>
                {Object.keys(course).length !== 0 && course.courses !== null && course.courses.map((element, index) => {
                    return <div className="form-check" key={index}>
                        <input className="form-check-input" type="checkbox" value={element.code} checked onChange={() => { }} />
                        <label className="form-check-label">
                            {element.code} ({element.name})
                        </label>
                    </div>
                })}
                {additionalCourse.length !== 0 && additionalCourse !== null && <label htmlFor="course" className="regLabel"><span>*</span> Additional Courses: <i onClick={handleTooltip} class="fa-solid fa-circle-question"></i><span id="tooltip" style={{ color: 'black' }}>{reason}</span></label>}
                {additionalCourse.length !== 0 && additionalCourse !== null && additionalCourse.map((element, index) => {
                    return <div className="form-check" key={index}>
                        <input className="form-check-input" type="checkbox" value={element.code} checked onChange={() => { }} />
                        <label className="form-check-label">
                            {element.code} ({element.name})
                        </label>
                    </div>
                })}
                <div className="text-center mt-3" id="submitRegForm" style={{ display: 'none' }} onClick={() => { navigate('/payment') }}><input type="submit" value="Register and Pay" /></div>
            </form>
        </div>
    );
}

export default RegPage;