import { Navigate, Outlet } from "react-router-dom";
import { checkJWT } from "utils/tokenUtils";

const ProtectedRoutes = () => {
	if (!checkJWT()) {
		return <Outlet />;
	}
	return <Navigate to={"/home"} />;
};

export default ProtectedRoutes;
