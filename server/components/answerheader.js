import React, { useState } from 'react'
import formatQuestionMetadata from '../helpers/formatQuestionMetadata.js'
import extractLink from '../helpers/extractLink.js'
import AnswerContainer from './answerContainer.js'
import axios from 'axios'



const  Answerheader = ({qid, currentPage, setPage, currentQ, setCurrentQ}) => {

  
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
            <button className='askQ' onClick={() => setPage('questionForm')}>Ask Question</button>
        </div>
        <div className='flexDiv'>
          <div className='viewDiv'><p> { currentQ.views + 1} views</p></div>
          <div className='textDiv'><p> { extractLink(currentQ.text) } </p></div>
          <div className='askedByDiv'><p> { currentQ.asked_by }  asked on {formatQuestionMetadata(new Date(currentQ.ask_date_time))}</p></div>   
        </div>

     <AnswerContainer currentQuestion={currentQ} />

        <button className='answerBtn' onClick={() => setPage('answerForm')}>Answer</button>
    </div>
  )
}

export default Answerheader
