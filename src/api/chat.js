import axios from "axios";
import { BaseUrl } from "App";
import { updateChatList } from "store/chatSlice";

export const fetchChats = (dispatch) => {
	axios
		.get(`${BaseUrl}home/chats`)
		.then((response) => {
			dispatch(updateChatList(response.data));
		})
		.catch((error) => {
			console.log(error);
		});
};

export const handleSeenMessageApi = (seenChatMsg) => {
	axios
		.post(`${BaseUrl}home/chats/handle_message_seen/`, seenChatMsg)
		.then((response) => {})
		.catch((error) => {
			console.log(error);
		});
};
