import React, { useState, useEffect } from 'react'

const QuestionsAnswered = ({questions, setPage}) => {

  console.log("QANSWERED ", questions[0]);

    const handleClick = (questionId) => {
        return;
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return (
          <div id="none">
              <h1>No questions answered</h1>
          </div>
      );
  }

  return (
    <div>
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