import React, { useState, useContext } from 'react';
import './Login.css';
import './SignIn.css';
import { Link, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function SignIn() {
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const { SignIn, authUser, signInError, clearError }= useContext(AuthContext);

  if(authUser) return <Redirect to="/timeline"/>

  const handleSubmit = (e) => {
    e.preventDefault();
    SignIn(email, password);
  }

  return (
    <section className="login">
      <div className="signin">
        <form onSubmit={handleSubmit}>
          {signInError? (
            <span className="errorMsg">{signInError}</span>
          ) : (
            null
          )}
          <h1 className="login__logo">Outstagramm</h1>
          <input type="text" id="email" placeholder="Email" value={email} 
          onChange={(e) => { 
            clearError()
            setEmail(e.target.value)
          }} autoComplete="true"/>
          <input type="password" id="password" placeholder="Password" value={password}
           onChange={(e) => {
              clearError()
              setPassword(e.target.value)
            }} autoComplete="true"/>
          <button type="submit">Sign In</button>
          <span>No account yet? <Link to="/signup">Sign Up</Link> </span>
        </form>
      </div>
    </section>
  )
}

export default SignIn
