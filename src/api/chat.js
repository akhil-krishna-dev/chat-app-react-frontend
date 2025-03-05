import { API_URL } from "config";
import axios from "axios";
import { updateChatList } from "store/chatSlice";

export const fetchChats = (dispatch) => {
	axios
		.get(`${API_URL}home/chats`)
		.then((response) => {
			dispatch(updateChatList(response.data));
		})
		.catch((error) => {
			console.log(error);
		});
};

export const handleSeenMessageApi = (seenChatMsg) => {
	axios
		.post(`${API_URL}home/chats/handle_message_seen/`, seenChatMsg)
		.then((response) => {})
		.catch((error) => {
			console.log(error);
		});
};
