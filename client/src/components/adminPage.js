import React, {useState, useEffect} from 'react'
import axios from 'axios'
import QuestionsAnswered from '../helpers/questionsAnswered';
import QuestionsAsked from '../helpers/questionsAsked';
import UserList from './userList';
import formatQuestionMetadata from '../helpers/formatQuestionMetadata';

const adminPage = ({ }) => {
  

    
  return (
    <div>
        <p>Member since: {formatQuestionMetadata(new Date(sessionUser.created_at))}</p>
        <p>Reputation Score: {sessionUser.reputation}</p>
        <UserList>
  </div>
     
);
}

export default AdminPage
