import React from 'react'
import './ImageMessage.css'

const ImageMessage = ({image}) => {
  return (
    <a
    href={image}
    target='_blank'
     className="image-message-container">
        <img src={image} />
    </a>
  )
}

export default ImageMessage