import "./VideoCall.css";
import { HomeContext } from "pages/Home/Home";
import React, { useContext } from "react";
import CallerProfile from "./CallerProfile";
import { useSelector } from "react-redux";
import CallButtons from "./CallButtons";

const VideoCall = () => {
	const { otherUser } = useSelector((state) => state.chatList.currentChat);
	const { userCallTaken } = useSelector((state) => state.call);

	const isCaller = useSelector((state) => state.call.isCaller);

	const { localVideoRef, remoteVideoRef } = useContext(HomeContext);

	if (!otherUser?.id) return;
	return (
		<div className="video-call-screen-container">
			<div className={`video-call-screen ${!userCallTaken && "ringing"}`}>
				<video ref={localVideoRef} className="local-video" autoPlay />
				<video ref={remoteVideoRef} className="remote-video" autoPlay />
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
