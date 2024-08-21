import React, { useContext } from "react";
import "./OwnerProfile.css";
import { Link } from "react-router-dom";
import { UserContext, BaseUrl } from "App";
import { GrEdit } from "react-icons/gr";

const OwnerProfile = () => {
    const {authUser} = useContext(UserContext)

    return (
        <div className="owner-profile-container">
            {
                authUser&&
                <>
                    <Link to={"/profile"} className="owner-profile-image-container">
                        <img src={`${BaseUrl.replace("/api/","")}${authUser.image}`} alt={authUser.full_name} />
                    </Link>
                    <div className="owner-details-container">
                        <h2>{authUser.full_name}</h2>
                        <p>{authUser.status}</p>
                    </div>
                    <Link to={"/profile"} className="owner-profile-edit-btn">
                        <GrEdit color="grey" size={25} /> 
                    </Link>
                </>
            }
        </div>
    );
};

export default OwnerProfile;
