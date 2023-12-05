import React, {useState, useEffect} from 'react'
import axios from 'axios'
import QuestionsAnswered from '../helpers/questionsAnswered';
import QuestionsAsked from '../helpers/questionsAsked';
import TagsCreated from '../helpers/tagsCreated';

const UserPage = ({sessionId, setSessionId, updatePage, setEntryId, setEntryType}) => {

    

    const user = axios.get();//add route here
    const questionsAsked = axios.get();//
    const questionsAnswered = axios.get();//
    const tagsCreated = axios.get();//

    const[currentView, setCurrentView] = useState(1);

    const handleClick = (num) => {
        setCurrentView(num);
    } 

  return (
    <div>
        <p>Reputation: {/*user.reputation*/}</p>
        <p>Member since: {/*user.startDate*/}</p>
        <button onClick={handleClick(1)}>Your Questions</button>
        <button onClick={handleClick(2)}>Questions Answered</button>
        <button onClick={handleClick(3)}>Tags Created</button>
        {currentView == 1 && (
            <QuestionsAnswered />
        )}
        {currentView == 2 && (
            <QuestionsAsked 
                
            />
        )}
        {currentView == 3 && (
            <TagsCreated />
        )}
    </div>
  )
}

export default UserPage