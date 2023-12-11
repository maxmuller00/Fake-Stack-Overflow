import React, {useState, useEffect} from 'react'
import axios from 'axios'
import QuestionsAnswered from '../helpers/questionsAnswered';
import QuestionsAsked from '../helpers/questionsAsked';
import TagsCreated from '../helpers/tagsCreated';
import formatQuestionMetadata from '../helpers/formatQuestionMetadata';

const UserPage = ({sessionUser, setSessionUser, updatePage, setEntryId, setEntryType}) => {

    async function getUserAnswers() {
        const response = await axios.get(`http://localhost:8000/posts/questions/byUser/${sessionUser.userId}`);
        console.log("QUESTIONS ANSWERED: ", response.data);
        console.log("TYPE OF: ", typeof(response.data));
        return response.data;
    }

    async function getUserQuestions() {
        const response = await axios.get(`http://localhost:8000/posts/answers/getAnswered/${sessionUser.userId}`);
        console.log("QUESTIONS ASKED: ", response.data);
        console.log("TYPE OF: ", typeof(response.data));
        return response.data;
    }

    async function getUserTags() {
        const response = await axios.get(`http://localhost:8000/posts/tags/getUser/${sessionUser.userId}`);
        console.log("TAGS CREATED: ", response.data);
        return response.data;
    }

    const userAnswers = getUserAnswers();
    const userQuestions = getUserQuestions();
    const userTags = getUserTags();

    const[currentView, setCurrentView] = useState(1);

    const handleClick = (num) => {
        setCurrentView(num);
    } 

  return (
    <div>
        <p>Reputation: {sessionUser.reputation}</p>
        <p>Member since: {formatQuestionMetadata(new Date(sessionUser.created_at))}</p>
        <button onClick={()=>handleClick(2)}>Your Questions</button>
        <button onClick={()=>handleClick(1)}>Questions Answered</button>
        <button onClick={()=>handleClick(3)}>Tags Created</button>
        {currentView === 1 && (
            <QuestionsAnswered 
                questions={userAnswers} 
                setPage={updatePage} 
            />
        )}
        {currentView === 2 && (
            <QuestionsAsked 
                questions={userQuestions}
                setPage={updatePage}
                setEntryId={setEntryId} 
                setEntryType={setEntryType}
            />
        )}
        {/*{currentView == 3 && (
            <TagsCreated />
        )}*/}
    </div>
  )
}

export default UserPage