import React, { useState, useEffect } from 'react';
import axios from 'axios';
import formatQuestionMetadata from '../helpers/formatQuestionMetadata';

const UserList = ({ setPage, sessionUser, setChosenUser }) => {
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/users/admin`).then(async (res) => {
      setUsersList([...res.data]);
    });
  }, []);

  async function deleteUser(userId) {
    axios.delete(`http://localhost:8000/users/deleteUser/${userId}`).then(async (res) => {
      if (res.data === 'success') {
        const updatedUsersList = usersList.filter((user) => user._id !== userId);
        setUsersList(updatedUsersList);
      } else {
        console.log("Unsuccessfully retrieved data");
      }
    });
  }

  async function goToUserPage(userId){
    axios.get(`http://localhost:8000/users/getUserData/${userId}`).then(async (res) => {
      const chosenUser = res.data;
      setChosenUser(chosenUser);
      console.log("Successfully heading to user page: ", chosenUser);
      setPage('chosenUser');
    });
  }

  return (
    <div className='userDiv'>
      {usersList.map((user) => (
        <div key={user._id} className="flexDiv">
          <div className="user-container">
            <h2
              onClick={() => goToUserPage(user._id)}
            >
              {user._id === sessionUser.userId ? user.username + ' (User Account)' : user.username}
            </h2>
            <button disabled={user._id === sessionUser.userId} onClick={() => deleteUser(user._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;

