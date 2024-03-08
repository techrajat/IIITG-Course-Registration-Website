import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function VerifyDeclinePayment(props) {
    const navigate = useNavigate();
    const [receipts, setreceipts] = useState([]);

    const getReceipts = async () => {
        let data = await fetch("http://127.0.0.1:5000/getuploadedreceipts", {
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
            setreceipts(data);
        }
    };

    const confirmVerification = async (roll) => {
        const row = document.getElementById(`row-${roll}`);
        if (window.confirm(`Confirm payment for roll no.: ${roll} ?`)) {
            let data = await fetch("http://127.0.0.1:5000/verifypayment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": localStorage.getItem('token')
                },
                body: `roll=${encodeURIComponent(roll)}`
            });
            if (data.status === 200 && row) {
                row.remove();
            }
        }
        else {
            if (document.getElementById(`verify-${roll}`)) {
                document.getElementById(`verify-${roll}`).checked = false;
            }
        }
    };

    const declineVerification = async (roll) => {
        const row = document.getElementById(`row-${roll}`);
        const reason = prompt(`Enter the reason for declining payment verification of roll no. ${roll}:`);
        if (reason === null) {
            if (document.getElementById(`decline-${roll}`)) {
                document.getElementById(`decline-${roll}`).checked = false;
            }
        }
        else {
            let data = await fetch("http://127.0.0.1:5000/declinepayment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": localStorage.getItem('token')
                },
                body: `roll=${encodeURIComponent(roll)}&reason=${encodeURIComponent(reason)}`
            });
            if (data.status === 200 && row) {
                row.remove();
            }
        }
    };

    const downloadFiles = (receipts, roll) => {
        receipts.forEach((receipt, index) => {
            let a = document.createElement("a");
            a.href = receipt;
            a.download = `${roll}_receipt${index + 1}.pdf`;
            a.click();
        });
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            props.setLogged(true);
            props.setAdminSession(true);
        }
        getReceipts();
        //eslint-disable-next-line
    }, []);

    return (
        <div id="verification">
            <div className="table-container mb-5">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">S. no.</th>
                            <th scope="col">Verify</th>
                            <th scope="col">Decline</th>
                            <th scope="col">Roll no.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Reference no.</th>
                            <th scope="col">Date</th>
                            <th scope="col">Receipt(s)</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {receipts.length !== 0 && receipts.map((element, index) => {
                            return <tr key={element.roll_number} id={`row-${element.roll_number}`}>
                                <td>{index + 1}</td>
                                <td><div className="form-check">
                                    <input className="form-check-input border-dark" type="checkbox" value="verified" id={`verify-${element.roll_number}`} onClick={() => { confirmVerification(element.roll_number) }} />
                                </div></td>
                                <td><div className="form-check">
                                    <input className="form-check-input border-dark" type="checkbox" value="declined" id={`decline-${element.roll_number}`} onClick={() => { declineVerification(element.roll_number) }} />
                                </div></td>
                                <td>{element.roll_number}</td>
                                <td>{element.name}</td>
                                <td>{element.reference_number}</td>
                                <td>{element.date_of_payment}</td>
                                <td><button type="button" className="btn btn-primary" onClick={() => { downloadFiles(element.receipt, element.roll_number) }}>Download {element.receipt.length} files</button></td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            <div className="adminNavBtn"><button type="button" className="btn btn-success my-2" onClick={() => { navigate('/verified') }}>View Verified Payments</button></div>
            <div className="adminNavBtn"><button type="button" className="btn btn-success my-2" onClick={() => { navigate('/status') }}>Go Back</button></div>
        </div>
    );
}

export default VerifyDeclinePayment;