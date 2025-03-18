import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const useWebRTC = (socket) => {
	const localVideoRef = useRef(null);
	const remoteVideoRef = useRef(null);
	const peerConnectionRef = useRef(null);
	const mediaPermissionRef = useRef({ state: "pending" });

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

		mediaPermissionRef.current.state = "pending";

		navigator.mediaDevices
			.getUserMedia({ video: isUserInVideoCall, audio: true })
			.then((stream) => {
				mediaPermissionRef.current.state = "allowed";

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
				mediaPermissionRef.current.state = "denied";
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
		return new Promise((resolve, reject) => {
			const peerInterval = setInterval(() => {
				if (mediaPermissionRef.current.state === "denied") {
					clearInterval(peerInterval);
					reject(false);
				}
				if (
					mediaPermissionRef.current.state === "allowed" &&
					peerConnectionRef.current &&
					localVideoRef.current &&
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
		mediaPermissionRef.current.state = "pending";
		// Close peer connection
		if (peerConnectionRef.current) {
			peerConnectionRef.current.ontrack = null;
			peerConnectionRef.current.onicecandidate = null;
			peerConnectionRef.current.onnegotiationneeded = null;
			peerConnectionRef.current.onsignalingstatechange = null;
			peerConnectionRef.current.onconnectionstatechange = null;
			peerConnectionRef.current.oniceconnectionstatechange = null;
			peerConnectionRef.current.onicegatheringstatechange = null;

			peerConnectionRef.current.close();
			peerConnectionRef.current = null;
		}

		// Clear video elements
		if (localVideoRef.current) {
			localVideoRef.current?.srcObject?.getTracks().forEach((track) => {
				track.stop();
			});
			localVideoRef.current.srcObject = null;
		}

		// Stop all media tracks remote live
		if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
			remoteVideoRef.current?.srcObject?.getTracks().forEach((track) => {
				if (track.readyState === "live") {
					track.stop();
				}
			});
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
