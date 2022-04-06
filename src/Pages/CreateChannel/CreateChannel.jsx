import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import style from './CreateChannel.module.css'
import { getAllChannels, onCreateChannel, onDeleteChannel } from '../../APIs/API'

export const CreateChannel = () => {
    const nav = useNavigate();
    const createChannelRef = React.createRef();
    const deleteChannelRef = React.createRef();
    const [channelName, setChannelName] = useState("");
    const [channelType, setChannelType] = useState("Text");
    const [slug, setSlug] = useState("");
    const [isError, setIsError] = useState(false);
    const serverSlug = window.location.pathname.split('/')[3];

    const [textChannels, setTextChannels] = useState([]);
    const [voiceChannels, setVoiceChannels] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const token = JSON.parse(localStorage.getItem("token"));
            const res = await getAllChannels({ token, slug: serverSlug });
            if (res.data.server.length > 0) {
                const channels = res.data.server[0].channels;
                setTextChannels(channels.filter((e) => { return e.type === "Text" }));
                setVoiceChannels(channels.filter((e) => { return e.type === "Voice" }));
            }
        }
        fetchData();
        // eslint-disable-next-line
    }, []);

    const onCreateChannelHandler = async (e) => {
        e.preventDefault();
        sessionStorage.removeItem("error");
        setIsError(false);
        let token = localStorage.getItem("token");
        token = token.substring(1, token.length - 1);
        const data = await onCreateChannel({ token, channelName, channelType, serverSlug });
        console.log(data);
        if (data.status === 'success') {
            setIsError(false);
            sessionStorage.removeItem("error");
            nav("/");
        } else {
            sessionStorage.setItem("error", JSON.stringify(data.message));
            setIsError(true);
        }
    }
    const onDeleteChannelHandler = async e => {
        e.preventDefault();
        sessionStorage.removeItem("error");
        setIsError(false);
        if (slug !== "") {
            let token = localStorage.getItem("token");
            token = token.substring(1, token.length - 1);
            await onDeleteChannel({ token, channelType, slug, serverSlug });
            nav("/");
        } else {
            sessionStorage.setItem("error", JSON.stringify("Server Name can't be empty"));
            setIsError(true);
        }
    }
    const openForm = (ref) => ref.current.style.display = "block";
    const closeForm = (ref) => ref.current.style.display = "none";
    const onCancelChannelHandler = e => {
        e.preventDefault();
        nav("/");
    }
    const openCity = (ref) => {
        if (ref === createChannelRef) {
            closeForm(deleteChannelRef);
            openForm(createChannelRef);
        }
        else if (ref === deleteChannelRef) {
            closeForm(createChannelRef);
            openForm(deleteChannelRef);
        }
        setIsError(false);
    }
    useEffect(() => {
        openCity(createChannelRef);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className={style.page__container}>
            <div className={style.form__container}>
                <div className={`${style.header} ${style.welcome}`}>New Channel</div>
                <div className={style.tab} onLoad={() => openCity(createChannelRef)}>
                    <button className={style.tablinks} onClick={() => openCity(createChannelRef)}>Create Channel</button>
                    <button className={style.tablinks} onClick={() => openCity(deleteChannelRef)}>Delete Channel</button>
                </div>
                {isError && <div className={style.error_msg}>{JSON.parse(sessionStorage.getItem("error"))}</div>}
                <div ref={createChannelRef} className="tabcontent" id="createChannel">
                    <div className={style.container}>
                        <form>
                            <div className={style.inputField}>
                                <div className={style.custom_select}>
                                    <select value={channelType} onChange={(e) => setChannelType(e.target.value)}>
                                        <option value="Text">Text Channel</option>
                                        <option value="Voice">Voice Channel</option>
                                    </select>
                                </div>
                                <div>
                                    <input
                                        className={style.inputBox}
                                        type="text"
                                        id='ChannelName'
                                        placeholder='Channel Name'
                                        onChange={e => setChannelName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button className={style.create_btn} onClick={onCreateChannelHandler} type='submit'>Create</button>
                            <button className={style.cancel_btn} onClick={onCancelChannelHandler}>Cancel</button>
                        </form>
                    </div>
                </div>
                <div ref={deleteChannelRef} className="tabcontent" id="deleteChannel">
                    <div className={style.container}>
                        <form>
                            <div className={style.inputField}>
                                <div className={style.custom_select}>
                                    <select value={channelType} onChange={(e) => setChannelType(e.target.value)}>
                                        <option value="Text">Text Channel</option>
                                        <option value="Voice">Voice Channel</option>
                                    </select>
                                </div>
                                <div className={style.delete_select}>
                                    {channelType === "Text" &&
                                        <select value={slug} onChange={(e) => { setSlug(e.target.value); }}>
                                            {textChannels.map((item) => (
                                                <option key={item._id} value={`${item?.slug}`}>{item?.name}</option>
                                            ))}
                                        </select>
                                    }
                                    {channelType === "Voice" &&
                                        <select value={slug} onChange={(e) => { setSlug(e.target.value); }} >
                                            {voiceChannels.map((item) => (
                                                <option key={item._id} value={`${item?.slug}`}>{item?.name}</option>
                                            ))}
                                        </select>
                                    }
                                </div>
                            </div>
                            <button className={style.create_btn} onClick={onDeleteChannelHandler} type='submit'>Delete</button>
                            <button className={style.cancel_btn} onClick={onCancelChannelHandler}>Cancel</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
