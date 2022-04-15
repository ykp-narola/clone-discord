import React, {
	useEffect,
	useLayoutEffect,
	useContext,
	useState,
	useRef,
} from "react";
import style from "./MainSec.module.css";
import loader from "../../../assets/Images/Loader_magnify.gif";
import { getChannelMessages } from "../../../APIs/API";
import UserContext from "../../../Context/user-context";
import { InputForm } from "./InputBox/InputForm";
import ChatContext from "../../../Context/chat-context";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { FaHashtag, FaReply } from "react-icons/fa";
import { textSocket } from "../../../Pages/HomePage/HomePage";
import { RiCloseCircleFill } from "react-icons/ri";
import { Image } from "./Image";
const imgPath = "http://192.168.100.130:3000/images/users/";
const notificationAudio = new Audio(
	"http://192.168.100.130:3000/sounds/notification.mp3"
);

export const MainSec = (props) => {
	const { channel, user, currServer, isAuthor } = useContext(UserContext);
	const {
		isLoading,
		setIsLoading,
		messages,
		setMessages,
		showNotificationfunc,
	} = useContext(ChatContext);

	const messagesRef = useRef();
	const messagesStartRef = useRef(null);
	const messagesEndRef = useRef(null);
	const [replyMessage, setReplyMessage] = useState(null);

	useLayoutEffect(() => {
		// socket.disconnect();
		textSocket?.removeAllListeners();
		textSocket?.emit("leave-text-channel");
		textSocket?.emit("join-text-channel", {
			channelId: channel._id,
			userId: user._id,
		});

		textSocket?.on("delete-message", (data) => {
			setMessages((prev) => prev.filter((item) => item._id !== data.data._id));
		});

		textSocket?.on("new-message", (data) => {
			if (document.hidden) {
				if (data.user._id !== user._id) {
					showNotificationfunc({
						msg: `${data.user.name}: ${data.message}`,
						title: `Accord | ${currServer.slug}`,
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

		// textSocket.on("fs-meta", (data) => {
		//     console.log("fs-meta: ", data);
		//     fileShare.metadata = data.metadata;
		//     fileShare.transmitted = 0;
		//     fileShare.buffer = [];

		// 		let el = document.createElement("div");
		// 		el.classList.add("item");
		// 		el.innerHTML = `
		// 		<div class="progress">0%</div>
		// 		<div class="filename">${metadata.filename}</div>
		// `;
		// 		document.querySelector(".files-list").appendChild(el);

		// fileShare.progrss_node = el.querySelector(".progress");

		//     setMessages((prev) => [...prev, data]);

		//     textSocket.emit("fs-start", {
		//         user: user,
		//     });
		// });

		// textSocket.on("fs-share", function (buffer) {
		//     console.log("Buffer", buffer);
		//     fileShare.buffer.push(buffer);
		//     fileShare.transmitted += buffer.byteLength;
		//     fileShare.progrss_node.innerText = Math.trunc(
		//         (fileShare.transmitted / fileShare.metadata.total_buffer_size) * 100
		//     );
		//     if (fileShare.transmitted === fileShare.metadata.total_buffer_size) {
		//         console.log("Download file: ", fileShare);
		//         require("downloadjs")(new Blob(fileShare.buffer), fileShare.metadata.filename);
		//         fileShare = {};
		//     } else {
		//         textSocket.emit("fs-start", {
		//             user: user
		//         });
		//     }
		// });

		// eslint-disable-next-line
	}, [channel._id]);

	useEffect(() => {
		setIsLoading(true);
		(async () => {
			const token = JSON.parse(localStorage.getItem("token"));
			const res = await getChannelMessages({
				token,
				serverSlug: currServer.slug,
				channelSlug: channel.slug,
			});
			if (res.status === "success") {
				setMessages(res.data.messages);
				setIsLoading(false);
				pageScroll(messagesEndRef);
			}
		})();
		// eslint-disable-next-line
	}, [channel]);

	const getTime = (time) => {
		let hour = new Date(time).getHours();
		let minute = new Date(time).getMinutes();
		hour = hour < 10 ? `0${hour}` : hour;
		minute = minute < 10 ? `0${minute}` : minute;
		return `${hour}:${minute}`;
	};

	const DeleteMessageHandler = async (data) => {
		textSocket?.emit("delete-message", { user, data });
	};

	const divOfListOfMesssages = Object.keys(messages).map((item) => (
		<div key={item} ref={messagesRef}>
			{messages[item].type === "Text" && (
				<div className={style.message}>
					{messages[item].reply && messages[item].reply !== null && (
						<div className={style.reply_div}>
							<img
								src={`${imgPath}${messages[item].reply.user.image}`}
								alt="profile"
							/>
							<div className={style.username}>
								{messages[item].reply.user.name}
							</div>
							<div className={style.rep_message}>
								{messages[item].reply.message}
							</div>
						</div>
					)}
					{messages[item].user._id !== messages[item - 1]?.user._id ? (
						<div className={style.message_div}>
							<img
								src={`${imgPath}${messages[item].user.image}`}
								alt="profile"
							/>
							<div className={style.msg}>
								<div className={style.message_header}>
									<div className={style.username}>
										{messages[item].user.name}
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
						{(isAuthor || user.name === messages[item].user.name) && (
							<button
								className={style.message_edit}
								onClick={() => DeleteMessageHandler(messages[item])}
							>
								<AiFillDelete className={style.icon} />
							</button>
						)}
					</div>
				</div>
			)}
			{messages[item].type === "File" && (
				<div className={style.message}>
					{messages[item].reply && messages[item].reply !== null && (
						<div className={style.reply_div}>
							<img
								src={`${imgPath}${messages[item].reply.user.image}`}
								alt="profile"
							/>
							<div className={style.username}>
								{messages[item].reply.user.name}
							</div>
							<div className={style.rep_message}>
								{messages[item].reply.message}
							</div>
						</div>
					)}
					{messages[item].user._id !== messages[item - 1]?.user._id ? (
						<div className={style.message_div}>
							<img
								src={`${imgPath}${messages[item].user.image}`}
								alt="profile"
							/>
							<div className={style.msg}>
								<div className={style.message_header}>
									<div className={style.username}>
										{messages[item].user.name}
									</div>
									<div className={style.time}>
										{getTime(messages[item].createdAt)}
									</div>
								</div>
								<Image
									fileName={messages[item].fileName}
									blob={messages[item].blob}
								/>
							</div>
						</div>
					) : (
						<div className={style.message_sub_div}>
							<div className={style.msg}>
								<Image
									fileName={messages[item].fileName}
									blob={messages[item].blob}
								/>
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
						{(isAuthor || user.name === messages[item].user.name) && (
							<button
								className={style.message_edit}
								onClick={() => DeleteMessageHandler(messages[item])}
							>
								<AiFillDelete className={style.icon} />
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	));

	// useEffect(() => {
	//     pageScroll(messagesEndRef, { behavior: "smooth" });
	//     // eslint-disable-next-line
	// }, [divOfListOfMesssages])

	return (
		<section className={style.text_msg}>
			<div className={style.chat__wrapper}>
				<div className={style.wrapper}>
					{isLoading && (
						<div className={style.Loader}>
							<img src={loader} alt="Loading" />
						</div>
					)}
					<div ref={messagesStartRef} />
					{!isLoading && (
						<>
							<div className={style.initial_message}>
								<div className={style.hash}>
									<FaHashtag />
								</div>
								<div className={style.name}>{channel.name}</div>
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
		</section>
	);
};

export const pageScroll = (Ref, behavior = {}) => {
	Ref.current.scrollIntoView(behavior);
};
