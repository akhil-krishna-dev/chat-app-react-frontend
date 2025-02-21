import React from "react";
import "./App.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "api/user";
import CustomRoutes from "routes/CustomRoutes";
import { BrowserRouter } from "react-router-dom";

if (window.location.pathname === "/") {
	window.location.pathname = "/home";
}

export const BaseUrl = "http://127.0.0.1:8000/api/";
export const WebSocketUrl = "ws://127.0.0.1:8000/ws/";

const App = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		fetchUser(dispatch);
	}, []);

	return (
		<BrowserRouter>
			<div className="App">
				<CustomRoutes />
			</div>
		</BrowserRouter>
	);
};

export default App;
