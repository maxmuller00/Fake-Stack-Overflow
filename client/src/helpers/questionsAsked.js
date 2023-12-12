import React, { useState, useEffect } from 'react'

const QuestionsAsked = ({questions, setPage, setEntryId, setEntryType}) => {

  console.log("QASKED ", questions[0]);

    const handleClick = (entryId, type) => {
        setEntryId(entryId);
        setEntryType(type);
        setPage("modfiy");
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return (
          <div id="none">
              <h1>No questions asked</h1>
          </div>
      );
  }


  return (
    <div>
    {questions.map((question) => (
        <div key={question._id} className="flexDiv">
          <div className="titleDiv">
            <button className='qTitle'onClick={() => handleClick(question._id, "Question")}>{question.title}</button>
          </div>
        </div>
    ))}
    </div>
  )
}

export default QuestionsAsked