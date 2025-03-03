import React, { useContext } from "react";
import "./CallAcceptButton.css";
import { MdCall } from "react-icons/md";
import { HomeContext } from "pages/Home/Home";

const CallAcceptButton = () => {
	const { acceptCall } = useContext(HomeContext);
	return (
		<div className="call-accept-btn-container">
			<MdCall
				className="call-accept-btn"
				onClick={acceptCall}
				size={45}
				color="white"
			/>
		</div>
	);
};

export default CallAcceptButton;
