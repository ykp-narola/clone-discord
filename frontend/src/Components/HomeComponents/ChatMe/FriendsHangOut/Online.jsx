import React, { useEffect, useState } from "react";
import style from "./Pending.module.css";
import MessageIcon from '@mui/icons-material/Message';
import CallIcon from '@mui/icons-material/Call';
import { Link } from "react-router-dom";

export const Online = () => {
    const [onlineUser, setOnlineUser] = useState([]);

    useEffect(() => {
        setOnlineUser([{
            image: 'Accord.png',
            name: 'Username'
        }, {
            image: 'Accord.png',
            name: 'Username'
        }]);
    }, []);
    return (
        <div className={style.online}>
            <h4>Online Users - {onlineUser.length}</h4>
            <div>
                {onlineUser.map((item) => (
                    <div key={item._id} className={style.user}>
                        <img src={item.image} alt="" />
                        <div className={style.name_status}>
                            <div className={style.name}>{item.name}</div>
                            <div className={style.status}>Online</div>
                        </div>
                        <div className={style.actions}>
                            <Link to="" className={style.icon}> <MessageIcon /> </Link>
                            <Link to="" className={style.icon}> <CallIcon /> </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
