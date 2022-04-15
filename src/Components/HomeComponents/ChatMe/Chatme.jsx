import React, { useContext } from 'react'
import { Outlet, useParams } from 'react-router-dom';
import UserContext from '../../../Context/user-context'
import style from './Chatme.module.css'
import { Friends } from './Friends';
import { FriendsHangOut } from './FriendsHangOut/FriendsHangOut';

export const Chatme = () => {

    const { user } = useContext(UserContext);
    const { id } = useParams();

    // return (
    //     <div className={style.initial}>
    //         <div>
    //             <h1>{`Hey, ${user.name}`}</h1>
    //             <p>Select server & Have a fun 😃 </p>
    //         </div>
    //     </div>
    // )

    if (id !== undefined || !isNaN(id)) {
        return (
            <section className={style.chatme_section}>
                <Friends user={user} />
                <Outlet />
            </section>
        )
    } else {
        return (
            <section className={style.chatme_section}>
                <Friends user={user} />
                <FriendsHangOut />
            </section>
        )
    }
}
