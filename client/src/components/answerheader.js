import React, { useState } from 'react'
import formatQuestionMetadata from '../helpers/formatQuestionMetadata.js'
import extractLink from '../helpers/extractLink.js'
import AnswerContainer from './answerContainer.js'
import axios from 'axios'



const  Answerheader = ({qid, currentPage, setPage, currentQ, setCurrentQ, sessionId}) => {

  
  console.log(currentQ);
  return (
    <div className='answerHeader'>
        <div className='flexDivTop'>
            <div className='answerDiv'>
              <p> { currentQ.answers.length } Answers</p>
            </div>
            <div className='titleDiv'>
              <p> { currentQ.title } </p>
            </div>
            {sessionId != "guest" && (
        <button className='askQ' onClick={()=>setPage('questionForm')}>Ask Question</button>
      )}
      {/*if username === currentQ.askedBy enter a button here that will allow user to modify question */}
      {sessionId == "guest" && (
        <button className="loginButton" onClick={()=>setPage("login")}>Login</button>
      )}
        </div>
        <div className='flexDiv'>
          <div className='viewDiv'><p> { currentQ.views + 1} views</p></div>
          <div className='textDiv'><p> { extractLink(currentQ.text) } </p></div>
          <div className='askedByDiv'><p> { currentQ.asked_by }  asked on {formatQuestionMetadata(new Date(currentQ.ask_date_time))}</p></div>   
        </div>

     <AnswerContainer currentQuestion={currentQ} />

        {sessionId != "guest" &&
        (<button className='answerBtn' onClick={() => setPage('answerForm')}>Answer</button>)}
    </div>
  )
}

export default Answerheader
