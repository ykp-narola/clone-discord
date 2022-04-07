import React, { useContext, useLayoutEffect } from 'react'
import { FaHashtag } from 'react-icons/fa'
import { ChatContextProvider } from '../../../Context/chat-context'
import { ChannelsSec } from '../ChannelsSec/ChannelsSec'
import { MainSec } from '../MainSec/MainSec'
import { Users } from '../Users/Users'
import style from '../MainSec/MainSec.module.css'
import UserContext from '../../../Context/user-context'

export const ChannelPage = () => {
    const { channel, servers, isChannelSelected, currServer, setCurrServer } = useContext(UserContext);
    const serverId = window.location.pathname.split('/')[2];
    useLayoutEffect(() => {
        for (let i in servers) {
            if (servers[i].slug === serverId) {
                setCurrServer(servers[i]);
                break;
            }
        }
        // eslint-disable-next-line
    }, []);

    return (
        <ChatContextProvider>
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
                    {isChannelSelected && <MainSec />}
                    <Users slug={currServer.slug} />
                </div>
            </section>
        </ChatContextProvider>
    )
}
