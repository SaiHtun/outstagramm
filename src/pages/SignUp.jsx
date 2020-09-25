import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Login.css';
import './SignUp.css';
import { Link, Redirect } from 'react-router-dom';

function SignUp() {
  const [ username, setUsername ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const { SignUp, authUser, signUpError, clearError } = useContext(AuthContext);
  

  if(authUser) return <Redirect to="/timeline"/>

  const handleSignUp = (e) => {
    e.preventDefault();
    // error handling
    SignUp(email, password, username);
  }


  return (
    <section className="login">
      <div className="signup">
        <form onSubmit={handleSignUp}>
        {signUpError? (
          <span className="errorMsg">{signUpError}</span>
        ) : (
          null
        )}
          <h1 className="login__logo">Outstagramm</h1>
          <input type="text" id="username" placeholder="Username" value={username} 
          onChange={(e) => { 
            clearError();
            setUsername(e.target.value);
          }} autoComplete="true"/>
          <input type="text" id="email" placeholder="Email" value={email} 
          onChange={(e) => { 
            clearError();
            setEmail(e.target.value) 
          }} autoComplete="true"/>
          <input type="password" id="password" placeholder="Password" value={password} 
          onChange={(e) => { 
            clearError();
            setPassword(e.target.value) 
          }} autoComplete="true"/>
          <button type="submit">Sign Up</button>
          <span>Already have an account? <Link to="/signin">Sign In</Link> </span>
        </form>
      </div>
    </section>
  )
}

export default SignUp
