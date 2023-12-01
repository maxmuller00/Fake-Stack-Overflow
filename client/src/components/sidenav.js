import React, { useState } from 'react'
import axios from 'axios'


const sidenav = ({currentPage, updatePage, currentQstnArray, setQstnArray, sessionId, setSessionId}) => {

  const handleClick = (page) => {
    axios.get('http://localhost:8000/posts/questions/newest').then(response => {
      setQstnArray(response.data);
    });
    updatePage(page);
  }

  return (
    <div className='sideNav'>
        <button className='questionSideNav' onClick={()=>handleClick('allQuestions')}>Questions</button>
        <button className='tagsSideNav' onClick={()=>updatePage('allTags')}>Tags</button>
        {sessionId != "guest" && (
          <button className='userSideNav' onClick={()=>updatePage('userProfile')}>{/*Grab username from session Id */}
           USERNAME</button>
        )}
    </div>

    
  )
}

export default sidenav
