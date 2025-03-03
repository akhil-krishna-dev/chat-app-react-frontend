import { activateOrDeactivateIsUserInVideoCall } from "store/chatSlice";
import { addPendingIceCandidates } from "utils/iceCandidatesUtils";
//
// creating an offer and sending
export const sendOffer = async (
	media,
	peerConnectionRef,
	socket,
	targetUserId
) => {
	const offer = await peerConnectionRef.current.createOffer();
	await peerConnectionRef.current.setLocalDescription(offer);

	const data = { type: "offer", data: { media, offer, targetUserId } };

	socket.send(JSON.stringify(data));
};

// Sending answer to offer creator
export const sendAnswer = async (
	peerConnectionRef,
	offer,
	socket,
	targetUserId,
	pendingCandidatesRef
) => {
	await peerConnectionRef.current.setRemoteDescription(
		new RTCSessionDescription(offer)
	);

	const answer = await peerConnectionRef.current.createAnswer();
	await peerConnectionRef.current.setLocalDescription(answer);

	addPendingIceCandidates(pendingCandidatesRef, peerConnectionRef);

	const data = {
		type: "answer",
		data: { answer, targetUserId },
	};

	socket.send(JSON.stringify(data));
};

export const addAnswer = (
	answer,
	peerConnectionRef,
	pendingCandidatesRef,
	dispatch
) => {
	if (!peerConnectionRef.current.currentRemoteDescription) {
		peerConnectionRef.current
			.setRemoteDescription(new RTCSessionDescription(answer))
			.then(() => {
				dispatch(activateOrDeactivateIsUserInVideoCall());
			})
			.catch((err) => {});
		addPendingIceCandidates(pendingCandidatesRef, peerConnectionRef);
	}
};
