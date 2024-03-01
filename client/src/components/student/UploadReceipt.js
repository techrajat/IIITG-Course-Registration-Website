import { React, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UploadReceipt(props) {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            props.setLogged(true);
        }
        //eslint-disable-next-line
    }, []);

    const sendReceipt = async (event) => {
        event.preventDefault();
        const fileInput = document.getElementById('fileUploadBtn');
        if (fileInput.files.length > 0) {
            const filesJson = {};
            const files = fileInput.files;
            files.forEach((file, index) => {
                let reader = new FileReader();
                reader.onload = async (e) => {
                    const fileSource = e.target.result;
                    filesJson[index] = fileSource;
                    if (Object.keys(filesJson).length === files.length) {
                        const dateInput = document.getElementById('dateOfPayment');
                        const [year, month, day] = dateInput.value.split('-');
                        const formattedDate = `${day}-${month}-${year}`;
                        let data = await fetch("http://127.0.0.1:5000/uploadreceipt", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                                "Authorization": localStorage.getItem('token')
                            },
                            body: `ref=${encodeURIComponent(document.getElementById('referenceNumber').value)}&date_of_payment=${encodeURIComponent(formattedDate)}&files=${encodeURIComponent(JSON.stringify(filesJson))}`
                        });
                        if (data.status === 200) {
                            let selectElective = await fetch(`http://127.0.0.1:5000/selectelectives/${localStorage.getItem('selectedElectives')}`, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    "Authorization": localStorage.getItem('token')
                                }
                            });
                            if (selectElective.status === 200){
                                navigate('/studenthero');
                            }
                        }
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    }

    return (
        <div className="upload-form-container">
            <div className="upload-form">
                <form onSubmit={sendReceipt}>
                    <div className="upload-group">
                        <label htmlFor="referenceNumber">Reference Number:</label>
                        <input type="text" id="referenceNumber" name="reference_number" required />
                    </div>
                    <div className="upload-group">
                        <label htmlFor="dateOfPayment">Date of Payment:</label>
                        <input type="date" id="dateOfPayment" name="date_of_payment" required />
                    </div>
                    <div className="upload-group">
                        <label htmlFor="fileUploadBtn">Upload Receipt(s) in pdf format:</label>
                        <input type="file" accept="application/pdf" id="fileUploadBtn" multiple name="receipt" required />
                    </div>
                    <button>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default UploadReceipt;