import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModifyForm = ({ entryId, type, setPage, sessionUser }) => {
  const [newText, setNewText] = useState('');
  const [entry, setEntry] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (type === 'Question') {
        try {
          const response = await axios.get(`http://localhost:8000/posts/questions/${entryId}`);
          setNewText(response.data.text);
          setEntry(response.data);
        } catch (error) {
          console.error('Error fetching question:', error);
        }
      } else if (type === 'Answer') {
        try {
          console.log(entryId);
          console.log("type answer");
          const response = await axios.get(`http://localhost:8000/posts/answers/${entryId}`);
          console.log("answer object ", response);
          console.log("response data ", response.data);
          setNewText(response.data.text); // Assuming response contains text property
        } catch (error) {
          console.error('Error fetching answer:', error);
        }
      } else {
        try {
          const response = await axios.get(`http://localhost:8000/posts/tags/${entryId}`);
          setNewText(response.data.name); // Assuming response contains text property
        } catch (error) {
          console.error('Error fetching tag:', error);
        }
      }
    };

    fetchData();
  }, [entryId, type]);

  console.log("Entry ID ", entryId);

  const handleTextChange = (e) => {
    setNewText(e.target.value);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (type === 'Question') {
        await axios.put(`http://localhost:8000/posts/questions/editQuestion/${entryId}`, { text: newText }, { withCredentials: true});
      } else if (type === 'Answer') {
        await axios.put(`http://localhost:8000/posts/answers/editAnswer/${entryId}`, { text: newText }, { withCredentials: true});
      } else {
        await axios.put(`http://localhost:8000/posts/tags/edit/${entryId}`, { name: newText }, { withCredentials: true});
      }
      if(sessionUser.isAdmin){
        setPage('chosenUser');
      }else{
        setPage('userPage');
      }
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      if (type === 'Question') {
        await axios.delete(`http://localhost:8000/posts/questions/deleteQuestion/${entryId}`, { withCredentials: true});
      } else if (type === 'Answer') {
        await axios.delete(`http://localhost:8000/posts/answers/deleteAnswer/${entryId}`, { withCredentials: true});
      } else {
        await axios.delete(`http://localhost:8000/posts/tags/delete/${entryId}`, { withCredentials: true});
      }
      if(sessionUser.isAdmin){
        setPage('chosenUser');
      }else{
        setPage('userPage');
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div>
    <h1>Modify {type}</h1>
      <form>
        <div>
          <label htmlFor="text">Edit {type}:</label>
          <input
            type="text"
            id="text"
            value={newText}
            onChange={handleTextChange}
          />
        </div>
        <div>
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </form>
    </div>
  );
};

export default ModifyForm;