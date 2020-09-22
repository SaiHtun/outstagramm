import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import "./DropProfilePanel.css";

function DropProfilePanel(props) {
  const { dropProfilePanel } = useContext(AuthContext);


  return (
    <div className={`profile__dropPanel ${dropProfilePanel? "ggPanel": null}`}>
      {props.children}
    </div>
  )
}

export default DropProfilePanel
