import React, { useEffect, useState } from 'react'
import { acceptFriendRequest, declineFriendRequest, getPendingRequests } from '../../../../APIs/API';
import style from './Pending.module.css'
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
const imgPath = "http://192.168.100.130:3000/images/users/";

export const Pending = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getReq = async () => {
            const token = JSON.parse(localStorage.getItem("token"));
            const res = await getPendingRequests({ token });
            setUsers(res.data.friendRequests);
            setUsers(res.data.friendRequests);
        }
        getReq();
    }, []);

    const acceptFriendRequestHandler = async (id) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const res = await acceptFriendRequest({ token, id });
        if (res.status === "success") {
            navigate("/channels/@me/all")
        }
    }
    const rejectFriendRequestHandler = async (id) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const res = await declineFriendRequest({ token, id });
        if (res.status === "success") {
            navigate("/channels/@me/all")
        }
    }

    return (
        <div className={style.pending_request}>
            <p>{`Pending Request - ${users.length}`}</p>
            <div>
                {
                    users.map(item => (
                        <div key={item._id} className={style.user}>
                            <img src={`${imgPath}/${item.sender.image}`} alt="" />
                            <div className={style.name}>{item.sender.name}</div>
                            <div className={style.action_buttons}>
                                <button
                                    className={style.accept_btn}
                                    onClick={() => acceptFriendRequestHandler(item.sender._id)}
                                >
                                    <DoneIcon />
                                </button>
                                <button
                                    className={style.reject_btn}
                                    onClick={() => rejectFriendRequestHandler(item.sender._id)}
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
