import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Image } from 'react-native';
import { useState,useEffect } from 'react';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import {
  initializeAuth,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  UserCredential,
  // getReactNativePersistence
} from 'firebase/auth';

// import { getReactNativePersistence } from 'firebase/auth/react-native';

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';


import{
  getStorage,
  ref,
  getDownloadURL
}from 'firebase/storage';
import Navigation from './Navigation';
// REASON TO USE ENVIRONMENT VARIABLES
// 1. Not uploading API keys / IDs of any sort into a repo
// 2. Data might change depending on your dev environment 
// -- api keys
// -- server URLs
// -- any other sort of credentials / validation 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJ2T1esPltnGM6Mk5lU8Dphi2lOGVBJ2Q",
  authDomain: "vetapp-e0d30.firebaseapp.com",
  projectId: "vetapp-e0d30",
  storageBucket: "vetapp-e0d30.appspot.com",
  messagingSenderId: "740226333197",
  appId: "1:740226333197:web:8add2cd237d4d36479b344"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });


export default function AppNavigation() {
  return(
    <Navigation/>
  );
} 

const Stack = createNativeStackNavigator();

export function App() {

  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const[name, setName] = useState("");
  const[breed, setBreed] = useState("");
  const [imageURL, setImageURL] = useState("");
  //target - get image URL from firebase to display it in the app
  //OPt 1 : use a simple route from bucket

  useEffect(() => {
    var puppyRef = ref(storage, "puppy.jpg");
    
    getDownloadURL(puppyRef).then((url) => {
      console.log("URL: " + url);
      setImageURL(url);
    }).catch((error) => {
      console.log("ERROR: " + error);
    });
  }, []); 

  onAuthStateChanged(auth, user => {
    if(user) {
      console.log("THE USER IS VALIDATED: " + user.email);
    } else {
      console.log("LOGGED OUT");
    }
  });

  return (
    <View style={styles.container}>
      <Text>Hi from App</Text>
      <StatusBar style="auto" />
      <TextInput
        placeholder='email'
        onChangeText={text => {
          setEmail(text);
        }}
      />
      <TextInput
        placeholder='password'
        secureTextEntry={true}
        onChangeText={text => {
          setPassword(text);
        }}
      />
      <Button 
        title="sign up"
        onPress={() => {
          // this method returns a Promise (as some async methods do)
          createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential : UserCredential) => {
            // this will run when the promise is solved
            console.log("USER: " + userCredential.user.email);
          })
          .catch((error : any) => {
            if(error.code == "auth/weak-password") {
              alert("THAT PASSWORD IS SUPER CRAPPY!");
            }
            console.log("ERROR: " + error.message +  " " + error.code);
          });
        }}
      />
      <Button 
        title="log in"
        onPress={() => {
          signInWithEmailAndPassword(auth, email, password)
          .then((userCredential : UserCredential) => {
            console.log(userCredential.user.email);
          })
          .catch((error : any) => {
            console.log("ERROR: " + error.message + " " + error.code);
          });
        }}
      />
      <Button 
        title="log out"
        onPress={() => {
          console.log("LOGGING OUT");
          auth.signOut();
        }}
      />
        <TextInput
          placeholder='name'
          onChangeText={text => {
            setName(text);
          }}
        />
        <TextInput
          placeholder='breed'
          onChangeText={text => {
            setBreed(text);
          }}
        />
        <Button 
          title="add"
          onPress={async () =>{

            try {

              // try code block
              // code that might be risky can be run within a try code block
              // risky means that it can raise an exception
              // intention is to deal with exceptions gracefully
              // (fail gracefully)
              // https://en.wikipedia.org/wiki/Graceful_exit

              // how is data arranged in firestore?
              // collection - is a set of documents
              // can think of it as a "table" in relational db
              // documents - think of them as rows in a table

              // get a reference to the collection
              var perritosCollection = collection(db, "perritos");

              const newDoc = await addDoc(
                perritosCollection,
                {
                  name: name,
                  breed: breed
                }
              );

              console.log("ID of the new perrito: " + newDoc.id);

            }catch(e){
              console.log("EXCEPTION WHEN TRYING TO ADD AN ANIMAL: " + e);
            }
          }}
        />
        <Button 
          title="get all"
          onPress={async () => {
            var snapshot = await getDocs(collection(db, "perritos"));
            snapshot.forEach(currentDocument => {
              console.log(currentDocument.data());
            });
          }}
        />
        <Button 
          title="query"
          onPress={async () =>{
            const perritos = collection(db, "perritos");
            const q = query(perritos, where("breed", "==", "pug"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              console.log(doc.id, " => ", doc.data());
            });
          }}
        />
        imageURL != "" ? 
        <Image source={{uri: imageURL}} 
        style={{width: 200, height: 200}}
        /> 
        :
        <Text>Loading image ...</Text>
      </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
