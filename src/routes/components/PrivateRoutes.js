import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
	const { authUser } = useSelector((state) => state.users);

	if (authUser.id) {
		return <Outlet />;
	}
	return <Navigate to={"/user/login"} />;
};

export default PrivateRoutes;
