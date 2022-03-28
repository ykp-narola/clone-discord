import React, { useEffect, useState } from 'react'
import { FaHashtag } from 'react-icons/fa';
import style from './Homepage.module.css'
import loader from '../../Assets/Loader.gif'
import ServerSec from '../../Components/HomeComponents/ServerSec/ServerSec';
import { ChannelsSec } from '../../Components/HomeComponents/ChannelsSec/ChannelsSec'
import { MainSec } from '../../Components/HomeComponents/MainSec/MainSec';
import { Users } from '../../Components/HomeComponents/Users/Users';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const nav = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isServerSelected, setIsServerSelected] = useState(false);
    const [isChannelSelected, setIsChannelSelected] = useState(false);
    const [user, setUser] = useState({});
    const [servers, setServers] = useState({});
    const [currServer, setCurrServer] = useState({});
    const [channel, setChannel] = useState({});
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
        (async () => {
            const getAllServersInfo = await getAllServers();
            const getUserServers = getAllServersInfo.data.user.servers;
            setServers(getUserServers);
            const userInfo = getAllServersInfo.data.user;
            setUser(userInfo);
            setIsLoading(false)
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (channel.name !== undefined)
            document.title = `# ${channel.name}  |  ${currServer.name}`;
    }, [channel, currServer]);

    async function getAllServers() {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/users/", {
            headers: {
                "Authorization": `Bearer ${token.substring(1, token.length - 1)}`
            }
        }).then(data => data.json());
        if (res.status === "fail") {
            localStorage.removeItem("token");
            nav("/");
        }
        return res;
    };

    const onServerHandler = data => {
        (data.author.email === user.email) ?
            setIsAuthor(true) : setIsAuthor(false);
        setCurrServer(data);
        setIsServerSelected(true);
    }

    return (
        <div className={style.homepage} >
            {isLoading &&
                <div className={style.Loader}>
                    <img src={loader} alt="Loading..." />
                </div>
            }
            {!isLoading &&
                <>
                    <ServerSec servers={servers} setIsServer={setIsServerSelected} onServerHandler={onServerHandler} />
                    {!isServerSelected &&
                        <div className={style.initial}>
                            <div>
                                <h1>{`Hey, ${user.name}`}</h1>
                                <p>Click on server & Have a fun 😃 </p>
                            </div>
                        </div>
                    }
                    {isServerSelected &&
                        <>
                            <ChannelsSec author={isAuthor} user={user} setIsChannelSel={setIsChannelSelected} currServer={currServer} setChannel={setChannel} />
                            <section className={style.main_section}>
                                <div className={style.text_channel_section}>
                                    <section className={style.text_channel_section}>
                                        <div className={style.channel_title}><FaHashtag /> {channel.name}</div>
                                    </section>
                                </div>
                                <div className={style.msg_user_div}>
                                    {!isChannelSelected &&
                                        <div className={style.channel_not_selected}>
                                            <div>
                                                <h2>Select Channel</h2>
                                                <p>Click on channel & gets started ✌🏻 </p>
                                            </div>
                                        </div>}
                                    {isChannelSelected &&
                                        <MainSec user={user} serverId={currServer._id} serverSlug={currServer.slug} channelId={channel._id} channelSlug={channel.slug} />}
                                    <Users slug={currServer.slug} />
                                </div>
                            </section>
                        </>
                    }
                </>
            }
        </div>
    );
}
