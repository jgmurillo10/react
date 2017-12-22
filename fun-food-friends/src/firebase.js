import firebase from 'firebase';
const config = {
    apiKey: "AIzaSyAZZ2UaEfeU-eUxDor90fxCp4uex2PsszA",
    authDomain: "fun-food-friends-a8ffa.firebaseapp.com",
    databaseURL: "https://fun-food-friends-a8ffa.firebaseio.com",
    projectId: "fun-food-friends-a8ffa",
    storageBucket: "",
    messagingSenderId: "71448623504"
  };
firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;
