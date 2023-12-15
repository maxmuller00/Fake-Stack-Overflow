import React, { useState, useEffect } from 'react'

const QuestionsAsked = ({questions, setPage, setEntryId, setEntryType}) => {

    const handleClick = (entryId, type) => {
        console.log("handle click in Q Ansked");
        console.log("QUESTION ", entryId);
        setEntryId(entryId);
        setEntryType(type);
        setPage("modify");
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
    <h1> Questions Asked </h1>
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