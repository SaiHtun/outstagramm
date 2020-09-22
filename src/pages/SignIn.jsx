import React, { useState, useContext } from 'react';
import './Login.css';
import './SignIn.css';
import { Link, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function SignIn() {
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const { SignIn, authUser }= useContext(AuthContext);

  if(authUser) return <Redirect to="/timeline"/>

  const handleSubmit = (e) => {
    e.preventDefault();
    SignIn(email, password);
  }

  return (
    <section className="login">
      <div className="signin">
      <form onSubmit={handleSubmit}>
        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="instagram"/>
        <input type="text" id="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }}/>
        <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }}/>
        <button type="submit">Sign In</button>
        <span>No account yet? <Link to="/signup">Sign Up</Link> </span>
      </form>
    </div>
    </section>
  )
}

export default SignIn
