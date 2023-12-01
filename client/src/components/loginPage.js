import React, { useState, useEffect} from 'react'

const LoginPage = ({updatePage, setSessionId}) => {

    const [loginData, setloginData] = useState({
        email: '',
        password: '',
      });

    const [errors, setErrors] = useState({
        email: false,
        password: false,
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
        if (loginData.email.length === 0) {
            newErrors.email = true;
        }
        if (loginData.password.length === 0) {
            newErrors.password = true;
        }

        //set all error fields
        setErrors(newErrors);

        if (Object.values(newErrors).every((error) => !error)) {
            // If there are no errors, you can submit the form
            // and perform further actions here
            const newUser = {
              email: userData.email,
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
    
                <h1>Email</h1>
                <span id="emailError" className={errors.username ? 'error' : 'hidden'}>Email not filled in</span>
                <input></input>
                <h1>Password</h1>
                <span id="passwordError" className={errors.password ? 'error' : 'hidden'}>Password not filled in</span>
                <input></input>
                <input id="post" type="submit" value="Login"></input>
                <span id="loginError" className={errors.login ? 'error' : 'hidden'}>The email or password you entered is invalid</span>
                <button onClick={handleClick}>Back to Welcome</button>
    
            </form>
        </div>
      )
    }

export default LoginPage