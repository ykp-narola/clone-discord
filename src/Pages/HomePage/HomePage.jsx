import React, { useContext, useEffect } from 'react'
import style from './Homepage.module.css'
import loader from '../../assets/Images/Loader.gif'
import ServerSec from '../../Components/HomeComponents/ServerSec/ServerSec';
import { Outlet, useNavigate } from 'react-router-dom';
import { getAllServers } from '../../APIs/API';
import UserContext from '../../Context/user-context';
import { io } from "socket.io-client";
import { ENDPOINT } from '../../APIs/API';

export const textSocket = io(ENDPOINT, {
    transports: ["websocket"],
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 10
});

export default function HomePage() {
    const nav = useNavigate();
    const {
        isLoading, setIsLoading,
        setUser,
        setServers,
        currServer,
        channel,
    } = useContext(UserContext);

    useEffect(() => {
        (async () => {
            const token = JSON.parse(localStorage.getItem("token"));
            const getAllServersInfo = await getAllServers(token);
            if (getAllServersInfo.status === "fail") {
                localStorage.removeItem("token");
                nav("/");
            }
            setServers(getAllServersInfo.data.user.servers);
            setUser(getAllServersInfo.data.user);
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
            {isLoading && <div className={style.Loader}>
                <img src={loader} alt="Loading..." />
            </div>
            }
            {!isLoading && <>
                <ServerSec />
                <Outlet />
            </>
            }
        </div>
    );
}
