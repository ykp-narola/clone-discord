import React, { useEffect, useState } from 'react'
import { GiCrown } from 'react-icons/gi';
import { getServerUsers } from '../../../APIs/API';
import style from './Users.module.css'

let author = { _id: -1 };

export const Users = (props) => {
    const userImg = "http://192.168.100.130:3000/images/users/";
    const [onlineUsers, setOnlineUsers] = useState([{ name: "User", image: "Accord.png" }]);

    useEffect(() => {
        (async () => {
            const token = JSON.parse(localStorage.getItem("token"));
            const res = await getServerUsers({ slug: props.slug, token });
            if (res.data.server.length > 0) {
                author = res.data.server[0].author;
                const users = res.data.server[0].users;
                setOnlineUsers(users);
            } else {
                setOnlineUsers([{ name: "User", image: "Accord.png" }]);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);
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
            <img src={`${userImg}${onlineUsers[item].image}`} alt="" />
            <div className={style.username}>{onlineUsers[item].name}</div>
            {author._id === onlineUsers[item]._id &&
                <GiCrown fontSize="1.5rem" color='yellow' className={style.serverAuthor} />}
        </div>
    ))

    return (
        <section className={style.users_section}>
            <div className={style.channel_name}>
                <div className={style.online_users}>
                    <div className={style.head}>{`Server Members - ${onlineUsers.length}`}</div>
                    {OnlineUsersDiv}
                </div>
            </div>
        </section>
    )
}
