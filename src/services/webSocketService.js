import {
	updateSeenMessage,
	updateMessagesInChat,
	updateParticipantsOnlineStatus,
	updateChatListWithNewChat,
	updateParticipantsOnlineStatusAndLastSeen,
	updateOtherUserWhenCalling,
} from "store/chatSlice";
import { addAnswer, sendAnswer } from "./signalingService";
import {
	updateIsUserInVideoCall,
	updateIsUserInVoiceCall,
	updateUserCallTaken,
} from "store/callSlice";

const handleWebSocketMessages = async (
	socket,
	data,
	dispatch,
	getPeerConnection,
	pendingCandidatesRef,
	endCall
) => {
	if (!data) return;

	let peerConnectionRef = null;

	switch (data.type) {
		case "message_notification":
			if (Array.isArray(data.data)) {
				for (let index in data.data) {
					dispatch(updateMessagesInChat(data.data[index]));
				}
			} else {
				dispatch(updateMessagesInChat(data.data));
			}
			break;

		case "online":
			setTimeout(() => {
				dispatch(updateParticipantsOnlineStatus(data.data.user_id));
				socket.send(
					JSON.stringify({
						type: "online",
						data: {
							user_id: data.data.user_id,
						},
					})
				);
			}, 3000);
			break;

		case "replay_from_online_user":
			dispatch(updateParticipantsOnlineStatus(data.data.user_id));
			break;

		case "new_chat":
			dispatch(updateChatListWithNewChat(data?.data));
			setTimeout(() => {
				dispatch(updateParticipantsOnlineStatus(data?.user_id));
			}, 3000);

			break;

		case "offline":
			const { user_id, last_seen } = data.data;
			const payloadData = { userId: user_id, lastSeen: last_seen };
			dispatch(updateParticipantsOnlineStatusAndLastSeen(payloadData));
			break;

		case "seen_message_ids":
			const { message_ids, chat_id } = data.data;
			const payload = {
				chatId: chat_id,
				msgIds: message_ids,
			};
			dispatch(updateSeenMessage(payload));
			break;

		case "webrtc_offer":
			const { media, offer, created_user_db_id } = data?.data;

			dispatch(updateOtherUserWhenCalling(created_user_db_id));

			if (media === "video") {
				setTimeout(() => {
					dispatch(updateIsUserInVideoCall(true));
				}, 100);
			} else {
				dispatch(updateIsUserInVoiceCall(true));
			}

			peerConnectionRef = await getPeerConnection();

			sendAnswer(
				peerConnectionRef,
				offer,
				socket,
				created_user_db_id,
				pendingCandidatesRef
			);

			break;

		case "webrtc_answer":
			const { answer } = data?.data;

			peerConnectionRef = await getPeerConnection();
			addAnswer(
				answer,
				peerConnectionRef,
				pendingCandidatesRef,
				dispatch
			);

			break;

		case "candidate":
			const { candidate } = data?.data;
			peerConnectionRef = await getPeerConnection();
			if (peerConnectionRef.current.remoteDescription) {
				await peerConnectionRef.current?.addIceCandidate(
					new RTCIceCandidate(candidate)
				);
			} else {
				pendingCandidatesRef.current.push(candidate);
			}

			break;

		case "call-accepted":
			dispatch(updateUserCallTaken(true));
			break;

		case "disconnected":
			endCall();
			break;

		default:
			return;
	}
};

export default handleWebSocketMessages;
