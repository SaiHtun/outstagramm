import Navbar from '../components/Navbar';
import PostsPanel from '../components/PostsPanel';
import { AuthContext } from '../context/AuthContext';
import { Redirect } from 'react-router-dom';
import React, { useContext } from 'react'
import PostForm from '../components/PostForm';
import { Route } from 'react-router-dom';
import EditPost from '../components/EditPost';
import "./Timeline.css";

function Timeline( ) {
  const { authUser, closeProfile, users } = useContext(AuthContext);
  // fetch users collections
  

  const usersList = users.length? (
    users.map((user, index) => {
      return (
          <div key={index} className="avater__name" style={{margin: "10px 0px"}}> 
            <div className="post__avater">{ user.username[0].toUpperCase()}</div>
            <p key={index}>{ user.username }</p>
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
      </div>
    </section>
  )
}

export default Timeline
