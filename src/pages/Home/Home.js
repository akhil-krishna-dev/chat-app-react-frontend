import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ChatArea from "./components/ChatArea/ChatArea";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatAreaBackgroud from "components/BackgroundComponents/ChatAreaBackground";
import useWebSocket from "hooks/useWebsocket";
import { WebSocketUrl } from "App";
import { checkJWT } from "utils/tokenUtils";
import useWebRTC from "hooks/useWebRTC";
import { sendOffer } from "services/signalingService";
import handleWebSocketMessages from "services/webSocketService";
import { useDispatch, useSelector } from "react-redux";
import { activateOrDeactivateIsUserInVideoCall } from "store/chatSlice";
import Call from "./components/CallArea/Call";
import {
	updateIsCaller,
	updateIsUserInVideoCall,
	updateUserCallTaken,
	updateUserInCall,
} from "store/callSlice";

export const HomeContext = React.createContext();

const Home = () => {
	const { option, chatId } = useParams();
	const { otherUser } = useSelector((state) => state.chatList.currentChat);

	const dispatch = useDispatch();

	const pendingCandidatesRef = useRef([]);

	const URL = `${WebSocketUrl}user/notification/?token=${checkJWT()}`;

	const currentWebSocket = useWebSocket(URL);
	const {
		peerConnectionRef,
		localVideoRef,
		remoteVideoRef,
		disconnectWebRTC,
	} = useWebRTC(currentWebSocket);

	useEffect(() => {
		if (!currentWebSocket) return;
		currentWebSocket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			handleWebSocketMessages(
				currentWebSocket,
				data,
				dispatch,
				peerConnectionRef,
				pendingCandidatesRef,
				handleEndVideoCall
			);
		};
	}, [currentWebSocket]);

	const handleMakeVideoCall = () => {
		sendOffer(peerConnectionRef, currentWebSocket, otherUser.id);
		dispatch(updateIsCaller(true));
		dispatch(updateUserInCall());
		dispatch(updateIsUserInVideoCall(true));
	};

	const sendCallAcceptMessage = () => {
		currentWebSocket.send(
			JSON.stringify({
				type: "call-accepted",
				data: {
					targetUserId: otherUser.id,
				},
			})
		);
	};

	const sendDisconnectMessage = () => {
		currentWebSocket.send(
			JSON.stringify({
				type: "disconnected",
				data: {
					targetUserId: otherUser.id,
				},
			})
		);
	};

	const handleCallAccept = () => {
		sendCallAcceptMessage();
		dispatch(updateUserCallTaken(true));
	};

	const handleEndVideoCall = () => {
		pendingCandidatesRef.current = [];
		disconnectWebRTC();
		dispatch(updateIsCaller(false));
		dispatch(updateUserCallTaken(false));
		dispatch(activateOrDeactivateIsUserInVideoCall());
		dispatch(updateIsUserInVideoCall(false));
	};

	const renderComponent = () => {
		if (chatId) return <ChatArea currentWebSocket={currentWebSocket} />;
		if (option === "home" || option === "profile")
			return <ChatAreaBackgroud />;
	};

	// context value
	const homeContextValue = {
		localVideoRef,
		remoteVideoRef,
		handleMakeVideoCall,
		handleCallAccept,
		handleEndVideoCall,
		sendDisconnectMessage,
	};

	return (
		<HomeContext.Provider value={homeContextValue}>
			<Call />
			<Sidebar />
			{renderComponent()}
		</HomeContext.Provider>
	);
};

export default Home;
