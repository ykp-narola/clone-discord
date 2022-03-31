import React, { useContext } from 'react'
import { MdArrowBackIos } from 'react-icons/md';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import AuthContext from '../../Contexts/auth-context';
import style from './Settings.module.css'


export default function Settings(props) {
    const nav = useNavigate();
    const authCtx = useContext(AuthContext);

    const onLogoutHandler = e => {
        authCtx.logout();
    }
    return (
        <div className={style.settings__container}>
            <div className={style.settings}>
                <div className={style.sidebar_container}>
                    <div className={style.sidebar_setting}>
                        <div className={style.upper}>
                            <Link to="/user/settings/profile"><div className={style.set}>Profile</div></Link>
                            <Link to="/user/settings/change-password"><div className={style.set}>Change Password</div></Link>
                            <Link to="/user/settings/voice-controls"><div className={style.set}>Voice Setting</div></Link>
                            <div className={`${style.set} ${style.logout}`} onClick={onLogoutHandler}>Logout</div>
                        </div>
                        <div className={style.lower}>
                            <button onClick={() => { nav("/") }} className={style.backbtn}>
                                <MdArrowBackIos />
                                Back
                            </button>
                        </div>
                    </div>
                </div>
                <div className={style.main_setting}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
