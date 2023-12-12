import React, {useState, useEffect} from 'react'
import axios from 'axios'
import QuestionsAnswered from '../helpers/questionsAnswered';
import QuestionsAsked from '../helpers/questionsAsked';
import TagsCreated from '../helpers/tagsCreated';
import formatQuestionMetadata from '../helpers/formatQuestionMetadata';

const userList = ({ }) => {
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/users/admin`).then(async (res) => {
      setUsersList([...res.data]);
    });
  }, []);
 async function deleteUser(user) {
      const deleteUser = user.userId;
      axios.delete(`http://localhost:8000/users/deleteUser/${deleteUser}`).then(async (res) => {
            if (res.data === 'success') {
              const updatedUsersList = usersList.filter((user) => user._id !== userToDelete);
              setUsersList(updatedUsersList);
            }
            else{
              
            }
          });
        }

    
  return (
    <div className='userDiv'>
    {userList.map((user) => (
        <div key={user._id} className="flexDiv">
          <div className="user-container">
              <h2
                onClick={() => {
                 setPage(); // set page to that user page
                }}
              >
                {user._id === userSession.userId ? user.username + ' (User Account)' : user.username}
              </h2>
              <button disabled={user._id === userSession.userId} onClick={deleteUser}>
                Delete
              </button>
            </div>
  
        </div>
    ))}
      </div>
);}

export default UserList
