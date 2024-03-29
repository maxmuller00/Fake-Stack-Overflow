import React, { useState, useEffect} from 'react'
import axios from 'axios'

const LoginPage = ({updatePage, setSessionUser}) => {

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
      });

    const [errors, setErrors] = useState({
        email: false,
        password: false,
    })

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });

        setErrors({
            ...errors,
            [name]: false,
        });
    };

    let loginError = '';


    const handleClick = () => {
        console.log("Triggered");
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
              email: loginData.email,
              password: loginData.password,
            }
            let user;
            axios.post(`http://localhost:8000/users/login`, newUser, {withCredentials: true}).then(response => {
                user = response.data;
                console.log(user);
                if(typeof(user) === 'string'){
                    loginError = user;
                }
                else {
                    setSessionUser(user);
                    updatePage("allQuestions");
                }
            })
          }
    }

    return (
        <div className='loginForm'>
            <form className='login' id='lForm' onSubmit={handleSubmit}>
    
                <h1>Email</h1>
                <span id="emailError" className={errors.username ? 'error' : 'hidden'}>Email not filled in</span>
                <input type="text" name="email" value={loginData.email} onChange={handleInputChange}></input>
                <h1>Password</h1>
                <span id="passwordError" className={errors.password ? 'error' : 'hidden'}>Password not filled in</span>
                <input type="text" name="password" value={loginData.password} onChange={handleInputChange}></input>
                <input id="post" type="submit" value="Login"></input>
                <span id="loginError">{loginError}</span>
            </form>
            <div>
                <button onClick={handleClick}>Back to Welcome</button>
            </div>
        </div>
      )
    }

export default LoginPage