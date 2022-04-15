import React from 'react'
import PersonIcon from '@mui/icons-material/Person';
import style from './FriendsHangout.module.css'
import { Link, useParams } from 'react-router-dom';
import { Online } from './Online';
import { Block } from './Block';
import { Pending } from './Pending';
import { AllFriends } from './AllFriends';
import { MyFriends } from './MyFriends';

export const FriendsHangOut = () => {
    const { tab } = useParams();

    return (
        <div className={style.friends_hangout}>
            <div className={style.header}>
                <Link to="./friends" className={style.tab}>
                    <div className={style.friends}>
                        <PersonIcon />
                        <div className={style.text}>
                            Friends
                        </div>
                    </div>
                </Link>
                <div style={{ margin: 'auto 0' }}>|</div>
                <Link to="./online" className={style.tab}>
                    Online
                </Link>
                <Link to="./all" className={style.tab}>
                    All
                </Link>
                <Link to="./pending" className={style.tab}>
                    Pending
                </Link>
                <Link to="./block" className={style.tab}>
                    Murdered
                </Link>
            </div>
            <div className={style.tab_content}>
                <div className={style.main}>
                    <Tab tab={tab} />
                </div>
                <div className={style.active_now}>
                    <div className={style.title}>Active Now</div>
                    <div className={style.card}>
                        <div className={style.card_title}>It's quiet for now</div>
                        <div className={style.card_content}>
                            when friends starts an activity - like playing games or hanging out on voice - we'll show it here
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Tab = ({ tab }) => {
    if (tab === "online")
        return <Online />
    else if (tab === "block")
        return <Block />
    else if (tab === "pending")
        return <Pending />
    else if (tab === "friends")
        return <MyFriends />
    else return <AllFriends />
}