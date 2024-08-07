import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

function ChangeElectives(props) {
    const navigate = useNavigate();

    const [course, setCourse] = useState({});
    const [allotedElectives, setAllotedElectives] = useState({});
    const [load, setLoad] = useState(true);
    const [submit, setSubmit] = useState(false);

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
            if (document.getElementById('changeElectivesBtn')) {
                document.getElementById('changeElectivesBtn').style.display = 'block';
            }
            if (document.getElementById('elective-preference')) {
                document.getElementById('elective-preference').style.display = 'block';
            }
        }
        else if(data1.status === 401 || data2.status === 401) {
            props.logout();
            props.setLogoutModal(true);
            navigate("/");
        }
    };

    const getAlreadyAllotted = async () => {
        let data = await fetch("http://127.0.0.1:5000/viewallottedelectives", {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": localStorage.getItem('token')
            }
        });
        if(data.status === 200) {
            data = await data.json();
            data = data.electives;
            let temp = {};
            data.forEach((element) => {
                temp[`${element.code}: ${element.name}`] = 1;
            });
            setAllotedElectives(temp);
        }
        else if(data.status === 401) {
            props.logout();
            props.setLogoutModal(true);
            navigate("/");
        }
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            props.setLogged(true);
        }
        getCourse();
        getAlreadyAllotted();
        //eslint-disable-next-line
    }, []);

    const checkAlreadyAllotted = (elective, index, labelIndex) => {
        if (allotedElectives[`${elective.code}: ${elective.name}`] !== 1) {
            return <option key={index} value={`${elective.code}::${elective.name}`}>{elective.code} ({elective.name})</option>
        }
        else {
            if (document.getElementById(`label${labelIndex}`)) {
                document.getElementById(`label${labelIndex}`).innerHTML = `<b>Select alternative for <span class="original">${elective.code}:${elective.name}</span></b>`;
            }
        }
    }

    const submitElectivesForm = async (event) => {
        event.preventDefault();
        const select = document.querySelectorAll('#changeElectivesForm select');
        const original = document.querySelectorAll('.original');
        let validForm = 0, alternateElectives = [];
        for (let i = 0; i < select.length; i++) {
            if (select[i].value !== "") {
                let item = select[i].value.split('::');
                let originalElective = original[i].innerHTML.split(':');
                alternateElectives.push({ "from": { "code": originalElective[0], "name": originalElective[1] }, "to": { "code": item[0], "name": item[1] } });
                validForm = 1;
            }
        }
        if (validForm === 0 && document.getElementById('noneSelectedWarn')) {
            document.getElementById('noneSelectedWarn').style.display = 'block';
        }
        else {
            setSubmit(true);
            document.querySelector('#changeElectivesBtn span').innerHTML = "Submitting request";
            const selectElective = await fetch(`http://127.0.0.1:5000/requestchange`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": localStorage.getItem('token')
                },
                body: `alternateElectives=${encodeURIComponent(JSON.stringify(alternateElectives))}`
            });
            if (selectElective.status === 200) {
                setSubmit(false);
                document.querySelector('#changeElectivesBtn span').innerHTML = "Request Elective Change";
                navigate('/studenthero');
            }
            else if(selectElective.status === 401) {
                props.logout();
                props.setLogoutModal(true);
                navigate("/");
            }
        }
    }

    return (
        <div className="change-electives">
            <h4 className="text-center mb-4">Select alternate electives</h4>
            <form id="changeElectivesForm" onSubmit={submitElectivesForm}>
                <div style={{ 'textAlign': 'center' }}><ClipLoader loading={load} size={20} /></div>
                {Object.keys(course).length !== 0 && course.electives !== null && course.electives.map((element, index) => {
                    return <div key={index}>
                        <label id={`label${index}`}>Select alternate for elective/project {index + 1}</label>
                        <select className="selectedElectives w-100" name="course" key={index}>
                            <option value="">Select alternative</option>
                            {element.map((e, i) => {
                                return checkAlreadyAllotted(e, i, index);
                            })}
                        </select>
                    </div>
                })}
                <button type="submit" className="btn btn-success my-2" id="changeElectivesBtn"><ClipLoader loading={submit} size={20} /> <span>Request Elective Change</span></button>
                <div id="noneSelectedWarn" style={{ display: 'none' }}><p>Select at least one alternative.</p></div>
            </form>
        </div>
    );
}

export default ChangeElectives;