import React from 'react'
import { useNavigate } from 'react-router-dom'

import style from './Login.module.css'
import LoginComponent from '../../Components/LoginComponent/LoginComponent';
import RegisterComponent from '../../Components/RegisterComponent/RegisterComponent';

export default function Login(props) {
    const nav = useNavigate();
    // if (props.setToken !== "") {
    //     nav("/");
    // }
    return (
        <div className={style.login}>
            {(window.location.pathname === '/user/register') ?
                <RegisterComponent NavtoLoginPage={() => nav('/')} /> :
                <LoginComponent
                    NavtoRegisterPage={() => nav('/user/register')} setToken={props.setToken}
                />}
        </div >
    )
}
