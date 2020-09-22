import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Login.css';
import './SignUp.css';
import { Link, Redirect } from 'react-router-dom';

function SignUp() {
  const [ username, setUsername ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const { SignUp, authUser } = useContext(AuthContext);

  if(authUser) return <Redirect to="/timeline"/>

  const handleSignUp = (e) => {
    e.preventDefault();
    SignUp(email, password, username);
  }

  return (
    <section className="login">
      <div className="signup">
        <form onSubmit={handleSignUp}>
          <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="instagram"/>
          <input type="text" id="email" placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value) }}/>
          <input type="text" id="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }}/>
          <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }}/>
          <button type="submit">Sign Up</button>
          <span>Already have an account? <Link to="/signin">Sign In</Link> </span>
        </form>
      </div>
    </section>
  )
}

export default SignUp
