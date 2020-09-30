import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { PostContext } from '../context/PostContext'
import './EditProfile.css'
import { db, storage } from '../firebase'

function EditProfile(props) {
  const { authUser } = useContext(AuthContext)
  const { posts } = useContext(PostContext)
  const [profileImg, setProfileImg] = useState(null)
  const [path, setPath] = useState(null)
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [delay, setDelay] = useState(false)
  const { closeEdit, user, showEdit } = props

  const handleProfileImage = (e) => {
    if (e.target.files[0]) {
      setProfileImg(e.target.files[0])
      setPath(URL.createObjectURL(e.target.files[0]))
    }
  }

  useEffect(() => {
    setUsername(user.profile?.username)
    setBio(user.profile?.bio)
    setTimeout(() => {
      setDelay(true)
    }, 100)
  }, [user.profile])

  const img = {
    backgroundImage: `url(${
      path ? path : user.profile.imageURL ? user.profile.imageURL : user
    })`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  }
  // user old name
  let oldName = user.profile?.username
  // update profile
  const handleSave = async () => {
    if (!username && !bio && !profileImg) return

    if (username && bio && profileImg) {
      await storage
        .ref(`images/${authUser.uid}/profile`)
        .child(profileImg.name)
        .put(profileImg)
      let url = await storage
        .ref(`images/${authUser.uid}/profile`)
        .child(profileImg.name)
        .getDownloadURL()

      // let oldName = user.profile?.username;

      await db.collection('users').doc(user.id).update({
        imageURL: url,
        bio,
        username,
      })

      //  update Post Owner name
      posts.forEach(async ({ id, post }) => {
        if (post.username === oldName) {
          // update post owner name
          await db.collection('posts').doc(id).update({
            username: username,
          })
        }

        //  update post's comment's name
        let comments = await db
          .collection('posts')
          .doc(id)
          .collection('comments')
          .get()
        comments.forEach(async (comment) => {
          let data = comment.data()
          if (data.username === oldName) {
            await db
              .collection('posts')
              .doc(id)
              .collection('comments')
              .doc(comment.id)
              .update({ username: username })
          }
        })
      })
    } else if (username && bio) {
      await db.collection('users').doc(user.id).update({
        username,
        bio,
      })

      //  update Post Owner name
      posts.forEach(async ({ id, post }) => {
        if (post.username === oldName) {
          // update post owner name
          await db.collection('posts').doc(id).update({
            username: username,
          })
        }

        //  update post's comment's name
        let comments = await db
          .collection('posts')
          .doc(id)
          .collection('comments')
          .get()
        comments.forEach(async (comment) => {
          let data = comment.data()
          if (data.username === oldName) {
            await db
              .collection('posts')
              .doc(id)
              .collection('comments')
              .doc(comment.id)
              .update({ username: username })
          }
        })
      })
    } else if (username && profileImg){
      console.log(profileImg.name)
      await storage
        .ref(`images/${authUser.uid}/profile`)
        .child(profileImg.name)
        .put(profileImg)
      let url = await storage
        .ref(`images/${authUser.uid}/profile`)
        .child(profileImg.name)
        .getDownloadURL()
      await db.collection('users').doc(user.id).update({
        imageURL: url,
      })
    } else if (bio) {
      await db.collection('users').doc(user.id).update({
        bio,
      })
    } else if (username) {
      await db.collection('users').doc(user.id).update({
        username,
      })
      //  update Post Owner name
      posts.forEach(async ({ id, post }) => {
        if (post.username === oldName) {
          // update post owner name
          await db.collection('posts').doc(id).update({
            username: username,
          })
        }

        //  update post's comment's name
        let comments = await db
          .collection('posts')
          .doc(id)
          .collection('comments')
          .get()
        comments.forEach(async (comment) => {
          let data = comment.data()
          if (data.username === oldName) {
            await db
              .collection('posts')
              .doc(id)
              .collection('comments')
              .doc(comment.id)
              .update({ username: username })
          }
        })
      })
    }
    setUsername('')
    setBio('')
    setProfileImg(null)
    setPath('')
    setDelay(false)
    closeEdit()
  }

  const handleClose = () => {
    setUsername('')
    setBio('')
    setProfileImg(null)
    setPath('')
    setDelay(false)
    setTimeout(() => {
      closeEdit()
    }, 200)
  }

  return (
    <div
      className={`editProfile container ${showEdit && delay? 'showEditProfile' : null}`}
    >
      <div className='profile__header'>
        <div className='profile__image'>
          <div
            className={`profile__circle ${
              profileImg ? 'loadedProfileImage' : null
            }`}
            style={img}
          >
            <input
              type='file'
              name='file'
              id='file'
              onChange={(e) => {
                handleProfileImage(e)
              }}
            />
            <label className='profileLabel' htmlFor='file'>
              +Add Image
            </label>
          </div>
        </div>
        <div className='profile__info'>
          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
            }}
          />
          <input
            type='text'
            placeholder='Your Bio'
            value={bio}
            onChange={(e) => {
              setBio(e.target.value)
            }}
          />
          <button
            className='editProfile__btn'
            onClick={handleSave}
            disabled={!username && !profileImg && !bio}
          >
            Save
          </button>
          <span className='cancel' onClick={handleClose}>
            Cancel
          </span>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
