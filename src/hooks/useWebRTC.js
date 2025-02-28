import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const useWebRTC = (socket) => {
	const localVideoRef = useRef(null);
	const remoteVideoRef = useRef(null);
	const peerConnectionRef = useRef(null);
	const localStreamRef = useRef(null);

	const { otherUser } = useSelector((state) => state.chatList.currentChat);

	const servers = {
		iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
	};

	useEffect(() => {
		if (!peerConnectionRef.current) {
			peerConnectionRef.current = new RTCPeerConnection(servers);
		}

		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
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

		// peerConnectionRef.current.oniceconnectionstatechange = () => {
		// 	console.log(
		// 		"state of connection",
		// 		peerConnectionRef.current.iceConnectionState
		// 	);
		// };

		// peerConnectionRef.current.onconnectionstatechange = () => {
		// 	console.log(
		// 		"Connection State:",
		// 		peerConnectionRef.current.connectionState
		// 	);

		// 	if (peerConnectionRef.current.connectionState === "disconnected") {
		// 		console.log("Peer connection lost!");
		// 		// disconnectWebRTC();
		// 	}
		// };
	}, [socket, otherUser, peerConnectionRef.current]);

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
		peerConnectionRef,
		disconnectWebRTC,
	};
};

export default useWebRTC;
