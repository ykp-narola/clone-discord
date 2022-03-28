import React, { useState } from 'react'
import style from './ChangePassword.module.css'

const SetUpdatedPassword = async data => {
    return await fetch("/api/users/updatePassword", {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${data.token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "passwordCurrent": data.currPassword,
            "password": data.newPassword,
            "passwordConfirm": data.cNewPassword
        })
    }).then(data => data.json());
}

export default function ChangePassword() {
    const [isError, setIsError] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [currPassword, setCurrPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [cNewPassword, setCNewPassword] = useState(null);
    const updatePassword = async e => {
        e.preventDefault();
        let token = JSON.parse(localStorage.getItem("token"));
        const res = await SetUpdatedPassword({ token, currPassword, newPassword, cNewPassword });
        if (res.status !== "success") {
            sessionStorage.setItem("error", JSON.stringify(res.message));
            sessionStorage.setItem("errors", JSON.stringify(res.errors));
            setIsError(false);
            setIsError(true);
        } else {
            sessionStorage.removeItem("error");
            sessionStorage.removeItem("errors");
            setIsChanged(true);
            setIsError(false);
        }
    };

    return (
        <div className={style.change_pswd}>
            <h2>Change Password</h2>
            {/* <form> */}
            <div className={style.main_sec}>
                {!isError && isChanged &&
                    <div style={{ color: 'green' }}>Password Changed Successfully</div>
                }
                {isError && <div className={style.error_msg}>{
                    (sessionStorage.getItem("errors")) === 'undefined' ?
                        (JSON.parse(sessionStorage.getItem("error")))
                        : ((JSON.parse(sessionStorage.getItem("errors"))[0].message))
                }</div>}
                <div className={style.password_fields}>
                    <div className={`${style.emailid} ${style.inputField}`}>
                        <label htmlFor="pswd">Current Password</label>
                        <input className={style.inputBox} type="password" onChange={e => setCurrPassword(e.target.value)} />
                    </div>
                    <div className={`${style.emailid} ${style.inputField}`}>
                        <label htmlFor="newPswd">New Password</label>
                        <input className={style.inputBox} type="password" onChange={e => setNewPassword(e.target.value)} />
                    </div>
                    <div className={`${style.emailid} ${style.inputField}`}>
                        <label htmlFor="cNewPswd">Confirm New Password</label>
                        <input className={style.inputBox} type="password" onChange={e => setCNewPassword(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className={style.buttons}>
                <button onClick={updatePassword}>Save</button>
                <button onClick={() => { }}>Discard Changes</button>
            </div>
            {/* </form> */}
        </div>
    )
}
