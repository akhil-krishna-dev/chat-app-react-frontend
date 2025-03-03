import React, { useContext, useEffect } from "react";
import "./VoiceCall.css";
import { HomeContext } from "pages/Home/Home";
import CallerProfile from "./CallerProfile";
import { useSelector } from "react-redux";
import CallButtons from "./CallButtons";

const VoiceCall = () => {
	const { otherUser } = useSelector((state) => state.chatList.currentChat);
	const { userCallTaken } = useSelector((state) => state.call);

	const isCaller = useSelector((state) => state.call.isCaller);

	const { localVideoRef, remoteVideoRef } = useContext(HomeContext);

	useEffect(() => {
		if (userCallTaken) {
			localVideoRef.current.play();
			remoteVideoRef.current.play();
		}
	}, [userCallTaken]);

	if (!otherUser?.id) return;

	return (
		<div className="voice-call-screen-container">
			<div className={`voice-call-screen ${!userCallTaken && "ringing"}`}>
				<audio ref={remoteVideoRef} className="remote-voice" />
				<audio
					hidden
					ref={localVideoRef}
					className="remote-voice"
					muted
				/>
			</div>

			{/* caller profile show when call comes */}
			{/* {!userCallTaken && ( */}
			<CallerProfile
				isCaller={isCaller}
				isVideoCall={false}
				otherUser={otherUser}
				userCallTaken={userCallTaken}
			/>
			{/* )} */}

			{/* call accept and end buttons */}
			<CallButtons isCaller={isCaller} userCallTaken={userCallTaken} />
		</div>
	);
};

export default VoiceCall;
