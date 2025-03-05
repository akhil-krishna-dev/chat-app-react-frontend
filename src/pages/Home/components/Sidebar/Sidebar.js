import React from "react";
import "./Sidebar.css";
import { IoArrowBackCircle } from "react-icons/io5";
import OwnerProfile from "./components/OwnerProfile";
import SearchUser from "./components/SearchUser";
import UsersList from "./components/UsersList";
import ChatList from "./components/ChatList";
import ProfileSettings from "./components/ProfileSettings";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeSearchingUsers } from "store/userSlice";

const Sidebar = () => {
	const { searchKeyWord } = useSelector((state) => state.users.searchUsers);

	const dispatch = useDispatch();

	const { option, chatId } = useParams();

	const navigate = useNavigate();

	const closingUserListComponent = () => {
		dispatch(closeSearchingUsers());
	};

	const closingUserProfileComponent = () => {
		navigate("/home");
	};

	const optionRender = () => {
		if (searchKeyWord) {
			return (
				<>
					<div className="back-to-chat-page">
						{" "}
						<IoArrowBackCircle
							onClick={() => closingUserListComponent()}
							color="#7474e9"
							size={50}
						/>
					</div>
					<UsersList />
				</>
			);
		}
		if (chatId) {
			return <ChatList />;
		}
		switch (option) {
			case "home":
				return <ChatList />;
			case "profile":
				return (
					<>
						<div className="back-to-chat-page">
							<IoArrowBackCircle
								onClick={() => closingUserProfileComponent()}
								color="#7474e9"
								size={50}
							/>
						</div>
						<ProfileSettings />
					</>
				);
			default:
				return null;
		}
	};

	return (
		<div className="sidebar-container">
			<OwnerProfile />
			<SearchUser />
			{optionRender()}
		</div>
	);
};

export default Sidebar;
