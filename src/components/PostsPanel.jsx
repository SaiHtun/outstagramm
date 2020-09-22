import React, { useContext } from 'react';
import Post from './Post';
import './PostsPanel.css';
import { PostContext } from '../context/PostContext';
function PostsPanel() {
  const { posts } = useContext(PostContext);

  return (
    <div className="postsPanel">
      {
        posts.length? posts.map((post) => {
          return (
            <Post post={post} key={post.id}/>
          )
        }) : <div className="noPost"><iframe title="loading" src="https://giphy.com/embed/KG4PMQ0jyimywxNt8i" width="100px" height="100px" style={{ position:"absolute"}}frameBorder="0" className="giphy-embed" allowFullScreen></iframe></div>
      }
    </div>
  )
}

export default PostsPanel


// const array  = [{
//   id: 1, name: "Gigi Hadid", caption: "This is my first instagram post", imageURL: "https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2017/04/instagram-logo-796x398.png"
// },
// {
//   id: 2, name: "Kris Wu",caption: "React is cool", imageURL: "https://www.freecodecamp.org/news/content/images/size/w2000/2020/02/Ekran-Resmi-2019-11-18-18.08.13.png"
// },
// {
//   id: 3, name: "MC Hotdog",caption: "Firebase backend services", imageURL: ""
// }]