import { React, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

function Upload(props) {
    const [file, setFile] = useState(null);
  const [dataType, setDataType] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleDataTypeChange = (e) => {
    setDataType(e.target.value);
  };

  const handleUpload = async () => {
    if (!file || !dataType) {
      alert('Please select a file and data type.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const binaryString = reader.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const formData = new FormData();
      formData.append('fileData', JSON.stringify(jsonData));
      formData.append('dataType', dataType);
      const cleanedData = jsonData.map((record) => {
        const { _id, ...rest } = record;
        return rest;
      });
      const response = await fetch('http://127.0.0.1:5000/uploadfile', {
        method: 'POST',
        headers: {
          "Authorization": localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileData: cleanedData,
          dataType: dataType
        }),
      });
      const result = await response.json();
      alert(result.message);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
        props.setLogged(true);
        props.setAdminSession(true);
    }
    //eslint-disable-next-line
}, []);

  return (
    <div id="upload" className="container">
      <div className="card p-4 shadow-lg">
        <h3 className="text-center mb-4">Upload File</h3>
        <form>
          <div className="form-group">
            <label htmlFor="fileInput">Choose Excel File</label>
            <input
              type="file"
              accept=".xlsx,.xls"
              className="form-control"
              id="fileInput"
              onChange={handleFileChange}
              required
            />
          </div>
          
          <div className="form-group my-4">
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
              className="btn btn-primary mt-1"
              onClick={handleUpload}
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Upload;