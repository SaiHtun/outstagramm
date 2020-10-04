import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import "./ProfilePost.css";
import { FaRegCommentDots, FaRegHeart  } from 'react-icons/fa';

function ProfilePost({post, handleOpenDetail}) {
  const [ comments, setComments ] = useState([]);
  const [ likes, setLikes ] = useState([]);
  const [ hover, setHover ] = useState(false);

  useEffect(() => {
    db.collection("posts").doc(post.id).collection("comments").orderBy("timestamp").onSnapshot((comments) => {
      setComments(comments.docs.map((comment) => {
        return comment.data();
      }))
    });

    db.collection("posts").doc(post.id).collection("likes").onSnapshot((likes) => {
      setLikes(likes.docs.map((like) => {
        return like.data();
      }))
    })
  }, [post.id])

  const bgImg = {
    backgroundImage: `url(${post.post?.imageURL})`,
    backgroundPosition: 'center',
    backgroundSize: "cover",
    width: "300px",
    height: "300px",
  }

  return (
    <>
      <div className="photo" style={bgImg} 
      onMouseEnter={() => { setHover(true)}}
      onMouseLeave={() => { setHover(false)}}
      onClick={() => { setHover(true)}}>
        <div className={`photo__overlay ${hover? "show__overlay": "up"}`}
        onClick={() => handleOpenDetail(post.id, comments, likes)}>
          <div className="heart">
            <FaRegHeart className="photo__likes"/>
            <p>{likes.length? likes.length: null}</p>
          </div>
          <div className="comments">
            <FaRegCommentDots className="photo__comments"/>
            <p>{comments.length? comments.length: null}</p>
          </div>
        </div>
      </div>
    </>
   )
}

export default ProfilePost
