import React, { useState } from "react";
import Questionform from "./questionForm";
import QuestionList from "./questionList";
import Questionheader from "./questionheader";
import AnswerForm from "./answerForm";
import Answerheader from "./answerheader";
import TagsPage from "./tagsPage";
import Searchheader from "./searchheader";
import SearchList from "./searchList";
import TagHeader from "./tagHeader.js";
import axios from 'axios';

const MainPage = ({currentPage, updatePage, currentQ, setCurrentQ, currentQstnArray, setQstnArray, currentSearch, setCurrentSearch, tagId, setTagId,tagName,setTagName}) => {
  /*const [currentQstnArray, setQstnArray] = useState(model.getAllQstns())

  const updateQstnArray = (array) => {
    setQstnArray(array);
  }*/



  return (
    <div className="main">
      {/*home display, shows all questions */}
      {currentPage === "allQuestions" && (
        <Questionheader
          qarray={currentQstnArray}
          updateQstnArray={setQstnArray}
          currentPage={currentPage}
          setPage={updatePage} //changed from setCurrentPage
        />
      )}

      {currentPage === "allQuestions" && (
        <QuestionList
          qarray={currentQstnArray}
          currentPage={currentPage}
          setPage={updatePage}
          currentQ={currentQ}
          setCurrentQ={setCurrentQ}
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
          tag={tagName}
          setPage={updatePage}
        />
      )}

      {/*Question form */}
      {currentPage === "questionForm" && (
        <Questionform
          currentPage={currentPage}
          setPage={updatePage}
          updateQstnArray={setQstnArray}
        />
      )}
      {/*Answer Form */}
      {currentPage === "answerForm" && <AnswerForm 
        currentQ = {currentQ}
        currentPage = {currentPage}
        setPage = {updatePage}
        setCurrentQ={setCurrentQ}
      />}
      {/*Once a question has been opened */}
      {currentPage === "openQuestion" && (
        <Answerheader
          qid={currentQ}
          currentPage={currentPage}
          setPage={updatePage}
          currentQ={currentQ}
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
          setTagName={setTagName}
            
        />
      )}
    </div>
  );
};

export default MainPage;
