import React, { useState } from 'react';
import axios from 'axios';

const CommentForm = ({ commentType, toId, setPage }) => {
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    // Check if the comment text is valid
    if (text.length === 0 || text.length > 140) {
      setErrorMessage('Comment must be between 1 and 140 characters');
      return;
    }

    try {
      const newComment = {
      text: commentText,
      commentType: commentType,
      toId: toId,
    };
    const res = await axios.post('http://localhost:8000/posts/comments/addComment', newComment);
    if (res.data === 'success') {
      setErrorMessage('');
    }
    if (res.data === 'User reputation too low') {
      setErrorMessage('You cannot make a comment because your reputation is lower than 50');
    }
    if (res.data === 'Comment must be between 1 and 140 characters') {
      setErrorMessage('Comment must be between 1 and 140 characters');
    }
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
