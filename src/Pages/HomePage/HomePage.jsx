import React, { useContext, useEffect } from 'react'
import style from './Homepage.module.css'
import loader from '../../assets/Images/Loader.gif'
import ServerSec from '../../Components/HomeComponents/ServerSec/ServerSec';
import { Outlet, useNavigate } from 'react-router-dom';
import { getAllServers } from '../../APIs/API';
import UserContext from '../../Context/user-context';

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
