import { React, useState, useEffect } from 'react';
import '../../App.css';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

function StudentHero(props) {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState({});

  let subtitle;
  function afterOpenModal() {
    subtitle.style.color = 'rgb(78, 65, 65)';
    subtitle.style.textDecorationLine = 'underline';
  }

  const getPayStatus = async () => {
    const data = await fetch("http://127.0.0.1:5000/paystatus", {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem('token')
      },
    });
    const parsedData = await data.json();
    if (document.getElementById('courseRegBtn') && document.getElementById('allotted') && document.getElementById('payStatus') && document.getElementById('underVerification')) {
      if (data.status === 200) {
        setMessage(parsedData);
        setOpenModal(true);
        if(!parsedData.hasOwnProperty('reason')) {
          document.getElementById('courseRegBtn').style.display = 'none';
          document.getElementById('allotted').style.display = 'block';
        }
      }
      else if (data.status === 201) {
        document.getElementById('courseRegBtn').style.display = 'none';
        document.getElementById('allotted').style.display = 'block';
      }
      else if (data.status === 202) {
        document.getElementById('courseRegBtn').style.display = 'none';
        document.getElementById('allotted').style.display = 'block';
        document.getElementById('payStatus').style.display = 'block';
      }
      else if (data.status === 203) {
        document.getElementById('courseRegBtn').style.display = 'none';
        document.getElementById('underVerification').style.display = 'block';
      }
    }
  }

  const deleteReceipt = async () => {
    setOpenModal(false);
    await fetch("http://127.0.0.1:5000/deletereceipt", {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem('token')
      },
    });
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      props.setLogged(true);
    }
    let user = localStorage.getItem('user');
    user = JSON.parse(user)
    const name = user.name;
    document.getElementById('UserName').innerHTML = `Welcome ${name}`;
    getPayStatus();
    //eslint-disable-next-line
  }, []);

  return (
    <div>
      <Modal
        isOpen={openModal}
        onAfterOpen={afterOpenModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Attention"
        id={'custom-modal'}
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Attention</h2>
        <button onClick={deleteReceipt} id="modalClose"><i className="fa-solid fa-xmark"></i></button>
        <p className="modalMessage">{message.result}</p>
        {message.reason && <p className="modalMessage">Reason: <b>{message.reason}</b></p>}
      </Modal>
      <div className="studentRegOptions">
        <div><h1 id="UserName">Welcome</h1></div>
        <div className="options" id="courseRegBtn"><button className="option" onClick={() => { navigate('/regpage') }}>Course Registration</button></div>
        <div className="options" id="payStatus" style={{ display: "none" }}><button className="option" onClick={() => { navigate('/receipt') }}>View Payment Receipt</button></div>
        <div className="options" id="allotted" style={{ display: "none" }}><button className="option">View Allotted Courses</button></div>
        <div className="options" id="underVerification" style={{ display: "none" }}>Payment status under verification...</div>
      </div>
    </div>
  );
}

export default StudentHero;