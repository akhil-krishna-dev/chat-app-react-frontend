import React, { useEffect } from "react";
import "./SearchUser.css";
import { IoSearchOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { updateSearchKeyWord, updateIsSearchingUsers } from "store/userSlice";
import useDebouncer from "hooks/useDebouncer";
import { fetchUsersWithKeyWords } from "api/user";

const SearchUser = () => {
	const { searchKeyWord } = useSelector((state) => state.users.searchUsers);
	const dispatch = useDispatch();

	const debouncerValue = useDebouncer(searchKeyWord, 1000);

	useEffect(() => {
		const dispatchObj = {
			searchKeyWord,
			dispatch,
		};
		if (!searchKeyWord) return;
		fetchUsersWithKeyWords(dispatchObj);
	}, [debouncerValue]);

	const handleOnChangeInput = (event) => {
		dispatch(updateIsSearchingUsers(true));
		dispatch(updateSearchKeyWord(event.target.value));
	};

	return (
		<div className="search-user-container">
			<div className="input-container">
				<IoSearchOutline color="grey" size={24} />
				<input
					onChange={handleOnChangeInput}
					value={searchKeyWord}
					placeholder="Search Friends"
				/>
			</div>
		</div>
	);
};

export default SearchUser;
