{/* <div className={style.message}>
                    <img src={img} alt="" />
                    <div className={style.msg}>
                        <div className={style.username}>Michel</div>
                        <div className={style.msg_text}>Hello, Good Morning</div>
                    </div>
                </div>
                <div className={style.message}>
                    <img src={img} alt="" />
                    <div className={style.msg}>
                        <div className={style.username}>Michel</div>
                        <div className={style.msg_text}>Hello, Good Morning</div>
                    </div>
                </div>
                <div className={style.message}>
                    <img src={img} alt="" />
                    <div className={style.msg}>
                        <div className={style.username}>Michel</div>
                        <div className={style.msg_text}>Hello, Good Morning</div>
                    </div>
                </div> */}

// divOfListOfMesssages = Object.keys(messages).map((item) => (
//     <div key={item} className={style.message}>
//         {/* {console.log(imgPath + messages[item].user.image)} */}
//         {/* <img src={imgPath + messages[item].user.image} alt="" /> */}
//         <img src={imgPath + 'Accord.png'} alt="" />
//         <div className={style.msg}>
//             <div className={style.username}>{messages[item].user.name}</div>
//             <div className={style.msg_text}>{messages[item].message}</div>
//         </div>
//     </div>
// ));

import React, { useEffect, useState } from 'react'
import style from './MainSec.module.css'
import loader from '../../../Assets/Loader.gif'
import socketIOClient from "socket.io-client";
import { RiSendPlaneFill } from 'react-icons/ri';
const ENDPOINT = "http://192.168.100.130:3000";
const imgPath = "http://192.168.100.130:3000/images/users/";

export const MainSec = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [myMsg, setMyMsg] = useState();
    const [messages, setMessages] = useState([]);
    const msgInputRef = React.createRef();
    const socket = socketIOClient(ENDPOINT);
    // let divOfListOfMesssages;
    const [divOfMessages, setDivOfListOfMsg] = useState();

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on("connected", () => {
            socket.emit("join-channel", props.channelSlug)
        })
        socket.on("newMessage", data => {
            console.log(data);
            setMessages((prev) => [...prev, data]);
        });

        // CLEAN UP THE EFFECT  
        // return () => {
        //     socket.disconnect();
        //     // setState({});
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

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
                setDivOfListOfMsg(Object.keys(messages).map((item) => (
                    <div key={item} className={style.message}>
                        {/* <img src={imgPath + messages[item].user.image} alt="" /> */}
                        <img src={imgPath + 'Accord.png'} alt="" />
                        <div className={style.msg}>
                            <div className={style.username}>{messages[item].user.name}</div>
                            <div className={style.msg_text}>{messages[item].message}</div>
                        </div>
                    </div>
                )));
            }
        })();
        setIsLoading(false);
    }, [props.channelSlug]);

    return (
        <section className={style.text_msg}>
            {isLoading &&
                <div className={style.Loader}>
                    <img src={loader} alt="Loading..." />
                </div>
            }
            {!isLoading &&
                <div className={style.chat__wrapper}>
                    {/* {divOfListOfMesssages} */}
                    {divOfMessages}
                </div>
            }
            <div className={style.chat__form}>
                <form id="inputForm"
                    onSubmit={(e) => {
                        e.preventDefault();
                        // let msg =
                        //     setMessages((prev) => [...prev, data]);
                        socket.emit("message", {
                            message: myMsg,
                            username: props.user.name,
                            image: props.user.image,
                            channelSlug: props.channelSlug,
                            channelId: props.channelId,
                            serverId: props.serverId,
                            userId: props.user._id
                        });
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
    //     const socket = io();
    //     socket.connect();
    //     // socket.on("recieve_message", setMessage);

    //     // setSocket(soc);
    //     console.log(socket);
    //     socket.on("connected", () => {
    //         console.log("user connected");
    //         socket.emit("join-channel", props.channelSlug)
    //     })
    //     socket.on("new-message", data => {
    //         console.log("new msg receeived");
    //         setMessages((prev) => [...prev, data]);
    //         pageScroll();
    //     });
    //     return () => {
    //         socket.disconnect();
    //     }
    // }, []);
    // useEffect(() => {
    //     (async () => {
    //         const soc = io("http://192.168.100.130:3000");
    //         setSocket(soc);
    //         console.log(socket);
    //         if (socket.connected === true) {
    //             socket.on("connected", () => {
    //                 console.log("user connected");
    //                 socket.emit("join-channel", props.channelSlug)
    //             })
    //             socket.on("new-message", data => {
    //                 console.log("new msg receeived");
    //                 setMessages((prev) => [...prev, data]);
    //                 pageScroll();
    //             });
    //         } else {
    //             console.log("not connected");
    //         }
    //     })();
    // }, []);

    // useEffect(() => {
    //     console.log("isconnected: ", socket.connected);
    //     if (socket.connected === true) {
    //         // console.log("cant connect");
    //         socket.on("connected", () => {
    //             console.log("connected");
    //             socket.emit("join-channel", props.channelSlug)
    //         })
    //         socket.on("new-message", data => {
    //             console.log("new msg");
    //             setMessages((prev) => [...prev, data]);
    //             pageScroll();
    //         });
    //     }
    // }, [state]);