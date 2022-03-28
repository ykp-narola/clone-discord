import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import style from './MainSec.module.css'
import loader from '../../../Assets/Loader_magnify.gif'
import { RiSendPlaneFill } from 'react-icons/ri';
import io from "socket.io-client";
// import Peer from 'peerjs';

const imgPath = "http://192.168.100.130:3000/images/users/";
const ENDPOINT = "http://192.168.100.130:3000";
let socket;
export const MainSec = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [myMsg, setMyMsg] = useState();
    const msgInputRef = useRef();
    const messagesRef = React.createRef();
    const messagesEndRef = useRef(null);

    useLayoutEffect(() => {
        socket = io(ENDPOINT);
        // console.log(socket);
    }, [props.channelId]);

    useEffect(() => {
        // socket?.disconnect();
        socket.removeAllListeners();
        socket.emit('join-channel', {
            channelId: props.channelId,
            userId: props.user._id
        });
        console.log("joined ", props.channelSlug);

        // **************************

        // const myPeer = new Peer(undefined, {
        //     host: "/",
        //     port: "3001",
        // });
        // const myVideo = document.createElement("video");
        // myVideo.muted = true;

        // socket.on("user-disconnected", (userId) => {
        //     console.log(`${userId} disconnected...`);
        //     if (peers[userId]) {
        //         peers[userId].close();
        //         console.log(userId, " disconnected");
        //     }
        // });

        // navigator.mediaDevices
        //     .getUserMedia({
        //         video: false,
        //         audio: true,
        //     })
        //     .then((stream) => {
        //         console.log('hi');
        //         addVideoStream(myVideo, stream);
        //         myPeer.on("call", (call) => {
        //             call.answer(stream);
        //             const video = document.createElement("video");
        //             call.on("stream", (userVideoStream) => {
        //                 addVideoStream(video, userVideoStream);
        //             });
        //         });

        //         socket.on("user-connected", (userId) => {
        //             console.log("userId: ", userId);
        //             connectToNewUser(userId, stream);
        //         });
        //     });

        // myPeer.on("open", (userId) => {
        //     console.log(`${userId} connected...`);
        //     if (peers[userId]) {
        //         peers[userId].close();
        //         console.log('Call cut...');
        //         console.log(peers);
        //     }

        //     socket.emit("join-channel", { channelId: props.channelId, userId });
        // });

        // function connectToNewUser(userId, stream) {
        //     console.log('hi from connect to new user');
        //     const call = myPeer.call(userId, stream);
        //     console.log(call);
        //     const video = document.createElement("video");
        //     call.on("stream", (userVideoStream) => {
        //         addVideoStream(video, userVideoStream);
        //     });
        //     call.on("close", () => {
        //         video.remove();
        //     });

        //     console.log(call);
        //     peers[userId] = call;
        // }

        // function addVideoStream(video, stream) {
        //     video.srcObject = stream;
        //     video.addEventListener("loadedmetadata", () => {
        //         video.play();
        //     });
        //     // videoGrid.append(video);
        // }

        // ***************************************

        // socket.emit('join-channel', props.channelSlug);

        socket.on('new-message', data => {
            console.log("msg received ", data);
            setMessages((prev) => [...prev, data]);
            pageScroll();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.channelId]);

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/servers/${props.serverSlug}/channels/${props.channelSlug}/messages`, {
                headers: {
                    "Authorization": `Bearer ${token.substring(1, token.length - 1)}`
                }
            }).then(data => data.json());
            if (res.status === "success") {
                setMessages(res.data.messages);
                setIsLoading(false);
                pageScroll();
            }
        })();
    }, [props]);
    function pageScroll() {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    function getTime(time) {
        let hour = new Date(time).getHours();
        let minute = new Date(time).getMinutes();
        hour = hour < 10 ? `0${hour}` : hour;
        minute = minute < 10 ? `0${minute}` : minute;
        return (`${hour}:${minute}`)
    }
    const divOfListOfMesssages = Object.keys(messages).map((item) => (
        <div key={item} className={style.message} ref={messagesRef}>
            <img src={`${imgPath}${messages[item].user.image}`} alt="" />
            <div className={style.msg}>
                <div className={style.message_header}>
                    <div className={style.username}>{messages[item].user.name}</div>
                    <div className={style.time}>{getTime(messages[item].createdAt)}</div>
                </div>
                <div className={style.msg_text}>{messages[item].message}</div>
            </div>
        </div>
    ));

    useEffect(() => {
        pageScroll();
    }, [divOfListOfMesssages])


    return (
        <section className={style.text_msg}>
            <div className={style.chat__wrapper}>
                {isLoading && <div className={style.Loader}>
                    <img src={loader} alt="Loading..." />
                </div>}
                {!isLoading && divOfListOfMesssages}
                <div ref={messagesEndRef} />
            </div>
            <div className={style.chat__form}>
                <form id="inputForm"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (myMsg !== "") {
                            socket.emit('message', {
                                message: myMsg,
                                user: props.user,
                                channelSlug: props.channelSlug,
                                channelId: props.channelId,
                                serverId: props.serverId,
                                createdAt: (new Date()).toISOString(),
                            });
                            setMessages((prev) => [...prev, {
                                message: myMsg,
                                user: props.user,
                                channelSlug: props.channelSlug,
                                channelId: props.channelId,
                                serverId: props.serverId,
                                createdAt: (new Date()).toISOString(),
                            }]);
                            msgInputRef.current.value = "";
                            setMyMsg("");
                        }
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
                        max="250"
                    />
                    <button type="submit">
                        <RiSendPlaneFill className={style.send_icon} />
                    </button>
                </form>
            </div>
        </section>
    )
}