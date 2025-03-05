import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "config";
import "./UsersList.css";
import { Loader } from "components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateChatListWithNewChat } from "store/chatSlice";
import { closeSearchingUsers } from "store/userSlice";

const UsersList = () => {
	const { authUser, searchUsers } = useSelector((state) => state.users);
	const { isSearchingUsers, results } = searchUsers;

	const dispatch = useDispatch();

	const [isCreatingChat, setIsCreatingChat] = useState(false);
	const navigate = useNavigate();

	const createNewChat = (userIds) => {
		if (isCreatingChat) return;

		setIsCreatingChat(true);
		axios
			.post(`${API_URL}home/chats/`, { participants: userIds })
			.then((response) => {
				if (response.statusText === "Created") {
					dispatch(updateChatListWithNewChat(response.data));
				}
				dispatch(closeSearchingUsers());
				navigate(`/chat/${response.data.id}`);
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setTimeout(() => {
					setIsCreatingChat(false);
				}, 500);
			});
	};

	return (
		<div className="userslist-container">
			{!isSearchingUsers ? (
				results.length > 0 ? (
					results.map((user) => (
						<div
							key={user.id}
							onClick={() =>
								createNewChat([user.id, authUser.id])
							}
							className="user-container"
						>
							<div className="user-image-container">
								<img src={user.image} alt="user" />
							</div>
							<div className="user-details">
								<h4>{user.full_name}</h4>
							</div>
						</div>
					))
				) : (
					<p className="no-user-message">no users with this name !</p>
				)
			) : (
				<Loader />
			)}
		</div>
	);
};

export default UsersList;
