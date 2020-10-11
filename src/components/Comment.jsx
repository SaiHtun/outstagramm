import React, { useState, useContext, useEffect } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import DropPostPanel from './DropPostPanel';
import './Comment.css';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';

const Comment = (props) => {
  const { comment,postId, commentId, owner } = props;
  const [ dropCommentPanel, setDropCommentPanel ] = useState(false);
  const { closePanel, togglePostPanel } = useContext(AuthContext);
  const [ newComment, setNewComment ] = useState("");
  const [ editComment, setEditComment ] = useState(false);

  const handleToggle = () => {
    setDropCommentPanel(!dropCommentPanel);
  }

  useEffect(() => {
    setNewComment(comment.comment);
  }, [comment])

  useEffect(() => {
    if(closePanel) {
      setDropCommentPanel(false);
    }
  }, [closePanel])

  useEffect(() => {
    if(dropCommentPanel) {
      togglePostPanel();
    }
  }, [ togglePostPanel, dropCommentPanel ])

  const handleDelete = () => {
    db.collection("posts").doc(postId).collection("comments").doc(commentId).delete();
  }

  const handleEdit = () => {
    setDropCommentPanel(false);
    setEditComment(!editComment);
  }

  const editSave = (e) => {
    e.preventDefault();
    if(newComment) {
      db.collection("posts").doc(postId).collection("comments").doc(commentId).set({
        ...comment,
        comment: newComment
      })
      setEditComment(false);
    }
  }

  const commentDots = owner === "postOwner" || owner === "commentOwner"? (
    <div className="commentDots">
      <FaEllipsisH className={`comment__dots ${ dropCommentPanel? "show__dots": null}`}/>
      <DropPostPanel className={`comment__dropPanel ${dropCommentPanel && !editComment? "showCommentPanel": null}`} >
        <li onClick={ handleEdit }>Edit</li>
        <li onClick={ handleDelete }>Delete</li>
      </DropPostPanel>
    </div>
  ): null;

  const handleCancel = () => {
    setEditComment(false);
    setDropCommentPanel(false);
  }
 

  return (
    <div className={`comment ${owner === "postOwner" || owner === "commentOwner"? "pointer": null}`}  >
        { editComment? (
          <>
            <form className="addCommentForm" onSubmit={ editSave }>
              <strong>{ comment.username }</strong>
              <input className="commentInput" 
              type="text" value={newComment} onChange={(e) => { setNewComment(e.target.value)}} autoFocus/>
              <div className="btn">
                <span style={{ color: "red", zIndex: "1"}} onClick={ handleCancel }>Cancel</span>
                <button style={{ padding: "5px 8px",
                 fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  color: "teal",
                  backgroundColor: "white"}}>Save</button>
              </div>
            </form>
          </>
        ):(
          <p className="commentInfo" onClick={ handleToggle }><strong style={{textTransform: "lowercase"}}>{ comment.username }</strong> {comment.comment}</p>
        )}
        { !editComment? commentDots: null }
    </div>
  )
}

export default Comment
