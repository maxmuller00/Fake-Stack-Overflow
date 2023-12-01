import React, { useState } from 'react'
import axios from 'axios'


const sidenav = ({currentPage, updatePage, currentQstnArray, setQstnArray, sessionId, setSessionId}) => {

  const handleClick = (page) => {
    axios.get('http://localhost:8000/posts/questions/newest').then(response => {
      setQstnArray(response.data);
    });
    updatePage(page);
  }

  const handleLogout = () => {
    setSessionId = "guest";
    updatePage("welcome");
  }

  return (
    <div className='sideNav'>
        <button className='questionSideNav' onClick={()=>handleClick('allQuestions')}>Questions</button>
        <button className='tagsSideNav' onClick={()=>updatePage('allTags')}>Tags</button>
        {sessionId != "guest" && (
          <button className='userSideNav' onClick={()=>updatePage('userProfile')}>{/*Grab username from session Id */}
           USERNAME</button>
        )}
        {sessionId != "guest" && (
          <button className='logoutSideNav' onClick={handleLogout}>Log Out</button>
        )}
    </div>

    
  )
}

export default sidenav
