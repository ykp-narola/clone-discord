import React, { useContext, useEffect, useRef, useState } from 'react'
import style from './InputForm.module.css'

import { BiArrowToBottom, BiArrowToTop } from 'react-icons/bi';
import { RiSendPlaneFill } from 'react-icons/ri';

import ChatContext from '../../../../Context/chat-context';
import UserContext from '../../../../Context/user-context';

import 'emoji-mart/css/emoji-mart.css'
import { Picker, Emoji } from 'emoji-mart'
import { EmojiIDs } from '../../../../assets/Emojis';
import { DropzoneDialog } from 'material-ui-dropzone';
import { AddCircle } from '@material-ui/icons';
import { textSocket } from '../../../../Pages/HomePage/HomePage';
import { pageScroll } from '../MainSec';
import mongoose from 'mongoose';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

export const InputForm = (props) => {
    const {
        channel, user, currServer,
    } = useContext(UserContext);
    const { myMessage, setMyMessage } = useContext(ChatContext);
    const msgInputRef = useRef();

    const [isOnTop, setIsOnTop] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showAttachment, setShowAttachment] = useState(false);
    const [emojiId, setEmojiId] = useState("grinning");

    document.getElementById("message")?.addEventListener("focus", () => {
        setShowEmojiPicker(false);
    });

    useEffect(() => {
        msgInputRef.current.focus();
    }, [props.reply])

    return (
        <div className={style.chat__form}>
            <form id="inputForm" onSubmit={(e) => {
                e.preventDefault();
                if (myMessage !== "") {
                    textSocket.emit('message', {
                        _id: new mongoose.Types.ObjectId().toHexString(),
                        type: "Text",
                        isPrivate: false,
                        message: myMessage,
                        reply: props.reply,
                        user: user,
                        channelSlug: channel.slug,
                        channelId: channel._id,
                        serverId: currServer._id,
                        createdAt: (new Date()).toISOString(),
                    });
                    props.setReplyMessage(null);
                    setMyMessage("");
                }
            }}
            >
                <div className={style.container}>
                    <div className={style.input_container}>
                        <div className={style.add_attachment_btn}>
                            <Tooltip
                                title="Attach File"
                                placement="top-start"
                                TransitionComponent={Zoom}
                                arrow>
                                <button className={style.left_btn}
                                    type="button"
                                    onClick={() =>
                                        setShowAttachment(!showAttachment)
                                    } >
                                    <AddCircle className={`${style.icon} ${style.add_icon}`} />
                                </button>
                            </Tooltip>
                        </div>
                        <div className={style.chatbar_input}>
                            <input
                                ref={msgInputRef}
                                id="message"
                                type="text"
                                className={style.inputBox}
                                value={myMessage}
                                autoComplete="off"
                                placeholder={`Message #${channel.name}`}
                                onChange={e => setMyMessage(e.target.value)}
                                max="100"
                            />
                        </div>
                        <div className={style.right_btn}>
                            <div className={style.emoji_button}>
                                <button type="button" className={style.icon_btn}
                                    onClick={() => {
                                        msgInputRef.current.focus();
                                        setShowEmojiPicker(!showEmojiPicker);
                                    }}
                                >
                                    <Emoji
                                        emoji={emojiId}
                                        native={true}
                                        size={26}
                                        set={'twitter'}
                                        onLeave={() => setEmojiId(EmojiIDs[Math.floor(Math.random() * EmojiIDs.length)])}
                                    />
                                </button>
                            </div>
                            <div className={style.submit_button}>
                                <Tooltip
                                    title="Send"
                                    placement="top"
                                    TransitionComponent={Zoom}
                                    arrow>
                                    <button type="submit">
                                        <RiSendPlaneFill className={style.icon} />
                                    </button>
                                </Tooltip>
                            </div>
                            <div className={style.pagescroll_button}>
                                <Tooltip
                                    title={!isOnTop ? "Move Top" : "Move Down"}
                                    placement="top"
                                    TransitionComponent={Zoom}
                                    arrow>
                                    <button type="button" onClick={() => {
                                        pageScroll((isOnTop) ? props.messagesEndRef : props.messagesStartRef, { behavior: "smooth" });
                                        setIsOnTop(!isOnTop);
                                    }}>
                                        {!isOnTop ? <BiArrowToTop className={style.icon} /> :
                                            <BiArrowToBottom className={style.icon} />}
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    {showAttachment && <div className={style.attachment}>
                        <FileUpload parent={props} id="upload" showAttachment setShowAttachment={setShowAttachment} />
                    </div>
                    }
                    {showEmojiPicker && <div className={style.picker}>
                        <EmojiPicker setMyMessage={setMyMessage} />
                    </div>
                    }
                </div>
            </form>
        </div>
    )
}

const EmojiPicker = (props) => {
    return (
        <Picker
            autoFocus={false}
            onClick={(emoji, e) => {
                props.setMyMessage(prev => `${prev} ${emoji.native}`);
            }}
            native={true}
            perLine={12}
            showPreview={false}
            theme="dark"
            defaultSkin={1}
            set={'twitter'}
        />
    )
}

const FileUpload = (props) => {
    const [file, setFile] = useState([]);
    const {
        channel, user, currServer,
    } = useContext(UserContext);

    const onSendHandler = () => {
        props.setShowAttachment(false);
        textSocket.emit("send-files", {
            _id: new mongoose.Types.ObjectId().toHexString(),
            type: "File",
            body: file,
            fileName: file.name,
            reply: props.parent.reply,
            user: user,
            channelSlug: channel.slug,
            channelId: channel._id,
            serverId: currServer._id,
            createdAt: (new Date()).toISOString(),
        });
    };

    return (
        <DropzoneDialog
            acceptedFiles={['image/*']}
            cancelButtonText={"Cancel"}
            submitButtonText={"Send"}
            maxFileSize={5 * 1024 * 1024}
            open={props.showAttachment}
            onChange={(files) => setFile(files[0])}
            onClose={() => props.setShowAttachment(false)}
            onSave={onSendHandler}
            showPreviews={true}
            showFileNamesInPreview={true}
        />
    )
}