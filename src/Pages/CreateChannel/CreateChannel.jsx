import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import style from './CreateChannel.module.css'

async function onCreateChannel(data) {
    return fetch(`/api/servers/${data.serverSlug}/channels`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${data.token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "name": data.channelName
        })
    }).then(data => data.json());
}
async function onDeleteChannel(data) {
    return fetch(`/api/servers/${data.serverSlug}/channels/${data.slug}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${data.token}`
        }
    }).then(data => data.json());
}

export const CreateChannel = () => {
    const nav = useNavigate();
    const createChannelRef = React.createRef();
    const deleteChannelRef = React.createRef();
    const [channelName, setChannelName] = useState("");
    const [slug, setSlug] = useState("");
    const [isError, setIsError] = useState(false);
    const serverSlug = window.location.pathname.split('/')[3];

    const onCreateChannelHandler = async (e) => {
        e.preventDefault();
        sessionStorage.removeItem("error");
        setIsError(false);
        let token = localStorage.getItem("token");
        token = token.substring(1, token.length - 1);
        const data = await onCreateChannel({ token, channelName, serverSlug });
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
            const data = await onDeleteChannel({ token, slug, serverSlug });
            if (data.status === "error") {
                sessionStorage.setItem("error", JSON.stringify(data.message));
                setIsError(true);
            } else {
                setIsError(false);
                sessionStorage.removeItem("error");
                nav("/");
            }
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
                                <label htmlFor="channelname">Enter Channel Name</label>
                                <input
                                    className={style.inputBox}
                                    type="text"
                                    id='ChannelName'
                                    onChange={e => setChannelName(e.target.value)}
                                />
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
                                <label htmlFor="slugName">Enter Channel Name</label>
                                <input
                                    className={style.inputBox}
                                    type="text"
                                    id='SlugName'
                                    onChange={e => setSlug(e.target.value)}
                                />
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
