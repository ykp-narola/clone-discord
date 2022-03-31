import React, { useEffect, useState, useRef, useLayoutEffect, useContext } from 'react'
import style from './MainSec.module.css'
import loader from '../../../assets/Loader_magnify.gif'
import { RiSendPlaneFill } from 'react-icons/ri';
import io from "socket.io-client";
import { getChannelMessages } from '../../../APIs/API';
import UserContext from '../../../Contexts/user-context';

const imgPath = "http://192.168.100.130:3000/images/users/";
const ENDPOINT = "http://192.168.100.130:3000";
const notificationAudio = new Audio('http://192.168.100.130:3000/sounds/notification.mp3');

let socket;
const showError = () => {
    console.log("Error Occured");
};
let granted = false;
const requestPermission = async () => {
    if (Notification.permission === "granted") {
        granted = true;
    } else if (Notification.permission !== "denied") {
        let permission = await Notification.requestPermission();
        granted = permission === "granted" ? true : false;
    }
}
const showNotificationfunc = (data = { msg: "not defined", title: "Accord Web App" }) => {
    if (!granted) {
        requestPermission();
    }
    let showNotification = () => {
        // create a new notification
        let notification = new Notification(data.title, {
            body: data.msg,
            timestamp: 1000,
            icon: `${imgPath}Accord.png`,
            vibrate: true,
            dir: 'rtl'
        });
        // close the notification after 10 seconds
        setTimeout(() => {
            notification.close();
        }, 10 * 1000);

        // navigate to a URL when clicked
        notification.addEventListener("click", () => {
            // window.open("https://www.google.com", "_blank");
        });
    };
    granted ? showNotification() : showError();
}

export const MainSec = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [myMsg, setMyMsg] = useState();
    const msgInputRef = useRef();
    const messagesRef = React.createRef();
    const messagesEndRef = useRef(null);

    const { channel, user, currServer } = useContext(UserContext);

    useLayoutEffect(() => {
        socket = io(ENDPOINT);
        // console.log(socket);
    }, [channel._id]);

    useEffect(() => {
        // socket?.disconnect();
        socket.removeAllListeners();
        socket.emit('join-text-channel', {
            channelId: channel._id,
            userId: user._id
        });
        // console.log("joined ", channel.slug);

        socket.on('new-message', data => {
            if (document.hidden) {
                if (data.user._id !== user._id) {
                    showNotificationfunc({
                        msg: `${data.user.name}: ${data.message}`,
                        title: `Accord | ${currServer.slug}`
                    });
                    notificationAudio.play();
                }
            }
            setMessages((prev) => [...prev, data]);
            pageScroll();
        });
        // eslint-disable-next-line
    }, [channel._id]);

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            const token = JSON.parse(localStorage.getItem("token"));
            const res = await getChannelMessages({ token, serverSlug: currServer.slug, channelSlug: channel.slug });
            if (res.status === "success") {
                setMessages(res.data.messages);
                setIsLoading(false);
                pageScroll();
            }
        })();
        // eslint-disable-next-line
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
                                user: user,
                                channelSlug: channel.slug,
                                channelId: channel._id,
                                serverId: currServer._id,
                                createdAt: (new Date()).toISOString(),
                            });
                            // setMessages((prev) => [...prev, {
                            //     message: myMsg,
                            //     user: user,
                            //     channelSlug: channel.slug,
                            //     channelId: channel._id,
                            //     serverId: currServer._id,
                            //     createdAt: (new Date()).toISOString(),
                            // }]);
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