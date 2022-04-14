import React from 'react'
import style from './AllFriends.module.css'
import { searchUser } from '../../../../APIs/API'

export const AllFriends = () => {
    return (
        <div className={style.all_friends}>
            <input
                type="text"
                placeholder='Find Friends and go to console 🤙🏻'
                onChange={async (e) => {
                    const token = JSON.parse(localStorage.getItem("token"));
                    const res = await searchUser({ token, name: e.target.value });
                    console.log(res);
                }}
            />
        </div>
    )
}
