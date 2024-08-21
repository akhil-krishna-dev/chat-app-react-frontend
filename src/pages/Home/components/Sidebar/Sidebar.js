import React ,{ useContext, useEffect, useState} from "react";
import "./Sidebar.css";
import { IoArrowBackCircle } from "react-icons/io5";
import OwnerProfile from "./components/OwnerProfile";
import SearchUser from "./components/SearchUser";
import UsersList from "./components/UsersList";
import ChatList from "./components/ChatList";
import ProfileSettings from "./components/ProfileSettings";
import { useNavigate, useParams } from "react-router-dom";
import useDebouncer from "hooks/useDebouncer";
import { WebSocketUrl } from "App";
import { jwtToken } from "utils/checkAuthToken";
import { ChatListContext } from "App";

const Sidebar = () => {
    const {
        updateChatList, 
        setNotificationSocket,
        updateParticipantsOnlineStatus, 
        updateParticipantsOfflineStatus,
        setChatList} = useContext(ChatListContext)

    const {option,chatId} = useParams();
    const [searchingUser, setSearchingUser] = useState(false)
    const [searchUserInput, setSearchUserInput] = useState("")
    const debouncer =  useDebouncer(searchUserInput,800)
    const [usersListLoader, setUsersListLoader] = useState(true) 
    const navigate = useNavigate()
    

    useEffect(() => {
         
        const newSocket = new WebSocket(`${WebSocketUrl}user/notification/?token=${jwtToken}`)

        setNotificationSocket(newSocket)

        newSocket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            switch(data.type){
                case "message_notification":
                    if (Array.isArray(data.data)){
                        for (let index in data.data){
                            updateChatList(data.data[index])
                        }
                        break
                    }else{
                        updateChatList(data.data)
                    }
                    break

                case "online":
                    setTimeout(() => {
                        updateParticipantsOnlineStatus(data.data.user_id)
                        newSocket.send(JSON.stringify({
                            type:"online",
                            data:{
                                user_id:data.data.user_id
                            }
                        }))                      
                    }, 3000);
                    break

                case "replay_from_online_user":
                    updateParticipantsOnlineStatus(data.data.user_id)
                    break

                case "new_chat":
                    setChatList(prevChat => [...prevChat, data.data])
                    setTimeout(() => {
                        newSocket.send(JSON.stringify({
                            type:"new_chat_user",
                            data:{
                                user_id:data.user_id
                            }
                        }))
                        
                    }, 3000);
                    break

                case "offline":
                    const {user_id, last_seen} = data.data
                    updateParticipantsOfflineStatus(user_id, last_seen)
                    break
                    
            }
        }

        newSocket.onclose = () => {
        }

        return () => newSocket.readyState === WebSocket.OPEN && newSocket.close()
      
    },[])

    const handleSearchAction = (search_input) => {
        setUsersListLoader(true)
        setSearchUserInput(search_input);
        setSearchingUser(true);
    }

    const closingUserListComponent = () => {
        setSearchingUser(false)
        setSearchUserInput("")
    }

    const closingUserProfileComponent = () => {
        navigate("/home")
    }

    const optionRender = () => {
        if (searchingUser){
            return  <>
                        <div className="back-to-chat-page"> <IoArrowBackCircle onClick={() => closingUserListComponent() } color="#7474e9" size={50}/></div>
                        <UsersList setSearchingUser={setSearchingUser} setUsersListLoader={setUsersListLoader} usersListLoader={usersListLoader} searchUserInput={debouncer} />
                    </> 
        }
		if (chatId){
			return <ChatList  />
		}
		switch (option){
			case "home":
			    return <ChatList  />
			case "profile":
                return  <>
                            <div className="back-to-chat-page"><IoArrowBackCircle onClick={() => closingUserProfileComponent() } color="#7474e9" size={50}/></div>
                            <ProfileSettings />
                        </>
            default:
                return null
		}
	};
	
    return (
        <div className="sidebar-container">
            <OwnerProfile />
            <SearchUser handleSearchAction={handleSearchAction} searchInput={searchUserInput} />
			{optionRender()}
        </div>
    );
};

export default Sidebar;
