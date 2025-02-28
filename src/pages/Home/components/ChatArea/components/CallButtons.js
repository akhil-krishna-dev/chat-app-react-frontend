import React, { useContext } from "react";
import "./CallButtons.css";
import { IoCall, IoVideocam } from "react-icons/io5";
import { HomeContext } from "pages/Home/Home";

const CallButtons = () => {
	const { handleMakeVideoCall } = useContext(HomeContext);

	const handleVideoCall = () => {
		handleMakeVideoCall();
	};
	return (
		<div className="call-btn-container">
			<IoVideocam onClick={handleVideoCall} size={50} />
			<IoCall size={50} />
		</div>
	);
};

export default CallButtons;
