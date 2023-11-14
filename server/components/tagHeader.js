import React, { useState, useEffect } from 'react'
import axios from 'axios'


const Tagheader = ({qarray, tag, setPage}) => {

  


return (
    <div className='questionHeader'>
      <div className="numQ-questions">
        <h1>Questions with [{tag}]</h1>
        <p>{qarray.length} Results</p>
      </div>
      <div className="buttonsDiv">
        <button className='askQ' onClick={()=>setPage('questionForm')}>Ask Question</button>
      </div>
    </div>
  )
}
export default Tagheader;
