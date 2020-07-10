const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { ResultStorage } = require("firebase-functions/lib/providers/testLab");



admin.initializeApp();

const express = require('express');
const app = express();

var firebaseConfig = {
  apiKey: "AIzaSyDmahf902seIOzpocbagOixdSFYJmSLF94",
  authDomain: "chotto-matte.firebaseapp.com",
  databaseURL: "https://chotto-matte.firebaseio.com",
  projectId: "chotto-matte",
  storageBucket: "chotto-matte.appspot.com",
  messagingSenderId: "381171707829",
  appId: "1:381171707829:web:3d5c5ad15314f4fc1ef3fc"
};

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

app.get('/alltuturu',(req, res) => {
  admin
    .firestore()
    .collection('tuturu')
    .orderBy('createdAt','desc')
    .get()
    .then((data) => {
      let tuturus = [];
      data.forEach((doc) => {
        tuturus.push({
          tuturuId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(tuturus);
    })
    .catch((err) => console.error(err));
});

app.post('/createTuturu', (req, res) => {

  const newTuturu = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  admin.firestore() 
    .collection('tuturu')
    .add(newTuturu)
    .then(doc => {
      res.json({message: `document ${doc.id} created successfully`})
    })
    .catch(err => {
      res.status(500).json({error: 'something went wrong'})
      console.error(err);
    })
});

//signup route
app.post('/signup' , (req,res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userHandle: req.body.userHandle
  };

  //TODO: validate data

  firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password)
  .then(data => {
    return res.status(201).json({message: `user ${data.user.uid} signed up successfuly`})
  })
  .catch(err => {
    console.error(err);
    return res.status(500).json({error: err.code});
  })
}) 


exports.api = functions.region('europe-west3').https.onRequest(app);
 