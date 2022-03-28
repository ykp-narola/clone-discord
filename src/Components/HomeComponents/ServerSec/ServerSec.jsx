import React from 'react'
import style from './ServerSec.module.css';
import accord from '../../../Assets/Loader.gif'
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlus, AiFillSetting } from 'react-icons/ai';

export default function ServerSec(props) {
    const nav = useNavigate();
    const imgPath = "http://192.168.100.130:3000/images/servers/";
    let servers = props.servers;
    function onServerClickHandler(data) {
        // console.log(data);
        props.onServerHandler(data);
    }
    function onClickAccord() {
        // props.onServerHandler({ name: "Accord" })
        props.setIsServer(false);
    }
    function onClickCreateServer() {
        nav('/user/Create-Server');
    }
    let serversObj = Object.keys(servers).map((item) => (
        <div key={item} onClick={() => onServerClickHandler(servers[item])}>
            <img
                src={`${imgPath}${servers[item].image}`}
                alt={`${item}`}
            />
        </div>
    ));

    return (
        <>
            <section className={style.servers_section}>
                <div className={style.upper}>
                    <div onClick={onClickAccord}>
                        <img src={accord} alt="Accord" />
                    </div>
                    {serversObj}
                    <div onClick={onClickCreateServer}>
                        <AiOutlinePlus color='rgb(0,150,0)' className={style.react_icon} />
                    </div>
                </div>
                <div className={style.lower}>
                    <div onClick={() => nav('/user/settings')}>
                        <AiFillSetting color='rgb(20,20,20)' className={style.react_icon} />
                    </div>
                </div>

            </section>
        </>
    )
}
