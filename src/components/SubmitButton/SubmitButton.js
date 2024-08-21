import React from "react";
import Loader from "components/Loader/Loader";

const SubmitButton = ({ handleSubmit, action, loader }) => {
    return (
        <div className="button-container">
            <button onClick={handleSubmit}>
                {
                    loader?
                    <Loader/>:
                    action
                }
            </button>
        </div>
    );
};

export default SubmitButton;
