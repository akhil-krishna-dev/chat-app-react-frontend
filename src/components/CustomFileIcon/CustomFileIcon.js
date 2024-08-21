import React from 'react'
import { FaFilePdf,FaFileWord,FaFileExcel,FaFilePowerpoint,FaFileAlt,FaFileArchive,FaFileCode,FaFile } from 'react-icons/fa';

const CustomFileIcon = ({fileType, size, color }) => {  
    switch (fileType) {
        case 'pdf':
            return <FaFilePdf size={size} color={color} />;
        case 'doc':
        case 'docx':
            return <FaFileWord size={size} color={color} />;
        case 'xls':
        case 'xlsx':
            return <FaFileExcel size={size} color={color} />;
        case 'ppt':
        case 'pptx':
            return <FaFilePowerpoint size={size} color={color} />;
        case 'txt':
        case 'rtf':
            return <FaFileAlt  size={size} color={color} />;
        case 'zip':
        case 'rar':
        case '7z':
            return <FaFileArchive  size={size} color={color} />;
        case 'html':
        case 'xml':
        case 'json':
        case 'js':
        case 'css':
        case 'ts':
        case 'jsx':
        case 'tsx':
        case 'py':
        case 'java':
        case 'c':
        case 'cpp':
        case 'cs':
        case 'php':
        case 'sql':
        case 'rb':
        case 'swift':
        case 'go':
        case 'rs':
        case 'dart':
        case 'pl':
        case 'sh':
            return <FaFileCode  size={size} color={color} />;
        default:
            return <FaFile  size={size} color={color} />;
    }
};
  

export default CustomFileIcon