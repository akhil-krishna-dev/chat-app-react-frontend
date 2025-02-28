import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./userSlice";
import chatReducer from "./chatSlice";
import callStatusReducer from "./callSlice";

const store = configureStore({
	reducer: {
		users: usersReducer,
		chatList: chatReducer,
		call: callStatusReducer,
	},
});

export default store;
