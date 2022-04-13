import React from 'react'
import { Outlet } from 'react-router-dom'

import style from './Login.module.css'

export default function Login() {
    return (<div className={style.login}>
        <Outlet />
    </div >
    )
}
