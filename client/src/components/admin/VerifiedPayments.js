import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function VerifiedPayments(props) {
    const navigate = useNavigate();
    const [receipts, setreceipts] = useState([]);

    const getVerifiedPayments = async () => {
        let data = await fetch("http://127.0.0.1:5000/getverifiedpayments", {
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
        getVerifiedPayments();
        //eslint-disable-next-line
    }, []);

    return (
        <div id="verifiedReceipts">
            <div className="table-container mb-5">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">S. no.</th>
                            <th scope="col">Roll no.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Reference no.</th>
                            <th scope="col">Date</th>
                            <th scope="col">Receipt(s)</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {receipts.length !== 0 && receipts.map((element, index) => {
                            return <tr key={element.roll_number}>
                                <td>{index + 1}</td>
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
            <div style={{textAlign: 'center'}}><button type="button" className="btn btn-success my-2" onClick={() => { navigate('/verify') }}>Go Back</button></div>
        </div>
    );
}

export default VerifiedPayments;