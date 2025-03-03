import React from "react";
import "./Call.css";
import VoiceCall from "./components/VoiceCall";
import VideoCall from "./components/VideoCall";
import { useSelector } from "react-redux";

const Call = () => {
	const { isUserInVideoCall } = useSelector((state) => state.call.videoCall);
	const { isUserInVoiceCall } = useSelector((state) => state.call.voiceCall);

	const handleTogglCallHide = () => {
		if (isUserInVideoCall || isUserInVoiceCall) {
			return false;
		}
		return true;
	};

	return (
		<div hidden={handleTogglCallHide()} className="all-calls-container">
			{isUserInVideoCall ? <VideoCall /> : <VoiceCall />}
		</div>
	);
};

export default Call;
