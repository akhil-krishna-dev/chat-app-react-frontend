import React, { useContext, useEffect } from "react";
import "./VideoCall.css";
import { HomeContext } from "pages/Home/Home";
import CallerProfile from "./CallerProfile";
import { useDispatch, useSelector } from "react-redux";
import CallButtons from "./CallButtons";
import { updateCallingDuration } from "store/callSlice";

const VideoCall = () => {
	const { otherUser } = useSelector((state) => state.chatList.currentChat);
	const { userCallTaken } = useSelector((state) => state.call);

	const dispatch = useDispatch();

	const isCaller = useSelector((state) => state.call.isCaller);

	const { localVideoRef, remoteVideoRef } = useContext(HomeContext);

	useEffect(() => {
		let callTimer = {};
		if (userCallTaken) {
			localVideoRef.current.play();
			remoteVideoRef.current.play();

			callTimer = setInterval(() => {
				dispatch(updateCallingDuration());
			}, 1000);
		}
		return () => clearInterval(callTimer);
	}, [userCallTaken]);

	if (!otherUser?.id) return;

	return (
		<div className="video-call-screen-container">
			<div className={`video-call-screen ${!userCallTaken && "ringing"}`}>
				<video ref={localVideoRef} className="local-video" />
				<video ref={remoteVideoRef} className="remote-video" />
			</div>

			{/* caller profile show when call comes */}
			{!userCallTaken && (
				<CallerProfile
					isCaller={isCaller}
					isVideoCall={true}
					otherUser={otherUser}
				/>
			)}

			{/* call accept and end buttons */}
			<CallButtons isCaller={isCaller} userCallTaken={userCallTaken} />
		</div>
	);
};

export default VideoCall;
