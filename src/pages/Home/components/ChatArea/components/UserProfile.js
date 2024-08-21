import React, { useContext } from "react";
import "./UserProfile.css";
import { ChatListContext, } from "App";
import { IoArrowBackCircle } from "react-icons/io5";
import { Loader } from "components";


const UserProfile = () => {

    const {
        otherUser,
        setCssClassName
    } = useContext(ChatListContext)

    const renderChatBackBtn = () => {
        return <div className="chat-back-btn-container">
                    <IoArrowBackCircle 
                    onClick={() => setCssClassName(prevClass => {
                        return {...prevClass, chatAreaContainer:""}
                    })}
                    size={50} 
                    color="#7474e9" />
                </div>
    }

    const convertTime = (timestamp) => {
        const now = new Date()
        const date = new Date(timestamp)

        const currentDay = now.getDate()

        const options = {
            hour: '2-digit',
            minute: '2-digit',
        };       

        
        if(currentDay === date.getDate()){
            return `today ${date.toLocaleString(undefined, options)}`
        }
        if((parseInt(currentDay) - parseInt(date.getDate())) === 1){
            return `yesterday ${date.toLocaleString(undefined, options)}`
        }else{
            options['month'] = 'long'
            options['day'] = 'numeric'
            options['year'] = 'numeric'
        }
  
        return  date.toLocaleString(undefined, options)             
    }

    const renderOnlineStatus = () => {
        if(!otherUser){
            return <Loader />
        }
        if(otherUser.online){
            return <div className="online-status-container" > <span className="online-status"></span> online</div>
        }
        return <div>last seen {convertTime(otherUser.last_seen)}</div>
    }


    return (
        <div className="user-profile-container">
            <div className="user-image-container">
                <img src={otherUser&&otherUser.image} alt={otherUser&&otherUser.full_name} />
            </div>
            <div className="user-details">
                <div className="username">{otherUser&&otherUser.full_name}</div>
                {renderOnlineStatus()}
            </div>
            {renderChatBackBtn()}
        </div>
    );
};

export default UserProfile;
