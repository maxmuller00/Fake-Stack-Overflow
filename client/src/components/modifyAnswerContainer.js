import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ModifyAnswerContainer = ({entryId, answers, type, setPage, setEntryId, setEntryType}) => {

    const handleClick = () => {
        setEntryId(entryId);
        setEntryType("Answer");
        setPage("modify");
    }

  return (
    <div>
        <div>
            <p>USER ANSWERS GO HERE</p>
            <button onClick={handleClick}>MODIFY</button>
        </div>
        {answers.map((ans_Id) => (
            <div key={ans_Id._id} className='flexDiv'>
              <div className='textDiv2'><p>{extractLink(ans_Id.text)}</p></div>
              <div className='answeredByDiv'><p>{ans_Id.ans_by} answered on {formatQuestionMetadata(new Date(ans_Id.ans_date_time))}</p></div>
            </div>
          ))}
    </div>
  )
}

export default ModifyAnswerContainer