import React from "react";
import "./App.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "api/user";
import CustomRoutes from "routes/CustomRoutes";
import { BrowserRouter } from "react-router-dom";

if (window.location.pathname === "/") {
	window.location.pathname = "/home";
}

export const BaseUrl = "http://127.0.0.1:8000/api/";
export const WebSocketUrl = "ws://127.0.0.1:8000/ws/";

const App = () => {
	const { authChecked } = useSelector((state) => state.users);
	const dispatch = useDispatch();

	useEffect(() => {
		fetchUser(dispatch);
	}, []);

	if (authChecked) {
		return (
			<BrowserRouter>
				<div className="App">
					<CustomRoutes />
				</div>
			</BrowserRouter>
		);
	}
};

export default App;
