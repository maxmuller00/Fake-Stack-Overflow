import React, { useState, useEffect } from 'react'
import formatQuestionMetadata from '../helpers/formatQuestionMetadata.js'
import extractLink from '../helpers/extractLink.js'
import AnswerContainer from './answerContainer.js'
import axios from 'axios'



const  Answerheader = ({qid, currentPage, setPage, currentQ, setCurrentQ, sessionId, setEntryType, setEntryId}) => {

  const [comments, setComments] = useState([]);
  const [commentsPerPage] = useState(3);
  const [pageNum, setPageNum] = useState(1); // Renamed state to 'pageNum'
  const [currentPageComments, setCurrentPageComments] = useState([]);

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
                <button>Upvote</button>
                <button>Downvote</button>
              </div>
            </div>
      )}
      {!sessionId.loggedIn && (
        <button className="loginButton" onClick={()=>setPage("login")}>Login</button>
      )}
        </div>
        <div className='flexDiv'>
          <div className='viewDiv'><p> { currentQ.views + 1} views</p><span>Votes: {qid.votes}</span></div>
          <div className='textDiv'><p> { extractLink(currentQ.text) } </p></div>
          <div className='askedByDiv'><p> { currentQ.asked_by_name }  asked on {formatQuestionMetadata(new Date(currentQ.ask_date_time))}</p></div>   
        </div>

        {comments.length > 0 && (
          <div>
            {/* Render comments */}
            {currentPageComments.map(comment => (
              <div key={comment._id}>
                {/* Display individual comment */}
                {/* Modify the display as per your comment structure */}
                <p>{comment.text}</p>
                <p>{comment.created_at}</p>
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
