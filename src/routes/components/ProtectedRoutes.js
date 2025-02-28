import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
	const { authUser } = useSelector((state) => state.users);

	if (!authUser?.id) {
		return <Outlet />;
	}
	return <Navigate to={"/home"} />;
};

export default ProtectedRoutes;
