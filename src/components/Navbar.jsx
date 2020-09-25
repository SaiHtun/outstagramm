import React, { useContext } from 'react';
import './Navbar.css';
import { FaUserCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import DropProfilePanel from './DropProfilePanel';
import "./DropProfilePanel.css";


function Navbar() {
 const { authUser, SignOut, toggleDropProfilePanel, user  } = useContext(AuthContext);
 const handleSignOut = () => {
  SignOut();
 }


 const name = user.user? user.user.username: authUser.displayName;
  return (
    <header className="main-header">
      <nav className="navbar">
        <div className="navbar__brand">
         <h1 className="logo">Outstagramm</h1>
        </div>
        <div className="navbar__btns">
          <h3 className="navbar__name" style={{color: "skyblue"}}>{ name }</h3>
          <div className="profileAndPanel">
            <div className="userCircle" onClick={toggleDropProfilePanel}>
              < FaUserCircle className="profileIcon"/>
            </div>
            <DropProfilePanel>
              <ul>
                <li><Link to={`/profile/${name}`}>Profile</Link></li>
                <li><Link to="/timeline">Timeline</Link></li>
                <li onClick={handleSignOut}><Link to="/signin">Log Out</Link></li>
              </ul>
            </DropProfilePanel>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
