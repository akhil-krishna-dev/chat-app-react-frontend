import React from "react";
import './SearchUser.css';
import { IoSearchOutline } from "react-icons/io5";


const SearchUser = ({handleSearchAction, searchInput}) => {

    return (
        <div className="search-user-container">
            <div className="input-container">
                <IoSearchOutline color="grey" size={24} />
                <input onChange={(event) => handleSearchAction(event.target.value)}
                value={searchInput} 
                placeholder="Search Friends"/>
            </div>
        </div>
    );
};

export default SearchUser;
