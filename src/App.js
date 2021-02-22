import React, { useEffect, useRef, useState } from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import './App.css';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth)

  // if (user) {
  //   //// then
  // } else {
  //   /// else 
  // }

  // user ? then : else

  return (
    <div className="App">
      <h1>AUVMS Chatroom</h1>
      {user ?
        <div>
          <Chatroom />
          <SignOut />
        </div>
        : <SignIn />}

    </div>
  );
}

function Chatroom() {
  const messagesRef = firestore.collection('messages')
  const query = messagesRef
    .orderBy('createdAt', 'asc')
    .limitToLast(5)
  const [messages] = useCollectionData(query, { idField: 'id' })
  const [msg, setMsg] = useState('')

  // asynchronous function
  const sendMessage = async (e) => {
    e.preventDefault() // prevent unexpected input during this function execution

    // const displayName = auth.currentUser.displayName
    // const uid = auth.currentUser.uid
    // const photoURL = auth.currentUser.photoURL
    const { displayName, uid, photoURL } = auth.currentUser

    await messagesRef.add({
      user: displayName,
      body: msg,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: uid,
      photoURL: photoURL
    })

    setMsg('')
    // dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  const handleOnChange = (e) => {
    console.log(e.target.value)
    setMsg(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.charCode === 13) {
      // console.log("Enter is pressed.", e.target.value)
      if (e.target.value.trim() !== '') {
        sendMessage(e)
      }
    }
  }

  return (
    <div>
      <div>
        {messages && messages.map(m => <ChatMessage message={m} />)}
      </div>
      <input
        value={msg}
        onChange={handleOnChange}
        onKeyPress={handleKeyPress}
        placeholder="Say something" />
      <button onClick={sendMessage}>send</button>
    </div >
  )
}

function ChatMessage(props) {
  const { user, body, uid, photoURL, createdAt } = props.message
  return (
    <table>
      <tbody>
        <tr>
          <td rowSpan={2}>
            <img width="40" src={photoURL || 'https://i.imgur.com/rFbS5ms.png'} alt="{user}'s pfp" />
          </td>
          <td>{user}</td>
        </tr>
        <tr>
          <td>{body}</td>
        </tr>
      </tbody>
    </table >
  )
}

function SignOut() {
  // if (auth.currentUser)
  //   return (...)
  // else
  //   return ()

  return auth.currentUser && (
    <div>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <div>
      <button onClick={signInWithGoogle}>
      <img width="400" src="https://user-images.githubusercontent.com/1531669/41761219-0e0e4d80-7629-11e8-9663-aabe62025d57.png" alt="Sign in with Google" />
      </button>
    </div>
  )
}

export default App;



/* <img width="400" src="https://user-images.githubusercontent.com/1531669/41761219-0e0e4d80-7629-11e8-9663-aabe62025d57.png" alt="Sign in with Google" /> */