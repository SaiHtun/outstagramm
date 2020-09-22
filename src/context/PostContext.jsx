import React, { createContext, useEffect, useState } from 'react';
import { db } from '../firebase';

export const PostContext = createContext();

function PostContextProvider(props) {
  const [ posts, setPosts ] = useState([]);

  useEffect(() => {
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
  }, [])

  return (
    <PostContext.Provider value={{posts}}>
      {props.children}
    </PostContext.Provider>
  )
}

export default PostContextProvider
