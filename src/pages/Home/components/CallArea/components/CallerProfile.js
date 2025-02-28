import React from "react";
import "./CallerProfile.css";
import { FcVideoCall } from "react-icons/fc";

const CallerProfile = ({ isCaller, isVideoCall, otherUser }) => {
	//
	// rendering call status
	const getCallingStatus = () => {
		if (isVideoCall) {
			if (isCaller)
				return (
					<span>
						<FcVideoCall size={45} />
						&nbsp; <span>Video Call to &nbsp; </span>
					</span>
				);
			return (
				<span>
					<FcVideoCall size={45} />
					&nbsp; <span>Video call from &nbsp; </span>
				</span>
			);
		}
		if (isCaller) return "Calling to ";
		return "Call from ";
	};

	return (
		<div className="caller-profile-container">
			<div className="caller-image-container">
				<img src={otherUser?.image} />
			</div>
			<div className="caller-details-container">
				<p>
					{getCallingStatus()}
					<span>{otherUser?.full_name}</span>{" "}
				</p>
			</div>
		</div>
	);
};

export default CallerProfile;
