import React, { useState } from "react";
// import { io } from "socket.io-client";
// const ENDPOINT = "http://192.168.100.130:3000";
const imgPath = "http://192.168.100.130:3000/images/users/";

const ChatContext = React.createContext({
	textChannels: {},
	setTextChannels: () => {},
	voiceChannels: [],
	setVoiceChannels: () => {},
	voiceChannelUsers: [],
	setVoiceChannelUsers: () => {},
	isLoading: true,
	setIsLoading: () => {},
	granted: false,
	setGranted: () => {},
	myMessage: "",
	setMyMessage: () => {},
	messages: [],
	setMessages: () => {},
	onlineUsers: [{ name: "User", image: "Accord.png" }],
	setOnlineUsers: () => {},
	showNotificationfunc: () => {},
});

export const ChatContextProvider = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [NotificationGranted, setGranted] = useState(false);
	const [myMessage, setMyMessage] = useState("");
	const [messages, setMessages] = useState([]);

	const [textChannels, setTextChannels] = useState({});
	const [voiceChannels, setVoiceChannels] = useState([]);
	const [voiceChannelUsers, setVoiceChannelUsers] = useState([]);
	const [onlineUsers, setOnlineUsers] = useState([
		{ name: "User", image: "Accord.png" },
	]);

	const showError = () => {
		console.log("Error Occured");
	};
	let granted = false;
	const requestPermission = async () => {
		if (Notification.permission === "granted") {
			granted = true;
		} else if (Notification.permission !== "denied") {
			let permission = await Notification.requestPermission();
			granted = permission === "granted" ? true : false;
		}
	};
	const showNotificationfunc = (
		data = { msg: "not defined", title: "Accord Web App" }
	) => {
		if (!granted) requestPermission();
		let showNotification = () => {
			let notification = new Notification(data.title, {
				body: data.msg,
				timestamp: 1000,
				icon: `${imgPath}Accord.png`,
				vibrate: true,
			});
			setTimeout(() => {
				notification.close();
			}, 10 * 1000);

			notification.addEventListener("click", () => {
				window.focus();
			});
		};
		granted ? showNotification() : showError();
	};

	const contextValue = {
		textChannels,
		setTextChannels,
		voiceChannels,
		setVoiceChannels,
		voiceChannelUsers,
		setVoiceChannelUsers,
		isLoading,
		setIsLoading,
		granted: NotificationGranted,
		setGranted,
		myMessage,
		setMyMessage,
		onlineUsers,
		setOnlineUsers,
		messages,
		setMessages,
		showNotificationfunc,
	};

	return (
		<ChatContext.Provider value={contextValue}>
			{props.children}
		</ChatContext.Provider>
	);
};

export default ChatContext;
