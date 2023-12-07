import React from 'react'

const QuestionsAnswered = ({questions, setPage, setModifyAnswers}) => {

    const handleClick = (questionId) => {
        return;
    }

  return (
    <div>
    {questions.map((question) => (
        <div key={question._id} className="flexDiv">
          <div className="titleDiv">
            <button className='qTitle'onClick={() => handleClick(question._id)}>{question.title}</button>
          </div>
        </div>
    ))}
    </div>
  )
}

export default QuestionsAnswered