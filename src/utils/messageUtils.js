import { handleSeenMessageApi } from "api/chat";
const makeMessgesAsSeen = ({
	chatId,
	authUserId,
	targetUserId,
	messagesResults,
}) => {
	const seenChatMsg = {
		chatId: parseInt(chatId),
		targetUserId,
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

		if (sender?.id !== authUserId) {
			seenChatMsg.seenMsgIds.push(id);
		}
	}
	if (seenChatMsg.seenMsgIds.length > 0) {
		handleSeenMessageApi(seenChatMsg);
	}
};

export { makeMessgesAsSeen };
