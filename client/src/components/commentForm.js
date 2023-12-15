import React, { useState } from 'react';
import axios from 'axios';

const CommentForm = ({ commentType, toId, setPage, sessionUser }) => {
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    console.log("Clicked");
    
    // Check if the comment text is valid
    if (text.length === 0 || text.length > 140) {
      setErrorMessage('Comment must be between 1 and 140 characters');
      return;
    }

    try {
      const newComment = {
        text: text,
        com_By: sessionUser.userId,
        com_by_name: sessionUser.username,
        toId: toId,
        commentType: commentType,
      };
      // Send a POST request to the backend route '/addComment'
      const response = await axios.post('http://localhost:8000/posts/comments/addComment', newComment, { withCredentials: true});

      if (response.data === 'success') {
        // Handle success, e.g., show a success message
        console.log('Comment added successfully');
        setPage('openQuestion');
      }
    } catch (error) {
      console.error(error);
      // Handle error, e.g., show an error message to the user
      setErrorMessage('Failed to add comment. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your comment"
          rows={4}
          cols={50}
        />
        {errorMessage && <p>{errorMessage}</p>}
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
};

export default CommentForm;
