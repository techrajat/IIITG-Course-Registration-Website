import { React, useState, useEffect } from 'react';
import '../../App.css';

function Status(props) {
    const [isChecked, setIsChecked] = useState(true);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const [students, setStudents] = useState([]);

    const getStudents = async (reg) => {
        let endpoint = "";
        if (reg === true) {
            endpoint = "http://127.0.0.1:5000/registered";
        }
        else {
            endpoint = "http://127.0.0.1:5000/unregistered";
        }
        let data = await fetch(endpoint, {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": localStorage.getItem('token'),
                "Admin": props.adminSession },
            body: `sem=${encodeURIComponent(props.sem)}`
        });
        if (data.status === 200) {
            data = await data.json();
            data = data.result;
            setStudents(data);
        }
    };

    useEffect(() => {
        getStudents(isChecked);

        if(isChecked){
            document.querySelector(".allotBtn button").style.display = "block";
        }
        else{
            document.querySelector(".allotBtn button").style.display = "none";
        }
        //eslint-disable-next-line
    }, [isChecked]);

    return (
        <div className="status">
            <div className="choose">
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" checked={isChecked} onClick={() => { setIsChecked(true) }} onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="inlineRadio1"><b>Regsitered</b></label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" onClick={() => { setIsChecked(false) }} />
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