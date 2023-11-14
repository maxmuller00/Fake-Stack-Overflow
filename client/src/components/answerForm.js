import React, { useState, useEffect } from 'react'
import axios from 'axios'

const AnswerForm = ({currentQ, currentPage, setPage, setCurrentQ}) => {

  const [question, setCurrentQuestion] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);

  useEffect(() => {
    console.log("CURRENT QUESTION ", currentQ);
    axios.get(`http://localhost:8000/posts/questions/${currentQ._id}`)
      .then(response => {
        setCurrentQuestion(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // Fetch answers from the answers router
    axios.get(`http://localhost:8000/posts/answers`)
      .then(response => {
        setAllAnswers(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const [formData, setFormData] = useState({
    text: '',
    username: '',
  });

  const [errors, setErrors] = useState({
    text: false,
    username: false, 
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: false,
    });

  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = {}
    if (formData.username.length === 0) {
      newErrors.username = true;
    }
    if (formData.text.length === 0) {
      newErrors.text = true;
    }

    async function addAnswerAsync(newAnswer) {
      await axios.post('http://localhost:8000/posts/answers/answerQuestion', newAnswer);
      console.log('Answer form submitted:', formData);
      await axios.get(`http://localhost:8000/posts/questions/${currentQ._id}`)
      .then(response => {
        console.log(response.data);
        setCurrentQ(response.data);
      });
      setPage('openQuestion');
    }

    
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => !error)) {
      // If there are no errors, you can submit the form
      // and perform further actions here
      const newAnswer = {
        qid : question._id,
        text: formData.text,
        ans_by: formData.username,
        ans_date_time: new Date(),
      }
      addAnswerAsync(newAnswer);
    }
  };

  return (
    <div className='answerFormDiv'>
      <form className='answerForm' onSubmit={handleSubmit}>
        <h1>Username*</h1>
        <span id="error5" className={errors.username ? 'error' : 'hidden'}>Enter username</span>
        <input type="text" name="username" value={formData.username} onChange={handleInputChange}></input>


        <h1>Answer Text*</h1>
        <span id="error6" className={errors.text ? 'error' : 'hidden'}>Enter answer text</span>
        <input type="text" name="text" value={formData.text} onChange={handleInputChange}></input>
        <br></br>
        <input id="post" type="submit" value="Post"></input> 
        <br></br>
        <p>* indicates a mandatory field</p>
      </form>
    </div>
  )
}

export default AnswerForm
