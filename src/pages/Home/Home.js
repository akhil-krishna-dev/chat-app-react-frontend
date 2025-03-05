import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ChatArea from "./components/ChatArea/ChatArea";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatAreaBackgroud from "components/BackgroundComponents/ChatAreaBackground";
import useWebSocket from "hooks/useWebsocket";
import { checkJWT } from "utils/tokenUtils";
import useWebRTC from "hooks/useWebRTC";
import { sendOffer } from "services/signalingService";
import handleWebSocketMessages from "services/webSocketService";
import { useDispatch, useSelector } from "react-redux";
import { activateOrDeactivateIsUserInVideoCall } from "store/chatSlice";
import Call from "./components/CallArea/Call";
import {
	resetCallingDuration,
	updateIsCaller,
	updateIsUserInVideoCall,
	updateIsUserInVoiceCall,
	updateUserCallTaken,
	updateUserInCall,
} from "store/callSlice";
import { WEBSOCKET_URL } from "config";

export const HomeContext = React.createContext();

const Home = () => {
	const { option, chatId } = useParams();
	const { otherUser } = useSelector((state) => state.chatList.currentChat);

	const dispatch = useDispatch();

	const pendingCandidatesRef = useRef([]);

	const URL = `${WEBSOCKET_URL}user/notification/?token=${checkJWT()}`;

	// webSocket custom hook
	const currentWebSocket = useWebSocket(URL);

	// webRTC custom hook
	const {
		getPeerConnection,
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
				getPeerConnection,
				pendingCandidatesRef,
				endCall
			);
		};
	}, [currentWebSocket]);

	const handleMakeVideoCall = async () => {
		dispatch(updateIsCaller(true));
		dispatch(updateIsUserInVideoCall(true));
		const peerConnectionRef = await getPeerConnection();
		sendOffer("video", peerConnectionRef, currentWebSocket, otherUser.id);
		dispatch(updateUserInCall());
	};

	const handleMakeVoiceCall = async () => {
		dispatch(updateIsCaller(true));
		dispatch(updateIsUserInVoiceCall(true));
		const peerConnectionRef = await getPeerConnection();
		sendOffer("voice", peerConnectionRef, currentWebSocket, otherUser.id);
		dispatch(updateUserInCall());
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

	const sendDisconnectMessage = (callDetails) => {
		currentWebSocket.send(
			JSON.stringify({
				type: "disconnected",
				data: {
					callDetails,
					targetUserId: otherUser.id,
				},
			})
		);
	};

	const acceptCall = () => {
		sendCallAcceptMessage();
		dispatch(updateUserCallTaken(true));
	};

	// for video call or voice call
	const endCall = () => {
		pendingCandidatesRef.current = [];
		dispatch(resetCallingDuration());
		disconnectWebRTC();
		dispatch(updateIsCaller(false));
		dispatch(updateUserCallTaken(false));
		dispatch(activateOrDeactivateIsUserInVideoCall());
		dispatch(updateIsUserInVideoCall(false));
		dispatch(updateIsUserInVoiceCall(false));
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
		handleMakeVoiceCall,
		acceptCall,
		endCall,
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
