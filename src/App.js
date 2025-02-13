import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Login from "pages/Login/Login";
import Register from "pages/Register/Register";
import { useState,useEffect } from "react";
import PageNotFound from "pages/PageNotFound/PageNotFound";
import Home from "pages/Home/Home";


if(window.location.pathname === "/"){
   window.location.pathname = "/home"
}

export const BaseUrl = "http://127.0.0.1:8000/api/";
export const WebSocketUrl = "ws://127.0.0.1:8000/ws/";

export const UserContext = React.createContext()
export const ChatListContext = React.createContext()


const App =() => {
    const [authUser, setAuthUser] = useState({});
    const [notificationSocket, setNotificationSocket] = useState(null)
    const [chatList, setChatList] = useState([])
    const [otherUser, setOtherUser] = useState(null)
    const [chatMessages, setChatMessages] = useState({
        next:"",
        results:[]
    })

    const [cssClassName, setCssClassName ] = useState({
        chatAreaContainer:""
    })

    useEffect(()=>{
        fetchUser();
        fetchChats();      
    },[])

    const fetchUser = () => {
        axios
        .get(`${BaseUrl}accounts/request-user-profile/`)
        .then((response) => {
            setAuthUser(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    const fetchChats = () => {
        axios
        .get(`${BaseUrl}home/chats`)
        .then((response) => {
            setChatList(response.data) 
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const updateUserFullName = (full_name) => {
        setAuthUser(prevUser => ({...prevUser, full_name}))
    }
    
    const updateUserStatus = (status) => {
        setAuthUser(prevUser => ({...prevUser, status}))
    }

    const updateParticipantsOnlineStatus = (user_id) => {
            setChatList(prevChat => prevChat.map(pc => {
            return {
                ...pc,
                participants:pc.participants.map(pp => 
                    pp.id === user_id?{...pp, online:true}:pp
                )
            }
        }))
    }

    const updateParticipantsOfflineStatus = (user_id,last_seen) => {
        setChatList(prevChat => prevChat.map(pc => {
        return {
            ...pc,
            participants:pc.participants.map(pp => 
                pp.id === user_id?{...pp, online:false, last_seen:last_seen}:pp
            )
        }
    }))
    }

    const updateMessages = (chatId) => {
        const currentChat = chatList.find(cl => cl.id === parseInt(chatId))
        if (currentChat){
            setChatMessages(currentChat.messages)
            if (authUser.id !== currentChat.participants[0].id){
            setOtherUser(currentChat.participants[0])
            }else{
            setOtherUser(currentChat.participants[1])
            }
        }
    }
    
    const updateChatList = (chat) => {
        setChatList(prevChat => {
            let chatIndex = prevChat.findIndex(pc => pc.id === chat.chat_id)
        if (chatIndex !== -1) {
            const updatedChat = { ...prevChat[chatIndex] };

            if (!updatedChat.messages.results.find(m => m.id === chat.id)){
                updatedChat.messages.results = [...updatedChat.messages.results, chat];
            }

            if (chat.is_receiver){
                updatedChat.unread = updatedChat.unread + 1;
            }
            const updatedChatList = prevChat.filter((_,index) => index !== chatIndex)
            return [updatedChat, ...updatedChatList]          
        }

        return prevChat;
        })
    }

    const updateChatListMessagesNextPage = (chat) => {
        setChatList(prevChat => {
            let chatIndex = prevChat.findIndex(pc => pc.id === chat.id)

        if (chatIndex !== -1) {
            const updatedChat = { ...prevChat[chatIndex] };
            if(!updatedChat.messages.next){
                return prevChat
            }
            const updatedMessages = [...updatedChat.messages.results]
            updatedChat.messages = {...updatedChat.messages, next:chat.messages.next, previous:chat.messages.previous}
            updatedChat.messages.results = [...chat.messages.results, ...updatedMessages]

            const updatedChatList = prevChat.filter((_,index) => index !== chatIndex)

            return [updatedChat, ...updatedChatList]
        }
        return prevChat;
        })
    }
    
    const checkChatListMessageNextPage = () => {
        let nextPage = ""
        setChatMessages(prevMessages => {
            nextPage = prevMessages.next
            return prevMessages
        })
        return nextPage      
    }

    const updateSeenMessage = (msgId,chatId) => {
        setChatList(prevChat => 
            prevChat.map(pc => {
                if(pc.id === chatId){
                    return {
                        ...pc,
                        messages:{
                            results:pc.messages.results.map(pm =>                            
                            pm.id === msgId&&pm.status==="seen"?pm:{...pm,status:"seen"}
                        )}
                    }
                }
                return pc
        }))
    }
   
    const clearSeenMessageCount = (chatId) => {
        setChatList(prevChat => prevChat.map(pc => pc.id ===parseInt(chatId)?{...pc, unread:0}:pc))
    }


    // UserContext values
    const userContextValues = {
        authUser,
        updateUserFullName,updateUserStatus,fetchUser
    }
    
    // ChatListContext values
    const chatListContextValues = {
        chatList,otherUser,chatMessages,cssClassName,notificationSocket,setCssClassName,
        updateMessages,updateChatList,updateSeenMessage,clearSeenMessageCount,
        updateParticipantsOnlineStatus,setChatList,updateParticipantsOfflineStatus,
        updateChatListMessagesNextPage,checkChatListMessageNextPage,setNotificationSocket
    }

    return (
        <div className="App">
            <BrowserRouter>
                <UserContext.Provider value = {userContextValues} >
                    <ChatListContext.Provider value = {chatListContextValues}>
                        <Routes>
                            <Route path="/register" element={<Register/>} />
                            <Route path="/login" element={<Login/>} />
                            <Route path="/" element={<Home/>}/>
                            <Route path="/:option" element={<Home/>}/>
                            <Route path="/chat/:chatId" element={<Home/> }/>
                            <Route path="*" element={<PageNotFound/>} />
                        </Routes>
                    </ChatListContext.Provider>
                </UserContext.Provider>
            </BrowserRouter>
        </div>
    );
}

export default App;
