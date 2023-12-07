import React, {useState, useEffect} from 'react'
import axios from 'axios'
import QuestionsAnswered from '../helpers/questionsAnswered';
import QuestionsAsked from '../helpers/questionsAsked';
import TagsCreated from '../helpers/tagsCreated';

const UserPage = ({sessionUser, setSessionUser, updatePage, setEntryId, setEntryType}) => {

    

    const[currentView, setCurrentView] = useState(1);

    const handleClick = (num) => {
        setCurrentView(num);
    } 

  return (
    <div>
        <p>Reputation: {sessionUser.reputation}</p>
        <p>Member since: {sessionUser.created_at}</p>
        <button onClick={()=>handleClick(1)}>Your Questions</button>
        <button onClick={()=>handleClick(2)}>Questions Answered</button>
        <button onClick={()=>handleClick(3)}>Tags Created</button>
        {/*{currentView == 1 && (
            <QuestionsAnswered />
        )}
        {currentView == 2 && (
            <QuestionsAsked 
                
            />
        )}
        {currentView == 3 && (
            <TagsCreated />
        )}*/}
    </div>
  )
}

export default UserPage