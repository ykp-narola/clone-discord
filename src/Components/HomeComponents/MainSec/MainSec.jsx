import React, { useEffect, useLayoutEffect, useContext } from 'react'
import style from './MainSec.module.css'
import loader from '../../../assets/Loader_magnify.gif'
import { getChannelMessages } from '../../../APIs/API';
import UserContext from '../../../Context/user-context';
import { InputForm } from './InputBox/InputForm';
import ChatContext from '../../../Context/chat-context';
const imgPath = "http://192.168.100.130:3000/images/users/";
const notificationAudio = new Audio('http://192.168.100.130:3000/sounds/notification.mp3');

export const MainSec = (props) => {
    const {
        channel, user, currServer,
    } = useContext(UserContext);
    const {
        isLoading, setIsLoading,
        socket, messages, setMessages,
        pageScroll, messagesRef,
        messagesStartRef, messagesEndRef,
        showNotificationfunc
    } = useContext(ChatContext);

    useLayoutEffect(() => {
        // socket?.disconnect();
        socket.removeAllListeners();
        socket.emit('join-text-channel', {
            channelId: channel._id,
            userId: user._id
        });
        console.log("joined ", channel.slug);

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
            pageScroll({ behavior: "smooth" });
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
        pageScroll({ behavior: "smooth" });
        // eslint-disable-next-line
    }, [divOfListOfMesssages])


    return (
        <section className={style.text_msg}>
            <div className={style.chat__wrapper}>
                {isLoading && <div className={style.Loader}>
                    <img src={loader} alt="Loading..." />
                </div>}
                <div ref={messagesStartRef} />
                {!isLoading && divOfListOfMesssages}
                <div ref={messagesEndRef} />
            </div>
            <InputForm />
        </section>
    )
}