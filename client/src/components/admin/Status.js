import { React, useState, useEffect } from 'react';
import '../../App.css';

function Status(props) {
    const [students, setStudents] = useState([]);

    const getRegisteredStudents = async () => {
        let data = await fetch("http://127.0.0.1:5000/registered", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": localStorage.getItem('token')
            },
            body: `sem=${encodeURIComponent(localStorage.getItem('semester'))}`
        });
        if (data.status === 200) {
            data = await data.json();
            data = data.result;
            setStudents(data);
        }
    };

    const getUnregisteredStudents = async () => {
        let data = await fetch("http://127.0.0.1:5000/unregistered", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": localStorage.getItem('token')
            },
            body: `sem=${encodeURIComponent(localStorage.getItem('semester'))}`
        });
        if (data.status === 200) {
            data = await data.json();
            data = data.result;
            setStudents(data);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
          props.setLogged(true);
          props.setAdminSession(true);
        }
        //eslint-disable-next-line
      }, []);

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
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Roll no.</th>
                        <th scope="col">Name</th>
                        <th scope="col">Selected elective</th>
                        <th scope="col">Allotted elective</th>
                    </tr>
                </thead>
                <tbody className="table-group-divider">
                    {students.map((element) => {
                        return <tr key={element.roll_number}>
                            <td>{element.roll_number}</td>
                            <td>{element.name}</td>
                            <td>{!element.selected_elective ? "NA" : element.selected_elective}</td>
                            <td>{!element.allotted_elective ? "NA" : element.allotted_elective}</td>
                        </tr>
                    })}
                </tbody>
            </table>
            <div className="allotBtn">
                <button type="button" className="btn btn-success">Allocate Electives</button>
            </div>
        </div>
    );
}

export default Status;