import React, { useContext } from 'react'
import UserContext from '../../../Context/user-context'
import style from './Chatme.module.css'

export const Chatme = () => {

    const { user } = useContext(UserContext);
    return (
        <div className={style.initial}>
            <div>
                <h1>{`Hey, ${user.name}`}</h1>
                <p>Select server & Have a fun 😃 </p>
            </div>
        </div>
    )
}
