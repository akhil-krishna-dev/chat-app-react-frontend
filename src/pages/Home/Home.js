import React from 'react'
import { useParams } from 'react-router-dom'
import ChatArea from './components/ChatArea/ChatArea';
import Sidebar from './components/Sidebar/Sidebar';
import ChatAreaBackgroud from './components/ChatArea/components/ChatAreaBackground';
import withAuthentication from 'utils/withAuthentication';

const Home = () => {
    
    const {option,chatId} = useParams();

    const renderComponent = () => {
        if(chatId) return <ChatArea/>
        if(option === "home") return <ChatAreaBackgroud/>
    }

    return (
        <>
        <Sidebar/>  
        {renderComponent()}  
        </>
    );
};

export default withAuthentication(Home);