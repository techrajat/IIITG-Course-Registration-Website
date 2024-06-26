import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useRazorpay from "react-razorpay";
import { ClipLoader } from 'react-spinners';

function Payment(props) {
  const navigate = useNavigate();
  const [Razorpay] = useRazorpay();

  const [load, setLoad] = useState(false);

  const payment = (order_id) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const options = {
      "key": process.env.REACT_APP_Razor_key_id,
      "amount": `${parseFloat(process.env.REACT_APP_Total_Fee) * 100}`, // Amount should be in paise
      "currency": "INR",
      "name": "IIITG",
      "description": "Course Registration",
      "image": "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/Indian_Institute_of_Information_Technology%2C_Guwahati_Logo.svg/1200px-Indian_Institute_of_Information_Technology%2C_Guwahati_Logo.svg.png",
      "order_id": order_id,
      "callback_url": `http://127.0.0.1:5000/payment/${user.roll_number}`,
      "prefill": {
        "name": user.name,
        "email": user.email,
        "contact": `+91${user.contact_no}`
      },
      "notes": {
        "address": "Guwahati, Assam"
      },
      "theme": {
        "color": "#3399cc"
      }
    };
    const rzp = new Razorpay(options);
    rzp.open();
  };

  const createBill=async()=>{
    setLoad(true);
    document.getElementById("btnText").innerHTML = "Processing";
    document.getElementById("payBtn").disabled = true;
    let data = await fetch("http://127.0.0.1:5000/createbill", {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": localStorage.getItem('token')
      },
      body: `amount=${encodeURIComponent(parseFloat(process.env.REACT_APP_Total_Fee) * 100)}` // Amount should be in paise
    });
    if(data.status === 200){
      data = await data.json();
      payment(data.order_id);
      setLoad(false);
      document.getElementById("payBtn").disabled = false;
      document.getElementById("btnText").innerHTML = "Proceed to Payment";
    }
    else if(data.status === 401) {
        props.logout();
        props.setLogoutModal(true);
        navigate("/");
    }
  };

  useEffect(()=>{
    if(localStorage.getItem('token')){
      props.setLogged(true);
    }
    //eslint-disable-next-line
  }, []);

  return (
    <div id="bill">
      <div className="bill-container">
        <h2>Your Bill</h2>
        <div className="bill-item">
          <span>Tuition Fee:</span>
          <span>&#8377; {parseFloat(process.env.REACT_APP_Tuition_Fee).toFixed(2)}</span>
        </div>
        <div className="bill-item">
          <span>Hostel Fee:</span>
          <span>&#8377; {parseFloat(process.env.REACT_APP_Hostel_Fee).toFixed(2)}</span>
        </div>
        <div className="bill-item">
          <span>Mess Fee:</span>
          <span>&#8377; {parseFloat(process.env.REACT_APP_Mess_Fee).toFixed(2)}</span>
        </div>
        <div className="total">
          <span>Total: </span>
          <span>&#8377;{parseFloat(process.env.REACT_APP_Total_Fee).toFixed(2)}</span>
        </div>
        <button id="payFinal" onClick={createBill}><ClipLoader loading={load} size={20}/><span id="btnText">Proceed to Payment</span></button>
        <div id="payOrReceipt">or</div>
        <button id="payBtn" onClick={()=>{navigate('/uploadreceipt')}}><span id="btnText">Enter Payment Details</span></button>
      </div>
    </div>
  );
}

export default Payment;