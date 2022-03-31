import React, { useContext, useEffect } from 'react'
import { FaHashtag } from 'react-icons/fa';
import style from './Homepage.module.css'
import loader from '../../assets/Loader.gif'
import ServerSec from '../../Components/HomeComponents/ServerSec/ServerSec';
import { ChannelsSec } from '../../Components/HomeComponents/ChannelsSec/ChannelsSec'
import { MainSec } from '../../Components/HomeComponents/MainSec/MainSec';
import { Users } from '../../Components/HomeComponents/Users/Users';
import { useNavigate } from 'react-router-dom';
import { getAllServers } from '../../APIs/API';
import UserContext from '../../Contexts/user-context';

export default function HomePage() {
    const nav = useNavigate();
    const {
        isLoading, setIsLoading,
        user, setUser,
        setServers,
        currServer,
        channel,
        isChannelSelected,
        isServerSelected,
    } = useContext(UserContext);

    useEffect(() => {
        (async () => {
            const token = JSON.parse(localStorage.getItem("token"));
            const getAllServersInfo = await getAllServers(token);
            if (getAllServersInfo.status === "fail") {
                localStorage.removeItem("token");
                nav("/");
            }
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

    return (
        <div className={style.homepage} >
            {isLoading &&
                <div className={style.Loader}>
                    <img src={loader} alt="Loading..." />
                </div>
            }
            {!isLoading &&
                <>
                    <ServerSec />
                    {!isServerSelected &&
                        <div className={style.initial}>
                            <div>
                                <h1>{`Hey, ${user.name}`}</h1>
                                <p>Select server & Have a fun 😃 </p>
                            </div>
                        </div>
                    }
                    {isServerSelected &&
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
                                            <div>
                                                <h2>Select Channel</h2>
                                                <p>Click on channel & gets started ✌🏻 </p>
                                            </div>
                                        </div>}
                                    {isChannelSelected &&
                                        <MainSec />}
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
