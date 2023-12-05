import React, { useState, useEffect } from 'react'
import axios from 'axios'
import formatQuestionMetadata from '../helpers/formatQuestionMetadata'
import extractLink from '../helpers/extractLink'  

async function getAnswerById(ans_Id) {
    console.log(typeof(ans_Id));
    const response = await axios.get(`http://localhost:8000/posts/answers/${ans_Id}`);
    return response.data;
  }


function AnswerContainer({currentQuestion}) {
    const [answerArray, setAnswerArray] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const answersPerPage = 3;

    useEffect(() => {
          axios.get(`http://localhost:8000/posts/answers/getAnswersForQuestion/${currentQuestion._id}`)
          .then((res) => {
            setAnswerArray([...res.data]);
          });
      }, [currentQuestion]);

      console.log(answerArray);

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

      return(
        <div>
        {currentAnswers.map((ans_Id) => (
            <div key={ans_Id._id} className='flexDiv'>
              <div className='textDiv2'><p>{extractLink(ans_Id.text)}</p></div>
              <div className='answeredByDiv'><p>{ans_Id.ans_by} answered on {formatQuestionMetadata(new Date(ans_Id.ans_date_time))}</p></div>
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
      )
}

export default AnswerContainer;
