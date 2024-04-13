import { React, useState, useEffect } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

function Status(props) {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [load, setLoad] = useState(false);
    const [allocationStatusKey, setAllocationStatusKey] = useState(0);

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
            setStudents(data);
        }
        else if(data.status === 401) {
            props.logout();
            props.setLogoutModal(true);
            navigate("/");
        }
    };

    const getUnregisteredStudents = async () => {
        let data = await fetch("http://127.0.0.1:5000/unregistered", {
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
            setStudents(data);
        }
        else if(data.status === 401) {
            props.logout();
            props.setLogoutModal(true);
            navigate("/");
        }
    };

    const allocateElectives = async () => {
        if (window.confirm("Do you want to allocate electives ?")) {
            setLoad(true);
            document.getElementById('allocationBtn').innerHTML = "Allocating electives";
            let data = await fetch("http://127.0.0.1:5000/allocate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": localStorage.getItem('token')
                },
                body: `semester=${encodeURIComponent(localStorage.getItem('semester'))}&branch=${encodeURIComponent(localStorage.getItem('branch'))}`
            });
            if (data.status === 200) {
                setLoad(false);
                document.getElementById('allocationBtn').innerHTML = "Allocate Electives";
                setAllocationStatusKey(allocationStatusKey+1);
            }
            else if(data.status === 403) {
                data = await data.json();
                setLoad(false);
                document.getElementById('allocationBtn').innerHTML = "Allocate Electives";
                document.getElementById('allocationWarning').innerHTML = data.error;
            }
            else if(data.status === 401) {
                props.logout();
                props.setLogoutModal(true);
                navigate("/");
            }
        }
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            props.setLogged(true);
            props.setAdminSession(true);
        }
        getRegisteredStudents();
        //eslint-disable-next-line
    }, [allocationStatusKey]);

    return (
        <div className="status">
            <div className="choose">
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" defaultChecked={true} onClick={getRegisteredStudents} />
                    <label className="form-check-label" htmlFor="inlineRadio1"><b>Regsitered</b></label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" onClick={getUnregisteredStudents} />
                    <label className="form-check-label" htmlFor="inlineRadio2"><b>Unregsitered</b></label>
                </div>
            </div>
            <div className="table-container">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">S. no.</th>
                            <th scope="col">Roll no.</th>
                            <th style={{ width: '250px' }} scope="col">Name</th>
                            <th scope="col">CPI</th>
                            <th style={{ width: '380px' }} scope="col">Allotted electives</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {students.length !== 0 && students.map((element, index) => {
                            return <tr key={element.roll_number}>
                                <td>{index + 1}</td>
                                <td>{element.roll_number}</td>
                                <td>{element.name}</td>
                                <td>{element.cpi}</td>
                                <td>{(element.allotted_elective == null) ? "NA" : element.allotted_elective.map((e, i) => { return <>{`${e.code}: ${e.name}`}<br /></>; })}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            <div className="allotBtn">
                <div className="text-center"><ClipLoader loading={load} size={20} /> </div>
                <button id="allocationBtn" type="button" className="btn btn-success my-2" onClick={allocateElectives}>Allocate Electives</button>
                <div><p style={{color: 'red', fontWeight: 'bold'}} id="allocationWarning"></p></div>
            </div>
            <div id="course-wise-link"><Link to="/coursewise">Get course-wise registered students</Link></div>
        </div>
    );
}

export default Status;