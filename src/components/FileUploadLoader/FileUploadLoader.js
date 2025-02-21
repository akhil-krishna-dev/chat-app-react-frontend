import React from 'react';
import './FileUploadLoader.css';

const FileUploadLoader = (props) => {
    const {opacity} = props

  return (
    <div className='file-upload-loader-container' >
        <div className='upload-loader-border' ></div>
        <div className='upload-loader' >loadig</div>
    </div>
  )
}

export default FileUploadLoader