import React, { useState } from "react";
import axios from "axios";
import { BaseUrl } from "App";
import { SubmitButton } from "components";
import "./Register.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { setJWT } from "utils/tokenUtils";

const Register = () => {
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loader, setLoader] = useState(false);

	const handleSubmit = () => {
		setLoader(true);
		const data = {
			email: email,
			first_name: firstName,
			last_name: lastName,
			password: password,
			confirm_password: confirmPassword,
		};
		axios
			.post(`${BaseUrl}accounts/register/`, data)
			.then((response) => {
				axios
					.post(`${BaseUrl}accounts/login/`, {
						email: data.email,
						password: data.password,
					})
					.then((response) => {
						setJWT(response.data);
						window.location.pathname = "/home";
					})
					.catch((error) => {});
			})
			.catch((error) => {
				if (error.code === "ERR_NETWORK") {
					Swal.fire({
						icon: "error",
						title: "Network error",
						text: "please check your internet",
					});
					return;
				}
				if (error) {
					Swal.fire({
						icon: "error",
						text: error.response.data,
					});
				}
			})
			.finally(() => {
				setTimeout(() => {
					setLoader(false);
				}, 1000);
			});
	};

	return (
		<div className="register-container">
			<div className="register-form-container">
				<h1>Register</h1>
				<div className="input-container">
					<input
						onChange={(event) => setEmail(event.target.value)}
						type="email"
						placeholder="email"
					/>
				</div>
				<div className="input-container">
					<input
						onChange={(event) => setFirstName(event.target.value)}
						type="text"
						placeholder="first name"
					/>
				</div>
				<div className="input-container">
					<input
						onChange={(event) => setLastName(event.target.value)}
						type="text"
						placeholder="last name"
					/>
				</div>
				<div className="input-container">
					<input
						onChange={(event) => setPassword(event.target.value)}
						type="password"
						placeholder="password"
					/>
				</div>
				<div className="input-container">
					<input
						onChange={(event) =>
							setConfirmPassword(event.target.value)
						}
						type="password"
						placeholder="confirm password"
					/>
				</div>
				<SubmitButton
					handleSubmit={handleSubmit}
					action={"Register"}
					loader={loader}
				/>
				<p>
					Already have an account?{" "}
					<Link to={"/user/login"}>Log in</Link>{" "}
				</p>
			</div>
		</div>
	);
};

export default Register;
