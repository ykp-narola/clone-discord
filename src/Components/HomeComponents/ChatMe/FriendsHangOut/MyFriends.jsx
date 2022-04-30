import React, { useRef, useState } from 'react'
import { searchUser, sendFriendRequest } from '../../../../APIs/API';
import style from './MyFriends.module.css'

export const MyFriends = () => {
    const [users, setUsers] = useState([]);
    const requestBtn = useRef();

    const searchresult = async (e) => {
        if (e.target.value !== "") {
            const token = JSON.parse(localStorage.getItem("token"));
            const res = await searchUser({ token, name: e.target.value });
            setUsers(res.data.users);
        } else {
            setUsers([]);
        }
    }

    const onFriendRequestHandler = async (id) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const res = await sendFriendRequest({ token, id });
        console.log(res);
        if (res.status === "success") {
            console.log(requestBtn.current.textcontent);
        }
    };

    return (
        <div className={style.my_friends}>
            <input
                type="text"
                placeholder='Find Friend 🤙🏻'
                onChange={searchresult}
            />
            <div className={style.available_users}>
                {
                    users.map(item => (
                        <div key={item._id} className={style.user}>
                            <img src={item.image} alt="" />
                            <div className={style.name}>{item.name}</div>
                            <button
                                ref={requestBtn}
                                className={style.request_btn}
                                onClick={() => onFriendRequestHandler(item._id)}
                            >
                                Send Request
                            </button>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
