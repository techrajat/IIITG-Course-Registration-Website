import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import '../../App.css';

function ElectiveChanges(props) {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [load, setLoad] = useState(false);

  const getChangeRequests = async () => {
    let data = await fetch("http://127.0.0.1:5000/fetchchangerequests", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('token')
      },
      body: `semester=${encodeURIComponent(localStorage.getItem('semester'))}&branch=${encodeURIComponent(localStorage.getItem('branch'))}`
    });
    if (data.status === 200) {
      data = await data.json();
      data = data.requests;
      setRequests(data);
    }
    else if (data.status === 401) {
      props.logout();
      props.setLogoutModal(true);
      navigate("/");
    }
  }

  const changeElectives = async () => {
    if (window.confirm("Do you want to change electives ?")) {
      setLoad(true);
      let data = await fetch("http://127.0.0.1:5000/changeelectives", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": localStorage.getItem('token')
        },
        body: `semester=${encodeURIComponent(localStorage.getItem('semester'))}&branch=${encodeURIComponent(localStorage.getItem('branch'))}`
      });
      if (data.status === 200) {
        setLoad(false);
        navigate('/status');
      }
      else if (data.status === 401) {
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
    getChangeRequests();
    //eslint-disable-next-line
  }, []);


  return (
    <div id="electiveChangePage">
      <div className="table-container">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">S. no.</th>
              <th scope="col">Roll no.</th>
              <th style={{ width: '250px' }} scope="col">Name</th>
              <th scope="col">Branch</th>
              <th scope="col">From</th>
              <th scope="col">To</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {requests.length !== 0 && requests.map((element, index) => {
              return <tr key={element.roll_number}>
                <td>{index + 1}</td>
                <td>{element.roll_number}</td>
                <td>{element.name}</td>
                <td>{element.branch}</td>
                <td>{element.from.code}: {element.from.name}</td>
                <td>{element.to.code}: {element.to.name}</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
      <div className="changeBtn">
        <button type="button" className="btn btn-success my-2" onClick={changeElectives}><ClipLoader loading={load} size={20} /> Change Electives</button>
      </div>
    </div>
  );
}

export default ElectiveChanges;