import React from 'react';

function DropPostPanel(props) {
  return (
    <div className={props.className}>
      <ul>
        {props.children}
      </ul>
    </div>
  )
}

export default DropPostPanel
