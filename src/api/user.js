import { API_URL } from "config";
import axios from "axios";
import { fetchChats } from "./chat";
import {
	updateAuthChecked,
	updateAuthUser,
	updateIsSearchingUsers,
	updateUsersSearchedWithKeyWord,
} from "store/userSlice";
import { checkJWT } from "utils/tokenUtils";

export const fetchUser = (dispatch) => {
	if (!checkJWT()) return dispatch(updateAuthChecked());
	axios
		.get(`${API_URL}accounts/request-user-profile/`)
		.then((response) => {
			dispatch(updateAuthUser(response.data));
			fetchChats(dispatch);
		})
		.catch((error) => {
			localStorage.clear();
		})
		.finally(() => {
			dispatch(updateAuthChecked());
		});
};

export const fetchUsersWithKeyWords = ({ searchKeyWord, dispatch }) => {
	let URL = `${API_URL}accounts/users/search/`;

	if (searchKeyWord) {
		URL += `?query=${searchKeyWord}`;
	}

	axios
		.get(URL)
		.then((response) => {
			dispatch(updateUsersSearchedWithKeyWord(response.data));
		})
		.catch((error) => {
			console.log(error);
		})
		.finally(() => {
			dispatch(updateIsSearchingUsers(false));
		});
};
