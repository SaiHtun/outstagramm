import React, { useContext, useEffect, useState } from 'react';
import Navbar from  '../components/Navbar';
import "./Profile.css";
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import ProfilePost from '../components/ProfilePost';
import { FaRegCommentDots, FaRegHeart, FaUserEdit  } from 'react-icons/fa';
import EditProfile from '../components/EditProfile';

function Profile() {
  const { closeProfile, authUser, dropProfilePanel } = useContext(AuthContext);
  const [ posts, setPosts ] = useState([]);
  const [ openDetail, setOpenDetail ] = useState(false);
  const [ post, setPost ] = useState({});
  const [ comments, setComments ] = useState([]);
  const [ likes, setLikes ] = useState([]);
  const [ showEdit, setShowEdit ] = useState(false);
  const [ user, setUser ] = useState([]);

  const closeEdit = () => {
    setShowEdit(false);
  }

  const handleOpenDetail = (postId, comments, likes) => {
    setOpenDetail(true);
    setComments(comments);
    setLikes(likes);
    setPost(posts.find((post) => post.id === postId ))
  }


  useEffect(() => {
    let unsubscribed = db.collection("users").where("id", "==", authUser.uid)
      .onSnapshot((snapshot) => {
        setUser(snapshot.docs.map((user) => {
          return {
            id: user.id,
            profile: user.data()
          }
        }))
      })  
      
    return () => {
      unsubscribed()
    }
  }, [authUser.uid])

  useEffect(() => {
    let unsubscribed = db.collection("posts").where("userId", "==", authUser.uid)
      .get()
      .then((res) => {
        setPosts(res.docs.map((post) => {
          return ({
            id: post.id,
            post: post.data()
          })
        }))
      return () => {
        unsubscribed()
      }
    }, [authUser.uid]);
  })
 
  const lists = posts.length > 0? (
    posts.map((post, index) => {
      return (
        <ProfilePost post={post} comments={comments} key={index} handleOpenDetail={handleOpenDetail}/>
      )
    })
  ) : (
    <h3>No Posts</h3>
  )

  const postComments = comments.length? (
    comments.map((comment, index) => {
     return (
       <div className="postComments" key={index}>
        <div className="post__avater">{ comment.username[0].toUpperCase()}</div>
        <p><strong style={{marginRight: "3px"}}>{ comment.username }</strong>{comment.comment}</p>
       </div>
     )
    })
  ) : (
    <span>No Comments</span>
  );

  const postLikes = likes.length? (
    likes.map((like, index) => {
      return (
        <strong style={{marginLeft: "5px"}} key={index}>{like.username},</strong>
      )
    })
  ) : (
    <span>No Likes</span>
  );
  // handle closeOverlay
  const closeOverlay = (e) => {
    if(e.target.className.includes("post__detail__overlay") || e.target.className.includes("close__post__detail")) {
      setOpenDetail(false);
    }
  }
  

  const bgImg = {
    backgroundImage: `url(${post.post?.imageURL})`,
    backgroundPosition: 'center',
    backgroundSize: "cover",
    width: "100%",
    height: "100%",
  }

  const img = {
    backgroundImage: `url(${user.length? user[0].profile.imageURL: "https://gamespot1.cbsistatic.com/uploads/scale_landscape/1595/15950357/3653677-dragon%20ball%20z%20kakarot.jpeg"})`,
    backgroundPosition: "center",
    backgroundSize: "cover"
  }

  const defaultImg = "https://gamespot1.cbsistatic.com/uploads/scale_landscape/1595/15950357/3653677-dragon%20ball%20z%20kakarot.jpeg";

  const Edit = showEdit? (
    <EditProfile closeEdit={closeEdit} showEdit={showEdit} user={user.length? user[0]: defaultImg} />
  ) : null;

  const name = user.length? (
    user[0].profile.username
  ) : ( authUser.displayName);


  const closed = (e) => {
    closeProfile(e);
    if(e.target.className !== "editProfile" && showEdit) {
      setShowEdit(false);
    };
  }

  return (
    <>
    <div onClick={closed}>
      <Navbar />
      <div className="profile">
        { Edit }
        <div className="profile__header">
          <div className="profile__image">
            <div className="profile__circle" style={img}>
            </div>
          </div>
          <div className="profile__info">
            <h3>{name}</h3>
            <p>{user.length? user[0].profile.bio : null}</p>
          </div>
          <div className="editProfile__icon">
            <FaUserEdit style={{fontSize: "1.5em", cursor: "pointer"}}
            onClick={() => { setShowEdit(!showEdit)}}/>
          </div>
        </div>
        <div className="profile__photo__grid">
        { lists }
        </div>
      </div>
      <div className="profile__footer">
        <p>Crafted by Sai</p>
      </div>
    </div>
    {/* post detail overlay */}
    <div className={`post__detail__overlay ${openDetail? "show__post__detail__overlay": null}`}
    onClick={(e) => closeOverlay(e)}>
      <p className="close__post__detail" onClick={(e) => closeOverlay(e)}>x</p>
      {/* actual post detail */}
      <div className="post__detail">
        <div className="post__detail__image" style={bgImg}></div>
        {/* post detail info */}
        <div className="post__detail__info">
          {/* post detail header */}
          <div className="post__detail__header">
            <div className="post__detail__avater">
              <div className="post__avater">{ post.post?.username[0].toUpperCase()}</div>
              <p style={{fontWeight: "bold"}}>{ post.post?.username}</p>
            </div>
            <p style={{marginLeft: "5px", overflow: "hidden"}}>{ post.post?.caption }</p>
          </div>
          {/* post detail comments */}
          <div className="post__detail__comments">
            { postComments }
          </div>
          {/* post detail likes */}
          <div className="post__detail__likes">
            <div className="post__detail__icons">
              <FaRegHeart className="post__heart__icon"/>
              <FaRegCommentDots className="post__comment__icon"/>
            </div>
            <p>{likes.length? "Liked by": null}
                { postLikes }
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}



export default Profile
