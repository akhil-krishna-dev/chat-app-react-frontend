import axios from "axios";
import React, { useState } from "react";
import { Loader } from "components";
import { API_URL } from "config";

const Logout = () => {
	const [loader, setLoader] = useState(false);

	const handleLogout = () => {
		setLoader(true);

		axios
			.post(`${API_URL}accounts/users/logout/`)
			.then((response) => {
				localStorage.clear();
				setTimeout(() => {
					window.location.href = "/user/login";
				}, 1500);
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setTimeout(() => {
					setLoader(false);
				}, 2000);
			});
	};

	return (
		<div className="logout-container">
			<h4 onClick={handleLogout}>{loader ? <Loader /> : "Log out"}</h4>
		</div>
	);
};

export default Logout;
