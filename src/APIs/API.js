const ENDPOINT = "http://192.168.100.130:3000";
export const onLogin = async (data) => {
	return fetch(`${ENDPOINT}/api/users/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(data),
	}).then((data) => data.json());
};
export const onRegisterUser = async (data) => {
	return fetch(`${ENDPOINT}/api/users/signup`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}).then((data) => data.json());
};
export const getAllServers = async (token) => {
	return fetch(`${ENDPOINT}/api/users/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then((data) => data.json());
};
export const onCreateServer = async (data) => {
	return fetch(`${ENDPOINT}/api/servers`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${data.token}`,
		},
		body: data.formdata,
	}).then((data) => data.json());
};
export const onJoinServer = async (data) => {
	return fetch(`${ENDPOINT}/api/servers/${data.slug}/join`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${data.token}`,
		},
	}).then((data) => data.json());
};
export const onCreateChannel = async (data) => {
	return fetch(`${ENDPOINT}/api/servers/${data.serverSlug}/channels`, {
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
	return fetch(
		`${ENDPOINT}/api/servers/${data.serverSlug}/channels/${data.slug}`,
		{
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${data.token}`,
			},
		}
	).then((data) => data.json());
};
export const onChangePassword = async (data) => {
	return fetch(`${ENDPOINT}/api/users/updatePassword`, {
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
	return fetch(`${ENDPOINT}/api/users/me`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then((data) => data.json());
};
export const getUserById = async (data) => {
	return fetch(`${ENDPOINT}/api/users/${data.id}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${data.token}`,
		},
	}).then((data) => data.json());
};
export const getChannelMessages = async (data) => {
	return fetch(
		`${ENDPOINT}/api/servers/${data.serverSlug}/channels/${data.channelSlug}/messages`,
		{
			headers: {
				Authorization: `Bearer ${data.token}`,
			},
		}
	).then((data) => data.json());
};
export const onUserLeaveServer = async (data) => {
	return fetch(`${ENDPOINT}/api/servers/${data.slug}/leave`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${data.token}`,
		},
	});
};
export const onUserDeleteServer = async (data) => {
	return fetch(`${ENDPOINT}/api/servers/${data.slug}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${data.token}`,
		},
	});
};
export const getAllChannels = async (data) => {
	return fetch(`${ENDPOINT}/api/servers/${data.slug}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${data.token}`,
		},
	}).then((data) => data.json());
};
export const getAllFriends = async (data) => {
	return fetch(`${ENDPOINT}/api/friends/all`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${data.token}`,
		},
	}).then((data) => data.json());
};
export const getPendingRequests = async (data) => {
	return fetch(`${ENDPOINT}/api/friends/pending`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${data.token}`,
		},
	}).then((data) => data.json());
};
export const sendFriendRequest = async (data) => {
	return fetch(`${ENDPOINT}/api/friends/send`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${data.token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			receiver: `${data.id}`,
		}),
	}).then((data) => data.json());
};
export const acceptFriendRequest = async (data) => {
	return fetch(`${ENDPOINT}/api/friends/accept`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${data.token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ sender: `${data.id}` }),
	}).then((data) => data.json());
};
export const declineFriendRequest = async (data) => {
	return fetch(`${ENDPOINT}/api/servers/${data.slug}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${data.token}`,
		},
		body: JSON.stringify({ sender: `${data.id}` }),
	}).then((data) => data.json());
};
export const unfriendRequest = async (data) => {
	return fetch(`${ENDPOINT}/api/servers/${data.slug}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${data.token}`,
		},
		body: JSON.stringify({ removee: `${data.id}` }),
	}).then((data) => data.json());
};
export const searchUser = async (data) => {
	return fetch(`${ENDPOINT}/api/users?search=${data.name}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${data.token}`,
		},
	}).then((data) => data.json());
};
