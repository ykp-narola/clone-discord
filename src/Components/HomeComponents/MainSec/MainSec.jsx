import React, { useEffect, useLayoutEffect, useContext, useState } from 'react'
import style from './MainSec.module.css'
import loader from '../../../assets/Images/Loader_magnify.gif'
import { getChannelMessages } from '../../../APIs/API';
import UserContext from '../../../Context/user-context';
import { InputForm } from './InputBox/InputForm';
import ChatContext from '../../../Context/chat-context';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { FaHashtag, FaReply } from 'react-icons/fa';
import { GrFormClose } from 'react-icons/gr';
import { textSocket } from '../../../Pages/HomePage/HomePage';
import { RiCloseCircleFill } from 'react-icons/ri';
const imgPath = "http://192.168.100.130:3000/images/users/";
const notificationAudio = new Audio('http://192.168.100.130:3000/sounds/notification.mp3');


export const MainSec = (props) => {
    const {
        channel, user, currServer, isAuthor
    } = useContext(UserContext);
    const {
        isLoading, setIsLoading,
        messages, setMessages,
        pageScroll, messagesRef,
        messagesStartRef, messagesEndRef,
        showNotificationfunc
    } = useContext(ChatContext);

    useLayoutEffect(() => {

    }, []);

    const [replyMessage, setReplyMessage] = useState(null);

    useLayoutEffect(() => {
        // socket.disconnect();
        textSocket?.removeAllListeners();
        textSocket?.emit('leave-text-channel');
        textSocket?.emit('join-text-channel', {
            channelId: channel._id,
            userId: user._id
        });

        textSocket?.on("delete-message", data => {
            const index = data.messages.findIndex(a => {
                return a._id === data.data._id
            });
            data.messages.splice(index, 1)
            setMessages(data.messages);
        });

        textSocket?.on('new-message', data => {
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
    }, [channel]);

    const getTime = (time) => {
        let hour = new Date(time).getHours();
        let minute = new Date(time).getMinutes();
        hour = hour < 10 ? `0${hour}` : hour;
        minute = minute < 10 ? `0${minute}` : minute;
        return (`${hour}:${minute}`)
    }

    const DeleteMessageHandler = async (data) => {
        textSocket?.emit('delete-message', {
            user, data, messages
        });
    }

    const divOfListOfMesssages = Object.keys(messages).map((item) => (
        <div key={item} ref={messagesRef}>
            <div className={style.message}>
                {messages[item].reply && messages[item].reply !== null &&
                    <div className={style.reply_div}>
                        <img src={`${imgPath}${messages[item].reply.user.image}`} />
                        <div className={style.username}>{messages[item].reply.user.name}</div>
                        <div className={style.rep_message}>{messages[item].reply.message}</div>
                    </div>
                }
                <div className={style.message_div}>
                    <img src={`${imgPath}${messages[item].user.image}`} alt="" />
                    <div className={style.msg}>
                        <div className={style.message_header}>
                            <div className={style.username}>{messages[item].user.name}</div>
                            <div className={style.time}>{getTime(messages[item].createdAt)}</div>
                        </div>
                        <div className={style.msg_text}>{messages[item].message}</div>
                    </div>
                </div>
                <div className={style.message_controller}>
                    <button className={style.message_edit}>
                        <AiFillEdit className={style.icon} fontSize="1rem" />
                    </button>
                    <button className={style.message_reply} onClick={() => {
                        setReplyMessage(messages[item]);
                    }}>
                        <FaReply className={style.icon} />
                    </button>
                    {(isAuthor || user.name === messages[item].user.name) &&
                        <button className={style.message_edit} onClick={() => DeleteMessageHandler(messages[item])}>
                            <AiFillDelete className={style.icon} />
                        </button>}
                </div>
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
                <div className={style.wrapper}>
                    {isLoading && <div className={style.Loader}>
                        <img src={loader} alt="Loading" />
                    </div>}
                    <div ref={messagesStartRef} />
                    {!isLoading && <div className={style.initial_message} >
                        <div className={style.hash}><FaHashtag /></div>
                        <div className={style.name}>{channel.name}</div>
                    </div>}
                    {!isLoading && divOfListOfMesssages}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className={style.input_form}>
                {replyMessage !== null &&
                    <div className={style.parent_message}>
                        <div className={style.flex_message}>
                            <div className={style.reply_message}>
                                <img src={`${imgPath}${replyMessage.user.image}`} />
                                {`${replyMessage.user.name}: ${replyMessage.message}`}
                            </div>
                            <button className={style.close_btn} onClick={() =>
                                setReplyMessage(null)
                            }>
                                <RiCloseCircleFill color='white' fontSize="1.1rem" />
                            </button>
                        </div>
                    </div>
                }
                <InputForm reply={replyMessage} setReplyMessage={setReplyMessage} />
            </div>
        </section>
    )
}