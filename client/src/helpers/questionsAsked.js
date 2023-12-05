import React, { useState, useEffect } from 'react'

const QuestionsAsked = ({questions, setPage, setEntryId, setEntryType}) => {

    handleClick = (entryId, type) => {
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
            <CreateTagForQuestion tagIds={question.tags} qid={question._id} />
          </div>
        </div>
    ))}
    </div>
  )
}

export default QuestionsAsked