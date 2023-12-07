import React, { useState, useEffect} from 'react'
import axios from 'axios'

const Register = ({updatePage}) => {

    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        verPass: '',
      });

    const [errors, setErrors] = useState({
        username: false,
        email: false,
        password: false,
        verPass: false,
        register: false,
    })

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData({
            ...userData,
            [name]: value,
        });

        setErrors({
            ...errors,
            [name]: false,
        });
    };

    let checkError = '';

    function validateEmailAndPassword(email, password, username) {
        // Email validation regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
        // Check if the email matches the valid pattern
        const isEmailValid = emailRegex.test(email);
      
        if (!isEmailValid) {
          return false;
        }
      
        // Check if the password contains the username or email ID
        if (password.includes(username) || password.includes(email.split('@')[0])) {
          return false;
        }
        return true;
    }

    const handleClick = () => {
        updatePage("welcome");
    }

    const handleSubmit = (event) => {
        //prevent render
        event.preventDefault();

        //create carrier for errors
        const newErrors = {};

        //validate fields
        if (userData.username.length === 0) {
            newErrors.username = true;
        }
        if (userData.email.length === 0) {
            newErrors.email = true;
        }
        if (userData.password.length === 0) {
            newErrors.password = true;
        }
        if (userData.verPass != userData.password) {
            newErrors.verPass = true;
        }
        if(!validateEmailAndPassword(userData.email, userData.password, userData.username)){
            newErrors.register = true;
        }

        //set all error fields
        setErrors(newErrors);

        if (Object.values(newErrors).every((error) => !error)) {
            // If there are no errors, you can submit the form
            // and perform further actions here
            const newUser = {
              username: userData.username,
              email: userData.email,
              password: userData.password,
            }
            //need route for adding user to db          
            axios.post(`http://localhost:8000/posts/users/register`, newUser).then(response => {
                const msg = response.data;
                if(msg !== 'success'){
                    checkError = "An account with these credentials already exists.";
                }
                else {
                    updatePage("login");
                }
            }).catch(error => {
                console.error(error);
            })
          }
    }

  return (
    <div className='registerForm'>
        <form className='register' id='rForm' onSubmit={handleSubmit}>

            <h1>Username</h1>
            <span id="usernameError" className={errors.username ? 'error' : 'hidden'}>Username not filled in</span>
            <input></input>
            <h1>Email</h1>
            <span id="emailError" className={errors.email ? 'error' : 'hidden'}>Email not filled in</span>
            <input></input>
            <h1>Password</h1>
            <span id="passwordError" className={errors.password ? 'error' : 'hidden'}>Password not filled in</span>
            <input></input>
            <h1>Verify Password</h1>
            <span id="verPassError" className={errors.verPass ? 'error' : 'hidden'}>Password must match</span>
            <input></input>
            <input id="post" type="submit" value="Register"></input>
            <span id="registerError" className={errors.register ? 'error' : 'hidden'}>Either the email you entered is not valid
            or the password contains the email Id or username</span>
            <span id="checkError">{checkError}</span>
            <button onClick={() => handleClick}>Back to Welcome</button>

        </form>
    </div>
  )
}

export default Register