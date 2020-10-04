import React, { useState, useContext, useEffect } from 'react';
import './Post.css';
import { db, storage } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { FaEllipsisH } from 'react-icons/fa';
import { IoIosHeartEmpty, IoIosHeart } from 'react-icons/io'
import firebase from 'firebase';
import DropPostPanel from './DropPostPanel';
import { Link } from 'react-router-dom';
import Comment from './Comment';
// nested route

function Post( { post } ) {
  const [ comment, setComment ] = useState("");
  const [ comments, setComments ] = useState([]);
  const { authUser, closePanel, togglePostPanel, user } = useContext(AuthContext);
  const [ dropPanel, setDropPanel ] = useState(false);
  const [ liked, setLiked ] = useState(false);
  const [ likesCount, setLikesCount ] = useState(0);
  const [ avater, setAvater ] = useState("");

  useEffect(() => {
    let unsubscribed = db.collection("posts").doc(post.id).collection("comments").orderBy("timestamp").onSnapshot((snapshot) => {
      setComments(snapshot.docs.map((comment) => { 
        return {
          commentId: comment.id,
          comment: comment.data()
        } 
      }))
    })
    return () => {
      unsubscribed()
    }
  }, [post.id])
  // close/up panel listener
  useEffect(() => {
    if(closePanel) {
      setDropPanel(false);
    }
    // return () => {
    //   setDropPanel(true);
    // };
  }, [closePanel])
  //  liked listener 
  useEffect(() => {
    db.collection("posts").doc(post.id).collection("likes").get().then((likes) => {
        setLikesCount(likes.docs.length);
        let liked = likes.docs.find((like) => like.data().userId === user.id);
        if(liked) setLiked(true);
      })
    
  }, [liked, post.id, user.id])

  //  get avater
  useEffect(() => {
   db.collection('users').where("id", "==", post.post.userId).get().then((user) => setAvater(user.docs[0].data()))

   return () => {
     setAvater(null);
   }
  }, [post])

  // name
  const name = user.user? user.user.username: authUser.displayName;

  const AddComment = (e) => {
    e.preventDefault();
    if(!comment) return;
    db.collection("posts").doc(post.id).collection("comments").add({
      comment, 
      username: name? name: authUser.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userId: authUser.uid
    })
      .catch((err) => alert(err.message))
    setComment("");
  }

  const commentsList = comments && comments.map(({commentId, comment}) => {
    if(authUser.uid === post.post.userId) {
      return (
        <Comment key={commentId} postId={post.id} comment={comment} commentId={commentId} owner="postOwner"/>
      )
    }else if(authUser.uid !== post.post.userId && authUser.uid === comment.userId) {
      return (
        <Comment key={commentId} postId={post.id} comment={comment} commentId={commentId} owner="commentOwner"/>
      )
    }else {
      return (
        <Comment key={commentId} postId={post.id} comment={comment} commentId={commentId}/>
      )
    }
  
  })
 

  // toggle panel
  const handelToggle = () => {
    setDropPanel(!dropPanel);
    togglePostPanel()
  }
  // add like
  const addLike = () => {
    db.collection("posts").doc(post.id).collection("likes")
      .get()
      .then((likes) => {
        const liked = likes.docs.find((like) => {
          return like.data().userId === user?.id
        })
        if(!liked) {
          db.collection("posts").doc(post.id).collection("likes").add({
            userId: user.id,
            username: user.user?.username
          }).then(() => {
            setLiked(true);
          })
          return
        }
        db.collection("posts").doc(post.id).collection("likes")
          .doc(liked.id)
          .delete()
          .then(() => {
            setLiked(false);
          })
      })
  }
  // full heart or outline heart
  const heart = liked?<IoIosHeart className="fullHeart" onClick={addLike}/> : <IoIosHeartEmpty className="outlineHeart" onClick={addLike}/>

   // handle delete
  const handleDelete = () => {
  db.collection("posts").doc(post.id).collection("comments").get()
    .then((comments) => {
      comments.forEach((doc) => {
        db.collection("posts").doc(post.id).collection("comments").doc(doc.id).delete();
      });
    }).then(() => {
      db.collection("posts").doc(post.id).collection("likes").get()
      .then((likes) => {
        likes.forEach((like) => db.collection("posts").doc(post.id).collection("likes").doc(like.id).delete())
      })
    }).then(() => {
        db.collection("posts").doc(post.id).delete();
    }).then(() => {
        storage.ref(`images/${authUser.uid}/posts`).child(post.post.imageName).delete();
    }).then(() => alert("deleted successfully.."))
      .catch((err) => alert(err.message));
  }

  
  // dots or empty <div>
  const dots = authUser.uid === post.post.userId? (
    <>
      <div className="dots" onClick={handelToggle}>
        <FaEllipsisH className="dot"/>
      </div>
      <DropPostPanel className={`post__dropPanel ${dropPanel? "ggPanel": null}`}>
        <li><Link to={`/timeline/posts/${post.id}`}>Edit</Link></li>
        <li onClick={handleDelete}>Delete</li>
      </DropPostPanel>
      {/* <DropPostPanel dropPanel={dropPanel}>
        <li><Link to={`/timeline/posts/${post.id}`}>Edit</Link></li>
        <li onClick={handleDelete}>Delete</li>
      </DropPostPanel> */}
    </>
  ) : (
    <div></div>
  );


  let img = {
    backgroundImage: `url(${avater?.imageURL})`,
    backgroundPosition: 'center',
    backgroundSize: "cover",
    width: "40px",
    height: "40px",
    objectFit: "contains"
  }
  

  return (
    <>
      <div className="post">
        <div className="post__header">
          <div className="avater__name">
            <div className="post__avater" style={avater? img: null}><Link to={`profile/${post.post.username}`}>{ avater?.imageURL? null:post.post.username[0].toUpperCase()}</Link></div>
            <p className="displayName"><Link to={`profile/${post.post.username}`}>{ post.post.username }</Link></p>
          </div>
          <div className="dots">
            { dots }
          </div>
        </div>
        <div className="post__image">
          <img src={ post.post.imageURL } alt="#"/>
          <div className="post__menu__bar">
            { heart }
            <p>{ likesCount > 0? likesCount: null} { likesCount <= 1? "Like": "Likes"}</p>
          </div>
          <p className="post__caption"><strong style={{textTransform: "lowercase"}}>{ post.post.username }</strong> { post.post.caption }</p>
          { commentsList }
          <form onSubmit={AddComment} className="commentForm">
            <input type="text" placeholder="Add comment" value={comment} onChange={(e) => {setComment(e.target.value)}}/>
            <button type="submit" disabled={!comment}>Add</button>
          </form>
        </div>
      </div>
    </>
  )
}
export default Post
