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
		callingDuration: 0,
	},
	reducers: {
		updateIsUserInVoiceCall: (state, action) => {
			state.voiceCall.isUserInVoiceCall = action.payload;
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
		updateCallingDuration: (state) => {
			state.callingDuration = state.callingDuration + 1;
		},
		resetCallingDuration: (state) => {
			state.callingDuration = 0;
		},
	},
});

export const {
	updateIsUserInVideoCall,
	updateIsUserInVoiceCall,
	updateIsCaller,
	updateUserInCall,
	updateUserCallTaken,
	updateCallingDuration,
	resetCallingDuration,
} = callStatusSlice.actions;
export default callStatusSlice.reducer;
