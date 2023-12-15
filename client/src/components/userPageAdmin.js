import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionsAnswered from '../helpers/questionsAnswered';
import QuestionsAsked from '../helpers/questionsAsked';
import TagsCreated from '../helpers/tagsCreated';
import formatQuestionMetadata from '../helpers/formatQuestionMetadata';

const UserPageAdmin = ({ chosenUser, setChosenUser, updatePage, setEntryId, setEntryType, setModifyAnswerQ }) => {
  const [userAnswers, setUserAnswers] = useState([]);
  const [userQuestions, setUserQuestions] = useState([]);
  const [userTags, setUserTags] = useState([]);

  const getUserQuestions = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/posts/questions/byUser/${chosenUser._id}`);
      setUserQuestions(response.data);
    } catch (error) {
      // Handle error
      console.error('Error fetching user questions:', error);
    }
  };

  const getUserAnswers = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/posts/answers/getAnswered/${chosenUser._id}`);
      setUserAnswers(response.data);
    } catch (error) {
      // Handle error
      console.error('Error fetching user answers:', error);
    }
  };

  const getUserTags = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/posts/tags/getUser/${chosenUser._id}`);
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
  }, [chosenUser._id]); // Make sure to include dependencies if necessary

  const [currentView, setCurrentView] = useState(1);

  const handleClick = (num) => {
    setCurrentView(num);
  };

  return (
    <div>
      <h1>{chosenUser.username}</h1>
      <p>Reputation: {chosenUser.reputation}</p>
      <p>Member since: {formatQuestionMetadata(new Date(chosenUser.created_at))}</p>
      <button onClick={() => handleClick(2)}>Questions Asked</button>
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

export default UserPageAdmin;