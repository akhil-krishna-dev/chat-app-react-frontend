import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { IoArrowBackCircle } from "react-icons/io5";
import OwnerProfile from "./components/OwnerProfile";
import SearchUser from "./components/SearchUser";
import UsersList from "./components/UsersList";
import ChatList from "./components/ChatList";
import ProfileSettings from "./components/ProfileSettings";
import { useNavigate, useParams } from "react-router-dom";
import { WebSocketUrl } from "App";
import { checkJWT } from "utils/tokenUtils";
import { useDispatch, useSelector } from "react-redux";
import { closeSearchingUsers } from "store/userSlice";
import {
	updateMessagesInChat,
	updateParticipantsOnlineStatus,
} from "store/chatSlice";
import useWebRTC from "hooks/useWebRTC";
import { createUniqUserId, sendAnswer } from "services/signalingService";
import useWebSocket from "hooks/useWebsocket";
import handleWebSocketMessages from "services/webSocketService";

const Sidebar = () => {
	const { searchKeyWord } = useSelector((state) => state.users.searchUsers);

	const dispatch = useDispatch();

	const { option, chatId } = useParams();

	const navigate = useNavigate();

	// useEffect(() => {
	// 	const newSocket = new WebSocket(
	// 		`${WebSocketUrl}user/notification/?token=${checkJWT()}`
	// 	);

	// 	setSocket(newSocket);

	// 	newSocket.onmessage = (event) => {
	// 		const data = JSON.parse(event.data);
	// 		switch (data.type) {
	// 			case "message_notification":
	// 				if (Array.isArray(data.data)) {
	// 					for (let index in data.data) {
	// 						dispatch(updateMessagesInChat(data.data[index]));
	// 					}
	// 				} else {
	// 					dispatch(updateMessagesInChat(data.data));
	// 				}
	// 				break;

	// 			case "online":
	// 				setTimeout(() => {
	// 					dispatch(
	// 						updateParticipantsOnlineStatus(data.data.user_id)
	// 					);
	// 					newSocket.send(
	// 						JSON.stringify({
	// 							type: "online",
	// 							data: {
	// 								user_id: data.data.user_id,
	// 							},
	// 						})
	// 					);
	// 				}, 3000);
	// 				break;

	// 			case "replay_from_online_user":
	// 				dispatch(updateParticipantsOnlineStatus(data.data.user_id));
	// 				break;

	// 			case "new_chat":
	// 				setTimeout(() => {
	// 					newSocket.send(
	// 						JSON.stringify({
	// 							type: "new_chat_user",
	// 							data: {
	// 								user_id: data.user_id,
	// 							},
	// 						})
	// 					);
	// 				}, 3000);
	// 				break;

	// 			case "offline":
	// 				const { user_id, last_seen } = data.data;
	// 				dispatch(
	// 					updateParticipantsOnlineStatus(user_id, last_seen)
	// 				);
	// 				break;
	// 			case "webrtc_offer":
	// 				console.log(data);
	// 				console.log(peerConnection);
	// 				const offer = data?.data?.offer;
	// 				const userId = data?.data?.from;
	// 				sendAnswer(peerConnection, offer, newSocket, userId);
	// 				break;
	// 		}
	// 	};

	// 	newSocket.onclose = () => {};

	// 	return () =>
	// 		newSocket.readyState === WebSocket.OPEN && newSocket.close();
	// }, []);

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
