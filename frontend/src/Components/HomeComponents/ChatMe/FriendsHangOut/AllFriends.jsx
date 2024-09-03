import React, { useEffect, useState } from 'react'
import style from './AllFriends.module.css'
import { getAllFriends } from '../../../../APIs/API'
import { Link } from 'react-router-dom';
import MessageIcon from '@mui/icons-material/Message';
import CallIcon from '@mui/icons-material/Call';

export const AllFriends = () => {
    const [friends, setFriends] = useState([]);
    useEffect(() => {
        const getData = async () => {
            const token = JSON.parse(localStorage.getItem("token"));
            const res = await getAllFriends({ token });
            setFriends(res.data.friends);
        };
        getData();
    }, []);
    return (
        <div className={style.all_friends}>
            <p>{`All Friends - ${friends.length}`}</p>
            {friends.map((item) => (
                <div key={item._id} className={style.my_friend}>
                    <img src={item.image} alt="" />
                    <div className={style.friend_name}>{item.name}</div>
                    <div className={style.actions}>
                        <Link to={`/channels/@me/chat/${item._id}`} className={style.icon}> <MessageIcon /> </Link>
                        <Link to="" className={style.icon}> <CallIcon /> </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}
