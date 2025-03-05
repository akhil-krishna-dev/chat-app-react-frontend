import React from "react";
import "./OwnerProfile.css";
import { Link, useParams } from "react-router-dom";
import { GrEdit } from "react-icons/gr";
import { useSelector } from "react-redux";
import { API_URL } from "config";

const OwnerProfile = () => {
	const { authUser } = useSelector((state) => state.users);
	const { option } = useParams();

	const renderAuthUserProfileEditBtn = () => {
		if (option !== "profile")
			return (
				<Link to={"/profile"} className="owner-profile-edit-btn">
					<GrEdit color="grey" size={25} />
				</Link>
			);
	};

	return (
		<div className="owner-profile-container">
			{authUser && (
				<>
					<Link
						to={"/profile"}
						className="owner-profile-image-container"
					>
						<img
							src={`${API_URL.replace("/api/", "")}${
								authUser.image
							}`}
							alt={authUser.full_name}
						/>
					</Link>
					<div className="owner-details-container">
						<h2>{authUser.full_name}</h2>
						<p>{authUser.status}</p>
					</div>
					{renderAuthUserProfileEditBtn()}
				</>
			)}
		</div>
	);
};

export default OwnerProfile;
