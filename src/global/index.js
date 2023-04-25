import React from 'react'
import { useSelector } from 'react-redux'
import { updateLoginState } from '../redux/slice/loginSlice'

function Loguser() {
    const apiToken  = useSelector(state => state.login.apiToken); 
    console.log(apiToken);
    return apiToken;
}

export default Loguser
