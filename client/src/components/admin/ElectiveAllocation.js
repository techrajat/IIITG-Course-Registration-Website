import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function ElectiveAllocation(props) {
    const navigate = useNavigate();
    const [electives, setElectives] = useState([]);
    const [totalStudents, setTotalStudents] = useState([]);

    const getElectives = async () => {
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
            setElectives(data.course.electives);
        }
    };

    const getTotalStudents = async () => {
        let data = await fetch("http://127.0.0.1:5000/totalstudents", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": localStorage.getItem('token')
            },
            body: `semester=${encodeURIComponent(localStorage.getItem('semester'))}&branch=${encodeURIComponent(localStorage.getItem('branch'))}`
        });
        if (data.status === 200) {
            data = await data.json();
            setTotalStudents(data.result);
        }
    };

    const validateForm = () => {
        const electiveOption = document.getElementsByClassName('capElectives');
        for (let i = 0; i < electiveOption.length; i++) {
            const capacity = electiveOption[i].getElementsByClassName('capValue');
            let sum = 0;
            capacity.forEach((e) => {
                sum += parseInt(e.value);
            });
            if (sum < totalStudents) {
                electiveOption[i].querySelector('span').style.display = 'inline-block';
                return false;
            }
        }
        return true;
    };

    const allocateElectives = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            
        }
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            props.setLogged(true);
            props.setAdminSession(true);
        }
        getElectives();
        getTotalStudents();
        //eslint-disable-next-line
    }, []);

    return (
        <div id="setCapacity">
            <div id="maxCapHead"><h3>Set maximum capacity of students for each elective</h3></div>
            <div id="maxCapContainer">
                <form onSubmit={allocateElectives}>
                    {electives.map((elective_set, index) => {
                        return <div key={index} className="capElectives">
                            <label style={{ color: '#4478bd' }}>Elective/Project {index + 1} <span style={{ color: 'red', display: 'none' }}>(Total Max {'>='} 161)</span></label>
                            {elective_set.map((choice, i) => {
                                return <div className="formItem" key={i}>
                                    <label>{choice.code}: {choice.name}</label><br />
                                    <input type="text" placeholder="Enter max capacity" className="capValue" required />
                                </div>
                            })}
                        </div>
                    })}
                    <div><input type="submit" value="Set capacity" /></div>
                </form>
            </div>
            <div id="closeMaxCap"><button onClick={() => { navigate('/status') }}>Close</button></div>
        </div>
    );
}

export default ElectiveAllocation;