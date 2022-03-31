import React, { useState } from "react";

const UserContext = React.createContext({
	isLoading: true,
	setIsLoading: () => {},
	user: {},
	setUser: () => {},
	servers: {},
	setServers: () => {},
	currServer: {},
	setCurrServer: () => {},
	isAuthor: false,
	setIsAuthor: () => {},
	channel: {},
	setChannel: () => {},
	isChannelSelected: false,
	setIsChannelSelected: () => {},
	isServerSelected: false,
	setIsServerSelected: () => {},
});

export const UserContextProvider = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState({});
	const [isServerSelected, setIsServerSelected] = useState(false);
	const [servers, setServers] = useState({});
	const [currServer, setCurrServer] = useState({});
	const [isAuthor, setIsAuthor] = useState(false);
	const [channel, setChannel] = useState({});
	const [isChannelSelected, setIsChannelSelected] = useState(false);

	const contextValue = {
		isLoading,
		setIsLoading,
		user,
		setUser,
		isAuthor,
		setIsAuthor,
		servers,
		setServers,
		currServer,
		setCurrServer,
		channel,
		setChannel,
		isChannelSelected,
		setIsChannelSelected,
		isServerSelected,
		setIsServerSelected,
	};
	return (
		<UserContext.Provider value={contextValue}>
			{props.children}
		</UserContext.Provider>
	);
};

export default UserContext;
