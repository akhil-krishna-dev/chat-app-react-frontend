import React, { useContext } from "react";
import "./CallAcceptButton.css";
import { MdCall } from "react-icons/md";
import { HomeContext } from "pages/Home/Home";

const CallAcceptButton = () => {
	const { handleCallAccept } = useContext(HomeContext);
	return (
		<div className="call-accept-btn-container">
			<MdCall
				className="call-accept-btn"
				onClick={handleCallAccept}
				size={45}
				color="white"
			/>
		</div>
	);
};

export default CallAcceptButton;
