import React from 'react'
import { FaQuestionCircle } from "react-icons/fa";


const PageNotFound = () => {
   
  return (
    <div style={containerStyle} > 
        <FaQuestionCircle size={70} style={h1Style} />
        <h1 style={h1Style} > PageNotFound </h1> 
        <p> We couldn't find the page that you are looking for. </p>
        <p> Please check the address and try again. </p>
    </div>
  )
}

// styles of PageNotFound Component
const containerStyle = {
    height:"100vh",
    width:"100%",
    display:"flex", 
    flexDirection:"column",
    justifyContent:"center", 
    alignItems:"center"
}
const h1Style = {
    marginBottom:"20px",
    color:"#7474e9"
}


export default PageNotFound