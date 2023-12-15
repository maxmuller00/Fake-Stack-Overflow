import React, { useState, useEffect } from "react";
import Questionform from "./questionForm";
import QuestionList from "./questionList";
import Questionheader from "./questionheader";
import AnswerForm from "./answerForm";
import Answerheader from "./answerheader";
import TagsPage from "./tagsPage";
import Searchheader from "./searchheader";
import SearchList from "./searchList";
import TagHeader from "./tagHeader.js";
import WelcomePage from "./welcomePage.js";
import Register from "./register.js";
import LoginPage from "./loginPage.js";
import ModifyForm from "./modifyForm.js";
import UserPage from "./userPage.js";
import CommentForm from "./commentForm.js";
import ModifyAnswerContainer from "./modifyAnswerContainer.js";
import AdminPage from "./adminPage.js";
import UserPageAdmin from "./userPageAdmin.js";
import axios from 'axios';

const MainPage = ({currentPage, updatePage, currentQ, setCurrentQ, currentQstnArray, setQstnArray, currentSearch, setCurrentSearch, tagId, setTagId, sessionId, setSessionId, chosenUser, setChosenUser}) => {

  async function getTagById(tag_Id) {
    const response = await axios.get(`http://localhost:8000/posts/tags/${tag_Id}`);
    return response.data;
  }

  const [entryType, setEntryType] = useState('');
  const [entryId, setEntryId] = useState('');
  const [modAnswerQ, setModAnswerQ] = useState('');
  const [commentType, setCommentType] = useState('');

  useEffect(() => {
    console.log("modAnswerQ ", modAnswerQ);
  }, [modAnswerQ]);


  return (
    <div className="main">

      {currentPage === "welcome" && (
        <WelcomePage 
          updatePage={updatePage}
          sessionUser={sessionId}
        />
      )}

      {currentPage === "register" && (
        <Register 
          updatePage={updatePage}
        />
      )}

      {currentPage === "login" && (
        <LoginPage 
          updatePage={updatePage}
          setSessionUser={setSessionId}
        />
      )}

      {/*home display, shows all questions */}
      {currentPage === "allQuestions" && (
        <Questionheader
          qarray={currentQstnArray}
          updateQstnArray={setQstnArray}
          currentPage={currentPage}
          setPage={updatePage} //changed from setCurrentPage
          sessionId={sessionId}
        />
      )}

      {currentPage === "allQuestions" && (
        <QuestionList
          qarray={currentQstnArray}
          currentPage={currentPage}
          setPage={updatePage}
          currentQ={currentQ}
          setCurrentQ={setCurrentQ}
          setQstnArray={setQstnArray}
        />
      )}
      {/*Search Header */}
      {currentPage === "searchQuestions" && (
        <Searchheader 
          qarray={currentQstnArray}
          updateQstnArray={setQstnArray}
          currentPage={currentPage}
          setPage={updatePage} //changed from setCurrentPage
          tagId={tagId}
          sessionId={sessionId}
        />
      )}
      {/*Search List */}
      {currentPage === "searchQuestions" && (
        <SearchList 
          qarray={currentQstnArray} 
          currentPage={currentPage} 
          setPage={updatePage} 
          currentQ={currentQ} 
          setCurrentQ={setCurrentQ}
          setQstnArray={setQstnArray}
        />
      )}
    {/*Search List */}
      {currentPage === "tagQuestions" && (
        <TagHeader
          qarray={currentQstnArray} 
          tag={getTagById(tagId)}
          setPage={updatePage}
          sessionId={sessionId}
        />
      )}

      {/*Question form */}
      {currentPage === "questionForm" && (
        <Questionform
          currentPage={currentPage}
          setPage={updatePage}
          updateQstnArray={setQstnArray}
          sessionUser={sessionId}
        />
      )}
      {/*Answer Form */}
      {currentPage === "answerForm" && <AnswerForm 
        currentQ = {currentQ}
        currentPage = {currentPage}
        setPage = {updatePage}
        setCurrentQ={setCurrentQ}
        sessionId={sessionId}
      />}
      {/*Once a question has been opened */}
      {currentPage === "openQuestion" && (
        <Answerheader
          qid={currentQ}
          currentPage={currentPage}
          setPage={updatePage}
          currentQ={currentQ}
          sessionId={sessionId}
          setEntryId={setEntryId}
          setEntryType={setEntryType}
        />
      )}
      {/*Tags Page*/}
      {currentPage === "allTags" && (
        <TagsPage 
          updatePage={updatePage}
          setSearch={setCurrentSearch} 
          currentSearch={currentSearch}
          updateQstnArray={setQstnArray}
          currentQstnArray={currentQstnArray}
          setTagId={setTagId}
        />
      )}

      {currentPage === "modify" && (
        <ModifyForm 
          entryId={entryId}
          type = {entryType}
          setPage={updatePage}
          sessionUser={sessionId}
        />
      )}

      {currentPage === 'modAnswer' && (
        <ModifyAnswerContainer 
          modifyAnswerQ={modAnswerQ} 
          setPage={updatePage} 
          setEntryId={setEntryId}
          setEntryType={setEntryType}
          sessionUser={sessionId}
        />
      )}

      {currentPage === "userPage" && (
        <UserPage 
          setEntryId={setEntryId}
          setEntryType={setEntryType}
          updatePage={updatePage}
          sessionUser={sessionId}
          setSessionUser={setSessionId}
          setModifyAnswerQ={setModAnswerQ}
        />
      )}

      {currentPage === "commentForm" && (
        <CommentForm 
          commentType={entryType}
          toId={entryId} 
          setPage={updatePage}
          sessionUser={sessionId}
        />
      )}

      {currentPage === 'adminPage' && (
        <AdminPage 
          sessionUser={sessionId}
          setPage={updatePage}
          setChosenUser={setChosenUser}
        />
      )}

      {currentPage === 'chosenUser' && (
        <UserPageAdmin
          chosenUser={chosenUser} 
          setChosenUser={setChosenUser}
          updatePage={updatePage}
          setEntryId={setEntryId}
          setEntryType={setEntryType} 
          setModifyAnswerQ={setModAnswerQ}
        />
      )}

    </div>
  );
};

export default MainPage;
