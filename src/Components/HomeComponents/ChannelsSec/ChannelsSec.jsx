import React, { useContext, useLayoutEffect, useState } from 'react'
import { BsBoxArrowLeft } from 'react-icons/bs';
import { FiSettings } from 'react-icons/fi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { FaHashtag, FaSignal } from 'react-icons/fa';
import { HiPhoneMissedCall } from 'react-icons/hi';
import { MdHeadset, MdHeadsetOff, MdMic, MdMicOff, MdOutlineAddCircleOutline, MdOutlineScreenShare } from 'react-icons/md';
import { GiSpeaker } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom'
import style from './ChannelsSec.module.css'
import io from "socket.io-client";
import Peer from 'peerjs';
import { onUserDeleteServer, onUserLeaveServer } from '../../../APIs/API';
import UserContext from '../../../Context/user-context';
import ChatContext from '../../../Context/chat-context';
const ENDPOINT = "http://192.168.100.130:3000";
const joinAudio = new Audio('http://192.168.100.130:3000/sounds/join.mp3');
const leaveAudio = new Audio('http://192.168.100.130:3000/sounds/leave.mp3');
let voiceSocket, peers, localStream, myPeer, myVideo;

export const ChannelsSec = (props) => {
    const nav = useNavigate();
    const { isAuthor, channel, user, setIsChannelSelected,
        currServer, setChannel
    } = useContext(UserContext);
    const {
        textChannels, voiceChannels
        , voiceChannelUsers, setVoiceChannelUsers
    } = useContext(ChatContext);

    const imgPath = "http://192.168.100.130:3000/images/users/";
    const [channelId, setChannelId] = useState(0);
    const [isVoiceConnected, setIsVoiceConnected] = useState(false);
    const [isSharingScreen, setIsSharingScreen] = useState(false);

    const [isMuted, setIsMuted] = useState(false);
    const [isDefean, setIsDefean] = useState(false);

    const onLeaveServer = async e => {
        const token = JSON.parse(localStorage.getItem("token"));
        const res = await onUserLeaveServer({ slug: currServer.slug, token });
        if (res.status === 200) {
            nav("/user");
        }
    }
    const onDeleteServer = async e => {
        const token = JSON.parse(localStorage.getItem("token"));
        const res = await onUserDeleteServer({ token, slug: currServer.slug });
        console.log(res);
        if (res.status === 204) {
            nav("/user");
        }
    }
    const onServerSetting = e => { }

    useLayoutEffect(() => {
        const channelId = window.location.pathname.split('/')[3];
        for (let j in currServer.channels) {
            if (currServer.channels[j].slug === channelId) {
                setChannel(currServer.channels[j]);
                setIsChannelSelected(true);
                break;
            }
        }
        // eslint-disable-next-line
    }, [textChannels])

    const divOfListOfTextChannels = Object.keys(textChannels).map((item) => (
        <li key={item} onClick={() => {
            console.log(`trying to switch /channels/${currServer._id}/${textChannels[item]._id}`);
            nav(`/channels/${currServer.slug}/${textChannels[item].slug}`);
            if (channel._id !== textChannels[item]._id) {
                setChannel({
                    name: textChannels[item].name,
                    slug: textChannels[item].slug,
                    _id: textChannels[item]._id
                });
                setIsChannelSelected(true);
            }
        }}>
            <div className={style.icon}>
                <FaHashtag className={style.text_icon} />
            </div>
            <div className={style.channel_name}>
                {textChannels[item].name}
            </div>
        </li>
    ));

    useLayoutEffect(() => {
        peers = {};
    }, []);
    const ConnectAudio = async (channel) => {
        console.log(`connecting audio to ${channel.name} ...`);
        voiceSocket?.disconnect();
        voiceSocket?.removeAllListeners();
        voiceSocket = io(ENDPOINT, { transports: ["websocket"] });
        peers = {};
        myPeer = new Peer(user._id
            , {
                host: "/",
                port: "3001",
            });
        myVideo = document.createElement("video");
        myVideo.muted = true;

        voiceSocket.on("disconnected", (data) => {
            console.log("disconnecting with audio");
            leaveAudio.play();
            voiceSocket.disconnect()
            voiceSocket.removeAllListeners();
            if (peers[data.userId]) {
                peers[data.userId].close();
                console.log(data.userId, " disconnected");
            }
        });
        voiceSocket.on("update-ui", userData => {
            // console.log(userData);
            // userData = [...new Map(userData.map(item => [item._id, item])).values()];
            setVoiceChannelUsers(userData);
        });
        voiceSocket.emit("join-voice-channel", {
            userId: user._id,
            channelId: channel._id,
            name: user.name,
            image: user.image
        });
        voiceSocket.on("add-user-connected-ui", data => {
            console.log(data);
            const uniqueUsers = [...new Map(data.map(item => [item.userId, item])).values()]
            setVoiceChannelUsers(uniqueUsers);
        });

        navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
        }).then((stream) => {
            localStream = stream;
            addVideoStream(myVideo, stream);
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

            voiceSocket.emit("join-channel", { channelId: channel._id, userId });
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
            joinAudio.play();
            setIsVoiceConnected(true);
            // alert("connecting to voice channel...");
            // videoGrid.append(video);
        }
    };
    const disconnectAudio = () => {
        leaveAudio.play();
        voiceSocket.emit("disconnected", {
            userId: user._id,
            channelId: channelId,
            name: user.name,
            image: user.image
        });

        voiceSocket.disconnect();
        setIsVoiceConnected(false);
        // myPeer.close();
        setVoiceChannelUsers([]);
        myPeer.destroy();
        console.log(myPeer);
        for (let conns in myPeer.connections) {
            console.log(conns);
            myPeer.connections[conns].forEach((conn, index, array) => {
                console.log(`closing ${conn.connectionId} peerConnection (${index + 1}/${array.length})`, conn.peerConnection);
                conn.peerConnection.close();

                // close it using peerjs methods
                if (conn.close)
                    conn.close();
            });
        }
    };

    window.onbeforeunload = disconnectAudio;
    const startShareScreen = () => {
        var displayMediaOptions = {
            video: {
                cursor: "always"
            },
            audio: false
        };

        navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
            .then(function (stream) {
                setIsSharingScreen(true);
                // add this stream to your peer 
            });
    }
    const stopSharingScreen = () => {
    }

    const divOfListOfVoiceChannels = Object.keys(voiceChannels).map((item) => (
        <li key={item} onClick={() => {
            // if (isVoiceConnected) {
            //     disconnectAudio();
            // }
            if (!isVoiceConnected) {
                setChannelId(voiceChannels[item]._id);
                ConnectAudio(voiceChannels[item]);
            }
        }}>
            <div className={style.icon}>
                <GiSpeaker className={style.voice_icon} />
            </div>
            <div className={style.channel_name}>
                {voiceChannels[item].name}
                {(voiceChannels[item]._id === channelId) &&
                    Object.keys(voiceChannelUsers).map((item) => (
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
                <div className={style.serverName}>{currServer.name}</div>
                <div className={`${style.serverOptions} ${style.dropdown}`}>
                    <button className={style.dropbtn}>⋮</button>
                    <div className={style.dropdown_content}>
                        {isAuthor ? <div onClick={() => nav(`/server/Create-Channel/${currServer.slug}`)} >Manage Channel<MdOutlineAddCircleOutline className={style.react_icon} /></div> : null}
                        <div onClick={onServerSetting}>Server Settings<FiSettings className={style.react_icon} /></div>
                        {!isAuthor && <div onClick={onLeaveServer}>Leave Server<BsBoxArrowLeft className={style.react_icon} /></div>}
                        {isAuthor &&
                            <div className={style.delete_server} onClick={onDeleteServer}>
                                Delete Server
                                <RiDeleteBin5Line color='rgb(255, 62, 62)' className={style.react_icon} />
                            </div>
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
                    <ul className={`${style.slide} ${style.text_slide}`}>
                        {divOfListOfTextChannels}
                    </ul>
                </div>
                <div className={`${style.voice_channels} ${style.dropdown}`}>
                    <input type="checkbox" className={style.voicetouch} id="voicetouch" />
                    <label htmlFor="voicetouch">
                        <span className={style.span_channel}>Voice channels</span>
                    </label>
                    <ul className={`${style.slide} ${style.voice_slide}`}>
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
                            <div>
                                <button className={style.btn} onClick={() => {
                                    localStream.getAudioTracks()[0].enabled = isMuted;
                                    setIsMuted(!isMuted)
                                }}>
                                    {!isMuted ? <MdMic /> : <MdMicOff />}
                                </button>
                            </div>
                            <div>
                                <button className={style.btn} onClick={() => {
                                    myVideo.enabled = !isDefean;
                                    // console.log(localStream.getAudioTracks()[1]);
                                    // localStream.getAudioTracks()[0].enabled = isDefean;
                                    setIsDefean(!isDefean);
                                    setIsMuted(true)
                                }}>
                                    {!isDefean ? <MdHeadset fontSize="1.2rem" /> : <MdHeadsetOff fontSize="1.2rem" />}
                                </button>
                            </div>
                            <div className={style.dropdown}>
                                <button className={`${style.btn} ${style.dropbtn}`} onClick={(e) => {
                                    startShareScreen(e);
                                }}>
                                    <MdOutlineScreenShare color={isSharingScreen ? 'green' : 'white'} fontSize="1.2rem" />
                                </button>
                                {isSharingScreen ? <div className={`${style.dropdown_content} ${style.screenshare_content}`}>
                                    <div onClick={startShareScreen}>Display Window<MdOutlineScreenShare className={style.react_icon} /></div>
                                    <div onClick={() => stopSharingScreen()} >Stop Sharing</div>
                                </div>
                                    : null}
                            </div>
                            <div>
                                <button className={style.btn} onClick={() => {
                                    disconnectAudio();
                                }}
                                ><HiPhoneMissedCall color='rgb(255, 59, 59)' />
                                </button>
                            </div>
                        </div>
                        <hr className={style.divider} color='grey' />
                    </div>
                }
                <div className={style.user_info}>
                    <img className={style.user_image} src={`${imgPath}${user.image}`} alt={`${user.image}`} />
                    <div className={style.user_name}>
                        <div className={style.uname}>{user.name}</div>
                        <div className={style.uid}>{`# ${user._id.substring(20, 24)}`}</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
