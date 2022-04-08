import React, { useContext, useEffect, useLayoutEffect } from 'react'
import { FaHashtag } from 'react-icons/fa'
import ChatContext from '../../../Context/chat-context'
import { ChannelsSec } from '../ChannelsSec/ChannelsSec'
import { MainSec } from '../MainSec/MainSec'
import { Users } from '../Users/Users'
import style from '../MainSec/MainSec.module.css'
import UserContext from '../../../Context/user-context'
import { getAllChannels } from '../../../APIs/API'
let author = { _id: -1 };

export const ChannelPage = () => {
    const { user, channel, servers, isChannelSelected, currServer, setIsAuthor, setCurrServer } = useContext(UserContext);
    const {
        setTextChannels, setVoiceChannels, setOnlineUsers
    } = useContext(ChatContext);
    const serverId = window.location.pathname.split('/')[2];
    useLayoutEffect(() => {
        for (let i in servers) {
            if (servers[i].slug === serverId) {
                setCurrServer(servers[i]);
                (servers[i].author.email, user.email) ?
                    setIsAuthor(true) : setIsAuthor(false);
                break;
            }
        }
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        (async () => {
            if (currServer.slug !== undefined) {
                const token = JSON.parse(localStorage.getItem("token"));
                const res = await getAllChannels({ token, slug: currServer.slug });
                if (res.data.server.length > 0) {
                    author = res.data.server[0].author;
                    const channels = res.data.server[0].channels;
                    setTextChannels(channels.filter((e) => { return e.type === "Text" }));
                    setVoiceChannels(channels.filter((e) => { return e.type === "Voice" }));
                    setOnlineUsers(res.data.server[0].users);
                }
            }
        })();
        // eslint-disable-next-line
    }, [currServer]);

    return (
        <>
            <ChannelsSec />
            <section className={style.main_section}>
                <div className={style.text_channel_section}>
                    <div className={style.channel_title}><FaHashtag /> {channel.name}</div>
                </div>
                <div className={style.msg_user_div}>
                    {!isChannelSelected &&
                        <div className={style.channel_not_selected}>
                            <h2>Select Channel</h2>
                            <p>Click on channel & gets started ✌🏻 </p>
                        </div>}
                    {isChannelSelected && <MainSec />}
                    <Users author={author} />
                </div>
            </section>
        </>
    )
}
