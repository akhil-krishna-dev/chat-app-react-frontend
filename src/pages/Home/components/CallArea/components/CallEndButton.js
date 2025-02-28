import React, { useContext } from "react";
import "./CallEndButton.css";
import { MdCallEnd } from "react-icons/md";
import { HomeContext } from "pages/Home/Home";

const CallEndButton = () => {
	const { handleEndVideoCall, sendDisconnectMessage } =
		useContext(HomeContext);
	const handleEndCall = () => {
		sendDisconnectMessage();
		handleEndVideoCall();
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
