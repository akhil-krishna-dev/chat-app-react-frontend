import React, { useContext, useEffect, useState } from "react";
import "./ChatList.css";
import { useNavigate } from "react-router-dom";
import { ChatListContext, UserContext } from "App";
import { FaArrowUp } from "react-icons/fa6";
import { LiaFileAudio } from "react-icons/lia";
import { CustomFileIcon, Loader } from "components";

const ChatList = () => {
    const { authUser } = useContext(UserContext);
    const { chatList, setCssClassName } = useContext(ChatListContext);
    const [chatChecked, setChatChecked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setChatChecked(true);
        }, 2000);
    }, [chatList]);

    const timeDateConvertor = (messages) => {
        if (messages.length < 1) {
            return null;
        }

        const timestamp = messages[messages.length - 1].timestamp;

        const now = new Date();
        const date = new Date(timestamp);

        const currentDay = now.getDate();

        const options = {
            hour: "2-digit",
            minute: "2-digit",
        };

        if (currentDay === date.getDate()) {
            return `today ${date.toLocaleString(undefined, options)}`;
        }
        if (parseInt(currentDay) - parseInt(date.getDate()) === 1) {
            return `yesterday ${date.toLocaleString(undefined, options)}`;
        } else {
            options["month"] = "long";
            options["day"] = "numeric";
            options["year"] = "numeric";
        }

        return date.toLocaleString(undefined, options);
    };

    const imageCheck = (chat) => {
        const user1 = chat.participants[0];
        const user2 = chat.participants[1];
        if (authUser.id === user1.id) {
            return user2.image;
        }
        return user1.image;
    };

    const splitFileExtension = (fileName) => {
        if (fileName) {
            let ext = fileName.split(".");
            return ext[ext.length - 1];
        }
    };

    const showLastMessage = (chat) => {
        if (chat.messages.results.length > 0) {
            const message =
                chat.messages.results[chat.messages.results.length - 1];
            if (message.image) {
                return (
                    <img
                        className="last-message-img"
                        src={message.image}
                        alt="last received"
                    />
                );
            }
            if (message.file) {
                if (message.file_details.file_name.length > 16) {
                    return (
                        <p>
                            <CustomFileIcon
                                fileType={splitFileExtension(
                                    message.file_details.file_name
                                )}
                                color="red"
                            />
                            {message.file_details.file_name.slice(0, 16)}...
                        </p>
                    );
                }
                return (
                    <p>
                        <CustomFileIcon color="red" />
                        {message.file_details.file_name}
                    </p>
                );
            }
            if (message.audio) {
                return <LiaFileAudio />;
            }
            if (message.content.length > 20) {
                return <p>{message.content.slice(0, 20)}...</p>;
            }
            return <p>{message.content}</p>;
        }
    };

    const unReadMsgCount = (unread) => {
        if (unread > 0) {
            return <p className="chat-list-notification-icon">{unread}</p>;
        }
    };

    const nameCheck = (chat) => {
        const user1 = chat.participants[0];
        const user2 = chat.participants[1];
        if (authUser.id === user1.id) {
            return user2.full_name;
        }
        return user1.full_name;
    };

    const checkUserOnline = (participants) => {
        const [user1, user2] = participants;
        const otherUser = user1.id === authUser.id ? user2 : user1;

        if (otherUser.online) {
            return <span className="online-icon"></span>;
        }
    };

    const handleChatShow = (chatId) => {
        navigate(`/chat/${chatId}`);
        setCssClassName((prevClass) => {
            return { ...prevClass, chatAreaContainer: "active" };
        });
    };

    return (
        <div className="chatlist-container">
            {chatList && chatList.length > 0 ? (
                chatList.map((chat) => (
                    <div
                        key={chat.id}
                        id={`chat-container-${chat.id}`}
                        onClick={() => handleChatShow(chat.id)}
                        className="chat-container"
                    >
                        <div className="user-image-container">
                            <img src={imageCheck(chat)} alt={nameCheck(chat)} />
                        </div>
                        <div className="chat-details">
                            <h4>
                                {nameCheck(chat)}{" "}
                                {checkUserOnline(chat.participants)}
                            </h4>
                            {showLastMessage(chat)}
                        </div>
                        <div className="date-time">
                            {unReadMsgCount(chat.unread)}
                            <div>
                                {timeDateConvertor(chat.messages.results)}
                            </div>
                        </div>
                    </div>
                ))
            ) : chatChecked ? (
                <p
                    style={{
                        padding: "20px 30px",
                        textAlign: "center",
                        fontSize: "22px",
                    }}
                >
                    <FaArrowUp /> <br /> Search for users and send message
                </p>
            ) : (
                <Loader />
            )}
        </div>
    );
};

export default ChatList;
