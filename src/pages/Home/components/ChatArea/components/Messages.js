import React from "react";
import "./Messages.css";
import { SlOptionsVertical } from "react-icons/sl";
import { BaseUrl } from "App";
import ImageMessage from "./ImageMessage";
import { IoMdDownload } from "react-icons/io";
import AudioPlayer from "./AudioPlayer";
import { CustomFileIcon } from "components";

const Messages = ({image, file, fileDetails, audio, message, time, recieved, status, authUser ,otherUser }) => {
    
    const formatBytes = (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        const value = parseFloat((bytes / Math.pow(1024, i)).toFixed(2));
        return `${value} ${sizes[i]}`;
    }
    
    const renderFileSize = (fileSize) => {
        return <span style={{marginLeft:"15px", marginRight:"15px"}}>{formatBytes(fileSize)}</span>
    }
    
    const splitFileExtension = (fileDetails) => {
        if(fileDetails){
            let ext = fileDetails.file_name.split('.')
            return ext[ext.length-1]
        }
    }

    return (
        <div className="message-box">
            <div
                className={`each-messages-container ${
                    recieved ? "recieved" : ""
                }`}
            >
                {image&&<ImageMessage image={image} />}

                {
                    fileDetails&&
                    <div  className="file-container">                             
                        <CustomFileIcon fileType={splitFileExtension(fileDetails)} color="red" size={25} />
                        {fileDetails?.file_name}
                        {renderFileSize(fileDetails?.file_size)}
                        <a 
                        href={file}
                        download={file}
                        target="_blank"> 
                            <IoMdDownload color="grey" size={25} />
                        </a>
                    </div>
                }
                
                { audio&& <AudioPlayer audioUrl={audio} /> }

                {message&&<p>{message}</p>}

            </div>
            <div className={`user-image-container ${recieved?"recieved":""}`}>
                <img src={recieved?`${otherUser.image}`:`${BaseUrl.replace("/api/","")}${authUser.image}`} />
            </div>
            <div className={`message-status ${recieved?"recieved":""}` }>
                <span>{time}</span>
                <span>{status}</span>
                <span><SlOptionsVertical color="grey" /></span>
            </div>
        </div>
    );
};

export default Messages;
