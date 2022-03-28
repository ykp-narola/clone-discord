import React from "react";
import HomePage from "./Pages/HomePage/HomePage";
import Login from "./Pages/Login/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import PageNotFound from "./Pages/PageNotFound/PageNotFound";
import useToken from "./Hooks/useToken";
import Settings from "./Pages/SettingsPage/Settings";
import Profile from "./Components/SettingComponents/Profile";
import ChangePassword from "./Components/SettingComponents/ChangePassword";
import CreateServerPage from "./Pages/CreateServerPage/CreateServerPage";
import { CreateChannel } from "./Pages/CreateChannel/CreateChannel";
import VoiceSetting from "./Components/SettingComponents/VoiceSetting";

export default function App() {
	const { token, setToken } = useToken();
	return (
		<Routes>
			<Route
				path="/"
				element={
					token === "undefined" || token === null || token === "" ? (
						<Login setToken={setToken} />
					) : (
						<HomePage />
					)
				}
			/>
			<Route path="/user" element={<Navigate to="/" />} />
			<Route path="/user/login" element={<Login setToken={setToken} />} />
			<Route path="/user/register" element={<Login setToken={setToken} />} />
			{/* <Route path="contact" element={<Contact />} /> */}
			{/* <Route path="/js" element={<HomePage />} /> */}
			{/* <Route path="/user/settings" element={<Settings setToken={setToken} />} /> */}
			<Route path="/user/settings" element={<Settings setToken={setToken} />}>
				<Route path="/user/settings/profile" element={<Profile />} />
				<Route path="/user/settings/voice-controls" element={<VoiceSetting />} />
				<Route
					path="/user/settings/change-password"
					element={<ChangePassword />}
				/>
			</Route>
			<Route path="/user/Create-Server" element={<CreateServerPage />} />
			<Route path="/server/Create-Channel/:slug" element={<CreateChannel />} />
			<Route path="*" element={<PageNotFound />} />
		</Routes>
	);
}
