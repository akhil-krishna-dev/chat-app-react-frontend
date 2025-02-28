import { createSlice } from "@reduxjs/toolkit";

const callStatusSlice = createSlice({
	name: "callStatus",
	initialState: {
		voiceCall: {
			isUserInVoiceCall: false,
		},
		videoCall: {
			isUserInVideoCall: false,
		},
		isCaller: false,
		userInCall: false,
		userCallTaken: false,
	},
	reducers: {
		updateIsUserInVoiceCall: (state) => {
			state.voiceCall.isUserInVoiceCall =
				!state.voiceCall.isUserInVoiceCall;
		},
		updateIsUserInVideoCall: (state, action) => {
			state.videoCall.isUserInVideoCall = action.payload;
		},
		updateIsCaller: (state, actions) => {
			state.isCaller = actions.payload;
		},
		updateUserInCall: (state) => {
			state.userInCall = !state.userInCall;
		},
		updateUserCallTaken: (state, action) => {
			state.userCallTaken = action.payload;
		},
	},
});

export const {
	updateIsUserInVideoCall,
	updateIsUserInVoiceCall,
	updateIsCaller,
	updateUserInCall,
	updateUserCallTaken,
} = callStatusSlice.actions;
export default callStatusSlice.reducer;
