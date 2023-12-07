import React, { useState, useEffect } from 'react'
import Header from './header'
import Sidenav from './sidenav'
import MainPage from './mainPage'
import axios from 'axios'

const Fakestackoverflow = () => {

  const [currentPage, setCurrentPage] = useState("welcome");
  const [currentQ, setCurrentQ] = useState("");
  const [currentSearch, setCurrentSearch] = useState({tagSearch: false, search: ''});
  const [currentQstnArray, setQstnArray] = useState([]);
  const [tagId, setTagId] = useState('');
  const [sessionUser, setSessionUser] = useState("guest");

  const updateTagId = (tagId) => {
    setTagId(tagId);
  };

  const updateQstnArray = (array) => {
    console.log("ARRAY ", array);
    setQstnArray(array);
  };

  const updatePage = (newPage) => {
    console.log("new page =");
    console.log(newPage);
    setCurrentPage(newPage);
  };

  const updateQ = (newQ) => {
    setCurrentQ(newQ);
  };  

  {/*useEffect(() => {
    // Fetch questions from the questions router
    //axios.get('http://localhost:8000/posts/questions?sort=newest?tags=a,b,c,d?datestart=1234567?dateend=1234567.......')
    axios.get('http://localhost:8000/posts/questions/newest')
      .then(response => {
        setQstnArray(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);*/}

  return (
    <div className='fakeContainer'>
        <Header
            currentSearch={currentSearch}
            setCurrentSearch={setCurrentSearch}
            currentQstnArray={currentQstnArray}
            setQstnArray={updateQstnArray}
            currentPage={currentPage}
            setCurrentPage={updatePage}
            setTagId={updateTagId}
        />
        <div className="mainContent">
            <Sidenav
                currentPage={currentPage} 
                updatePage={updatePage}
                currentQstnArray={currentQstnArray}
                setQstnArray={updateQstnArray}
            />
            <MainPage 
                currentPage={currentPage} 
                updatePage={updatePage} 
                currentQ={currentQ} 
                setCurrentQ={setCurrentQ}
                currentQstnArray ={currentQstnArray}
                setQstnArray={updateQstnArray}
                currentSeach={currentSearch}
                setCurrentSearch={setCurrentSearch}
                tagId={tagId}
                setTagId={updateTagId}
                sessionId={sessionUser}
                setSessionId={setSessionUser}
                />
        </div>
    </div>
  )
}

export default Fakestackoverflow
