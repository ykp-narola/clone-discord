import React, { useContext } from 'react'
import style from './ServerSec.module.css';
import accord from '../../../assets/Images/Accord.png'
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlinePlus, AiFillSetting } from 'react-icons/ai';
import UserContext from '../../../Context/user-context';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

export default function ServerSec() {
    const nav = useNavigate();
    const { user, servers, setIsAuthor, setCurrServer, setIsServerSelected } = useContext(UserContext);
    function onServerClickHandler(data) {
        setCurrServer(data);
        setIsServerSelected(true);
        (data.author.email === user.email) ?
            setIsAuthor(true) : setIsAuthor(false);
    }
    const onClickCreateServer = () => nav('/user/Create-Server');

    let serversObj = Object.keys(servers).map((item) => (
        <div key={item} onClick={() => {
            onServerClickHandler(servers[item]);
        }}>
            <Link to={`/channels/${servers[item].slug}/${servers[item].channels[0].slug}`}>
                <Tooltip
                    TransitionComponent={Zoom}
                    classes={{ tooltip: style.tooltip }}
                    title={servers[item].name}
                    placement="right"
                    arrow>
                    <img
                        src={servers[item].image}
                        alt={`${item}`}
                    />
                </Tooltip>
            </Link>
        </div>
    ));

    return (<>
        <section className={style.servers_section}>
            <div className={style.upper}>
                <div onClick={() => setIsServerSelected(false)}>
                    <Link to={`/channels/@me`}>
                        <Tooltip title="Accord" TransitionComponent={Zoom} classes={{ tooltip: style.tooltip }} placement="right" arrow>
                            <img src={accord} alt="Accord" />
                        </Tooltip>
                    </Link>
                </div>
                {serversObj}
                <div onClick={() => {
                    onClickCreateServer();
                }}>
                    <AiOutlinePlus color='rgb(0,150,0)' className={style.react_icon} />
                </div>
            </div>
            <div className={style.lower}>
                <div onClick={() => nav('/user/settings/profile')}>
                    <AiFillSetting color='rgb(20,20,20)' className={style.react_icon} />
                </div>
            </div>
        </section>
    </>
    )
}
