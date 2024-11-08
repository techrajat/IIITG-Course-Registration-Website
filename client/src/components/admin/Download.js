import { React, useState, useEffect } from 'react';

function Download(props) {
    const [dataType, setDataType] = useState('');

    const handleDataTypeChange = (e) => {
        setDataType(e.target.value);
    };

    const handleDownload = async () => {
        if (!dataType) {
            alert('Please select a data type.');
            return;
        }
        const response = await fetch(`http://127.0.0.1:5000/downloadfile/${dataType}`, {
            method: 'GET',
            headers: {
                "Authorization": localStorage.getItem('token'),
            }
        });
        if (!response.ok) {
            alert('Failed to download file.');
            return;
        }
        const blob = await response.blob();
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = `${dataType}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            props.setLogged(true);
            props.setAdminSession(true);
        }
        //eslint-disable-next-line
    }, []);

    return (
        <div id="download" className="container">
            <div className="card p-4 shadow-lg">
                <h3 className="text-center mb-4">Download File</h3>
                <form>
                    <div className="form-group">
                        <label htmlFor="dataTypeSelect">Select Data Type</label>
                        <select
                            className="form-control"
                            id="dataTypeSelect"
                            onChange={handleDataTypeChange}
                            required
                        >
                            <option value="">Select Data Type</option>
                            <option value="Student1">Student Details</option>
                            <option value="Faculty">Faculty Details</option>
                            <option value="Courses">Courses</option>
                            <option value="RegStatus">Registration Status</option>
                        </select>
                    </div>

                    <div className="form-group text-center">
                        <button
                            type="button"
                            className="btn btn-primary mt-3"
                            onClick={handleDownload}
                        >
                            Download
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Download;