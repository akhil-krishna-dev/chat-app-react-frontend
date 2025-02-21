import { handleSeenMessageApi } from "api/chat";
const makeMessgesAsSeen = ({ chatId, authUser, messagesResults }) => {
	const seenChatMsg = {
		chatId: parseInt(chatId),
		seenMsgIds: [],
	};

	for (let i = messagesResults.length - 1; i >= 0; i--) {
		const { id, status, sender } = messagesResults[i];
		if (status === "chat created") {
			continue;
		}
		if (status === "seen") {
			break;
		}

		if (sender?.id !== authUser?.id) {
			seenChatMsg.seenMsgIds.push(id);
		}
	}
	if (seenChatMsg.seenMsgIds.length > 0) {
		handleSeenMessageApi(seenChatMsg);
	}
};

export { makeMessgesAsSeen };
