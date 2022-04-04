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
import UserContext, { UserContextProvider } from "./Context/user-context";
import { Chatme } from "./Components/HomeComponents/ChatMe/Chatme";
import { ChannelPage } from "./Components/HomeComponents/ChannelPage/ChannelPage";

export default function App() {
	const { isLoggedIn } = useContext(AuthContext);
	const { isServerSelected } = useContext(UserContext);

	return (
		<Routes>
			<Route path="/" element={
				!isLoggedIn ?
					<Navigate to="/user/login" /> :
					<Navigate to="/channels/@me" />
			} />
			{!isLoggedIn && <>
				<Route path="/user/login" element={<Login />} />
				<Route path="/user/register" element={<Login />} />
			</>}
			{isLoggedIn &&
				<>
					<Route path="/channels" element={<MainPage />} >
						<Route path="/channels/@me" element={<Chatme />} />
						<Route path="/channels/:serverId" element={
							!isServerSelected ?
								<ChannelPage /> : <Chatme />
						} />
					</Route>
					{/* <Route path="/:userId/:serverId" element={<MainPage />}> */}
					{/* <Route path=":channelId" element={<MainPage />} /> */}
					{/* </Route> */}
					<Route path="/user/settings" element={<Settings />}>
						<Route path="profile" element={<Profile />} />
						<Route path="voice-controls" element={<VoiceSetting />} />
						<Route
							path="change-password"
							element={<ChangePassword />}
						/>
					</Route>
					<Route path="/user/Create-Server" element={<CreateServerPage />} />
					<Route path="/server/Create-Channel/:slug" element={<CreateChannel />} />
				</>
			}
			{/* <Route path="*" element={<PageNotFound />} /> */}
			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	);
}

const MainPage = () => {
	return (
		<UserContextProvider>
			<HomePage />
		</UserContextProvider>
	);
}