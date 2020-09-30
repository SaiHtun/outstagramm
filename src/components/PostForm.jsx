import React, { useState, useContext } from 'react';
import './PostForm.css';
import { FaImages } from 'react-icons/fa';
import firebase from 'firebase';
import { storage, db } from '../firebase';
import { AuthContext } from '../context/AuthContext';

function PostForm() {
  const [ caption, setCaption ] = useState("");
  const [ image, setImage ] =useState(null);
  const [ progress, setProgress ] = useState(null);
  const { authUser, user } = useContext(AuthContext);

  const handleImage =(e) => {
    if(e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }
  const handleUpload = (e) => {
    e.preventDefault()
    if(!caption || !image) return;

    const uploadImage = storage.ref(`images/${authUser.uid}/posts`).child(image.name).put(image);

    uploadImage.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress = Math.round( (snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        setProgress(uploadProgress)
      },
      (error) => {
        alert(error.message);
      },
      () => {
        storage.ref(`images/${authUser.uid}/posts`).child(image.name).getDownloadURL().then((url) => {
          // add to DB POST collections
          db.collection("posts").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            caption,
            imageURL: url,
            imageName: image.name,
            username: user.user.username,
            userId: authUser.uid
          });
          setProgress(null);
          setCaption("");
          setImage(null);
        })
      }

    )
  }


  return (
    <div className="postForm">
      <form className="form">
        <input type="text" name="caption" placeholder="Enter a caption" 
          onChange={(e) => { setCaption(e.target.value)}} value={caption}/>
        
          { progress > 0 && <progress className="progress" value={progress} max="100" />}
        <div className="image_btn">
          <input type="file" id="file"  onChange={handleImage}/>
          <label htmlFor="file"><FaImages className={`faImages ${image? "readyImg": null}`} /></label>
          <button className="postBtn" onClick={handleUpload} disabled={!caption || !image}>Post</button>
        </div>
      </form>
    </div>
  )
}

export default PostForm
