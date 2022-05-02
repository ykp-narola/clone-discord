import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPrivateMessages, getUserById } from "../../../../APIs/API";
import MessageIcon from "@mui/icons-material/Message";
import CallIcon from "@mui/icons-material/Call";
import loader from "../../../../assets/Images/Loader_magnify.gif";
import style from "./PersonalChat.module.css";
import ChatContext from "../../../../Context/chat-context";
import { FaReply } from "react-icons/fa";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import UserContext from "../../../../Context/user-context";
import { RiCloseCircleFill } from "react-icons/ri";
import { InputForm } from "./InputForm";
import { pageScroll } from "../../MainSec/MainSec";
import { textSocket } from "../../../../Pages/HomePage/HomePage";
const notificationAudio = new Audio("https://res.cloudinary.com/du0p5yed7/video/upload/v1650957124/Accord/sounds/notification_gm5zvp.mp3");

export const PersonalChat = () => {
    const [privateUser, setPrivateUser] = useState();
    const { id } = useParams();
    const messagesRef = useRef();
    const messagesStartRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [replyMessage, setReplyMessage] = useState(null);
    const { user } = useContext(UserContext);
    const { isLoading, setIsLoading, messages, setMessages, showNotificationfunc } = useContext(ChatContext);
    const idArr = [user._id, id].sort();

    useLayoutEffect(() => {
        textSocket?.removeAllListeners();
        textSocket?.emit("leave-text-channel");
        textSocket?.emit("join-text-channel", {
            channelId: idArr[0] + idArr[1],
            userId: user._id,
        });
        textSocket?.on("delete-message", (data) => {
            setMessages((prev) => prev.filter((item) => item._id !== data._id));
        });
        textSocket?.on("new-message", (data) => {
            if (data.user1._id !== user._id) {
                if (document.hidden) {
                    showNotificationfunc({
                        msg: `${data.user1.name}: ${data.message}`,
                        title: `Accord | ${privateUser.name}`,
                    });
                    notificationAudio.play();
                }
            }
            setMessages((prev) => [...prev, data]);
            pageScroll(messagesEndRef, { behavior: "smooth" });
        });
        textSocket.on("send-files", (data) => {
            const blob = new Blob([data.body], { type: data.type });
            const obj = {
                ...data,
                blob,
            };
            setMessages((prev) => [...prev, obj]);
            pageScroll(messagesEndRef, { behavior: "smooth" });
        });
    })

    useEffect(() => {
        const getData = async () => {
            const token = JSON.parse(localStorage.getItem("token"));
            const res = await getUserById({ id, token });
            if (res.status === "success") {
                setPrivateUser(res.data.user);
                setIsLoading(false);
                (async () => {
                    const token = JSON.parse(localStorage.getItem("token"));
                    const res = await getPrivateMessages({ token, id });
                    if (res.status === "success") {
                        setMessages(res.data.messages);
                        setIsLoading(false);
                        pageScroll(messagesEndRef);
                    }
                })();
            }
        };
        getData();
        // eslint-disable-next-line
    }, [id]);

    const getTime = (time) => {
        let hour = new Date(time).getHours();
        let minute = new Date(time).getMinutes();
        hour = hour < 10 ? `0${hour}` : hour;
        minute = minute < 10 ? `0${minute}` : minute;
        return `${hour}:${minute}`;
    };
    const DeleteMessageHandler = async (data) => {
        data = { ...data, isPrivate: true, channelId: idArr[0] + idArr[1] }
        textSocket?.emit("delete-message", data);
    };

    const divOfListOfMesssages = Object.keys(messages).map((item) => (
        <div key={item} ref={messagesRef}>
            <div className={style.message}>
                {messages[item].reply && (
                    <div className={style.reply_div}>
                        <img
                            src={messages[item].reply?.user1.image}
                            alt="profile"
                        />
                        <div className={style.username}>
                            {messages[item].reply.user1.name}
                        </div>
                        <div className={style.rep_message}>
                            {messages[item].reply.message}
                        </div>
                    </div>
                )}
                {messages[item].user1._id !== messages[item - 1]?.user1._id ? (
                    <div className={style.message_div}>
                        <img
                            src={messages[item].user1.image}
                            alt="profile"
                        />
                        <div className={style.msg}>
                            <div className={style.message_header}>
                                <div className={style.username}>
                                    {messages[item].user1.name}
                                </div>
                                <div className={style.time}>
                                    {getTime(messages[item].createdAt)}
                                </div>
                            </div>
                            <div className={style.msg_text}>{messages[item].message}</div>
                        </div>
                    </div>
                ) : (
                    <div className={style.message_sub_div}>
                        <div className={style.msg}>
                            <div className={style.msg_text}>{messages[item].message}</div>
                        </div>
                    </div>
                )}
                <div className={style.message_controller}>
                    <button className={style.message_edit}>
                        <AiFillEdit className={style.icon} fontSize="1rem" />
                    </button>
                    <button
                        className={style.message_reply}
                        onClick={() => {
                            setReplyMessage(messages[item]);
                        }}
                    >
                        <FaReply className={style.icon} />
                    </button>
                    {user.name === messages[item].user1.name && (
                        <button
                            className={style.message_edit}
                            onClick={() => DeleteMessageHandler(messages[item])}
                        >
                            <AiFillDelete className={style.icon} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    ));

    return privateUser ? (
        <div className={style.personal_chat}>
            <div className={style.header}>
                <div className={style.name}>{privateUser.name}</div>
                <div className={style.action_buttons}>
                    <Link to="" className={style.icon}>
                        <MessageIcon />
                    </Link>
                    <Link to="" className={style.icon}>
                        <CallIcon />
                    </Link>
                </div>
            </div>
            <div className={style.chat_section}>
                <div className={style.chat__wrapper}>
                    <div className={style.wrapper}>
                        {isLoading && (
                            <div className={style.Loader}>
                                <img src={loader} alt="Loading" />
                            </div>
                        )}
                        <div ref={messagesStartRef} />
                        {!isLoading && (<>
                            <div className={style.initial_message}>
                                <div className={style.hash}>
                                    <img src={privateUser.image} alt="" />
                                </div>
                                <div className={style.name}>{privateUser.name}</div>
                            </div>
                            {divOfListOfMesssages}
                        </>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                <div className={style.input_form}>
                    {replyMessage !== null && (
                        <div className={style.parent_message}>
                            <div className={style.flex_message}>
                                <div className={style.reply_message}>
                                    {console.log(replyMessage)}
                                    <img
                                        src={replyMessage.user1.image}
                                        alt="profile"
                                    />
                                    {`${replyMessage.user1.name}: ${replyMessage.message}`}
                                </div>
                                <button
                                    className={style.close_btn}
                                    onClick={() => setReplyMessage(null)}
                                >
                                    <RiCloseCircleFill color="white" fontSize="1.1rem" />
                                </button>
                            </div>
                        </div>
                    )}
                    <InputForm
                        messagesStartRef={messagesStartRef}
                        messagesEndRef={messagesEndRef}
                        reply={replyMessage}
                        setReplyMessage={setReplyMessage}
                        privateUser={privateUser}
                        channelId={idArr}
                    />
                </div>
            </div>
        </div>
    ) : (
        <div>Loading...</div>
    );
};
