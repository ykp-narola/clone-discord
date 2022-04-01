import React, { useContext, useRef, useState } from 'react'
import style from './InputForm.module.css'

import { BiArrowToBottom, BiArrowToTop } from 'react-icons/bi';
import { RiSendPlaneFill } from 'react-icons/ri';

import ChatContext from '../../../../Context/chat-context';
import UserContext from '../../../../Context/user-context';
import { GrAddCircle, GrAttachment } from 'react-icons/gr';
import { MdAdd, MdAddAPhoto, MdAddPhotoAlternate, MdOutlineEmojiEmotions } from 'react-icons/md';
import { ImFilePicture } from 'react-icons/im';
import { AiOutlineGif } from 'react-icons/ai';

// import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
// import { Picker } from 'emoji-mart'
// import { Emoji } from 'emoji-mart'

import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'


export const InputForm = (props) => {
    const {
        channel, user, currServer,
    } = useContext(UserContext);
    const {
        isOnTop, socket,
        myMessage, setMyMessage,
        pageScroll, messagesStartRef
    } = useContext(ChatContext);
    const msgInputRef = useRef();

    const [showPicker, setShowPicker] = useState(false);

    const onEmojiClick = (e) => {
        // console.log(e.native);
        // setShowPicker(false);
        setMyMessage(myMessage + e.native);
        document.getElementById("message").focus();
    };

    document.getElementById("message")?.addEventListener("focus", () => {
        setShowPicker(false);
    });

    return (
        <div className={style.chat__form}>
            <form id="inputForm" onSubmit={(e) => {
                e.preventDefault();
                if (myMessage !== "") {
                    socket.emit('message', {
                        message: myMessage,
                        user: user,
                        channelSlug: channel.slug,
                        channelId: channel._id,
                        serverId: currServer._id,
                        createdAt: (new Date()).toISOString(),
                    });
                    msgInputRef.current.value = "";
                    setMyMessage("");
                }
            }}
            >
                <div className={style.container}>
                    <div className={style.input_container}>
                        <button className={style.left_btn}>
                            <GrAttachment className={`${style.icon} ${style.add_icon}`} />
                        </button>
                        <input
                            ref={msgInputRef}
                            id="message"
                            type="text"
                            className={style.inputBox}
                            value={myMessage}
                            autoComplete="off"
                            placeholder="Type your message here ..."
                            onChange={e => setMyMessage(e.target.value)}
                            max="100"
                        />
                        <div className={style.right_btn}>
                            <button type="button" className={`${style.icon_btn} ${style.emoji_btn}`} onClick={() => {
                                setShowPicker(!showPicker);
                            }}>
                                {/* <Emoji emoji='smiley' set='apple' size={25} /> */}
                                <MdOutlineEmojiEmotions className={`${style.icon} ${style.emoji}`} />
                            </button>
                            <button className={style.icon_btn}>
                                <AiOutlineGif className={`${style.icon} ${style.add_photo}`} />
                            </button>
                            <button className={style.icon_btn}>
                                <MdAddAPhoto className={`${style.icon} ${style.add_photo}`} />
                            </button>
                            <button type="submit">
                                <RiSendPlaneFill className={style.icon} />
                            </button>
                            <button onClick={() => {
                                if (isOnTop) {
                                    pageScroll({ behavior: "smooth" });
                                } else {
                                    messagesStartRef.current?.scrollIntoView({ behavior: "smooth" });
                                }
                            }
                            }>
                                {!isOnTop ? <BiArrowToTop className={style.icon} /> :
                                    <BiArrowToBottom className={style.icon} />
                                }
                            </button>
                        </div>
                    </div>
                    <div className={style.picker}>
                        {showPicker &&
                            <Picker
                                theme="dark"
                                onSelect={(e) => onEmojiClick(e)}
                            />
                            // <Picker
                            //     onEmojiClick={onEmojiClick}
                            //     disableAutoFocus={true}
                            //     skinTone={SKIN_TONE_MEDIUM_DARK}
                            //     theme="dark"
                            //     groupNames={{ smileys_people: 'PEOPLE' }}
                            //     native
                            // />
                        }
                    </div>
                </div>
            </form>
        </div>
    )
}
