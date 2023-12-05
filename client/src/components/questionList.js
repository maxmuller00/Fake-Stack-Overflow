import React, { useState, useEffect } from 'react'
import formatQuestionMetadata from '../helpers/formatQuestionMetadata.js'
import axios from 'axios'
import CreateTagForQuestion from '../helpers/createTagForQuestion.js'



const QuestionList = ({qarray, setQstnArray, currentPage, setPage, currentQ, setCurrentQ, model}) => {

  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 3;

  const totalPages = Math.ceil(qarray.length / questionsPerPage);

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questionArray.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
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


  const handleClick = (page, q) => {
    (async () => {
      let currentQuestion;
      await axios.get(`http://localhost:8000/posts/questions/${q._id}`).then(response => {
        currentQuestion = response.data;
      });
      await axios.patch(`http://localhost:8000/posts/questions/incrementViews/${currentQuestion._id}`);
      setCurrentQ(currentQuestion);
      setPage(page);
    })()
  }

  

  

  if (qarray.length === 0) {
    return (
      <div id="none">
        <h1>No questions found</h1>
      </div>
    );
  }
  return (
   <div className='questionDiv'>
    {currentQuestions.map((question) => (
        <div key={question._id} className="flexDiv">
          <div className="viewDiv">
            <p>{question.answers.length} answers</p>
            <p>{question.views} views</p>
          </div>
          <div className="titleDiv">
            <button className='qTitle'onClick={() => handleClick('openQuestion', question)}>{question.title}</button>
            <CreateTagForQuestion tagIds={question.tags} qid={question._id} />
          </div>
          <div className="askedByDiv">
              <p>{question.asked_by} asked {formatQuestionMetadata(new Date(question.ask_date_time))}</p>
          </div>
        </div>
    ))}
    <div>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
   </div>
  );
}

export default QuestionList
