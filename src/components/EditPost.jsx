import React, { useState, useEffect, useContext } from 'react';
import "./EditPost.css";
import { db, storage } from '../firebase';
import { AuthContext } from '../context/AuthContext';

function Edit(props) {
  const { authUser } = useContext(AuthContext)
  const [ caption, setCaption ] = useState("");
  const [ image, setImage ] = useState(null);
  const [ path, setPath ] = useState(null);
  const [ post, setPost ] = useState({});
  const [ cross, setCross] = useState(false);
  const [ newCross, setNewCross] = useState(true);
  const [ overlay, setOverlay ] = useState(false);

  useEffect(() => {
      const unsubscribed = db.collection("posts").doc(props.match.params.id).onSnapshot((snapshot) => {
      setPost({
        id: snapshot.id,
        post: snapshot.data()
      })
    })
    return () => {
      unsubscribed()
    };
  }, [props, post]);

  const handleImage =(e) => {
    if(e.target.files[0]) {
      setNewCross(true);
      setImage(e.target.files[0])
      setPath(URL.createObjectURL(e.target.files[0]));
    };
  }

  const deleteExistingPic = () => {
    setOverlay(false);
    setCross(true)
  };
  const deleteAddedPic = () => {
    setOverlay(false);
    setNewCross(false);
  }
  const BackToTimeline = (e) => {
    if(e.target.className === "edit") {
      props.history.push('/timeline');
    }
  }

  const update = async () => {
    // console.log("caption", caption);
    // console.log("image", image);
    // return;
    if(caption && image) {
      try {
        await storage.ref(`images/${authUser.uid}/posts`).child(post.post.imageName).delete();
        await storage.ref(`images/${authUser.uid}/posts`).child(image.name).put(image);
        const url = await storage.ref(`images/${authUser.uid}/posts`).child(image.name).getDownloadURL();
        await db.collection("posts").doc(post.id).set({
          ...post.post,
          caption,
          imageURL: url,
          imageName: image.name
        })
        props.history.push('/timeline');
        return;
      } catch (error) {
        alert(error.message);
      }
    } else if(caption) {
      await db.collection("posts").doc(post.id).set({
        ...post.post,
        caption
      })
      props.history.push('/timeline');
      return;
    } else if(image) {
      await storage.ref(`images/${authUser.uid}/posts`).child(post.post.imageName).delete();
      await storage.ref(`images/${authUser.uid}/posts`).child(image.name).put();
      const url = await storage.ref(`images/${authUser.uid}/posts`).child(image.name).getDownloadURL();
      await db.collection("posts").doc(post.id).set({
        ...post.post,
        imageURL: url,
        imageName: image.name
      })
      props.history.push('/timeline');
      return;
    }
    props.history.push('/timeline')
  }

  const bgImg = {
    backgroundImage: `url(${post.post?.imageURL})`,
    backgroundPosition: 'center',
    backgroundSize: "cover",
    width: "180px",
    height: "180px",
  }
  const bgNewImage = {
    backgroundImage: `url(${path? path: null})`,
    backgroundPosition: 'center',
    backgroundSize: "cover",
    width: "180px",
    height: "180px",
  }

  return (
    <div className="edit" onClick={(e) => { BackToTimeline(e) }}>
      <div className="edit__panel">
        <div className="edit__nav">Edit Post</div>
        <div className="edit__info">
          <div className="edit__avater">{ post.post?.username[0].toUpperCase()}</div>
          <input type="text" placeholder={post.post?.caption} onChange={(e)=> { setCaption(e.target.value)}} value={caption}/>
        </div>
        <div className="edit__image">
          <div className="edit__image__label">
            <input id="file" type="file" onChange={handleImage}/>
            <label htmlFor="file">+New Image</label>
          </div>
          { cross? null : <>
           <div className="bgImage" style={bgImg}
           onMouseEnter={() => setOverlay(true)}
           />
           <div className={`bgImageOverlay ${overlay? "showBgImageOverlay": null}`}
           onMouseLeave={() => setOverlay(false)}><p className="edit__delete_btn" onClick={deleteExistingPic}>X</p></div>
            </>}         
          { newCross && image? <><div className="bgNewImage" style={bgNewImage}
           onMouseEnter={() => setOverlay(true)}/>
          <div className={`bgImageOverlay ${overlay? "showBgImageOverlay": null}`}
           onMouseLeave={() => setOverlay(false)}><p className="edit__delete_btn" onClick={deleteAddedPic}>X</p></div></>: null}         
        </div>
        <div className="edit__footer">
          <button onClick={update}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default Edit
