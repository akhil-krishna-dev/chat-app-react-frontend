import React, { useEffect } from "react";
import "./CallerProfile.css";
import { FcVideoCall } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { updateCallingDuration } from "store/callSlice";
import { getCallingDuration } from "utils/timerUtils";

const CallerProfile = ({ isCaller, isVideoCall, otherUser, userCallTaken }) => {
	const callingDuration = useSelector((state) => state.call.callingDuration);
	const dispatch = useDispatch();
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
		if (userCallTaken) return;
		if (isCaller) return <span>Calling to &nbsp; </span>;
		return <span>Call from &nbsp; </span>;
	};

	useEffect(() => {
		let callingTimeStart = {};
		if (userCallTaken && !isVideoCall) {
			callingTimeStart = setInterval(() => {
				dispatch(updateCallingDuration());
			}, 1000);
		}
		return () => {
			clearInterval(callingTimeStart);
		};
	}, [userCallTaken]);

	return (
		<div className={`caller-profile-container ${!userCallTaken && "show"}`}>
			<div className="caller-image-container">
				<img src={otherUser?.image} alt={otherUser?.full_name} />
			</div>
			<div className="caller-details-container">
				<p>
					<span>
						{getCallingStatus()}
						{otherUser?.full_name}
					</span>
					{userCallTaken && (
						<div>{getCallingDuration(callingDuration)}</div>
					)}
				</p>
			</div>
		</div>
	);
};

export default CallerProfile;
