import Navbar from '../components/Navbar';
import PostsPanel from '../components/PostsPanel';
import { AuthContext } from '../context/AuthContext';
import { Redirect, Link } from 'react-router-dom';
import React, { useContext } from 'react'
import PostForm from '../components/PostForm';
import { Route } from 'react-router-dom';
import EditPost from '../components/EditPost';
import "./Timeline.css";
import { PostContext } from '../context/PostContext';

function Timeline( ) {
  const { authUser, closeProfile, users } = useContext(AuthContext);
  const { posts } = useContext(PostContext);

  const actualUsers = users && users.filter((user) => {
    return user.id !== authUser?.uid
  })
 
  const usersList = actualUsers.length? (
    actualUsers.map((user, index) => {
      const bgImg = {
        backgroundImage: `url(${user.imageURL})`,
        backgroundPosition: 'center',
        backgroundSize: "cover",
        width: "40px",
        height: "40px",
        objectFit: "contains"
      }
      return (
          <div key={index} className="avater__name" style={{margin: "10px 0px"}}> 
            <div className="post__avater" style={user.imageURL? bgImg: null}>
              { user.imageURL? null:user.username[0].toUpperCase()}
            </div>
            <p key={index} style={{cursor: "pointer"}} ><Link to={`profile/${user.username}`}>{ user.username }</Link></p>
          </div>
      )
    })
  ) : (
    <h3>No users</h3>
  );

  if(!authUser) return <Redirect to="/signin"/>;


  return (
    <section className="timeline" onClick={(e) => { closeProfile(e) }}>
      <Route path="/timeline/posts/:id" component={EditPost} />
      <Navbar />
      <div className="hero container">
        { posts.length && users? (
          <>
            <div className="showcase">
              <PostForm />
              <PostsPanel />
            </div>
            <div className="users">
              <h3 style={{position: "fixed"}}>Suggested friends</h3>
              <div className="friends">
                  {usersList}
              </div>
            </div>
          </>
        ): (
          <div className="noPost"><iframe title="loading" src="https://giphy.com/embed/KG4PMQ0jyimywxNt8i" width="100px" height="100px" style={{ position:"absolute"}}frameBorder="0" className="giphy-embed" allowFullScreen></iframe></div>
        )}
      </div>
    </section>
  )
}

export default Timeline
