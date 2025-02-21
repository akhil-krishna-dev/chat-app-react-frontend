import { BaseUrl } from "App";
import axios from "axios";
import { fetchChats } from "./chat";
import {
	updateAuthUser,
	updateIsSearchingUsers,
	updateUsersSearchedWithKeyWord,
} from "store/userSlice";
import { checkJWT } from "utils/tokenUtils";

export const fetchUser = (dispatch) => {
	if (!checkJWT()) return;
	axios
		.get(`${BaseUrl}accounts/request-user-profile/`)
		.then((response) => {
			dispatch(updateAuthUser(response.data));
			fetchChats(dispatch);
		})
		.catch((error) => {
			console.log(error);
		});
};

export const fetchUsersWithKeyWords = ({ searchKeyWord, dispatch }) => {
	let URL = `${BaseUrl}accounts/users/search/`;

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
	// };
};
