import React, { useState, useEffect } from 'react'
import axios from 'axios'


const Tagheader = ({qarray, tag, setPage, sessionId}) => {

  


return (
    <div className='questionHeader'>
      <div className="numQ-questions">
        <h1>Questions with [{tag}]</h1>
        <p>{qarray.length} Results</p>
      </div>
      <div className="buttonsDiv">
      {sessionId != "guest" && (
        <button className='askQ' onClick={()=>setPage('questionForm')}>Ask Question</button>
      )}
      {sessionId == "guest" && (
        <button className="loginButton" onClick={()=>setPage("login")}>Login</button>
      )}
      </div>
    </div>
  )
}
export default Tagheader;
