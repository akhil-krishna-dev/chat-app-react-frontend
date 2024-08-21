import React, { useContext, useEffect, useRef, useState } from "react";
import "./ChatArea.css";
import UserProfile from "./components/UserProfile";
import Messages from "./components/Messages";
import MessageInput from "./components/MessageInput";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BaseUrl, ChatListContext, UserContext, WebSocketUrl } from "App";
import { jwtToken } from "utils/checkAuthToken";
import { MdCancel } from "react-icons/md";
import { FaFile } from "react-icons/fa";
import { CustomFileIcon, Loader } from "components";
import { FaAnglesDown } from "react-icons/fa6";
import Picker from '@emoji-mart/react';
import { GiSoundWaves } from "react-icons/gi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { FaRegCircleXmark } from "react-icons/fa6";
import FileUploadLoader from "components/FileUploadLoader/FileUploadLoader";



const ChatArea = () => {
    const {
        chatList,
        otherUser,
        cssClassName,
        chatMessages,
        updateChatList,
        updateMessages,
        updateSeenMessage,
        clearSeenMessageCount,
        updateChatListMessagesNextPage,
        checkChatListMessageNextPage
    } = useContext(ChatListContext)
 
    const [firstLoad, setFirstLoad] = useState(true);
    const [messagesLoader, setMessagesLoader] = useState(false);
    const [chatEndRefShow, setChatEndRefShow] = useState(true);
    const [newMessageShow, setNewMessageShow] = useState(false);

    const chatEndRef = useRef(null);
    const chatStartRef = useRef(null);
    const newMessageRef = useRef(null);

    const {chatId} = useParams();
    const [socket, setSocket] = useState(null);
    const [isWebSocketOpen, setIsWebSocketOpen] = useState(false);
    const [message, setMessage] = useState("");

    const {authUser} = useContext(UserContext);
    const [selectedFile, setSelectedFile] = useState([])
    const [selectedImage, setSelectedImage] = useState([])
    const [previewImage, setPreviewImage] = useState([])
    const fileRef = useRef()
    const imageRef = useRef()

    const [showEmojyPicker, setShowEmojyPicker] = useState(false)

    const [recordingTime, setRecordingTime] = useState(0)
    const recordingRef = useRef(null)
    const [audioRecording, setAudioRecording] = useState(false)
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioURL, setAudioURL] = useState('');
    const [isSendingVoice, setIsSendingVoice] = useState(false);

    const [selectingFile, setSelectingFile] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const acceptedDocumentTypes = ".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .rtf, .csv, .zip, .rar, .7z, .html, .xml, .json, .js, .css, .ts, .jsx, .tsx, .py, .java, .c, .cpp, .cs, .php, .sql, .rb, .swift, .go, .rs, .dart, .pl, .sh"



    const addEmojy = (emojy) => {
        setMessage(message + emojy.native)
    }

    useEffect(() => {
        if(audioRecording){
            recordingRef.current = setInterval(() => {
                setRecordingTime(prev => prev+1)
            }, 1000);
        }
        if(!audioRecording){
            clearInterval(recordingRef.current)
            setRecordingTime(0)
        }
 
    },[audioRecording])

    useEffect(() => {
        if(chatId&&chatMessages){
            updateMessages(chatId)  
            setNewMessageShow(true)
        }
        const firstLoadTime = setTimeout(() => {
            setFirstLoad(false)
        }, 1500);
        return () => {
            clearTimeout(firstLoadTime)
        }
    },[chatId,chatList])

    useEffect(() => {  
        const newSocket = new WebSocket(`${WebSocketUrl}chat/${chatId}/?token=${jwtToken}`)

        if (authUser){
            newSocket.onopen = () => {
            setIsWebSocketOpen(true)
            };
        }
    
        newSocket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            switch(data.type){
                case "seen_message_ids":
                    {
                        for(let i in data.data.message_ids){
                            if (data.data.message_ids[i] && data.data.chat_id){
                                updateSeenMessage(data.data.message_ids[i], data.data.chat_id)
                            }
                        }
                    }
                    break
            }
        };

        newSocket.onclose = () => {
            setIsWebSocketOpen(false)
        }; 
        
        newSocket.onerror = (error) => {
            setIsWebSocketOpen(false)
        };

        setSocket(newSocket)

        const makeAllMsgSeen = setTimeout(() => {
            if (chatId){
                axios
                .post(`${BaseUrl}home/chats/${parseInt(chatId)}/make_all_message_seen/`)
                .then((response) => {
                }).catch((error) => {
                    console.log(error)
                })
            }
        }, 2000);
       
        return () => {

            if (newSocket.readyState === WebSocket.OPEN ) {
                newSocket.close();
                setIsWebSocketOpen(false)
            }
            
            clearTimeout(makeAllMsgSeen);
        }
    }, [chatId, authUser]);

    const handleSeenMessages = () => {
        const chatMsgs = [...chatMessages.results]
        if(chatMsgs.length > 0 && isWebSocketOpen){
            const seenChatMsg = {
                chatId:parseInt(chatId),
                seenMsgIds:[]
            }
            for (let i=chatMsgs.length-1; i>=0; i--){
                if(chatMsgs[i].status === "seen"){
                    break
                }

                if(chatMsgs[i].sender.id !== authUser.id){
                    const seen_message_id = chatMsgs[i].id
                    seenChatMsg.seenMsgIds.push(seen_message_id)
                }
            }
            if(seenChatMsg.seenMsgIds.length>0){
                handleSeenMessage(seenChatMsg)
            }
        }
    }

    useEffect(() => {
        handleSeenMessages();
    
        if (chatEndRef.current){
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        if (chatMessages.results.length > 0){
            setChatEndRefShow(false)
        }

    },[chatList, isWebSocketOpen]);
   
    useEffect(() => {
        const scrollContainer = chatStartRef.current
        scrollContainer.addEventListener('scroll', handleScrollTop)
        
        return () => {
            scrollContainer.removeEventListener('scroll', handleScrollTop)
            setChatEndRefShow(true)
        }       
    },[chatId])
    
    const handleScrollTop = async () => {       
        if (chatStartRef.current.scrollTop === 0&&!messagesLoader){
            // setTimeout(() => {
                setMessagesLoader(true)
                await fetchNextPage()
            // }, 500);
        }

        if (chatStartRef.current.scrollTop + chatStartRef.current.clientHeight >= chatStartRef.current.scrollHeight){
            await clearSeenMessageCount(chatId)
            setTimeout(() => {
                setNewMessageShow(false)
            }, 100);
        }
    }

    const showMoreMessages = () => {
        if(!messagesLoader){
            setMessagesLoader(true)
            fetchNextPage()
        }
    }

    const showNewMessages = () => {
        newMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        clearSeenMessageCount(chatId)
        setNewMessageShow(false)
    }

    const fetchNextPage = async () => {
        setNewMessageShow(true)
        let nextPage = await checkChatListMessageNextPage()
        if(!nextPage){
            setTimeout(() => {
                setMessagesLoader(false)
            }, 500);
            return
        }
        let pageUrl = ""
        if (nextPage){
            const urlArr = nextPage.split("=")
            pageUrl = `${BaseUrl}home/chats/${chatId}/?page=${urlArr[1]}`          
        }
        axios
        .get(pageUrl)
        .then((response) => {
            const data = response.data
            updateChatListMessagesNextPage(data)
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setTimeout(() => {
                setMessagesLoader(false)
            }, 500);
        })
    }

    const  renderProfile = () => <UserProfile/>

    const otherUserHandle = () => otherUser

    const selectFile = () => {
        fileRef.current.click()
    }

    const selectImage = () => {
        imageRef.current.click()
    }

    const handleFileChange = (event) => {
        setSelectingFile(true);
        const files = Array.from(event.target.files)
        setSelectedFile(files)
        setSelectingFile(false);
    }

    const handleImageChange = (event) => {
        setSelectingFile(true)
        const files = Array.from(event.target.files)
        setSelectedImage(files)

        const previews = files.map(image => {
            const reader = new FileReader()
            reader.readAsDataURL(image)
            return new Promise(resolve => {
                reader.onloadend = () => {
                    resolve(reader.result)
                }
            })
        })

        Promise.all(previews).then(images => {
            setPreviewImage(images)
        })
        .finally(() => {
            setSelectingFile(false);
        });
    }

    const handleSendFile = () => {
        
        setChatEndRefShow(true);

        setTimeout(() => {
            if(newMessageRef.current){
                newMessageRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1000);

        const formData = new FormData()
        selectedFile.forEach((file, index) => {
            formData.append(`files${index}`,file)
        });

        if(selectedFile){
            axios
            .post(`${BaseUrl}home/chats/${chatId}/send_any_file/`,
                formData,
                {
                    headers:{
                        'Content-Type':'multipart/form-data'
                    },
                }
            )
            .then((response) => {
                setSelectedFile([])
                response.data.forEach(file => {
                    updateChatList(file)
                })
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setMessage("")
            })
        }
    };

    const handleSendImage = () => {
        setChatEndRefShow(true)

        setTimeout(() => {
            if(newMessageRef.current){
                newMessageRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1000);

        const formData = new FormData()

        selectedImage.forEach((image, index) => {
            formData.append(`image${index}`, image)
        })

        if(selectedImage){
            axios
            .post(`${BaseUrl}home/chats/${chatId}/send_image_file/`,
                formData,
                {
                    headers:{
                        'Content-Type':'multipart/form-data'
                    },
                    onUploadProgress:(progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    },
                }
            )
            .then((response) => {
                setSelectedImage([])
                setPreviewImage([])
                response.data.forEach(message => {
                    updateChatList(message)
                })
                setUploadProgress(0)
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                setMessage("")
            })
        }
    };

    const handleSendVoice = () => {
        setIsSendingVoice(true);
        setChatEndRefShow(true)

        setTimeout(() => {
            if(newMessageRef.current){
                newMessageRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1000);
        const formData = new FormData()
        formData.append('audio',audioBlob,'voice.wav')

        axios
        .post(`${BaseUrl}home/chats/${chatId}/send_voice_message/`,
            formData,
            {
                headers:{
                    'Content-Type':'multipart/form-data'
                },
            }
        ).then((response) => {
            setAudioURL("")
            updateChatList(response.data)
            setIsSendingVoice(false);
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleSendMessage = () => {
        setShowEmojyPicker(false)

        if (selectedImage.length > 0){
            handleSendImage()
            return
        }

        if (selectedFile.length > 0){
            handleSendFile()
            return
        }

        if(isWebSocketOpen&&message){
            setChatEndRefShow(true)

            setTimeout(() => {
                if(newMessageRef.current){
                    newMessageRef.current.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
            
            const messageData = {message}
            socket.send(JSON.stringify(messageData))
            setMessage("")
        }else{
            axios
            .post(`${BaseUrl}home/chats/${chatId}/send_message/`, {
                content: message,
            })
            .then((response) => {
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                setMessage("")
            })
        }
    };

    const handleSeenMessage = (seenChatMsg) => {
        axios
        .post(`${BaseUrl}home/chats/handle_message_seen/`,seenChatMsg)
        .then((response) => {
            clearSeenMessageCount(seenChatMsg.chatId)
        }).catch((error) => {
            console.log(error)
        })
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

    const cancelSendFile = () => {
        fileRef.current.value =  ""
        setSelectedFile([])
    }

    const cancelSendImage = () => {
        imageRef.current.value =  ""
        setSelectedImage([])
        setPreviewImage([])
    }

    const renderLoadMoreOrLoader = () => {
        if (chatMessages.results.length < 4){
            return null
        }
        if(messagesLoader){
            return <Loader />      
        }
        return <div onClick={showMoreMessages} className="old-messages-loading-btn" >Load more</div>
    }

    const renderScrollDownBtn = () => {
        if (chatMessages.results.length < 4){
            return null
        }
        if(newMessageShow){
            return <div className="show-new-message-container">
                        <div onClick={showNewMessages} className="show-new-message-btn-container" >
                            <FaAnglesDown color="#6464e8" size={20}/>
                        </div>
                    </div>
       }                      
    }

    const formatRecordTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    const handleCloseVoiceMsg = () => {
        setAudioURL('');
        setAudioRecording(false);
        setAudioBlob(null)
    }

    const renderVoiceMessage = () => {
        if(audioRecording||audioURL){
            return ( 
                <div className="audio-message-player-container">
                    <FaRegCircleXmark onClick={handleCloseVoiceMsg}  className="clear-recording" />
                    { 
                        audioRecording?
                        <div>
                            <GiSoundWaves size={30} color="red" /> 
                            <p> {formatRecordTime(recordingTime)} </p>
                        </div>
                        :audioURL&&
                        <>
                        <audio src={audioURL} controls />
                        {
                         isSendingVoice?<Loader/>:
                        <IoIosCheckmarkCircleOutline onClick={handleSendVoice} /> 
                        }
                        </>
                    }
                </div>
            ) 
        }
    }

    const splitFileExtension = (fileName) => {
        console.log(fileName)
        if(fileName){
            let ext = fileName.split('.')
            return ext[ext.length-1]
        }
    }


    return (
        <div className= {`chat-area-container ${cssClassName.chatAreaContainer}`}>
            {renderProfile()}
            
            {selectingFile&&<FileUploadLoader/>}

            <div  ref={chatStartRef} className="messages-container">
                <div className="loader-container" >
                    {renderLoadMoreOrLoader()}
                </div>
                
                {
                    chatMessages.results.length > 0 ?
                    chatMessages.results.map((message) => (
                        <Messages
                            key={message.id}
                            message={message.content}
                            image={message.image}
                            file={message.file}
                            fileDetails={message.file_details}
                            audio={message.audio}
                            time={convertTime(message.timestamp)}
                            recieved={
                                authUser &&
                                message.sender.id === authUser.id
                                    ? true
                                    : false
                            }
                            status={authUser.id === message.sender.id && message.status}
                            authUser={authUser}
                            otherUser={otherUserHandle()}
                        />
                    )):firstLoad?<div className="first-load-container"> <Loader /> </div>:null
                }

                   
                   {
                        previewImage.length > 0 &&
                        <div className="image-send-preview-container">
                            
                            {
                                previewImage.map(image => (
                                    <div className="img-container">
                                        <img src={image} alt="preview" />
                                    </div>
                                ))
                            }
                            <div className="cancel-btn-container">
                                <MdCancel 
                                onClick={cancelSendImage} 
                                size={40} 
                                style={{cursor:"pointer"}}
                                color="white"/>
                            </div>                            
                        </div>
                    }

                    {
                        selectedFile.length > 0 &&
                        <div className="file-send-preview-container">
                            <div className="file-container">
                                {  
                                    selectedFile.map((file,index) => 
                                    <div key={index} className="each-file">                             
                                        <CustomFileIcon fileType={splitFileExtension(file.name)} color="red" size={25} />{file.name}
                                    </div>)
                                } 
                            </div>
                            <div className="cancel-btn-container">
                                <MdCancel 
                                onClick={cancelSendFile} 
                                size={40} 
                                style={{marginLeft:'15px',cursor:"pointer"}}
                                color="black"/>
                            </div>                            
                        </div>
                    }   

                   {chatEndRefShow&&<div ref={chatEndRef}></div>}

                   {renderScrollDownBtn()}
                    
                   <div ref={newMessageRef}></div>

            </div>

            <div className="emojy-selection-container" >
                {showEmojyPicker && <Picker onEmojiSelect={addEmojy} />}
            </div>

            {renderVoiceMessage()}

            <input onChange={handleFileChange} style={{display:"none"}} ref={fileRef} type="file" accept={acceptedDocumentTypes} multiple />
            <input onChange={handleImageChange} style={{display:"none"}} ref={imageRef} type="file" accept="image/*" multiple />

            <MessageInput
                selectFile={selectFile}
                selectImage={selectImage}
                handleSendMessage={handleSendMessage}
                showEmojyPicker={showEmojyPicker}
                setShowEmojyPicker={setShowEmojyPicker}
                setMessage={setMessage}
                message={message}
                audioRecording={audioRecording}
                setAudioRecording={setAudioRecording}
                setAudioBlob={setAudioBlob}
                setAudioURL={setAudioURL}
            />
        </div>
    );
};

export default ChatArea;
