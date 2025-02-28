import React from "react";
import "./CallButtons.css";
import CallEndButton from "./CallEndButton";
import CallAcceptButton from "./CallAcceptButton";

const CallButtons = ({ isCaller, userCallTaken }) => {
	return (
		<div
			className={`call-accept-and-end-button-container ${
				userCallTaken && "call-taken"
			}`}
		>
			{!userCallTaken && !isCaller && <CallAcceptButton />}
			<CallEndButton />
		</div>
	);
};

export default CallButtons;
