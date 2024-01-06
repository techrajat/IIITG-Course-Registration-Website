import { React, useState, useEffect } from 'react';
import '../App.css';

function Status(props) {
    const [isChecked, setIsChecked] = useState(true);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const students = async (reg) => {
        let endpoint = "";
        if(reg === true){
            endpoint = "http://127.0.0.1:5000/registered";
        }
        else{
            endpoint = "http://127.0.0.1:5000/unregistered";
        }
        let students = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `sem=${encodeURIComponent(props.sem)}`
        });
        if (students.status === 200) {
            students = await students.json();
            students = students.result;
            console.log(students)
        }
    };

    useEffect(() => {
        students(isChecked);
        //eslint-disable-next-line
    }, [isChecked]);

    return (
        <div className="status">
            <div className="choose">
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" checked={isChecked} onClick={() => { setIsChecked(true) }} onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="inlineRadio1">Regsitered</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" onClick={() => { setIsChecked(false) }} />
                    <label className="form-check-label" htmlFor="inlineRadio2">Unregsitered</label>
                </div>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Roll no.</th>
                        <th scope="col">Name</th>
                        <th scope="col">Selected elective</th>
                        <th scope="col">Allotted elective</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>Larry the Bird</td>
                        <td>@twitter</td>
                        <td>@twitter</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Status;