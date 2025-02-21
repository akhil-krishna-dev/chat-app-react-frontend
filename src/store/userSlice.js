import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
	name: "users",
	initialState: {
		authUser: {},
		searchUsers: {
			searchKeyWord: "",
			isSearchingUsers: false,
			results: [],
		},
	},
	reducers: {
		updateAuthUser: (state, action) => {
			state.authUser = action.payload;
		},
		updateUserFullName: (state, action) => {
			state.authUser = { ...state.authUser, full_name: action.payload };
		},
		updateUserStatus: (state, action) => {
			state.authUser = { ...state.authUser, status: action.payload };
		},
		updateUserProfileImage: (state, action) => {
			state.authUser.image = action.payload;
		},
		updateIsSearchingUsers: (state, action) => {
			state.searchUsers.isSearchingUsers = action.payload;
		},
		updateUsersSearchedWithKeyWord: (state, action) => {
			state.searchUsers.results = action.payload;
		},
		updateSearchKeyWord: (state, action) => {
			state.searchUsers.searchKeyWord = action.payload;
		},
		closeSearchingUsers: (state) => {
			state.searchUsers.searchKeyWord = "";
			state.searchUsers.results = [];
		},
	},
});

export const {
	updateAuthUser,
	updateUserFullName,
	updateUserStatus,
	updateUserProfileImage,
	updateUsersSearchedWithKeyWord,
	updateSearchKeyWord,
	updateIsSearchingUsers,
	closeSearchingUsers,
} = usersSlice.actions;
export default usersSlice.reducer;
