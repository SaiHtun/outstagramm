let oldName = user.profile.username;

      await db.collection("users").doc(user.id).update({
        imageURL: url,
        bio,
        username
      })


      db.collection('posts').onSnapshot((snapshot) => {
        snapshot.docs.forEach(async (doc) => {
          let post = await db.collection('posts').doc(doc.id).get();
          //  update
          if(post.username !== oldName) return;
          db.collection('posts').doc(doc.id).update({
            username: username
          })
        })
      })