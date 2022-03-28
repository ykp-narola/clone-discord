import React, { useEffect, useState } from 'react'
import style from './Users.module.css'



export const Users = (props) => {
    const userImg = "http://192.168.100.130:3000/images/users/";
    const [onlineUsers, setOnlineUsers] = useState([{ name: "User", image: "Accord.png" }]);

    useEffect(() => {
        (async () => {
            const res = await getAllUsers();
            if (res.data.server.length > 0) {
                const users = res.data.server[0].users;
                setOnlineUsers(users);
            } else {
                setOnlineUsers([{ name: "User", image: "Accord.png" }]);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);
    const getAllUsers = async e => {
        const token = localStorage.getItem("token");
        return fetch(`/api/servers/${props.slug}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token.substring(1, token.length - 1)}`
            }
        }).then(data => data.json());
    }
    const sortedusers = onlineUsers.sort(function (a, b) {
        const aName = a.name.toUpperCase();
        const bName = b.name.toUpperCase();
        if (aName < bName)
            return -1;
        if (aName > bName)
            return 1;
        return 0;
    });
    console.log(sortedusers);
    const OnlineUsersDiv = Object.keys(sortedusers).map((item) => (
        <div key={item} className={style.online_user}>
            <img src={`${userImg}${onlineUsers[item].image}`} alt="" />
            <div className={style.username}>{onlineUsers[item].name}</div>
        </div>
    ))

    return (
        <section className={style.users_section}>
            <div className={style.channel_name}>
                <div className={style.online_users}>
                    <div className={style.head}>{`Server Members - ${onlineUsers.length}`}</div>
                    {OnlineUsersDiv}
                    {/* <div className={style.online_user}>
                        <img src={img} alt="" />
                        <div className={style.username}>{userName}</div>
                    </div> */}
                </div>
                {/* <div className={style.offline_users}>
                    <div className={style.head}>Offline Members - 2</div>
                    <div className={style.offline_user}>
                        <img src={img} alt="" />
                        <div className={style.username}>{userName}</div>
                    </div>
                    <div className={style.offline_user}>
                        <img src={img} alt="" />
                        <div className={style.username}>{userName}</div>
                    </div>
                </div> */}
            </div>
        </section>
    )
}
