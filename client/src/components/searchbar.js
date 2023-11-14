import React, { useState, useEffect } from 'react';
import axios from 'axios'

const Searchbar = ({currentSearch, setCurrentSearch, currentQstnArray, setQstnArray, currentPage, setCurrentPage, setTagId}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const [searchResults, updatePage] = useState([]);
  const array = currentQstnArray;


  const handleSearch = async (event) => {
  if (event.key === 'Enter') {
    //let encodedSearch = encodeURIComponent(searchQuery);
    //console.log(encodedSearch);
    try {
      const res = await axios.get(`http://localhost:8000/posts/questions/searching/${searchQuery.toLowerCase()}`);
      setCurrentPage('searchQuestions');
      setQstnArray(res.data);
    } catch (error) {
      console.error(error);
    }
  }
};


  return (
    <div id="searchBar">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        onKeyPress={(e)=>handleSearch(e)}
      />
   </div>
  );
}

export default Searchbar;
