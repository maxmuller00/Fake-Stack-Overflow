import React, { useState } from 'react'
import Searchbar from './searchbar'

const header = ({currentSearch, setCurrentSearch, currentQstnArray, setQstnArray, currentPage, setCurrentPage, setTagId}) => {
  return (
    <div className="headerDiv">
        <h1>Fake StackOverFlow</h1>
        <Searchbar 
          currentSearch={currentSearch}
          setCurrentSearch={setCurrentSearch}
          currentQstnArray={currentQstnArray}
          setQstnArray={setQstnArray}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setTagId={setTagId}
          />
    </div>
  )
}

export default header
