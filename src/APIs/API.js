export const onLogin = async (data) => {
	return fetch("/api/users/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(data),
	}).then((data) => data.json());
};
export const onRegisterUser = async (data) => {
	return fetch("/api/users/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}).then((data) => data.json());
};
export const getAllServers = async (token) => {
	return fetch("/api/users/", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then((data) => data.json());
};
export const onCreateServer = async (data) => {
	return fetch("/api/servers", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${data.token}`,
		},
		body: data.formdata,
	}).then((data) => data.json());
};
export const onJoinServer = async (data) => {
	return fetch(`/api/servers/${data.slug}/join`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${data.token}`,
		},
	}).then((data) => data.json());
};
export const onCreateChannel = async (data) => {
	return fetch(`/api/servers/${data.serverSlug}/channels`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${data.token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: data.channelName,
			type: data.channelType,
		}),
	}).then((data) => data.json());
};
export const onDeleteChannel = async (data) => {
	return fetch(`/api/servers/${data.serverSlug}/channels/${data.slug}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${data.token}`,
		},
	}).then((data) => data.json());
};
export const onChangePassword = async (data) => {
	return fetch("/api/users/updatePassword", {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${data.token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			passwordCurrent: data.currPassword,
			password: data.newPassword,
			passwordConfirm: data.cNewPassword,
		}),
	}).then((data) => data.json());
};
export const getUserData = async (token) => {
	return fetch(`/api/users/`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then((data) => data.json());
};
export const getServerUsers = async (data) => {
	return fetch(`/api/servers/${data.slug}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${data.token}`,
		},
	}).then((data) => data.json());
};
export const getChannelMessages = async (data) => {
	return fetch(
		`/api/servers/${data.serverSlug}/channels/${data.channelSlug}/messages`,
		{
			headers: {
				Authorization: `Bearer ${data.token}`,
			},
		}
	).then((data) => data.json());
};
export const onUserLeaveServer = async (data) => {
	return fetch(`/api/servers/${data.slug}/leave`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${data.token}`,
		},
	});
};
export const onUserDeleteServer = async (data) => {
	return fetch(`/api/servers/${data.slug}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${data.token}`,
		},
	});
};
export const getAllChannels = async (data) => {
	return fetch(`/api/servers/${data.slug}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${data.token}`,
		},
	}).then((data) => data.json());
};
