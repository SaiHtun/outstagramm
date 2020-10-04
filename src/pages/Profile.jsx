import React, { useContext, useEffect, useState } from 'react';
import Navbar from  '../components/Navbar';
import "./Profile.css";
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import ProfilePost from '../components/ProfilePost';
import { FaRegCommentDots, FaRegHeart, FaUserEdit  } from 'react-icons/fa';
import EditProfile from '../components/EditProfile';

function Profile(props) {
  const { closeProfile, authUser, user } = useContext(AuthContext);
  const [ posts, setPosts ] = useState([]);
  const [ openDetail, setOpenDetail ] = useState(false);
  const [ post, setPost ] = useState({});
  const [ comments, setComments ] = useState([]);
  const [ likes, setLikes ] = useState([]);
  const [ showEdit, setShowEdit ] = useState(false);
  const [ reUser, setReUser ] = useState([]);

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
    if(user.user?.username !== props.match.params.username ) {
      if( props.match.params.username !== user.user?.username ) {
        let unsubscribed = db.collection("users").where("username", "==", props.match.params.username)
          .onSnapshot((snapshot) => {
            let data = snapshot.docs[0].data();
            setReUser({
              id: snapshot.docs[0].id,
              user: data
            })
          })  
          
        return () => {
          unsubscribed()
        }
      }    
    } else {
        let unsubscribed = db.collection("users").where("id", "==", user.user?.id)
          .onSnapshot((snapshot) => {
            let data = snapshot.docs[0].data();
            setReUser({
              id: snapshot.docs[0].id,
              user: data
            })
          })  
          
        return () => {
          unsubscribed()
        }
      }    
  }, [props])

  useEffect(() => {
    if(user.user?.username !== props.match.params.username) {
      let unsubscribed = db.collection("posts").where("username", "==", props.match.params.username)
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
      });
    } else {
      let unsubscribed = db.collection("posts").where("userId", "==", user.user?.id)
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
      });
    }
  }, [props, user])
 
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
        <p><strong style={{margin: "5px"}}>{ comment.username }</strong>{comment.comment}</p>
       </div>
     )
    })
  ) : (
    <span style={{ marginLeft: "5px"}}>No Comments</span>
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
    backgroundImage: `url(${reUser.user? reUser.user?.imageURL: "https://gamespot1.cbsistatic.com/uploads/scale_landscape/1595/15950357/3653677-dragon%20ball%20z%20kakarot.jpeg"})`,
    backgroundPosition: "center",
    backgroundSize: "cover"
  }

  const defaultImg = "https://gamespot1.cbsistatic.com/uploads/scale_landscape/1595/15950357/3653677-dragon%20ball%20z%20kakarot.jpeg";

  const changeParam = (username) => {
    props.history.push({
      pathname: `/profile/${username}`
    })
  }

  const Edit = showEdit? (
    <EditProfile closeEdit={closeEdit} showEdit={showEdit} user={reUser.user? reUser: defaultImg} change={changeParam}/>
  ) : null;

  const name = reUser.user? (
    reUser.user.username
  ) : ( authUser.displayName);


  // const handleClose = (e) => {
  //   setShowEdit(false);
  // }

  const profileImg = {
    backgroundImage: `url(${reUser.user && reUser.user?.imageURL? reUser.user.imageURL: null})`,
    backgroundPosition: 'center',
    backgroundSize: "cover",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "contains"
  }

  const handleClose = (e) => {
    closeProfile(e);
    if(!showEdit) return;
    if(e.target.className !== "editProfile"
      && e.target.className !== "profile__header"
      && e.target.className !== "profile__image"
      && e.target.className !== "profile__info"
      && e.target.className !== "profileLabel"
      && e.target.className !== "profile__circle"
      && e.target.type !== "text"
      && e.target.type !== "file") {
        setShowEdit(false);
      }
  }

  

  return (
    <>
    <div onClick={handleClose} >
      <Navbar />
      <div className="profile">
        { Edit }
        <div className="profile__header" >
          <div className="profile__image">
            <div className="profile__circle" style={img}>
            </div>
          </div>
          <div className="profile__info">
            <h3>{name}</h3>
            <p>{reUser.user? reUser.user.bio : null}</p>
          </div>
          { reUser.user && reUser.user.id === authUser.uid? (
            <div className="editProfile__icon">
              <FaUserEdit style={{fontSize: "1.5em", cursor: "pointer"}}
              onClick={() => { setShowEdit(!showEdit)}}/>
            </div>
          ): (
            <div style={{ marginRight: "150px"}}></div>
          )}
        </div>
        <div className="profile__photo__grid" >
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
              { reUser.user && reUser.user?.imageURL? (
                <div style={profileImg}></div>
              ): (
                <div className="post__avater">{ post.post?.username[0].toUpperCase()}</div>
              )}
              <p style={{fontWeight: "bold", marginLeft: "10px"}}>{ post.post?.username}</p>
            </div>
            <p style={{margin: "5px", overflow: "hidden"}}>{ post.post?.caption }</p>
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
