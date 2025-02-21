import React from "react";
import { useParams } from "react-router-dom";
import ChatArea from "./components/ChatArea/ChatArea";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatAreaBackgroud from "components/BackgroundComponents/ChatAreaBackground";

const Home = () => {
	const { option, chatId } = useParams();

	const renderComponent = () => {
		if (chatId) return <ChatArea />;
		if (option === "home" || option === "profile")
			return <ChatAreaBackgroud />;
	};

	return (
		<>
			<Sidebar />
			{renderComponent()}
		</>
	);
};

export default Home;
