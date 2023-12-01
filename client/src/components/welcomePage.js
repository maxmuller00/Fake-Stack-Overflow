import React, { useState, useEffect} from 'react'
import axios from 'axios'

 const WelcomePage = ({updatePage}) => {

    handleClick = (page) => {
        updatePage(page);
    }

  return (
    <div>
        <div>
            <h1>Welcome to Fake Stack Overflow!</h1>
        </div>
        <div>
            <button onClick={handleClick("login")}>Login</button>
            <button onClick={handleClick("register")}>Register</button>
            <button onClick={handleClick("allQuestions")}>Continue as Guest</button>
        </div>
    </div>
  )
}

export default WelcomePage


