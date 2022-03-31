import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import style from './CreateServerPage.module.css'
import { onCreateServer, onJoinServer } from '../../APIs/API';

export default function CreateServerPage() {
    const nav = useNavigate();
    const createServerRef = React.createRef();
    const joinServerRef = React.createRef();
    const [serverName, setServerName] = useState();
    const [serverPicture, setServerPicture] = useState();
    const [slug, setSlug] = useState();
    const [isError, setIsError] = useState(false);
    const onCreateServerHandler = async (e) => {
        e.preventDefault();
        sessionStorage.removeItem("error");
        setIsError(false);
        const formdata = new FormData();
        formdata.append('name', serverName);
        formdata.append('image', serverPicture);
        console.log(formdata);
        let token = localStorage.getItem("token");
        token = token.substring(1, token.length - 1);
        const data = await onCreateServer({ token, formdata });
        // console.log(data);
        if (data.status === 'success') {
            setIsError(false);
            sessionStorage.removeItem("error");
            // console.log("Successfully uploaded image");
            nav("/");
        } else {
            sessionStorage.setItem("error", JSON.stringify(data.message));
            setIsError(true);
        }
    }
    const onJoinServerHandler = async e => {
        e.preventDefault();
        sessionStorage.removeItem("error");
        setIsError(false);
        if (slug !== "") {
            let token = localStorage.getItem("token");
            token = token.substring(1, token.length - 1);
            const data = await onJoinServer({ slug, token });
            // console.log(data);
            if (data.status === "success") {
                setIsError(false);
                // selins-server
                sessionStorage.removeItem("error");
                // console.log("Server Joined");
                nav("/");
            } else {
                sessionStorage.setItem("error", JSON.stringify(data.message));
                setIsError(true);
            }
        } else {
            setIsError(true);
            sessionStorage.setItem("error", JSON.stringify("Name can't be empty"));
        }
    }
    const openForm = (ref) => ref.current.style.display = "block";
    const closeForm = (ref) => ref.current.style.display = "none";
    const onCancelServerHandler = e => {
        e.preventDefault();
        nav("/");
    }
    const openCity = (ref) => {
        if (ref === createServerRef) {
            closeForm(joinServerRef);
            openForm(createServerRef);
        }
        else if (ref === joinServerRef) {
            closeForm(createServerRef);
            openForm(joinServerRef);
        }
    }
    useEffect(() => {
        openCity(createServerRef);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={style.page__container}>
            <div className={style.form__container}>
                <div className={`${style.header} ${style.welcome}`}>New Server</div>
                <div className={style.tab} onLoad={() => { openCity(createServerRef); console.log("first") }}>
                    <button className={style.tablinks} onClick={() => openCity(createServerRef)}>Create Server</button>
                    <button className={style.tablinks} onClick={() => openCity(joinServerRef)}>Join Server</button>
                </div>
                {isError && <div className={style.error_msg}>{JSON.parse(sessionStorage.getItem("error"))}</div>}
                <div ref={createServerRef} className="tabcontent" id="createServer">
                    <div className={style.container}>
                        <form>
                            <div className={style.inputField}>
                                <label htmlFor="servername">Enter Server Name</label>
                                <input
                                    className={style.inputBox}
                                    type="text"
                                    id='ServerName'
                                    onChange={e => setServerName(e.target.value)}
                                />
                            </div>
                            <div className={style.inputField1}>
                                <label htmlFor="image">Upload Photo</label>
                                <input
                                    className={style.inputBox_file}
                                    type="file"
                                    id='photo'
                                    accept='image/*'
                                    onChange={(e) => {
                                        setServerPicture(e.target.files[0]);
                                    }}
                                />
                            </div>
                            <button className={style.create_btn} onClick={onCreateServerHandler} type='submit'>Create</button>
                            <button className={style.cancel_btn} onClick={onCancelServerHandler}>Cancel</button>
                        </form>
                    </div>
                </div>
                <div ref={joinServerRef} className="tabcontent" id="joinServer">
                    <div className={style.container}>
                        <form>
                            <div className={style.inputField}>
                                <label htmlFor="slugName">Enter Server Name</label>
                                <input
                                    className={style.inputBox}
                                    type="text"
                                    id='SlugName'
                                    onChange={e => setSlug(e.target.value)}
                                />
                            </div>
                            <button className={style.create_btn} onClick={onJoinServerHandler} type='submit'>Join</button>
                            <button className={style.cancel_btn} onClick={onCancelServerHandler}>Cancel</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
