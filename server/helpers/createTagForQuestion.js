import React, { useState, useEffect } from 'react';
import axios from 'axios';

async function getTagById(tagId) {
  const response = await axios.get(`http://localhost:8000/posts/tags/${tagId}`);
  return response.data.name;
}

function CreateTagForQuestion({ tagIds, qid }) {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedTags = await Promise.all(tagIds.map((tagId) => getTagById(tagId)));
      setTags(fetchedTags);
    };
    fetchData();
  }, [tagIds]);

  return (
    /*<ul key={qid} id="question-tags">
      {tags.map((tag, index) => (
        <li key={qid + tagIds[index]} className="tagP">{tag}</li>
      ))}
    </ul>*/
    <div className='tagsDiv'>
        {tags.map((tag, index) => (
        <p key={qid + tagIds[index]} className="tagP">{tag}</p>
      ))}
    </div>
  );
}

export default CreateTagForQuestion;