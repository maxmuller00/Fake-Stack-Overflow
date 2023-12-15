import React, { useState, useEffect} from 'react'
import axios from 'axios'

const TagsCreated = ({tags, setEntryId, setEntryType, setPage }) => {
  const [tagCount, setTagCount] = useState({});

  useEffect(() => {
    const fetchTagQuestionsCount = async () => {
      const countObj = {};
      for (let i = 0; i < tags.length; i++) {
        const res = await axios.get(`http://localhost:8000/posts/tags/questionsPerTag/${tags[i]._id}`);
        countObj[tags[i]._id] = res.data.length;
      }
      setTagCount(countObj);
    };
    fetchTagQuestionsCount();
  }, [tags]);

  const handleClick = (entryId) => {
    console.log("TAG ID ", entryId);
    setEntryId(entryId);
    setEntryType('tag');
    setPage("modify");
  }

  if (!Array.isArray(tags) || tags.length === 0) {
    return (
        <div id="none">
            <h1>No Tags Created</h1>
        </div>
    );
  }

  return (
    <div>
      <h1>Tags Created</h1>
      <div className='tagFlexDiv'>
        {tags.map((tag) => (
          <div key={tag._id} className='uniqueTags'>
            <div className="tagName">
              <h2>
                <a
                  href={tag._id}
                  id={tag._id}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(tag._id);
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
    </div>
  );
}

export default TagsCreated