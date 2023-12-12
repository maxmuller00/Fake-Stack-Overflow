import React, { useState, useEffect } from 'react'
import axios from 'axios'
import formatQuestionMetadata from '../helpers/formatQuestionMetadata'
import extractLink from '../helpers/extractLink'  

async function getComments(entryId, type){
  if(type === 'Question'){
      const response = await axios.get(`http://localhost:8000/posts/questions/comments/${entryId}`);
      return response.data; 
  }else{
      const response = await axios.get(`http://localhost:8000/posts/answers/comments/${entryId}`);
      return response.data;
  }
}


async function getAnswerById(ans_Id) {
    console.log(typeof(ans_Id));
    const response = await axios.get(`http://localhost:8000/posts/answers/${ans_Id}`);
    return response.data;
  }


function AnswerContainer({currentQuestion, setEntryId, setEntryType, setPage, sessionId}) {
    const [answerArray, setAnswerArray] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [comments, setComments] = useState([]);
    const [votedAnswers, setVotedAnswers] = useState([]);
    const [votedComments, setVotedComments] = useState([]);
    const answersPerPage = 3;

    useEffect(() => {
          axios.get(`http://localhost:8000/posts/answers/getAnswersForQuestion/${currentQuestion._id}`)
          .then((res) => {
            setAnswerArray([...res.data]);
          });
      }, [currentQuestion]);


      //console.log(answerArray);

      const totalPages = Math.ceil(answerArray.length / answersPerPage);

      const indexOfLastAnswer = currentPage * answersPerPage;
      const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
      const currentAnswers = answerArray.slice(
        indexOfFirstAnswer,
        indexOfLastAnswer
      );

      const handleNextPage = () => {
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      };

      const handlePrevPage = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };

        const fetchCommentsForAnswer = async (ansId) => {
    try {
      const comments = await getComments(ansId._id, 'Answer');
      return comments;
    } catch (error) {
      console.error('Error fetching comments for answer:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      const commentsPromises = currentAnswers.map(async (ansId) => {
        const comments = await fetchCommentsForAnswer(ansId);
        return { ansId: ansId._id, comments };
      });

      const fetchedComments = await Promise.all(commentsPromises);
      setComments(fetchedComments);
    };

    fetchComments();
  }, [currentAnswers]);

  if(answerArray.lenth === 0){
    return (
      <div></div>
    )
  }

  const handleComment= (entryId, entryType) => {
    setEntryId(entryId);
    setEntryType(entryType);
    setPage('commentForm');
  }

    // Function to handle upvoting an answer
    const handleUpvoteAnswer = async (answerId) => {
      try {
        if (!votedAnswers.includes(answerId)) {
          const response = await axios.patch(`http://localhost:8000/posts/answers/incrementVotes/${answerId}/${sessionId.userId}`, { withCredentials: true});
          // Handle success - Update UI or state as needed
          console.log('Upvoted answer:', response.data);
          setVotedAnswers([...votedAnswers, answerId]);
        }
      } catch (error) {
        console.error('Error upvoting answer:', error);
        // Handle error
      }
    };
  
    // Function to handle downvoting an answer
    const handleDownvoteAnswer = async (answerId) => {
      try {
        if (!votedAnswers.includes(answerId)) {
          const response = await axios.patch(`http://localhost:8000/posts/answers/decrementVotes/${answerId}/${sessionId.userId}`, { withCredentials: true});
          // Handle success - Update UI or state as needed
          console.log('Downvoted answer:', response.data);
          setVotedAnswers(votedAnswers.filter((id) => id !== answerId));
        }
      } catch (error) {
        console.error('Error downvoting answer:', error);
        // Handle error
      }
    };

     // Function to handle upvoting a comment
  const handleUpvoteComment = async (commentId) => {
    try {
      const response = await axios.patch(`http://localhost:8000/posts/comments/incrementVotes/${commentId}/${sessionId.userId}`);
      // Handle success - Update UI or state as needed
      console.log('Upvoted comment:', response.data);
    } catch (error) {
      console.error('Error upvoting comment:', error);
      // Handle error
    }
  };

  // Function to handle downvoting a comment
  const handleDownvoteComment = async (commentId) => {
    try {
      const response = await axios.patch(`http://localhost:8000/posts/comments/decrementVotes/${commentId}/${sessionId.userId}`);
      // Handle success - Update UI or state as needed
      console.log('Downvoted comment:', response.data);
    } catch (error) {
      console.error('Error downvoting comment:', error);
      // Handle error
    }
  };

  return (
    <div>
      {currentAnswers.map((ans_Id) => (
        <div key={ans_Id._id} className="flexDiv">
          <div className="textDiv2">
            <p>{extractLink(ans_Id.text)}</p>
          </div>
          <div className="answeredByDiv">
            <p>
              {ans_Id.ans_by} answered on{' '}
              {formatQuestionMetadata(new Date(ans_Id.ans_date_time))}
            </p>
            {/* Display vote count for the answer */}
            <span>Votes: {ans_Id.votes}</span>
          </div>
          {sessionId.loggedIn &&(
            <div key={ans_Id._id+"comment"}className="commentButtonDiv">
              <button onClick={() => handleComment(ans_Id._id, 'answer')}> Comment </button>
            </div>
          )}
          {/* Upvote and Downvote buttons for answers */}
          {sessionId.loggedIn && (<div className="voteButtons">
          <button onClick={() => handleUpvoteAnswer(ans_Id._id)} disabled={votedAnswers.includes(ans_Id._id)}>Upvote Answer</button>
            <button onClick={() => handleDownvoteAnswer(ans_Id._id)} disabled={votedAnswers.includes(ans_Id._id)}>Downvote Answer</button>
          </div>)}
          {/* Display comments for the current answer */}
          <div className="commentContainer">
            {comments
              .find((commentObj) => commentObj.ansId === ans_Id._id)
              ?.comments.map((comment) => (
                <div key={comment._id} className="commentItem">
                  <div className="textDiv2">
                    <p>{extractLink(comment.text)}</p>
                  </div>
                  <div className="answeredByDiv">
                    <p>
                      {comment.com_by} answered on{' '}
                      {formatQuestionMetadata(new Date(comment.com_date_time))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      ))}
      {/* Pagination buttons */}
      <div>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default AnswerContainer;
