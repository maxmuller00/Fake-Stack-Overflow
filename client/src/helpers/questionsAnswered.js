import React from 'react'

const QuestionsAnswered = ({questions, setPage, setModifyAnswers}) => {

    handleClick = (questionId) => {
        
    }

  return (
    <div>
    {questions.map((question) => (
        <div key={question._id} className="flexDiv">
          <div className="titleDiv">
            <button className='qTitle'onClick={() => handleClick(question._id)}>{question.title}</button>
            <CreateTagForQuestion tagIds={question.tags} qid={question._id} />
          </div>
        </div>
    ))}
    </div>
  )
}

export default QuestionsAnswered