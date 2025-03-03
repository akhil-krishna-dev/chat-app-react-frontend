import React, { useContext } from "react";
import "./CallEndButton.css";
import { MdCallEnd } from "react-icons/md";
import { HomeContext } from "pages/Home/Home";
import { useSelector } from "react-redux";
import { getCallingDuration } from "utils/timerUtils";

const CallEndButton = () => {
	const { endCall, sendDisconnectMessage } = useContext(HomeContext);
	const { isUserInVideoCall } = useSelector((state) => state.call.videoCall);
	const callingDuration = useSelector((state) => state.call.callingDuration);

	const handleEndCall = () => {
		let callDetails = isUserInVideoCall ? "Video call " : "Voice call ";

		if (callingDuration) {
			callDetails += getCallingDuration(callingDuration);
		}
		sendDisconnectMessage(callDetails);
		endCall();
	};

	return (
		<div className="call-end-btn-container">
			<MdCallEnd
				className="call-end-btn"
				onClick={handleEndCall}
				size={45}
			/>
		</div>
	);
};

export default CallEndButton;
