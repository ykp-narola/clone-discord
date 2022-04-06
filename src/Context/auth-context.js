import React, { useState } from "react";

const AuthContext = React.createContext({
	token: "",
	isLoggedIn: false,
	login: (token) => {},
	logout: () => {},
});

export const AuthContextProvider = (props) => {
	const initialToken = localStorage.getItem("token");
	const [token, setToken] = useState(initialToken);
	const userLoggedIn = !!token;

	const logoutHandler = () => {
		localStorage.removeItem("token");
		setToken(null);
	};
	const loginHandler = (token) => {
		setToken(token);
		localStorage.setItem("token", JSON.stringify(token));
	};

	const contextValue = {
		token: token,
		isLoggedIn: userLoggedIn,
		login: loginHandler,
		logout: logoutHandler,
	};
	return (
		<AuthContext.Provider value={contextValue}>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
