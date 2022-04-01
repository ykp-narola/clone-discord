import React, { useContext, useState } from 'react'
// import PropTypes from 'prop-types';

import style from './LoginComponent.module.css'
import qrcode from "../../assets/Qrcode.png"
import { onLogin } from '../../APIs/API';
import AuthContext from '../../Context/auth-context';

export default function LoginComponent(props) {
    const authCtx = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isError, setIsError] = useState(false);

    const onLoginHandler = async e => {
        e.preventDefault();
        const res = await onLogin({ email, password })
        if (res.status !== "success") {
            sessionStorage.setItem("error", JSON.stringify(res.message));
            setIsError(true);
        }
        else {
            sessionStorage.removeItem("error");
            setIsError(false);
            authCtx.login(res.token);
        }
    }
    return (
        <div className={style.form_container}>
            <div className={style.section_login}>
                <div className={style.header}>
                    <div className={style.welcome}>Welcome Back!</div>
                    <div className={style.sub_welcome}>We're so excited to see you again!</div>
                </div>
                {isError && <div className={style.error_msg}>{JSON.parse(sessionStorage.getItem("error"))}</div>}
                <div className={style.formdiv}>
                    <form onSubmit={onLoginHandler}>
                        <div className={`${style.emailid} ${style.inputField}`}>
                            <label htmlFor="emailid">Email</label>
                            <input className={style.inputBox} type="email" id='emailID' onChange={(e) => { setEmail(e.target.value) }} />
                        </div>
                        <div className={`${style.password} ${style.inputField}`}>
                            <label htmlFor="passwd">Password</label>
                            <input className={style.inputBox} type="password" id='pswd' onChange={(e) => { setPassword(e.target.value) }} autoComplete="on" />
                        </div>
                        <div className={style.forgot_pswd} onClick={() => alert("Can't send Email")}>Forgot your password?</div>
                        <button className={style.login_btn} onClick={onLoginHandler}>Login</button>
                        <div className={style.isRegister}>Need an account? &nbsp;<div id={style.register} onClick={props.NavtoRegisterPage}>Register</div></div>
                    </form>
                </div>
            </div>
            <div className={style.section_qrcode}>
                <img src={qrcode} alt="" />
                <div className={style.content_head}>Login with QR Code</div>
                <div className={style.content}>Scan this with the <b className={style.bold}>Accord</b> mobile app to login in instantly</div>
            </div>
        </div>
    )
}