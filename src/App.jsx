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
import AuthContext from "./Contexts/auth-context";
// import PageNotFound from "./Pages/PageNotFound/PageNotFound";
import { UserContextProvider } from "./Contexts/user-context";

export default function App() {
	const { isLoggedIn } = useContext(AuthContext);

	return (
		<Routes>
			<Route path="/" element={
				!isLoggedIn ?
					<Navigate to="/user/login" /> :
					<UserContextProvider>
						<HomePage />
					</UserContextProvider>
			} />
			{!isLoggedIn && <>
				<Route path="/user/login" element={<Login />} />
				<Route path="/user/register" element={<Login />} />
			</>}
			{isLoggedIn &&
				<>
					<Route path="/user/settings" element={<Settings />}>
						<Route path="/user/settings/profile" element={<Profile />} />
						<Route path="/user/settings/voice-controls" element={<VoiceSetting />} />
						<Route
							path="/user/settings/change-password"
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
