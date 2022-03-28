import React, { useEffect, useLayoutEffect, useState } from 'react'
import { BsBoxArrowLeft } from 'react-icons/bs';
import { FiSettings } from 'react-icons/fi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { FaHashtag, FaSignal } from 'react-icons/fa';
import { HiPhoneMissedCall } from 'react-icons/hi';
import { MdHeadset, MdHeadsetOff, MdMic, MdMicOff } from 'react-icons/md';
import { GiSpeaker } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom'

import style from './ChannelsSec.module.css'
import io from "socket.io-client";
import Peer from 'peerjs';
const ENDPOINT = "http://192.168.100.130:3000";
let voiceSocket, peers, myPeer;

export const ChannelsSec = (props) => {
    const nav = useNavigate();
    const imgPath = "http://192.168.100.130:3000/images/users/";
    const [textChannels, setTextChannels] = useState({});
    const [voiceChannels, setVoiceChannels] = useState([{ name: "voice channel" }]);
    const [voiceChannelUsers, setVoiceChannelUsers] = useState([]);
    const [isVoiceConnected, setIsVoiceConnected] = useState(false);

    const [isMuted, setIsMuted] = useState(false);
    const [isDefean, setIsDefean] = useState(false);

    const onLeaveServer = async e => {
        let token = localStorage.getItem("token");
        token = token.substring(1, token.length - 1);
        const res = await fetch(`/api/servers/${props.currServer.slug}/leave`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        if (res.status === 200) {
            nav("/user");
        }
    }
    const onDeleteServer = async e => {
        let token = localStorage.getItem("token");
        token = token.substring(1, token.length - 1);
        const res = await fetch(`/api/servers/${props.currServer.slug}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log(res);
        if (res.status === 204) {
            nav("/user");
        }
    }
    const onServerSetting = e => { }

    useEffect(() => {
        (async () => {
            const res = await getTextChannels();
            if (res.data.server.length > 0) {
                const channels = res.data.server[0].channels;
                setTextChannels(channels);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const getTextChannels = async e => {
        const token = localStorage.getItem("token");
        return await fetch(`/api/servers/${props.currServer.slug}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token.substring(1, token.length - 1)}`
            }
        }).then(data => data.json());
    }

    const divOfListOfTextChannels = Object.keys(textChannels).map((item) => (
        // <Link  to={`/chat/${textChannels[item]._id}`}>
        <li key={item} onClick={() => {
            if (props.channelId !== textChannels[item]._id) {
                props.setChannel({
                    name: textChannels[item].name,
                    slug: textChannels[item].slug,
                    _id: textChannels[item]._id
                });
                props.setIsChannelSel(true);
            }
        }}>
            <div className={style.icon}>
                <FaHashtag className={style.text_icon} />
            </div>
            <div className={style.channel_name}>
                {textChannels[item].name}
            </div>
        </li>
        // </Link>
    ));

    const removeByAttr = function (arr, attr, value) {
        var i = arr.length;
        while (i--) {
            if (arr[i]
                && arr[i].hasOwnProperty(attr)
                && (arguments.length > 2 && arr[i][attr] === value)) {
                arr.splice(i, 1);
            }
        }
        return arr;
    }
    useLayoutEffect(() => {
        peers = {};
    }, []);
    const connectAudio = async (channelName) => {
        console.log(`connecting audio to ${channelName} ...`);
        // disconnectAudio();
        myPeer?.disconnect();
        voiceSocket?.disconnect();
        voiceSocket?.removeAllListeners();
        voiceSocket = io(ENDPOINT);
        peers = {};
        myPeer = new Peer(props.user._id, {
            host: "/",
            port: "3010",
        });
        const myVideo = document.createElement("video");
        myVideo.muted = true;

        voiceSocket.on("user-disconnected", (userId) => {

            voiceSocket.emit("remove-user-connected-ui", {
                userId: props.user._id,
                name: props.user.name,
                image: props.user.image
            })
            if (peers[userId]) {
                peers[userId].close();
                peers[userId].disconnect();
                console.log(userId, " disconnected");
                console.log(voiceChannelUsers, "1111");
                setVoiceChannelUsers(removeByAttr(voiceChannelUsers, 'userId', props.user._id));
                console.log(voiceChannelUsers, "2222");
            }
        });

        voiceSocket.emit("add-user-ui", {
            userId: props.user._id,
            name: props.user.name,
            image: props.user.image
        })

        voiceSocket.on("add-user-connected-ui", data => {
            console.log(data);
            const uniqueUsers = [...new Map(data.map(item => [item.userId, item])).values()]
            setVoiceChannelUsers(uniqueUsers);
        })

        navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
        }).then((stream) => {
            console.log('hi');
            addVideoStream(myVideo, stream);
            setVoiceChannelUsers(prev => [...prev, {
                userId: props.user._id,
                channelId: `${props.currServer._id}-voice-channel`,
                name: props.user.name,
                image: props.user.image
            }]);
            myPeer.on("call", (call) => {
                call.answer(stream);
                const video = document.createElement("video");
                call.on("stream", (userVideoStream) => {
                    addVideoStream(video, userVideoStream);
                });
            });

            voiceSocket.on("user-connected", (userId) => {
                console.log("userId: ", userId);
                connectToNewUser(userId, stream);
            });
        });

        myPeer.on("open", (userId) => {
            console.log(`${userId} connected...`);
            if (peers[userId]) {
                peers[userId].close();
                console.log('Call cut...');
                console.log(peers);
            }

            voiceSocket.emit("join-channel", { channelId: props.channelId, userId });
        });

        function connectToNewUser(userId, stream) {
            console.log('hi from connect to new user');
            const call = myPeer.call(userId, stream);
            const video = document.createElement("video");
            call.on("stream", (userVideoStream) => {
                addVideoStream(video, userVideoStream);
            });
            call.on("close", () => {
                video.remove();
            });

            console.log(call);
            peers[userId] = call;
        }

        function addVideoStream(video, stream) {
            console.log("adding stream...");
            video.srcObject = stream;
            video.addEventListener("loadedmetadata", () => {
                video.play();
            });
            setIsVoiceConnected(true);
            // alert("connecting to voice channel...");
            // videoGrid.append(video);
        }
    };
    const disconnectAudio = async => {
        myPeer.disconnect();
        voiceSocket.disconnect();
        voiceSocket.removeAllListeners();
        setIsVoiceConnected(false);
    }
    const divOfListOfVoiceChannels = Object.keys(voiceChannels).map((item) => (
        <li key={item} onClick={() => {
            connectAudio(voiceChannels[item].name);
        }}>
            <div className={style.icon}>
                <GiSpeaker className={style.voice_icon} />
            </div>
            <div className={style.channel_name}>
                {voiceChannels[item].name}
                {Object.keys(voiceChannelUsers).map((item) => (
                    <div key={item} className={style.voice_user}>
                        <img src={`${imgPath}${voiceChannelUsers[item].image}`} alt="" />
                        <div className={style.username}>{voiceChannelUsers[item].name}</div>
                    </div>
                ))}
            </div>
        </li>
    ));

    return (
        <section className={style.channel_section}>
            <div className={style.currServer_wrapper}>
                <div className={style.serverName}>{props.currServer.name}</div>
                <div className={`${style.serverOptions} ${style.dropdown}`}>
                    <button className={style.dropbtn}>⋮</button>
                    <div className={style.dropdown_content}>
                        {props.author ? <div onClick={() => nav(`/server/Create-Channel/${props.currServer.slug}`)} >Create Channel</div> : null}
                        <div onClick={onServerSetting}>Server Settings<FiSettings className={style.react_icon} /></div>
                        <div onClick={onLeaveServer}>Leave Server<BsBoxArrowLeft className={style.react_icon} /></div>
                        {props.author ?
                            <div className={style.delete_server} onClick={onDeleteServer}>
                                Delete Server
                                <RiDeleteBin5Line color='rgb(255, 62, 62)' className={style.react_icon} />
                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
            <div className={style.channels}>
                <div className={`${style.text_channels} ${style.dropdown}`}>
                    <input type="checkbox" className={style.texttouch} id="texttouch" />
                    <label htmlFor="texttouch">
                        <span className={style.span_channel}>Text channels</span>
                    </label>
                    <ul className={style.slide}>
                        {divOfListOfTextChannels}
                    </ul>
                </div>
                <div className={`${style.voice_channels} ${style.dropdown}`}>
                    <input type="checkbox" className={style.voicetouch} id="voicetouch" />
                    <label htmlFor="voicetouch">
                        <span className={style.span_channel}>Voice channels</span>
                    </label>
                    <ul className={style.slide}>
                        {divOfListOfVoiceChannels}
                    </ul>
                </div>
            </div>
            <div className={style.profile_status}>
                {isVoiceConnected &&
                    <div className={style.voice_connected}>
                        <div className={style.connect_status}>
                            <div className={style.connect_icon}>
                                <FaSignal color='rgba(0, 255, 0, 0.5)' />
                            </div>
                            <div className={style.connect_text}>
                                Voice Connected
                            </div>
                        </div>
                        <div className={style.connect_btn}>
                            <button className={style.btn} onClick={() => setIsMuted(!isMuted)}>
                                {!isMuted ? <MdMic /> : <MdMicOff />}
                            </button>
                            <button className={style.btn} onClick={() => setIsDefean(!isDefean)}>
                                {!isDefean ? <MdHeadset fontSize="1.2rem" /> : <MdHeadsetOff fontSize="1.2rem" />}
                            </button>
                            <button className={style.btn} onClick={() => disconnectAudio()}>
                                <HiPhoneMissedCall color='rgb(255, 59, 59)' /></button>
                        </div>
                        <hr className={style.divider} color='grey' />
                    </div>
                }
                <div className={style.user_info}>
                    <img className={style.user_image} src={`${imgPath}${props.user.image}`} alt={`${props.user.image}`} />
                    <div className={style.user_name}>
                        <div className={style.uname}>{props.user.name}</div>
                        <div className={style.uid}>{`# ${props.user._id.substring(20, 24)}`}</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
