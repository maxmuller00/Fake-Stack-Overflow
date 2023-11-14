import { useState, useEffect } from 'react';
import TagsBox from './tagsBox'
import axios from 'axios'

const TagsPage = ({updatePage, setSearch, currentSearch, updateQstnArray, currentQstnArray, setTagId,setTagName}) => {
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    // Fetch answers from the questions router
    axios.get('http://localhost:8000/posts/tags')
      .then(response => {
        setAllTags(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  return (
        <div id="tags-box-div">
          <div className='tagHeader'>
            <div className='numTags'><h1>{allTags.length} Tags</h1></div>
            <div className='allTags'><h1>All Tags</h1></div>
            <div className='askQDiv'><button className='askQ' onClick={()=>updatePage('questionForm')}>Ask Question</button></div>
          </div>
          <TagsBox updatePage={updatePage} setSearch={setSearch} tags={allTags} updateQstnArray={updateQstnArray} currentQstnArray={currentQstnArray} setTagId={setTagId} setTagName={setTagName} />
        </div>
  );
}

export default TagsPage;
