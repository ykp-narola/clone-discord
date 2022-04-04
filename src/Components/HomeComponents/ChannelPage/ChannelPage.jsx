import React, { useContext } from 'react'
import { FaHashtag } from 'react-icons/fa'
import { ChatContextProvider } from '../../../Context/chat-context'
import { ChannelsSec } from '../ChannelsSec/ChannelsSec'
import { MainSec } from '../MainSec/MainSec'
import { Users } from '../Users/Users'
import style from '../MainSec/MainSec.module.css'
import UserContext from '../../../Context/user-context'

export const ChannelPage = () => {
    const { channel, isChannelSelected, currServer } = useContext(UserContext);
    // const serverId = window.location.pathname.split('/')[2];
    // setCurrServer(data);


    return (
        <>
            <ChannelsSec />
            <section className={style.main_section}>
                <div className={style.text_channel_section}>
                    <section className={style.text_channel_section}>
                        <div className={style.channel_title}><FaHashtag /> {channel.name}</div>
                    </section>
                </div>
                <div className={style.msg_user_div}>
                    {!isChannelSelected &&
                        <div className={style.channel_not_selected}>
                            <h2>Select Channel</h2>
                            <p>Click on channel & gets started ✌🏻 </p>
                        </div>}
                    {isChannelSelected && <ChatContextProvider>
                        <MainSec />
                    </ChatContextProvider>}
                    <Users slug={currServer.slug} />
                </div>
            </section>
        </>
    )
}
