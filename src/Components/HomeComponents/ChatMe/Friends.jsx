import React, { useEffect, useState } from 'react'
import style from './friends.module.css'
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';
import { getAllFriends } from '../../../APIs/API';

export const Friends = (props) => {
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
        <div className={style.friends_section}>
            <div className={style.start_conversation}>
                <input
                    type="text"
                    className={style.input_conversation}
                    placeholder="Find or Start Conversation"
                />
            </div>
            <div className={style.friends_list}>
                <Link to="">
                    <div className={style.Friends}>
                        <PersonIcon className={style.mui_icon} />
                        <div className={style.friends_content}>Friends</div>
                    </div>
                </Link>
                <hr />
                {friends.map((item) => (
                    <Link key={item._id} to={`./chat/${item._id}`}>
                        <div className={style.Friend}>
                            <img src={item.image} alt="" />
                            <div className={style.friend_name}>{item.name}</div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className={style.profile_status}>
                <div className={style.user_info}>
                    <img className={style.user_image} src={props.user.image} alt={props.user.name} />
                    <div className={style.user_name}>
                        <div className={style.uname}>{props.user.name}</div>
                        <div className={style.uid}>{`# ${props.user._id.substring(20, 24)}`}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
