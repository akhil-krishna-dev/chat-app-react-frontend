import axios from "axios";

export const checkJWT = () => {
	const JWT = localStorage.getItem("jwt");
	if (JWT) {
		axios.defaults.headers.common.Authorization = "Bearer " + JWT;
	}
	return JWT;
};

export const setJWT = (data) => {
	const { token, expire } = data;
	localStorage.setItem("jwt", token);
	localStorage.setItem("expire", expire);
};
