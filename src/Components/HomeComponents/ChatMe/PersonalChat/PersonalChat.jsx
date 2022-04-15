import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { getUserById } from '../../../../APIs/API';
import MessageIcon from '@mui/icons-material/Message';
import CallIcon from '@mui/icons-material/Call';
import loader from '../../../../assets/Images/Loader_magnify.gif'
import style from './PersonalChat.module.css'
import ChatContext from '../../../../Context/chat-context';
import { FaHashtag, FaReply } from 'react-icons/fa';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import UserContext from '../../../../Context/user-context';
import { Image } from '../../MainSec/Image';
import { RiCloseCircleFill } from 'react-icons/ri';
import { InputForm } from '../../MainSec/InputBox/InputForm';
const imgPath = "http://192.168.100.130:3000/images/users/";

export const PersonalChat = () => {
    const [privateUser, setPrivateUser] = useState();
    const { id } = useParams();
    const messagesRef = useRef();
    const messagesStartRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [replyMessage, setReplyMessage] = useState(null);
    const { user } = useContext(UserContext);
    const { isLoading, setIsLoading, messages } = useContext(ChatContext);

    useEffect(() => {
        const getData = async () => {
            const token = JSON.parse(localStorage.getItem("token"));
            const res = await getUserById({ id, token });
            if (res.status === "success") {
                setPrivateUser(res.data.user);
            }
        }
        getData();
    }, [id]);

    const getTime = (time) => {
        let hour = new Date(time).getHours();
        let minute = new Date(time).getMinutes();
        hour = hour < 10 ? `0${hour}` : hour;
        minute = minute < 10 ? `0${minute}` : minute;
        return (`${hour}:${minute}`)
    }
    const DeleteMessageHandler = async (data) => {
    }

    const divOfListOfMesssages = Object.keys(messages).map((item) => (
        <div key={item} ref={messagesRef}>
            {messages[item].type === "Text" &&
                <div className={style.message}>
                    {messages[item].reply && messages[item].reply !== null &&
                        <div className={style.reply_div}>
                            <img src={`${imgPath}${messages[item].reply.user.image}`} alt="profile" />
                            <div className={style.username}>{messages[item].reply.user.name}</div>
                            <div className={style.rep_message}>{messages[item].reply.message}</div>
                        </div>
                    }
                    {messages[item].user._id !== messages[item - 1]?.user._id ?
                        <div className={style.message_div}>
                            <img src={`${imgPath}${messages[item].user.image}`} alt="profile" />
                            <div className={style.msg}>
                                <div className={style.message_header}>
                                    <div className={style.username}>{messages[item].user.name}</div>
                                    <div className={style.time}>{getTime(messages[item].createdAt)}</div>
                                </div>
                                <div className={style.msg_text}>{messages[item].message}</div>
                            </div>
                        </div> :
                        <div className={style.message_sub_div}>
                            <div className={style.msg}>
                                <div className={style.msg_text}>{messages[item].message}</div>
                            </div>
                        </div>
                    }
                    <div className={style.message_controller}>
                        <button className={style.message_edit}>
                            <AiFillEdit className={style.icon} fontSize="1rem" />
                        </button>
                        <button className={style.message_reply} onClick={() => {
                            setReplyMessage(messages[item]);
                        }}>
                            <FaReply className={style.icon} />
                        </button>
                        {(user.name === messages[item].user.name) &&
                            <button className={style.message_edit} onClick={() => DeleteMessageHandler(messages[item])}>
                                <AiFillDelete className={style.icon} />
                            </button>}
                    </div>
                </div>
            }
            {messages[item].type === "File" &&
                <div className={style.message}>
                    {messages[item].reply && messages[item].reply !== null &&
                        <div className={style.reply_div}>
                            <img src={`${imgPath}${messages[item].reply.user.image}`} alt="profile" />
                            <div className={style.username}>{messages[item].reply.user.name}</div>
                            <div className={style.rep_message}>{messages[item].reply.message}</div>
                        </div>
                    }
                    {messages[item].user._id !== messages[item - 1]?.user._id ?
                        <div className={style.message_div}>
                            <img src={`${imgPath}${messages[item].user.image}`} alt="profile" />
                            <div className={style.msg}>
                                <div className={style.message_header}>
                                    <div className={style.username}>{messages[item].user.name}</div>
                                    <div className={style.time}>{getTime(messages[item].createdAt)}</div>
                                </div>
                                <Image fileName={messages[item].fileName} blob={messages[item].blob} />
                            </div>
                        </div> :
                        <div className={style.message_sub_div}>
                            <div className={style.msg}>
                                <Image fileName={messages[item].fileName} blob={messages[item].blob} />
                            </div>
                        </div>
                    }
                    <div className={style.message_controller}>
                        <button className={style.message_edit}>
                            <AiFillEdit className={style.icon} fontSize="1rem" />
                        </button>
                        <button className={style.message_reply} onClick={() => {
                            setReplyMessage(messages[item]);
                        }}>
                            <FaReply className={style.icon} />
                        </button>
                        {(user.name === messages[item].user.name) &&
                            <button className={style.message_edit} onClick={() => DeleteMessageHandler(messages[item])}>
                                <AiFillDelete className={style.icon} />
                            </button>}
                    </div>
                </div>
            }
        </div>
    ));


    return (privateUser ?
        <div className={style.personal_chat}>
            <div className={style.header}>
                <div className={style.name}>{privateUser.name}</div>
                <div className={style.chat_section}></div>
                <div className={style.action_buttons}>
                    <Link to="" className={style.icon}> <MessageIcon /> </Link>
                    <Link to="" className={style.icon}> <CallIcon /> </Link>
                </div>
            </div>
            <div className={style.chat_section}>
                <div className={style.chat__wrapper}>
                    <div className={style.wrapper}>
                        {isLoading && <div className={style.Loader}>
                            <img src={loader} alt="Loading" />
                        </div>}
                        <div ref={messagesStartRef} />
                        {!isLoading && <>
                            <div className={style.initial_message} >
                                <div className={style.hash}><FaHashtag /></div>
                                <div className={style.name}>{privateUser.name}</div>
                            </div>
                            {divOfListOfMesssages}
                        </>}
                        <div ref={messagesEndRef} />
                    </div>

                </div>
                <div className={style.input_form}>
                    {replyMessage !== null && (
                        <div className={style.parent_message}>
                            <div className={style.flex_message}>
                                <div className={style.reply_message}>
                                    <img
                                        src={`${imgPath}${replyMessage.user.image}`}
                                        alt="profile"
                                    />
                                    {`${replyMessage.user.name}: ${replyMessage.message}`}
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
                    />
                </div>
            </div>
        </div> :
        <div>Loading...</div>
    )
}


