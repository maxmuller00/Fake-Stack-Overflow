import React, { useState, useEffect } from 'react'
import formatQuestionMetadata from '../helpers/formatQuestionMetadata.js'
import extractLink from '../helpers/extractLink.js'
import AnswerContainer from './answerContainer.js'
import axios from 'axios'



const  Answerheader = ({qid, currentPage, setPage, currentQ, setCurrentQ, sessionId, setEntryType, setEntryId, sessionUser}) => {

  const [comments, setComments] = useState([]);
  const [commentsPerPage] = useState(3);
  const [pageNum, setPageNum] = useState(1); // Renamed state to 'pageNum'
  const [currentPageComments, setCurrentPageComments] = useState([]);
  const [upVoted, setUpVoted] = useState(false);
  const [downVoted, setDownVoted] = useState(false);

  async function fetchQuestion(){
    await axios.get(`http://localhost:8000/posts/questions/${qid._id}`).then((res) => {
      setCurrentQ(res.data);
    })
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/posts/questions/comments/${qid._id}`);
        console.log("response data ", response.data);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setComments([]);
      }
    };

    fetchComments();
    console.log("comments ", comments);
  }, [qid]);

  useEffect(() => {
    // Update currentPageComments whenever comments or pageNum changes
    const startIndex = (pageNum - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    setCurrentPageComments(comments.slice(startIndex, endIndex));
  }, [comments, pageNum, commentsPerPage]);

  const handlePrevPage = () => {
    if (pageNum > 1) {
      setPageNum(pageNum - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(comments.length / commentsPerPage);
    if (pageNum < totalPages) {
      setPageNum(pageNum + 1);
    }
  };

  const handleUpvoteQuestion = async () => {
    try {
      if (!upVoted) {
        const response = await axios.patch(`http://localhost:8000/posts/questions/incrementVotes/${qid._id}/${sessionId.userId}`, { withCredentials: true });
        console.log('Upvoted question:', response.data);


        setUpVoted(true);
      } else {
        const response = await axios.patch(`http://localhost:8000/posts/answers/decrementVotes/${qid._id}/${sessionId.userId}`, { withCredentials: true });
        console.log('Un-upvoted question:', response.data);
        setUpVoted(false);
      }
    } catch (error) {
      console.error('Error upvoting question:', error);
      // Handle error
    }
  };
  
    // Function to handle downvoting an answer
  const handleDownvoteQuestion = async (answerId) => {
    try {
      if (!downVoted) {
        const response = await axios.patch(`http://localhost:8000/posts/answers/decrementVotes/${answerId}/${sessionId.userId}`, { withCredentials: true });
        console.log('Downvoted question:', response.data);


        setDownVoted(true);
      } else {
        const response = await axios.patch(`http://localhost:8000/posts/answers/incrementVotes/${answerId}/${sessionId.userId}`, { withCredentials: true });
        console.log('Un-downvoted question:', response.data);
        setDownVoted();
      }
    } catch (error) {
      console.error('Error downvoting answer:', error);
      // Handle error
    }
  };

  
  
  const handleComment= (entryId, entryType) => {
    setEntryId(entryId);
    setEntryType(entryType);
    setPage('commentForm');
  }

  //console.log(currentQ);
  return (
    <div className='answerHeader'>
        <div className='flexDivTop'>
            <div className='answerDiv'>
              <p> { currentQ.answers.length } Answers</p>
            </div>
            <div className='titleDiv'>
              <p> { currentQ.title } </p>
            </div>
            {sessionId.loggedIn && (
            <div>  
              <div>
                <button className='askQ' onClick={()=>handleComment(currentQ._id, 'question')}>Comment</button>
                <button className='askQ' onClick={()=>setPage('questionForm')}>Ask Question</button>
              </div>
              <div>
                {sessionUser.loggedIn && <button onClick={() => handleUpvoteQuestion()} disabled={upVoted}>Upvote</button>}
                {sessionUser.loggedIn && <button onClick={() => handleDownvoteQuestion()} disabled={downVoted}>Downvote</button>}
              </div>
            </div>
      )}
      {!sessionId.loggedIn && (
        <button className="loginButton" onClick={()=>setPage("login")}>Login</button>
      )}
        </div>
        <div className='flexDivTop'>
          <div className='viewDiv'><p> { currentQ.views + 1} views</p><span>Votes: {qid.votes}</span></div>
          <div className='textDiv'><p> { extractLink(currentQ.text) } </p></div>
          <div className='askedByDiv'><p> { currentQ.asked_by_name }  asked on {formatQuestionMetadata(new Date(currentQ.ask_date_time))}</p></div>   
        </div>
        <h4>Comments: </h4>
        {comments.length > 0 && (
          <div>
            {/* Render comments */}
            {currentPageComments.map(comment => (
              <div key={comment._id} className="commentItem">
                  <div className="textDiv2">
                    <p>{extractLink(comment.text)}</p>
                  </div>
                  <div className="answeredByDiv">
                    <p>
                      {comment.com_by_name} commented {' '}
                      {formatQuestionMetadata(new Date(comment.com_date_time))}
                    </p>
                    {sessionId.loggedIn && <button>Upvote</button>}
                    <span>Votes: {comment.votes}</span>
                  </div>
                </div>
            ))}

            {/* Pagination */}
            <div>
              <button onClick={handlePrevPage} disabled={pageNum === 1}>
                Previous
              </button>
              <span>
                Page {pageNum} of {Math.ceil(comments.length / commentsPerPage)}
              </span>
              <button onClick={handleNextPage} disabled={pageNum * commentsPerPage >= comments.length}>
                Next
              </button>
            </div>
          </div>
        )}
        

      <AnswerContainer 
      currentQuestion={currentQ} 
      setEntryId={setEntryId}
      setEntryType={setEntryType} 
      setPage={setPage}
      sessionId={sessionId}
      />

        {sessionId.loggedIn &&
        (<button className='answerBtn' onClick={() => setPage('answerForm')}>Answer</button>)}
    </div>
  )
}

export default Answerheader
