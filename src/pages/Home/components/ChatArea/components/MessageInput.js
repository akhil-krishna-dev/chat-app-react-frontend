import React, { act, useState } from "react";
import "./MessageInput.css";
import { GrAttachment} from "react-icons/gr";
import { LuSendHorizonal, LuSmile } from "react-icons/lu";
import { FaFile,FaImage } from "react-icons/fa6";
import { IoIosCloseCircleOutline } from "react-icons/io";
import VoiceRecorder from "./VoiceRecorder";



const MessageInput = ({
	    selectFile,
		selectImage,
		handleSendMessage,
		setMessage,
		message,
        setAudioURL,
        showEmojyPicker,
        setShowEmojyPicker,
        audioRecording,
        setAudioBlob,
        setAudioRecording
    }) => {
    const [showFileAttach, setShowFileAttach] = useState(false)
    const [attachDocumentActive, setAttachDocumentActive] = useState(false)
    const [attachImageActive, setAttachImageActive] = useState(false)

    const iconColor = "grey";
	const iconStyles = {cursor:"pointer"}

    const handleSelectFile = () => {
        setShowFileAttach(false);
        selectFile();
    }

    const handleSelectImage = () => {
        setShowFileAttach(false);
        selectImage();
    }

    const sendMessage = (event) => {
        if (event.key === "Enter" || event.type === "click") {
            handleSendMessage();
        }
    };

    const handleAttachDocumentVisible = () => {
        setAttachImageActive(false)
        setAttachDocumentActive(true)
    }

    const handleAttachImageVisible = () => {
        setAttachDocumentActive(false)
        setAttachImageActive(true)
    }

    const handleHideAttach = () => {
        setAttachDocumentActive(false)
        setAttachImageActive(false)
    }

    const handleShowEmojyPicker = () => {
        setShowFileAttach(false)
        setShowEmojyPicker(!showEmojyPicker)
    }

    const renderFileAttach = () => {
        if(showFileAttach){
            return  <div className="select-files-images-container">
                        <div className="file-select-container" >
                            <div
                            onClick={handleSelectFile}
                            onMouseLeave={handleHideAttach}
                            onMouseOver={handleAttachDocumentVisible}
                            className="select-icon-box add-any-file">
                                <FaFile 
                                size={30} 
                                color="white" 
                                style={iconStyles} />
                            </div>  
                            {attachDocumentActive&&<p className="select-file-type">Documents</p>}                           
                        </div>

                        <div className="file-select-container" >            
                            <div 
                             onClick={handleSelectImage}
                             onMouseLeave={handleHideAttach}
                             onMouseOver={handleAttachImageVisible}                           
                            className="select-icon-box camera-container">
                                <FaImage
                                    size={26}
                                    color="white"
                                    style={iconStyles}
                                />
                            </div>
                            {attachImageActive&&<p className="select-file-type">Images</p>}                           
                        </div> 
                    </div>
        }
    }

    const showFileAttachOption = () => {
        setShowEmojyPicker(false)
        setShowFileAttach(!showFileAttach)
    }

    const handlePlayAudio = (audioBlob) => {
        setAudioBlob(audioBlob)
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        console.log()
    }

    const handleAudioRecording = (action) => {
        if(action==='start'){
            setAudioURL('')
            setAudioRecording(true)
        }
        if(action==='stop'){
            setAudioRecording(false)
        }
    }

    return (
        <div className="message-input-container">
            <div className="files-send-container">               
                <div className="icon-box emojy-container">
                    <LuSmile 
                    onClick={handleShowEmojyPicker}
					size={30} 
					style={iconStyles}
					color={iconColor} />
                </div>
                <div 
                onClick={showFileAttachOption}
                className="icon-box attach-files">
                   {
                        showFileAttach?
                        <IoIosCloseCircleOutline
                        size={32}
                        style={iconStyles} 
                        color={iconColor}  />:
                        <GrAttachment 
                        size={28}
                        style={iconStyles} 
                        color={iconColor} />
                    }
                </div>
            </div>

            {renderFileAttach()}

            <div className="input-box-container">
                <VoiceRecorder 
                    recording={audioRecording}
                    onRecorded={handlePlayAudio} 
                    handleAudioRecording={handleAudioRecording}
                />
                <div className="input-container">
                    <input
                        onKeyDown={sendMessage}
                        onChange={(event) => {
                            setMessage(event.target.value);
                        }}
                        type="text"
                        placeholder="Type your message"
                        value={message}
                    />
                </div>
            </div>
            <div className="send-button-container">
                <LuSendHorizonal
                    onClick={sendMessage}
					style={iconStyles}
                    size={25}
                    color="white"
                />
            </div>
        </div>
    );
};

export default MessageInput;
