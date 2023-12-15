import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionsAnswered from '../helpers/questionsAnswered';
import QuestionsAsked from '../helpers/questionsAsked';
import TagsCreated from '../helpers/tagsCreated';
import formatQuestionMetadata from '../helpers/formatQuestionMetadata';

const UserPage = ({ sessionUser, setSessionUser, updatePage, setEntryId, setEntryType, setModifyAnswerQ }) => {
  const [userAnswers, setUserAnswers] = useState([]);
  const [userQuestions, setUserQuestions] = useState([]);
  const [userTags, setUserTags] = useState([]);

  const getUserQuestions = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/posts/questions/byUser/${sessionUser.userId}`);
      setUserQuestions(response.data);
    } catch (error) {
      // Handle error
      console.error('Error fetching user questions:', error);
    }
  };

  const getUserAnswers = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/posts/answers/getAnswered/${sessionUser.userId}`);
      setUserAnswers(response.data);
    } catch (error) {
      // Handle error
      console.error('Error fetching user answers:', error);
    }
  };

  const getUserTags = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/posts/tags/getUser/${sessionUser.userId}`);
      setUserTags(response.data);
    } catch (error) {
      // Handle error
      console.error('Error fetching user tags:', error);
    }
  };

  useEffect(() => {
    getUserQuestions();
    getUserAnswers();
    getUserTags();
  }, [sessionUser.userId]); // Make sure to include dependencies if necessary

  const [currentView, setCurrentView] = useState(1);

  const handleClick = (num) => {
    setCurrentView(num);
  };

  return (
    <div>
      <p>Reputation: {sessionUser.reputation}</p>
      <p>Member since: {formatQuestionMetadata(new Date(sessionUser.created_at))}</p>
      <button onClick={() => handleClick(2)}>Your Questions</button>
      <button onClick={() => handleClick(1)}>Questions Answered</button>
      <button onClick={() => handleClick(3)}>Tags Created</button>
      {currentView === 1 && (
        <QuestionsAnswered questions={userAnswers} setPage={updatePage} setModifyAnswerQ={setModifyAnswerQ}/>
      )}
      {currentView === 2 && (
        <QuestionsAsked
          questions={userQuestions}
          setPage={updatePage}
          setEntryId={setEntryId}
          setEntryType={setEntryType}
        />
      )}
      {currentView === 3 && <TagsCreated tags={userTags} />}
    </div>
  );
};

export default UserPage;