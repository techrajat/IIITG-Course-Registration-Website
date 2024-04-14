# IIITG Course Registration

## Project Overview
This project automates the course registration process for students at IIITG, eliminating the need for offline registration queues and manual elective allotments. It includes features for payment verification, elective preference management, and user roles for students, the finance section, and admins.

## Key Features
- Google authentication for student verification
- Automatic fetching of student details and mandatory course information
- Integration with RazorPay for payment processing
- Finance section for payment verification and registration approval
- Admin section for elective allotment based on CPI and preferences
- Algorithm for automatic elective allocation

## Prerequisites
- [Node.js](https://nodejs.org/) (v18.16 or higher)
- [npm](https://www.npmjs.com/) (v9.7 or higher)
- [Python](https://www.python.org/downloads/) (version 3.11 or above)
- [MongoDB](https://www.mongodb.com/try/download/community)

## Technologies Used
- **Frontend:** React.js
- **Backend:** Flask
- **Database:** MongoDB

## Installation

### Cloning and Configuration
1. Clone the repository:
   ```bash
   $ git clone https://github.com/techrajat/IIITG-Course-Registration-Website.git
   ```
2. Make an account on [RazorPay](https://razorpay.com/) and then obtain RazorPay API `Key ID` and `Key Secret` from the [RazorPay Dashboard](https://dashboard.razorpay.com/app/dashboard).
3. Navigate to the root directory `IIITG-Course-Registration-Website` and rename `.env.example` to `.env` and set the following variables:
    - `mongodb_conn_string`="your-mongodb-connection-uri"
    - `Razor_key_id`="your-razorpay-key-id"
    - `Razor_key_secret`="your-razorpay-key-secret"
    - `Total_Fee`="18000.00" (Replace with the total fee)

### Google OAuth Configuration
1. Create a new project on the [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to the `client` folder and rename `.env.example` to `.env`.
3. Set the following variables in `.env`:
    - `GENERATE_SOURCEMAP`=false (Do not change this)
    - `REACT_APP_Google_Client_ID`="your-Google-OAuth-2.0-client-ID"
    - `REACT_APP_Razor_key_id`="your-razorpay-key-id"
    - `REACT_APP_Tuition_Fee`="10000.00" (Replace with tuition fee)
    - `REACT_APP_Hostel_Fee`="3000.00" (Replace with hostel fee)
    - `REACT_APP_Mess_Fee`="5000.00" (Replace with mess fee)
    - `REACT_APP_Total_Fee`="18000.00" (Replace with total fee)

### Installation Steps
1. Install frontend dependencies and build:
   ```bash
   $ cd .\IIITG-Course-Registration-Website\client
   $ npm install
   $ npm run build
   ```
2. Install backend dependencies:
   ```bash
   $ cd .\IIITG-Course-Registration-Website\server
   $ pip install -r requirements.txt
   ```
3. Set up the MongoDB database:
   ```bash
   $ cd .\IIITG-Course-Registration-Website
   # For MongoDB local server 
   $ mongorestore --db IIITG --drop --dir Sample_Database
   # Or, for MongoDB Atlas 
   $ mongorestore --db IIITG --uri "your_connection_uri" --drop --dir Sample_Database
   ```
   - Replace some of the fake email IDs with original ones in the following collections:
     - "Admin"
     - "Finance-Section"
     - "RegStatus"
     - "Students"
   - Now you can login using these email IDs in the project.

### Run the Project
1. Make sure that the MongoDB server is running.
2. Start the server:
   ```bash
   $ cd .\IIITG-Course-Registration-Website\server
   $ python app.py
   ```
3. Start the client:
   ```bash
   $ cd .\IIITG-Course-Registration-Website\client
   $ serve -s build
   ```

The application should now be accessible at [http://localhost:3000](http://localhost:3000)
