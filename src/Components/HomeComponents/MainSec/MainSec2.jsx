import React, { useEffect, useState, useRef } from 'react'
import style from './MainSec.module.css'
import loader from '../../../Assets/msgLoader.gif'
// import socketIOClient from "socket.io-client";
import { RiSendPlaneFill } from 'react-icons/ri';
// import { io } from "socket.io-client";
import io from "socket.io-client";
const imgPath = "http://192.168.100.130:3000/images/users/";
// const socket = io("http://192.168.100.130:3000");
const ENDPOINT = "http://192.168.100.130:3000";
// import { io } from "socket.io-client";
// import socketIOClient from "socket.io-client";
// const socket = io("http://192.168.100.130:3000");

let socket;
export const MainSec = (props) => {
    // let socket = io(ENDPOINT);
    // let socket = socket2;
    const [isLoading, setIsLoading] = useState(true);
    const [myMsg, setMyMsg] = useState();
    const [messages, setMessages] = useState([]);
    const msgInputRef = React.createRef();
    const messagesRef = React.createRef();
    const messagesEndRef = useRef(null);
    // const [divOfMsg, setDivOfListOfMsg] = useState();
    // const socket = socketIOClient(ENDPOINT);

    function pageScroll() {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useLayoutEffect(() => {
        socket = io(ENDPOINT);
    }, [props.channelSlug]);

    useEffect(() => {
        console.log("run only once");
        socket.on('connected', () => {
            console.log("connecting...", props.channelSlug);
            // socket.emit('join-channel', props.channelSlug);
            socket.emit('join-channel', props.channelSlug);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
        socket.on('newMessage', data => {
            console.log("r : ", data);
            setMessages((prev) => [...prev, data]);
            pageScroll();
        });
    }, [props.channelSlug]);

    // const sendMsg = (data) => {
    //     console.log(data);
    //     socket.emit('message', data);
    // }


    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/servers/${props.serverSlug}/channels/${props.channelSlug}/messages`, {
                headers: {
                    "Authorization": `Bearer ${token.substring(1, token.length - 1)}`
                }
            }).then(data => data.json());
            if (res.status === "success") {
                console.log("success");
                setMessages(res.data.messages);
                setIsLoading(false);
                pageScroll();
            }
        })();
    }, [props]);

    // useEffect(() => {
    //     (async () => {
    //         const token = localStorage.getItem("token");
    //         const res = await fetch(`/api/servers/${props.serverSlug}/channels/${props.channelSlug}/messages`, {
    //             headers: {
    //                 "Authorization": `Bearer ${token.substring(1, token.length - 1)}`
    //             }
    //         }).then(data => data.json());
    //         if (res.status === "success") {
    //             setMessages(res.data.messages);
    //             setIsLoading(false);
    //             pageScroll();
    //         }
    //     })();
    //     console.log("try to connect");
    //     console.log("socket: ", socket);
    //     socket.on("connect", () => {
    //         console.log("connected to backend");
    //         socket.emit("join-channel", props.channelSlug);
    //     })
    // }, [props]);

    // socket.on('newMessage', data => {
    //     console.log("msg received: ", data);
    //     setMessages((prev) => [...prev, data]);
    // });

    // useEffect(() => {
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [props]);

    function getTime(time) {
        let hour = new Date(time).getHours();
        let minute = new Date(time).getMinutes();
        hour = hour < 10 ? `0${hour}` : hour;
        minute = minute < 10 ? `0${minute}` : minute;
        return (`${hour}:${minute}`)
    }

    const divOfListOfMesssages = Object.keys(messages).map((item) => (
        <div key={item} className={style.message} ref={messagesRef}>
            <img src={imgPath + messages[item].user.image} alt="" />
            <div className={style.msg}>
                <div className={style.message_header}>
                    <div className={style.username}>{messages[item].user.name}</div>
                    <div className={style.time}>{getTime(messages[item].createdAt)}</div>
                </div>
                <div className={style.msg_text}>{messages[item].message}</div>
            </div>
        </div>
    ));
    return (
        <section className={style.text_msg}>
            <div className={style.chat__wrapper}>
                {isLoading && <div className={style.Loader}>
                    <img src={loader} alt="Loading..." />
                </div>}
                {!isLoading && divOfListOfMesssages}
                {/* {!isLoading && divOfMsg} */}
                <div ref={messagesEndRef} />
            </div>
            <div className={style.chat__form}>
                <form id="inputForm"
                    onSubmit={(e) => {
                        e.preventDefault();
                        console.log(socket);
                        socket.emit('message', {
                            message: myMsg,
                            user: props.user,
                            channelSlug: props.channelSlug,
                            channel: props.channelId,
                            server: props.serverId,
                        });
                        // sendMsg({
                        //     message: myMsg,
                        //     user: props.user,
                        //     channelSlug: props.channelSlug,
                        //     channel: props.channelId,
                        //     server: props.serverId,
                        // });
                        console.log("emitted")
                        // setMessages((prev) => [...prev, {
                        //     message: myMsg,
                        //     user: props.user,
                        //     channelSlug: props.channelSlug,
                        //     channelId: props.channelId,
                        //     serverId: props.serverId,
                        // }]);
                        // pageScroll();
                        msgInputRef.current.value = "";
                    }}
                >
                    <input
                        ref={msgInputRef}
                        id="message"
                        type="text"
                        className={style.inputBox}
                        autoComplete="off"
                        placeholder="Type your message here ..."
                        onChange={e => setMyMsg(e.target.value)}
                    />
                    <button type="submit">
                        <RiSendPlaneFill className={style.send_icon} />
                    </button>
                </form>
            </div>
        </section>
    )
}

    // useEffect(() => {
    //     (async () => {
    //         const token = localStorage.getItem("token");
    //         const res = await fetch(`/api/servers/${props.serverSlug}/channels/${props.channelSlug}/messages`, {
    //             headers: {
    //                 "Authorization": `Bearer ${token.substring(1, token.length - 1)}`
    //             }
    //         }).then(data => data.json());
    //         if (res.status === "success") {
    //             setMessages(res.data.messages);
    //             setIsLoading(false);
    //             pageScroll();
    //         }
    //     })();
    //     console.log("try to connect");
    //     console.log("socket: ", socket);
    //     socket.on("connect", () => {
    //         console.log("connected to backend");
    //         socket.emit("join-channel", props.channelSlug);
    //     })
    // }, [props]);

    // socket.on('newMessage', data => {
    //     console.log("msg received: ", data);
    //     setMessages((prev) => [...prev, data]);
    // });

    // useEffect(() => {
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [props]);
