import React, { useState, useEffect} from 'react'

const LoginPage = ({updatePage, setSessionId}) => {

    const [loginData, setloginData] = useState({
        username: '',
        password: '',
      });

    const [errors, setErrors] = useState({
        username: false,
        password: false,
        login: false,
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

    const handleClick = () => {
        updatePage("welcome");
    }

    const handleSubmit = (event) => {
        //prevent render
        event.preventDefault();

        //create carrier for errors
        const newErrors = {};

        //validate fields
        if (loginData.username.length === 0) {
            newErrors.username = true;
        }
        if (loginData.password.length === 0) {
            newErrors.password = true;
        }
        if(!validateUser(loginData.username, loginData.password)){
            newErrors.login = true;
        }

        //set all error fields
        setErrors(newErrors);

        if (Object.values(newErrors).every((error) => !error)) {
            // If there are no errors, you can submit the form
            // and perform further actions here
            const newUser = {
              username: userData.username,
              password: userData.password,
            }
            //need route for getting user info from db          
            //axios.get('.../newUser)
            setSessionId(user._id);
            updatePage("allQuestions");
          }
    }

    return (
        <div className='loginForm'>
            <form className='login' id='lForm' onSubmit={handleSubmit}>
    
                <h1>Username</h1>
                <span id="usernameError" className={errors.username ? 'error' : 'hidden'}>Username not filled in</span>
                <input></input>
                <h1>Password</h1>
                <span id="passwordError" className={errors.password ? 'error' : 'hidden'}>Password not filled in</span>
                <input></input>
                <input id="post" type="submit" value="Login"></input>
                <span id="loginError" className={errors.login ? 'error' : 'hidden'}>The username or password you entered is invalid</span>
                <button onClick={handleClick}>Back to Welcome</button>
    
            </form>
        </div>
      )
    }

export default LoginPage