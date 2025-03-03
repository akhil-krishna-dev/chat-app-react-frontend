import { BsChatQuote } from "react-icons/bs";
import { TbMessageChatbot } from "react-icons/tb";

const ChatAppTitle = () => {
	return (
		<h1 style={{ marginBottom: "20px", color: "whitesmoke" }}>
			<TbMessageChatbot />
			<span style={{ marginLeft: "15px", marginRight: "15px" }}>
				Chat App
			</span>
			<BsChatQuote />
		</h1>
	);
};

export default ChatAppTitle;
