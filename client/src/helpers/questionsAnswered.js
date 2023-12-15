import React, { useState, useEffect } from 'react'
import axios from 'axios'

const QuestionsAnswered = ({questions, setPage, setModifyAnswerQ}) => {

  console.log("QANSWERED ", questions);

    const handleClick = (questionId) => {
      (async () => {
        let currentQuestion;
        await axios.get(`http://localhost:8000/posts/questions/${questionId}`).then(response => {
          currentQuestion = response.data;
        });
        console.log("handle click in Q Answered");
        console.log("QUESTION ID", questionId);
        setModifyAnswerQ(currentQuestion);
        setPage('modAnswer');
      })()
    }

    if (!Array.isArray(questions)) {
      console.log("Not an Array")
      return (
          <div id="none">
              <h1>No questions answered</h1>
          </div>
      );
    }

    if (questions.length === 0) {
      console.log("Length 0");
      return (
          <div id="none">
              <h1>No questions answered</h1>
          </div>
      );
    }

  return (
    <div>
    <h1> Questions Answered </h1>
    {questions.map((question) => (
        <div key={question._id} className="flexDiv">
          <div className="titleDiv">
            <button className='qTitle'onClick={() => handleClick(question._id)}>{question.title}</button>
          </div>
        </div>
    ))}
    </div>
  )
}

export default QuestionsAnswered