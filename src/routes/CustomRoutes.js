import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PrivateRoutes from "./components/PrivateRoutes";
import Login from "pages/Login/Login";
import Register from "pages/Register/Register";
import Home from "pages/Home/Home";
import PageNotFound from "pages/PageNotFound/PageNotFound";

const CustomRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<PrivateRoutes />}>
				<Route path="/" element={<Home />} />
				<Route path="/:option" element={<Home />} />
				<Route path="/chat/:chatId" element={<Home />} />
			</Route>
			<Route path="user" element={<ProtectedRoutes />}>
				<Route path="register" element={<Register />} />
				<Route path="login" element={<Login />} />
			</Route>
			<Route path="*" element={<PageNotFound />} />
		</Routes>
	);
};

export default CustomRoutes;
