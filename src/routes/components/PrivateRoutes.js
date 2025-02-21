import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkJWT } from "utils/tokenUtils";

const PrivateRoutes = () => {
	if (checkJWT()) {
		return <Outlet />;
	}
	return <Navigate to={"/user/login"} />;
};

export default PrivateRoutes;
