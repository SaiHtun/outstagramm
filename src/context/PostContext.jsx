import React, { createContext, useEffect, useState, useContext } from 'react';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';

export const PostContext = createContext();

function PostContextProvider(props) {
  const [ posts, setPosts ] = useState([]);
  const { authUser } = useContext(AuthContext)

  useEffect(() => {
    if(!authUser) return;
    let unsubscribed = db.collection('posts').orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map((item) => {
        return {
          id: item.id,
          post: item.data()
        }
      }))
    })
    return () => {
      unsubscribed()
    }
  }, [authUser])

  return (
    <PostContext.Provider value={{posts}}>
      {props.children}
    </PostContext.Provider>
  )
}

export default PostContextProvider
