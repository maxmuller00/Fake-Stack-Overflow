import React from 'react';
import UserList from './userList';
import formatQuestionMetadata from '../helpers/formatQuestionMetadata';

const AdminPage = ({ sessionUser, setPage, setChosenUser }) => {
  return (
    <div>
      <p>Member since: {formatQuestionMetadata(new Date(sessionUser.created_at))}</p>
      <p>Reputation Score: {sessionUser.reputation}</p>
      <UserList 
        setPage={setPage}
        sessionUser={sessionUser}
        setChosenUser={setChosenUser}
      />
    </div>
  );
};

export default AdminPage;
