import React from 'react'
import './ChatAreaBackground.css';
import coverImage from 'assets/images/cover.png';


const ChatAreaBackgroud = () => {
  return (
    <div className='chat-area-background-container' >
        <img src={coverImage} alt='cover' />
    </div>
  )
}

export default ChatAreaBackgroud