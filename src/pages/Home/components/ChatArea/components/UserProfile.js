import React from "react";
import "./UserProfile.css";
import { IoArrowBackCircle } from "react-icons/io5";
import { Loader } from "components";
import { useDispatch, useSelector } from "react-redux";
import convertTimestampToDate from "utils/dateUtils";
import { activateOrDeactivateChatAreaForSmallDevice } from "store/chatSlice";

const UserProfile = () => {
	const { otherUser } = useSelector((state) => state.chatList.currentChat);

	const dispatch = useDispatch();

	const renderChatBackBtn = () => {
		return (
			<div className="chat-back-btn-container">
				<IoArrowBackCircle
					onClick={() =>
						dispatch(activateOrDeactivateChatAreaForSmallDevice())
					}
					size={50}
					color="#7474e9"
				/>
			</div>
		);
	};

	const convertTime = (timestamp) => {
		return convertTimestampToDate(timestamp);
	};

	const renderOnlineStatus = () => {
		if (otherUser?.online) {
			return (
				<div className="online-status-container">
					{" "}
					<span className="online-status"></span> online
				</div>
			);
		}
		if (!otherUser.last_seen) {
			return <Loader />;
		}
		return <div>last seen {convertTime(otherUser.last_seen)}</div>;
	};

	return (
		<div className="user-profile-container">
			<div className="user-image-container">
				<img
					src={otherUser && otherUser.image}
					alt={otherUser && otherUser.full_name}
				/>
			</div>
			<div className="user-details">
				<div className="username">
					{otherUser && otherUser.full_name}
				</div>
				{renderOnlineStatus()}
			</div>

			{/* for small screen devices */}
			{renderChatBackBtn()}
		</div>
	);
};

export default UserProfile;
