import React, { useContext } from 'react'
import { Outlet, useParams } from 'react-router-dom';
import UserContext from '../../../Context/user-context'
import style from './Chatme.module.css'
import { Friends } from './Friends';
import { FriendsHangOut } from './FriendsHangOut/FriendsHangOut';

export const Chatme = () => {
    const { user } = useContext(UserContext);
    const { id } = useParams();

    return (<section className={style.chatme_section}>
        <Friends user={user} />
        {(id !== undefined || !isNaN(id)) ? <Outlet /> : <FriendsHangOut />}
    </section>)
}
