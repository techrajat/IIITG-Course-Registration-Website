import { React, useState, useEffect } from 'react';
import html2pdf from  "html2pdf.js";

function Receipt(props) {
  const [recDetails, setRecDetails] = useState({});

  const getReceipt=async()=>{
    let data = await fetch(`http://127.0.0.1:5000/receipt`, {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem('token')
      }
    });
    if(data.status === 200){
      data = await data.json();
      setRecDetails(data.result);
    }
  };

  const downloadReceipt=()=>{
    const receiptElement = document.getElementById('receipt');
    html2pdf(receiptElement);
  };

  useEffect(()=>{
    if(localStorage.getItem('token')){
      props.setLogged(true);
    }
    getReceipt();
    //eslint-disable-next-line
  }, []);

  return (
    <div id="receiptContainer">
      <div id="receipt">
        <h1>Payment Receipt</h1>
        <p><strong>Payment ID: </strong> <span id="transactionId">{recDetails.razorpay_payment_id ? recDetails.razorpay_payment_id : ""}</span></p>
        <p><strong>Order ID: </strong> <span id="transactionId">{recDetails.razorpay_order_id ? recDetails.razorpay_order_id : ""}</span></p>
        <p><strong>Name: </strong><span id="transactionDate">{recDetails.name ? recDetails.name : ""}</span></p>
        <p><strong>Roll Number: </strong><span id="transactionDate">{recDetails.roll_number ? recDetails.roll_number : ""}</span></p>
        <p><strong>Date: </strong><span id="transactionDate">{recDetails.date ? recDetails.date : ""}</span></p>
        <p><strong>Time: </strong><span id="transactionDate">{recDetails.time ? recDetails.time : ""}</span></p>
        <p><strong>Amount: </strong><span id="transactionAmount">&#8377;{parseFloat(process.env.REACT_APP_Total_Fee).toFixed(2)}</span></p>
      </div>
      <button id="downloadButton" onClick={downloadReceipt}>Download Receipt</button>
    </div>
  );
}

export default Receipt;