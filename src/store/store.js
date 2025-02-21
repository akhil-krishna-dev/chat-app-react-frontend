import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./userSlice";
import chatReducer from "./chatSlice";

const store = configureStore({
	reducer: {
		users: usersReducer,
		chatList: chatReducer,
	},
});

export default store;
