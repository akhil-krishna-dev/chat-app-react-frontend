import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
	name: "chat",
	initialState: {
		chatList: [],
		currentChat: {
			otherUser: {},
			messages: {
				count: 0,
				next: "",
				previous: "",
				results: [],
			},
		},
		smallDevice: {
			isSmallDevice: false,
		},
	},
	reducers: {
		updateChatList: (state, action) => {
			state.chatList = action.payload;
		},
		updateChatListWithNewChat: (state, action) => {
			state.chatList = [...state.chatList, action.payload];
		},
		updateMessagesInChat: (state, action) => {
			let chatIndex = state.chatList.findIndex(
				(pc) => pc.id === action.payload.chat_id
			);
			if (chatIndex !== -1) {
				const updatedChat = { ...state.chatList[chatIndex] };

				if (
					!updatedChat.messages.results.find(
						(m) => m.id === action.payload.id
					)
				) {
					updatedChat.messages.results = [
						...updatedChat.messages.results,
						action.payload,
					];
				}

				if (action.payload.is_receiver) {
					updatedChat.unread = updatedChat.unread + 1;
				}
				const updatedChatList = state.chatList.filter(
					(_, index) => index !== chatIndex
				);
				state.chatList = [updatedChat, ...updatedChatList];
			}
		},
		updateParticipantsOnlineStatus: (state, action) => {
			const userId = action.payload;
			state.chatList = state.chatList.map((chat) => ({
				...chat,
				participants: chat.participants.map((participant) =>
					participant.id === userId
						? { ...participant, online: !participant.online }
						: participant
				),
			}));
		},
		updateCurrentChat: (state, action) => {
			const chatId = parseInt(action.payload.chatId);
			const authUserId = parseInt(action.payload.authUserId);
			const chat = state.chatList.find((chat) => chat.id === chatId);
			if (chat) {
				state.currentChat.otherUser = chat.participants.filter(
					(p) => p.id !== authUserId
				)[0];
				state.currentChat.messages = chat.messages;
			}
		},
		updateSeenMessage: (state, action) => {
			let isUpdating = false;
			if (isUpdating) return;
			isUpdating = true;
			const { chatId, msgIds } = action.payload;

			state.chatList = state.chatList.map((pc) => {
				if (pc.id === chatId) {
					return {
						...pc,
						messages: {
							results: pc.messages.results.map((pm) => {
								if (msgIds.includes(pm.id))
									return { ...pm, status: "seen" };
								else return pm;
							}),
						},
					};
				}
				return pc;
			});
			isUpdating = false;
		},
		clearSeenMessageCount: (state, action) => {
			const chatId = action.payload;
			state.chatList = state.chatList.map((cl) =>
				cl.id === parseInt(chatId) ? { ...cl, unread: 0 } : cl
			);
		},
		updateCurrentChatMessagesWithNextPage: (state, action) => {
			const chatData = action.payload;
			state.chatList = state.chatList.map((cl) => {
				if (cl?.id === chatData?.id) {
					return {
						...cl,
						messages: {
							...chatData?.messages,
							results: [
								...chatData?.messages?.results,
								...cl?.messages?.results,
							],
						},
					};
				}
				return cl;
			});
		},
		activateOrDeactivateChatAreaForSmallDevice: (state) => {
			state.smallDevice.isSmallDevice = !state.smallDevice.isSmallDevice;
		},
	},
});

export const {
	updateChatList,
	updateChatListWithNewChat,
	updateCurrentChat,
	clearSeenMessageCount,
	updateMessagesInChat,
	updateParticipantsOnlineStatus,
	updateSeenMessage,
	updateCurrentChatMessagesWithNextPage,
	activateOrDeactivateChatAreaForSmallDevice,
} = chatSlice.actions;
export default chatSlice.reducer;
