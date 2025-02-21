import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { BaseUrl } from "App";
import { SubmitButton } from "components";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { setJWT } from "utils/tokenUtils";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loader, setLoader] = useState(false);

	const handleSubmit = () => {
		setLoader(true);
		if (!email) {
			Swal.fire({
				icon: "error",
				text: "Please enter your email",
			});
			setLoader(false);
			return;
		}
		if (!password) {
			Swal.fire({
				icon: "error",
				text: "Please enter your password",
			});
			setLoader(false);
			return;
		}
		const data = {
			email: email,
			password: password,
		};
		axios
			.post(`${BaseUrl}accounts/login/`, data)
			.then((response) => {
				setJWT(response.data);
				window.location.pathname = "/home";
			})
			.catch((error) => {
				if (error.code === "ERR_NETWORK") {
					Swal.fire({
						icon: "error",
						title: "Network error!",
						text: "please check your internet.",
					});
					return;
				}

				let errorMessage = "An unexpected error occurred.";
				if (error.response) {
					const errorData = error.response.data;
					if (errorData.non_field_errors) {
						errorMessage = error.response.data.non_field_errors;
					}
					if (errorData.email) {
						errorMessage = error.response.data.email[0];
					}
					if (typeof errorData === "string") {
						errorMessage = errorData;
					}
				}

				Swal.fire({
					icon: "error",
					text: errorMessage,
				});
			})
			.finally(() => {
				setTimeout(() => {
					setLoader(false);
				}, 1000);
			});
	};

	return (
		<div className="login-container">
			<div className="login-form-container">
				<h1>Login</h1>
				<div className="input-container">
					<input
						onChange={(event) => setEmail(event.target.value)}
						type="email"
						placeholder="email"
					/>
				</div>
				<div className="input-container">
					<input
						onChange={(event) => setPassword(event.target.value)}
						type="password"
						placeholder="password"
					/>
				</div>
				<SubmitButton
					handleSubmit={handleSubmit}
					action={"Log in"}
					loader={loader}
				/>
				<p>
					New user? <Link to={"/user/register"}>Register</Link>{" "}
				</p>
			</div>
		</div>
	);
};

export default Login;
