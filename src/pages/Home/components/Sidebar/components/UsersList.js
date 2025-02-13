import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import './UsersList.css';
import { Loader } from "components";
import { BaseUrl, ChatListContext, UserContext } from "App";
import {useNavigate } from "react-router-dom";


const UsersList = ({
    setSearchingUser,
    usersListLoader,
    setUsersListLoader,
    searchUserInput,
    setSearchUserInput}) => {

    const {authUser} = useContext(UserContext)
    const {setChatList} = useContext(ChatListContext)
    const [usersList, setUsersList] = useState([]);
    
    const [isCreatingChat, setIsCreatingChat] = useState(false)
    const navigate = useNavigate();

    
    useEffect(() => {
        fetchUsersList(searchUserInput);
    },[searchUserInput]);

    const fetchUsersList = (searchUserInput) => {
        let URL = `${BaseUrl}accounts/users/search/`

        if (searchUserInput){
            URL +=`?query=${searchUserInput}`
        }

        axios
        .get(URL)
        .then((response) => {
            setUsersList(response.data)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setUsersListLoader(false)
        })
    }

    const createNewChat = (userIds) => {
        if(isCreatingChat){
            return
        }
        setSearchUserInput("")
        
        setIsCreatingChat(true)
        axios
        .post(`${BaseUrl}home/chats/`,
            {participants:userIds}
        ).then((response) => {

            if(response.statusText === "Created"){
                setChatList(prevChat => [...prevChat, response.data])
            }
            setSearchingUser(false)
            navigate(`/chat/${response.data.id}`)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setTimeout(() => {
                setIsCreatingChat(false) 
            }, 500);
        })
    }


    return (
        <div className="userslist-container">
            {
                !usersListLoader?usersList.length > 0?usersList.map((user) => (
                    <div key={user.id} onClick={() => createNewChat([user.id,authUser.id]) } className="user-container">
                        <div className="user-image-container">
                            <img src={user.image} alt="user"/>
                        </div>
                        <div className="user-details">
                            <h4>{user.full_name}</h4>
                        </div>
                    </div>
                )):<p className="no-user-message">no users with this name !</p>:
                <Loader/>
            }
        </div>
    );
};

export default UsersList;
