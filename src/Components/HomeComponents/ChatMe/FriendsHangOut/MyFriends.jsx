import React, { useEffect, useState } from 'react'
import { cancelFriendRequest, searchUser, sendFriendRequest, unfriendRequest } from '../../../../APIs/API';
import style from './MyFriends.module.css'

export const MyFriends = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const searchresult = async () => {
            if (search !== "") {
                const token = JSON.parse(localStorage.getItem("token"));
                const res = await searchUser({ token, name: search });
                setUsers(res.data.users);
                console.log(res);
            } else {
                setUsers([]);
            }
        }
        searchresult();
    }, [search]);

    const onFriendRequestHandler = async (id) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const res = await sendFriendRequest({ token, id });
        if (res.status === "success") {
            setSearch(search + ' ');
        }
    };
    const onFriendRequestCancelHandler = async (id, name) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const res = await cancelFriendRequest({ token, id });
        if (res.status === "success") {
            setSearch(search + ' ');
        }
    };
    const onUnFriendRequestHandler = async (id, name) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const res = await unfriendRequest({ token, id });
        if (res.status === "success") {
            setSearch(search + ' ');
        }
    };

    return (
        <div className={style.my_friends}>
            <input
                type="text"
                value={search}
                placeholder='Find Friend 🤙🏻'
                onChange={e => setSearch(e.target.value)}
            />
            <div className={style.available_users}>
                {
                    users.map(item => (
                        <div key={item._doc._id} className={style.user}>
                            <img src={item._doc.image} alt="" />
                            <div className={style.name}>{item._doc.name}</div>
                            {item.friend_request_status === "not_sent" && <button
                                className={style.request_btn}
                                onClick={() => onFriendRequestHandler(item._doc._id, item._doc.name)}
                            >
                                Send Request
                            </button>}
                            {item.friend_request_status === "pending" &&
                                <button
                                    className={style.cancel_request_btn}
                                    onClick={() => onFriendRequestCancelHandler(item._doc._id, item._doc.name)}
                                >
                                    Cancel Request
                                </button>
                            }
                            {item.friend_request_status === "friends" &&
                                <button
                                    className={style.unfriend_request_btn}
                                    onClick={() => onUnFriendRequestHandler(item._doc._id, item._doc.name)}
                                >
                                    Unfriend
                                </button>
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
