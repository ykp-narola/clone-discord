import React, { useContext } from 'react'
import { FaCrown } from 'react-icons/fa';
import ChatContext from '../../../Context/chat-context';
import style from './Users.module.css'
// import { ENDPOINT } from '../../../APIs/API';

export const Users = (props) => {
    // const userImg = `${ENDPOINT}/images/users/`;
    const { onlineUsers } = useContext(ChatContext);

    const sortedusers = onlineUsers.sort(function (a, b) {
        const aName = a.name.toUpperCase();
        const bName = b.name.toUpperCase();
        if (aName < bName)
            return -1;
        if (aName > bName)
            return 1;
        return 0;
    });
    const OnlineUsersDiv = Object.keys(sortedusers).map((item) => (
        <div key={item} className={style.online_user}>
            <img src={onlineUsers[item].image} alt="" />
            <div className={style.username}>{onlineUsers[item].name}</div>
            {props.author._id === onlineUsers[item]._id &&
                <FaCrown fontSize="1.5rem" color='yellow' className={style.serverAuthor} />}
        </div>
    ))

    return (
        <section className={style.users_section}>
            <div className={style.online_users}>
                <div className={style.head}>{`Server Members - ${onlineUsers.length}`}</div>
                {OnlineUsersDiv}
            </div>
        </section>
    )
}
