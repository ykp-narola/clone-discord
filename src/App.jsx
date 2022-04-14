import React, { useContext } from "react";
import HomePage from "./Pages/HomePage/HomePage";
import Login from "./Pages/Login/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import Settings from "./Pages/SettingsPage/Settings";
import Profile from "./Components/SettingComponents/Profile";
import ChangePassword from "./Components/SettingComponents/ChangePassword";
import CreateServerPage from "./Pages/CreateServerPage/CreateServerPage";
import { CreateChannel } from "./Pages/CreateChannel/CreateChannel";
import VoiceSetting from "./Components/SettingComponents/VoiceSetting";
import AuthContext from "./Context/auth-context";
// import PageNotFound from "./Pages/PageNotFound/PageNotFound";
import LoginComponent from "./Components/LoginComponent/LoginComponent";
import RegisterComponent from "./Components/RegisterComponent/RegisterComponent";
import { Chatme } from "./Components/HomeComponents/ChatMe/Chatme";
import { ChannelPage } from "./Components/HomeComponents/ChannelPage/ChannelPage";
import { ChatContextProvider } from "./Context/chat-context";
import { PersonalChat } from "./Components/HomeComponents/ChatMe/PersonalChat/PersonalChat";
import { FriendsHangOut } from "./Components/HomeComponents/ChatMe/FriendsHangOut/FriendsHangOut";
// import { useBeforeunload } from 'react-beforeunload';


export default function App() {
	const { isLoggedIn } = useContext(AuthContext);
	// console.log(navigator.onLine);

	// useBeforeunload((e) => {
	// 	e.preventDefault();
	// 	console.log("navigator.onLine: ", navigator.onLine);
	// 	prompt("navigator.onLine", navigator.onLine);
	// });

	return (
		<Routes>
			<Route path="/" element={
				!isLoggedIn ?
					<Navigate to="/user/login" /> :
					<Navigate to="/channels/@me" />
			} />
			{!isLoggedIn && <Route path="/user" element={<Login />}>
				<Route path="login" element={<LoginComponent />} />
				<Route path="register" element={<RegisterComponent />} />
			</Route>}
			{isLoggedIn && <>
				<Route path="/channels" element={<HomePage />} >
					<Route path="@me" element={<Chatme />} >
						<Route path=":tab" element={<FriendsHangOut />} />
						<Route path="chat/:id" element={<PersonalChat />} />
					</Route>
					<Route path=":serverSlug/:channelSlug" element={
						<ChatContextProvider>
							<ChannelPage />
						</ChatContextProvider>
					} />
				</Route>
				<Route path="/user/settings" element={<Settings />}>
					<Route path="profile" element={<Profile />} />
					<Route path="voice-controls" element={<VoiceSetting />} />
					<Route path="change-password" element={<ChangePassword />} />
				</Route>
				<Route path="/user/Create-Server" element={<CreateServerPage />} />
				<Route path="/server/Create-Channel/:serverSlug" element={
					<CreateChannel />
				} />
			</>}
			{/* <Route path="*" element={<PageNotFound />} /> */}
			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	);
}
