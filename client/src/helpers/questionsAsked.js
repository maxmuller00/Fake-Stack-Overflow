import React, { useState, useEffect } from 'react'

const QuestionsAsked = ({questions, setPage, setEntryId, setEntryType}) => {

    const handleClick = (entryId, type) => {
        setEntryId(entryId);
        setEntryType(type);
        setPage("modfiy");
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