import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const useWebRTC = (socket) => {
	const localVideoRef = useRef(null);
	const remoteVideoRef = useRef(null);
	const peerConnectionRef = useRef(null);
	const localStreamRef = useRef(null);

	const { isUserInVideoCall } = useSelector((state) => state.call.videoCall);
	const { isUserInVoiceCall } = useSelector((state) => state.call.voiceCall);

	const { otherUser } = useSelector((state) => state.chatList.currentChat);

	const servers = {
		iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
	};

	useEffect(() => {
		if (!isUserInVideoCall && !isUserInVoiceCall) return;

		if (!peerConnectionRef.current) {
			peerConnectionRef.current = new RTCPeerConnection(servers);
		}

		navigator.mediaDevices
			.getUserMedia({ video: isUserInVideoCall, audio: true })
			.then((stream) => {
				localStreamRef.current = stream;
				if (localVideoRef.current) {
					localVideoRef.current.srcObject = stream;
					stream
						.getTracks()
						.forEach((track) =>
							peerConnectionRef.current.addTrack(track, stream)
						);
				}
			})
			.catch((error) => {
				console.log(error);
			});

		peerConnectionRef.current.ontrack = (event) => {
			if (remoteVideoRef.current) {
				remoteVideoRef.current.srcObject = event.streams[0];
			}
		};

		peerConnectionRef.current.onicecandidate = (event) => {
			if (event.candidate && otherUser?.id) {
				socket.send(
					JSON.stringify({
						type: "ice-candidate",
						data: {
							candidate: event.candidate,
							targetUserId: otherUser.id,
						},
					})
				);
			}
		};
	}, [
		socket,
		otherUser,
		peerConnectionRef.current,
		isUserInVideoCall,
		isUserInVoiceCall,
	]);

	// getting for current peerConnection in promise
	const getPeerConnection = async () => {
		return new Promise((resolve) => {
			const peerInterval = setInterval(() => {
				if (
					peerConnectionRef.current &&
					localStreamRef.current &&
					remoteVideoRef.current
				) {
					clearInterval(peerInterval);
					resolve(peerConnectionRef);
				}
			}, 100);
		});
	};

	// Disconnect method
	const disconnectWebRTC = () => {
		// Close peer connection
		if (peerConnectionRef.current) {
			peerConnectionRef.current.ontrack = null;
			peerConnectionRef.current.onicecandidate = null;
			peerConnectionRef.current.close();
			peerConnectionRef.current = null;
		}

		// Stop all media tracks
		if (localStreamRef.current) {
			localStreamRef.current.getTracks().forEach((track) => track.stop());
			localStreamRef.current = null;
		}

		// Clear video elements
		if (localVideoRef.current) {
			localVideoRef.current.srcObject = null;
		}
		if (remoteVideoRef.current) {
			remoteVideoRef.current.srcObject = null;
		}
	};

	return {
		localVideoRef,
		remoteVideoRef,
		getPeerConnection,
		disconnectWebRTC,
	};
};

export default useWebRTC;
