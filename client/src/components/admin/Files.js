import { React, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Files(props) {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            props.setLogged(true);
            props.setAdminSession(true);
        }
        //eslint-disable-next-line
    }, []);

    return (
        <div id="files">
            <button type="button" class="btn btn-primary" onClick={()=>{navigate('/upload')}}><i className="fa-solid fa-upload"></i>Upload File</button>
            <button type="button" class="btn btn-primary" onClick={()=>{navigate('/download')}}><i className="fa-solid fa-download"></i>Download File</button>
        </div>
    );
}

export default Files;