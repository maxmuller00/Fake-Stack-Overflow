import React, { useState, useEffect } from 'react';
import axios from 'axios';
import extractLink from '../helpers/extractLink';
import formatQuestionMetadata from '../helpers/formatQuestionMetadata';

const ModifyAnswerContainer = ({ modifyAnswerQ, setPage, setEntryId, setEntryType, sessionUser }) => {
  const [topAnswers, setTopAnswers] = useState([]);
  const [otherAnswers, setOtherAnswers] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    console.log(modifyAnswerQ._id);
    axios.get(`http://localhost:8000/posts/answers/getAnswersForQuestion/${modifyAnswerQ._id}`)
      .then((res) => {
        setAnswers([...res.data]);
      })
      .catch((error) => {
        console.error('Error fetching answers:', error);
      });
  }, [modifyAnswerQ]);

  useEffect(() => {
    // Filtering top answer and other answers
    const userAnswers = answers.filter((answer) => answer.ans_by === sessionUser.userId);
    const otherUserAnswers = answers.filter((answer) => answer.ans_by !== sessionUser.userId);

    if (userAnswers.length > 0) {
      setTopAnswers(userAnswers); // Assuming only one top answer per user for a question
      setOtherAnswers(otherUserAnswers);
    } else {
      setTopAnswers([]);
      setOtherAnswers(answers); // Set all answers if user hasn't answered
    }
  }, [answers, sessionUser.userId]);

  const handleClick = (entryId) => {
    setEntryId(entryId);
    setEntryType('Answer');
    setPage('modify');
  };

  if(topAnswers.length === 0){
    return(
      <div>
        <div>
        <p>OTHER ANSWERS</p>
        {otherAnswers.map((ans) => (
          <div key={ans._id} className="flexDiv">
            <div className="textDiv2">
              <p>{extractLink(ans.text)}</p>
            </div>
            <div className="answeredByDiv">
              <p>
                {ans.ans_by_name} answered on{' '}
                {formatQuestionMetadata(new Date(ans.ans_date_time))}
              </p>
            </div>
          </div>
        ))}
      </div>
      </div>
    )
  }

  return (
    <div>
        <p>YOUR ANSWER</p>
        {topAnswers.map((topAnswer) => (
          <div>
            <div className="flexDiv">
            <div className="textDiv2">
              <p>{extractLink(topAnswer.text)}</p>
            </div>
            <div className="answeredByDiv">
              <p>
                {topAnswer.ans_by_name} answered on{' '}
                {formatQuestionMetadata(new Date(topAnswer.ans_date_time))}
              </p>
            </div>
            <button onClick={() => handleClick(topAnswer._id)}>MODIFY</button>
          </div>
      </div>
        ))}
          
      <div>
        <p>OTHER ANSWERS</p>
        {otherAnswers.map((ans) => (
          <div key={ans._id} className="flexDiv">
            <div className="textDiv2">
              <p>{extractLink(ans.text)}</p>
            </div>
            <div className="answeredByDiv">
              <p>
                {ans.ans_by_name} answered on{' '}
                {formatQuestionMetadata(new Date(ans.ans_date_time))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModifyAnswerContainer;
