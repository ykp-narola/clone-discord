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
            console.log(res);
        } else {
            setUsers([]);
        }
    }

    const onFriendRequestHandler = async (id) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const res = await sendFriendRequest({ token, id });
        // console.log(res);
    };
    const onFriendRequestCancelHandler = async (id) => {
        // const token = JSON.parse(localStorage.getItem("token"));
        // const res = await sendFriendRequest({ token, id });
        // console.log(res);
        // if (res.status === "success") {
        //     console.log(requestBtn.current.textcontent);
        // }
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
                        <div key={item._doc._id} className={style.user}>
                            <img src={item._doc.image} alt="" />
                            <div className={style.name}>{item._doc.name}</div>
                            {item.friend_request_status === "not_sent" && <button
                                ref={requestBtn}
                                className={style.request_btn}
                                onClick={() => onFriendRequestHandler(item._doc._id)}
                            >
                                Send Request
                            </button>}
                            {item.friend_request_status === "pending" && <>
                                <button
                                    className={style.request_btn}
                                    onClick={() => { }}
                                    disabled
                                >
                                    Request Sent
                                </button>
                                <button
                                    ref={requestBtn}
                                    className={style.request_btn}
                                    onClick={() => onFriendRequestCancelHandler(item._doc._id)}
                                >
                                    Cancel Request
                                </button>
                            </>
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
