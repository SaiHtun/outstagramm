import React, { useContext } from 'react';
import './Navbar.css';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import DropProfilePanel from './DropProfilePanel';
import "./DropProfilePanel.css";


function Navbar() {
 const { SignOut, toggleDropProfilePanel, user  } = useContext(AuthContext);
 
 const handleSignOut = () => {
  SignOut();
 }

  const bgImg = {
    backgroundImage: `url(${user.user?.imageURL})`,
    backgroundPosition: 'center',
    backgroundSize: "cover",
    width: "40px",
    height: "40px",
    objectFit: "contains"
  }

  const defaultBg = {
    width: "40px",
    height: "40px",
    backgroundColor: "salmon",
    borderRadius: "50%",
  }

 const name = user.user? user.user.username: null;
  return (
    <header className="main-header">
      <nav className="navbar">
        <div className="navbar__brand">
         <h1 className="logo">Outstagramm</h1>
        </div>
        <div className="navbar__btns">
          <h3 className="navbar__name" style={{color: "skyblue"}}>{ name }</h3>
          <div className="profileAndPanel">
            <div className="userCircle" style={user.user?.imageURL? bgImg: defaultBg} onClick={toggleDropProfilePanel}>
            {user.user?.imageURL? null: <span style={{ lineHeight: "40px", pointerEvents: "none"}}>{ name? name[0].toUpperCase(): null }</span>}
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
