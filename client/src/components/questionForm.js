import React, { useState, useEffect } from 'react';
import '../stylesheets/questionForm.css';
import validateLinks from '../helpers/validateLinks.js';
import axios from 'axios'

const Questionform = ({currentPage, setPage, updateQstnArray, sessionUser}) => {

  const [questions, setQuestions] = useState([]);
  const [allTags, setAllTags] = useState([]);
  //const user = axios.get()._id
  

  useEffect(() => {
    // Fetch answers from the questions router
    axios.get(`http://localhost:8000/posts/questions/newest`)
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // Fetch tags from the questions router
    axios.get('http://localhost:8000/posts/tags')
      .then(response => {
        console.log("CHECKING TAGS");
        console.log(response.data);
        setAllTags(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    text: '',
    tags: '',
  });

  const [errors, setErrors] = useState({
    title: false,
    text: false,
    tags: false,
    tags2: false,
    tags3: false,
    link: false,
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
    if (formData.title.length > 100 || formData.title.length === 0) {
      newErrors.title = true;
    }
    if (formData.text.length === 0) {
      newErrors.text = true;
    }
    if(validateLinks(formData.text)){
      newErrors.link = true;
    }
    if (formData.tags.length === 0) {
      newErrors.tags = true;
    }
    const words = formData.tags.split(' ');
    if(words.length >= 6){
     newErrors.tags2 = true;
    }
    for (const word of words) {
    if(word.length > 11){
    newErrors.tags3 = true;
    }
    }


    function createTag(tag){
      const newTag = {
        name : tag,
        qNum : 1
      }
      axios.post('http://localhost:8000/posts/tags/addNewTag', newTag).then(response => {
        console.log('New Tag succesfully created: ', response.data);
      })
      .catch(error => {
        console.error('Error: ', error);
      });
      return newTag;
    }

    function checkTag(name) {
     for (let i = 0; i < allTags.length; i++){
        if (allTags[i].name.toLowerCase() === name.toLowerCase()){
             return true;
            }
     }
      return false;
     }

    
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => !error)) {
      // If there are no errors, you can submit the form
      // and perform further actions here
      const newQuestion = {
        title: formData.title,
        text: formData.text,
        tags: [],
        asked_by : sessionUser.username,
        ask_date_time: new Date(),
        answers: [],
        views: 0,
      }
      const words = formData.tags.split(' ');
      for(let i = 0; i < words.length; i++){
        if(checkTag(words[i].toLowerCase())){
          let tagName;
          //change to iterate through allTags
          for (let j = 0; j < allTags.length; j++) {
            console.log(allTags[j].name);
            if (allTags[j].name.toLowerCase() === words[i].toLowerCase()) {
              tagName = allTags[j].name;
            }
          }
          console.log("TagName ",tagName);
          newQuestion.tags.push(tagName);
        } else {
          const newTag = createTag(words[i].toLowerCase());
          newQuestion.tags.push(newTag.name);
        }
      }
      
      axios
        .post('http://localhost:8000/posts/questions/askQuestion', newQuestion, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(() => {
          axios.get('http://localhost:8000/posts/questions/newest').then(response => {
            updateQstnArray(response.data);
            console.log("Succesfully submitted form and upated array");
            setPage('allQuestions');
          });
        }).catch(error => {
          console.error(error);
        });
    }
  };

  return (
    <div className='questionForm'>
        <form className="quest" id="qForm" onSubmit={handleSubmit}>

            <h1>Question Title*</h1>
            <h4 id="titleError">Limit title to 100 chacter max</h4>
            <span id="error1" className={errors.title ? 'error' : 'hidden'}>Title must be between 1 and 100 characters</span>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange}></input>


            <h1>Question Text*</h1>
            <h4 id="textError"> Add Details</h4>
            <span id="error2" className={errors.text ? 'error' : 'hidden'}>Please provide question text.</span>
            <span id="errorc2" className={errors.link ? 'error' : 'hidden'}>The text 'inbetween' () cannot be empty and must begin 'with' https:\\\\ or “http:\\\\</span>
            <input type="text" name="text" value={formData.text} onChange={handleInputChange}></input>


            <h1>Tags*</h1>
            <h4 id="tagError"> Add keywords seperated by a space</h4>
            <span id="error3" className={errors.tags ? 'error' : 'hidden'}>Please enter at least one tag</span>
            <span id="errort4" className={errors.tags2 ? 'error' : 'hidden'}>Please enter at most 5 tags.</span>
            <span id="errort5" className={errors.tags3 ? 'error' : 'hidden'}>Make sure all tags are 10 chacters or less.</span>
            <input type="text" name="tags" value={formData.tags} onChange={handleInputChange}></input>


            {/*<h1>Username*</h1>
            <span id="error4" className={errors.username ? 'error' : 'hidden'}>Enter a username</span>
            <input type="text" name="username" value={formData.username} onChange={handleInputChange}></input>*/}

            <br></br>
            <input id="post" type="submit" value="Post"></input>
            <br></br>
            <span id="requiredMess">* indicates mandatory field </span>

        </form>
    </div>
  )
}

export default Questionform
