import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { onRegisterUser } from '../../APIs/API';
// import Login from '../../Pages/Login/Login';
import style from './RegisterComponent.module.css'

export default function RegisterComponent() {
    const nav = useNavigate();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState();
    const [isError, setIsError] = useState(false);

    async function onRegisterHandler(e) {
        e.preventDefault();
        let credentials = { name: name, email: email, password: password, passwordConfirm: passwordConfirm };
        const res = await onRegisterUser(credentials);
        console.log("res", res);
        if (res.status !== 'success') {
            sessionStorage.setItem("error", JSON.stringify(res.message));
            sessionStorage.setItem("errors", JSON.stringify(res.errors));
            setIsError(false);
            setIsError(true);
        }
        else {
            setIsError(false);
            sessionStorage.removeItem("error");
            sessionStorage.removeItem("errors");
            setTimeout(() => {
                nav('/user/login');
            }, 500);
        }
    }
    return (
        <div className={style.register_form_container}>
            <div className={`${style.header} ${style.welcome}`}>Create an account</div>
            {isError && <div className={style.error_msg}>
                {
                    (sessionStorage.getItem("errors")) === 'undefined' ?
                        (JSON.parse(sessionStorage.getItem("error")))
                        : ((JSON.parse(sessionStorage.getItem("errors"))[0].message))
                }
            </div>
            }
            {/* {isError && <div className={style.error_msg}>{`Invalid Registration, Make sure you are using narola email and password must be strong`}</div>} */}
            <form>
                <div className={`${style.username} ${style.inputField}`}>
                    <label htmlFor="username">Name</label>
                    <input className={style.inputBox} type="text" name="" id="NAME" onChange={(e) => setName((e.target.value).trim())} />
                </div>
                <div className={`${style.emailid} ${style.inputField}`}>
                    <label htmlFor="emailid">Email</label>
                    <input className={style.inputBox} type="email" name="" id="EMAILID" onChange={(e) => setEmail((e.target.value).trim())} />
                </div>
                <div className={`${style.emailid} ${style.inputField}`}>
                    <label htmlFor="PASSWORD">Password</label>
                    <input className={style.inputBox} type="password" name="" id="PSWD" autoComplete='on' onChange={(e) => setPassword((e.target.value).trim())} />
                </div>
                <div className={`${style.emailid} ${style.inputField}`}>
                    <label htmlFor="PASSWORD">Confirm Password</label>
                    <input className={style.inputBox} type="password" name="" id="CPSWD" autoComplete='on' onChange={(e) => setPasswordConfirm((e.target.value).trim())} />
                </div>
                <button type='submit' className={style.register_btn} onClick={onRegisterHandler}>Register</button>
            </form>
            <div className={style.forgot_pswd} onClick={() => nav("/user/login")}>Already have an account?</div>
        </div>
    )
}
