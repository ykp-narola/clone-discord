import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./Context/auth-context";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./Context/user-context";

ReactDOM.render(
	<BrowserRouter>
		<AuthContextProvider>
			<UserContextProvider>
				<App />
			</UserContextProvider>
		</AuthContextProvider>
	</BrowserRouter>,
	document.getElementById("root")
);
