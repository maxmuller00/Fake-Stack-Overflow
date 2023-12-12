import React, { useState } from "react";
import axios from 'axios'

const Questionheader = ({qarray, updateQstnArray, currentPage, setPage, sessionId}) => {

  const handleClick = (filter) => {
    if(filter === 'newest'){
      axios.get(`http://localhost:8000/posts/questions/newest`).then(response => {
        updateQstnArray(response.data);
      });
    }
    if(filter === 'active'){
      axios.get(`http://localhost:8000/posts/questions/active`).then(response => {
        updateQstnArray(response.data);
      });
    }
    if(filter === 'unanswered'){
      axios.get(`http://localhost:8000/posts/questions/unanswered`).then(response => {
        updateQstnArray(response.data);
      });
    }
  }
  
  return <div className="questionHeader" id="questionHeader">
    <div className="numQ-questions">
      <h1>All Questions</h1>
      <p>{qarray.length} Questions</p>
    </div>
    <div className="buttonsDiv">
      {sessionId.loggedIn && (
        <button className='askQ' onClick={()=>setPage('questionForm')}>Ask Question</button>
      )}
      {!sessionId.loggedIn && (
        <button className="loginButton" onClick={()=>setPage("login")}>Login</button>
      )}
      <div className='filters'>
        <button className="filterBtn" onClick={()=>handleClick('newest')}>Newest</button>
        <button className="filterBtn" onClick={()=>handleClick('unanswered')}>Unanswered</button>
        <button className="filterBtn" onClick={()=>handleClick('active')}>Active</button>
      </div>
    </div>
  </div>;
};

export default Questionheader;
