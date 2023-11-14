import React, { useState, useEffect } from "react";
import axios from 'axios'

const TagsBox = ({
  updatePage,
  tags,
  updateQstnArray,
  currentQstnArray,
  setTagId,
  setTagName,
}) => {


  /*const searchForTag = async (element) => {
      //let encodedSearch = encodeURIComponent(element);
      console.log(element);
      try {
        const res = await axios.get(`http://localhost:8000/posts/questions/searchingTag/${element}`);
        console.log("RES ", res);
        console.log("RES.DATA ", res.data[0]);
        updateQstnArray(res.data[0]);
        //updatePage('tagQuestions');
        setTagId(element._id);
      } catch(error) {
        console.error(error);
      }
        /*return axios.get(`http://localhost:8000/posts/questions/searchingTag/${encodedSearch}`).then((res) => {
        updatePage('tagQuestions');
        updateQstnArray(res.data);
        setTagId(element._id);
        return res.data;
      });
  };*/

  const handleClick = (element, page) => {
    (async () => {
      let tagQuestions;
      await axios.get(`http://localhost:8000/posts/questions/searchingTag/${element}`).then(response => {
        tagQuestions = response.data;
      });
      setTagName(element);
      updateQstnArray(tagQuestions);
      updatePage(page);
    })()
  }

  const [tagCount, setTagCount] = useState({});
  const [allTags, setAllTags] = useState([]);



  useEffect(() => {
    // Fetch tags from the tags router
    axios.get('http://localhost:8000/posts/tags')
      .then(response => {
        console.log("TAGS ", response.data);
        setAllTags(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const fetchTagQuestionsCount = async () => {
      const countObj = {};
      for (let i = 0; i < allTags.length; i++) {
        const res = await axios.get(`http://localhost:8000/posts/tags/questionsPerTag/${allTags[i]._id}`);
        countObj[allTags[i]._id] = res.data.length;
      }
      setTagCount(countObj);
    };
    fetchTagQuestionsCount();
  }, [allTags]);


  
 

  return (
    <div className='tagFlexDiv'>
      {allTags.map((tag) => (
        <div key={tag._id} className='uniqueTags'>
          <div className="tagName">
            <h2>
              <a
                href={tag._id}
                id={tag._id}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(tag.name, 'tagQuestions');
                }}
              >
                {tag.name}
              </a>
            </h2>
          </div>
          <div className="tagNum">
            <h4>

              {tagCount[tag._id]}
              {tagCount[tag._id] === 1 ? ' question' : ' questions'}

            </h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TagsBox;
