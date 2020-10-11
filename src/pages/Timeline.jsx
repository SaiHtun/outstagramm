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
import { ReactComponent as LoadingIcon } from '../assets/Spin-1s-200px.svg';
import { FaChevronUp } from 'react-icons/fa';

function Timeline( ) {
  const { authUser, closeProfile, users } = useContext(AuthContext);
  const { posts } = useContext(PostContext);

  const actualUsers = users && users.filter((user) => {
    return user.id !== authUser?.uid
  })

  let scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }
 
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
            <Link style={{ width: "50px"}} to={`profile/${user.username}`}>
              <div className="post__avater" style={user.imageURL? bgImg: null}>
                  { user.imageURL? null:user.username[0].toUpperCase()}
              </div>
            </Link>
            <p key={index} style={{cursor: "pointer"}} ><Link to={`profile/${user.username}`}>{ user.username }</Link></p>
          </div>
      )
    })
  ) : (
    <h3>No users</h3>
  );

  const footer = {
    // marginTop: "100px",
    height: "200px",
    width: "100%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }

  


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
          <div style={{ width: "100%", height: "100%", backgroundColor: "#fafafa", textAlign: "center"}}>
            <LoadingIcon style={{ width: "70px", height: "70px", marginTop: "150px"}}></LoadingIcon>
          </div>
        )}
      </div>
      { posts.length && 
         <footer style={footer}>
            <div style={{ cursor: "pointer", width: "40px", height: "40px", lineHeight: "40px"}} onClick={scrollTop}>
                <FaChevronUp></FaChevronUp>
            </div>
            <span>No More Posts</span>
         </footer>
      }
    </section>
  )
}

export default Timeline
