import React, { useState } from 'react'
import axios from 'axios'


const sidenav = ({currentPage, updatePage, currentQstnArray, setQstnArray, sessionUser, setSessionUser}) => {

  const handleClick = (page) => {
    axios.get('http://localhost:8000/posts/questions/newest').then(response => {
      setQstnArray(response.data);
    });
    updatePage(page);
  }

  const handleLogout = () => {
    setSessionUser({loggedIn : false, admin : false});
    updatePage("welcome");
  }

  const handleLogIn = () => {
    updatePage("login");
  }

  return (
    <div className='sideNav'>
        <button className='questionSideNav' onClick={()=>handleClick('allQuestions')}>Questions</button>
        <button className='tagsSideNav' onClick={()=>updatePage('allTags')}>Tags</button>
        {sessionUser.loggedIn === true && (
          <button className='userSideNav' onClick={()=>updatePage('userPage')}>{/*Grab username from session Id */}
           {sessionUser.username}</button>
        )}
        {sessionUser.loggedIn === true && (
          <button className='logoutSideNav' onClick={handleLogout}>Log Out</button>
        )}
        {sessionUser.loggedIn === false && (
          <button className='logoutSideNav' onClick={handleLogIn}>Log In</button>
        )}
    </div>

    
  )
}

export default sidenav
